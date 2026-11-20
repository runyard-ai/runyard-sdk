// Package ry is the short way to runyard-agents: start a session, wait for
// its answer, say something else, and hand a browser a token for it —
// without knowing what the API calls owners, scopes or labels.
//
//	c, err := ry.New("https://agents.example.com", key)
//	s, err := c.Start(ctx, ry.Start{Profile: "support", Text: "Summarize ticket #42"})
//	answer, err := s.Reply(ctx)
//	answer, err = s.Send(ctx, "Now draft a reply")
//
// For one of an application's own users, and their browser:
//
//	s, err := c.Start(ctx, ry.Start{Profile: "support", EndUser: &ry.EndUser{ID: user.ID}})
//	tok, err := s.Token(ctx, ry.TokenOptions{EndUser: &ry.EndUser{ID: user.ID, Email: user.Email}})
//
// The generated client, package runyard, is beneath it (Client.API), for
// everything else; an answer other than a success is its *runyard.APIError,
// so runyard.IsCode reads the server's code from any error here.
package ry

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"maps"
	"slices"
	"strings"
	"sync"
	"time"

	openapi_types "github.com/oapi-codegen/runtime/types"

	runyard "github.com/runyard-ai/runyard-sdk/go"
)

// Client is a server, and the key it is spoken to with: an application's,
// with sessions.read and sessions.write.
type Client struct {
	api *runyard.ClientWithResponses
}

// Option changes how a Client is made.
type Option func(*options)

type options struct {
	doer runyard.HttpRequestDoer
}

// WithHTTPClient has the Client make its requests with doer rather than
// http.DefaultClient: a timeout, a proxy, a test's transport. A timeout cuts
// Reply, Send and Events too, which wait on a stream as long as a turn takes.
func WithHTTPClient(doer runyard.HttpRequestDoer) Option {
	return func(o *options) { o.doer = doer }
}

// New is a Client of the server at url (https://agents.example.com, without
// /v1), speaking with key.
func New(url, key string, opts ...Option) (*Client, error) {
	var o options
	for _, opt := range opts {
		opt(&o)
	}
	clientOpts := []runyard.ClientOption{runyard.WithKey(key)}
	if o.doer != nil {
		clientOpts = append(clientOpts, runyard.WithHTTPClient(o.doer))
	}
	api, err := runyard.NewClientWithResponses(url, clientOpts...)
	if err != nil {
		return nil, err
	}
	return &Client{api: api}, nil
}

// API is the generated client beneath, with the same key: every operation
// of the API, as the API says it.
func (c *Client) API() *runyard.ClientWithResponses { return c.api }

// EndUser is somebody the application signs in itself: its own id for them,
// opaque to runyard, and — when it gives one — their address, which a tunnel
// a turn of theirs opens is open to.
type EndUser struct {
	ID    string
	Email string
}

func (u *EndUser) wire() *runyard.EndUser {
	if u == nil {
		return nil
	}
	w := &runyard.EndUser{Id: u.ID}
	if u.Email != "" {
		w.Email = new(openapi_types.Email(u.Email))
	}
	return w
}

func endUserOf(w *runyard.EndUser) *EndUser {
	if w == nil {
		return nil
	}
	u := &EndUser{ID: w.Id}
	if w.Email != nil {
		u.Email = string(*w.Email)
	}
	return u
}

// Start is a session to start. Every field may be left out: a session of
// nothing but the server's defaults, waiting for its first turn.
type Start struct {
	// Profile is the profile it is started from, by id, at its latest
	// version.
	Profile string
	// Title is its title; made from its first turn when empty.
	Title string
	// Text is its first turn, sent with it; none when empty.
	Text string
	// EndUser is the application's user it is for; none, it is the
	// application's own.
	EndUser *EndUser
	// Labels are the application's own, to find it by (List.Labels).
	Labels map[string]string
	// Spec is anything else of the API's SessionSpec — a harness, a model,
	// resources. The fields above are written over it.
	Spec runyard.SessionSpec
}

