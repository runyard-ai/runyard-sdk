package ry

import (
	"context"
	"errors"
	"fmt"
	"io"
	"iter"
	"time"

	runyard "github.com/runyard-ai/runyard-sdk/go"
)

// Event is one event of a session's transcript: a User, TurnStarted, Text,
// ToolCall, ToolResult, TurnEnded, State or SessionError, and Other for
// every kind of event this package does not draw out.
type Event interface {
	base() Base
}

// Base is where an event is in its session's transcript.
type Base struct {
	// Seq is its place, from 1, without gaps.
	Seq int64
	// At is when it happened.
	At time.Time
}

func (b Base) base() Base { return b }

// User is a turn, as the session was given it.
type User struct {
	Base
	TurnID string
	Text   string
	// EndUser is whom it was sent for, when it was for one.
	EndUser *EndUser
}

// TurnStarted is the session starting on a turn.
type TurnStarted struct {
	Base
	TurnID string
}

// Text is a block of what the session said.
type Text struct {
	Base
	Text string
	// Subagent is the sub-agent that said it; empty, the session itself.
	Subagent string
}

// ToolCall is a tool the session called, by its harness's name for it.
type ToolCall struct {
	Base
	// ID is the call's, which its ToolResult has too.
	ID       string
	Name     string
	Input    map[string]any
	Subagent string
}

// ToolResult is what a tool answered.
type ToolResult struct {
	Base
	ID       string
	Content  string
	IsError  bool
	Subagent string
}

// TurnEnded is the end of a turn.
type TurnEnded struct {
	Base
	TurnID string
	// StopReason is end_turn, interrupted, max_tokens or error.
	StopReason runyard.TurnEndedEventStopReason
}

// State is the session's state changing.
type State struct {
	Base
	State runyard.SessionState
}

// SessionError is something going wrong in the session.
type SessionError struct {
	Base
	// Code is provider_error, harness_crashed, sandbox_failed or internal.
	Code    runyard.ErrorEventCode
	Message string
	// Retrying is the server starting the session again by itself.
	Retrying bool
}

// Other is an event of a kind this package does not draw out — thinking,
// a compaction, a sub-agent's start — as the API has it.
type Other struct {
	Base
	// Type is its kind, the API's `type`.
	Type  string
	Event runyard.SessionEvent
}

// Events is the session's transcript, from its start, followed: each event
// as it happens, until the loop is left, ctx ends or the server ends the
// stream. An error ends it too, yielded with a nil Event.
func (s *Session) Events(ctx context.Context) iter.Seq2[Event, error] {
	return func(yield func(Event, error) bool) {
		stream, err := s.follow(ctx, 0)
		if err != nil {
			yield(nil, err)
			return
		}
		defer func() { _ = stream.Close() }()
		for {
			ev, caughtUp, err := next(stream)
			if caughtUp {
				continue
			}
			if err != nil {
				yield(nil, err)
				return
			}
			decoded, err := decode(ev)
			if !yield(decoded, err) || err != nil {
				return
			}
		}
	}
}

// follow is the session's stream, followed from seq from on; from its
// oldest event kept when from is 0, or when from is no longer kept.
func (s *Session) follow(ctx context.Context, from int64) (*runyard.Stream[runyard.EventsLine], error) {
	follow := true
	params := &runyard.StreamEventsParams{Follow: &follow}
	if from > 0 {
		params.From = &from
	}
	stream, err := s.c.api.Events(ctx, s.id, params)
	if from > 0 && runyard.IsCode(err, runyard.ErrorCodeGapped) {
		// What was asked for has been trimmed: what is kept is all there
		// is to read, and a turn that ended before the call is told
		// apart by its seq, not by where reading began.
		params.From = nil
		stream, err = s.c.api.Events(ctx, s.id, params)
	}
	return stream, err
}

// next is the stream's next event, past its partials; or, caughtUp, the
// line that says the reader has every event there was when it asked.
func next(stream *runyard.Stream[runyard.EventsLine]) (ev runyard.SessionEvent, caughtUp bool, err error) {
	for {
		line, err := stream.Next()
		if errors.Is(err, io.EOF) {
			return runyard.SessionEvent{}, false, ErrStreamEnded
		}
		if err != nil {
			return runyard.SessionEvent{}, false, err
		}
		v, err := line.Value()
		if err != nil {
			return runyard.SessionEvent{}, false, err
		}
		switch v := v.(type) {
		case *runyard.SessionEvent:
			return *v, false, nil
		case *runyard.CaughtUpLine:
			return runyard.SessionEvent{}, true, nil
		}
	}
}

