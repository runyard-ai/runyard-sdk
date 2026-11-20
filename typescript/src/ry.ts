// The short way to runyard-agents: start a session, wait for its answer, say
// something else, and hand a browser a token for it — without knowing what
// the API calls owners, scopes or labels. The same as the Go SDK's ry,
// call for call.
//
//   const ry = new Runyard({ url: 'https://agents.example.com', key });
//   const s = await ry.start({ profile: 'support', text: 'Summarize ticket #42' });
//   const answer = await s.reply();
//   const next = await s.send('Now draft a reply');
//
// For one of an application's own users, and their browser:
//
//   const s = await ry.start({ profile: 'support', endUser: { id: user.id } });
//   const { token, expiresAt } = await s.token({ endUser: { id: user.id, email: user.email } });
//
// The generated client is beneath it (Runyard.configuration), for
// everything else; an answer other than a success is an APIError, its code
// the server's.

import { SessionsApi, TurnsApi } from './apis/index.js';
import type { ListSessionsRequest } from './apis/index.js';
import { Configuration } from './runtime.js';
import type { FetchAPI } from './runtime.js';
import { ErrorCode, SessionState, TurnEndedEventStopReasonEnum } from './models/index.js';
import type { Change, EndUser, Event, EventsLine, Session, SessionSpec, SessionTokenRequest } from './models/index.js';
import { apiError } from './errors.js';
import { readChanges, readEvents } from './streams.js';
import type { Stream } from './streams.js';

/** A server, and the key it is spoken to with. */
export interface RunyardOptions {
  /** The server, without /v1: https://agents.example.com. */
  url: string;
  /** An application's key, with sessions.read and sessions.write — or a session token, for the session it is for. */
  key: string;
  /** The fetch requests are made with; the platform's when absent. */
  fetch?: FetchAPI;
}

/** What may end a wait, or a stream: and every call, which each method takes. */
export interface WaitOptions {
  signal?: AbortSignal;
}

/** A session to start. Every field may be left out: a session of the server's defaults, waiting for its first turn. */
export interface StartOptions extends WaitOptions {
  /** The profile it is started from, by id, at its latest version. */
  profile?: string;
  /** Its title; made from its first turn when absent. */
  title?: string;
  /** Its first turn, sent with it. */
  text?: string;
  /** The application's user it is for; none, it is the application's own. */
  endUser?: EndUser;
  /** The application's own, to find it by (ListOptions.labels). */
  labels?: Record<string, string>;
  /** Anything else of the API's SessionSpec — a harness, a model, resources. The fields above are written over it. */
  spec?: SessionSpec;
}

/** Which sessions sessions() lists: every one the key reaches, when empty. */
export interface ListOptions extends WaitOptions {
  /** The id of the end user whose sessions they are. */
  endUser?: string;
  /** Labels each listed session carries, every one. */
  labels?: Record<string, string>;
  /** The archived sessions, and only those. */
  archived?: boolean;
}

/** What a token is minted with. */
export interface TokenOptions extends WaitOptions {
  /** Whom it speaks for: its turns are sent for them. Absent, the session's end user. */
  endUser?: EndUser;
  /**
   * How long it works, in seconds: 60 to 86400, rounded down to the second.
   * Absent or 0 is the server's default, an hour; under 60 is a RangeError,
   * before the server is asked.
   */
  ttlSeconds?: number;
}

/** A session token: what a browser talks to one session with (Authorization: Bearer token), until expiresAt. */
export interface Token {
  token: string;
  sessionId: string;
  endUser?: EndUser;
  expiresAt: Date;
}

/** An event of a session's transcript, by its `type`, with where it is in it. */
export type RyEvent = Event & { seq: number; at: Date };

/** A turn that ended other than as it should: interrupted, cut at its model's limit, or failed. */
export class TurnError extends Error {
  override name = 'TurnError';
  readonly turnId: string;
  /** interrupted, max_tokens or error. */
  readonly stopReason: string;
  /** What the session said in the turn before it ended. */
  readonly text: string;
  /** The last error the session said in the turn, if it said one. */
  readonly errorMessage: string | undefined;

  constructor(turnId: string, stopReason: string, text: string, errorMessage: string | undefined) {
    super(`ry: turn ${turnId} ended: ${stopReason}${errorMessage === undefined ? '' : `: ${errorMessage}`}`);
    this.turnId = turnId;
    this.stopReason = stopReason;
    this.text = text;
    this.errorMessage = errorMessage;
  }
}

