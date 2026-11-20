import assert from 'node:assert/strict';
import type { ServerResponse } from 'node:http';
import { test } from 'node:test';
import type { TestContext } from 'node:test';

import { APIError, ErrorCode } from '../src/index.js';
import {
  NoReplyError,
  Runyard,
  RunyardSession,
  SessionFailedError,
  StreamEndedError,
  TurnError,
  TurnGoneError,
  takenOut,
  turnId,
} from '../src/ry.js';
import type { RyEvent } from '../src/ry.js';
import { answer, serve, startStream } from './stub.js';

/** A request the stub was sent: its method, path and query, bearer and body. */
interface Ask {
  method: string;
  url: string;
  auth: string | undefined;
  body: Record<string, unknown> | undefined;
}

type Route = (res: ServerResponse, ask: Ask, closed: Promise<void>) => void;

/**
 * A server answering each request by the first route whose `METHOD path`
 * prefix it matches, as a test says; and what it was asked.
 */
async function stub(t: TestContext, routes: Record<string, Route>): Promise<{ ry: Runyard; asks: Ask[]; url: string }> {
  const asks: Ask[] = [];
  const { url } = await serve(t, ({ req, res, closed }) => {
    let raw = '';
    req.on('data', (chunk: Buffer) => (raw += chunk.toString()));
    req.on('end', () => {
      const ask: Ask = {
        method: req.method ?? '',
        url: req.url ?? '',
        auth: req.headers.authorization,
        body: raw === '' ? undefined : (JSON.parse(raw) as Record<string, unknown>),
      };
      asks.push(ask);
      const key = `${ask.method} ${ask.url.split('?')[0] ?? ''}`;
      const route = Object.entries(routes).find(([pattern]) => key === pattern || key.startsWith(`${pattern}?`));
      if (route === undefined) {
        answer(res, 404, '{"error":{"code":"not_found","message":"no route"}}');
        return;
      }
      route[1](res, ask, closed);
    });
  });
  return { ry: new Runyard({ url: `${url}/`, key: 'ryak_k' }), asks, url };
}

function session(id: string, lastSeq: number, extra: Record<string, unknown> = {}): string {
  return JSON.stringify({
    id,
    title: 'T',
    owner: 'app:acme-app',
    state: 'idle',
    config: {},
    sandbox: { state: 'ready' },
    lineage: { rootId: id, depth: 0 },
    labels: { team: 'a' },
    work: {},
    usage: {},
    firstSeq: 1,
    lastSeq,
    createdAt: '2026-11-19T10:00:00Z',
    lastActivityAt: '2026-11-19T11:00:00Z',
    ...extra,
  });
}

function json(status: number, body: string): Route {
  return (res) => answer(res, status, body);
}

function ev(seq: number, event: Record<string, unknown>): string {
  return JSON.stringify({ line: 'event', seq, at: `2026-11-19T10:00:${String(seq % 60).padStart(2, '0')}Z`, event });
}
const started = (seq: number, turnId: string): string => ev(seq, { type: 'turn_started', turnId });
const said = (seq: number, text: string): string => ev(seq, { type: 'text', text });
const ended = (seq: number, turnId: string, stopReason = 'end_turn'): string =>
  ev(seq, { type: 'turn_ended', turnId, stopReason, usage: {} });

/** A stream of lines and then, held, open until the client hangs up. */
function stream(held: boolean, ...lines: string[]): Route {
  return (res) => {
    startStream(res);
    res.write(lines.map((l) => `${l}\n`).join(''));
    if (!held) res.end();
  };
}

const caughtUp = '{"line":"caughtUp","caughtUp":{"seq":0}}';

/** A line of the changes to the sessions: the session of id updated, with the turns queued waiting. */
function change(seq: number, id: string, queued: string[], extra: Record<string, unknown> = {}): string {
  const queue = queued.length === 0 ? {} : { queue: queued.map((turnId) => ({ turnId, text: 't', source: 'api' })) };
  return JSON.stringify({
    seq,
    at: '2026-11-19T10:00:00Z',
    op: 'updated',
    sessionId: id,
    session: JSON.parse(session(id, 0, { ...queue, ...extra })) as unknown,
  });
}

/** The sessions listed as of change 10, and the changes from 11 as lines says, held open. */
function queueing(lines: () => string[]): Record<string, Route> {
  return {
    'GET /v1/sessions': json(200, '{"items":[],"changeSeq":10}'),
    'GET /v1/changes': (res, ask, closed) => stream(true, ...lines())(res, ask, closed),
  };
}

