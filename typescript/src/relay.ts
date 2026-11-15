// runyard-agents' API served by a program's own backend to its own front end:
// the part of it a conversation needs, for the people the program signs in
// itself, each reaching only their own sessions. The same relay as the Go
// SDK's (go/relay), route for route and rule for rule.
//
// The program holds one key of the workspace, with sessions.person, which can
// act on every session in it. The relay is what stands between that key and a
// browser: it answers only the routes it knows, lets the browser say only what
// is the browser's to say, and reaches a session only once it is the caller's
// — its owner and its labels the caller's scope's. What it answers is
// runyard-agents' own, as runyard-agents wrote it, under the same paths, so a
// front end reads it with the same code it would read runyard-agents with
// (@runyard-ai/runyard-react).
//
//   const relay = createRelay({
//     url: 'https://agents.example.com', key, prefix: '/agents',
//     person: (req) => ({ email: whoIs(req) }),
//   });
//   // A fetch handler (Next.js, Hono, Bun, Deno): relay(request).
//   // node:http or Express: app.use('/agents', toNodeHandler(relay)).

import type { Attachment, ErrorCode, ProviderSignIn, Session, SessionSpec, Turn } from './models/index.js';
import { SessionFromJSON } from './models/index.js';

/** Whom a request is for: a person of the workspace, whom the key speaks for. */
export interface Person {
  /** Who they are in the workspace. */
  email: string;
}

/**
 * Which of the workspace's sessions a person reaches through the relay: those
 * of its owner that carry every one of its labels. A session started through
 * it is made so.
 */
export interface Scope {
  /** Whose the sessions are: the person's own email, or — for sessions the program runs for everybody — the key's person's. */
  owner: string;
  /** What each of its sessions carries; none is every session of the owner's, those started in runyard-agents' own chat too. */
  labels?: Record<string, string>;
  /** Sessions are read and talked in, and never started in: the program starts them, for its own reasons. */
  noStart?: boolean;
}

type Maybe<T> = T | Promise<T>;

/** What a person signing in a provider of their own is: see RelayConfig.signIn. */
export interface SignInConfig {
  /** The name of the person's provider: the one they may sign in. */
  provider(req: Request, person: Person): Maybe<string>;
  /** What the sign-in is started with, besides the type, method and title the browser said. Its owner is the person whatever it does. */
  start?(req: Request, person: Person, signIn: ProviderSignIn): Maybe<void>;
  /** Told once the provider is signed in, before the browser is: whom else to let use it, say. Throwing is the answer, the sign-in done. */
  finished?(req: Request, person: Person, provider: string): Maybe<void>;
}

/** Where the relay says what goes wrong that is not the caller's to know: console, or a logger like it. */
export interface RelayLog {
  warn(message: string, fields: Record<string, unknown>): void;
  error(message: string, fields: Record<string, unknown>): void;
}

export interface RelayConfig {
  /** runyard-agents' API, as the program reaches it: its origin, and the path it is served under, if any. */
  url: string;
  /** The workspace's key, with sessions.read, sessions.write and sessions.person — sessions.delete to delete one, providers.write with signIn. */
  key: string;
  /** The path the relay is served under, taken off before its routes (/v1/…) are matched: '/agents', say. */
  prefix?: string;
  /** What makes the requests; the global fetch unless said. */
  fetch?: typeof fetch;
  /** Whom req is for, from the program's own sign-in. Throwing is 401 — or, a RelayError, what it says. */
  person(req: Request): Maybe<Person>;
  /** Which sessions the person reaches; their own, every one, unless said. */
  scope?(req: Request, person: Person): Maybe<Scope>;
  /**
   * What a session is started with, besides what the browser said of it (its
   * title, its first turn) and the scope's owner and labels: its profile, its
   * provider. Throwing refuses it. Labels it adds are kept; the scope's are
   * the scope's whatever it does.
   */
  start?(req: Request, person: Person, spec: SessionSpec): Maybe<void>;
  /** What a turn is sent with, besides its text and mode: its provider, its model. Throwing refuses it. A first turn is told here too. */
  turn?(req: Request, person: Person, turn: Turn): Maybe<void>;
  /** Told of a session once it is started, before the browser is: what the program records of it. */
  started?(req: Request, person: Person, session: Session): Maybe<void>;
  /** When set, serves a person signing their own provider in. */
  signIn?: SignInConfig;
  /** Makes a turn's id when the browser gives none; a random one unless said. */
  newId?(): string;
  /** Told what goes wrong that is not the caller's to know; nobody unless said. */
  log?: RelayLog;
}

