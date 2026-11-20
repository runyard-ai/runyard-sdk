package ry

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"reflect"
	"strings"
	"sync"
	"testing"
	"time"

	runyard "github.com/runyard-ai/runyard-sdk/go"
)

// ev is an events line of seq: an event of the transcript.
func ev(seq int64, event string) string {
	return fmt.Sprintf(`{"line":"event","seq":%d,"at":"2026-11-19T10:00:%02dZ","event":%s}`, seq, seq%60, event)
}

func started(seq int64, turn string) string {
	return ev(seq, fmt.Sprintf(`{"type":"turn_started","turnId":%q}`, turn))
}

func said(seq int64, text string) string {
	return ev(seq, fmt.Sprintf(`{"type":"text","text":%q}`, text))
}

func ended(seq int64, turn, reason string) string {
	return ev(seq, fmt.Sprintf(`{"type":"turn_ended","turnId":%q,"stopReason":%q,"usage":{}}`, turn, reason))
}

// stream answers the session's events with lines and, held, keeps the
// stream open after them until the client hangs up, as following does.
func (s *stub) stream(held bool, lines ...string) {
	s.mux.HandleFunc("GET /v1/sessions/{id}/events", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/x-ndjson")
		for _, l := range lines {
			_, _ = io.WriteString(w, l+"\n")
		}
		if held {
			_ = http.NewResponseController(w).Flush()
			<-r.Context().Done()
		}
	})
}

// eventsAsked is the query of every request for the session's events.
func (s *stub) eventsAsked() []string {
	var qs []string
	for _, a := range s.asked() {
		if strings.HasSuffix(a.path, "/events") {
			qs = append(qs, a.query)
		}
	}
	return qs
}

func TestEventsAreDrawnOutByKind(t *testing.T) {
	s := newStub(t)
	s.stream(true,
		`{"line":"caughtUp","caughtUp":{"seq":0}}`,
		ev(1, `{"type":"user","turnId":"t1","text":"hi","source":"user","endUser":{"id":"u1"}}`),
		started(2, "t1"),
		`{"line":"partial","partial":{"seq":3,"kind":"text","offset":0,"text":"He"}}`,
		said(3, "Hello"),
		ev(4, `{"type":"text","text":"sub","parentToolId":"a1"}`),
		ev(5, `{"type":"tool_call","toolId":"x1","name":"Bash","input":{"command":"ls"}}`),
		ev(6, `{"type":"tool_result","toolId":"x1","content":"a.go","isError":true,"parentToolId":"a1"}`),
		ended(7, "t1", "end_turn"),
		ev(8, `{"type":"state","state":"idle","sandboxState":"ready"}`),
		ev(9, `{"type":"error","code":"harness_crashed","message":"gone","retrying":true}`),
		ev(10, `{"type":"thinking","text":"hmm"}`),
	)
	var got []Event
	for e, err := range s.client().Session("s1").Events(t.Context()) {
		if err != nil {
			t.Fatal(err)
		}
		got = append(got, e)
		if len(got) == 10 {
			break
		}
	}
	at := func(seq int64) Base { return Base{Seq: seq, At: time.Date(2026, 11, 19, 10, 0, int(seq), 0, time.UTC)} }
	want := []Event{
		User{Base: at(1), TurnID: "t1", Text: "hi", EndUser: &EndUser{ID: "u1"}},
		TurnStarted{Base: at(2), TurnID: "t1"},
		Text{Base: at(3), Text: "Hello"},
		Text{Base: at(4), Text: "sub", Subagent: "a1"},
		ToolCall{Base: at(5), ID: "x1", Name: "Bash", Input: map[string]any{"command": "ls"}},
		ToolResult{Base: at(6), ID: "x1", Content: "a.go", IsError: true, Subagent: "a1"},
		TurnEnded{Base: at(7), TurnID: "t1", StopReason: runyard.TurnEndedEventStopReasonEndTurn},
		State{Base: at(8), State: runyard.SessionStateIdle},
		SessionError{Base: at(9), Code: "harness_crashed", Message: "gone", Retrying: true},
	}
	if !reflect.DeepEqual(got[:9], want) {
		t.Errorf("got  %+v\nwant %+v", got[:9], want)
	}
	other, ok := got[9].(Other)
	if !ok || other.Type != "thinking" || other.Seq != 10 || other.Event.Seq != 10 || other.base().Seq != 10 {
		t.Errorf("%+v", got[9])
	}
	if q := s.eventsAsked(); len(q) != 1 || q[0] != "follow=true" {
		t.Errorf("asked %v", q)
	}
}