/**
 * A turn sent that the session never started: taken out of its queue while it
 * waited — cancelled (DELETE …/queue/{turnId}), or dropped by an interrupt
 * that dropped the queue — or refused as it was given to the harness.
 */
export class TurnGoneError extends Error {
  override name = 'TurnGoneError';
  readonly turnId: string;
  /** The error the session refused it with, when it said one; else that it was taken out of the queue. */
  readonly why: string;

  constructor(turnId: string, why: string) {
    super(`ry: turn ${turnId} was never started: ${why}`);
    this.turnId = turnId;
    this.why = why;
  }
}

/** A TurnGoneError's why when the session said nothing of it: a cancel and an interrupt that drops the queue write nothing on its stream. */
export const takenOut = 'it was taken out of the queue (cancelled, or dropped by an interrupt)';

/** lastReply() of a session no turn of which has ended. */
export class NoReplyError extends Error {
  override name = 'NoReplyError';

  constructor() {
    super('ry: no turn of the session has ended');
  }
}

/** A session that failed while a turn was waited for: its sandbox or its harness could not be started, again and again. */
export class SessionFailedError extends Error {
  override name = 'SessionFailedError';
}

/** The server ending a session's stream before the turn waited for ended: the session was deleted, or the server stopped. */
export class StreamEndedError extends Error {
  override name = 'StreamEndedError';
  /** What the session said in the turn before its stream ended. */
  readonly text: string;

  constructor(text = '') {
    super("ry: the session's stream ended before its turn did");
    this.text = text;
  }
}

/** A server, spoken to with a key. */
export class Runyard {
  /** The generated client's configuration, with the same key: every operation of the API, as the API says it. */
  readonly configuration: Configuration;
  private readonly sessionsApi: SessionsApi;

  constructor(options: RunyardOptions) {
    this.configuration = new Configuration({
      basePath: options.url.replace(/\/+$/, ''),
      accessToken: options.key,
      ...(options.fetch === undefined ? {} : { fetchApi: options.fetch }),
    });
    this.sessionsApi = new SessionsApi(this.configuration);
  }

  /** Starts a session. The answer comes once the server has it, not once its sandbox is up: reply() waits for that too. */
  async start(options: StartOptions = {}): Promise<RunyardSession> {
    const spec: SessionSpec = { ...options.spec };
    if (options.profile !== undefined) spec.profileId = options.profile;
    if (options.title !== undefined) spec.title = options.title;
    if (options.endUser !== undefined) spec.endUser = options.endUser;
    if (options.labels !== undefined) spec.labels = { ...options.labels };
    if (options.text !== undefined && options.text !== '') spec.firstTurn = { turnId: turnId(), text: options.text };
    const answer = await call(this.sessionsApi.startSessionRaw({ sessionSpec: spec }, init(options.signal)));
    const made = await answer.value();
    if (answer.raw.status === 201) {
      // A session just made has had no turn end: every turn_ended on its
      // stream is one after this call, so reply() need not ask where it is.
      return new RunyardSession(this.configuration, made.id, 0);
    }
    // Found again by its Idempotency-Key: made by an earlier call, whose
    // turns may have ended since, so this is a handle like any other.
    return new RunyardSession(this.configuration, made.id);
  }

  /** A handle on a session the key reaches, by its id. It asks nothing of the server until it is used. */
  session(id: string): RunyardSession {
    return new RunyardSession(this.configuration, id);
  }

  /** Every session the key reaches that list says, newest activity first: each page of them, read to the last. */
  async sessions(list: ListOptions = {}): Promise<Session[]> {
    const request: ListSessionsRequest = {};
    if (list.endUser !== undefined && list.endUser !== '') request.endUser = list.endUser;
    const labels = Object.entries(list.labels ?? {})
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([k, v]) => `${k}=${v}`);
    if (labels.length > 0) request.label = labels;
    if (list.archived === true) request.archived = true;
    const all: Session[] = [];
    for (;;) {
      const page = await call(this.sessionsApi.listSessions(request, init(list.signal)));
      all.push(...page.items);
      const next = page.nextCursor;
      // A cursor that comes back as the one asked with would be read for ever.
      if (next === undefined || next === '' || next === request.cursor) {
        return all;
      }
      request.cursor = next;
    }
  }
}