/** A session at lastSeq 4 that takes a turn, whose queue and transcript say what the test says of it. */
async function sending(
  t: TestContext,
  changes: (turn: string) => string[],
  events: (turn: string) => string[],
  extra: Record<string, Route> = {},
): Promise<{ ry: Runyard; asks: Ask[]; sent: () => string }> {
  let turn = '';
  const { ry, asks } = await stub(t, {
    'GET /v1/sessions/s1': json(200, session('s1', 4)),
    'POST /v1/sessions/s1/turns': (res, ask) => {
      turn = String(ask.body?.['turnId']);
      answer(res, 202, `{"turnId":"${turn}","position":1}`);
    },
    ...queueing(() => changes(turn)),
    'GET /v1/sessions/s1/events': (res, ask, closed) => stream(true, ...events(turn))(res, ask, closed),
    ...extra,
  });
  return { ry, asks, sent: () => turn };
}

const forbidden = '{"error":{"code":"forbidden","message":"no"}}';
const notFound = '{"error":{"code":"not_found","message":"no"}}';

async function rejected(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (err) {
    return err;
  }
  return assert.fail('it succeeded');
}

function eventsAsked(asks: Ask[]): string[] {
  return asks.filter((a) => a.url.includes('/events')).map((a) => a.url.split('?')[1] ?? '');
}

test('every request carries the key, through the fetch it was given', async (t) => {
  const { url, asks } = await stub(t, { 'GET /v1/sessions/s1': json(200, session('s1', 0)) });
  let fetched = 0;
  const ry = new Runyard({
    url,
    key: 'ryst_t',
    fetch: (input, init) => {
      fetched++;
      return fetch(input, init);
    },
  });
  assert.equal((await ry.session('s1').info()).id, 's1');
  assert.equal(fetched, 1);
  assert.equal(asks[0]?.auth, 'Bearer ryst_t');
  assert.equal(ry.configuration.basePath, url);
});

test('a start says only what it was given', async (t) => {
  const { ry, asks } = await stub(t, { 'POST /v1/sessions': json(201, session('s1', 0)) });
  const s = await ry.start();
  assert.equal(s.id, 's1');
  assert.deepEqual(asks[0]?.body, {});
});

test('a start sends every field, over its spec', async (t) => {
  const { ry, asks } = await stub(t, { 'POST /v1/sessions': json(201, session('s1', 0)) });
  await ry.start({
    profile: 'support',
    title: 'Ticket 42',
    text: 'Summarize ticket #42',
    endUser: { id: 'u123', email: 'alice@acme.example' },
    labels: { ticket: '42' },
    spec: { harness: 'codex', title: 'overwritten' },
  });
  const body = asks[0]?.body ?? {};
  assert.equal(body['profileId'], 'support');
  assert.equal(body['title'], 'Ticket 42');
  assert.equal(body['harness'], 'codex');
  assert.deepEqual(body['endUser'], { id: 'u123', email: 'alice@acme.example' });
  assert.deepEqual(body['labels'], { ticket: '42' });
  const first = body['firstTurn'] as Record<string, unknown>;
  assert.equal(first['text'], 'Summarize ticket #42');
  assert.match(String(first['turnId']), /^ry-[0-9a-f]{16}$/);
});

test('a start with empty text sends no first turn', async (t) => {
  const { ry, asks } = await stub(t, { 'POST /v1/sessions': json(201, session('s1', 0)) });
  await ry.start({ text: '' });
  assert.deepEqual(asks[0]?.body, {});
});

test('a start found again under its key is the session it made, a handle like any other', async (t) => {
  const { ry, asks } = await stub(t, {
    'POST /v1/sessions': json(200, session('s1', 7)),
    'GET /v1/sessions/s1': json(200, session('s1', 7)),
    'GET /v1/sessions/s1/events': stream(
      true,
      started(1, 't1'),
      said(2, 'old'),
      ended(3, 't1'),
      started(8, 't2'),
      said(9, 'new'),
      ended(10, 't2'),
    ),
  });
  const s = await ry.start();
  assert.equal(s.id, 's1');
  // Made by an earlier call, its turns may have ended since: reply asks where
  // its transcript is, rather than read a turn that ended before as the one
  // under way.
  assert.equal(await s.reply(), 'new');
  assert.equal(asks[1]?.url, '/v1/sessions/s1');
});

test('a start refused is the server’s error', async (t) => {
  const { ry } = await stub(t, { 'POST /v1/sessions': json(403, forbidden) });
  const err = await rejected(ry.start({ endUser: { id: 'u1' } }));
  assert.ok(err instanceof APIError);
  assert.equal(err.code, ErrorCode.Forbidden);
});

test('a start on no server is the failure', async () => {
  const ry = new Runyard({ url: 'http://127.0.0.1:1', key: 'k' });
  const err = await rejected(ry.start());
  assert.ok(!(err instanceof APIError));
});

test('info is the session as it is', async (t) => {
  const { ry } = await stub(t, {
    'GET /v1/sessions/s1': json(200, session('s1', 3, { endUser: { id: 'u1', email: 'a@acme.example' } })),
  });
  const got = await ry.session('s1').info();
  assert.equal(got.lastSeq, 3);
  assert.deepEqual(got.endUser, { id: 'u1', email: 'a@acme.example' });
});

