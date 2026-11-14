package relay

import (
	"bufio"
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"net/url"
	"slices"
	"strings"
	"sync"
	"testing"
	"time"

	openapi_types "github.com/oapi-codegen/runtime/types"
	"go.uber.org/goleak"

	runyard "github.com/runyard-ai/runyard-sdk/go"
)

// The relay starts no goroutine of its own, and a stream it relayed, ended,
// leaves none.
func TestMain(m *testing.M) { goleak.VerifyTestMain(m) }

const (
	ada   = "ada@example.com"
	grace = "grace@example.com"
	key   = "ryak_the_key"
)

// asked is a request runyard-agents was asked, as it was asked.
type asked struct {
	Method, Path string
	Query        url.Values
	Header       http.Header
	Body         string
}

// upstream is runyard-agents, as the tests stand it in: sessions it knows,
// read back as they are, and what else a test answers by hand.
type upstream struct {
	t        *testing.T
	url      string
	mu       sync.Mutex
	asked    []asked
	sessions map[string]string
	routes   map[string]http.HandlerFunc
}

func newUpstream(t *testing.T) *upstream {
	t.Helper()
	u := &upstream{t: t, sessions: map[string]string{}, routes: map[string]http.HandlerFunc{}}
	server := httptest.NewServer(http.HandlerFunc(u.serve))
	t.Cleanup(server.Close)
	u.url = server.URL
	return u
}

func (u *upstream) serve(w http.ResponseWriter, r *http.Request) {
	body, _ := io.ReadAll(r.Body)
	u.mu.Lock()
	u.asked = append(u.asked, asked{Method: r.Method, Path: r.URL.EscapedPath(), Query: r.URL.Query(), Header: r.Header.Clone(), Body: string(body)})
	h, ok := u.routes[r.Method+" "+r.URL.EscapedPath()]
	session, known := u.sessions[strings.TrimPrefix(r.URL.Path, "/v1/sessions/")]
	u.mu.Unlock()
	switch {
	case ok:
		r.Body = io.NopCloser(bytes.NewReader(body))
		h(w, r)
	case r.Method == http.MethodGet && strings.HasPrefix(r.URL.Path, "/v1/sessions/") && known:
		answer(w, http.StatusOK, session)
	case r.Method == http.MethodGet && strings.HasPrefix(r.URL.Path, "/v1/sessions/") && strings.Count(r.URL.Path, "/") == 3:
		answer(w, http.StatusNotFound, `{"error":{"code":"not_found","message":"no such session"}}`)
	default:
		answer(w, http.StatusOK, `{"ok":true}`)
	}
}

// session is a session of owner's with labels, known to runyard-agents.
func (u *upstream) session(id, owner string, labels map[string]string) {
	raw, err := json.Marshal(map[string]any{"id": id, "owner": owner, "labels": labels, "title": "t-" + id, "state": "idle"})
	if err != nil {
		u.t.Fatal(err)
	}
	u.mu.Lock()
	defer u.mu.Unlock()
	u.sessions[id] = string(raw)
}

func (u *upstream) on(route string, h http.HandlerFunc) {
	u.mu.Lock()
	defer u.mu.Unlock()
	u.routes[route] = h
}

// last is the last request of method and path asked, and false when there
// was none.
func (u *upstream) last(method, path string) (asked, bool) {
	u.mu.Lock()
	defer u.mu.Unlock()
	for _, a := range slices.Backward(u.asked) {
		if a.Method == method && a.Path == path {
			return a, true
		}
	}
	return asked{}, false
}

func (u *upstream) count() int {
	u.mu.Lock()
	defer u.mu.Unlock()
	return len(u.asked)
}

func answer(w http.ResponseWriter, status int, body string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, _ = io.WriteString(w, body)
}

// whom is a Person hook that reads the caller from a header the tests set,
// as a program reads its own cookie.
func whom(r *http.Request) (Person, error) {
	if e := r.Header.Get("X-Test-Person"); e != "" {
		return Person{Email: e}, nil
	}
	return Person{}, errors.New("not signed in")
}

// app is a program's scope: a person's own sessions of the app.
func app(_ *http.Request, p Person) (Scope, error) {
	return Scope{Owner: p.Email, Labels: map[string]string{"app.user": p.Email}}, nil
}

// relayOf is a relay of u, with cfg's hooks; its URL, Key and Person are
// filled in when cfg leaves them out.
func relayOf(t *testing.T, u *upstream, cfg Config) *httptest.Server {
	t.Helper()
	if cfg.URL == "" {
		cfg.URL = u.url
	}
	if cfg.Key == "" {
		cfg.Key = key
	}
	if cfg.Person == nil {
		cfg.Person = whom
	}
	h, err := New(cfg)
	if err != nil {
		t.Fatal(err)
	}
	s := httptest.NewServer(http.StripPrefix("/agents", h))
	t.Cleanup(s.Close)
	return s
}

// do is the browser's request, as person (none when empty), and its answer,
// read.
func do(t *testing.T, s *httptest.Server, person, method, path, body string) (int, http.Header, string) {
	t.Helper()
	res := open(t, s, person, method, path, body)
	defer func() { _ = res.Body.Close() }()
	raw, err := io.ReadAll(res.Body)
	if err != nil {
		t.Fatal(err)
	}
	return res.StatusCode, res.Header, string(raw)
}

// open is the browser's request, its answer not read yet.
func open(t *testing.T, s *httptest.Server, person, method, path, body string) *http.Response {
	t.Helper()
	var reader io.Reader
	if body != "" {
		reader = strings.NewReader(body)
	}
	req, err := http.NewRequestWithContext(t.Context(), method, s.URL+"/agents"+path, reader)
	if err != nil {
		t.Fatal(err)
	}
	if person != "" {
		req.Header.Set("X-Test-Person", person)
	}
	res, err := s.Client().Do(req)
	if err != nil {
		t.Fatal(err)
	}
	return res
}

// code is the error code of a runyard-agents error body.
func code(t *testing.T, body string) runyard.ErrorCode {
	t.Helper()
	var e runyard.Error
	if err := json.Unmarshal([]byte(body), &e); err != nil {
		t.Fatalf("%q is not an error: %v", body, err)
	}
	return e.Error.Code
}