func TestEventsOfNoSessionIsItsError(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions/{id}/events", http.StatusNotFound, `{"error":{"code":"not_found","message":"no"}}`)
	n := 0
	for e, err := range s.client().Session("gone").Events(t.Context()) {
		n++
		if e != nil {
			t.Errorf("%v", e)
		}
		apiCode(t, err, runyard.ErrorCodeNotFound)
	}
	if n != 1 {
		t.Errorf("%d yields", n)
	}
}

func TestEventsEndingSaySo(t *testing.T) {
	s := newStub(t)
	s.stream(false, said(1, "a"))
	var errs []error
	for _, err := range s.client().Session("s1").Events(t.Context()) {
		errs = append(errs, err)
	}
	if len(errs) != 2 || errs[0] != nil || !errors.Is(errs[1], ErrStreamEnded) {
		t.Errorf("%v", errs)
	}
}

func TestEventsOfALineNotUnderstoodEndWithItsError(t *testing.T) {
	for name, line := range map[string]string{
		"not JSON":         `{"line":`,
		"no kind":          `{"line":"mystery"}`,
		"a type not text":  ev(1, `{"type":7}`),
		"a field mistyped": ev(1, `{"type":"text","text":7}`),
	} {
		t.Run(name, func(t *testing.T) {
			s := newStub(t)
			s.stream(true, line, said(2, "never"))
			var errs []error
			for e, err := range s.client().Session("s1").Events(t.Context()) {
				if e != nil {
					t.Errorf("%v", e)
				}
				errs = append(errs, err)
			}
			if len(errs) != 1 || errs[0] == nil {
				t.Errorf("%v", errs)
			}
		})
	}
}

// change is a line of the changes to the sessions: the session of id
// updated, with the turns queued waiting, and extra of its fields.
func change(seq int64, id string, queued []string, extra string) string {
	q := ""
	if len(queued) > 0 {
		turns := make([]string, len(queued))
		for i, t := range queued {
			turns[i] = fmt.Sprintf(`{"turnId":%q,"text":"t","source":"api"}`, t)
		}
		q = `,"queue":[` + strings.Join(turns, ",") + `]`
	}
	return fmt.Sprintf(`{"seq":%d,"at":"2026-11-19T10:00:00Z","op":"updated","sessionId":%q,"session":%s}`, seq, id, session(id, 0, q+extra))
}

// changes has the stub list sessions as of change 10 and answer the
// changes from 11 with what lines says of the turn it was sent, then held
// open, as following does.
func (s *stub) changes(lines func(turn string) []string) {
	s.on("GET /v1/sessions", http.StatusOK, `{"items":[],"changeSeq":10}`)
	s.mux.HandleFunc("GET /v1/changes", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/x-ndjson")
		for _, l := range lines(s.sentTurn()) {
			_, _ = io.WriteString(w, l+"\n")
		}
		_ = http.NewResponseController(w).Flush()
		<-r.Context().Done()
	})
}

// A session whose stream says lastSeq, its turn sent and answered; what
// the changes to the sessions say is the test's.
func sending(t *testing.T, lastSeq int64, status int, lines ...string) (*stub, *Client) {
	t.Helper()
	s := newStub(t)
	s.on("GET /v1/sessions/{id}", http.StatusOK, session("s1", lastSeq, ""))
	s.mux.HandleFunc("POST /v1/sessions/{id}/turns", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(status)
		_, _ = io.WriteString(w, `{"turnId":"x","position":0}`)
	})
	s.stream(true, lines...)
	c := s.client()
	return s, c
}

