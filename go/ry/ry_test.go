package ry

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"regexp"
	"strings"
	"sync"
	"testing"
	"time"

	"go.uber.org/goleak"

	runyard "github.com/runyard-ai/runyard-sdk/go"
)

// The package starts no goroutine of its own, and a stream it opened is
// closed by the time its call returns.
func TestMain(m *testing.M) { goleak.VerifyTestMain(m) }

// stub is a server a test says the answers of, route by route, and what it
// was asked.
type stub struct {
	t   *testing.T
	mux *http.ServeMux
	url string

	mu   sync.Mutex
	asks []ask
}

// ask is a request the stub was sent: its route, query, bearer and body.
type ask struct {
	method, path, query, auth string
	body                      map[string]any
}

func newStub(t *testing.T) *stub {
	t.Helper()
	s := &stub{t: t, mux: http.NewServeMux()}
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		a := ask{method: r.Method, path: r.URL.Path, query: r.URL.RawQuery, auth: r.Header.Get("Authorization")}
		if raw, _ := io.ReadAll(r.Body); len(raw) > 0 {
			if err := json.Unmarshal(raw, &a.body); err != nil {
				t.Errorf("%s %s: a body not JSON: %s", r.Method, r.URL.Path, raw)
			}
		}
		s.mu.Lock()
		s.asks = append(s.asks, a)
		s.mu.Unlock()
		s.mux.ServeHTTP(w, r)
	}))
	t.Cleanup(server.Close)
	s.url = server.URL
	return s
}

// on answers pattern (http.ServeMux's) with status and body.
func (s *stub) on(pattern string, status int, body string) {
	s.mux.HandleFunc(pattern, func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(status)
		_, _ = io.WriteString(w, body)
	})
}

// asked is every request the stub was sent, in order.
func (s *stub) asked() []ask {
	s.mu.Lock()
	defer s.mu.Unlock()
	return append([]ask(nil), s.asks...)
}

// client is a Client of the stub, with key "ryak_k".
func (s *stub) client() *Client {
	s.t.Helper()
	c, err := New(s.url, "ryak_k")
	if err != nil {
		s.t.Fatal(err)
	}
	return c
}

// session is a session as the API answers it.
func session(id string, lastSeq int64, extra string) string {
	return fmt.Sprintf(`{"id":%q,"title":"T","owner":"app:acme-app","state":"idle","config":{},"sandbox":{"state":"ready"},`+
		`"lineage":{"rootId":%[1]q,"depth":0},"labels":{"team":"a"},"work":{},"usage":{},"firstSeq":1,"lastSeq":%d,`+
		`"createdAt":"2026-11-19T10:00:00Z","lastActivityAt":"2026-11-19T11:00:00Z"%s}`, id, lastSeq, extra)
}

// as is v as a T, or the test's failure.
func as[T any](t *testing.T, v any) T {
	t.Helper()
	got, ok := v.(T)
	if !ok {
		t.Fatalf("%#v is not a %T", v, got)
	}
	return got
}

func apiCode(t *testing.T, err error, code runyard.ErrorCode) {
	t.Helper()
	if !runyard.IsCode(err, code) {
		t.Errorf("%v, want an APIError of %s", err, code)
	}
}

const forbidden = `{"error":{"code":"forbidden","message":"no"}}`

func TestNewSpeaksWithItsKeyThroughItsHTTPClient(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions/{id}", http.StatusOK, session("s1", 0, ""))
	via := &counting{}
	c, err := New(s.url, "ryak_k", WithHTTPClient(via))
	if err != nil {
		t.Fatal(err)
	}
	if _, err := c.Session("s1").Info(t.Context()); err != nil {
		t.Fatal(err)
	}
	if via.n != 1 {
		t.Errorf("the HTTP client made %d requests", via.n)
	}
	if got := s.asked()[0].auth; got != "Bearer ryak_k" {
		t.Errorf("Authorization %q", got)
	}
	if c.API() == nil {
		t.Error("no generated client beneath")
	}
}

type counting struct{ n int }

func (c *counting) Do(r *http.Request) (*http.Response, error) {
	c.n++
	return http.DefaultClient.Do(r)
}

func TestStartSaysOnlyWhatItWasGiven(t *testing.T) {
	s := newStub(t)
	s.on("POST /v1/sessions", http.StatusCreated, session("s1", 0, ""))
	c := s.client()
	got, err := c.Start(t.Context(), Start{})
	if err != nil || got.ID() != "s1" {
		t.Fatalf("%v %v", got, err)
	}
	if body := s.asked()[0].body; len(body) != 0 {
		t.Errorf("an empty Start sent %v", body)
	}
}

