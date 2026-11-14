// Package relay is runyard-agents' API served by a program's own backend to
// its own front end: the part of it a conversation needs, for the people the
// program signs in itself, each reaching only their own sessions.
//
// The program holds one key of the workspace, with sessions.person, which can
// act on every session in it. The relay is what stands between that key and
// a browser: it answers only the routes it knows, lets the browser say only
// what is the browser's to say, and reaches a session only once it is the
// caller's — its owner and its labels the caller's scope's. What it answers
// is runyard-agents' own, as runyard-agents wrote it, under the same paths,
// so a front end reads it with the same code it would read runyard-agents
// with (@runyard-ai/runyard-react): a transcript, a session, an error.
//
//	h, err := relay.New(relay.Config{
//		URL: "https://agents.example.com", Key: key,
//		Person: func(r *http.Request) (relay.Person, error) { ... }, // who is asking
//	})
//	mux.Handle("/agents/", http.StripPrefix("/agents", h))
//
// What it serves, under /v1:
//
//   - the caller's sessions: listed, started, read, renamed, pinned,
//     archived, restored and deleted;
//   - a session's transcript, followed as it is written (events), and the
//     changes to the caller's sessions (changes);
//   - its turns: sent, interrupted, taken back (rewind), and those queued
//     edited, held, cancelled;
//   - what the transcript shows: its attachments, its files, its sub-agents;
//   - with Config.SignIn, the caller signing their own provider in.
//
// Nothing else: any other path is not found, as is a session of anybody
// else's.
package relay

import (
	"bufio"
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"maps"
	"net/http"
	"net/url"
	"slices"
	"strings"

	openapi_types "github.com/oapi-codegen/runtime/types"

	runyard "github.com/runyard-ai/runyard-sdk/go"
)

// Person is whom a request is for: a person of the workspace, whom the key
// speaks for.
type Person struct {
	// Email is who they are in the workspace.
	Email string
}

// Scope is which of the workspace's sessions a person reaches through the
// relay: those of its owner that carry every one of its labels. A session
// started through it is made so.
type Scope struct {
	// Owner is whose the sessions are: the person's own email, or — for
	// sessions the program runs for everybody — the key's person's.
	Owner string
	// Labels are what each of its sessions carries; none is every session of
	// Owner's, those started in runyard-agents' own chat too.
	Labels map[string]string
	// NoStart is a scope sessions are read and talked in, and never started
	// in: they are started by the program, for its own reasons.
	NoStart bool
}

// holds is whether a session of owner and labels is in the scope.
func (s Scope) holds(owner string, labels map[string]string) bool {
	if !strings.EqualFold(owner, s.Owner) {
		return false
	}
	for k, v := range s.Labels {
		if got, ok := labels[k]; !ok || got != v {
			return false
		}
	}
	return true
}

// Config is what New needs. URL, Key and Person are required.
type Config struct {
	// URL is runyard-agents' API, as the program reaches it: its origin, and
	// the path it is served under, if any.
	URL string
	// Key is the workspace's key, with sessions.read, sessions.write and
	// sessions.person — sessions.delete to delete one, providers.write with
	// SignIn.
	Key string
	// HTTPClient makes the requests; nil is one with no timeout, since a
	// followed transcript stays open for as long as it is read.
	HTTPClient *http.Client

	// Person is whom r is for, from the program's own sign-in. An error is
	// 401 — or, an *Error, what it says.
	Person func(r *http.Request) (Person, error)
	// Scope is which sessions p reaches; nil is p's own, every one of them.
	Scope func(r *http.Request, p Person) (Scope, error)

	// Start is what a session is started with, besides what the browser
	// said of it (its title, its first turn) and the scope's owner and
	// labels: its profile, its provider, its brokers. An error refuses it.
	// Labels it adds are kept; the scope's are the scope's whatever it does.
	Start func(r *http.Request, p Person, spec *runyard.SessionSpec) error
	// Turn is what a turn is sent with, besides its text and mode: its
	// provider, its model. An error refuses it. r.PathValue("sessionId") is
	// the session it is sent in, one of the caller's scope; it is empty for a
	// session's first turn, sent with it, which is told here too.
	Turn func(r *http.Request, p Person, turn *runyard.Turn) error
	// Started is told of a session once it is started, before the browser
	// is: what the program records of it. The session is made whatever it
	// does.
	Started func(r *http.Request, p Person, s runyard.Session)

	// SignIn, when set, serves a person signing their own provider in.
	SignIn *SignIn

	// NewID makes a turn's id when the browser gives none; nil is a random
	// one.
	NewID func() string
	// Log is told what goes wrong that is not the caller's to know; nil
	// tells nobody.
	Log *slog.Logger
}