// sentTurn is the id of the turn the stub was sent.
func (s *stub) sentTurn() string {
	for _, a := range s.asked() {
		if strings.HasSuffix(a.path, "/turns") {
			id, _ := a.body["turnId"].(string)
			return id
		}
	}
	return ""
}

// user is the user event of turn.
func user(seq int64, turn string) string {
	return ev(seq, fmt.Sprintf(`{"type":"user","turnId":%q,"text":"Now draft a reply","source":"user"}`, turn))
}

const caughtUp = `{"line":"caughtUp","caughtUp":{"seq":0}}`

func TestSendIsItsTurnsAnswer(t *testing.T) {
	// The turn's id is the SDK's own, so the stub answers with whatever it
	// was sent: the stream is written once the turn is.
	s := newStub(t)
	s.on("GET /v1/sessions/{id}", http.StatusOK, session("s1", 4, ""))
	s.on("POST /v1/sessions/{id}/turns", http.StatusAccepted, `{"turnId":"x","position":1}`)
	s.changes(func(turn string) []string {
		return []string{
			// Before it was queued, and another session's: nothing of it.
			change(11, "s1", nil, ""),
			change(12, "s2", []string{"other"}, ""),
			change(13, "s1", []string{"ahead", turn}, `,"state":"generating"`),
			change(14, "s1", []string{turn}, ""),
			change(15, "s1", nil, ""),
		}
	})
	s.mux.HandleFunc("GET /v1/sessions/{id}/events", func(w http.ResponseWriter, r *http.Request) {
		turn := s.sentTurn()
		for _, l := range []string{
			// Another turn, ahead of it in the queue: none of its words.
			started(5, "ahead"), said(6, "not mine"), ended(7, "ahead", "end_turn"),
			user(8, turn), caughtUp,
			started(9, turn), said(10, "Dear Acme,"),
			ev(11, `{"type":"text","text":"a sub-agent's","parentToolId":"a1"}`),
			ev(12, `{"type":"tool_call","toolId":"x","name":"Read","input":{}}`),
			said(13, "Regards."), ended(14, turn, "end_turn"),
		} {
			_, _ = io.WriteString(w, l+"\n")
		}
		_ = http.NewResponseController(w).Flush()
		<-r.Context().Done()
	})
	c := s.client()
	session := c.Session("s1")
	got, err := session.Send(t.Context(), "Now draft a reply")
	if err != nil || got != "Dear Acme,\n\nRegards." {
		t.Fatalf("%q %v", got, err)
	}
	if q := s.eventsAsked(); len(q) != 1 || q[0] != "follow=true&from=5" {
		t.Errorf("asked %v", q)
	}
	var changesAsked []string
	for _, a := range s.asked() {
		if a.path == "/v1/changes" || a.path == "/v1/sessions" {
			changesAsked = append(changesAsked, a.path+"?"+a.query)
		}
	}
	if len(changesAsked) != 2 || changesAsked[0] != "/v1/sessions?limit=1" || changesAsked[1] != "/v1/changes?follow=true&from=11" {
		t.Errorf("asked %v", changesAsked)
	}
	if from, known := session.cursor(); !known || from != 15 {
		t.Errorf("next read from %d (%v)", from, known)
	}
}