func TestNewRefusesWhatItCannotRelayWith(t *testing.T) {
	for name, cfg := range map[string]Config{
		"no URL":             {Key: key, Person: whom},
		"no key":             {URL: "https://a.example", Person: whom},
		"no person":          {URL: "https://a.example", Key: key},
		"not a URL":          {URL: "::", Key: key, Person: whom},
		"not http":           {URL: "ftp://a.example", Key: key, Person: whom},
		"no host":            {URL: "https://", Key: key, Person: whom},
		"sign-in, no person": {URL: "https://a.example", Key: key, Person: whom, SignIn: &SignIn{}},
	} {
		if _, err := New(cfg); err == nil {
			t.Errorf("%s: no error", name)
		}
	}
}

func TestACallerIsWhomPersonSays(t *testing.T) {
	u := newUpstream(t)
	s := relayOf(t, u, Config{Person: func(r *http.Request) (Person, error) {
		switch r.Header.Get("X-Test-Person") {
		case "":
			return Person{}, errors.New("no cookie")
		case "banned":
			return Person{}, Refuse(http.StatusForbidden, runyard.ErrorCodeForbidden, "banned")
		case "nameless":
			return Person{}, nil
		}
		return Person{Email: r.Header.Get("X-Test-Person")}, nil
	}})
	for person, want := range map[string]int{"": 401, "banned": 403, "nameless": 401} {
		status, _, body := do(t, s, person, http.MethodGet, "/v1/sessions", "")
		if status != want || code(t, body) == "" {
			t.Errorf("%q: %d %s", person, status, body)
		}
	}
	if u.count() != 0 {
		t.Errorf("runyard-agents was asked %d times for nobody", u.count())
	}
}

func TestAScopeItCannotMakeIsRefused(t *testing.T) {
	u := newUpstream(t)
	s := relayOf(t, u, Config{Scope: func(_ *http.Request, p Person) (Scope, error) {
		switch p.Email {
		case "plain@example.com":
			return Scope{}, errors.New("the database is down")
		case "said@example.com":
			return Scope{}, Refuse(http.StatusPaymentRequired, runyard.ErrorCodeQuotaExceeded, "pay")
		}
		return Scope{Labels: map[string]string{"a": "b"}}, nil
	}})
	for person, want := range map[string]int{"plain@example.com": 500, "said@example.com": 402, ada: 500} {
		if status, _, body := do(t, s, person, http.MethodGet, "/v1/sessions", ""); status != want {
			t.Errorf("%s: %d %s", person, status, body)
		}
	}
	if u.count() != 0 {
		t.Errorf("asked %d", u.count())
	}
}

func TestOnlyTheRoutesItKnowsAreRelayed(t *testing.T) {
	u := newUpstream(t)
	u.session("s1", ada, nil)
	s := relayOf(t, u, Config{})
	for _, route := range [][2]string{
		{http.MethodGet, "/v1/runners"},
		{http.MethodGet, "/v1/users"},
		{http.MethodPut, "/v1/sessions/s1"},
		{http.MethodGet, "/v1/sessions/s1/terminal"},
		{http.MethodPut, "/v1/sessions/s1/files/content"},
		{http.MethodPost, "/v1/sessions/s1/fork"},
		{http.MethodGet, "/v1/providers"}, // without SignIn
		{http.MethodGet, "/v2/sessions"},
	} {
		status, _, body := do(t, s, ada, route[0], route[1], "")
		if status != http.StatusNotFound || code(t, body) != runyard.ErrorCodeNotFound {
			t.Errorf("%s %s: %d %s", route[0], route[1], status, body)
		}
	}
	if u.count() != 0 {
		t.Errorf("asked %d", u.count())
	}
}

func TestListIsOfTheScopeOnly(t *testing.T) {
	u := newUpstream(t)
	u.on("GET /v1/sessions", func(w http.ResponseWriter, _ *http.Request) {
		// One of somebody else's, and one without the label, as a
		// runyard-agents that did not filter would answer.
		answer(w, http.StatusOK, `{"items":[
			{"id":"mine","owner":"ADA@example.com","labels":{"app.user":"ada@example.com","x":"y"},"extra":{"kept":true}},
			{"id":"theirs","owner":"grace@example.com","labels":{"app.user":"ada@example.com"}},
			{"id":"unlabelled","owner":"ada@example.com","labels":{}},
			"not a session"
		],"nextCursor":"c2"}`)
	})
	s := relayOf(t, u, Config{Scope: app})
	status, _, body := do(t, s, ada, http.MethodGet, "/v1/sessions?owner=grace@example.com&whose=all&limit=5&cursor=c1&archived=false&state=idle&state=failed&label=x%3Dy", "")
	if status != http.StatusOK {
		t.Fatalf("%d %s", status, body)
	}
	var page struct {
		Items      []map[string]any `json:"items"`
		NextCursor string           `json:"nextCursor"`
	}
	if err := json.Unmarshal([]byte(body), &page); err != nil {
		t.Fatal(err)
	}
	if len(page.Items) != 1 || page.Items[0]["id"] != "mine" || page.Items[0]["extra"] == nil || page.NextCursor != "c2" {
		t.Errorf("%s", body)
	}
	a, _ := u.last(http.MethodGet, "/v1/sessions")
	q := a.Query
	if q.Get("owner") != ada || q.Has("whose") || q.Get("limit") != "5" || q.Get("cursor") != "c1" || q.Get("archived") != "false" ||
		!slices.Equal(q["state"], []string{"idle", "failed"}) || !slices.Equal(q["label"], []string{"x=y", "app.user=" + ada}) {
		t.Errorf("asked %v", q)
	}
	if a.Header.Get("Authorization") != "Bearer "+key {
		t.Errorf("authorization %q", a.Header.Get("Authorization"))
	}
}

func TestListAnswersWhatRunyardAgentsAnswered(t *testing.T) {
	u := newUpstream(t)
	s := relayOf(t, u, Config{})
	u.on("GET /v1/sessions", func(w http.ResponseWriter, _ *http.Request) {
		answer(w, http.StatusBadRequest, `{"error":{"code":"bad_request","message":"limit"}}`)
	})
	if status, _, body := do(t, s, ada, http.MethodGet, "/v1/sessions", ""); status != 400 || code(t, body) != runyard.ErrorCodeBadRequest {
		t.Errorf("%d %s", status, body)
	}
	for _, unreadable := range []string{`[1]`, `{"items":3}`} {
		u.on("GET /v1/sessions", func(w http.ResponseWriter, _ *http.Request) { answer(w, http.StatusOK, unreadable) })
		if status, _, body := do(t, s, ada, http.MethodGet, "/v1/sessions", ""); status != http.StatusBadGateway || code(t, body) != runyard.ErrorCodeUpstreamError {
			t.Errorf("%s: %d %s", unreadable, status, body)
		}
	}
}