func TestStartSendsEveryField(t *testing.T) {
	s := newStub(t)
	s.on("POST /v1/sessions", http.StatusCreated, session("s1", 0, ""))
	harness, title := "codex", "overwritten"
	_, err := s.client().Start(t.Context(), Start{
		Profile: "support", Title: "Ticket 42", Text: "Summarize ticket #42",
		EndUser: &EndUser{ID: "u123", Email: "alice@acme.example"}, Labels: map[string]string{"ticket": "42"},
		Spec: runyard.SessionSpec{Harness: &harness, Title: &title},
	})
	if err != nil {
		t.Fatal(err)
	}
	body := s.asked()[0].body
	if body["profileId"] != "support" || body["title"] != "Ticket 42" || body["harness"] != "codex" {
		t.Errorf("%v", body)
	}
	if u := as[map[string]any](t, body["endUser"]); u["id"] != "u123" || u["email"] != "alice@acme.example" {
		t.Errorf("endUser %v", u)
	}
	if l := as[map[string]any](t, body["labels"]); l["ticket"] != "42" || len(l) != 1 {
		t.Errorf("labels %v", l)
	}
	first := as[map[string]any](t, body["firstTurn"])
	if first["text"] != "Summarize ticket #42" || !regexp.MustCompile(`^ry-[0-9a-f]{16}$`).MatchString(as[string](t, first["turnId"])) {
		t.Errorf("firstTurn %v", first)
	}
}

func TestStartOfAnEndUserWithoutAnAddressSendsNone(t *testing.T) {
	s := newStub(t)
	s.on("POST /v1/sessions", http.StatusCreated, session("s1", 0, ""))
	if _, err := s.client().Start(t.Context(), Start{EndUser: &EndUser{ID: "u1"}}); err != nil {
		t.Fatal(err)
	}
	if u := as[map[string]any](t, s.asked()[0].body["endUser"]); len(u) != 1 || u["id"] != "u1" {
		t.Errorf("endUser %v", u)
	}
}

func TestStartFoundAgainIsTheSessionItMade(t *testing.T) {
	s := newStub(t)
	s.on("POST /v1/sessions", http.StatusOK, session("s1", 7, ""))
	got, err := s.client().Start(t.Context(), Start{})
	if err != nil || got.ID() != "s1" {
		t.Fatalf("%v %v", got, err)
	}
	// Made by an earlier call, its turns may have ended since: Reply asks
	// where its transcript is, as a fresh handle's does, rather than read
	// a turn that ended before as the one under way.
	if _, known := got.cursor(); known {
		t.Error("a session found again reads from its start")
	}
}

func TestStartRefusedIsTheServersError(t *testing.T) {
	s := newStub(t)
	s.on("POST /v1/sessions", http.StatusForbidden, forbidden)
	_, err := s.client().Start(t.Context(), Start{EndUser: &EndUser{ID: "u1"}})
	apiCode(t, err, runyard.ErrorCodeForbidden)
}

func TestStartAnsweredWithNoSessionIsAnError(t *testing.T) {
	s := newStub(t)
	s.on("POST /v1/sessions", http.StatusAccepted, `{}`)
	_, err := s.client().Start(t.Context(), Start{})
	var e *runyard.APIError
	if !errors.As(err, &e) || e.Status != http.StatusAccepted {
		t.Errorf("%v", err)
	}
}

func TestStartUnreachableIsAnError(t *testing.T) {
	c, err := New("http://127.0.0.1:1", "k")
	if err != nil {
		t.Fatal(err)
	}
	if _, err := c.Start(t.Context(), Start{}); err == nil {
		t.Error("started on nothing")
	}
}

func TestInfoIsTheSessionAsItIs(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions/{id}", http.StatusOK, session("s1", 3, `,"endUser":{"id":"u1","email":"a@acme.example"}`))
	got, err := s.client().Session("s1").Info(t.Context())
	if err != nil {
		t.Fatal(err)
	}
	want := time.Date(2026, 11, 19, 11, 0, 0, 0, time.UTC)
	if got.ID != "s1" || got.Title != "T" || got.State != runyard.SessionStateIdle || got.Labels["team"] != "a" ||
		got.EndUser == nil || *got.EndUser != (EndUser{ID: "u1", Email: "a@acme.example"}) ||
		!got.LastActivityAt.Equal(want) || got.CreatedAt.IsZero() || got.Raw.LastSeq != 3 {
		t.Errorf("%+v", got)
	}
}