// Start starts a session. The answer comes once the server has it, not
// once its sandbox is up: Reply waits for that too.
func (c *Client) Start(ctx context.Context, start Start) (*Session, error) {
	spec := start.Spec
	if start.Profile != "" {
		spec.ProfileId = &start.Profile
	}
	if start.Title != "" {
		spec.Title = &start.Title
	}
	if start.EndUser != nil {
		spec.EndUser = start.EndUser.wire()
	}
	if start.Labels != nil {
		spec.Labels = new(maps.Clone(start.Labels))
	}
	if start.Text != "" {
		spec.FirstTurn = &runyard.Turn{TurnId: turnID(), Text: start.Text}
	}
	res, err := c.api.StartSessionWithResponse(ctx, nil, spec)
	if err := runyard.Checked(res, err); err != nil {
		return nil, err
	}
	if res.JSON201 != nil {
		s := c.Session(res.JSON201.Id)
		// A session just made has had no turn end: every turn_ended on its
		// stream is one after this call, so Reply need not ask where it is.
		s.mark(0)
		return s, nil
	}
	if res.JSON200 != nil {
		// Found again by its Idempotency-Key: made by an earlier call, whose
		// turns may have ended since, so this is a handle like any other.
		return c.Session(res.JSON200.Id), nil
	}
	return nil, &runyard.APIError{Status: res.StatusCode(), Body: res.Body}
}

// Session is a handle on a session the key reaches, by its id. It asks
// nothing of the server until it is used.
func (c *Client) Session(id string) *Session {
	return &Session{c: c, id: id}
}

// SessionInfo is a session, as a listing has it.
type SessionInfo struct {
	ID    string
	Title string
	// State is starting, idle, generating, attached, sleeping, archived or
	// failed (runyard.SessionState).
	State          runyard.SessionState
	EndUser        *EndUser
	Labels         map[string]string
	CreatedAt      time.Time
	LastActivityAt time.Time
	// Raw is the session as the API says it, for everything else.
	Raw runyard.Session
}

func infoOf(s runyard.Session) SessionInfo {
	return SessionInfo{
		ID: s.Id, Title: s.Title, State: s.State, EndUser: endUserOf(s.EndUser), Labels: s.Labels,
		CreatedAt: s.CreatedAt, LastActivityAt: s.LastActivityAt, Raw: s,
	}
}

// List is which sessions Sessions lists: every one the key reaches, when
// it is empty.
type List struct {
	// EndUser is the id of the end user whose sessions they are.
	EndUser string
	// Labels each listed session carries, every one.
	Labels map[string]string
	// Archived lists the archived sessions, and only those.
	Archived bool
}

// Sessions is every session the key reaches that list says, newest activity
// first: each page of them, read to the last.
func (c *Client) Sessions(ctx context.Context, list List) ([]SessionInfo, error) {
	params := &runyard.ListSessionsParams{}
	if list.EndUser != "" {
		params.EndUser = &list.EndUser
	}
	if len(list.Labels) > 0 {
		labels := make([]string, 0, len(list.Labels))
		for _, k := range slices.Sorted(maps.Keys(list.Labels)) {
			labels = append(labels, k+"="+list.Labels[k])
		}
		params.Label = &labels
	}
	if list.Archived {
		params.Archived = &list.Archived
	}
	var all []SessionInfo
	for {
		res, err := c.api.ListSessionsWithResponse(ctx, params)
		if err := runyard.Checked(res, err); err != nil {
			return nil, err
		}
		if res.JSON200 == nil {
			return nil, &runyard.APIError{Status: res.StatusCode(), Body: res.Body}
		}
		for _, s := range res.JSON200.Items {
			all = append(all, infoOf(s))
		}
		next := res.JSON200.NextCursor
		// A cursor that comes back as the one asked with would be read
		// for ever.
		if next == nil || *next == "" || (params.Cursor != nil && *params.Cursor == *next) {
			return all, nil
		}
		params.Cursor = next
	}
}

// Session is one session, by its id.
type Session struct {
	c  *Client
	id string

	mu sync.Mutex
	// from is where its stream is read from for the next Reply: just past
	// the last turn this handle saw end, once it has seen one. No turn is
	// under way across a turn's end, so nothing of the next is before it.
	from  int64
	known bool
}

// ID is the session's id.
func (s *Session) ID() string { return s.id }

func (s *Session) mark(from int64) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if !s.known || from > s.from {
		s.from, s.known = from, true
	}
}

func (s *Session) cursor() (int64, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.from, s.known
}

// Info is the session as it is now.
func (s *Session) Info(ctx context.Context) (SessionInfo, error) {
	got, err := s.get(ctx)
	if err != nil {
		return SessionInfo{}, err
	}
	return infoOf(*got), nil
}

func (s *Session) get(ctx context.Context) (*runyard.Session, error) {
	res, err := s.c.api.GetSessionWithResponse(ctx, s.id)
	if err := runyard.Checked(res, err); err != nil {
		return nil, err
	}
	if res.JSON200 == nil {
		return nil, &runyard.APIError{Status: res.StatusCode(), Body: res.Body}
	}
	return res.JSON200, nil
}

// Delete deletes the session, its transcript and its disk.
func (s *Session) Delete(ctx context.Context) error {
	res, err := s.c.api.DeleteSessionWithResponse(ctx, s.id)
	return runyard.Checked(res, err)
}