func TestStartIsTheScopesWhateverTheBrowserSays(t *testing.T) {
	u := newUpstream(t)
	u.on("POST /v1/sessions", func(w http.ResponseWriter, _ *http.Request) {
		answer(w, http.StatusCreated, `{"id":"new","owner":"ada@example.com","labels":{"app.user":"ada@example.com"},"title":"Hi"}`)
	})
	var started []runyard.Session
	ids := 0
	s := relayOf(t, u, Config{
		Scope: app,
		NewID: func() string { ids++; return "turn-1" },
		Start: func(_ *http.Request, _ Person, spec *runyard.SessionSpec) error {
			profile, owner := "chat", openapi_types.Email(grace)
			spec.ProfileId = &profile
			// What Start may not change: the scope's.
			spec.Owner = &owner
			(*spec.Labels)["app.user"] = grace
			(*spec.Labels)["app.org"] = "o1"
			parent := "elsewhere"
			spec.ParentId = &parent
			return nil
		},
		Turn: func(_ *http.Request, p Person, turn *runyard.Turn) error {
			provider := "claude-" + p.Email
			turn.Provider = &provider
			return nil
		},
		Started: func(_ *http.Request, _ Person, s runyard.Session) { started = append(started, s) },
	})
	req, _ := http.NewRequestWithContext(t.Context(), http.MethodPost, s.URL+"/agents/v1/sessions",
		strings.NewReader(`{"title":"Hi","autoTitle":false,"firstTurn":{"text":"hello","mode":"plan"}}`))
	req.Header.Set("X-Test-Person", ada)
	req.Header.Set("Idempotency-Key", "k1")
	res, err := s.Client().Do(req)
	if err != nil {
		t.Fatal(err)
	}
	raw, _ := io.ReadAll(res.Body)
	_ = res.Body.Close()
	if res.StatusCode != http.StatusCreated || !strings.Contains(string(raw), `"id":"new"`) {
		t.Fatalf("%d %s", res.StatusCode, raw)
	}
	a, _ := u.last(http.MethodPost, "/v1/sessions")
	var spec map[string]any
	if err := json.Unmarshal([]byte(a.Body), &spec); err != nil {
		t.Fatal(err)
	}
	labels, _ := spec["labels"].(map[string]any)
	first, _ := spec["firstTurn"].(map[string]any)
	if spec["owner"] != ada || labels["app.user"] != ada || labels["app.org"] != "o1" || spec["parentId"] != nil ||
		spec["profileId"] != "chat" || spec["title"] != "Hi" || spec["autoTitle"] != false {
		t.Errorf("started %s", a.Body)
	}
	if first["text"] != "hello" || first["mode"] != "plan" || first["turnId"] != "turn-1" || first["provider"] != "claude-"+ada {
		t.Errorf("first turn %v", first)
	}
	if a.Header.Get("Idempotency-Key") != "k1" || a.Header.Get("Content-Type") != "application/json" {
		t.Errorf("headers %v", a.Header)
	}
	if len(started) != 1 || started[0].Id != "new" {
		t.Errorf("started %v", started)
	}
}

func TestStartRefusesWhatIsNotTheBrowsersToSay(t *testing.T) {
	u := newUpstream(t)
	s := relayOf(t, u, Config{})
	for _, body := range []string{
		`{"owner":"grace@example.com"}`,
		`{"labels":{"a":"b"}}`,
		`{"profileId":"admin"}`,
		`{"firstTurn":{"text":"x","provider":"theirs"}}`,
		`{"title":`,
		`[]`,
	} {
		if status, _, got := do(t, s, ada, http.MethodPost, "/v1/sessions", body); status != 400 || code(t, got) != runyard.ErrorCodeBadRequest {
			t.Errorf("%s: %d %s", body, status, got)
		}
	}
	if u.count() != 0 {
		t.Errorf("asked %d", u.count())
	}
}

func TestStartWithNoBodyIsTheScopes(t *testing.T) {
	u := newUpstream(t)
	u.on("POST /v1/sessions", func(w http.ResponseWriter, _ *http.Request) { answer(w, http.StatusCreated, `{"id":"new"}`) })
	s := relayOf(t, u, Config{Start: func(_ *http.Request, _ Person, spec *runyard.SessionSpec) error {
		spec.Labels = nil
		return nil
	}})
	if status, _, body := do(t, s, ada, http.MethodPost, "/v1/sessions", ""); status != http.StatusCreated {
		t.Fatalf("%d %s", status, body)
	}
	a, _ := u.last(http.MethodPost, "/v1/sessions")
	if a.Body != `{"labels":{},"owner":"ada@example.com"}` {
		t.Errorf("%s", a.Body)
	}
}

func TestStartRefusedIsNotStarted(t *testing.T) {
	u := newUpstream(t)
	u.on("POST /v1/sessions", func(w http.ResponseWriter, _ *http.Request) {
		answer(w, http.StatusConflict, `{"error":{"code":"spec_conflict","message":"no"}}`)
	})
	var started int
	var log bytes.Buffer
	s := relayOf(t, u, Config{
		Log:     slog.New(slog.NewTextHandler(&log, nil)),
		Started: func(*http.Request, Person, runyard.Session) { started++ },
		Scope: func(_ *http.Request, p Person) (Scope, error) {
			return Scope{Owner: p.Email, NoStart: p.Email == grace}, nil
		},
		Start: func(r *http.Request, _ Person, _ *runyard.SessionSpec) error {
			switch r.URL.Query().Get("why") {
			case "said":
				return Refuse(http.StatusPaymentRequired, runyard.ErrorCodeQuotaExceeded, "pay first")
			case "failed":
				return errors.New("the database is down")
			}
			return nil
		},
		Turn: func(r *http.Request, _ Person, _ *runyard.Turn) error {
			if r.URL.Query().Get("why") == "turn" {
				return Refuse(http.StatusBadRequest, runyard.ErrorCodeBadRequest, "no turns")
			}
			return nil
		},
	})
	for _, tc := range []struct {
		person, query string
		status        int
		code          runyard.ErrorCode
	}{
		{grace, "", 403, runyard.ErrorCodeForbidden},
		{ada, "?why=said", 402, runyard.ErrorCodeQuotaExceeded},
		{ada, "?why=failed", 500, runyard.ErrorCodeInternal},
		{ada, "?why=turn", 400, runyard.ErrorCodeBadRequest},
		{ada, "", 409, runyard.ErrorCodeSpecConflict},
	} {
		status, _, body := do(t, s, tc.person, http.MethodPost, "/v1/sessions"+tc.query, `{"firstTurn":{"text":"x"}}`)
		if status != tc.status || code(t, body) != tc.code {
			t.Errorf("%s%s: %d %s", tc.person, tc.query, status, body)
		}
	}
	if started != 0 {
		t.Errorf("started %d", started)
	}
	if !strings.Contains(log.String(), "the database is down") {
		t.Errorf("log %q", log.String())
	}
	u.on("POST /v1/sessions", func(w http.ResponseWriter, _ *http.Request) { answer(w, http.StatusCreated, `{"id":`) })
	if status, _, body := do(t, s, ada, http.MethodPost, "/v1/sessions", ""); status != http.StatusBadGateway || started != 0 {
		t.Errorf("unreadable: %d %s", status, body)
	}
}