// decode is ev as the Event of its kind.
func decode(ev runyard.SessionEvent) (Event, error) {
	b := Base{Seq: ev.Seq, At: ev.At}
	kind, err := ev.Event.Discriminator()
	if err != nil {
		return nil, fmt.Errorf("ry: event %d: %w", ev.Seq, err)
	}
	var decoded Event
	switch kind {
	case "user":
		v, verr := ev.Event.AsUserEvent()
		decoded, err = User{Base: b, TurnID: v.TurnId, Text: v.Text, EndUser: endUserOf(v.EndUser)}, verr
	case "turn_started":
		v, verr := ev.Event.AsTurnStartedEvent()
		decoded, err = TurnStarted{Base: b, TurnID: v.TurnId}, verr
	case "text":
		v, verr := ev.Event.AsTextEvent()
		decoded, err = Text{Base: b, Text: v.Text, Subagent: deref(v.ParentToolId)}, verr
	case "tool_call":
		v, verr := ev.Event.AsToolCallEvent()
		decoded, err = ToolCall{Base: b, ID: v.ToolId, Name: v.Name, Input: v.Input, Subagent: deref(v.ParentToolId)}, verr
	case "tool_result":
		v, verr := ev.Event.AsToolResultEvent()
		decoded, err = ToolResult{Base: b, ID: v.ToolId, Content: v.Content, IsError: v.IsError, Subagent: deref(v.ParentToolId)}, verr
	case "turn_ended":
		v, verr := ev.Event.AsTurnEndedEvent()
		decoded, err = TurnEnded{Base: b, TurnID: v.TurnId, StopReason: v.StopReason}, verr
	case "state":
		v, verr := ev.Event.AsStateEvent()
		decoded, err = State{Base: b, State: v.State}, verr
	case "error":
		v, verr := ev.Event.AsErrorEvent()
		decoded, err = SessionError{Base: b, Code: v.Code, Message: v.Message, Retrying: v.Retrying != nil && *v.Retrying}, verr
	default:
		decoded = Other{Base: b, Type: kind, Event: ev}
	}
	if err != nil {
		return nil, fmt.Errorf("ry: event %d, %s: %w", ev.Seq, kind, err)
	}
	return decoded, nil
}

func deref[T any](p *T) T {
	if p == nil {
		var zero T
		return zero
	}
	return *p
}

// turn is what a turn said, folded from its events as they are read.
type turn struct {
	open    string
	texts   []string
	message string
}

// read folds ev into what the turn under way said. A turn's end is left to
// the caller, which knows whether it is the one it waits for.
func (t *turn) read(ev Event) {
	switch ev := ev.(type) {
	case TurnStarted:
		t.open, t.texts, t.message = ev.TurnID, nil, ""
	case Text:
		if t.open != "" && ev.Subagent == "" {
			t.texts = append(t.texts, ev.Text)
		}
	case SessionError:
		t.message = ev.Message
	}
}

// ended is the turn's answer as it ended: its text, and a *TurnError when
// it ended other than as it should.
func (t *turn) ended(ev TurnEnded) (string, error) {
	said := join(t.texts)
	if ev.StopReason != runyard.TurnEndedEventStopReasonEndTurn {
		return said, &TurnError{TurnID: ev.TurnID, StopReason: ev.StopReason, Message: t.message}
	}
	return said, nil
}

// await follows the stream from seq from until a turn ends after seq since
// — the turn of id id, or any turn when id is empty — and is what the
// session said in it. What ended at or before since was over before the
// caller asked, and is read past.
//
// Sent, the turn of id has left the session's queue (dequeued): once the
// reader has caught up without finding it given to the harness, it never
// was, and is a *TurnGoneError.
func (s *Session) await(ctx context.Context, from, since int64, id string, sent bool) (string, error) {
	stream, err := s.follow(ctx, from)
	if err != nil {
		return "", err
	}
	defer func() { _ = stream.Close() }()
	var (
		t     turn
		given bool
		// refused is the last error said while no turn was under way: a
		// turn refused as it was given, which the turn behind it, started
		// since, does not make any less so.
		refused string
	)
	for {
		raw, caughtUp, err := next(stream)
		if caughtUp {
			if sent && !given {
				why := takenOut
				if refused != "" {
					why = refused
				}
				return "", &TurnGoneError{TurnID: id, Why: why}
			}
			continue
		}
		if err != nil {
			return join(t.texts), err
		}
		ev, err := decode(raw)
		if err != nil {
			return join(t.texts), err
		}
		live := raw.Seq > since
		t.read(ev)
		switch ev := ev.(type) {
		case SessionError:
			if live && t.open == "" {
				refused = ev.Message
			}
		case User:
			given = given || (live && id != "" && ev.TurnID == id)
		case State:
			if live && ev.State == runyard.SessionStateFailed {
				return join(t.texts), fmt.Errorf("%w: %s", ErrFailed, t.message)
			}
		case TurnEnded:
			if !live || (id != "" && ev.TurnID != id) || (t.open != "" && t.open != ev.TurnID) {
				t = turn{}
				continue
			}
			s.mark(ev.Seq + 1)
			return t.ended(ev)
		}
	}
}

// LastReply is what the session said in the turn that ended last — as Reply
// has it, a *TurnError when it ended other than as it should — or
// ErrNoReply when none has. What a handle made of an id alone reads the
// answer of a turn sent in another request with, once it has ended; a
// Reply after it waits for the turn after that one.
func (s *Session) LastReply(ctx context.Context) (string, error) {
	// Not followed: what is kept, to its end.
	stream, err := s.c.api.Events(ctx, s.id, &runyard.StreamEventsParams{})
	if err != nil {
		return "", err
	}
	defer func() { _ = stream.Close() }()
	var (
		t      turn
		last   *TurnEnded
		said   string
		cutOff error
	)
	for {
		raw, _, err := next(stream)
		if errors.Is(err, ErrStreamEnded) {
			break
		}
		if err != nil {
			return "", err
		}
		ev, err := decode(raw)
		if err != nil {
			return "", err
		}
		t.read(ev)
		if e, ok := ev.(TurnEnded); ok {
			last = &e
			said, cutOff = t.ended(e)
			t = turn{}
		}
	}
	if last == nil {
		return "", ErrNoReply
	}
	s.mark(last.Seq + 1)
	return said, cutOff
}
