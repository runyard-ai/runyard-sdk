//go:build conformance

package ry

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"slices"
	"strings"
	"testing"
	"time"

	runyard "github.com/runyard-ai/runyard-sdk/go"
)

// hold is agentsserver's Hold: a turn its harness works on until it is
// interrupted.
const hold = "Hold until interrupted"

// conformance is the server RUNYARD_AGENTS_URL names, spoken to with the key
// RUNYARD_AGENTS_KEY (sessions.read, sessions.write, sessions.delete), and
// the prefix this suite's names are made of.
//
// A turn is answered by the session's harness, which a server of
// runyard-agents' test/sdk plays: each turn said back, "You said: " and its
// text (test/doubles/agentsserver's Answer) — but a turn that starts with
// hold, which is under way until it is interrupted.
//
//	RUNYARD_AGENTS_URL=… RUNYARD_AGENTS_APP_KEY=… go test -tags conformance ./...
func conformance(t *testing.T) (*Client, string, string) {
	t.Helper()
	url, key, prefix := os.Getenv("RUNYARD_AGENTS_URL"), os.Getenv("RUNYARD_AGENTS_APP_KEY"), os.Getenv("RUNYARD_AGENTS_PREFIX")
	if url == "" || key == "" {
		t.Fatal("RUNYARD_AGENTS_URL and RUNYARD_AGENTS_APP_KEY name the server, and an application's key of it")
	}
	if prefix == "" {
		prefix = "sdk-go"
	}
	c, err := New(url, key)
	if err != nil {
		t.Fatal(err)
	}
	return c, url, prefix
}

// A session started with a first turn, its answer waited for, another turn
// sent and answered, its transcript followed, found by its labels and
// deleted.
func TestConformance(t *testing.T) {
	c, _, prefix := conformance(t)
	ctx := t.Context()
	labels := map[string]string{"conformance": prefix + "-ry"}
	s, err := c.Start(ctx, Start{Title: "ry", Text: "Summarize ticket #42", Labels: labels})
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = s.Delete(t.Context()) })

	if got, err := s.Reply(ctx); err != nil || got != "You said: Summarize ticket #42" {
		t.Fatalf("the first turn's answer: %q %v", got, err)
	}
	if got, err := s.Send(ctx, "Now draft a reply"); err != nil || got != "You said: Now draft a reply" {
		t.Fatalf("the second turn's answer: %q %v", got, err)
	}
	// A backend's other request, after the turn ended: a handle of the id
	// alone reads the answer of the turn that ended last.
	if got, err := c.Session(s.ID()).LastReply(ctx); err != nil || got != "You said: Now draft a reply" {
		t.Fatalf("the last answer: %q %v", got, err)
	}

	// A handle made of its id alone finds the same transcript.
	var users []string
	var ended int
	for ev, err := range c.Session(s.ID()).Events(ctx) {
		if err != nil {
			t.Fatal(err)
		}
		switch e := ev.(type) {
		case User:
			users = append(users, e.Text)
		case TurnEnded:
			if e.StopReason != runyard.TurnEndedEventStopReasonEndTurn {
				t.Errorf("a turn ended %s", e.StopReason)
			}
			ended++
		}
		if ended == 2 {
			break
		}
	}
	if !slices.Equal(users, []string{"Summarize ticket #42", "Now draft a reply"}) {
		t.Errorf("the turns given: %q", users)
	}

	listed, err := c.Sessions(ctx, List{Labels: labels})
	if err != nil {
		t.Fatal(err)
	}
	if len(listed) != 1 || listed[0].ID != s.ID() || listed[0].Title != "ry" {
		t.Errorf("listed by its labels: %+v", listed)
	}
	info, err := s.Info(ctx)
	if err != nil || info.ID != s.ID() || info.Labels["conformance"] != labels["conformance"] {
		t.Errorf("%+v %v", info, err)
	}

	// What the server refuses is its error, with its code.
	if _, err := c.Session(prefix+"-nobodys").Send(ctx, "hello"); !runyard.IsCode(err, runyard.ErrorCodeNotFound) {
		t.Errorf("a turn to no session: %v", err)
	}
	if err := s.Delete(ctx); err != nil {
		t.Fatal(err)
	}
	if _, err := s.Info(ctx); !runyard.IsCode(err, runyard.ErrorCodeNotFound) {
		t.Errorf("a session deleted: %v", err)
	}
}