func TestASessionOfAnybodyElsesIsNotFound(t *testing.T) {
	u := newUpstream(t)
	u.session("mine", ada, map[string]string{"app.user": ada})
	u.session("theirs", grace, map[string]string{"app.user": ada})
	u.session("unlabelled", ada, nil)
	u.session("relabelled", ada, map[string]string{"app.user": grace})
	s := relayOf(t, u, Config{Scope: app})

	status, _, body := do(t, s, ada, http.MethodGet, "/v1/sessions/mine", "")
	if status != 200 || !strings.Contains(body, `"title":"t-mine"`) {
		t.Errorf("mine: %d %s", status, body)
	}
	for _, id := range []string{"theirs", "unlabelled", "relabelled", "missing"} {
		for _, route := range [][2]string{
			{http.MethodGet, ""}, {http.MethodPatch, ""}, {http.MethodDelete, ""},
			{http.MethodPost, "/archive"}, {http.MethodPost, "/restore"},
			{http.MethodGet, "/events?follow=true"}, {http.MethodPost, "/turns"}, {http.MethodPost, "/interrupt"},
			{http.MethodPost, "/rewind"},
			{http.MethodDelete, "/queue/t1"}, {http.MethodPatch, "/queue/t1"},
			{http.MethodPut, "/queue/t1/hold"}, {http.MethodDelete, "/queue/t1/hold"}, {http.MethodPost, "/queue/t1/interrupt"},
			{http.MethodGet, "/attachments/u1"}, {http.MethodGet, "/files?path=/"}, {http.MethodGet, "/files/content?path=/a"},
			{http.MethodGet, "/subagents"}, {http.MethodGet, "/subagents/a1"},
		} {
			status, _, body := do(t, s, ada, route[0], "/v1/sessions/"+id+route[1], `{"text":"x"}`)
			if status != http.StatusNotFound || code(t, body) != runyard.ErrorCodeNotFound {
				t.Errorf("%s %s%s: %d %s", route[0], id, route[1], status, body)
			}
		}
	}
	// What was asked of runyard-agents is whose each is, and nothing else.
	u.mu.Lock()
	defer u.mu.Unlock()
	for _, a := range u.asked {
		if a.Method != http.MethodGet || strings.Count(a.Path, "/") != 3 {
			t.Errorf("asked %s %s", a.Method, a.Path)
		}
	}
}

func TestASessionOfTheScopeIsRelayed(t *testing.T) {
	u := newUpstream(t)
	u.session("s 1", ada, nil)
	var turned []string
	s := relayOf(t, u, Config{Turn: func(_ *http.Request, _ Person, turn *runyard.Turn) error {
		turned = append(turned, turn.Text)
		model := "opus"
		turn.Model = &model
		return nil
	}})
	const sp = "/v1/sessions/s%201"
	for _, tc := range []struct {
		method, path, body string
		upstream           string // the path runyard-agents is asked, when it is not path
		query              url.Values
		sent               string
	}{
		{method: http.MethodPatch, path: sp, body: `{"title":"New","pinned":true}`, sent: `{"pinned":true,"title":"New"}`},
		{method: http.MethodDelete, path: sp},
		{method: http.MethodPost, path: sp + "/archive"},
		{method: http.MethodPost, path: sp + "/restore"},
		{method: http.MethodPost, path: sp + "/turns", body: `{"turnId":"t9","text":"hi","mode":"plan"}`, sent: `{"mode":"plan","model":"opus","text":"hi","turnId":"t9"}`},
		{method: http.MethodPost, path: sp + "/interrupt", body: `{"dropQueued":true}`, sent: `{"dropQueued":true}`},
		{method: http.MethodPost, path: sp + "/interrupt", sent: `{}`},
		{method: http.MethodPost, path: sp + "/rewind", body: `{"toSeq":12}`, sent: `{"toSeq":12}`},
		{method: http.MethodDelete, path: sp + "/queue/t%2F1"},
		{method: http.MethodPatch, path: sp + "/queue/t%2F1", body: `{"text":"edited"}`, sent: `{"text":"edited"}`},
		{method: http.MethodPut, path: sp + "/queue/t1/hold"},
		{method: http.MethodDelete, path: sp + "/queue/t1/hold"},
		{method: http.MethodPost, path: sp + "/queue/t1/interrupt"},
		{method: http.MethodGet, path: sp + "/attachments/u1?x=1"},
		{method: http.MethodGet, path: sp + "/files?path=%2Fwork&depth=9", query: url.Values{"path": {"/work"}}},
		{method: http.MethodGet, path: sp + "/files/content?path=%2Fa.png", query: url.Values{"path": {"/a.png"}}},
		{method: http.MethodGet, path: sp + "/subagents"},
		{method: http.MethodGet, path: sp + "/subagents/a1"},
		{method: http.MethodGet, path: sp + "/events?follow=true&from=4&subagent=a1&owner=x", query: url.Values{"follow": {"true"}, "from": {"4"}, "subagent": {"a1"}}},
	} {
		status, _, body := do(t, s, ada, tc.method, tc.path, tc.body)
		if status != http.StatusOK || body != `{"ok":true}` {
			t.Errorf("%s %s: %d %s", tc.method, tc.path, status, body)
			continue
		}
		path, _, _ := strings.Cut(tc.path, "?")
		a, ok := u.last(tc.method, path)
		if !ok {
			t.Errorf("%s %s: not asked", tc.method, path)
			continue
		}
		if tc.query == nil {
			tc.query = url.Values{}
		}
		if a.Body != tc.sent || !equalValues(a.Query, tc.query) {
			t.Errorf("%s %s: asked %q %v", tc.method, tc.path, a.Body, a.Query)
		}
	}
	if !slices.Equal(turned, []string{"hi"}) {
		t.Errorf("turned %q", turned)
	}
}