// Send says text to the session, as a new turn, and returns its answer
// once the turn has ended (Reply). A turn sent while another is under way
// waits behind it.
//
// A turn the session never starts — taken out of its queue while it waited,
// by the page's cancel or an interrupt that dropped the queue, or refused as
// it was given to the harness — is a *TurnGoneError, as soon as it is gone.
func (s *Session) Send(ctx context.Context, text string) (string, error) {
	// Where its stream is now: the turn sent is after it, since a turn is
	// on the stream only once the harness is given it.
	got, err := s.get(ctx)
	if err != nil {
		return "", err
	}
	// Where the changes to the sessions are now, before the turn is sent:
	// the change that queues it is after it.
	changed, err := s.changeSeq(ctx)
	if err != nil {
		return "", err
	}
	id := turnID()
	res, err := s.c.api.SendTurnWithResponse(ctx, s.id, runyard.Turn{TurnId: id, Text: text})
	if err := runyard.Checked(res, err); err != nil {
		return "", err
	}
	if err := s.dequeued(ctx, changed, id); err != nil {
		return "", err
	}
	return s.await(ctx, got.LastSeq+1, got.LastSeq, id, true)
}

// changeSeq is the newest change to the sessions the key reaches.
func (s *Session) changeSeq(ctx context.Context) (int64, error) {
	limit := 1
	res, err := s.c.api.ListSessionsWithResponse(ctx, &runyard.ListSessionsParams{Limit: &limit})
	if err := runyard.Checked(res, err); err != nil {
		return 0, err
	}
	if res.JSON200 == nil {
		return 0, &runyard.APIError{Status: res.StatusCode(), Body: res.Body}
	}
	return res.JSON200.ChangeSeq, nil
}

// dequeued follows the changes to the sessions from just past changed until
// the turn of id has left the session's queue: given to the harness, taken
// out, or refused. Its transcript then says which (await). The session's
// queue is the one place a turn taken out of it is said: a cancel, or an
// interrupt that drops the queue, writes nothing on its stream.
func (s *Session) dequeued(ctx context.Context, changed int64, id string) error {
	// What changed before the turn was queued — the stream is read from
	// before it was sent — says nothing of it: it has left the queue only
	// once it was seen in it. Sending queues it before it answers, so it is
	// seen.
	seen := false
	follow, from := true, changed+1
	stream, err := s.c.api.Changes(ctx, &runyard.StreamChangesParams{From: &from, Follow: &follow})
	if runyard.IsCode(err, runyard.ErrorCodeGapped) {
		// What changed since it was sent is no longer kept: the session as
		// it is now says whether it still waits, and the changes from here
		// on when it stops.
		if changed, err = s.changeSeq(ctx); err != nil {
			return err
		}
		var got *runyard.Session
		if got, err = s.get(ctx); err != nil {
			return err
		}
		if !slices.ContainsFunc(deref(got.Queue), func(q runyard.QueuedTurn) bool { return q.TurnId == id }) {
			return nil
		}
		seen, from = true, changed+1
		stream, err = s.c.api.Changes(ctx, &runyard.StreamChangesParams{From: &from, Follow: &follow})
	}
	if err != nil {
		return err
	}
	defer func() { _ = stream.Close() }()
	for {
		c, err := stream.Next()
		if errors.Is(err, io.EOF) {
			return ErrStreamEnded
		}
		if err != nil {
			return err
		}
		if c.SessionId != s.id {
			continue
		}
		if c.Op == runyard.Deleted || c.Session == nil {
			return ErrStreamEnded
		}
		if !slices.ContainsFunc(deref(c.Session.Queue), func(q runyard.QueuedTurn) bool { return q.TurnId == id }) {
			if seen {
				return nil
			}
			continue
		}
		seen = true
		if c.Session.State == runyard.SessionStateFailed {
			// Kept waiting, it is given at the next wake; the caller is told
			// now rather than left waiting for one.
			return fmt.Errorf("%w: %s", ErrFailed, deref(c.Session.Error))
		}
	}
}

// Reply waits for the turn under way — or, with none, the next — to end,
// and returns what the session said in it: its text, the blocks of it
// joined by a blank line, without its sub-agents' or its tools'.
//
// A turn that ended before the call is not waited for: a handle made of an
// id alone, after its turn ended — the turn sent in one request, its answer
// read in another — waits for the next one. LastReply is the answer of the
// turn that ended last.
//
// A turn that ended other than as it should is a *TurnError, with what was
// said before it ended.
func (s *Session) Reply(ctx context.Context) (string, error) {
	from, known := s.cursor()
	var since int64
	if !known {
		// Without a turn of its own seen, the handle reads the transcript
		// from its start, to find the turn under way; a turn that ended
		// before this call is not the one waited for.
		got, err := s.get(ctx)
		if err != nil {
			return "", err
		}
		since = got.LastSeq
	}
	return s.await(ctx, from, since, "", false)
}

