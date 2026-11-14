// Package runyard is the Go client of runyard-agents: the types and the client
// generated from the API's OpenAPI document (client.gen.go), and what the
// generated code cannot do on its own — a key on every request, an error
// answer as an error, and the streams read as they are written.
//
//	client, err := runyard.NewClientWithResponses("https://agents.example.com", runyard.WithKey(key))
//	...
//	got, err := client.GetSessionWithResponse(ctx, "s1")
//	if err := runyard.Checked(got, err); err != nil {
//		...
//	}
package runyard

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

// WithKey has every request carry key, an API key (ryak_…) or a platform's
// JWT, as its bearer token.
func WithKey(key string) ClientOption {
	return WithRequestEditorFn(func(_ context.Context, r *http.Request) error {
		r.Header.Set("Authorization", "Bearer "+key)
		return nil
	})
}

// APIError is an answer other than a success: its status, and the error the
// server said, when the body is one of its errors.
type APIError struct {
	// Status is the answer's HTTP status.
	Status int
	// Code is the error's code; empty when the body is not one of the
	// server's errors, as a proxy's answer is not.
	Code ErrorCode
	// Message is the error's message, for a person reading a log.
	Message string
	// Body is the answer's body, as it was read.
	Body []byte
}

func (e *APIError) Error() string {
	if e.Code == "" {
		return fmt.Sprintf("runyard-agents: %d %s", e.Status, http.StatusText(e.Status))
	}
	return fmt.Sprintf("runyard-agents: %d %s: %s", e.Status, e.Code, e.Message)
}

// Check is nil for a 2xx answer, and an *APIError for any other.
func Check(status int, body []byte) error {
	if status >= 200 && status < 300 {
		return nil
	}
	e := &APIError{Status: status, Body: body}
	var answer Error
	if json.Unmarshal(body, &answer) == nil {
		e.Code, e.Message = answer.Error.Code, answer.Error.Message
	}
	return e
}

// Response is any answer of ClientWithResponses: its status, and the body it
// was read from (responses.gen.go).
type Response interface {
	StatusCode() int
	Raw() []byte
}

// Checked is the error of a call: err when it was not answered, an *APIError
// when it was answered with anything but a 2xx, and nil when it succeeded.
func Checked(res Response, err error) error {
	if err != nil {
		return err
	}
	return Check(res.StatusCode(), res.Raw())
}

// IsCode is whether err is, or wraps, an *APIError of code.
func IsCode(err error, code ErrorCode) bool {
	var e *APIError
	return errors.As(err, &e) && e.Code == code
}

// Stream is one of the API's streams of JSON lines, read as the server writes
// them: the transcript of a session (Client.Events) or the changes to the
// account's sessions (Client.Changes). Followed, it stays open until it is
// closed, its context is cancelled or the server ends it.
type Stream[T any] struct {
	body   io.ReadCloser
	reader *bufio.Reader
}

// Next is the next line, waited for. At the stream's end it is io.EOF.
// Blank lines, which the server writes to keep a quiet stream open through
// proxies, are skipped.
func (s *Stream[T]) Next() (T, error) {
	var line T
	for {
		raw, err := s.reader.ReadBytes('\n')
		if raw = bytes.TrimSpace(raw); len(raw) > 0 {
			if jerr := json.Unmarshal(raw, &line); jerr != nil {
				return line, fmt.Errorf("runyard-agents: a line of the stream: %w", jerr)
			}
			return line, nil
		}
		if err != nil {
			return line, err
		}
	}
}

// Close ends the stream.
func (s *Stream[T]) Close() error { return s.body.Close() }