/** One session, by its id. */
export class RunyardSession {
  readonly id: string;
  private readonly configuration: Configuration;
  private readonly sessions: SessionsApi;
  private readonly turns: TurnsApi;
  // Where its stream is read from for the next reply(): just past the last
  // turn this handle saw end, once it has seen one. No turn is under way
  // across a turn's end, so nothing of the next is before it.
  private from: number | undefined;

  /**
   * A handle on session id of configuration's server — Runyard.session is
   * the way to one — whose next reply is read from seq from on, when that is
   * known.
   */
  constructor(configuration: Configuration, id: string, from?: number) {
    this.configuration = configuration;
    this.sessions = new SessionsApi(configuration);
    this.turns = new TurnsApi(configuration);
    this.id = id;
    this.from = from;
  }

  /** The session as it is now. */
  info(options: WaitOptions = {}): Promise<Session> {
    return call(this.sessions.getSession({ sessionId: this.id }, init(options.signal)));
  }

  /** Deletes the session, its transcript and its disk. */
  async delete(options: WaitOptions = {}): Promise<void> {
    await call(this.sessions.deleteSession({ sessionId: this.id }, init(options.signal)));
  }

  /**
   * Says text to the session, as a new turn, and is its answer once the turn
   * has ended (reply). A turn sent while another is under way waits behind it.
   *
   * A turn the session never starts — taken out of its queue while it waited,
   * by the page's cancel or an interrupt that dropped the queue, or refused as
   * it was given to the harness — is a TurnGoneError, as soon as it is gone.
   */
  async send(text: string, options: WaitOptions = {}): Promise<string> {
    const { signal } = options;
    // Where its stream is now: the turn sent is after it, since a turn is
    // on the stream only once the harness is given it.
    const now = await this.info({ signal });
    // Where the changes to the sessions are now, before the turn is sent:
    // the change that queues it is after it.
    const changed = (await call(this.sessions.listSessions({ limit: 1 }, init(signal)))).changeSeq;
    const id = turnId();
    await call(this.turns.sendTurn({ sessionId: this.id, turn: { turnId: id, text } }, init(signal)));
    await this.dequeued(changed, id, signal);
    return this.await(now.lastSeq + 1, now.lastSeq, id, true, signal);
  }

  /**
   * Waits for the turn under way — or, with none, the next — to end, and is
   * what the session said in it: its text, the blocks of it joined by a blank
   * line, without its sub-agents' or its tools'. A turn that ended other than
   * as it should is a TurnError, with what was said before it ended.
   *
   * A turn that ended before the call is not waited for: a handle made of an
   * id alone, after its turn ended — the turn sent in one request, its answer
   * read in another — waits for the next one. lastReply() is the answer of
   * the turn that ended last.
   */
  async reply(options: WaitOptions = {}): Promise<string> {
    let since = 0;
    if (this.from === undefined) {
      // Without a turn of its own seen, the handle reads the transcript from
      // its start, to find the turn under way; a turn that ended before this
      // call is not the one waited for.
      since = (await this.info(options)).lastSeq;
    }
    return this.await(this.from ?? 0, since, undefined, false, options.signal);
  }

  /**
   * What the session said in the turn that ended last — as reply() has it, a
   * TurnError when it ended other than as it should — or a NoReplyError when
   * none has. What a handle made of an id alone reads the answer of a turn
   * sent in another request with, once it has ended; a reply() after it
   * waits for the turn after that one.
   */
  async lastReply(options: WaitOptions = {}): Promise<string> {
    // Not followed: what is kept, to its end.
    const stream = await readEvents(this.configuration, { sessionId: this.id }, init(options.signal));
    const t = new Turn();
    let last: { said: string; message: string | undefined; ended: RyEvent & { type: 'turn_ended' } } | undefined;
    try {
      for (;;) {
        let ev: RyEvent | 'caughtUp';
        try {
          ev = await next(stream);
        } catch (err) {
          if (err instanceof StreamEndedError) break;
          throw err;
        }
        if (ev === 'caughtUp') continue;
        t.read(ev);
        if (ev.type === 'turn_ended') {
          last = { said: t.said(), message: t.message, ended: ev };
          t.reset();
        }
      }
    } finally {
      await stream.close();
    }
    if (last === undefined) {
      throw new NoReplyError();
    }
    this.mark(last.ended.seq + 1);
    if (last.ended.stopReason !== TurnEndedEventStopReasonEnum.EndTurn) {
      throw new TurnError(last.ended.turnId, last.ended.stopReason, last.said, last.message);
    }
    return last.said;
  }