func TestInfoOfNoSessionIsNotFound(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions/{id}", http.StatusNotFound, `{"error":{"code":"not_found","message":"no"}}`)
	_, err := s.client().Session("gone").Info(t.Context())
	apiCode(t, err, runyard.ErrorCodeNotFound)
}

func TestInfoAnsweredWithNoSessionIsAnError(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions/{id}", http.StatusNoContent, ``)
	if _, err := s.client().Session("s1").Info(t.Context()); err == nil {
		t.Error("no session, and no error")
	}
}

func TestDelete(t *testing.T) {
	s := newStub(t)
	s.on("DELETE /v1/sessions/s1", http.StatusNoContent, ``)
	s.on("DELETE /v1/sessions/s2", http.StatusForbidden, forbidden)
	c := s.client()
	if err := c.Session("s1").Delete(t.Context()); err != nil {
		t.Error(err)
	}
	apiCode(t, c.Session("s2").Delete(t.Context()), runyard.ErrorCodeForbidden)
}

func TestSessionsReadsEveryPage(t *testing.T) {
	s := newStub(t)
	s.mux.HandleFunc("GET /v1/sessions", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.URL.Query().Get("cursor") == "" {
			_, _ = fmt.Fprintf(w, `{"items":[%s,%s],"changeSeq":1,"nextCursor":"c2"}`, session("s1", 0, ""), session("s2", 0, ""))
			return
		}
		_, _ = fmt.Fprintf(w, `{"items":[%s],"changeSeq":1}`, session("s3", 0, ""))
	})
	got, err := s.client().Sessions(t.Context(), List{EndUser: "u1", Labels: map[string]string{"z": "1", "a": "2"}, Archived: true})
	if err != nil {
		t.Fatal(err)
	}
	if len(got) != 3 || got[0].ID != "s1" || got[2].ID != "s3" {
		t.Errorf("%+v", got)
	}
	asked := s.asked()
	if len(asked) != 2 || asked[0].query != "archived=true&endUser=u1&label=a%3D2&label=z%3D1" ||
		!strings.Contains(asked[1].query, "cursor=c2") {
		t.Errorf("%+v", asked)
	}
}

func TestSessionsOfNoneAsksForEverySession(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions", http.StatusOK, `{"items":[],"changeSeq":0}`)
	got, err := s.client().Sessions(t.Context(), List{})
	if err != nil || len(got) != 0 {
		t.Fatalf("%v %v", got, err)
	}
	if q := s.asked()[0].query; q != "" {
		t.Errorf("asked %q", q)
	}
}

func TestSessionsStopsAtACursorAnsweredAgain(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions", http.StatusOK, fmt.Sprintf(`{"items":[%s],"changeSeq":1,"nextCursor":"c"}`, session("s1", 0, "")))
	got, err := s.client().Sessions(t.Context(), List{})
	if err != nil || len(got) != 2 || len(s.asked()) != 2 {
		t.Fatalf("%d sessions in %d pages: %v", len(got), len(s.asked()), err)
	}
}

func TestSessionsStopsAtAnEmptyCursor(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions", http.StatusOK, `{"items":[],"changeSeq":1,"nextCursor":""}`)
	if _, err := s.client().Sessions(t.Context(), List{}); err != nil || len(s.asked()) != 1 {
		t.Fatalf("%d pages: %v", len(s.asked()), err)
	}
}

func TestSessionsFailingHalfwayIsTheError(t *testing.T) {
	s := newStub(t)
	s.mux.HandleFunc("GET /v1/sessions", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.URL.Query().Get("cursor") == "" {
			_, _ = fmt.Fprintf(w, `{"items":[%s],"changeSeq":1,"nextCursor":"c2"}`, session("s1", 0, ""))
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		_, _ = io.WriteString(w, `{"error":{"code":"bad_request","message":"cursor"}}`)
	})
	got, err := s.client().Sessions(t.Context(), List{})
	apiCode(t, err, runyard.ErrorCodeBadRequest)
	if got != nil {
		t.Errorf("a list with an error: %v", got)
	}
}

func TestSessionsAnsweredWithNoPageIsAnError(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions", http.StatusNoContent, ``)
	if _, err := s.client().Sessions(t.Context(), List{}); err == nil {
		t.Error("no page, and no error")
	}
}