test('info of no session is not_found', async (t) => {
  const { ry } = await stub(t, {});
  const err = await rejected(ry.session('gone').info());
  assert.ok(err instanceof APIError && err.code === ErrorCode.NotFound);
});

test('delete', async (t) => {
  const { ry } = await stub(t, {
    'DELETE /v1/sessions/s1': (res) => {
      res.writeHead(204);
      res.end();
    },
    'DELETE /v1/sessions/s2': json(403, forbidden),
  });
  await ry.session('s1').delete();
  const err = await rejected(ry.session('s2').delete());
  assert.ok(err instanceof APIError && err.code === ErrorCode.Forbidden);
});

test('sessions reads every page', async (t) => {
  const { ry, asks } = await stub(t, {
    'GET /v1/sessions': (res, ask) => {
      if (!ask.url.includes('cursor=')) {
        answer(res, 200, `{"items":[${session('s1', 0)},${session('s2', 0)}],"changeSeq":1,"nextCursor":"c2"}`);
      } else {
        answer(res, 200, `{"items":[${session('s3', 0)}],"changeSeq":1}`);
      }
    },
  });
  const got = await ry.sessions({ endUser: 'u1', labels: { z: '1', a: '2' }, archived: true });
  assert.deepEqual(
    got.map((s) => s.id),
    ['s1', 's2', 's3'],
  );
  assert.equal(asks.length, 2);
  assert.equal(asks[0]?.url, '/v1/sessions?endUser=u1&archived=true&label=a%3D2&label=z%3D1');
  assert.match(asks[1]?.url ?? '', /cursor=c2/);
});

test('sessions of nothing asks for every session', async (t) => {
  const { ry, asks } = await stub(t, { 'GET /v1/sessions': json(200, '{"items":[],"changeSeq":0}') });
  assert.deepEqual(await ry.sessions({ endUser: '', labels: {}, archived: false }), []);
  assert.equal(asks[0]?.url, '/v1/sessions');
});

test('sessions stops at a cursor answered again, or an empty one', async (t) => {
  const { ry, asks } = await stub(t, {
    'GET /v1/sessions': (res, ask) =>
      answer(
        res,
        200,
        `{"items":[${session('s1', 0)}],"changeSeq":1,"nextCursor":"c"}`,
      ),
  });
  assert.equal((await ry.sessions()).length, 2);
  assert.equal(asks.length, 2);
  const empty = await stub(t, { 'GET /v1/sessions': json(200, '{"items":[],"changeSeq":1,"nextCursor":""}') });
  assert.deepEqual(await empty.ry.sessions(), []);
  assert.equal(empty.asks.length, 1);
});

test('sessions failing halfway is the error', async (t) => {
  const { ry } = await stub(t, {
    'GET /v1/sessions': (res, ask) => {
      if (!ask.url.includes('cursor=')) {
        answer(res, 200, `{"items":[${session('s1', 0)}],"changeSeq":1,"nextCursor":"c2"}`);
      } else {
        answer(res, 400, '{"error":{"code":"bad_request","message":"cursor"}}');
      }
    },
  });
  const err = await rejected(ry.sessions());
  assert.ok(err instanceof APIError && err.code === ErrorCode.BadRequest);
});

test('a token is minted for its end user', async (t) => {
  const { ry, asks } = await stub(t, {
    'POST /v1/sessions/s1/tokens': json(
      201,
      '{"token":"ryst_x","sessionId":"s1","endUser":{"id":"u1","email":"a@acme.example"},"expiresAt":"2026-11-19T12:00:00Z"}',
    ),
  });
  const got = await ry.session('s1').token({ endUser: { id: 'u1', email: 'a@acme.example' }, ttlSeconds: 5400 });
  assert.deepEqual(got, {
    token: 'ryst_x',
    sessionId: 's1',
    endUser: { id: 'u1', email: 'a@acme.example' },
    expiresAt: new Date('2026-11-19T12:00:00Z'),
  });
  assert.deepEqual(asks[0]?.body, { endUser: { id: 'u1', email: 'a@acme.example' }, ttlSeconds: 5400 });
});

test('a token of nothing leaves the server its defaults', async (t) => {
  const { ry, asks } = await stub(t, {
    'POST /v1/sessions/s1/tokens': json(201, '{"token":"ryst_x","sessionId":"s1","expiresAt":"2026-11-19T12:00:00Z"}'),
  });
  const got = await ry.session('s1').token();
  assert.equal(got.endUser, undefined);
  assert.ok(!('endUser' in got));
  assert.deepEqual(asks[0]?.body, {});
});

test('a token refused is the server’s error', async (t) => {
  const { ry } = await stub(t, {
    'POST /v1/sessions/s1/tokens': json(501, '{"error":{"code":"not_implemented","message":"later"}}'),
  });
  const err = await rejected(ry.session('s1').token());
  assert.ok(err instanceof APIError && err.code === ErrorCode.NotImplemented);
});