func equalValues(a, b url.Values) bool {
	if len(a) != len(b) {
		return false
	}
	for k, v := range a {
		if !slices.Equal(v, b[k]) {
			return false
		}
	}
	return true
}

func TestWhatTheBrowserMayNotSayOfASessionIsRefused(t *testing.T) {
	u := newUpstream(t)
	u.session("s1", ada, nil)
	s := relayOf(t, u, Config{Turn: func(_ *http.Request, _ Person, _ *runyard.Turn) error {
		return Refuse(http.StatusTooManyRequests, runyard.ErrorCodeQuotaExceeded, "slow down")
	}})
	for _, tc := range [][3]string{
		{http.MethodPatch, "/v1/sessions/s1", `{"labels":{"app.user":"x"}}`},
		{http.MethodPatch, "/v1/sessions/s1", `{"brokers":["all"]}`},
		{http.MethodPost, "/v1/sessions/s1/turns", `{"text":"x","provider":"theirs"}`},
		{http.MethodPost, "/v1/sessions/s1/turns", `{"text":"x","attachments":[]}`},
		{http.MethodPost, "/v1/sessions/s1/interrupt", `{"why":1}`},
		{http.MethodPost, "/v1/sessions/s1/rewind", `{"toSeq":"last"}`},
		{http.MethodPost, "/v1/sessions/s1/rewind", `{"toSeq":1,"andFork":true}`},
		{http.MethodPatch, "/v1/sessions/s1/queue/t1", `{"text":"x","mode":"plan"}`},
	} {
		if status, _, body := do(t, s, ada, tc[0], tc[1], tc[2]); status != 400 {
			t.Errorf("%s %s %s: %d %s", tc[0], tc[1], tc[2], status, body)
		}
	}
	if status, _, body := do(t, s, ada, http.MethodPost, "/v1/sessions/s1/turns", `{"text":"x"}`); status != 429 {
		t.Errorf("turn refused: %d %s", status, body)
	}
	if _, ok := u.last(http.MethodPost, "/v1/sessions/s1/turns"); ok {
		t.Error("a refused turn was sent")
	}
}

func TestATurnIsToldTheSessionItIsSentIn(t *testing.T) {
	u := newUpstream(t)
	u.session("s1", ada, nil)
	u.on("POST /v1/sessions", func(w http.ResponseWriter, _ *http.Request) { answer(w, http.StatusCreated, `{"id":"new"}`) })
	var in []string
	s := relayOf(t, u, Config{Turn: func(r *http.Request, _ Person, _ *runyard.Turn) error {
		in = append(in, r.PathValue("sessionId"))
		return nil
	}})
	do(t, s, ada, http.MethodPost, "/v1/sessions/s1/turns", `{"text":"x"}`)
	do(t, s, ada, http.MethodPost, "/v1/sessions", `{"firstTurn":{"text":"x"}}`)
	if !slices.Equal(in, []string{"s1", ""}) {
		t.Errorf("%q", in)
	}
}

func TestATurnWithNoIDIsGivenOne(t *testing.T) {
	u := newUpstream(t)
	u.session("s1", ada, nil)
	s := relayOf(t, u, Config{})
	if status, _, body := do(t, s, ada, http.MethodPost, "/v1/sessions/s1/turns", `{"text":"x"}`); status != 200 {
		t.Fatalf("%d %s", status, body)
	}
	a, _ := u.last(http.MethodPost, "/v1/sessions/s1/turns")
	var turn runyard.Turn
	if err := json.Unmarshal([]byte(a.Body), &turn); err != nil || len(turn.TurnId) != 32 {
		t.Errorf("%s %v", a.Body, err)
	}
}

func TestAnAnswerIsRelayedAsItWasWritten(t *testing.T) {
	u := newUpstream(t)
	u.session("s1", ada, nil)
	u.on("GET /v1/sessions/s1/attachments/u1", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "image/png")
		w.Header().Set("Content-Disposition", `inline; filename="a.png"`)
		w.Header().Set("Cache-Control", "private, max-age=60")
		w.Header().Set("Set-Cookie", "upstream=1")
		_, _ = w.Write([]byte("\x89PNG"))
	})
	u.on("POST /v1/sessions/s1/turns", func(w http.ResponseWriter, _ *http.Request) {
		answer(w, http.StatusConflict, `{"error":{"code":"conflict","message":"busy"}}`)
	})
	s := relayOf(t, u, Config{})
	status, h, body := do(t, s, ada, http.MethodGet, "/v1/sessions/s1/attachments/u1", "")
	if status != 200 || body != "\x89PNG" || h.Get("Content-Type") != "image/png" || h.Get("Content-Disposition") != `inline; filename="a.png"` ||
		h.Get("Cache-Control") != "private, max-age=60" || h.Get("Set-Cookie") != "" {
		t.Errorf("%d %v %q", status, h, body)
	}
	if status, _, body := do(t, s, ada, http.MethodPost, "/v1/sessions/s1/turns", `{"text":"x"}`); status != 409 || code(t, body) != runyard.ErrorCodeConflict {
		t.Errorf("%d %s", status, body)
	}
}

func TestTheKeyRefusedIsTheRelaysFailure(t *testing.T) {
	u := newUpstream(t)
	for _, status := range []int{401, 403} {
		u.on("GET /v1/sessions/s1", func(w http.ResponseWriter, _ *http.Request) {
			answer(w, status, `{"error":{"code":"unauthorized","message":"bad key"}}`)
		})
		var log bytes.Buffer
		s := relayOf(t, u, Config{Log: slog.New(slog.NewTextHandler(&log, nil))})
		got, _, body := do(t, s, ada, http.MethodGet, "/v1/sessions/s1", "")
		if got != http.StatusBadGateway || code(t, body) != runyard.ErrorCodeUpstreamError || !strings.Contains(log.String(), "bad key") {
			t.Errorf("%d: %d %s %s", status, got, body, log.String())
		}
	}
}

