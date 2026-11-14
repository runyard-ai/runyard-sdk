package runyard

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"go.uber.org/goleak"
)

// The SDK starts no goroutine of its own, and a stream closed leaves none.
func TestMain(m *testing.M) { goleak.VerifyTestMain(m) }

// flush sends what the handler wrote, now.
func flush(t *testing.T, w http.ResponseWriter) {
	t.Helper()
	if err := http.NewResponseController(w).Flush(); err != nil {
		t.Error(err)
	}
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

// serve is a client of a server that answers every request with handler.
func serve(t *testing.T, handler http.HandlerFunc, opts ...ClientOption) *ClientWithResponses {
	t.Helper()
	server := httptest.NewServer(handler)
	t.Cleanup(server.Close)
	c, err := NewClientWithResponses(server.URL, opts...)
	if err != nil {
		t.Fatal(err)
	}
	return c
}

func TestWithKeyIsTheBearerOfEveryRequest(t *testing.T) {
	var got []string
	c := serve(t, func(w http.ResponseWriter, r *http.Request) {
		got = append(got, r.Header.Get("Authorization"))
		w.Header().Set("Content-Type", "application/json")
		_, _ = io.WriteString(w, `{"items":[]}`)
	}, WithKey("ryak_a_b"))
	for range 2 {
		if _, err := c.ListSessionsWithResponse(t.Context(), nil); err != nil {
			t.Fatal(err)
		}
	}
	if len(got) != 2 || got[0] != "Bearer ryak_a_b" || got[1] != got[0] {
		t.Errorf("%q", got)
	}
}

func TestCheck(t *testing.T) {
	for _, status := range []int{200, 201, 204, 299} {
		if err := Check(status, []byte("whatever")); err != nil {
			t.Errorf("%d: %v", status, err)
		}
	}

	err := Check(404, []byte(`{"error":{"code":"not_found","message":"no session s1"}}`))
	var e *APIError
	if !errors.As(err, &e) || e.Status != 404 || e.Code != ErrorCodeNotFound || e.Message != "no session s1" {
		t.Fatalf("%#v", err)
	}
	if err.Error() != "runyard-agents: 404 not_found: no session s1" {
		t.Error(err)
	}
	if !IsCode(err, ErrorCodeNotFound) || IsCode(err, ErrorCodeConflict) || !IsCode(fmt.Errorf("wrapped: %w", err), ErrorCodeNotFound) {
		t.Error("IsCode")
	}
	if IsCode(errors.New("other"), ErrorCodeNotFound) || IsCode(nil, ErrorCodeNotFound) {
		t.Error("IsCode of what is not an APIError")
	}

	// What is not one of the server's errors — a proxy's page, nothing, a
	// status below 200 — is still an error, with its body.
	for status, body := range map[int]string{502: "<html>bad gateway</html>", 500: "", 100: "", 302: `{"error":"x"}`} {
		err := Check(status, []byte(body))
		if !errors.As(err, &e) || e.Status != status || e.Code != "" || string(e.Body) != body {
			t.Errorf("%d %q: %#v", status, body, err)
			continue
		}
		if want := fmt.Sprintf("runyard-agents: %d %s", status, http.StatusText(status)); err.Error() != want {
			t.Errorf("%q, want %q", err.Error(), want)
		}
	}
}

func TestChecked(t *testing.T) {
	c := serve(t, func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/v1/sessions/s1" {
			w.Header().Set("Content-Type", "application/json")
			_, _ = io.WriteString(w, `{"id":"s1"}`)
			return
		}
		w.WriteHeader(http.StatusNotFound)
		_, _ = io.WriteString(w, `{"error":{"code":"not_found","message":"no such session"}}`)
	})
	if err := Checked(c.GetSessionWithResponse(t.Context(), "s1")); err != nil {
		t.Error(err)
	}
	if err := Checked(c.GetSessionWithResponse(t.Context(), "s2")); !IsCode(err, ErrorCodeNotFound) {
		t.Errorf("%v", err)
	}
	// Not answered: the call's own error, and no answer is read.
	cut := errors.New("cut")
	var none *GetSessionResponse
	if err := Checked(none, cut); !errors.Is(err, cut) {
		t.Errorf("%v", err)
	}
}

const (
	eventLine   = `{"line":"event","seq":1,"at":"2026-01-02T03:04:05Z","event":{"type":"state","state":"idle"}}`
	partialLine = `{"line":"partial","partial":{"seq":2,"kind":"text","offset":0,"text":"hel"}}`
	caughtUp    = `{"line":"caughtUp","caughtUp":{"seq":1}}`
)