// SignIn is a person signing in a provider of their own — their Claude
// subscription, say — which their sessions run on:
//
//   - GET /v1/providers is theirs, and only theirs;
//   - POST /v1/providers/{provider}/signin starts it, owned by them;
//   - POST /v1/providers/{provider}/signin/{flowId} finishes it.
type SignIn struct {
	// Provider is the name of p's provider: the one they may sign in.
	// Required.
	Provider func(r *http.Request, p Person) (string, error)
	// Start is what the sign-in is started with, besides the type, method
	// and title the browser said: an error refuses it. Its owner is p
	// whatever it does.
	Start func(r *http.Request, p Person, signIn *runyard.ProviderSignIn) error
	// Finished is told once the provider is signed in, before the browser
	// is: whom else to let use it, say. An error is the answer, the sign-in
	// done.
	Finished func(r *http.Request, p Person, provider string) error
}

// Error is a refusal: what a hook returns for the relay to answer with,
// rather than a 500.
type Error struct {
	// Status is the answer's HTTP status.
	Status int
	// Code is what the browser branches on.
	Code runyard.ErrorCode
	// Message is for a person reading a log.
	Message string
}

func (e *Error) Error() string { return fmt.Sprintf("%d %s: %s", e.Status, e.Code, e.Message) }

// Refuse is an *Error.
func Refuse(status int, code runyard.ErrorCode, message string) error {
	return &Error{Status: status, Code: code, Message: message}
}

// The most of a request's body the relay reads: what the browser says is a
// few words.
const maxBody = 1 << 20

type relay struct {
	cfg  Config
	base string
}