// A turn the session never started is a *TurnGoneError as soon as its queue
// says so, and the transcript has nothing of it: not when the turn ahead
// ends, which may be long after.
func TestSendOfATurnTakenOutOfTheQueueIsTurnGone(t *testing.T) {
	for name, tc := range map[string]struct {
		events []string
		why    string
	}{
		// Cancelled from the page while the turn ahead goes on.
		"cancelled": {events: []string{started(5, "ahead"), said(6, "still going"), caughtUp}, why: takenOut},
		// Dropped by an interrupt that dropped the queue: the turn ahead
		// ends, interrupted, and nothing is given after it.
		"dropped": {events: []string{started(5, "ahead"), ended(6, "ahead", "interrupted"), caughtUp}, why: takenOut},
		// Refused as it was given to the harness: an error, and no turn.
		"refused": {
			events: []string{
				started(5, "ahead"), ev(6, `{"type":"error","code":"provider_error","message":"the turn ahead's"}`), ended(7, "ahead", "end_turn"),
				ev(8, `{"type":"error","code":"internal","message":"the turn could not be given to the harness: no"}`), caughtUp,
			},
			why: "the turn could not be given to the harness: no",
		},
		// Refused, and the turn behind it started since: still refused.
		"refused, and the next started": {
			events: []string{
				started(5, "ahead"), ended(6, "ahead", "end_turn"),
				ev(7, `{"type":"error","code":"internal","message":"the turn could not be given to the harness: no"}`),
				user(8, "behind"), started(9, "behind"), said(10, "going"), caughtUp,
			},
			why: "the turn could not be given to the harness: no",
		},
	} {
		t.Run(name, func(t *testing.T) {
			s, c := sending(t, 4, http.StatusAccepted, tc.events...)
			s.changes(func(turn string) []string {
				return []string{change(11, "s1", []string{"ahead", turn}, ""), change(12, "s1", nil, "")}
			})
			got, err := c.Session("s1").Send(t.Context(), "hi")
			var gone *TurnGoneError
			if got != "" || !errors.As(err, &gone) || gone.TurnID != s.sentTurn() || gone.Why != tc.why {
				t.Fatalf("%q %v", got, err)
			}
			if !strings.Contains(err.Error(), "was never started: "+tc.why) {
				t.Error(err)
			}
		})
	}
}

func TestSendOfASessionThatFailsWithItQueuedIsErrFailed(t *testing.T) {
	s, c := sending(t, 4, http.StatusAccepted)
	s.changes(func(turn string) []string {
		return []string{
			// Failed before it was sent, and woken by it: not this turn's.
			change(11, "s1", nil, `,"state":"failed"`),
			change(12, "s1", []string{turn}, `,"state":"starting"`),
			change(13, "s1", []string{turn}, `,"state":"failed","error":"no machine"`),
		}
	})
	_, err := c.Session("s1").Send(t.Context(), "hi")
	if !errors.Is(err, ErrFailed) || !strings.Contains(err.Error(), "no machine") {
		t.Errorf("%v", err)
	}
}

func TestSendOfASessionDeletedWhileItWaitsIsErrStreamEnded(t *testing.T) {
	for name, deleted := range map[string]string{
		"deleted":         `{"seq":12,"at":"2026-11-19T10:00:00Z","op":"deleted","sessionId":"s1"}`,
		"with no session": `{"seq":12,"at":"2026-11-19T10:00:00Z","op":"updated","sessionId":"s1"}`,
	} {
		t.Run(name, func(t *testing.T) {
			s, c := sending(t, 4, http.StatusAccepted)
			s.changes(func(turn string) []string { return []string{change(11, "s1", []string{turn}, ""), deleted} })
			if _, err := c.Session("s1").Send(t.Context(), "hi"); !errors.Is(err, ErrStreamEnded) {
				t.Errorf("%v", err)
			}
		})
	}
}

func TestSendWhoseChangesEndIsErrStreamEnded(t *testing.T) {
	s, c := sending(t, 4, http.StatusAccepted)
	s.on("GET /v1/sessions", http.StatusOK, `{"items":[],"changeSeq":10}`)
	s.on("GET /v1/changes", http.StatusOK, "")
	if _, err := c.Session("s1").Send(t.Context(), "hi"); !errors.Is(err, ErrStreamEnded) {
		t.Errorf("%v", err)
	}
}

func TestSendWhoseChangesAreRefusedIsTheServersError(t *testing.T) {
	s, c := sending(t, 4, http.StatusAccepted)
	s.on("GET /v1/sessions", http.StatusOK, `{"items":[],"changeSeq":10}`)
	s.on("GET /v1/changes", http.StatusForbidden, forbidden)
	apiCode(t, func() error { _, err := c.Session("s1").Send(t.Context(), "hi"); return err }(), runyard.ErrorCodeForbidden)
}