func TestEventsReadsEachLineAsItIsWritten(t *testing.T) {
	written := make(chan string)
	c := serve(t, func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/v1/sessions/s1/events" || r.URL.Query().Get("follow") != "true" || r.URL.Query().Get("from") != "1" {
			http.Error(w, r.URL.String(), http.StatusTeapot)
			return
		}
		w.Header().Set("Content-Type", "application/x-ndjson")
		flush(t, w)
		for line := range written {
			_, _ = io.WriteString(w, line)
			flush(t, w)
		}
	})
	follow, from := true, From(1)
	s, err := c.Events(t.Context(), "s1", &StreamEventsParams{Follow: &follow, From: &from})
	if err != nil {
		t.Fatal(err)
	}
	defer func() { _ = s.Close() }()

	// Each line is had before the next is written: the stream is read as it
	// arrives, not once it ends. Blank lines, a proxy's keep-alive, are not
	// lines; a line may come in pieces.
	written <- "\n"
	written <- eventLine + "\n"
	line, err := s.Next()
	if err != nil {
		t.Fatal(err)
	}
	v, err := line.Value()
	if ev, ok := v.(*SessionEvent); err != nil || !ok || ev.Seq != 1 {
		t.Fatalf("%#v %v", v, err)
	}
	if state, err := as[*SessionEvent](t, v).Event.AsStateEvent(); err != nil || state.State != SessionStateIdle {
		t.Errorf("%#v %v", state, err)
	}
	written <- "\r\n  \n" + caughtUp[:5]
	written <- caughtUp[5:] + "\n"
	if line, err = s.Next(); err != nil {
		t.Fatal(err)
	}
	if v, err := line.Value(); err != nil || as[*CaughtUpLine](t, v).CaughtUp.Seq != 1 {
		t.Fatalf("%#v %v", v, err)
	}
	// The last line need not end with a newline.
	written <- partialLine
	close(written)
	if line, err = s.Next(); err != nil {
		t.Fatal(err)
	}
	if v, err := line.Value(); err != nil || as[*PartialLine](t, v).Partial.Text != "hel" {
		t.Fatalf("%#v %v", v, err)
	}
	if _, err := s.Next(); !errors.Is(err, io.EOF) {
		t.Errorf("after the last line: %v", err)
	}
}

func TestAStreamEnds(t *testing.T) {
	t.Run("closed by its reader", func(t *testing.T) {
		done := make(chan struct{})
		c := serve(t, func(w http.ResponseWriter, r *http.Request) {
			_, _ = io.WriteString(w, eventLine+"\n")
			flush(t, w)
			<-r.Context().Done()
			close(done)
		})
		s, err := c.Events(t.Context(), "s1", nil)
		if err != nil {
			t.Fatal(err)
		}
		if _, err := s.Next(); err != nil {
			t.Fatal(err)
		}
		if err := s.Close(); err != nil {
			t.Fatal(err)
		}
		<-done // the server saw the reader hang up
		if _, err := s.Next(); err == nil {
			t.Error("a line from a closed stream")
		}
	})

	t.Run("by its context", func(t *testing.T) {
		c := serve(t, func(w http.ResponseWriter, r *http.Request) {
			flush(t, w)
			<-r.Context().Done()
		})
		ctx, cancel := context.WithCancel(t.Context())
		s, err := c.Changes(ctx, nil)
		if err != nil {
			t.Fatal(err)
		}
		defer func() { _ = s.Close() }()
		cancel()
		if _, err := s.Next(); !errors.Is(err, context.Canceled) {
			t.Errorf("%v", err)
		}
	})

	t.Run("on a line that is not JSON", func(t *testing.T) {
		c := serve(t, func(w http.ResponseWriter, _ *http.Request) {
			_, _ = io.WriteString(w, "{\"seq\":1,\"at\":\"2026-01-02T03:04:05Z\",\"op\":\"created\",\"sessionId\":\"s1\"}\nnot json\n")
		})
		s, err := c.Changes(t.Context(), nil)
		if err != nil {
			t.Fatal(err)
		}
		defer func() { _ = s.Close() }()
		if change, err := s.Next(); err != nil || change.SessionId != "s1" {
			t.Fatalf("%#v %v", change, err)
		}
		if _, err := s.Next(); err == nil || !strings.Contains(err.Error(), "a line of the stream") {
			t.Errorf("%v", err)
		}
	})
}