test('events are each event, by its type, past partials and catching up', async (t) => {
  const { ry, asks } = await stub(t, {
    'GET /v1/sessions/s1/events': stream(
      true,
      '{"line":"caughtUp","caughtUp":{"seq":0}}',
      ev(1, { type: 'user', turnId: 't1', text: 'hi', source: 'user', endUser: { id: 'u1' } }),
      '{"line":"partial","partial":{"seq":2,"kind":"text","offset":0,"text":"He"}}',
      said(2, 'Hello'),
      ev(3, { type: 'tool_call', toolId: 'x1', name: 'Bash', input: { command: 'ls' } }),
      ended(4, 't1'),
    ),
  });
  const got: RyEvent[] = [];
  for await (const e of ry.session('s1').events()) {
    got.push(e);
    if (got.length === 4) break;
  }
  assert.deepEqual(
    got.map((e) => [e.seq, e.type]),
    [
      [1, 'user'],
      [2, 'text'],
      [3, 'tool_call'],
      [4, 'turn_ended'],
    ],
  );
  const user = got[0];
  assert.ok(user?.type === 'user');
  assert.equal(user.endUser?.id, 'u1');
  assert.deepEqual(user.at, new Date('2026-11-19T10:00:01Z'));
  const text = got[1];
  assert.ok(text?.type === 'text' && text.text === 'Hello');
  assert.deepEqual(eventsAsked(asks), ['follow=true']);
});

test('events ending say so', async (t) => {
  const { ry } = await stub(t, { 'GET /v1/sessions/s1/events': stream(false, said(1, 'a')) });
  const got: RyEvent[] = [];
  const err = await rejected(
    (async () => {
      for await (const e of ry.session('s1').events()) got.push(e);
    })(),
  );
  assert.equal(got.length, 1);
  assert.ok(err instanceof StreamEndedError);
});

test('events of no session are its error', async (t) => {
  const { ry } = await stub(t, { 'GET /v1/sessions/gone/events': json(404, notFound) });
  const err = await rejected(
    (async () => {
      for await (const e of ry.session('gone').events()) assert.fail(`${e.type}`);
    })(),
  );
  assert.ok(err instanceof APIError && err.code === ErrorCode.NotFound);
});

test('events end with their signal', async (t) => {
  const { ry } = await stub(t, { 'GET /v1/sessions/s1/events': stream(true, said(1, 'a')) });
  const abort = new AbortController();
  const err = await rejected(
    (async () => {
      for await (const e of ry.session('s1').events({ signal: abort.signal })) {
        assert.equal(e.seq, 1);
        abort.abort();
      }
    })(),
  );
  assert.ok(err instanceof Error);
});

test('send is its turn’s answer, and none of another’s', async (t) => {
  let sent = '';
  const { ry, asks } = await stub(t, {
    'GET /v1/sessions/s1': json(200, session('s1', 4)),
    'POST /v1/sessions/s1/turns': (res, ask) => {
      sent = String(ask.body?.['turnId']);
      answer(res, 202, `{"turnId":"${sent}","position":1}`);
    },
    ...queueing(() => [
      // Before it was queued, and another session's: nothing of it.
      change(11, 's1', []),
      change(12, 's2', ['other']),
      change(13, 's1', ['ahead', sent], { state: 'generating' }),
      change(14, 's1', [sent]),
      change(15, 's1', []),
    ]),
    'GET /v1/sessions/s1/events': (res) =>
      stream(
        true,
        started(5, 'ahead'),
        said(6, 'not mine'),
        ended(7, 'ahead'),
        ev(8, { type: 'user', turnId: sent, text: 'Now draft a reply', source: 'user' }),
        caughtUp,
        started(9, sent),
        said(10, 'Dear Acme,'),
        ev(11, { type: 'text', text: "a sub-agent's", parentToolId: 'a1' }),
        ev(12, { type: 'tool_call', toolId: 'x', name: 'Read', input: {} }),
        said(13, 'Regards.'),
        ended(14, sent),
      )(res, {} as Ask, Promise.resolve()),
  });
  const s = ry.session('s1');
  assert.equal(await s.send('Now draft a reply'), 'Dear Acme,\n\nRegards.');
  assert.deepEqual(
    asks.map((a) => `${a.method} ${a.url}`),
    [
      'GET /v1/sessions/s1',
      'GET /v1/sessions?limit=1',
      'POST /v1/sessions/s1/turns',
      'GET /v1/changes?from=11&follow=true',
      'GET /v1/sessions/s1/events?from=5&follow=true',
    ],
  );
  assert.deepEqual(asks[2]?.body, { turnId: sent, text: 'Now draft a reply' });
});