func TestSendOfAChangeNotUnderstoodIsItsError(t *testing.T) {
	s, c := sending(t, 4, http.StatusAccepted)
	s.on("GET /v1/sessions", http.StatusOK, `{"items":[],"changeSeq":10}`)
	s.on("GET /v1/changes", http.StatusOK, `{"seq":"eleven"}`+"\n")
	if _, err := c.Session("s1").Send(t.Context(), "hi"); err == nil || errors.Is(err, ErrStreamEnded) {
		t.Errorf("%v", err)
	}
}

func TestSendWhoseListIsRefusedIsTheServersErrorAndSendsNothing(t *testing.T) {
	s, c := sending(t, 4, http.StatusAccepted)
	s.on("GET /v1/sessions", http.StatusForbidden, forbidden)
	_, err := c.Session("s1").Send(t.Context(), "hi")
	apiCode(t, err, runyard.ErrorCodeForbidden)
	if s.sentTurn() != "" {
		t.Error("sent a turn it could not follow")
	}
}

func TestSendWhoseListIsNoPageIsAnError(t *testing.T) {
	s, c := sending(t, 4, http.StatusAccepted)
	s.on("GET /v1/sessions", http.StatusNoContent, "")
	if _, err := c.Session("s1").Send(t.Context(), "hi"); err == nil {
		t.Error("no page, and no error")
	}
}

func TestSendRefusedIsTheServersError(t *testing.T) {
	s, c := sending(t, 0, http.StatusConflict)
	s.on("GET /v1/sessions", http.StatusOK, `{"items":[],"changeSeq":10}`)
	_, err := c.Session("s1").Send(t.Context(), "hi")
	var e *runyard.APIError
	if !errors.As(err, &e) || e.Status != http.StatusConflict {
		t.Errorf("%v", err)
	}
}

func TestSendToNoSessionIsNotFound(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions/{id}", http.StatusNotFound, `{"error":{"code":"not_found","message":"no"}}`)
	_, err := s.client().Session("gone").Send(t.Context(), "hi")
	apiCode(t, err, runyard.ErrorCodeNotFound)
	if len(s.asked()) != 1 {
		t.Errorf("went on to %+v", s.asked())
	}
}

func TestReplyOfAHandleOnlyMadeIsTheTurnUnderWay(t *testing.T) {
	s := newStub(t)
	// Asked, the session had written up to 6: turn t1 was over, t2 under way.
	s.on("GET /v1/sessions/{id}", http.StatusOK, session("s1", 6, ""))
	s.stream(true,
		started(1, "t1"), said(2, "old"), ended(3, "t1", "end_turn"),
		started(4, "t2"), said(5, "Ticket #42 is"), said(6, "about login."), ended(7, "t2", "end_turn"),
	)
	session := s.client().Session("s1")
	got, err := session.Reply(t.Context())
	if err != nil || got != "Ticket #42 is\n\nabout login." {
		t.Fatalf("%q %v", got, err)
	}
	if q := s.eventsAsked(); len(q) != 1 || q[0] != "follow=true" {
		t.Errorf("asked %v", q)
	}
	if from, _ := session.cursor(); from != 8 {
		t.Errorf("next read from %d", from)
	}
}

func TestReplyAfterAReplyReadsFromWhereItEnded(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions/{id}", http.StatusOK, session("s1", 0, ""))
	s.mux.HandleFunc("GET /v1/sessions/{id}/events", func(w http.ResponseWriter, r *http.Request) {
		lines := []string{started(1, "t1"), said(2, "one"), ended(3, "t1", "end_turn")}
		if r.URL.Query().Get("from") == "4" {
			lines = []string{started(4, "t2"), said(5, "two"), ended(6, "t2", "end_turn")}
		}
		for _, l := range lines {
			_, _ = io.WriteString(w, l+"\n")
		}
		_ = http.NewResponseController(w).Flush()
		<-r.Context().Done()
	})
	session := s.client().Session("s1")
	for _, want := range []string{"one", "two"} {
		if got, err := session.Reply(t.Context()); err != nil || got != want {
			t.Fatalf("%q %v, want %q", got, err, want)
		}
	}
	// The second asks nothing of the session: its handle knows where it is.
	if n := len(s.asked()); n != 3 {
		t.Errorf("%d requests: %+v", n, s.asked())
	}
}