func TestAStreamRefusedIsAnError(t *testing.T) {
	gap := `{"error":{"code":"gapped","message":"not kept"},"firstSeq":5,"lastSeq":9}`
	c := serve(t, func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/v1/changes":
			w.WriteHeader(http.StatusConflict)
			_, _ = io.WriteString(w, gap)
		case "/v1/sessions/redirected/events":
			// Not followed, as it names no Location: neither a 200 nor an error of the server's.
			w.WriteHeader(http.StatusMultipleChoices)
		default:
			w.WriteHeader(http.StatusNoContent)
		}
	})
	_, err := c.Changes(t.Context(), nil)
	var e *APIError
	if !errors.As(err, &e) || e.Status != 409 || e.Code != ErrorCodeGapped || string(e.Body) != gap {
		t.Fatalf("%#v", err)
	}
	// A success that is not the stream is not one either.
	if _, err := c.Events(t.Context(), "s1", nil); !errors.As(err, &e) || e.Status != 204 {
		t.Errorf("%#v", err)
	}
	if _, err := c.Events(t.Context(), "redirected", nil); !errors.As(err, &e) || e.Status != 300 {
		t.Errorf("%#v", err)
	}
}

func TestAStreamOfNoServer(t *testing.T) {
	server := httptest.NewServer(http.NotFoundHandler())
	server.Close()
	c, err := NewClient(server.URL)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := c.Events(t.Context(), "s1", nil); err == nil {
		t.Error("a stream of no server")
	}
	if _, err := c.Changes(t.Context(), nil); err == nil {
		t.Error("a stream of no server")
	}
}

type failingBody struct{}

func (failingBody) Read([]byte) (int, error) { return 0, errors.New("cut") }
func (failingBody) Close() error             { return nil }

func TestARefusalCutShortIsTheCut(t *testing.T) {
	_, err := stream[Change](&http.Response{StatusCode: http.StatusInternalServerError, Body: failingBody{}}, nil)
	if err == nil || err.Error() != "cut" {
		t.Errorf("%v", err)
	}
}

// line is raw as an events line.
func line(t *testing.T, raw string) EventsLine {
	t.Helper()
	var l EventsLine
	if err := l.UnmarshalJSON([]byte(raw)); err != nil {
		t.Fatal(err)
	}
	return l
}

func TestValue(t *testing.T) {
	for _, bad := range []string{
		`{"seq":1}`, `[1]`, `"x"`, `{}`,
		// Of a kind it does not know, or none it can read.
		`{"line":"later","seq":1,"event":{}}`, `{"line":5,"partial":{}}`, `{"line":"","event":{}}`,
		// Said to be a kind, and not in its shape.
		`{"line":"event","seq":"one","event":{}}`, `{"line":"caughtUp","caughtUp":{"seq":"one"}}`, `{"line":"partial","partial":[1]}`,
		// Without the line field, as a server of v0.37.0 or earlier writes them.
		`{"seq":"one","event":{}}`, `{"caughtUp":{"seq":"one"}}`, `{"partial":[1]}`,
	} {
		if v, err := line(t, bad).Value(); err == nil {
			t.Errorf("%s: %#v", bad, v)
		}
	}

	// What the line says it is, it is, whatever else it carries.
	v, err := line(t, `{"line":"event","partial":{"seq":3},"seq":7,"at":"2026-01-02T03:04:05Z","event":{"type":"text","text":"x"}}`).Value()
	if err != nil || as[*SessionEvent](t, v).Seq != 7 {
		t.Errorf("%#v %v", v, err)
	}
	if v, err := line(t, `{"line":"caughtUp","caughtUp":{"seq":9},"event":{}}`).Value(); err != nil || as[*CaughtUpLine](t, v).CaughtUp.Seq != 9 {
		t.Errorf("%#v %v", v, err)
	}

	// Without it, told apart by the field only its kind has.
	for raw, want := range map[string]string{
		`{"partial":{"seq":3,"kind":"thinking","offset":4,"text":"x"},"seq":7,"event":{}}`: "partial",
		`{"caughtUp":{"seq":2},"event":{}}`:                                                "caughtUp",
		`{"seq":1,"at":"2026-01-02T03:04:05Z","event":{"type":"text","text":"x"}}`:         "event",
	} {
		v, err := line(t, raw).Value()
		if err != nil {
			t.Errorf("%s: %v", raw, err)
			continue
		}
		var got string
		switch v.(type) {
		case *PartialLine:
			got = "partial"
		case *CaughtUpLine:
			got = "caughtUp"
		case *SessionEvent:
			got = "event"
		}
		if got != want {
			t.Errorf("%s: a %T", raw, v)
		}
	}
}