func TestRunyardAgentsUnansweringIsABadGateway(t *testing.T) {
	gone := httptest.NewServer(http.NotFoundHandler())
	gone.Close()
	var log bytes.Buffer
	h, err := New(Config{URL: gone.URL + "/", Key: key, Person: whom, Log: slog.New(slog.NewTextHandler(&log, nil))})
	if err != nil {
		t.Fatal(err)
	}
	s := httptest.NewServer(h)
	t.Cleanup(s.Close)
	req, _ := http.NewRequestWithContext(t.Context(), http.MethodGet, s.URL+"/v1/sessions", http.NoBody)
	req.Header.Set("X-Test-Person", ada)
	res, err := s.Client().Do(req)
	if err != nil {
		t.Fatal(err)
	}
	raw, _ := io.ReadAll(res.Body)
	_ = res.Body.Close()
	if res.StatusCode != http.StatusBadGateway || code(t, string(raw)) != runyard.ErrorCodeUpstreamError || !strings.Contains(log.String(), "not answering") {
		t.Errorf("%d %s %s", res.StatusCode, raw, log.String())
	}
}

func TestASessionItCannotReadIsABadGateway(t *testing.T) {
	u := newUpstream(t)
	u.on("GET /v1/sessions/s1", func(w http.ResponseWriter, _ *http.Request) { answer(w, 200, `{"owner":`) })
	s := relayOf(t, u, Config{})
	if status, _, body := do(t, s, ada, http.MethodGet, "/v1/sessions/s1", ""); status != http.StatusBadGateway {
		t.Errorf("%d %s", status, body)
	}
}

func TestATranscriptIsRelayedAsItIsWritten(t *testing.T) {
	u := newUpstream(t)
	u.session("s1", ada, nil)
	more, done := make(chan struct{}), make(chan struct{})
	u.on("GET /v1/sessions/s1/events", func(w http.ResponseWriter, r *http.Request) {
		defer close(done)
		w.Header().Set("Content-Type", "application/x-ndjson")
		_, _ = io.WriteString(w, `{"line":"event","seq":1}`+"\n")
		_ = http.NewResponseController(w).Flush()
		select {
		case <-more:
		case <-r.Context().Done():
			return
		}
		_, _ = io.WriteString(w, `{"line":"caughtUp","seq":1}`+"\n")
	})
	s := relayOf(t, u, Config{})
	res := open(t, s, ada, http.MethodGet, "/v1/sessions/s1/events?follow=true", "")
	defer func() { _ = res.Body.Close() }()
	if res.Header.Get("Content-Type") != "application/x-ndjson" || res.Header.Get("Cache-Control") != "no-store" || res.Header.Get("X-Accel-Buffering") != "no" {
		t.Errorf("headers %v", res.Header)
	}
	lines := bufio.NewReader(res.Body)
	// The first line, before runyard-agents has written the second.
	if line, err := lines.ReadString('\n'); err != nil || line != `{"line":"event","seq":1}`+"\n" {
		t.Fatalf("%q %v", line, err)
	}
	close(more)
	if line, err := lines.ReadString('\n'); err != nil || !strings.Contains(line, "caughtUp") {
		t.Fatalf("%q %v", line, err)
	}
	if _, err := lines.ReadString('\n'); !errors.Is(err, io.EOF) {
		t.Errorf("after the end: %v", err)
	}
	<-done
}

func TestATranscriptLeftIsLeftUpstreamToo(t *testing.T) {
	u := newUpstream(t)
	u.session("s1", ada, nil)
	gone := make(chan struct{})
	u.on("GET /v1/sessions/s1/events", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/x-ndjson")
		_, _ = io.WriteString(w, "{}\n")
		_ = http.NewResponseController(w).Flush()
		<-r.Context().Done()
		close(gone)
	})
	s := relayOf(t, u, Config{})
	res := open(t, s, ada, http.MethodGet, "/v1/sessions/s1/events?follow=true", "")
	if _, err := bufio.NewReader(res.Body).ReadString('\n'); err != nil {
		t.Fatal(err)
	}
	_ = res.Body.Close()
	select {
	case <-gone:
	case <-time.After(10 * time.Second):
		t.Fatal("runyard-agents' stream was left open")
	}
}

func TestAGappedTranscriptIsSaidAsRunyardAgentsSaysIt(t *testing.T) {
	u := newUpstream(t)
	u.session("s1", ada, nil)
	const gapped = `{"error":{"code":"gapped","message":"gone"},"oldest":40}`
	u.on("GET /v1/sessions/s1/events", func(w http.ResponseWriter, _ *http.Request) { answer(w, http.StatusConflict, gapped) })
	s := relayOf(t, u, Config{})
	if status, _, body := do(t, s, ada, http.MethodGet, "/v1/sessions/s1/events?from=2", ""); status != 409 || body != gapped {
		t.Errorf("%d %s", status, body)
	}
}

func TestChangesAreOfTheScopeOnly(t *testing.T) {
	u := newUpstream(t)
	lines := []string{
		`{"seq":1,"at":"2026-11-14T00:00:00Z","op":"created","sessionId":"mine","session":{"id":"mine","owner":"ada@example.com","labels":{"app.user":"ada@example.com"}}}`,
		`{"seq":2,"at":"2026-11-14T00:00:01Z","op":"created","sessionId":"theirs","session":{"id":"theirs","owner":"grace@example.com","labels":{"app.user":"ada@example.com"}}}`,
		``,
		`{"seq":3,"at":"2026-11-14T00:00:02Z","op":"deleted","sessionId":"theirs"}`,
		`{"seq":4,"at":"2026-11-14T00:00:03Z","op":"updated","sessionId":"moved","session":{"id":"moved","owner":"ada@example.com","labels":{"app.user":"ada@example.com"}}}`,
		`{"seq":5,"at":"2026-11-14T00:00:04Z","op":"updated","sessionId":"moved","session":{"id":"moved","owner":"ada@example.com","labels":{}}}`,
		`{"seq":6,"at":"2026-11-14T00:00:05Z","op":"updated","sessionId":"moved","session":{"id":"moved","owner":"ada@example.com","labels":{}}}`,
		`not json`,
		`{"seq":7,"at":"2026-11-14T00:00:06Z","op":"deleted","sessionId":"mine"}`,
	}
	u.on("GET /v1/changes", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/x-ndjson")
		for _, l := range lines {
			_, _ = io.WriteString(w, l+"\n")
			_ = http.NewResponseController(w).Flush()
		}
	})
	s := relayOf(t, u, Config{Scope: app})
	status, h, body := do(t, s, ada, http.MethodGet, "/v1/changes?follow=true&from=1&whose=all", "")
	if status != 200 || h.Get("Content-Type") != "application/x-ndjson" {
		t.Fatalf("%d %v", status, h)
	}
	want := strings.Join([]string{
		lines[0],
		``,
		lines[4],
		`{"seq":5,"at":"2026-11-14T00:00:04Z","op":"deleted","sessionId":"moved"}`,
		`{"seq":7,"at":"2026-11-14T00:00:06Z","op":"deleted","sessionId":"mine"}`,
	}, "\n") + "\n"
	if body != want {
		t.Errorf("got\n%s\nwant\n%s", body, want)
	}
	a, _ := u.last(http.MethodGet, "/v1/changes")
	if !equalValues(a.Query, url.Values{"follow": {"true"}, "from": {"1"}}) {
		t.Errorf("asked %v", a.Query)
	}
	u.on("GET /v1/changes", func(w http.ResponseWriter, _ *http.Request) {
		answer(w, http.StatusConflict, `{"error":{"code":"gapped","message":"x"}}`)
	})
	if status, _, body := do(t, s, ada, http.MethodGet, "/v1/changes?from=1", ""); status != 409 || code(t, body) != runyard.ErrorCodeGapped {
		t.Errorf("%d %s", status, body)
	}
}

