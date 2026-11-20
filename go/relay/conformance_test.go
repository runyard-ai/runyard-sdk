//go:build conformance

package relay

import (
	"context"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"slices"
	"strings"
	"testing"

	openapi_types "github.com/oapi-codegen/runtime/types"

	runyard "github.com/runyard-ai/runyard-sdk/go"
)

// The relay against a server: the one RUNYARD_AGENTS_URL names, with the key
// RUNYARD_AGENTS_KEY (sessions.read, sessions.write, sessions.delete,
// sessions.person and users.admin), two people of the workspace it adds
// each reaching only their own sessions through it. The same suite as the
// TypeScript relay's: runyard-agents' test/sdk runs each against a server of
// its own.
//
// What reads the relay is the SDK itself: the relay is runyard-agents' API,
// under the same paths and in the same words.
func TestConformance(t *testing.T) {
	url, key, prefix := os.Getenv("RUNYARD_AGENTS_URL"), os.Getenv("RUNYARD_AGENTS_KEY"), os.Getenv("RUNYARD_AGENTS_PREFIX")
	if url == "" || key == "" {
		t.Fatal("RUNYARD_AGENTS_URL and RUNYARD_AGENTS_KEY name the server, and a key of it")
	}
	if prefix == "" {
		prefix = "sdk-go"
	}
	ctx := t.Context()
	admin, err := runyard.NewClientWithResponses(url, runyard.WithKey(key))
	if err != nil {
		t.Fatal(err)
	}
	grace, alan := prefix+"-grace@example.com", prefix+"-alan@example.com"
	for _, email := range []string{grace, alan} {
		res, err := admin.AddUserWithResponse(ctx, openapi_types.Email(email), runyard.UserUpdate{Role: runyard.Member})
		if err := runyard.Checked(res, err); err != nil {
			t.Fatalf("adding %s: %v", email, err)
		}
	}

	h, err := New(Config{
		URL: url, Key: key,
		Person: whom,
		Scope: func(_ *http.Request, p Person) (Scope, error) {
			return Scope{Owner: p.Email, Labels: map[string]string{"conformance.user": p.Email}}, nil
		},
		// A session no provider is needed for, as the SDK's own suite starts.
		Start: func(_ *http.Request, _ Person, spec *runyard.SessionSpec) error {
			terminal, harness := true, "codex"
			spec.Terminal, spec.Harness = &terminal, &harness
			return nil
		},
	})
	if err != nil {
		t.Fatal(err)
	}
	server := httptest.NewServer(http.StripPrefix("/agents", h))
	t.Cleanup(server.Close)
	as := func(email string) *runyard.ClientWithResponses {
		c, err := runyard.NewClientWithResponses(server.URL+"/agents", runyard.WithRequestEditorFn(func(_ context.Context, r *http.Request) error {
			r.Header.Set("X-Test-Person", email)
			return nil
		}))
		if err != nil {
			t.Fatal(err)
		}
		return c
	}
	asGrace, asAlan := as(grace), as(alan)

	// Started through the relay: Grace's, labelled hers, whatever she says.
	title := "Grace's"
	made, err := asGrace.StartSessionWithResponse(ctx, nil, runyard.SessionSpec{Title: &title})
	if err := runyard.Checked(made, err); err != nil {
		t.Fatal(err)
	}
	s := made.JSON201
	if s == nil {
		s = made.JSON200
	}
	if s == nil || !strings.EqualFold(s.Owner, grace) || s.Labels["conformance.user"] != grace || s.Title != title {
		t.Fatalf("started %s", made.Body)
	}
	id := s.Id
	forged := grace
	refused, err := asGrace.StartSessionWithResponse(ctx, nil, runyard.SessionSpec{Owner: (*openapi_types.Email)(&forged)})
	if err := runyard.Checked(refused, err); !runyard.IsCode(err, runyard.ErrorCodeBadRequest) {
		t.Errorf("an owner said by the browser: %v", err)
	}

	// Hers to read, list and follow; nobody else's.
	got, err := asGrace.GetSessionWithResponse(ctx, id)
	if err := runyard.Checked(got, err); err != nil {
		t.Fatal(err)
	}
	listed, err := asGrace.ListSessionsWithResponse(ctx, nil)
	if err := runyard.Checked(listed, err); err != nil || !slices.ContainsFunc(listed.JSON200.Items, func(x runyard.Session) bool { return x.Id == id }) {
		t.Errorf("%v: %s is not listed: %s", err, id, listed.Body)
	}
	theirs, err := asAlan.GetSessionWithResponse(ctx, id)
	if err := runyard.Checked(theirs, err); !runyard.IsCode(err, runyard.ErrorCodeNotFound) {
		t.Errorf("Alan reading Grace's: %v", err)
	}
	if _, err := asAlan.Events(ctx, id, nil); !runyard.IsCode(err, runyard.ErrorCodeNotFound) {
		t.Errorf("Alan reading Grace's transcript: %v", err)
	}
	alans, err := asAlan.ListSessionsWithResponse(ctx, nil)
	if err := runyard.Checked(alans, err); err != nil || slices.ContainsFunc(alans.JSON200.Items, func(x runyard.Session) bool { return x.Id == id }) {
		t.Errorf("%v: Alan's list has Grace's: %s", err, alans.Body)
	}
	gone, err := asAlan.DeleteSessionWithResponse(ctx, id)
	if err := runyard.Checked(gone, err); !runyard.IsCode(err, runyard.ErrorCodeNotFound) {
		t.Errorf("Alan deleting Grace's: %v", err)
	}

	// Its transcript followed through the relay until it is idle, as it is
	// written.
	follow := true
	events, err := asGrace.Events(ctx, id, &runyard.StreamEventsParams{Follow: &follow})
	if err != nil {
		t.Fatal(err)
	}
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
		if ev, ok := v.(*runyard.SessionEvent); ok {
			if kind, _ := ev.Event.Discriminator(); kind == "state" {
				state, err := ev.Event.AsStateEvent()
				if err != nil {
					t.Fatal(err)
				}
				idle = state.State == runyard.SessionStateIdle
			}
		}
	}
	if err := events.Close(); err != nil {
		t.Fatal(err)
	}

	// Its changes: Grace's has hers, Alan's has none of it.
	for email, c := range map[string]*runyard.ClientWithResponses{grace: asGrace, alan: asAlan} {
		changes, err := c.Changes(ctx, nil)
		if err != nil {
			t.Fatal(err)
		}
		var ids []string
		for {
			change, err := changes.Next()
			if errors.Is(err, io.EOF) {
				break
			}
			if err != nil {
				t.Fatal(err)
			}
			ids = append(ids, change.SessionId)
		}
		_ = changes.Close()
		if has := slices.Contains(ids, id); has != (email == grace) {
			t.Errorf("%s's changes: %v", email, ids)
		}
	}

	// A file she attaches is kept for her: hers to take off, not Alan's.
	kept, err := asGrace.CreateUploadWithBodyWithResponse(ctx, &runyard.CreateUploadParams{Name: "notes.txt"}, "application/octet-stream", strings.NewReader("hello"))
	if err := runyard.Checked(kept, err); err != nil || kept.JSON201 == nil || kept.JSON201.Size != 5 {
		t.Fatalf("an upload: %v %s", err, kept.Body)
	}
	upload := kept.JSON201.Id
	taken, err := asAlan.DeleteUploadWithResponse(ctx, upload, nil)
	if err := runyard.Checked(taken, err); !runyard.IsCode(err, runyard.ErrorCodeNotFound) {
		t.Errorf("Alan taking off Grace's file: %v", err)
	}
	// Nor is her session his to name in a turn of his own.
	alansOwn, err := asAlan.StartSessionWithResponse(ctx, nil, runyard.SessionSpec{})
	if err := runyard.Checked(alansOwn, err); err != nil {
		t.Fatal(err)
	}
	mine := alansOwn.JSON201
	if mine == nil {
		mine = alansOwn.JSON200
	}
	naming := []runyard.Attachment{{Kind: runyard.AttachmentKindSession, SessionId: &id}}
	sent, err := asAlan.SendTurnWithResponse(ctx, mine.Id, runyard.Turn{TurnId: "naming-graces", Text: "read hers", Attachments: &naming})
	if err := runyard.Checked(sent, err); !runyard.IsCode(err, runyard.ErrorCodeBadRequest) {
		t.Errorf("Alan naming Grace's session: %v", err)
	}
	removed, err := asAlan.DeleteSessionWithResponse(ctx, mine.Id)
	if err := runyard.Checked(removed, err); err != nil {
		t.Errorf("Alan deleting his own: %v", err)
	}
	dropped, err := asGrace.DeleteUploadWithResponse(ctx, upload, nil)
	if err := runyard.Checked(dropped, err); err != nil {
		t.Errorf("Grace taking off her file: %v", err)
	}

	// Renamed, and deleted, by her.
	renamed := "Renamed"
	updated, err := asGrace.UpdateSessionWithResponse(ctx, id, runyard.SessionUpdate{Title: &renamed})
	if err := runyard.Checked(updated, err); err != nil || updated.JSON200 == nil || updated.JSON200.Title != renamed {
		t.Errorf("renamed: %v %s", err, updated.Body)
	}
	deleted, err := asGrace.DeleteSessionWithResponse(ctx, id)
	if err := runyard.Checked(deleted, err); err != nil {
		t.Fatal(err)
	}
	after, err := admin.GetSessionWithResponse(ctx, id)
	if err := runyard.Checked(after, err); !runyard.IsCode(err, runyard.ErrorCodeNotFound) {
		t.Errorf("a session deleted: %v", err)
	}
}