test('send refused is the server’s error', async (t) => {
  const { ry } = await stub(t, {
    'GET /v1/sessions/s1': json(200, session('s1', 0)),
    'GET /v1/sessions': json(200, '{"items":[],"changeSeq":10}'),
    'POST /v1/sessions/s1/turns': json(409, '{"error":{"code":"conflict","message":"terminal"}}'),
  });
  const err = await rejected(ry.session('s1').send('hi'));
  assert.ok(err instanceof APIError && err.code === ErrorCode.Conflict);
});

test('send to no session is not_found, and sends nothing', async (t) => {
  const { ry, asks } = await stub(t, {});
  const err = await rejected(ry.session('gone').send('hi'));
  assert.ok(err instanceof APIError && err.code === ErrorCode.NotFound);
  assert.equal(asks.length, 1);
});

test('reply of a handle only made is the turn under way', async (t) => {
  const { ry, asks } = await stub(t, {
    'GET /v1/sessions/s1': json(200, session('s1', 6)),
    'GET /v1/sessions/s1/events': (res, ask) =>
      ask.url.includes('from=8')
        ? stream(true, started(8, 't3'), said(9, 'three'), ended(10, 't3'))(res, ask, Promise.resolve())
        : stream(
            true,
            started(1, 't1'),
            said(2, 'old'),
            ended(3, 't1'),
            started(4, 't2'),
            said(5, 'Ticket #42 is'),
            said(6, 'about login.'),
            ended(7, 't2'),
          )(res, ask, Promise.resolve()),
  });
  const s = ry.session('s1');
  assert.equal(await s.reply(), 'Ticket #42 is\n\nabout login.');
  // The next reads on from where that ended, asking nothing else.
  assert.equal(await s.reply(), 'three');
  assert.deepEqual(eventsAsked(asks), ['follow=true', 'from=8&follow=true']);
  assert.equal(asks.length, 3);
});

test('reply after start is its first turn’s answer', async (t) => {
  const { ry, asks } = await stub(t, {
    'POST /v1/sessions': json(201, session('s1', 0)),
    'GET /v1/sessions/s1/events': stream(
      true,
      ev(1, { type: 'state', state: 'starting', sandboxState: 'creating' }),
      started(2, 'f'),
      said(3, 'Done.'),
      ended(4, 'f'),
    ),
  });
  const s = await ry.start({ text: 'Summarize' });
  assert.ok(s instanceof RunyardSession);
  assert.equal(await s.reply(), 'Done.');
  assert.equal(asks.length, 2);
});

test('reply of a turn cut short is a TurnError, with what it said', async (t) => {
  const { ry } = await stub(t, {
    'POST /v1/sessions': json(201, session('s1', 0)),
    'GET /v1/sessions/s1/events': stream(
      true,
      started(1, 't1'),
      said(2, 'Halfway'),
      ev(3, { type: 'error', code: 'provider_error', message: 'overloaded' }),
      ended(4, 't1', 'error'),
    ),
  });
  const err = await rejected((await ry.start({ text: 'go' })).reply());
  assert.ok(err instanceof TurnError);
  assert.equal(err.turnId, 't1');
  assert.equal(err.stopReason, 'error');
  assert.equal(err.text, 'Halfway');
  assert.equal(err.errorMessage, 'overloaded');
  assert.equal(err.message, 'ry: turn t1 ended: error: overloaded');
  assert.equal(new TurnError('t', 'interrupted', '', undefined).message, 'ry: turn t ended: interrupted');
});

test('reply of a session that failed since is a SessionFailedError', async (t) => {
  const { ry } = await stub(t, {
    'GET /v1/sessions/s1': json(200, session('s1', 2)),
    'GET /v1/sessions/s1/events': stream(
      true,
      ev(1, { type: 'state', state: 'failed', sandboxState: 'failed' }),
      ev(2, { type: 'state', state: 'idle', sandboxState: 'ready' }),
      ev(3, { type: 'error', code: 'sandbox_failed', message: 'no machine' }),
      ev(4, { type: 'state', state: 'failed', sandboxState: 'failed' }),
    ),
  });
  const err = await rejected(ry.session('s1').reply());
  assert.ok(err instanceof SessionFailedError);
  assert.match(err.message, /no machine/);
  const bare = await stub(t, {
    'GET /v1/sessions/s1': json(200, session('s1', 0)),
    'GET /v1/sessions/s1/events': stream(true, ev(1, { type: 'state', state: 'failed', sandboxState: 'failed' })),
  });
  const plain = await rejected(bare.ry.session('s1').reply());
  assert.ok(plain instanceof SessionFailedError && plain.message === 'ry: the session failed');
});

test('reply of a stream that ends is a StreamEndedError, with what was said', async (t) => {
  const { ry } = await stub(t, {
    'GET /v1/sessions/s1': json(200, session('s1', 0)),
    'GET /v1/sessions/s1/events': stream(false, started(1, 't1'), said(2, 'Half')),
  });
  const err = await rejected(ry.session('s1').reply());
  assert.ok(err instanceof StreamEndedError);
  assert.equal(err.text, 'Half');
});