/** A refusal: what a hook throws for the relay to answer with, rather than a 500. */
export class RelayError extends Error {
  override name = 'RelayError';
  readonly status: number;
  readonly code: ErrorCode;

  constructor(status: number, code: ErrorCode, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/** The relay: runyard-agents' answer to a request, or its own refusal. */
export type Relay = (req: Request) => Promise<Response>;

/** The most of a request's body the relay reads: what the browser says is a few words. */
const MAX_BODY = 1 << 20;

/** What bounds the listing changes starts from: ten pages of runyard-agents' own size, archived and not. */
const PAGES = 10;

/** The headers of an answer the browser is given, of runyard-agents': what its body is, and how long it may be kept. */
const PASSED = ['content-type', 'content-disposition', 'cache-control', 'etag', 'last-modified', 'x-content-type-options'];

/** What of a session the relay reads to tell whose it is. */
interface Held {
  id?: unknown;
  owner?: unknown;
  labels?: unknown;
}

/** One request, its caller resolved. */
interface Call {
  req: Request;
  person: Person;
  scope: Scope;
  /** The path asked, under the prefix, as it was escaped. */
  path: string;
  params: Record<string, string>;
}

type Handler = (call: Call) => Promise<Response>;
type Owned = (call: Call, session: { id: string; raw: string }) => Promise<Response>;

// ---------------------------------------------------------------- the body

/** What a field of the browser's body may be. */
type Shape = 'string' | 'boolean' | 'number' | readonly [Shape] | { [field: string]: Shape };

/**
 * What the browser may attach to a turn, of what it may say of each: a file
 * on the session's own disk, a file it uploaded, a context — text it could
 * have written in the turn itself — and another session, or a quote of one,
 * of the caller's scope. The key reaches every session, and the caller only
 * theirs: a session of anybody else's is not found, as it is on every route.
 * An upload is the caller's because runyard-agents keeps it for them (POST
 * /v1/uploads), and names it only in a session of theirs.
 */
const ATTACHMENT: Shape = {
  kind: 'string',
  path: 'string',
  name: 'string',
  text: 'string',
  uploadId: 'string',
  sessionId: 'string',
  seq: 'number',
};
const RELAYED: Record<string, readonly string[]> = {
  file: ['kind', 'path'],
  context: ['kind', 'name', 'text', 'path'],
  upload: ['kind', 'uploadId'],
  session: ['kind', 'sessionId'],
  quote: ['kind', 'text', 'sessionId', 'seq'],
};

const TURN: Shape = { turnId: 'string', text: 'string', mode: 'string', attachments: [ATTACHMENT] };

class Refused extends Error {}

/** v, held to shape: a field it has not, or of another kind, is refused rather than dropped, so that nobody thinks it was said. */
function shaped(v: unknown, shape: Shape, at: string): void {
  if (typeof shape === 'string') {
    if (typeof v !== shape) {
      throw new Refused(`${at || 'the body'} is not a ${shape}`);
    }
    return;
  }
  if (isList(shape)) {
    if (!Array.isArray(v)) {
      throw new Refused(`${at} is not a list`);
    }
    v.forEach((item, i) => shaped(item, shape[0], `${at}[${i}]`));
    return;
  }
  if (typeof v !== 'object' || v === null || Array.isArray(v)) {
    throw new Refused(`${at || 'the body'} is not an object`);
  }
  for (const [k, field] of Object.entries(v)) {
    const want = shape[k];
    if (want === undefined) {
      throw new Refused(`unknown field "${at ? `${at}.` : ''}${k}"`);
    }
    if (field !== null && field !== undefined) {
      shaped(field, want, at ? `${at}.${k}` : k);
    }
  }
}

function isList(shape: Shape): shape is readonly [Shape] {
  return Array.isArray(shape);
}

/** What the browser attached, held to what each kind may say; refused when it says more. */
function attachmentsOf(said: readonly Record<string, unknown>[] | undefined): Attachment[] | undefined {
  if (said === undefined || said.length === 0) {
    return undefined;
  }
  return said.map((a, i) => {
    const fields = RELAYED[String(a['kind'])];
    if (fields === undefined) {
      throw new Refused(`attachment ${i}: there is no "${String(a['kind'])}" attachment`);
    }
    const extra = Object.keys(a).find((k) => !fields.includes(k));
    if (extra !== undefined) {
      throw new Refused(`attachment ${i}: a ${String(a['kind'])} attachment says only what is its own`);
    }
    return a as unknown as Attachment;
  });
}

/** A body sent as the bytes it is, not as JSON: a file. */
class Octets {
  constructor(readonly body: ReadableStream<Uint8Array> | null) {}
}

/** The browser's body, held to shape; an empty one is {}. */
async function body<T>(req: Request, shape: Shape): Promise<T> {
  const text = await req.text();
  if (text.length > MAX_BODY) {
    throw new Refused('the body is too large');
  }
  if (text.trim() === '') {
    return {} as T;
  }
  let v: unknown;
  try {
    v = JSON.parse(text);
  } catch {
    throw new Refused('the body is not JSON');
  }
  shaped(v, shape, '');
  return v as T;
}

// ----------------------------------------------------------------- answers

function json(status: number, value: unknown): Response {
  return new Response(`${JSON.stringify(value)}\n`, { status, headers: { 'Content-Type': 'application/json' } });
}

/** An answer as runyard-agents refuses: its error, with a code the browser branches on. */
function error(status: number, code: ErrorCode, message: string): Response {
  return json(status, { error: { code, message } });
}

const notFound = (what: string) => error(404, 'not_found', `no such ${what}`);

function holds(scope: Scope, s: Held): boolean {
  if (typeof s.owner !== 'string' || s.owner.toLowerCase() !== scope.owner.toLowerCase()) {
    return false;
  }
  const labels = (typeof s.labels === 'object' && s.labels !== null ? s.labels : {}) as Record<string, unknown>;
  return Object.entries(scope.labels ?? {}).every(([k, v]) => labels[k] === v);
}

function allowed(from: URLSearchParams, ...names: string[]): URLSearchParams {
  const out = new URLSearchParams();
  for (const name of names) {
    for (const v of from.getAll(name)) {
      out.append(name, v);
    }
  }
  return out;
}

const sessionPath = (id: string) => `/v1/sessions/${encodeURIComponent(id)}`;

function randomId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Splits a stream of bytes into lines, each with its newline, the last without one if it had none. */
function lines(): TransformStream<Uint8Array, string> {
  const decoder = new TextDecoder();
  let rest = '';
  return new TransformStream({
    transform(chunk, out) {
      rest += decoder.decode(chunk, { stream: true });
      let i: number;
      while ((i = rest.indexOf('\n')) >= 0) {
        out.enqueue(rest.slice(0, i + 1));
        rest = rest.slice(i + 1);
      }
    },
    flush(out) {
      rest += decoder.decode();
      if (rest !== '') {
        out.enqueue(rest);
      }
    },
  });
}

/**
 * What of a line of changes the caller is given: the line, as a deletion, or
 * nothing. A session in the scope, as it is after the change; and one that
 * was, seen in it on this stream, once it is deleted or no longer in it — as
 * deleted. A blank line, which keeps a quiet stream open, is kept.
 */
export function keptChange(scope: Scope, seen: Set<string>, line: string): string | undefined {
  if (line.trim() === '') {
    return line;
  }
  let change: { seq?: unknown; at?: unknown; sessionId?: unknown; session?: Held | null };
  try {
    change = JSON.parse(line);
  } catch {
    return undefined;
  }
  if (typeof change !== 'object' || change === null || typeof change.sessionId !== 'string') {
    return undefined;
  }
  const id = change.sessionId;
  if (change.session && holds(scope, change.session)) {
    seen.add(id);
    return line;
  }
  if (!seen.delete(id)) {
    return undefined;
  }
  return `${JSON.stringify({ seq: change.seq, at: change.at, op: 'deleted', sessionId: id })}\n`;
}

// ----------------------------------------------------------------- the relay

/** The relay of config: a fetch handler for paths under its prefix's /v1. */
export function createRelay(config: RelayConfig): Relay {
  if (!config.url) throw new Error('relay: no url');
  if (!config.key) throw new Error('relay: no key');
  if (typeof config.person !== 'function') throw new Error('relay: no person');
  if (config.signIn && typeof config.signIn.provider !== 'function') throw new Error('relay: signIn without provider');
  let base: URL;
  try {
    base = new URL(config.url);
  } catch {
    throw new Error(`relay: "${config.url}" is not a URL`);
  }
  if (base.protocol !== 'http:' && base.protocol !== 'https:') {
    throw new Error(`relay: "${config.url}" is not an http or https URL`);
  }
  const upstreamBase = config.url.replace(/\/+$/, '');
  const prefix = (config.prefix ?? '').replace(/\/+$/, '');
  const doFetch = config.fetch ?? fetch;
  const newId = config.newId ?? randomId;
  const log = config.log;

  /** A hook's refusal, as its own words when it is a RelayError, and an internal error, told to the log, when it is not. */
  function refused(call: { path: string }, hook: string, err: unknown): Response {
    if (err instanceof RelayError) {
      return error(err.status, err.code, err.message);
    }
    if (err instanceof Refused) {
      return error(400, 'bad_request', `the body: ${err.message}`);
    }
    log?.error(`relay: ${hook} failed`, { path: call.path, err: String(err) });
    return error(500, 'internal', 'internal error');
  }

  /** The request to runyard-agents, with the key; an answer of the relay's own when it went unanswered. */
  async function send(
    call: Call,
    method: string,
    path: string,
    query?: URLSearchParams,
    value?: unknown,
  ): Promise<Response> {
    const qs = query && [...query.keys()].length > 0 ? `?${query.toString()}` : '';
    const headers: Record<string, string> = { Authorization: `Bearer ${config.key}` };
    if (value !== undefined) {
      headers['Content-Type'] = value instanceof Octets ? 'application/octet-stream' : 'application/json';
    }
    const idempotency = call.req.headers.get('Idempotency-Key');
    if (idempotency && method === 'POST') {
      headers['Idempotency-Key'] = idempotency;
    }
    try {
      const init: RequestInit & { duplex?: 'half' } = { method, headers, signal: call.req.signal };
      if (value instanceof Octets) {
        // Passed on as it comes, never read here: how big a file may be is runyard-agents' to say.
        init.body = value.body;
        init.duplex = 'half';
      } else if (value !== undefined) {
        init.body = JSON.stringify(value);
      }
      return await doFetch(upstreamBase + path + qs, init);
    } catch (err) {
      if (!call.req.signal.aborted) {
        log?.warn('relay: runyard-agents is not answering', { path, err: String(err) });
      }
      throw new Unanswered();
    }
  }

  /**
   * runyard-agents' answer, to the browser, as it was written: its body
   * streamed, so a transcript followed is read as it is written. A refusal
   * of the key is not the browser's: it is told the relay failed.
   */
  async function pass(call: Call, res: Response): Promise<Response> {
    if (res.status === 401 || res.status === 403) {
      const text = await res.text().catch(() => '');
      log?.error('relay: runyard-agents refused the key', { path: call.path, status: res.status, body: text });
      return error(502, 'upstream_error', 'runyard-agents refused the relay');
    }
    const headers = new Headers();
    for (const k of PASSED) {
      const v = res.headers.get(k);
      if (v !== null) headers.set(k, v);
    }
    if ((res.headers.get('content-type') ?? '').startsWith('application/x-ndjson')) {
      // Never kept, and never held back by a proxy waiting for more.
      headers.set('Cache-Control', 'no-store');
      headers.set('X-Accel-Buffering', 'no');
    }
    return new Response(res.status === 204 || res.status === 304 ? null : res.body, { status: res.status, headers });
  }

  function unreadable(call: Call, err: unknown): Response {
    if (!call.req.signal.aborted) {
      log?.error("relay: an answer of runyard-agents' it cannot read", { path: call.path, err: String(err) });
    }
    return error(502, 'upstream_error', 'runyard-agents answered what the relay cannot read');
  }

  /** h, for a session of the caller's scope; any other is not found, as one that does not exist is. */
  function owned(h: Owned): Handler {
    return async (call) => {
      const res = await send(call, 'GET', sessionPath(call.params['sessionId'] ?? ''));
      if (res.status !== 200) {
        return pass(call, res);
      }
      let raw: string;
      let s: Held;
      try {
        raw = await res.text();
        s = JSON.parse(raw);
      } catch (err) {
        return unreadable(call, err);
      }
      if (typeof s !== 'object' || s === null || !holds(call.scope, s) || typeof s.id !== 'string') {
        return notFound('session');
      }
      return h(call, { id: s.id, raw });
    };
  }

  /** The call as the browser made it, to the session it is about, with only the query parameters named, and no body. */
  function forward(...query: string[]): Owned {
    return async (call) => {
      const url = new URL(call.req.url);
      return pass(call, await send(call, call.req.method, call.path, allowed(url.searchParams, ...query)));
    };
  }

  /** runyard-agents' page of path, with only the items keep keeps, and the rest of it — its cursor — as it was. */
  async function page(call: Call, path: string, query: URLSearchParams | undefined, keep: (item: unknown) => boolean) {
    const res = await send(call, 'GET', path, query);
    if (res.status !== 200) {
      return pass(call, res);
    }
    let got: Record<string, unknown>;
    try {
      got = await res.json();
      if (typeof got !== 'object' || got === null || Array.isArray(got) || !Array.isArray(got['items'])) {
        throw new Error('a page without items');
      }
    } catch (err) {
      return unreadable(call, err);
    }
    return json(200, { ...got, items: (got['items'] as unknown[]).filter(keep) });
  }

  /** Whether session id is one of the caller's scope: false when it is not, or is not there. */
  async function reaches(call: Call, id: string): Promise<boolean> {
    const res = await send(call, 'GET', sessionPath(id));
    if (res.status === 404) {
      await res.body?.cancel();
      return false;
    }
    let s: unknown;
    try {
      if (res.status !== 200) {
        throw new Error(`reading session ${id}: ${res.status}`);
      }
      s = await res.json();
    } catch (err) {
      if (!call.req.signal.aborted) {
        log?.error('relay: a session a turn names could not be read', { path: call.path, err: String(err) });
      }
      throw new Unreadable();
    }
    return typeof s === 'object' && s !== null && holds(call.scope, s as Held);
  }

  /** The turn the browser said, as config.turn makes it. */
  async function turnOf(call: Call, said: Partial<Turn>): Promise<Turn> {
    const turn: Turn = { turnId: said.turnId || newId(), text: said.text ?? '' };
    if (said.mode !== undefined) {
      turn.mode = said.mode;
    }
    const attachments = attachmentsOf(said.attachments as Record<string, unknown>[] | undefined);
    if (attachments !== undefined) {
      for (const [i, a] of attachments.entries()) {
        if (a.sessionId !== undefined && !(await reaches(call, a.sessionId))) {
          throw new Refused(`attachment ${i}: no such session`);
        }
      }
      turn.attachments = attachments;
    }
    await config.turn?.(call.req, call.person, turn);
    return turn;
  }

  async function start(call: Call): Promise<Response> {
    if (call.scope.noStart) {
      return error(403, 'forbidden', 'sessions are not started here');
    }
    const said = await body<{ title?: string; autoTitle?: boolean; firstTurn?: Partial<Turn> }>(call.req, {
      title: 'string',
      autoTitle: 'boolean',
      firstTurn: TURN,
    });
    const spec: SessionSpec = { labels: { ...call.scope.labels } };
    if (said.title !== undefined && said.title !== null) spec.title = said.title;
    if (said.autoTitle !== undefined && said.autoTitle !== null) spec.autoTitle = said.autoTitle;
    if (said.firstTurn) {
      spec.firstTurn = await turnOf(call, said.firstTurn);
    }
    await config.start?.(call.req, call.person, spec);
    // The scope's, whatever start did: whose it is, and what tells it so.
    spec.owner = call.scope.owner;
    delete spec.parentId;
    spec.labels = { ...spec.labels, ...call.scope.labels };

    const res = await send(call, 'POST', '/v1/sessions', undefined, spec);
    if (res.status < 200 || res.status >= 300) {
      return pass(call, res);
    }
    let raw: string;
    let session: Session;
    try {
      raw = await res.text();
      session = SessionFromJSON(JSON.parse(raw));
    } catch (err) {
      return unreadable(call, err);
    }
    try {
      await config.started?.(call.req, call.person, session);
    } catch (err) {
      // The session is made whatever the program does with it.
      log?.error('relay: started failed', { path: call.path, err: String(err) });
    }
    return new Response(raw, { status: res.status, headers: { 'Content-Type': 'application/json' } });
  }

  /** The ids of the sessions of the caller's scope, archived and not; an answer of the relay's when they could not be listed. */
  async function known(call: Call): Promise<Set<string> | Response> {
    const ids = new Set<string>();
    for (const archived of ['false', 'true']) {
      const q = new URLSearchParams({ owner: call.scope.owner, archived });
      for (const k of Object.keys(call.scope.labels ?? {}).sort()) {
        q.append('label', `${k}=${call.scope.labels![k]}`);
      }
      for (let i = 0; i < PAGES; i++) {
        const res = await send(call, 'GET', '/v1/sessions', q);
        if (res.status !== 200) {
          return pass(call, res);
        }
        let page: { items?: unknown; nextCursor?: unknown };
        try {
          page = await res.json();
          if (typeof page !== 'object' || page === null || (page.items !== undefined && !Array.isArray(page.items))) {
            throw new Error('a page whose items are not a list');
          }
        } catch (err) {
          return unreadable(call, err);
        }
        for (const s of (page.items ?? []) as Held[]) {
          if (typeof s === 'object' && s !== null && typeof s.id === 'string' && holds(call.scope, s)) {
            ids.add(s.id);
          }
        }
        if (typeof page.nextCursor !== 'string' || page.nextCursor === '') {
          break;
        }
        q.set('cursor', page.nextCursor);
      }
    }
    return ids;
  }

  /**
   * runyard-agents' changes to the account's sessions, with only those of the
   * caller's scope: a session in it, as it is after the change; and one that
   * was — listed in it as the stream opens, or seen in it since — once it is
   * deleted or no longer in it, as deleted. A deletion says no more than that,
   * so whose it was is what the relay knew of it: a reader holds what it
   * listed, and is told when that goes.
   */
  async function changes(call: Call): Promise<Response> {
    const seen = await known(call);
    if (seen instanceof Response) {
      return seen;
    }
    const url = new URL(call.req.url);
    const res = await send(call, 'GET', '/v1/changes', allowed(url.searchParams, 'from', 'follow'));
    if (res.status !== 200 || res.body === null) {
      return pass(call, res);
    }
    const encoder = new TextEncoder();
    const filtered = res.body.pipeThrough(lines()).pipeThrough(
      new TransformStream<string, Uint8Array>({
        transform(line, out) {
          const kept = keptChange(call.scope, seen, line);
          if (kept !== undefined) {
            out.enqueue(encoder.encode(kept));
          }
        },
      }),
    );
    return new Response(filtered, {
      status: 200,
      headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' },
    });
  }

  /** The caller's provider's name; not found when the path names another. */
  async function provider(call: Call): Promise<string | Response> {
    const name = await config.signIn!.provider(call.req, call.person);
    const asked = call.params['provider'];
    if (asked !== undefined && asked !== name) {
      return notFound('provider');
    }
    return name;
  }

  const routes: [string, string, Handler][] = [
    ['GET', '/v1/sessions', async (call) => {
      const url = new URL(call.req.url);
      const q = allowed(url.searchParams, 'limit', 'cursor', 'archived', 'state', 'label');
      q.set('owner', call.scope.owner);
      for (const k of Object.keys(call.scope.labels ?? {}).sort()) {
        q.append('label', `${k}=${call.scope.labels![k]}`);
      }
      return page(call, '/v1/sessions', q, (item) => typeof item === 'object' && item !== null && holds(call.scope, item as Held));
    }],
    ['POST', '/v1/sessions', start],
    ['GET', '/v1/changes', changes],
    ['GET', '/v1/sessions/:sessionId', owned(async (_call, s) => new Response(s.raw, { headers: { 'Content-Type': 'application/json' } }))],
    ['PATCH', '/v1/sessions/:sessionId', owned(async (call, s) => {
      const said = await body<Record<string, unknown>>(call.req, { title: 'string', pinned: 'boolean', autoTitle: 'boolean' });
      return pass(call, await send(call, 'PATCH', sessionPath(s.id), undefined, said));
    })],
    ['DELETE', '/v1/sessions/:sessionId', owned(forward())],
    ['POST', '/v1/sessions/:sessionId/archive', owned(forward())],
    ['POST', '/v1/sessions/:sessionId/restore', owned(forward())],
    ['GET', '/v1/sessions/:sessionId/events', owned(forward('from', 'follow', 'subagent'))],
    ['POST', '/v1/sessions/:sessionId/turns', owned(async (call, s) => {
      const turn = await turnOf(call, await body<Partial<Turn>>(call.req, TURN));
      return pass(call, await send(call, 'POST', `${sessionPath(s.id)}/turns`, undefined, turn));
    })],
    ['POST', '/v1/sessions/:sessionId/interrupt', owned(async (call, s) => {
      const said = await body<Record<string, unknown>>(call.req, { dropQueued: 'boolean' });
      return pass(call, await send(call, 'POST', `${sessionPath(s.id)}/interrupt`, undefined, said));
    })],
    ['POST', '/v1/sessions/:sessionId/rewind', owned(async (call, s) => {
      const said = await body<Record<string, unknown>>(call.req, { toSeq: 'number' });
      return pass(call, await send(call, 'POST', `${sessionPath(s.id)}/rewind`, undefined, said));
    })],
    ['DELETE', '/v1/sessions/:sessionId/queue/:turnId', owned(forward())],
    ['PATCH', '/v1/sessions/:sessionId/queue/:turnId', owned(async (call, s) => {
      const said = await body<{ text?: string }>(call.req, { text: 'string' });
      const path = `${sessionPath(s.id)}/queue/${encodeURIComponent(call.params['turnId'] ?? '')}`;
      return pass(call, await send(call, 'PATCH', path, undefined, { text: said.text ?? '' }));
    })],
    ['PUT', '/v1/sessions/:sessionId/queue/:turnId/hold', owned(forward())],
    ['DELETE', '/v1/sessions/:sessionId/queue/:turnId/hold', owned(forward())],
    ['POST', '/v1/sessions/:sessionId/queue/:turnId/interrupt', owned(forward())],
    ['GET', '/v1/sessions/:sessionId/attachments/:uploadId', owned(forward())],
    // Kept for the caller's scope's owner, so a turn names it only in a session of theirs.
    ['POST', '/v1/uploads', async (call) => {
      const q = allowed(new URL(call.req.url).searchParams, 'name');
      q.set('owner', call.scope.owner);
      return pass(call, await send(call, 'POST', '/v1/uploads', q, new Octets(call.req.body)));
    }],
    ['DELETE', '/v1/uploads/:uploadId', async (call) => {
      const q = new URLSearchParams({ owner: call.scope.owner });
      return pass(call, await send(call, 'DELETE', `/v1/uploads/${encodeURIComponent(call.params['uploadId'] ?? '')}`, q));
    }],
    ['GET', '/v1/sessions/:sessionId/files', owned(forward('path'))],
    ['GET', '/v1/sessions/:sessionId/files/content', owned(forward('path'))],
    ['GET', '/v1/sessions/:sessionId/subagents', owned(forward())],
    ['GET', '/v1/sessions/:sessionId/subagents/:subagentId', owned(forward())],
  ];
  if (config.signIn) {
    const signIn = config.signIn;
    routes.push(
      ['GET', '/v1/providers', async (call) => {
        const name = await provider(call);
        if (name instanceof Response) return name;
        return page(call, '/v1/providers', undefined, (item) => typeof item === 'object' && item !== null && (item as { name?: unknown }).name === name);
      }],
      ['POST', '/v1/providers/:provider/signin', async (call) => {
        const name = await provider(call);
        if (name instanceof Response) return name;
        const said = await body<Partial<ProviderSignIn>>(call.req, { type: 'string', method: 'string', title: 'string' });
        const signing: ProviderSignIn = { ...said } as ProviderSignIn;
        await signIn.start?.(call.req, call.person, signing);
        signing.owner = call.person.email;
        return pass(call, await send(call, 'POST', `/v1/providers/${encodeURIComponent(name)}/signin`, undefined, signing));
      }],
      ['POST', '/v1/providers/:provider/signin/:flowId', async (call) => {
        const name = await provider(call);
        if (name instanceof Response) return name;
        const said = await body<Record<string, unknown>>(call.req, { code: 'string', redirectUrl: 'string' });
        const path = `/v1/providers/${encodeURIComponent(name)}/signin/${encodeURIComponent(call.params['flowId'] ?? '')}`;
        const res = await send(call, 'POST', path, undefined, said);
        if (res.status < 200 || res.status >= 300 || !signIn.finished) {
          return pass(call, res);
        }
        const raw = await res.text();
        await signIn.finished(call.req, call.person, name);
        return new Response(raw, { status: res.status, headers: { 'Content-Type': 'application/json' } });
      }],
    );
  }
  const compiled = routes.map(([method, pattern, h]) => {
    const names: string[] = [];
    const source = pattern.replace(/:(\w+)/g, (_m, name: string) => {
      names.push(name);
      return '([^/]+)';
    });
    return { method, re: new RegExp(`^${source}$`), names, h };
  });

  /** The route of method and path, and its parameters; undefined for any other. */
  function route(method: string, path: string): { h: Handler; params: Record<string, string> } | undefined {
    for (const r of compiled) {
      const m = r.method === method ? r.re.exec(path) : null;
      if (m) {
        const params: Record<string, string> = {};
        try {
          r.names.forEach((name, i) => {
            params[name] = decodeURIComponent(m[i + 1] ?? '');
          });
        } catch {
          return undefined;
        }
        return { h: r.h, params };
      }
    }
    return undefined;
  }

  return async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    let path = url.pathname;
    if (prefix !== '') {
      if (path !== prefix && !path.startsWith(`${prefix}/`)) {
        return notFound('route');
      }
      path = path.slice(prefix.length);
    }
    const found = route(req.method, path);
    if (!found) {
      return notFound('route');
    }
    let person: Person;
    try {
      person = await config.person(req);
      if (!person || typeof person.email !== 'string' || person.email === '') {
        throw new Error('a person with no email');
      }
    } catch (err) {
      return err instanceof RelayError ? error(err.status, err.code, err.message) : error(401, 'unauthorized', 'unauthorized');
    }
    const at = { path };
    let scope: Scope = { owner: person.email };
    if (config.scope) {
      try {
        scope = await config.scope(req, person);
        if (!scope || !scope.owner) {
          throw new Error('a scope with no owner');
        }
      } catch (err) {
        return refused(at, 'scope', err);
      }
    }
    try {
      return await found.h({ req, person, scope, path, params: found.params });
    } catch (err) {
      if (err instanceof Unanswered) {
        return error(502, 'upstream_error', 'runyard-agents is not answering');
      }
      if (err instanceof Unreadable) {
        return error(502, 'upstream_error', 'runyard-agents could not say whose a session the turn names is');
      }
      return refused(at, 'a hook', err);
    }
  };
}

/** runyard-agents unanswering: said by send, answered by the relay. */
class Unanswered extends Error {}

/** A session a turn names that runyard-agents could not say whose it is. */
class Unreadable extends Error {}

// ---------------------------------------------------------------- node:http

/** What toNodeHandler reads of a request: node:http's IncomingMessage, or Express's. */
export interface NodeRequest extends AsyncIterable<Uint8Array | string> {
  method?: string | undefined;
  url?: string | undefined;
  /** Express's: the URL before a router took its mount path off, which the relay's prefix is matched against. */
  originalUrl?: string | undefined;
  headers: Record<string, string | string[] | undefined>;
}

/** What toNodeHandler writes an answer to: node:http's ServerResponse, or Express's. */
export interface NodeResponse {
  statusCode: number;
  setHeader(name: string, value: string): unknown;
  flushHeaders(): void;
  write(chunk: Uint8Array): boolean;
  end(): unknown;
  once(event: 'close' | 'drain', listener: () => void): unknown;
  readonly writableFinished: boolean;
}

/**
 * The relay as a node:http handler: http.createServer(toNodeHandler(relay)),
 * or app.use('/agents', toNodeHandler(relay)) with prefix '/agents'. A
 * request the browser leaves is left upstream too.
 */
export function toNodeHandler(relay: Relay): (req: NodeRequest, res: NodeResponse) => Promise<void> {
  return async (req, res) => {
    const aborted = new AbortController();
    res.once('close', () => {
      if (!res.writableFinished) aborted.abort();
    });
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (typeof v === 'string') headers.set(k, v);
      else if (Array.isArray(v)) for (const each of v) headers.append(k, each);
    }
    const method = req.method ?? 'GET';
    let body: Uint8Array<ArrayBuffer> | undefined;
    if (method !== 'GET' && method !== 'HEAD') {
      const chunks: Uint8Array[] = [];
      let size = 0;
      for await (const chunk of req) {
        const bytes = typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk;
        size += bytes.length;
        if (size > MAX_BODY) {
          break;
        }
        chunks.push(bytes);
      }
      body = new Uint8Array(size > MAX_BODY ? MAX_BODY + 1 : size);
      let at = 0;
      for (const c of chunks) {
        body.set(c.subarray(0, body.length - at), at);
        at += c.length;
      }
    }
    const url = new URL(req.originalUrl ?? req.url ?? '/', `http://${headers.get('host') ?? 'localhost'}`);
    const answer = await relay(new Request(url, { method, headers, body, signal: aborted.signal }));
    res.statusCode = answer.status;
    answer.headers.forEach((v, k) => {
      res.setHeader(k, v);
    });
    res.flushHeaders();
    if (answer.body !== null) {
      const reader = answer.body.getReader();
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done || aborted.signal.aborted) break;
          if (!res.write(value)) {
            await new Promise<void>((resolve) => {
              res.once('drain', resolve);
              res.once('close', resolve);
            });
          }
        }
      } catch {
        // The browser gone, or runyard-agents: either way a reader of a
        // stream reconnects from the last seq it read.
      } finally {
        await reader.cancel().catch(() => undefined);
      }
    }
    res.end();
  };
}