func TestReplyAfterStartIsItsFirstTurnsAnswer(t *testing.T) {
	s := newStub(t)
	s.on("POST /v1/sessions", http.StatusCreated, session("s1", 0, ""))
	s.stream(true,
		ev(1, `{"type":"state","state":"starting","sandboxState":"creating"}`),
		ev(2, `{"type":"user","turnId":"f","text":"Summarize","source":"user"}`),
		started(3, "f"), said(4, "Done."), ended(5, "f", "end_turn"),
	)
	c := s.client()
	session, err := c.Start(t.Context(), Start{Text: "Summarize"})
	if err != nil {
		t.Fatal(err)
	}
	if got, err := session.Reply(t.Context()); err != nil || got != "Done." {
		t.Fatalf("%q %v", got, err)
	}
	// Nothing was asked of the session but its stream, from its start.
	if a := s.asked(); len(a) != 2 || a[1].query != "follow=true" {
		t.Errorf("%+v", a)
	}
}

func TestReplyOfATurnCutShortIsATurnError(t *testing.T) {
	s := newStub(t)
	s.on("POST /v1/sessions", http.StatusCreated, session("s1", 0, ""))
	s.stream(true,
		started(1, "t1"), said(2, "Halfway"),
		ev(3, `{"type":"error","code":"provider_error","message":"overloaded"}`),
		ended(4, "t1", "error"),
	)
	session, err := s.client().Start(t.Context(), Start{Text: "go"})
	if err != nil {
		t.Fatal(err)
	}
	got, err := session.Reply(t.Context())
	var te *TurnError
	if got != "Halfway" || !errors.As(err, &te) || te.TurnID != "t1" || te.StopReason != "error" || te.Message != "overloaded" {
		t.Errorf("%q %v", got, err)
	}
}

func TestReplyOfASessionThatFailedIsErrFailed(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions/{id}", http.StatusOK, session("s1", 2, ""))
	s.stream(true,
		// A failure before the call was over then: the session was woken since.
		ev(1, `{"type":"state","state":"failed","sandboxState":"failed"}`),
		ev(2, `{"type":"state","state":"idle","sandboxState":"ready"}`),
		ev(3, `{"type":"error","code":"sandbox_failed","message":"no machine"}`),
		ev(4, `{"type":"state","state":"failed","sandboxState":"failed"}`),
	)
	_, err := s.client().Session("s1").Reply(t.Context())
	if !errors.Is(err, ErrFailed) || !strings.Contains(err.Error(), "no machine") {
		t.Errorf("%v", err)
	}
}

func TestReplyOfAStreamThatEndsIsErrStreamEnded(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions/{id}", http.StatusOK, session("s1", 0, ""))
	s.stream(false, started(1, "t1"), said(2, "Half"))
	got, err := s.client().Session("s1").Reply(t.Context())
	if got != "Half" || !errors.Is(err, ErrStreamEnded) {
		t.Errorf("%q %v", got, err)
	}
}

func TestReplyOfALineNotUnderstoodIsItsError(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions/{id}", http.StatusOK, session("s1", 0, ""))
	s.stream(true, started(1, "t1"), said(2, "Half"), ev(3, `{"type":"turn_ended","turnId":7}`))
	got, err := s.client().Session("s1").Reply(t.Context())
	if got != "Half" || err == nil || errors.Is(err, ErrStreamEnded) {
		t.Errorf("%q %v", got, err)
	}
}

func TestReplyOfNoSessionIsNotFound(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions/{id}", http.StatusNotFound, `{"error":{"code":"not_found","message":"no"}}`)
	_, err := s.client().Session("gone").Reply(t.Context())
	apiCode(t, err, runyard.ErrorCodeNotFound)
}

func TestReplyWhoseStreamIsRefusedIsItsError(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions/{id}", http.StatusOK, session("s1", 0, ""))
	s.on("GET /v1/sessions/{id}/events", http.StatusForbidden, forbidden)
	_, err := s.client().Session("s1").Reply(t.Context())
	apiCode(t, err, runyard.ErrorCodeForbidden)
}