// New is the relay, an http.Handler for paths under /v1: mounted where the
// program serves it, with its prefix taken off.
func New(cfg Config) (http.Handler, error) {
	switch {
	case cfg.URL == "":
		return nil, errors.New("relay: no URL")
	case cfg.Key == "":
		return nil, errors.New("relay: no key")
	case cfg.Person == nil:
		return nil, errors.New("relay: no Person")
	case cfg.SignIn != nil && cfg.SignIn.Provider == nil:
		return nil, errors.New("relay: SignIn without Provider")
	}
	u, err := url.Parse(cfg.URL)
	if err != nil || (u.Scheme != "http" && u.Scheme != "https") || u.Host == "" {
		return nil, fmt.Errorf("relay: %q is not an http or https URL", cfg.URL)
	}
	if cfg.HTTPClient == nil {
		cfg.HTTPClient = &http.Client{}
	}
	if cfg.NewID == nil {
		cfg.NewID = randomID
	}
	if cfg.Log == nil {
		cfg.Log = slog.New(slog.DiscardHandler)
	}
	r := &relay{cfg: cfg, base: strings.TrimSuffix(cfg.URL, "/")}

	mux := http.NewServeMux()
	handle := func(pattern string, h func(*call)) { mux.Handle(pattern, r.serve(h)) }
	owned := func(pattern string, h func(*call, *held)) { mux.Handle(pattern, r.serve(r.owned(h))) }

	handle("GET /v1/sessions", r.list)
	handle("POST /v1/sessions", r.start)
	handle("GET /v1/changes", r.changes)
	owned("GET /v1/sessions/{sessionId}", r.get)
	owned("PATCH /v1/sessions/{sessionId}", r.update)
	owned("DELETE /v1/sessions/{sessionId}", r.forward())
	owned("POST /v1/sessions/{sessionId}/archive", r.forward())
	owned("POST /v1/sessions/{sessionId}/restore", r.forward())
	owned("GET /v1/sessions/{sessionId}/events", r.forward("from", "follow", "subagent"))
	owned("POST /v1/sessions/{sessionId}/turns", r.turn)
	owned("POST /v1/sessions/{sessionId}/interrupt", said[runyard.InterruptJSONBody](r, "/interrupt"))
	owned("POST /v1/sessions/{sessionId}/rewind", said[runyard.RewindJSONBody](r, "/rewind"))
	owned("DELETE /v1/sessions/{sessionId}/queue/{turnId}", r.forward())
	owned("PATCH /v1/sessions/{sessionId}/queue/{turnId}", r.editQueued)
	owned("PUT /v1/sessions/{sessionId}/queue/{turnId}/hold", r.forward())
	owned("DELETE /v1/sessions/{sessionId}/queue/{turnId}/hold", r.forward())
	owned("POST /v1/sessions/{sessionId}/queue/{turnId}/interrupt", r.forward())
	owned("GET /v1/sessions/{sessionId}/attachments/{uploadId}", r.forward())
	owned("GET /v1/sessions/{sessionId}/files", r.forward("path"))
	owned("GET /v1/sessions/{sessionId}/files/content", r.forward("path"))
	owned("GET /v1/sessions/{sessionId}/subagents", r.forward())
	owned("GET /v1/sessions/{sessionId}/subagents/{subagentId}", r.forward())
	if cfg.SignIn != nil {
		handle("GET /v1/providers", r.providers)
		handle("POST /v1/providers/{provider}/signin", r.startSignIn)
		handle("POST /v1/providers/{provider}/signin/{flowId}", r.finishSignIn)
	}
	// Anything else, as runyard-agents says it: not found.
	mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		writeError(w, http.StatusNotFound, runyard.ErrorCodeNotFound, "no such route")
	}))
	return mux, nil
}

// call is one request, its caller resolved.
type call struct {
	w     http.ResponseWriter
	r     *http.Request
	p     Person
	scope Scope
}

// serve resolves whom a request is for, and their scope, and refuses a
// request without them.
func (r *relay) serve(h func(*call)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		p, err := r.cfg.Person(req)
		if err == nil && p.Email == "" {
			err = errors.New("a person with no email")
		}
		if err != nil {
			e, ok := errors.AsType[*Error](err)
			if !ok {
				e = &Error{Status: http.StatusUnauthorized, Code: runyard.ErrorCodeUnauthorized, Message: "unauthorized"}
			}
			writeError(w, e.Status, e.Code, e.Message)
			return
		}
		scope := Scope{Owner: p.Email}
		if r.cfg.Scope != nil {
			if scope, err = r.cfg.Scope(req, p); err != nil {
				r.refused(w, req, "scope", err)
				return
			}
			if scope.Owner == "" {
				r.refused(w, req, "scope", errors.New("a scope with no owner"))
				return
			}
		}
		h(&call{w: w, r: req, p: p, scope: scope})
	})
}

// refused answers a hook's error: its own words when it is an *Error, and an
// internal error, told to the log, when it is not.
func (r *relay) refused(w http.ResponseWriter, req *http.Request, hook string, err error) {
	if e, ok := errors.AsType[*Error](err); ok {
		writeError(w, e.Status, e.Code, e.Message)
		return
	}
	r.cfg.Log.Error("relay: "+hook+" failed", "path", req.URL.Path, "err", err)
	writeError(w, http.StatusInternalServerError, runyard.ErrorCodeInternal, "internal error")
}

// held is what the relay reads of a session to tell whose it is.
type held struct {
	ID     string            `json:"id"`
	Owner  string            `json:"owner"`
	Labels map[string]string `json:"labels"`
	raw    []byte
}