test('reply of a line not understood is its error', async (t) => {
  const { ry } = await stub(t, {
    'GET /v1/sessions/s1': json(200, session('s1', 0)),
    'GET /v1/sessions/s1/events': stream(true, started(1, 't1'), '{"line":"event","seq":2}'),
  });
  const err = await rejected(ry.session('s1').reply());
  assert.ok(err instanceof Error && !(err instanceof StreamEndedError));
});

test('reply whose stream is refused is its error', async (t) => {
  const { ry } = await stub(t, {
    'GET /v1/sessions/s1': json(200, session('s1', 0)),
    'GET /v1/sessions/s1/events': json(403, forbidden),
  });
  const err = await rejected(ry.session('s1').reply());
  assert.ok(err instanceof APIError && err.code === ErrorCode.Forbidden);
});

test('reply from what is no longer kept reads what is', async (t) => {
  const { url, asks } = await stub(t, {
    'GET /v1/sessions/s1/events': (res, ask, closed) =>
      ask.url.includes('from=')
        ? answer(res, 409, '{"error":{"code":"gapped","message":"trimmed"}}')
        : stream(true, started(50, 't9'), said(51, 'kept'), ended(52, 't9'))(res, ask, closed),
  });
  const ry = new Runyard({ url, key: 'k' });
  const s = new RunyardSession(ry.configuration, 's1', 10);
  assert.equal(await s.reply(), 'kept');
  assert.deepEqual(eventsAsked(asks), ['from=10&follow=true', 'follow=true']);
});

test('reply from a place refused otherwise is that error', async (t) => {
  const { url } = await stub(t, { 'GET /v1/sessions/s1/events': json(403, forbidden) });
  const s = new RunyardSession(new Runyard({ url, key: 'k' }).configuration, 's1', 10);
  const err = await rejected(s.reply());
  assert.ok(err instanceof APIError && err.code === ErrorCode.Forbidden);
});

test('reply ends with its signal', async (t) => {
  const abort = new AbortController();
  const { ry } = await stub(t, {
    'GET /v1/sessions/s1': json(200, session('s1', 0)),
    'GET /v1/sessions/s1/events': (res) => {
      startStream(res);
      res.write(`${started(1, 't1')}\n`, () => abort.abort());
    },
  });
  const err = await rejected(ry.session('s1').reply({ signal: abort.signal }));
  assert.ok(err instanceof Error && !(err instanceof StreamEndedError));
});

test('turn ids differ, with a global crypto or without', () => {
  assert.notEqual(turnId(), turnId());
  const crypto = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
  Object.defineProperty(globalThis, 'crypto', { value: undefined, configurable: true });
  try {
    assert.match(turnId(), /^ry-[0-9a-f]{16}$/);
  } finally {
    if (crypto !== undefined) Object.defineProperty(globalThis, 'crypto', crypto);
  }
});

// A turn the session never started is a TurnGoneError as soon as its queue
// says so, and the transcript has nothing of it: not when the turn ahead
// ends, which may be long after.
for (const [name, events, why] of [
  // Cancelled from the page while the turn ahead goes on.
  ['cancelled', [started(5, 'ahead'), said(6, 'still going'), caughtUp], takenOut],
  // Dropped by an interrupt that dropped the queue: the turn ahead ends,
  // interrupted, and nothing is given after it.
  ['dropped', [started(5, 'ahead'), ended(6, 'ahead', 'interrupted'), caughtUp], takenOut],
  // Refused as it was given to the harness: an error, and no turn.
  [
    'refused',
    [
      started(5, 'ahead'),
      ev(6, { type: 'error', code: 'provider_error', message: "the turn ahead's" }),
      ended(7, 'ahead'),
      ev(8, { type: 'error', code: 'internal', message: 'the turn could not be given to the harness: no' }),
      caughtUp,
    ],
    'the turn could not be given to the harness: no',
  ],
  // Refused, and the turn behind it started since: still refused.
  [
    'refused, and the next started',
    [
      started(5, 'ahead'),
      ended(6, 'ahead'),
      ev(7, { type: 'error', code: 'internal', message: 'the turn could not be given to the harness: no' }),
      ev(8, { type: 'user', turnId: 'behind', text: 'x', source: 'user' }),
      started(9, 'behind'),
      said(10, 'going'),
      caughtUp,
    ],
    'the turn could not be given to the harness: no',
  ],
] as const) {
  test(`send of a turn ${name} is a TurnGoneError`, async (t) => {
    const { ry, sent } = await sending(
      t,
      (turn) => [change(11, 's1', ['ahead', turn]), change(12, 's1', [])],
      () => [...events],
    );
    const err = await rejected(ry.session('s1').send('hi'));
    assert.ok(err instanceof TurnGoneError, String(err));
    assert.equal(err.turnId, sent());
    assert.equal(err.why, why);
    assert.equal(err.message, `ry: turn ${sent()} was never started: ${why}`);
  });
}