// TokenOptions is what a token is minted with.
type TokenOptions struct {
	// EndUser is whom it speaks for: its turns are sent for them. A session
	// for an end user has tokens for them alone; nil, the session's.
	EndUser *EndUser
	// TTL is how long it works: a minute to a day, rounded down to the
	// second. Zero is the server's default, an hour; less than a minute is
	// refused before the server is asked (ErrTokenTTL).
	TTL time.Duration
}

// Token is a session token: what a browser talks to this one session with,
// directly (Authorization: Bearer Value), until ExpiresAt.
type Token struct {
	Value     string
	SessionID string
	EndUser   *EndUser
	ExpiresAt time.Time
}

// Token mints a token for the session, for a browser: it reads the session
// and talks in it, and nothing else.
func (s *Session) Token(ctx context.Context, opts TokenOptions) (Token, error) {
	if opts.TTL < 0 || (opts.TTL > 0 && opts.TTL < time.Minute) {
		// Rounded down to the second, under one is 0, which the server
		// refuses as it does anything under a minute: said here, as what
		// was asked, rather than as a number the caller never wrote.
		return Token{}, fmt.Errorf("%w: %v", ErrTokenTTL, opts.TTL)
	}
	body := runyard.SessionTokenRequest{EndUser: opts.EndUser.wire()}
	if opts.TTL != 0 {
		body.TtlSeconds = new(int(opts.TTL / time.Second))
	}
	res, err := s.c.api.CreateSessionTokenWithResponse(ctx, s.id, body)
	if err := runyard.Checked(res, err); err != nil {
		return Token{}, err
	}
	if res.JSON201 == nil {
		return Token{}, &runyard.APIError{Status: res.StatusCode(), Body: res.Body}
	}
	t := res.JSON201
	return Token{Value: t.Token, SessionID: t.SessionId, EndUser: endUserOf(t.EndUser), ExpiresAt: t.ExpiresAt}, nil
}

// TurnError is a turn that ended other than as it should: interrupted,
// cut at its model's limit, or failed.
type TurnError struct {
	TurnID string
	// StopReason is interrupted, max_tokens or error.
	StopReason runyard.TurnEndedEventStopReason
	// Message is the last error the session said in the turn, if it said
	// one.
	Message string
}

func (e *TurnError) Error() string {
	msg := "ry: turn " + e.TurnID + " ended: " + string(e.StopReason)
	if e.Message != "" {
		msg += ": " + e.Message
	}
	return msg
}

// TurnGoneError is a turn sent that the session never started: taken out
// of its queue while it waited — cancelled (DELETE …/queue/{turnId}), or
// dropped by an interrupt that dropped the queue — or refused as it was
// given to the harness.
type TurnGoneError struct {
	TurnID string
	// Why is the error the session refused it with, when it said one; else
	// that it was taken out of the queue.
	Why string
}

func (e *TurnGoneError) Error() string {
	return "ry: turn " + e.TurnID + " was never started: " + e.Why
}

// takenOut is a TurnGoneError's Why when the session said nothing of it: a
// cancel and an interrupt that drops the queue write nothing on its stream.
const takenOut = "it was taken out of the queue (cancelled, or dropped by an interrupt)"

// ErrNoReply is LastReply of a session no turn of which has ended.
var ErrNoReply = errors.New("ry: no turn of the session has ended")

// ErrTokenTTL is a token asked for with a TTL the server refuses: under a
// minute, or negative.
var ErrTokenTTL = errors.New("ry: a token's TTL is zero, for the server's default of an hour, or at least a minute")

// ErrFailed is a session that failed while a turn was waited for: its
// sandbox or its harness could not be started, again and again.
var ErrFailed = errors.New("ry: the session failed")

// ErrStreamEnded is the server ending a session's stream before the turn
// waited for ended: the session was deleted, or the server stopped.
var ErrStreamEnded = errors.New("ry: the session's stream ended before its turn did")

// turnID is a turn's id, random: the caller's own, for a retry, so one that
// reads well in a log.
func turnID() string {
	var b [8]byte
	_, _ = rand.Read(b[:])
	return "ry-" + hex.EncodeToString(b[:])
}

// join is a turn's text blocks as one answer.
func join(blocks []string) string {
	return strings.Join(blocks, "\n\n")
}