func TestReplyFromWhatIsNoLongerKeptReadsWhatIs(t *testing.T) {
	s := newStub(t)
	s.mux.HandleFunc("GET /v1/sessions/{id}/events", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Has("from") {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusConflict)
			_, _ = io.WriteString(w, `{"error":{"code":"gapped","message":"trimmed"}}`)
			return
		}
		for _, l := range []string{started(50, "t9"), said(51, "kept"), ended(52, "t9", "end_turn")} {
			_, _ = io.WriteString(w, l+"\n")
		}
		_ = http.NewResponseController(w).Flush()
		<-r.Context().Done()
	})
	session := s.client().Session("s1")
	session.mark(10)
	got, err := session.Reply(t.Context())
	if err != nil || got != "kept" {
		t.Fatalf("%q %v", got, err)
	}
	if q := s.eventsAsked(); len(q) != 2 || q[0] != "follow=true&from=10" || q[1] != "follow=true" {
		t.Errorf("asked %v", q)
	}
}

func TestReplyEndsWithItsContext(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions/{id}", http.StatusOK, session("s1", 0, ""))
	ctx, cancel := context.WithCancel(t.Context())
	defer cancel()
	s.mux.HandleFunc("GET /v1/sessions/{id}/events", func(w http.ResponseWriter, r *http.Request) {
		_, _ = io.WriteString(w, started(1, "t1")+"\n")
		_ = http.NewResponseController(w).Flush()
		// The caller gives up while the turn is under way.
		cancel()
		<-r.Context().Done()
	})
	if _, err := s.client().Session("s1").Reply(ctx); !errors.Is(err, context.Canceled) {
		t.Errorf("%v", err)
	}
}

func TestMarkOnlyMovesForward(t *testing.T) {
	session := (&Client{}).Session("s1")
	session.mark(9)
	session.mark(4)
	if from, known := session.cursor(); from != 9 || !known {
		t.Errorf("%d %v", from, known)
	}
}

// The pattern of a backend: the turn sent in one request, its answer read
// in another, by a handle made of the id alone, after the turn ended.
func TestLastReplyIsTheTurnThatEndedLast(t *testing.T) {
	s := newStub(t)
	s.stream(false,
		started(1, "t1"), said(2, "old"), ended(3, "t1", "end_turn"),
		user(4, "t2"), started(5, "t2"), said(6, "Ticket #42 is"),
		ev(7, `{"type":"text","text":"a sub-agent's","parentToolId":"a1"}`),
		said(8, "about login."), ended(9, "t2", "end_turn"),
		ev(10, `{"type":"state","state":"idle","sandboxState":"ready"}`),
	)
	session := s.client().Session("s1")
	got, err := session.LastReply(t.Context())
	if err != nil || got != "Ticket #42 is\n\nabout login." {
		t.Fatalf("%q %v", got, err)
	}
	// Read to its end, not followed.
	if q := s.eventsAsked(); len(q) != 1 || q[0] != "" {
		t.Errorf("asked %v", q)
	}
	// A Reply after it waits for the turn after it.
	if from, known := session.cursor(); !known || from != 10 {
		t.Errorf("next read from %d (%v)", from, known)
	}
}

func TestLastReplyOfATurnCutShortIsATurnError(t *testing.T) {
	s := newStub(t)
	s.stream(false,
		started(1, "t1"), said(2, "Halfway"),
		ev(3, `{"type":"error","code":"provider_error","message":"overloaded"}`),
		ended(4, "t1", "error"),
		// A turn under way has not ended: it is not the last that did.
		started(5, "t2"), said(6, "not yet"),
	)
	got, err := s.client().Session("s1").LastReply(t.Context())
	var te *TurnError
	if got != "Halfway" || !errors.As(err, &te) || te.TurnID != "t1" || te.Message != "overloaded" {
		t.Errorf("%q %v", got, err)
	}
}