test('send of a session that fails with it queued is a SessionFailedError', async (t) => {
  const { ry } = await sending(
    t,
    (turn) => [
      // Failed before it was sent, and woken by it: not this turn's.
      change(11, 's1', [], { state: 'failed' }),
      change(12, 's1', [turn], { state: 'starting' }),
      change(13, 's1', [turn], { state: 'failed', error: 'no machine' }),
    ],
    () => [],
  );
  const err = await rejected(ry.session('s1').send('hi'));
  assert.ok(err instanceof SessionFailedError && err.message === 'ry: the session failed: no machine', String(err));
  const bare = await sending(t, (turn) => [change(11, 's1', [turn], { state: 'failed' })], () => []);
  const plain = await rejected(bare.ry.session('s1').send('hi'));
  assert.ok(plain instanceof SessionFailedError && plain.message === 'ry: the session failed', String(plain));
});

test('send of a session deleted while it waits is a StreamEndedError', async (t) => {
  for (const deleted of [
    '{"seq":12,"at":"2026-11-19T10:00:00Z","op":"deleted","sessionId":"s1"}',
    '{"seq":12,"at":"2026-11-19T10:00:00Z","op":"updated","sessionId":"s1"}',
  ]) {
    const { ry } = await sending(t, (turn) => [change(11, 's1', [turn]), deleted], () => []);
    assert.ok((await rejected(ry.session('s1').send('hi'))) instanceof StreamEndedError);
  }
});

test('send whose changes end is a StreamEndedError', async (t) => {
  const { ry } = await sending(t, () => [], () => [], { 'GET /v1/changes': stream(false) });
  assert.ok((await rejected(ry.session('s1').send('hi'))) instanceof StreamEndedError);
});

test('send whose changes are refused is the server’s error', async (t) => {
  const { ry } = await sending(t, () => [], () => [], { 'GET /v1/changes': json(403, forbidden) });
  const err = await rejected(ry.session('s1').send('hi'));
  assert.ok(err instanceof APIError && err.code === ErrorCode.Forbidden);
});

test('send whose list is refused is the server’s error, and sends nothing', async (t) => {
  const { ry, sent } = await sending(t, () => [], () => [], { 'GET /v1/sessions': json(403, forbidden) });
  const err = await rejected(ry.session('s1').send('hi'));
  assert.ok(err instanceof APIError && err.code === ErrorCode.Forbidden);
  assert.equal(sent(), '');
});

/** Whether err is an abort: the platform's, or the generated client's FetchError of one. */
function aborted(err: unknown): boolean {
  return err instanceof Error && (err.name === 'AbortError' || (err.cause instanceof Error && err.cause.name === 'AbortError'));
}

// The signal reaches every request a call makes, the first of them too.
test('send ends with its signal, at whichever request it is', async (t) => {
  for (const at of [
    'GET /v1/sessions/s1',
    'GET /v1/sessions',
    'POST /v1/sessions/s1/turns',
    'GET /v1/changes',
    'GET /v1/sessions/s1/events',
  ]) {
    const abort = new AbortController();
    const hang: Route = () => abort.abort();
    const { ry } = await sending(
      t,
      (turn) => [change(11, 's1', [turn]), change(12, 's1', [])],
      (turn) => [ev(5, { type: 'user', turnId: turn, text: 'hi', source: 'api' }), started(6, turn)],
      { [at]: hang },
    );
    const err = await rejected(ry.session('s1').send('hi', { signal: abort.signal }));
    assert.ok(aborted(err), `${at}: ${String(err)}`);
  }
});

test('every other call ends with its signal', async (t) => {
  const abort = new AbortController();
  const hang: Route = () => abort.abort();
  const { ry } = await stub(t, {
    'GET /v1/sessions/s1': hang,
    'DELETE /v1/sessions/s1': hang,
    'POST /v1/sessions/s1/tokens': hang,
    'POST /v1/sessions': hang,
    'GET /v1/sessions': hang,
    'GET /v1/sessions/s1/events': hang,
  });
  const s = ry.session('s1');
  for (const call of [
    () => s.info({ signal: abort.signal }),
    () => s.delete({ signal: abort.signal }),
    () => s.token({ signal: abort.signal }),
    () => s.reply({ signal: abort.signal }),
    () => s.lastReply({ signal: abort.signal }),
    () => ry.start({ signal: abort.signal }),
    () => ry.sessions({ signal: abort.signal }),
  ]) {
    const err = await rejected(call());
    assert.ok(aborted(err), String(err));
  }
});