// owned is h, for a session of the caller's scope; any other is not found, as
// one that does not exist is.
func (r *relay) owned(h func(*call, *held)) func(*call) {
	return func(c *call) {
		res, ok := r.send(c, http.MethodGet, sessionPath(c.r.PathValue("sessionId")), nil, nil)
		if !ok {
			return
		}
		defer closeBody(res)
		if res.StatusCode != http.StatusOK {
			r.pass(c, res)
			return
		}
		raw, err := io.ReadAll(res.Body)
		s := &held{raw: raw}
		if err == nil {
			err = json.Unmarshal(raw, s)
		}
		if err != nil {
			r.unreadable(c, err)
			return
		}
		if !c.scope.holds(s.Owner, s.Labels) {
			writeError(c.w, http.StatusNotFound, runyard.ErrorCodeNotFound, "no such session")
			return
		}
		h(c, s)
	}
}

func sessionPath(id string) string { return "/v1/sessions/" + url.PathEscape(id) }

// send is the request to runyard-agents, with the key, and false when it
// went unanswered — said to the browser already.
func (r *relay) send(c *call, method, path string, query url.Values, body any) (*http.Response, bool) {
	u := r.base + path
	if len(query) > 0 {
		u += "?" + query.Encode()
	}
	var reader io.Reader
	if body != nil {
		raw, err := json.Marshal(body)
		if err != nil {
			r.refused(c.w, c.r, "encoding", err)
			return nil, false
		}
		reader = bytes.NewReader(raw)
	}
	req, err := http.NewRequestWithContext(c.r.Context(), method, u, reader)
	if err != nil {
		r.refused(c.w, c.r, "request", err)
		return nil, false
	}
	req.Header.Set("Authorization", "Bearer "+r.cfg.Key)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	if key := c.r.Header.Get("Idempotency-Key"); key != "" && method == http.MethodPost {
		req.Header.Set("Idempotency-Key", key)
	}
	res, err := r.cfg.HTTPClient.Do(req)
	if err != nil {
		if c.r.Context().Err() == nil {
			r.cfg.Log.Warn("relay: runyard-agents is not answering", "path", path, "err", err)
		}
		writeError(c.w, http.StatusBadGateway, runyard.ErrorCodeUpstreamError, "runyard-agents is not answering")
		return nil, false
	}
	return res, true
}

// The headers of an answer the browser is given, of runyard-agents': what
// its body is, and how long it may be kept.
var passed = []string{"Content-Type", "Content-Disposition", "Cache-Control", "ETag", "Last-Modified", "X-Content-Type-Options"}

// pass is runyard-agents' answer, to the browser, as it was written: a chunk
// at a time, so a transcript followed is read as it is written. A refusal of
// the key is not the browser's: it is told the relay failed.
func (r *relay) pass(c *call, res *http.Response) {
	if res.StatusCode == http.StatusUnauthorized || res.StatusCode == http.StatusForbidden {
		raw, _ := io.ReadAll(io.LimitReader(res.Body, maxBody))
		r.cfg.Log.Error("relay: runyard-agents refused the key", "path", c.r.URL.Path, "status", res.StatusCode, "body", string(raw))
		writeError(c.w, http.StatusBadGateway, runyard.ErrorCodeUpstreamError, "runyard-agents refused the relay")
		return
	}
	h := c.w.Header()
	for _, k := range passed {
		if v := res.Header.Get(k); v != "" {
			h.Set(k, v)
		}
	}
	if strings.HasPrefix(res.Header.Get("Content-Type"), "application/x-ndjson") {
		// Never kept, and never held back by a proxy waiting for more.
		h.Set("Cache-Control", "no-store")
		h.Set("X-Accel-Buffering", "no")
	}
	c.w.WriteHeader(res.StatusCode)
	flush := http.NewResponseController(c.w)
	buf := make([]byte, 32<<10)
	for {
		n, err := res.Body.Read(buf)
		if n > 0 {
			if _, werr := c.w.Write(buf[:n]); werr != nil {
				return
			}
			_ = flush.Flush()
		}
		if err != nil {
			// Its end, or the browser gone: either way a reader of a stream
			// reconnects from the last seq it read.
			return
		}
	}
}