func TestChangesSayWhatWasListedIsGone(t *testing.T) {
	u := newUpstream(t)
	u.on("GET /v1/sessions", func(w http.ResponseWriter, r *http.Request) {
		switch q := r.URL.Query(); {
		case q.Get("archived") == "false" && q.Get("cursor") == "":
			answer(w, 200, `{"items":[{"id":"listed","owner":"ada@example.com","labels":{"app.user":"ada@example.com"}},
				{"id":"foreign","owner":"grace@example.com","labels":{"app.user":"ada@example.com"}}],"nextCursor":"p2"}`)
		case q.Get("archived") == "false":
			answer(w, 200, `{"items":[{"id":"second","owner":"ada@example.com","labels":{"app.user":"ada@example.com"}}]}`)
		default:
			answer(w, 200, `{"items":[{"id":"archived","owner":"ada@example.com","labels":{"app.user":"ada@example.com"}}],"nextCursor":""}`)
		}
	})
	u.on("GET /v1/changes", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/x-ndjson")
		for _, id := range []string{"listed", "second", "archived", "foreign", "never"} {
			_, _ = io.WriteString(w, `{"seq":1,"at":"2026-11-14T00:00:00Z","op":"deleted","sessionId":"`+id+`"}`+"\n")
		}
	})
	s := relayOf(t, u, Config{Scope: app})
	status, _, body := do(t, s, ada, http.MethodGet, "/v1/changes?from=1", "")
	var gone []string
	for line := range strings.Lines(body) {
		var change runyard.Change
		if err := json.Unmarshal([]byte(line), &change); err != nil {
			t.Fatal(err)
		}
		gone = append(gone, change.SessionId)
	}
	if status != 200 || !slices.Equal(gone, []string{"listed", "second", "archived"}) {
		t.Errorf("%d %v\n%s", status, gone, body)
	}
	u.mu.Lock()
	var listed []string
	for _, a := range u.asked {
		if a.Path == "/v1/sessions" {
			listed = append(listed, a.Query.Get("archived")+" "+a.Query.Get("cursor")+" "+a.Query.Get("owner")+" "+a.Query.Get("label"))
		}
	}
	u.mu.Unlock()
	if want := []string{"false  " + ada + " app.user=" + ada, "false p2 " + ada + " app.user=" + ada, "true  " + ada + " app.user=" + ada}; !slices.Equal(listed, want) {
		t.Errorf("listed %q", listed)
	}

	for _, tc := range []struct {
		answer string
		status int
	}{
		{`{"error":{"code":"bad_request","message":"no"}}`, 400},
		{`{"items":`, http.StatusBadGateway},
	} {
		u.on("GET /v1/sessions", func(w http.ResponseWriter, _ *http.Request) {
			status := tc.status
			if status == http.StatusBadGateway {
				status = 200
			}
			answer(w, status, tc.answer)
		})
		if status, _, body := do(t, s, ada, http.MethodGet, "/v1/changes", ""); status != tc.status {
			t.Errorf("%s: %d %s", tc.answer, status, body)
		}
	}
	gone2 := httptest.NewServer(http.NotFoundHandler())
	gone2.Close()
	h, err := New(Config{URL: gone2.URL, Key: key, Person: whom})
	if err != nil {
		t.Fatal(err)
	}
	unanswered := httptest.NewRecorder()
	req := httptest.NewRequestWithContext(t.Context(), http.MethodGet, "/v1/changes", http.NoBody)
	req.Header.Set("X-Test-Person", ada)
	h.ServeHTTP(unanswered, req)
	if unanswered.Code != http.StatusBadGateway {
		t.Errorf("unanswered: %d", unanswered.Code)
	}
}

func TestChangesAreRelayedAsTheyAreWritten(t *testing.T) {
	u := newUpstream(t)
	more := make(chan struct{})
	u.on("GET /v1/changes", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/x-ndjson")
		_, _ = io.WriteString(w, `{"seq":1,"sessionId":"a","session":{"owner":"ada@example.com"}}`+"\n")
		_ = http.NewResponseController(w).Flush()
		select {
		case <-more:
		case <-r.Context().Done():
		}
	})
	s := relayOf(t, u, Config{})
	res := open(t, s, ada, http.MethodGet, "/v1/changes?follow=true", "")
	defer func() { _ = res.Body.Close() }()
	if line, err := bufio.NewReader(res.Body).ReadString('\n'); err != nil || !strings.Contains(line, `"sessionId":"a"`) {
		t.Errorf("%q %v", line, err)
	}
	close(more)
}

// ----------------------------------------------------------------- sign-in