// Under a minute is refused before the server is asked; 0 is the server's
// default, as absent is.
test('a token of a ttl the server refuses is a RangeError', async (t) => {
  const { ry, asks } = await stub(t, {
    'POST /v1/sessions/s1/tokens': json(201, '{"token":"ryst_x","sessionId":"s1","expiresAt":"2026-11-19T12:00:00Z"}'),
  });
  for (const ttlSeconds of [0.5, 1, 59, -60, Number.NaN]) {
    const err = await rejected(ry.session('s1').token({ ttlSeconds }));
    assert.ok(err instanceof RangeError && err.message.includes(String(ttlSeconds)), String(err));
  }
  assert.equal(asks.length, 0);
  await ry.session('s1').token({ ttlSeconds: 0 });
  await ry.session('s1').token({ ttlSeconds: 90.7 });
  assert.deepEqual(
    asks.map((a) => a.body),
    [{}, { ttlSeconds: 90 }],
  );
});

// The pattern of a backend: the turn sent in one request, its answer read in
// another, by a handle made of the id alone, after the turn ended.
test('lastReply is the turn that ended last', async (t) => {
  const { ry, asks } = await stub(t, {
    'GET /v1/sessions/s1/events': (res, ask, closed) =>
      ask.url.includes('from=10')
        ? stream(true, started(10, 't3'), said(11, 'three'), ended(12, 't3'))(res, ask, closed)
        : stream(
            false,
            started(1, 't1'),
            said(2, 'old'),
            ended(3, 't1'),
            started(4, 't2'),
            said(5, 'Ticket #42 is'),
            ev(6, { type: 'text', text: "a sub-agent's", parentToolId: 'a1' }),
            said(7, 'about login.'),
            ended(9, 't2'),
          )(res, ask, closed),
  });
  const s = ry.session('s1');
  assert.equal(await s.lastReply(), 'Ticket #42 is\n\nabout login.');
  // A reply after it waits for the turn after it.
  assert.equal(await s.reply(), 'three');
  assert.deepEqual(eventsAsked(asks), ['', 'from=10&follow=true']);
});

test('lastReply of a turn cut short is a TurnError; of none ended, a NoReplyError', async (t) => {
  const { ry } = await stub(t, {
    'GET /v1/sessions/s1/events': stream(
      false,
      started(1, 't1'),
      said(2, 'Halfway'),
      ev(3, { type: 'error', code: 'provider_error', message: 'overloaded' }),
      ended(4, 't1', 'error'),
      // A turn under way has not ended: it is not the last that did.
      started(5, 't2'),
      said(6, 'not yet'),
    ),
    'GET /v1/sessions/s2/events': stream(false, caughtUp, started(1, 't1')),
  });
  const err = await rejected(ry.session('s1').lastReply());
  assert.ok(err instanceof TurnError && err.text === 'Halfway' && err.errorMessage === 'overloaded', String(err));
  const none = await rejected(ry.session('s2').lastReply());
  assert.ok(none instanceof NoReplyError && none.message === 'ry: no turn of the session has ended');
});

test('lastReply of no session, or of a line not understood, is its error', async (t) => {
  const { ry } = await stub(t, {
    'GET /v1/sessions/gone/events': json(404, notFound),
    'GET /v1/sessions/s1/events': stream(false, started(1, 't1'), '{"line":"event","seq":2}'),
  });
  const err = await rejected(ry.session('gone').lastReply());
  assert.ok(err instanceof APIError && err.code === ErrorCode.NotFound);
  const bad = await rejected(ry.session('s1').lastReply());
  assert.ok(bad instanceof Error && !(bad instanceof NoReplyError));
});

// What changed since the turn was sent no longer kept, the session as it is
// says whether the turn still waits: gone from its queue, its transcript says
// the rest; still in it, the changes from now on say when it leaves.
for (const waits of [false, true]) {
  test(`send whose changes are gapped reads the session as it is (${waits ? 'still waiting' : 'gone'})`, async (t) => {
    let gets = 0;
    let follows = 0;
    let sentTurn = (): string => '';
    const { ry, sent } = await sending(
      t,
      () => [],
      (turn) => [ev(5, { type: 'user', turnId: turn, text: 'hi', source: 'user' }), started(6, turn), said(7, 'done'), ended(8, turn)],
      {
        'GET /v1/sessions/s1': (res) => {
          gets++;
          const queue = gets > 1 && waits ? { queue: [{ turnId: sentTurn(), text: 't', source: 'api' }] } : {};
          answer(res, 200, session('s1', 4, queue));
        },
        'GET /v1/changes': (res, ask, closed) => {
          follows++;
          if (follows === 1) {
            answer(res, 409, '{"error":{"code":"gapped","message":"trimmed"}}');
            return;
          }
          stream(true, change(11, 's1', []))(res, ask, closed);
        },
      },
    );
    sentTurn = sent;
    assert.equal(await ry.session('s1').send('hi'), 'done');
    assert.equal(follows, waits ? 2 : 1);
  });
}