// unreadable answers an answer of runyard-agents' the relay could not read.
func (r *relay) unreadable(c *call, err error) {
	if c.r.Context().Err() == nil {
		r.cfg.Log.Error("relay: an answer of runyard-agents' it cannot read", "path", c.r.URL.Path, "err", err)
	}
	writeError(c.w, http.StatusBadGateway, runyard.ErrorCodeUpstreamError, "runyard-agents answered what the relay cannot read")
}

// forward is the call as the browser made it, to the session it is about,
// with only the query parameters named, and no body.
func (r *relay) forward(query ...string) func(*call, *held) {
	return func(c *call, _ *held) {
		res, ok := r.send(c, c.r.Method, c.r.URL.EscapedPath(), allowed(c.r.URL.Query(), query...), nil)
		if ok {
			defer closeBody(res)
			r.pass(c, res)
		}
	}
}

// allowed is q with only the names given.
func allowed(q url.Values, names ...string) url.Values {
	out := url.Values{}
	for _, n := range names {
		if v, ok := q[n]; ok {
			out[n] = v
		}
	}
	return out
}

// decode reads the browser's body into v, refusing a field v has not: what
// the relay does not let the browser say is refused rather than dropped, so
// that nobody thinks it was said. An empty body is v as it is.
func decode(c *call, v any) bool {
	raw, err := io.ReadAll(http.MaxBytesReader(c.w, c.r.Body, maxBody))
	if err == nil && len(bytes.TrimSpace(raw)) > 0 {
		d := json.NewDecoder(bytes.NewReader(raw))
		d.DisallowUnknownFields()
		err = d.Decode(v)
	}
	if err != nil {
		writeError(c.w, http.StatusBadRequest, runyard.ErrorCodeBadRequest, "the body: "+err.Error())
		return false
	}
	return true
}

// ---------------------------------------------------------------- sessions

// list is the caller's sessions: runyard-agents' list, asked of the scope's
// owner and labels, and each one held to it again.
func (r *relay) list(c *call) {
	q := allowed(c.r.URL.Query(), "limit", "cursor", "archived", "state", "label")
	q.Set("owner", c.scope.Owner)
	for _, k := range sortedKeys(c.scope.Labels) {
		q.Add("label", k+"="+c.scope.Labels[k])
	}
	r.page(c, "/v1/sessions", q, func(raw json.RawMessage) bool {
		var s held
		return json.Unmarshal(raw, &s) == nil && c.scope.holds(s.Owner, s.Labels)
	})
}

// page is runyard-agents' page of path, with only the items keep keeps, and
// the rest of it — its cursor — as it was.
func (r *relay) page(c *call, path string, q url.Values, keep func(json.RawMessage) bool) {
	res, ok := r.send(c, http.MethodGet, path, q, nil)
	if !ok {
		return
	}
	defer closeBody(res)
	if res.StatusCode != http.StatusOK {
		r.pass(c, res)
		return
	}
	var page map[string]json.RawMessage
	var items []json.RawMessage
	err := json.NewDecoder(res.Body).Decode(&page)
	if err == nil {
		err = json.Unmarshal(page["items"], &items)
	}
	kept := make([]json.RawMessage, 0, len(items))
	for _, raw := range items {
		if keep(raw) {
			kept = append(kept, raw)
		}
	}
	if err == nil {
		page["items"], err = json.Marshal(kept)
	}
	if err != nil {
		r.unreadable(c, err)
		return
	}
	writeJSON(c.w, http.StatusOK, page)
}

// turnBody is what the browser says of a turn.
type turnBody struct {
	TurnID string            `json:"turnId"`
	Text   string            `json:"text"`
	Mode   *runyard.TurnMode `json:"mode,omitempty"`
}

// turnOf is the turn the browser said, as Config.Turn makes it.
func (r *relay) turnOf(c *call, b turnBody) (*runyard.Turn, bool) {
	t := &runyard.Turn{TurnId: b.TurnID, Text: b.Text, Mode: b.Mode}
	if t.TurnId == "" {
		t.TurnId = r.cfg.NewID()
	}
	if r.cfg.Turn != nil {
		if err := r.cfg.Turn(c.r, c.p, t); err != nil {
			r.refused(c.w, c.r, "Turn", err)
			return nil, false
		}
	}
	return t, true
}