func TestLastReplyOfNoTurnEndedIsErrNoReply(t *testing.T) {
	s := newStub(t)
	s.stream(false, ev(1, `{"type":"state","state":"starting","sandboxState":"creating"}`), started(2, "t1"))
	session := s.client().Session("s1")
	if got, err := session.LastReply(t.Context()); got != "" || !errors.Is(err, ErrNoReply) {
		t.Errorf("%q %v", got, err)
	}
	if _, known := session.cursor(); known {
		t.Error("a handle with no turn ended knows where the next is")
	}
}

func TestLastReplyOfNoSessionIsNotFound(t *testing.T) {
	s := newStub(t)
	s.on("GET /v1/sessions/{id}/events", http.StatusNotFound, `{"error":{"code":"not_found","message":"no"}}`)
	_, err := s.client().Session("gone").LastReply(t.Context())
	apiCode(t, err, runyard.ErrorCodeNotFound)
}

func TestLastReplyOfALineNotUnderstoodIsItsError(t *testing.T) {
	for name, line := range map[string]string{
		"not JSON":         `{"line":`,
		"a field mistyped": ev(2, `{"type":"turn_ended","turnId":7}`),
	} {
		t.Run(name, func(t *testing.T) {
			s := newStub(t)
			s.stream(false, started(1, "t1"), line, ended(3, "t1", "end_turn"))
			if got, err := s.client().Session("s1").LastReply(t.Context()); got != "" || err == nil {
				t.Errorf("%q %v", got, err)
			}
		})
	}
}

// What changed since the turn was sent no longer kept, the session as it is
// says whether the turn still waits: gone from its queue, its transcript
// says the rest; still in it, the changes from now on say when it leaves.
func TestSendWhoseChangesAreGappedReadsTheSessionAsItIs(t *testing.T) {
	for name, waits := range map[string]bool{"gone": false, "still waiting": true} {
		t.Run(name, func(t *testing.T) {
			s := newStub(t)
			var mu sync.Mutex
			gets, follows := 0, 0
			s.mux.HandleFunc("GET /v1/sessions/{id}", func(w http.ResponseWriter, _ *http.Request) {
				mu.Lock()
				gets++
				again := gets > 1
				mu.Unlock()
				queue := ""
				if again && waits {
					queue = fmt.Sprintf(`,"queue":[{"turnId":%q,"text":"t","source":"api"}]`, s.sentTurn())
				}
				w.Header().Set("Content-Type", "application/json")
				_, _ = io.WriteString(w, session("s1", 4, queue))
			})
			s.on("POST /v1/sessions/{id}/turns", http.StatusAccepted, `{"turnId":"x","position":0}`)
			s.on("GET /v1/sessions", http.StatusOK, `{"items":[],"changeSeq":10}`)
			s.mux.HandleFunc("GET /v1/changes", func(w http.ResponseWriter, r *http.Request) {
				mu.Lock()
				follows++
				first := follows == 1
				mu.Unlock()
				if first {
					w.Header().Set("Content-Type", "application/json")
					w.WriteHeader(http.StatusConflict)
					_, _ = io.WriteString(w, `{"error":{"code":"gapped","message":"trimmed"}}`)
					return
				}
				w.Header().Set("Content-Type", "application/x-ndjson")
				_, _ = io.WriteString(w, change(11, "s1", nil, "")+"\n")
				_ = http.NewResponseController(w).Flush()
				<-r.Context().Done()
			})
			s.mux.HandleFunc("GET /v1/sessions/{id}/events", func(w http.ResponseWriter, r *http.Request) {
				turn := s.sentTurn()
				for _, l := range []string{user(5, turn), started(6, turn), said(7, "done"), ended(8, turn, "end_turn")} {
					_, _ = io.WriteString(w, l+"\n")
				}
				_ = http.NewResponseController(w).Flush()
				<-r.Context().Done()
			})
			got, err := s.client().Session("s1").Send(t.Context(), "hi")
			if err != nil || got != "done" {
				t.Fatalf("%q %v", got, err)
			}
			mu.Lock()
			defer mu.Unlock()
			if want := map[bool]int{false: 1, true: 2}[waits]; follows != want {
				t.Errorf("followed the changes %d times, want %d", follows, want)
			}
		})
	}
}