func TestTokenIsMintedForItsEndUser(t *testing.T) {
	s := newStub(t)
	s.on("POST /v1/sessions/{id}/tokens", http.StatusCreated,
		`{"token":"ryst_x","sessionId":"s1","endUser":{"id":"u1","email":"a@acme.example"},"expiresAt":"2026-11-19T12:00:00Z"}`)
	got, err := s.client().Session("s1").Token(t.Context(), TokenOptions{EndUser: &EndUser{ID: "u1", Email: "a@acme.example"}, TTL: 90*time.Minute + 500*time.Millisecond})
	if err != nil {
		t.Fatal(err)
	}
	if got.Value != "ryst_x" || got.SessionID != "s1" || got.EndUser == nil || got.EndUser.ID != "u1" ||
		!got.ExpiresAt.Equal(time.Date(2026, 11, 19, 12, 0, 0, 0, time.UTC)) {
		t.Errorf("%+v", got)
	}
	a := s.asked()[0]
	if a.path != "/v1/sessions/s1/tokens" || a.body["ttlSeconds"] != float64(5400) || as[map[string]any](t, a.body["endUser"])["email"] != "a@acme.example" {
		t.Errorf("%+v", a)
	}
}

func TestTokenOfNothingLeavesTheServerItsDefaults(t *testing.T) {
	s := newStub(t)
	s.on("POST /v1/sessions/{id}/tokens", http.StatusCreated, `{"token":"ryst_x","sessionId":"s1","expiresAt":"2026-11-19T12:00:00Z"}`)
	got, err := s.client().Session("s1").Token(t.Context(), TokenOptions{})
	if err != nil || got.EndUser != nil {
		t.Fatalf("%+v %v", got, err)
	}
	if body := s.asked()[0].body; len(body) != 0 {
		t.Errorf("sent %v", body)
	}
}

// Under a minute is refused before the server is asked: under a second
// would be sent as 0, which reads as the default and is not.
func TestTokenOfATTLTheServerRefusesIsErrTokenTTL(t *testing.T) {
	for _, ttl := range []time.Duration{time.Nanosecond, 500 * time.Millisecond, 59 * time.Second, -time.Minute} {
		s := newStub(t)
		if _, err := s.client().Session("s1").Token(t.Context(), TokenOptions{TTL: ttl}); !errors.Is(err, ErrTokenTTL) || !strings.Contains(err.Error(), ttl.String()) {
			t.Errorf("%v: %v", ttl, err)
		}
		if len(s.asked()) != 0 {
			t.Errorf("%v: asked %+v", ttl, s.asked())
		}
	}
}

func TestTokenOfAMinuteIsSent(t *testing.T) {
	s := newStub(t)
	s.on("POST /v1/sessions/{id}/tokens", http.StatusCreated, `{"token":"ryst_x","sessionId":"s1","expiresAt":"2026-11-19T12:00:00Z"}`)
	if _, err := s.client().Session("s1").Token(t.Context(), TokenOptions{TTL: time.Minute}); err != nil {
		t.Fatal(err)
	}
	if got := s.asked()[0].body["ttlSeconds"]; got != float64(60) {
		t.Errorf("ttlSeconds %v", got)
	}
}

func TestTokenRefusedIsTheServersError(t *testing.T) {
	s := newStub(t)
	s.on("POST /v1/sessions/{id}/tokens", http.StatusNotImplemented, `{"error":{"code":"not_implemented","message":"later"}}`)
	_, err := s.client().Session("s1").Token(t.Context(), TokenOptions{})
	apiCode(t, err, runyard.ErrorCodeNotImplemented)
}

func TestTokenAnsweredWithNoTokenIsAnError(t *testing.T) {
	s := newStub(t)
	s.on("POST /v1/sessions/{id}/tokens", http.StatusOK, `{}`)
	if _, err := s.client().Session("s1").Token(t.Context(), TokenOptions{}); err == nil {
		t.Error("no token, and no error")
	}
}

func TestTurnErrorSaysWhy(t *testing.T) {
	if got := (&TurnError{TurnID: "t1", StopReason: "interrupted"}).Error(); got != "ry: turn t1 ended: interrupted" {
		t.Error(got)
	}
	if got := (&TurnError{TurnID: "t1", StopReason: "error", Message: "boom"}).Error(); got != "ry: turn t1 ended: error: boom" {
		t.Error(got)
	}
}

func TestTurnGoneSaysWhy(t *testing.T) {
	if got := (&TurnGoneError{TurnID: "t1", Why: takenOut}).Error(); got != "ry: turn t1 was never started: "+takenOut {
		t.Error(got)
	}
}

func TestTurnIDsDiffer(t *testing.T) {
	if a, b := turnID(), turnID(); a == b {
		t.Errorf("%s twice", a)
	}
}