  /**
   * The session's transcript, from its start, followed: each event as it
   * happens, until the loop is left, the signal is aborted or the server ends
   * the stream (a StreamEndedError).
   */
  async *events(options: WaitOptions = {}): AsyncGenerator<RyEvent, void, undefined> {
    const stream = await this.follow(0, options.signal);
    try {
      for (;;) {
        const ev = await next(stream);
        if (ev !== 'caughtUp') yield ev;
      }
    } finally {
      await stream.close();
    }
  }

  /** Mints a token for the session, for a browser: it reads the session and talks in it, and nothing else. */
  async token(options: TokenOptions = {}): Promise<Token> {
    const request: SessionTokenRequest = {};
    if (options.endUser !== undefined) request.endUser = options.endUser;
    const ttl = options.ttlSeconds;
    if (ttl !== undefined && ttl !== 0) {
      if (!(ttl >= 60)) {
        // The server refuses it as it refuses anything under a minute: said
        // here, as what was asked, before a request is made of it.
        throw new RangeError(
          `ry: a token's ttlSeconds is 0 or absent, for the server's default of an hour, or at least 60: ${String(ttl)}`,
        );
      }
      request.ttlSeconds = Math.floor(ttl);
    }
    const t = await call(
      this.sessions.createSessionToken({ sessionId: this.id, sessionTokenRequest: request }, init(options.signal)),
    );
    return {
      token: t.token,
      sessionId: t.sessionId,
      ...(t.endUser === undefined ? {} : { endUser: t.endUser }),
      expiresAt: t.expiresAt,
    };
  }

  private mark(from: number): void {
    if (this.from === undefined || from > this.from) {
      this.from = from;
    }
  }

  private async follow(from: number, signal: AbortSignal | undefined): Promise<Stream<EventsLine>> {
    if (from > 0) {
      try {
        return await readEvents(this.configuration, { sessionId: this.id, from, follow: true }, init(signal));
      } catch (err) {
        // What was asked for has been trimmed: what is kept is all there is
        // to read, and a turn that ended before the call is told apart by
        // its seq, not by where reading began.
        if ((await apiError(err))?.code !== ErrorCode.Gapped) {
          throw err;
        }
      }
    }
    return readEvents(this.configuration, { sessionId: this.id, follow: true }, init(signal));
  }

  // dequeued follows the changes to the sessions from just past changed until
  // the turn of id has left the session's queue: given to the harness, taken
  // out, or refused. Its transcript then says which (await). The session's
  // queue is the one place a turn taken out of it is said: a cancel, or an
  // interrupt that drops the queue, writes nothing on its stream.
  private async dequeued(changed: number, id: string, signal: AbortSignal | undefined): Promise<void> {
    // What changed before the turn was queued — the stream is read from
    // before it was sent — says nothing of it: it has left the queue only
    // once it was seen in it. Sending queues it before it answers, so it is
    // seen.
    let seen = false;
    let stream: Stream<Change>;
    try {
      stream = await readChanges(this.configuration, { from: changed + 1, follow: true }, init(signal));
    } catch (err) {
      if ((await apiError(err))?.code !== ErrorCode.Gapped) {
        throw err;
      }
      // What changed since it was sent is no longer kept: the session as it
      // is now says whether it still waits, and the changes from here on
      // when it stops.
      const now = (await call(this.sessions.listSessions({ limit: 1 }, init(signal)))).changeSeq;
      const got = await this.info({ signal });
      if (!(got.queue ?? []).some((q) => q.turnId === id)) return;
      seen = true;
      stream = await readChanges(this.configuration, { from: now + 1, follow: true }, init(signal));
    }
    try {
      for (;;) {
        const line = await stream.next();
        if (line.done === true) {
          throw new StreamEndedError();
        }
        const c: Change = line.value;
        if (c.sessionId !== this.id) continue;
        if (c.op === 'deleted' || c.session === undefined) {
          throw new StreamEndedError();
        }
        if (!(c.session.queue ?? []).some((q) => q.turnId === id)) {
          if (seen) return;
          continue;
        }
        seen = true;
        if (c.session.state === SessionState.Failed) {
          // Kept waiting, it is given at the next wake; the caller is told
          // now rather than left waiting for one.
          throw new SessionFailedError(`ry: the session failed${c.session.error === undefined ? '' : `: ${c.session.error}`}`);
        }
      }
    } finally {
      await stream.close();
    }
  }