// A session for an end user, a token for their browser, and what the token
// reaches: that session, its turns sent for them, and nothing else.
//
// It needs a server with session tokens and end users
// (docs/applications.md), and a key of an application's: until the server
// has them, POST /v1/sessions/{id}/tokens is 501 not_implemented and this
// fails there.
func TestConformanceEndUsersAndTokens(t *testing.T) {
	c, url, prefix := conformance(t)
	ctx := t.Context()
	user := &EndUser{ID: prefix + "-u123", Email: prefix + "-alice@acme.example"}
	s, err := c.Start(ctx, Start{Text: "Hello", EndUser: user})
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = s.Delete(t.Context()) })
	// The handle that started it waits for its first turn: a handle made of
	// the id alone waits for the turn under way, or the next, and the first
	// may well be over by then.
	if got, err := s.Reply(ctx); err != nil || got != "You said: Hello" {
		t.Fatalf("its first answer: %q %v", got, err)
	}
	other, err := c.Start(ctx, Start{EndUser: &EndUser{ID: prefix + "-u456"}})
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = other.Delete(t.Context()) })

	tok, err := s.Token(ctx, TokenOptions{EndUser: user, TTL: 10 * time.Minute})
	if err != nil {
		t.Fatalf("a session token: %v", err)
	}
	if !strings.HasPrefix(tok.Value, "ryst_") || tok.SessionID != s.ID() || tok.EndUser == nil || *tok.EndUser != *user ||
		tok.ExpiresAt.After(time.Now().Add(11*time.Minute)) || tok.ExpiresAt.Before(time.Now()) {
		t.Errorf("the token: %+v", tok)
	}
	if _, err := s.Token(ctx, TokenOptions{EndUser: &EndUser{ID: prefix + "-u456"}}); !runyard.IsCode(err, runyard.ErrorCodeBadRequest) {
		t.Errorf("a token of another end user's: %v", err)
	}

	// The token is a browser's key to that one session.
	browser, err := New(url, tok.Value)
	if err != nil {
		t.Fatal(err)
	}
	mine := browser.Session(s.ID())
	if info, err := mine.Info(ctx); err != nil || info.ID != s.ID() {
		t.Fatalf("read with the token: %+v %v", info, err)
	}
	if got, err := mine.Send(ctx, "From the browser"); err != nil || got != "You said: From the browser" {
		t.Fatalf("sent with the token: %q %v", got, err)
	}
	var sentFor *EndUser
	for ev, err := range mine.Events(ctx) {
		if err != nil {
			t.Fatal(err)
		}
		if u, ok := ev.(User); ok && u.Text == "From the browser" {
			sentFor = u.EndUser
			break
		}
	}
	if sentFor == nil || sentFor.ID != user.ID {
		t.Errorf("a token's turn was sent for %+v", sentFor)
	}
	if _, err := browser.Session(other.ID()).Info(ctx); err == nil {
		t.Error("a token reached another session")
	}
	if _, err := browser.Start(ctx, Start{}); err == nil {
		t.Error("a token started a session")
	}
	if listed, err := browser.Sessions(ctx, List{}); err != nil || len(listed) != 1 || listed[0].ID != s.ID() {
		t.Errorf("a token's list: %+v %v", listed, err)
	}
	if _, err := mine.Token(ctx, TokenOptions{}); err == nil {
		t.Error("a token minted a token")
	}

	// Listed by end user: theirs, and nobody else's.
	listed, err := c.Sessions(ctx, List{EndUser: user.ID})
	if err != nil {
		t.Fatal(err)
	}
	if len(listed) != 1 || listed[0].ID != s.ID() || listed[0].EndUser == nil || listed[0].EndUser.ID != user.ID {
		t.Errorf("listed for %s: %+v", user.ID, listed)
	}
}

// A turn sent behind one under way and taken out of the queue — cancelled
// from the page, or dropped by an interrupt that drops the queue — is a
// *TurnGoneError to the Send that waits for it, rather than a wait for ever.
func TestConformanceATurnTakenOutOfTheQueueIsGone(t *testing.T) {
	c, url, _ := conformance(t)
	for name, takeOut := range map[string]func(ctx context.Context, s *Session, turn string) error{
		"cancelled": func(ctx context.Context, s *Session, turn string) error {
			res, err := c.API().CancelQueuedTurnWithResponse(ctx, s.ID(), turn)
			return runyard.Checked(res, err)
		},
		"dropped": func(ctx context.Context, s *Session, _ string) error {
			res, err := c.API().InterruptWithResponse(ctx, s.ID(), runyard.InterruptJSONRequestBody{DropQueued: new(true)})
			return runyard.Checked(res, err)
		},
	} {
		t.Run(name, func(t *testing.T) {
			ctx := t.Context()
			s, err := c.Start(ctx, Start{Text: hold})
			if err != nil {
				t.Fatal(err)
			}
			t.Cleanup(func() { _ = s.Delete(t.Context()) })
			// Under way: what is sent now waits behind it.
			for ev, err := range s.Events(ctx) {
				if err != nil {
					t.Fatal(err)
				}
				if _, ok := ev.(TurnStarted); ok {
					break
				}
			}
			// The turn is taken out as Send starts to wait for it: once
			// it is sent, and before Send follows what becomes of it.
			key := os.Getenv("RUNYARD_AGENTS_APP_KEY")
			taking := &takingOut{take: func(turn string) error { return takeOut(ctx, s, turn) }}
			waiting, err := New(url, key, WithHTTPClient(taking))
			if err != nil {
				t.Fatal(err)
			}
			got, err := waiting.Session(s.ID()).Send(ctx, "Never started")
			var gone *TurnGoneError
			if got != "" || !errors.As(err, &gone) || gone.TurnID == "" || gone.TurnID != taking.turn {
				t.Fatalf("%q %v", got, err)
			}
			if taking.err != nil {
				t.Fatal(taking.err)
			}
		})
	}
}

// takingOut is an HTTP client that takes the turn it sees sent out of the
// queue just before the changes are asked for, which is when Send starts to
// follow what becomes of it.
type takingOut struct {
	take  func(turn string) error
	turn  string
	taken bool
	err   error
}

func (d *takingOut) Do(r *http.Request) (*http.Response, error) {
	if r.Method == http.MethodPost && strings.HasSuffix(r.URL.Path, "/turns") {
		body, err := r.GetBody()
		if err != nil {
			return nil, err
		}
		var turn runyard.Turn
		if err := json.NewDecoder(body).Decode(&turn); err != nil {
			return nil, err
		}
		d.turn = turn.TurnId
	}
	if r.URL.Path == "/v1/changes" && d.turn != "" && !d.taken {
		d.taken, d.err = true, d.take(d.turn)
	}
	return http.DefaultClient.Do(r)
}