// start is a session of the caller's scope, started: its title and its
// first turn the browser's, everything else the program's.
func (r *relay) start(c *call) {
	if c.scope.NoStart {
		writeError(c.w, http.StatusForbidden, runyard.ErrorCodeForbidden, "sessions are not started here")
		return
	}
	var body struct {
		Title     *string   `json:"title,omitempty"`
		AutoTitle *bool     `json:"autoTitle,omitempty"`
		FirstTurn *turnBody `json:"firstTurn,omitempty"`
	}
	if !decode(c, &body) {
		return
	}
	labels := maps.Clone(c.scope.Labels)
	if labels == nil {
		labels = map[string]string{}
	}
	spec := runyard.SessionSpec{Title: body.Title, AutoTitle: body.AutoTitle, Labels: &labels}
	if body.FirstTurn != nil {
		t, ok := r.turnOf(c, *body.FirstTurn)
		if !ok {
			return
		}
		spec.FirstTurn = t
	}
	if r.cfg.Start != nil {
		if err := r.cfg.Start(c.r, c.p, &spec); err != nil {
			r.refused(c.w, c.r, "Start", err)
			return
		}
	}
	// The scope's, whatever Start did: whose it is, and what tells it so.
	owner := openapi_types.Email(c.scope.Owner)
	spec.Owner, spec.ParentId = &owner, nil
	if spec.Labels == nil {
		spec.Labels = &map[string]string{}
	}
	maps.Copy(*spec.Labels, c.scope.Labels)

	res, ok := r.send(c, http.MethodPost, "/v1/sessions", nil, spec)
	if !ok {
		return
	}
	defer closeBody(res)
	if res.StatusCode/100 != 2 {
		r.pass(c, res)
		return
	}
	raw, err := io.ReadAll(res.Body)
	var s runyard.Session
	if err == nil {
		err = json.Unmarshal(raw, &s)
	}
	if err != nil {
		r.unreadable(c, err)
		return
	}
	if r.cfg.Started != nil {
		r.cfg.Started(c.r, c.p, s)
	}
	writeRaw(c.w, res.StatusCode, raw)
}

func (r *relay) get(c *call, s *held) { writeRaw(c.w, http.StatusOK, s.raw) }

// update is what of a session the browser may change: its title, whether it
// is pinned, whether it is titled by itself.
func (r *relay) update(c *call, s *held) {
	var body struct {
		Title     *string `json:"title,omitempty"`
		Pinned    *bool   `json:"pinned,omitempty"`
		AutoTitle *bool   `json:"autoTitle,omitempty"`
	}
	if !decode(c, &body) {
		return
	}
	res, ok := r.send(c, http.MethodPatch, sessionPath(s.ID), nil, runyard.SessionUpdate{Title: body.Title, Pinned: body.Pinned, AutoTitle: body.AutoTitle})
	if ok {
		defer closeBody(res)
		r.pass(c, res)
	}
}

// pages bounds the listing changes starts from: ten pages of runyard-agents'
// own size, archived and not.
const pages = 10

// changes is runyard-agents' changes to the account's sessions, with only
// those of the caller's scope: a session in it, as it is after the change;
// and one that was — listed in it as the stream opens, or seen in it since —
// once it is deleted or no longer in it, as deleted. A deletion says no more
// than that, so whose it was is what the relay knew of it: a reader holds
// what it listed, and is told when that goes.
func (r *relay) changes(c *call) {
	seen, ok := r.known(c)
	if !ok {
		return
	}
	res, ok := r.send(c, http.MethodGet, "/v1/changes", allowed(c.r.URL.Query(), "from", "follow"), nil)
	if !ok {
		return
	}
	defer closeBody(res)
	if res.StatusCode != http.StatusOK {
		r.pass(c, res)
		return
	}
	h := c.w.Header()
	h.Set("Content-Type", "application/x-ndjson")
	h.Set("Cache-Control", "no-store")
	h.Set("X-Accel-Buffering", "no")
	c.w.WriteHeader(http.StatusOK)
	flush := http.NewResponseController(c.w)
	reader := bufio.NewReaderSize(res.Body, 64<<10)
	for {
		line, err := reader.ReadBytes('\n')
		if out := keptChange(c.scope, seen, line); out != nil {
			if _, werr := c.w.Write(out); werr != nil {
				return
			}
			if reader.Buffered() == 0 {
				_ = flush.Flush()
			}
		}
		if err != nil {
			_ = flush.Flush()
			return
		}
	}
}