func signInRelay(t *testing.T, u *upstream, finished *[]string) *httptest.Server {
	t.Helper()
	return relayOf(t, u, Config{SignIn: &SignIn{
		Provider: func(_ *http.Request, p Person) (string, error) {
			if p.Email == "nobody@example.com" {
				return "", Refuse(http.StatusForbidden, runyard.ErrorCodeForbidden, "no provider for you")
			}
			return "claude-" + strings.Split(p.Email, "@")[0], nil
		},
		Start: func(r *http.Request, _ Person, in *runyard.ProviderSignIn) error {
			if in.Type == "" {
				in.Type = runyard.Anthropic
			}
			if r.URL.Query().Get("refuse") != "" {
				return Refuse(http.StatusConflict, runyard.ErrorCodeConflict, "not now")
			}
			return nil
		},
		Finished: func(r *http.Request, p Person, provider string) error {
			if r.URL.Query().Get("fail") != "" {
				return errors.New("sharing failed")
			}
			*finished = append(*finished, p.Email+" "+provider)
			return nil
		},
	}})
}

func TestProvidersAreTheCallersOwn(t *testing.T) {
	u := newUpstream(t)
	u.on("GET /v1/providers", func(w http.ResponseWriter, _ *http.Request) {
		answer(w, 200, `{"items":[{"name":"claude-ada","status":"ok"},{"name":"claude-grace"},{"name":"shared"}]}`)
	})
	s := signInRelay(t, u, nil)
	status, _, body := do(t, s, ada, http.MethodGet, "/v1/providers", "")
	if status != 200 || body != `{"items":[{"name":"claude-ada","status":"ok"}]}`+"\n" {
		t.Errorf("%d %s", status, body)
	}
	if status, _, _ := do(t, s, "nobody@example.com", http.MethodGet, "/v1/providers", ""); status != 403 {
		t.Errorf("nobody: %d", status)
	}
	u.on("GET /v1/providers", func(w http.ResponseWriter, _ *http.Request) { answer(w, 200, `{"items":{}}`) })
	if status, _, _ := do(t, s, ada, http.MethodGet, "/v1/providers", ""); status != http.StatusBadGateway {
		t.Errorf("unreadable: %d", status)
	}
	u.on("GET /v1/providers", func(w http.ResponseWriter, _ *http.Request) {
		answer(w, 404, `{"error":{"code":"not_found","message":"x"}}`)
	})
	if status, _, _ := do(t, s, ada, http.MethodGet, "/v1/providers", ""); status != 404 {
		t.Errorf("refused: %d", status)
	}
}

func TestASignInIsTheCallersOwn(t *testing.T) {
	u := newUpstream(t)
	u.on("POST /v1/providers/claude-ada/signin", func(w http.ResponseWriter, _ *http.Request) {
		answer(w, 200, `{"flowId":"f1","authorizationUrl":"https://claude.example/auth"}`)
	})
	u.on("POST /v1/providers/claude-ada/signin/f1", func(w http.ResponseWriter, _ *http.Request) {
		answer(w, 200, `{"name":"claude-ada","status":"ok"}`)
	})
	var finished []string
	s := signInRelay(t, u, &finished)

	status, _, body := do(t, s, ada, http.MethodPost, "/v1/providers/claude-ada/signin", `{"method":"code","title":"Mine"}`)
	if status != 200 || !strings.Contains(body, `"flowId":"f1"`) {
		t.Fatalf("%d %s", status, body)
	}
	a, _ := u.last(http.MethodPost, "/v1/providers/claude-ada/signin")
	if a.Body != `{"method":"code","owner":"ada@example.com","title":"Mine","type":"anthropic"}` {
		t.Errorf("started %s", a.Body)
	}
	status, _, body = do(t, s, ada, http.MethodPost, "/v1/providers/claude-ada/signin/f1", `{"code":"abc"}`)
	if status != 200 || !strings.Contains(body, `"status":"ok"`) || !slices.Equal(finished, []string{ada + " claude-ada"}) {
		t.Errorf("%d %s %v", status, body, finished)
	}
	if a, _ := u.last(http.MethodPost, "/v1/providers/claude-ada/signin/f1"); a.Body != `{"code":"abc"}` {
		t.Errorf("finished %s", a.Body)
	}

	for _, tc := range []struct {
		path, body string
		status     int
	}{
		{"/v1/providers/claude-grace/signin", `{}`, 404},
		{"/v1/providers/claude-grace/signin/f1", `{"code":"x"}`, 404},
		{"/v1/providers/claude-ada/signin", `{"owner":"grace@example.com"}`, 400},
		{"/v1/providers/claude-ada/signin?refuse=1", `{}`, 409},
		{"/v1/providers/claude-ada/signin/f1", `{"code":"x","owner":"y"}`, 400},
		{"/v1/providers/claude-ada/signin/f1?fail=1", `{"code":"x"}`, 500},
	} {
		if status, _, body := do(t, s, ada, http.MethodPost, tc.path, tc.body); status != tc.status {
			t.Errorf("%s %s: %d %s", tc.path, tc.body, status, body)
		}
	}
	u.on("POST /v1/providers/claude-ada/signin/f2", func(w http.ResponseWriter, _ *http.Request) {
		answer(w, 400, `{"error":{"code":"provider_error","message":"wrong code"}}`)
	})
	if status, _, body := do(t, s, ada, http.MethodPost, "/v1/providers/claude-ada/signin/f2", `{"code":"x"}`); status != 400 || len(finished) != 1 {
		t.Errorf("wrong code: %d %s %v", status, body, finished)
	}
	if status, _, _ := do(t, s, "nobody@example.com", http.MethodPost, "/v1/providers/claude-nobody/signin", `{}`); status != 403 {
		t.Errorf("nobody: %d", status)
	}
}

func TestASignInFinishedWithoutAHookIsRelayed(t *testing.T) {
	u := newUpstream(t)
	u.on("POST /v1/providers/p/signin/f1", func(w http.ResponseWriter, _ *http.Request) { answer(w, 200, `{"name":"p"}`) })
	s := relayOf(t, u, Config{SignIn: &SignIn{Provider: func(*http.Request, Person) (string, error) { return "p", nil }}})
	if status, _, body := do(t, s, ada, http.MethodPost, "/v1/providers/p/signin/f1", `{"code":"x"}`); status != 200 || body != `{"name":"p"}` {
		t.Errorf("%d %s", status, body)
	}
	if status, _, _ := do(t, s, ada, http.MethodPost, "/v1/providers/p/signin", `{"type":"anthropic"}`); status != 200 {
		t.Errorf("start: %d", status)
	}
}

func TestErrorSaysItsParts(t *testing.T) {
	if got := Refuse(402, runyard.ErrorCodeQuotaExceeded, "pay").Error(); got != "402 quota_exceeded: pay" {
		t.Error(got)
	}
}