// stream is the answer as a Stream when it is a success, and its error when
// it is not.
func stream[T any](res *http.Response, err error) (*Stream[T], error) {
	if err != nil {
		return nil, err
	}
	if res.StatusCode != http.StatusOK {
		defer func() { _ = res.Body.Close() }()
		body, rerr := io.ReadAll(res.Body)
		if rerr != nil {
			return nil, rerr
		}
		if cerr := Check(res.StatusCode, body); cerr != nil {
			return nil, cerr
		}
		return nil, &APIError{Status: res.StatusCode, Body: body}
	}
	return &Stream[T]{body: res.Body, reader: bufio.NewReader(res.Body)}, nil
}

// Events is a session's transcript as a stream (streamEvents): its events
// from params.From on and, with params.Follow, every new one as it happens,
// with the partials and the one CaughtUpLine following brings. What was
// asked for and is no longer kept is an *APIError of ErrorCodeGapped, its
// Body a GapError.
func (c *Client) Events(ctx context.Context, sessionID SessionId, params *StreamEventsParams, reqEditors ...RequestEditorFn) (*Stream[EventsLine], error) {
	return events(ctx, c, sessionID, params, reqEditors)
}

// Changes is every change to the account's sessions as a stream
// (streamChanges), from params.From on and, with params.Follow, as they
// happen.
func (c *Client) Changes(ctx context.Context, params *StreamChangesParams, reqEditors ...RequestEditorFn) (*Stream[Change], error) {
	return changes(ctx, c, params, reqEditors)
}

// Events is Client.Events.
func (c *ClientWithResponses) Events(ctx context.Context, sessionID SessionId, params *StreamEventsParams, reqEditors ...RequestEditorFn) (*Stream[EventsLine], error) {
	return events(ctx, c.ClientInterface, sessionID, params, reqEditors)
}

// Changes is Client.Changes.
func (c *ClientWithResponses) Changes(ctx context.Context, params *StreamChangesParams, reqEditors ...RequestEditorFn) (*Stream[Change], error) {
	return changes(ctx, c.ClientInterface, params, reqEditors)
}

func events(ctx context.Context, c ClientInterface, sessionID SessionId, params *StreamEventsParams, reqEditors []RequestEditorFn) (*Stream[EventsLine], error) {
	res, err := c.StreamEvents(ctx, sessionID, params, reqEditors...) //nolint:bodyclose // the Stream's, closed by its Close
	return stream[EventsLine](res, err)
}

func changes(ctx context.Context, c ClientInterface, params *StreamChangesParams, reqEditors []RequestEditorFn) (*Stream[Change], error) {
	res, err := c.StreamChanges(ctx, params, reqEditors...) //nolint:bodyclose // the Stream's, closed by its Close
	return stream[Change](res, err)
}

// Value is which of its kinds the line is, by what its line field says: a
// *SessionEvent, a *PartialLine or a *CaughtUpLine. A line of a kind this
// SDK does not know is an error.
//
// A server of v0.37.0 or earlier writes no line field. Its lines are told
// apart by the field only each kind has instead.
func (t EventsLine) Value() (any, error) {
	var keys map[string]json.RawMessage
	if err := json.Unmarshal(t.union, &keys); err != nil {
		return nil, fmt.Errorf("runyard-agents: an events line: %w", err)
	}
	kind, err := t.Discriminator()
	if err != nil {
		return nil, fmt.Errorf("runyard-agents: an events line: %w", err)
	}
	if keys["line"] == nil {
		switch {
		case keys["partial"] != nil:
			kind = string(PartialLineLinePartial)
		case keys["caughtUp"] != nil:
			kind = string(CaughtUpLineLineCaughtUp)
		case keys["event"] != nil:
			kind = string(SessionEventLineEvent)
		}
	}
	switch kind {
	case string(PartialLineLinePartial):
		v, err := t.AsPartialLine()
		return &v, err
	case string(CaughtUpLineLineCaughtUp):
		v, err := t.AsCaughtUpLine()
		return &v, err
	case string(SessionEventLineEvent):
		v, err := t.AsSessionEvent()
		return &v, err
	}
	return nil, fmt.Errorf("runyard-agents: an events line of no kind it knows: %s", t.union)
}