// known is the ids of the sessions of the caller's scope, archived and not,
// and false — answered — when they could not be listed.
func (r *relay) known(c *call) (map[string]bool, bool) {
	ids := map[string]bool{}
	for _, archived := range []string{"false", "true"} {
		q := url.Values{"owner": {c.scope.Owner}, "archived": {archived}}
		for _, k := range sortedKeys(c.scope.Labels) {
			q.Add("label", k+"="+c.scope.Labels[k])
		}
		for range pages {
			res, ok := r.send(c, http.MethodGet, "/v1/sessions", q, nil)
			if !ok {
				return nil, false
			}
			if res.StatusCode != http.StatusOK {
				r.pass(c, res)
				closeBody(res)
				return nil, false
			}
			var page struct {
				Items      []held  `json:"items"`
				NextCursor *string `json:"nextCursor"`
			}
			err := json.NewDecoder(res.Body).Decode(&page)
			closeBody(res)
			if err != nil {
				r.unreadable(c, err)
				return nil, false
			}
			for _, s := range page.Items {
				if c.scope.holds(s.Owner, s.Labels) {
					ids[s.ID] = true
				}
			}
			if page.NextCursor == nil || *page.NextCursor == "" {
				break
			}
			q.Set("cursor", *page.NextCursor)
		}
	}
	return ids, true
}

// deletion is a line of changes that says a session is gone.
type deletion struct {
	Seq       int64            `json:"seq"`
	At        string           `json:"at"`
	Op        runyard.ChangeOp `json:"op"`
	SessionID string           `json:"sessionId"`
}

// keptChange is what of a line of changes the caller is given: the line, as
// a deletion, or nothing. A blank line, which keeps a quiet stream open, is
// kept as it is.
func keptChange(scope Scope, seen map[string]bool, line []byte) []byte {
	trimmed := bytes.TrimSpace(line)
	if len(trimmed) == 0 {
		return line
	}
	var change struct {
		Seq       int64  `json:"seq"`
		At        string `json:"at"`
		SessionID string `json:"sessionId"`
		Session   *held  `json:"session"`
	}
	if json.Unmarshal(trimmed, &change) != nil {
		return nil
	}
	if change.Session != nil && scope.holds(change.Session.Owner, change.Session.Labels) {
		seen[change.SessionID] = true
		return line
	}
	if !seen[change.SessionID] {
		return nil
	}
	delete(seen, change.SessionID)
	gone, err := json.Marshal(deletion{Seq: change.Seq, At: change.At, Op: runyard.Deleted, SessionID: change.SessionID})
	if err != nil {
		return nil
	}
	return append(gone, '\n')
}

// turn is a turn the caller says in their session.
func (r *relay) turn(c *call, s *held) {
	var body turnBody
	if !decode(c, &body) {
		return
	}
	t, ok := r.turnOf(c, body)
	if !ok {
		return
	}
	res, ok := r.send(c, http.MethodPost, sessionPath(s.ID)+"/turns", nil, t)
	if ok {
		defer closeBody(res)
		r.pass(c, res)
	}
}

// said is the call as the browser made it, to the session it is about, with
// a body of T: what of it T has, and nothing else.
func said[T any](r *relay, suffix string) func(*call, *held) {
	return func(c *call, s *held) {
		var body T
		if !decode(c, &body) {
			return
		}
		res, ok := r.send(c, c.r.Method, sessionPath(s.ID)+suffix, nil, body)
		if ok {
			defer closeBody(res)
			r.pass(c, res)
		}
	}
}