  // await follows the stream from seq from until a turn ends after seq
  // since — the turn of id turn, or any turn when it is undefined — and is
  // what the session said in it. What ended at or before since was over
  // before the caller asked, and is read past.
  //
  // Sent, the turn has left the session's queue (dequeued): once the reader
  // has caught up without finding it given to the harness, it never was,
  // and is a TurnGoneError.
  private async await(
    from: number,
    since: number,
    turn: string | undefined,
    sent: boolean,
    signal: AbortSignal | undefined,
  ): Promise<string> {
    const stream = await this.follow(from, signal);
    const t = new Turn();
    let given = false;
    // refused is the last error said while no turn was under way: a turn
    // refused as it was given, which the turn behind it, started since,
    // does not make any less so.
    let refused: string | undefined;
    try {
      for (;;) {
        let ev: RyEvent | 'caughtUp';
        try {
          ev = await next(stream);
        } catch (err) {
          throw err instanceof StreamEndedError ? new StreamEndedError(t.said()) : err;
        }
        if (ev === 'caughtUp') {
          if (sent && !given) {
            throw new TurnGoneError(turn ?? '', refused ?? takenOut);
          }
          continue;
        }
        const live = ev.seq > since;
        t.read(ev);
        switch (ev.type) {
          case 'error':
            if (live && t.open === undefined) refused = ev.message;
            break;
          case 'user':
            if (live && turn !== undefined && ev.turnId === turn) given = true;
            break;
          case 'state':
            if (live && ev.state === SessionState.Failed) {
              throw new SessionFailedError(`ry: the session failed${t.message === undefined ? '' : `: ${t.message}`}`);
            }
            break;
          case 'turn_ended': {
            if (!live || (turn !== undefined && ev.turnId !== turn) || (t.open !== undefined && t.open !== ev.turnId)) {
              t.reset();
              break;
            }
            this.mark(ev.seq + 1);
            const said = t.said();
            if (ev.stopReason !== TurnEndedEventStopReasonEnum.EndTurn) {
              throw new TurnError(ev.turnId, ev.stopReason, said, t.message);
            }
            return said;
          }
          default:
            break;
        }
      }
    } finally {
      await stream.close();
    }
  }
}

/** What a turn said, folded from its events as they are read. A turn's end is left to the caller, which knows whether it is the one it waits for. */
class Turn {
  open: string | undefined;
  message: string | undefined;
  private texts: string[] = [];

  read(ev: RyEvent): void {
    switch (ev.type) {
      case 'turn_started':
        this.reset();
        this.open = ev.turnId;
        break;
      case 'text':
        if (this.open !== undefined && ev.parentToolId === undefined) this.texts.push(ev.text);
        break;
      case 'error':
        this.message = ev.message;
        break;
      default:
        break;
    }
  }

  reset(): void {
    this.open = undefined;
    this.message = undefined;
    this.texts = [];
  }

  said(): string {
    return this.texts.join('\n\n');
  }
}

/** The stream's next event, past its partials; or 'caughtUp', where the reader has every event there was when it asked. */
async function next(stream: Stream<EventsLine>): Promise<RyEvent | 'caughtUp'> {
  for (;;) {
    const line = await stream.next();
    if (line.done === true) {
      throw new StreamEndedError();
    }
    if (line.value.line === 'event') {
      return { ...line.value.event, seq: line.value.seq, at: line.value.at };
    }
    if (line.value.line === 'caughtUp') {
      return 'caughtUp';
    }
  }
}

/** A generated call's init: its signal, when it has one. */
function init(signal: AbortSignal | undefined): RequestInit | undefined {
  return signal === undefined ? undefined : { signal };
}

/** A generated call's answer, or the APIError it was. */
async function call<T>(answer: Promise<T>): Promise<T> {
  try {
    return await answer;
  } catch (err) {
    throw (await apiError(err)) ?? err;
  }
}

/** A turn's id, random: the caller's own, for a retry, so one that reads well in a log. */
export function turnId(): string {
  const bytes = new Uint8Array(8);
  // Node 18 has no global crypto. The id is a name for a retry, not a
  // secret, so Math.random is enough where nothing better is.
  const crypto = (globalThis as { crypto?: Crypto }).crypto;
  if (crypto === undefined) {
    bytes.forEach((_, i) => (bytes[i] = Math.floor(Math.random() * 256)));
  } else {
    crypto.getRandomValues(bytes);
  }
  return `ry-${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')}`;
}
