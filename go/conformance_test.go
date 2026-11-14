//go:build conformance

package runyard

import (
	"errors"
	"io"
	"os"
	"slices"
	"testing"
)

// The SDK against a server: the one RUNYARD_AGENTS_URL names, with the key
// RUNYARD_AGENTS_KEY (sessions.read, sessions.write, sessions.delete and
// sandbox), making a session named for RUNYARD_AGENTS_PREFIX and deleting it.
// The same suite as every other language's SDK has: runyard-agents' test/sdk
// runs each against a server of its own.
//
//	RUNYARD_AGENTS_URL=… RUNYARD_AGENTS_KEY=… go test -tags conformance ./...
func TestConformance(t *testing.T) {
	url, key, prefix := os.Getenv("RUNYARD_AGENTS_URL"), os.Getenv("RUNYARD_AGENTS_KEY"), os.Getenv("RUNYARD_AGENTS_PREFIX")
	if url == "" || key == "" {
		t.Fatal("RUNYARD_AGENTS_URL and RUNYARD_AGENTS_KEY name the server, and a key of it")
	}
	if prefix == "" {
		prefix = "sdk-go"
	}
	ctx := t.Context()
	c, err := NewClientWithResponses(url, WithKey(key))
	if err != nil {
		t.Fatal(err)
	}

	// Who the key is.
	self, err := c.GetSelfWithResponse(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if err := Check(self.StatusCode(), self.Body); err != nil {
		t.Fatal(err)
	}
	if owner := os.Getenv("RUNYARD_AGENTS_OWNER"); owner != "" && (self.JSON200.Email == nil || string(*self.JSON200.Email) != owner) {
		t.Errorf("self is %v, want %s", self.JSON200.Email, owner)
	}

	// A session made, read back and listed.
	id := prefix + "-session"
	terminal, harness := true, "codex"
	made, err := c.CreateSessionWithResponse(ctx, id, SessionSpec{Terminal: &terminal, Harness: &harness})
	if err != nil {
		t.Fatal(err)
	}
	if err := Check(made.StatusCode(), made.Body); err != nil {
		t.Fatal(err)
	}
	if made.JSON201 == nil || made.JSON201.Id != id {
		t.Fatalf("made %s", made.Body)
	}
	got, err := c.GetSessionWithResponse(ctx, id)
	if err != nil || got.JSON200 == nil || got.JSON200.Id != id {
		t.Fatalf("%v %s", err, got.Body)
	}
	listed, err := c.ListSessionsWithResponse(ctx, nil)
	if err != nil || listed.JSON200 == nil {
		t.Fatalf("%v %s", err, listed.Body)
	}
	if !slices.ContainsFunc(listed.JSON200.Items, func(s Session) bool { return s.Id == id }) {
		t.Errorf("%s is not listed: %s", id, listed.Body)
	}

	// Its events followed until it is idle: the stream read as it is written.
	follow := true
	events, err := c.Events(ctx, id, &StreamEventsParams{Follow: &follow})
	if err != nil {
		t.Fatal(err)
	}
	var seen []int64
	for idle := false; !idle; {
		line, err := events.Next()
		if err != nil {
			_ = events.Close()
			t.Fatalf("before the session was idle: %v", err)
		}
		v, err := line.Value()
		if err != nil {
			t.Fatal(err)
		}
		ev, ok := v.(*SessionEvent)
		if !ok {
			continue
		}
		seen = append(seen, ev.Seq)
		kind, err := ev.Event.Discriminator()
		if err != nil {
			t.Fatal(err)
		}
		if kind == "state" {
			state, err := ev.Event.AsStateEvent()
			if err != nil {
				t.Fatal(err)
			}
			idle = state.State == SessionStateIdle
		}
	}
	if err := events.Close(); err != nil {
		t.Fatal(err)
	}

	// Not followed, the transcript so far, and then its end.
	events, err = c.Events(ctx, id, nil)
	if err != nil {
		t.Fatal(err)
	}
	defer func() { _ = events.Close() }()
	var kept []int64
	for {
		line, err := events.Next()
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			t.Fatal(err)
		}
		v, err := line.Value()
		if err != nil {
			t.Fatal(err)
		}
		ev, ok := v.(*SessionEvent)
		if !ok {
			t.Fatalf("a stream not followed has a %T", v)
		}
		kept = append(kept, ev.Seq)
	}
	if len(kept) < len(seen) || !slices.Equal(kept[:len(seen)], seen) || !slices.IsSorted(kept) {
		t.Errorf("kept %v, followed %v", kept, seen)
	}

	// What the server refuses is an error with its code.
	missing, err := c.GetSessionWithResponse(ctx, prefix+"-nobodys")
	if err != nil {
		t.Fatal(err)
	}
	if err := Check(missing.StatusCode(), missing.Body); !IsCode(err, ErrorCodeNotFound) {
		t.Errorf("%v", err)
	}
	if _, err := c.Events(ctx, prefix+"-nobodys", nil); !IsCode(err, ErrorCodeNotFound) {
		t.Errorf("%v", err)
	}

	// Deleted, it is not there.
	gone, err := c.DeleteSessionWithResponse(ctx, id)
	if err != nil {
		t.Fatal(err)
	}
	if err := Check(gone.StatusCode(), gone.Body); err != nil {
		t.Fatal(err)
	}
	after, err := c.GetSessionWithResponse(ctx, id)
	if err != nil {
		t.Fatal(err)
	}
	if err := Check(after.StatusCode(), after.Body); !IsCode(err, ErrorCodeNotFound) {
		t.Errorf("a session deleted: %v", err)
	}
}