func (r *relay) editQueued(c *call, s *held) {
	var body runyard.QueuedTurnEdit
	if !decode(c, &body) {
		return
	}
	res, ok := r.send(c, http.MethodPatch, sessionPath(s.ID)+"/queue/"+url.PathEscape(c.r.PathValue("turnId")), nil, body)
	if ok {
		defer closeBody(res)
		r.pass(c, res)
	}
}

// ----------------------------------------------------------------- sign-in

// provider is the caller's provider's name, and false — answered — when
// there is none, or when the path names another.
func (r *relay) provider(c *call) (string, bool) {
	name, err := r.cfg.SignIn.Provider(c.r, c.p)
	if err != nil {
		r.refused(c.w, c.r, "SignIn.Provider", err)
		return "", false
	}
	if asked := c.r.PathValue("provider"); asked != "" && asked != name {
		writeError(c.w, http.StatusNotFound, runyard.ErrorCodeNotFound, "no such provider")
		return "", false
	}
	return name, true
}

// providers is the caller's provider, when there is one: runyard-agents'
// list, with only it.
func (r *relay) providers(c *call) {
	name, ok := r.provider(c)
	if !ok {
		return
	}
	r.page(c, "/v1/providers", nil, func(raw json.RawMessage) bool {
		var p struct {
			Name string `json:"name"`
		}
		return json.Unmarshal(raw, &p) == nil && p.Name == name
	})
}

func (r *relay) startSignIn(c *call) {
	name, ok := r.provider(c)
	if !ok {
		return
	}
	var body struct {
		Type   runyard.ProviderType  `json:"type"`
		Method *runyard.SignInMethod `json:"method,omitempty"`
		Title  *string               `json:"title,omitempty"`
	}
	if !decode(c, &body) {
		return
	}
	signIn := runyard.ProviderSignIn{Type: body.Type, Method: body.Method, Title: body.Title}
	if r.cfg.SignIn.Start != nil {
		if err := r.cfg.SignIn.Start(c.r, c.p, &signIn); err != nil {
			r.refused(c.w, c.r, "SignIn.Start", err)
			return
		}
	}
	owner := openapi_types.Email(c.p.Email)
	signIn.Owner = &owner
	res, ok := r.send(c, http.MethodPost, "/v1/providers/"+url.PathEscape(name)+"/signin", nil, signIn)
	if ok {
		defer closeBody(res)
		r.pass(c, res)
	}
}

func (r *relay) finishSignIn(c *call) {
	name, ok := r.provider(c)
	if !ok {
		return
	}
	var body runyard.ProviderSignInFinish
	if !decode(c, &body) {
		return
	}
	res, ok := r.send(c, http.MethodPost, "/v1/providers/"+url.PathEscape(name)+"/signin/"+url.PathEscape(c.r.PathValue("flowId")), nil, body)
	if !ok {
		return
	}
	defer closeBody(res)
	if res.StatusCode/100 != 2 || r.cfg.SignIn.Finished == nil {
		r.pass(c, res)
		return
	}
	raw, err := io.ReadAll(res.Body)
	if err != nil {
		r.unreadable(c, err)
		return
	}
	if err := r.cfg.SignIn.Finished(c.r, c.p, name); err != nil {
		r.refused(c.w, c.r, "SignIn.Finished", err)
		return
	}
	writeRaw(c.w, res.StatusCode, raw)
}

// ----------------------------------------------------------------- helpers

func closeBody(res *http.Response) { _ = res.Body.Close() }

func writeRaw(w http.ResponseWriter, status int, raw []byte) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, _ = w.Write(raw)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	raw, err := json.Marshal(v)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	writeRaw(w, status, append(raw, '\n'))
}

// writeError answers as runyard-agents refuses: its error, with a code the
// browser branches on.
func writeError(w http.ResponseWriter, status int, code runyard.ErrorCode, message string) {
	var e runyard.Error
	e.Error.Code, e.Error.Message = code, message
	writeJSON(w, status, e)
}

func sortedKeys(m map[string]string) []string { return slices.Sorted(maps.Keys(m)) }

func randomID() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}
