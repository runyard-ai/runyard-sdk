import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';
import type { TestContext } from 'node:test';

import { RelayError, createRelay, keptChange, toNodeHandler } from '../src/relay.js';
import type { Person, Relay, RelayConfig, Scope } from '../src/relay.js';
import { answer, deferred, serve, startStream } from './stub.js';

const ada = 'ada@example.com';
const grace = 'grace@example.com';
const key = 'ryak_the_key';

/** A request runyard-agents was asked, as it was asked. */
interface Asked {
  method: string;
  path: string;
  query: URLSearchParams;
  headers: IncomingMessage['headers'];
  body: string;
}

type Route = (req: IncomingMessage, res: ServerResponse) => void;

/** runyard-agents, as the tests stand it in: sessions it knows, read back as they are, and what else a test answers by hand. */
async function upstream(t: TestContext) {
  const asked: Asked[] = [];
  const sessions = new Map<string, string>();
  const routes = new Map<string, Route>();
  const { url } = await serve(t, ({ req, res }) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => {
      const u = new URL(req.url ?? '/', 'http://x');
      asked.push({ method: req.method ?? '', path: u.pathname, query: u.searchParams, headers: req.headers, body: Buffer.concat(chunks).toString() });
      const route = routes.get(`${req.method} ${u.pathname}`);
      const id = decodeURIComponent(u.pathname.slice('/v1/sessions/'.length));
      if (route) {
        route(req, res);
      } else if (req.method === 'GET' && u.pathname.startsWith('/v1/sessions/') && sessions.has(id)) {
        answer(res, 200, sessions.get(id)!);
      } else if (req.method === 'GET' && u.pathname.startsWith('/v1/sessions/') && u.pathname.split('/').length === 4) {
        answer(res, 404, '{"error":{"code":"not_found","message":"no such session"}}');
      } else {
        answer(res, 200, '{"ok":true}');
      }
    });
  });
  return {
    url,
    asked,
    session(id: string, owner: string, labels: Record<string, string> = {}) {
      sessions.set(id, JSON.stringify({ id, owner, labels, title: `t-${id}`, state: 'idle', createdAt: '2026-11-14T00:00:00Z' }));
    },
    on(route: string, h: Route) {
      routes.set(route, h);
    },
    last(method: string, path: string): Asked | undefined {
      return [...asked].reverse().find((a) => a.method === method && a.path === path);
    },
  };
}

type Upstream = Awaited<ReturnType<typeof upstream>>;

/** A Person hook that reads the caller from a header the tests set, as a program reads its own cookie. */
function whom(req: Request): Person {
  const email = req.headers.get('x-test-person');
  if (!email) throw new Error('not signed in');
  return { email };
}

/** A program's scope: a person's own sessions of the app. */
const app = (_req: Request, p: Person): Scope => ({ owner: p.email, labels: { 'app.user': p.email } });

function relayOf(u: Upstream, config: Partial<RelayConfig> = {}): Relay {
  return createRelay({ url: u.url, key, person: whom, prefix: '/agents', ...config });
}

/** The browser's request, as person (none when empty), and its answer, read. */
async function call(relay: Relay, person: string, method: string, path: string, body?: string, headers: Record<string, string> = {}) {
  const h = new Headers(headers);
  if (person) h.set('X-Test-Person', person);
  const res = await relay(new Request(`http://app.example/agents${path}`, { method, headers: h, body }));
  return { status: res.status, headers: res.headers, body: await res.text() };
}

function code(body: string): string {
  return (JSON.parse(body) as { error: { code: string } }).error.code;
}

test('a relay it cannot make is refused', () => {
  const person = whom;
  for (const config of [
    { url: '', key, person },
    { url: 'https://a.example', key: '', person },
    { url: 'https://a.example', key },
    { url: '::', key, person },
    { url: 'ftp://a.example', key, person },
    { url: 'https://a.example', key, person, signIn: {} },
  ]) {
    assert.throws(() => createRelay(config as unknown as RelayConfig), JSON.stringify(config));
  }
});

test('a caller is whom person says', async (t) => {
  const u = await upstream(t);
  const relay = relayOf(u, {
    person(req) {
      switch (req.headers.get('x-test-person')) {
        case null:
          throw new Error('no cookie');
        case 'banned':
          throw new RelayError(403, 'forbidden', 'banned');
        case 'nameless':
          return { email: '' };
      }
      return { email: req.headers.get('x-test-person')! };
    },
  });
  for (const [person, want] of [['', 401], ['banned', 403], ['nameless', 401]] as const) {
    const got = await call(relay, person, 'GET', '/v1/sessions');
    assert.equal(got.status, want, person);
    assert.ok(code(got.body));
  }
  assert.equal(u.asked.length, 0);
});

test('a scope it cannot make is refused', async (t) => {
  const u = await upstream(t);
  const errors: string[] = [];
  const relay = relayOf(u, {
    log: { warn: () => undefined, error: (m, f) => errors.push(`${m} ${String(f['err'])}`) },
    scope(_req, p) {
      if (p.email === 'plain@example.com') throw new Error('the database is down');
      if (p.email === 'said@example.com') throw new RelayError(402, 'quota_exceeded', 'pay');
      return { owner: '' };
    },
  });
  for (const [person, want] of [['plain@example.com', 500], ['said@example.com', 402], [ada, 500]] as const) {
    assert.equal((await call(relay, person, 'GET', '/v1/sessions')).status, want, person);
  }
  assert.equal(u.asked.length, 0);
  assert.ok(errors.some((e) => e.includes('the database is down')), String(errors));
});

test('only the routes it knows are relayed', async (t) => {
  const u = await upstream(t);
  u.session('s1', ada);
  const relay = relayOf(u);
  for (const [method, path] of [
    ['GET', '/v1/runners'],
    ['GET', '/v1/users'],
    ['PUT', '/v1/sessions/s1'],
    ['GET', '/v1/sessions/s1/terminal'],
    ['PUT', '/v1/sessions/s1/files/content'],
    ['POST', '/v1/sessions/s1/fork'],
    ['GET', '/v1/providers'],
    ['GET', '/v2/sessions'],
    ['GET', '/v1/sessions/%E0%A4%A'],
  ] as const) {
    const got = await call(relay, ada, method, path);
    assert.equal(got.status, 404, `${method} ${path}`);
    assert.equal(code(got.body), 'not_found');
  }
  // Outside its prefix, too.
  const outside = await relay(new Request('http://app.example/elsewhere/v1/sessions', { headers: { 'X-Test-Person': ada } }));
  assert.equal(outside.status, 404);
  assert.equal(u.asked.length, 0);
});

test('a list is of the scope only', async (t) => {
  const u = await upstream(t);
  u.on('GET /v1/sessions', (_req, res) =>
    answer(res, 200, JSON.stringify({
      items: [
        { id: 'mine', owner: 'ADA@example.com', labels: { 'app.user': ada, x: 'y' }, extra: { kept: true } },
        { id: 'theirs', owner: grace, labels: { 'app.user': ada } },
        { id: 'unlabelled', owner: ada, labels: {} },
        'not a session',
      ],
      nextCursor: 'c2',
    })),
  );
  const relay = relayOf(u, { scope: app });
  const got = await call(relay, ada, 'GET', `/v1/sessions?owner=${grace}&whose=all&limit=5&cursor=c1&archived=false&state=idle&state=failed&label=x%3Dy`);
  assert.equal(got.status, 200, got.body);
  const page = JSON.parse(got.body) as { items: { id: string; extra?: unknown }[]; nextCursor: string };
  assert.deepEqual(page.items.map((i) => i.id), ['mine']);
  assert.ok(page.items[0]!.extra);
  assert.equal(page.nextCursor, 'c2');
  const a = u.last('GET', '/v1/sessions')!;
  assert.equal(a.query.get('owner'), ada);
  assert.equal(a.query.has('whose'), false);
  assert.equal(a.query.get('limit'), '5');
  assert.equal(a.query.get('cursor'), 'c1');
  assert.equal(a.query.get('archived'), 'false');
  assert.deepEqual(a.query.getAll('state'), ['idle', 'failed']);
  assert.deepEqual(a.query.getAll('label'), ['x=y', `app.user=${ada}`]);
  assert.equal(a.headers.authorization, `Bearer ${key}`);
});

test('a list answers what runyard-agents answered', async (t) => {
  const u = await upstream(t);
  const relay = relayOf(u);
  u.on('GET /v1/sessions', (_req, res) => answer(res, 400, '{"error":{"code":"bad_request","message":"limit"}}'));
  let got = await call(relay, ada, 'GET', '/v1/sessions');
  assert.equal(got.status, 400);
  assert.equal(code(got.body), 'bad_request');
  for (const unreadable of ['[1]', '{"items":3}', '{']) {
    u.on('GET /v1/sessions', (_req, res) => answer(res, 200, unreadable));
    got = await call(relay, ada, 'GET', '/v1/sessions');
    assert.equal(got.status, 502, unreadable);
    assert.equal(code(got.body), 'upstream_error');
  }
});

test('a start is the scope’s, whatever the browser says', async (t) => {
  const u = await upstream(t);
  u.on('POST /v1/sessions', (_req, res) =>
    answer(res, 201, `{"id":"new","owner":"${ada}","labels":{"app.user":"${ada}"},"title":"Hi","createdAt":"2026-11-14T00:00:00Z"}`),
  );
  const started: string[] = [];
  const relay = relayOf(u, {
    scope: app,
    newId: () => 'turn-1',
    start(_req, _p, spec) {
      spec.profileId = 'chat';
      // What start may not change: the scope's.
      spec.owner = grace;
      spec.labels!['app.user'] = grace;
      spec.labels!['app.org'] = 'o1';
      spec.parentId = 'elsewhere';
    },
    turn(_req, p, turn) {
      turn.provider = `claude-${p.email}`;
    },
    started(_req, _p, s) {
      started.push(`${s.id} ${s.createdAt instanceof Date}`);
    },
  });
  const got = await call(relay, ada, 'POST', '/v1/sessions', '{"title":"Hi","autoTitle":false,"firstTurn":{"text":"hello","mode":"plan"}}', { 'Idempotency-Key': 'k1' });
  assert.equal(got.status, 201, got.body);
  assert.match(got.body, /"id":"new"/);
  const a = u.last('POST', '/v1/sessions')!;
  const spec = JSON.parse(a.body);
  assert.equal(spec.owner, ada);
  assert.deepEqual(spec.labels, { 'app.user': ada, 'app.org': 'o1' });
  assert.equal(spec.parentId, undefined);
  assert.equal(spec.profileId, 'chat');
  assert.equal(spec.title, 'Hi');
  assert.equal(spec.autoTitle, false);
  assert.deepEqual(spec.firstTurn, { turnId: 'turn-1', text: 'hello', mode: 'plan', provider: `claude-${ada}` });
  assert.equal(a.headers['idempotency-key'], 'k1');
  assert.equal(a.headers['content-type'], 'application/json');
  assert.deepEqual(started, ['new true']);
});

test('a start refuses what is not the browser’s to say', async (t) => {
  const u = await upstream(t);
  const relay = relayOf(u);
  for (const body of [
    `{"owner":"${grace}"}`,
    '{"labels":{"a":"b"}}',
    '{"profileId":"admin"}',
    '{"firstTurn":{"text":"x","provider":"theirs"}}',
    '{"title":3}',
    '{"firstTurn":"hello"}',
    '{"title":',
    '[]',
    `{"title":"${'x'.repeat((1 << 20) + 1)}"}`,
  ]) {
    const got = await call(relay, ada, 'POST', '/v1/sessions', body);
    assert.equal(got.status, 400, body.slice(0, 60));
    assert.equal(code(got.body), 'bad_request');
  }
  assert.equal(u.asked.length, 0);
});

test('a start with no body is the scope’s', async (t) => {
  const u = await upstream(t);
  u.on('POST /v1/sessions', (_req, res) => answer(res, 201, '{"id":"new"}'));
  const relay = relayOf(u, {
    start(_req, _p, spec) {
      delete spec.labels;
    },
  });
  const got = await call(relay, ada, 'POST', '/v1/sessions');
  assert.equal(got.status, 201, got.body);
  assert.deepEqual(JSON.parse(u.last('POST', '/v1/sessions')!.body), { owner: ada, labels: {} });
});

test('a start refused is not started', async (t) => {
  const u = await upstream(t);
  u.on('POST /v1/sessions', (_req, res) => answer(res, 409, '{"error":{"code":"spec_conflict","message":"no"}}'));
  let started = 0;
  const logged: string[] = [];
  const relay = relayOf(u, {
    log: { warn: () => undefined, error: (m, f) => logged.push(`${m} ${String(f['err'])}`) },
    started() {
      started++;
    },
    scope: (_req, p) => ({ owner: p.email, noStart: p.email === grace }),
    start(req) {
      const why = new URL(req.url).searchParams.get('why');
      if (why === 'said') throw new RelayError(402, 'quota_exceeded', 'pay first');
      if (why === 'failed') throw new Error('the database is down');
    },
    turn(req) {
      if (new URL(req.url).searchParams.get('why') === 'turn') throw new RelayError(400, 'bad_request', 'no turns');
    },
  });
  for (const [person, query, status, want] of [
    [grace, '', 403, 'forbidden'],
    [ada, '?why=said', 402, 'quota_exceeded'],
    [ada, '?why=failed', 500, 'internal'],
    [ada, '?why=turn', 400, 'bad_request'],
    [ada, '', 409, 'spec_conflict'],
  ] as const) {
    const got = await call(relay, person, 'POST', `/v1/sessions${query}`, '{"firstTurn":{"text":"x"}}');
    assert.equal(got.status, status, `${person}${query}: ${got.body}`);
    assert.equal(code(got.body), want);
  }
  assert.equal(started, 0);
  assert.ok(logged.some((l) => l.includes('the database is down')), String(logged));
  u.on('POST /v1/sessions', (_req, res) => answer(res, 201, '{"id":'));
  assert.equal((await call(relay, ada, 'POST', '/v1/sessions')).status, 502);
  assert.equal(started, 0);
});

test('a session started is the browser’s even when started fails', async (t) => {
  const u = await upstream(t);
  u.on('POST /v1/sessions', (_req, res) => answer(res, 201, '{"id":"new"}'));
  const logged: string[] = [];
  const relay = relayOf(u, {
    log: { warn: () => undefined, error: (m) => logged.push(m) },
    started() {
      throw new Error('could not record it');
    },
  });
  const got = await call(relay, ada, 'POST', '/v1/sessions');
  assert.equal(got.status, 201);
  assert.deepEqual(logged, ['relay: started failed']);
});

const everyRoute: [string, string][] = [
  ['GET', ''], ['PATCH', ''], ['DELETE', ''],
  ['POST', '/archive'], ['POST', '/restore'],
  ['GET', '/events?follow=true'], ['POST', '/turns'], ['POST', '/interrupt'],
  ['POST', '/rewind'],
  ['DELETE', '/queue/t1'], ['PATCH', '/queue/t1'],
  ['PUT', '/queue/t1/hold'], ['DELETE', '/queue/t1/hold'], ['POST', '/queue/t1/interrupt'],
  ['GET', '/attachments/u1'], ['GET', '/files?path=/'], ['GET', '/files/content?path=/a'],
  ['GET', '/subagents'], ['GET', '/subagents/a1'],
];

test('a session of anybody else’s is not found', async (t) => {
  const u = await upstream(t);
  u.session('mine', ada, { 'app.user': ada });
  u.session('theirs', grace, { 'app.user': ada });
  u.session('unlabelled', ada);
  u.session('relabelled', ada, { 'app.user': grace });
  const relay = relayOf(u, { scope: app });
  const mine = await call(relay, ada, 'GET', '/v1/sessions/mine');
  assert.equal(mine.status, 200);
  assert.match(mine.body, /"title":"t-mine"/);
  for (const id of ['theirs', 'unlabelled', 'relabelled', 'missing']) {
    for (const [method, rest] of everyRoute) {
      const got = await call(relay, ada, method, `/v1/sessions/${id}${rest}`, method === 'GET' ? undefined : '{"text":"x"}');
      assert.equal(got.status, 404, `${method} ${id}${rest}: ${got.body}`);
      assert.equal(code(got.body), 'not_found');
    }
  }
  // What was asked of runyard-agents is whose each is, and nothing else.
  for (const a of u.asked) {
    assert.equal(a.method, 'GET');
    assert.equal(a.path.split('/').length, 4, a.path);
  }
});

test('a session of the scope is relayed', async (t) => {
  const u = await upstream(t);
  u.session('s 1', ada);
  const turned: string[] = [];
  const relay = relayOf(u, {
    turn(_req, _p, turn) {
      turned.push(turn.text);
      turn.model = 'opus';
    },
  });
  const sp = '/v1/sessions/s%201';
  const cases: { method: string; path: string; body?: string; query?: Record<string, string>; sent?: unknown }[] = [
    { method: 'PATCH', path: sp, body: '{"title":"New","pinned":true}', sent: { title: 'New', pinned: true } },
    { method: 'DELETE', path: sp },
    { method: 'POST', path: `${sp}/archive` },
    { method: 'POST', path: `${sp}/restore` },
    { method: 'POST', path: `${sp}/turns`, body: '{"turnId":"t9","text":"hi","mode":"plan"}', sent: { turnId: 't9', text: 'hi', mode: 'plan', model: 'opus' } },
    { method: 'POST', path: `${sp}/interrupt`, body: '{"dropQueued":true}', sent: { dropQueued: true } },
    { method: 'POST', path: `${sp}/interrupt`, sent: {} },
    { method: 'POST', path: `${sp}/rewind`, body: '{"toSeq":12}', sent: { toSeq: 12 } },
    { method: 'DELETE', path: `${sp}/queue/t%2F1` },
    { method: 'PATCH', path: `${sp}/queue/t%2F1`, body: '{"text":"edited"}', sent: { text: 'edited' } },
    { method: 'PUT', path: `${sp}/queue/t1/hold` },
    { method: 'DELETE', path: `${sp}/queue/t1/hold` },
    { method: 'POST', path: `${sp}/queue/t1/interrupt` },
    { method: 'GET', path: `${sp}/attachments/u1?x=1` },
    { method: 'GET', path: `${sp}/files?path=%2Fwork&depth=9`, query: { path: '/work' } },
    { method: 'GET', path: `${sp}/files/content?path=%2Fa.png`, query: { path: '/a.png' } },
    { method: 'GET', path: `${sp}/subagents` },
    { method: 'GET', path: `${sp}/subagents/a1` },
    { method: 'GET', path: `${sp}/events?follow=true&from=4&subagent=a1&owner=x`, query: { follow: 'true', from: '4', subagent: 'a1' } },
  ];
  for (const c of cases) {
    const got = await call(relay, ada, c.method, c.path, c.body);
    assert.equal(got.status, 200, `${c.method} ${c.path}: ${got.body}`);
    assert.equal(got.body, '{"ok":true}');
    const path = decodeURIComponent(c.path.split('?')[0]!);
    const a = [...u.asked].reverse().find((x) => x.method === c.method && decodeURIComponent(x.path) === path);
    assert.ok(a, `${c.method} ${path} not asked`);
    assert.deepEqual(Object.fromEntries(a.query), c.query ?? {}, `${c.method} ${c.path}`);
    assert.deepEqual(a.body === '' ? undefined : JSON.parse(a.body), c.sent, `${c.method} ${c.path}`);
  }
  // The escaping kept: one session's queue, not a path of more segments.
  assert.ok(u.asked.some((a) => a.path === '/v1/sessions/s%201/queue/t%2F1'));
  assert.deepEqual(turned, ['hi']);
});

test('what the browser may not say of a session is refused', async (t) => {
  const u = await upstream(t);
  u.session('s1', ada);
  u.session('graces', grace);
  const relay = relayOf(u, {
    turn() {
      throw new RelayError(429, 'quota_exceeded', 'slow down');
    },
  });
  for (const [method, path, body] of [
    ['PATCH', '/v1/sessions/s1', '{"labels":{"app.user":"x"}}'],
    ['PATCH', '/v1/sessions/s1', '{"brokers":["all"]}'],
    ['PATCH', '/v1/sessions/s1', '{"pinned":"yes"}'],
    ['POST', '/v1/sessions/s1/turns', '{"text":"x","provider":"theirs"}'],
    ['POST', '/v1/sessions/s1/turns', '{"text":"x","attachments":[{"kind":"session","sessionId":"s2"}]}'],
    ['POST', '/v1/sessions/s1/turns', '{"text":"x","attachments":[{"kind":"session","sessionId":"graces"}]}'],
    ['POST', '/v1/sessions/s1/turns', '{"text":"x","attachments":[{"kind":"quote","text":"x","sessionId":"graces"}]}'],
    ['POST', '/v1/sessions/s1/turns', '{"text":"x","attachments":[{"kind":"upload","uploadId":"u1","name":"b"}]}'],
    ['POST', '/v1/sessions/s1/turns', '{"text":"x","attachments":[{"kind":"session","sessionId":"s1","name":"b"}]}'],
    ['POST', '/v1/sessions/s1/turns', '{"text":"x","attachments":[{"kind":"quote","text":"x","uploadId":"u1"}]}'],
    ['POST', '/v1/sessions/s1/turns', '{"text":"x","attachments":[{"kind":"file","path":"a","name":"b"}]}'],
    ['POST', '/v1/sessions/s1/turns', '{"text":"x","attachments":[{"kind":"context","name":"a","text":"b","seq":1}]}'],
    ['POST', '/v1/sessions/s1/turns', '{"text":"x","attachments":[{"kind":"picture"}]}'],
    ['POST', '/v1/sessions/s1/turns', '{"text":"x","attachments":{"kind":"file"}}'],
    ['POST', '/v1/sessions', '{"firstTurn":{"text":"x","attachments":[{"kind":"session","sessionId":"graces"}]}}'],
    ['POST', '/v1/sessions/s1/interrupt', '{"why":1}'],
    ['POST', '/v1/sessions/s1/rewind', '{"toSeq":"last"}'],
    ['POST', '/v1/sessions/s1/rewind', '{"toSeq":1,"andFork":true}'],
    ['PATCH', '/v1/sessions/s1/queue/t1', '{"text":"x","mode":"plan"}'],
  ] as const) {
    assert.equal((await call(relay, ada, method, path, body)).status, 400, `${method} ${path} ${body}`);
  }
  assert.equal((await call(relay, ada, 'POST', '/v1/sessions/s1/turns', '{"text":"x"}')).status, 429);
  assert.equal(u.last('POST', '/v1/sessions/s1/turns'), undefined);
});

test('a turn naming a session the relay cannot read is a bad gateway', async (t) => {
  const u = await upstream(t);
  u.session('s1', ada);
  u.on('GET /v1/sessions/broken', (_req, res) => answer(res, 500, '{"error":{"code":"internal","message":"x"}}'));
  u.on('GET /v1/sessions/garbled', (_req, res) => answer(res, 200, '{"owner":'));
  const relay = relayOf(u);
  for (const id of ['broken', 'garbled']) {
    const got = await call(relay, ada, 'POST', '/v1/sessions/s1/turns', `{"text":"x","attachments":[{"kind":"session","sessionId":"${id}"}]}`);
    assert.equal(got.status, 502, id);
    assert.equal(code(got.body), 'upstream_error');
  }
  assert.equal(u.last('POST', '/v1/sessions/s1/turns'), undefined);
});

test('an upload is kept for the caller’s scope', async (t) => {
  const u = await upstream(t);
  u.on('POST /v1/uploads', (_req, res) =>
    answer(res, 201, '{"id":"0123456789abcdef0123456789abcdef","name":"a.txt","size":5,"expiresAt":"2026-11-15T00:00:00Z"}'),
  );
  u.on('DELETE /v1/uploads/0123456789abcdef0123456789abcdef', (_req, res) => {
    res.writeHead(204);
    res.end();
  });
  const shared = (): Scope => ({ owner: 'app@example.com', noStart: true });
  for (const [scope, owner] of [
    [undefined, ada],
    [shared, 'app@example.com'],
  ] as const) {
    const relay = relayOf(u, scope ? { scope } : {});
    const got = await call(relay, ada, 'POST', '/v1/uploads?name=a.txt&owner=grace%40example.com&other=1', 'hello');
    assert.equal(got.status, 201, got.body);
    assert.match(got.body, /"name":"a.txt"/);
    const asked = u.last('POST', '/v1/uploads')!;
    assert.equal(asked.body, 'hello');
    assert.equal(asked.headers['content-type'], 'application/octet-stream');
    assert.equal(asked.headers['authorization'], `Bearer ${key}`);
    assert.deepEqual([...asked.query], [['name', 'a.txt'], ['owner', owner]]);
    const dropped = await call(relay, ada, 'DELETE', '/v1/uploads/0123456789abcdef0123456789abcdef?owner=grace%40example.com');
    assert.equal(dropped.status, 204);
    assert.deepEqual([...u.last('DELETE', '/v1/uploads/0123456789abcdef0123456789abcdef')!.query], [['owner', owner]]);
  }
  // Nobody's: nobody keeps a file through it.
  assert.equal((await call(relayOf(u), '', 'POST', '/v1/uploads?name=a.txt', 'x')).status, 401);
});

test('a turn carries what it attaches', async (t) => {
  const u = await upstream(t);
  u.session('s1', ada);
  u.session('s2', ada);
  u.on('POST /v1/sessions', (_req, res) => answer(res, 201, '{"id":"new"}'));
  const relay = relayOf(u);
  const said = [
    { kind: 'file', path: 'src/a.go' },
    { kind: 'context', name: 'Rate limiting', text: 'Read it first.' },
    { kind: 'upload', uploadId: 'u1' },
    { kind: 'session', sessionId: 's2' },
    { kind: 'quote', text: 'q', sessionId: 's2', seq: 4 },
    { kind: 'quote', text: 'r' },
  ];
  const turned = JSON.stringify({ text: 'x', attachments: said });
  assert.equal((await call(relay, ada, 'POST', '/v1/sessions/s1/turns', turned)).status, 200);
  assert.deepEqual(JSON.parse(u.last('POST', '/v1/sessions/s1/turns')!.body).attachments, said);
  assert.equal((await call(relay, ada, 'POST', '/v1/sessions', `{"firstTurn":${turned}}`)).status, 201);
  assert.deepEqual(JSON.parse(u.last('POST', '/v1/sessions')!.body).firstTurn.attachments, said);
  // None is none, not an empty list.
  await call(relay, ada, 'POST', '/v1/sessions/s1/turns', '{"text":"x","attachments":[]}');
  assert.equal(JSON.parse(u.last('POST', '/v1/sessions/s1/turns')!.body).attachments, undefined);
});

test('a turn with no id is given one', async (t) => {
  const u = await upstream(t);
  u.session('s1', ada);
  const relay = relayOf(u);
  assert.equal((await call(relay, ada, 'POST', '/v1/sessions/s1/turns', '{"text":"x"}')).status, 200);
  const turn = JSON.parse(u.last('POST', '/v1/sessions/s1/turns')!.body);
  assert.match(turn.turnId, /^[0-9a-f]{32}$/);
});

test('an answer is relayed as it was written', async (t) => {
  const u = await upstream(t);
  u.session('s1', ada);
  u.on('GET /v1/sessions/s1/attachments/u1', (_req, res) => {
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="a.png"',
      'Cache-Control': 'private, max-age=60',
      'Set-Cookie': 'upstream=1',
    });
    res.end(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  });
  u.on('POST /v1/sessions/s1/turns', (_req, res) => answer(res, 409, '{"error":{"code":"conflict","message":"busy"}}'));
  u.on('DELETE /v1/sessions/s1', (_req, res) => {
    res.writeHead(204);
    res.end();
  });
  const relay = relayOf(u);
  const res = await relay(new Request('http://app.example/agents/v1/sessions/s1/attachments/u1', { headers: { 'X-Test-Person': ada } }));
  assert.equal(res.status, 200);
  assert.deepEqual([...new Uint8Array(await res.arrayBuffer())], [0x89, 0x50, 0x4e, 0x47]);
  assert.equal(res.headers.get('content-type'), 'image/png');
  assert.equal(res.headers.get('content-disposition'), 'inline; filename="a.png"');
  assert.equal(res.headers.get('cache-control'), 'private, max-age=60');
  assert.equal(res.headers.get('set-cookie'), null);
  const busy = await call(relay, ada, 'POST', '/v1/sessions/s1/turns', '{"text":"x"}');
  assert.equal(busy.status, 409);
  assert.equal(code(busy.body), 'conflict');
  const gone = await call(relay, ada, 'DELETE', '/v1/sessions/s1');
  assert.equal(gone.status, 204);
  assert.equal(gone.body, '');
});

test('the key refused is the relay’s failure', async (t) => {
  const u = await upstream(t);
  for (const status of [401, 403]) {
    u.on('GET /v1/sessions/s1', (_req, res) => answer(res, status, '{"error":{"code":"unauthorized","message":"bad key"}}'));
    const logged: string[] = [];
    const relay = relayOf(u, { log: { warn: () => undefined, error: (m, f) => logged.push(`${m} ${String(f['body'])}`) } });
    const got = await call(relay, ada, 'GET', '/v1/sessions/s1');
    assert.equal(got.status, 502, String(status));
    assert.equal(code(got.body), 'upstream_error');
    assert.ok(logged.some((l) => l.includes('bad key')), String(logged));
  }
});

test('runyard-agents unanswering is a bad gateway', async () => {
  const warned: string[] = [];
  const relay = createRelay({
    url: 'http://127.0.0.1:1/',
    key,
    person: whom,
    log: { warn: (m) => warned.push(m), error: () => undefined },
  });
  const res = await relay(new Request('http://app.example/v1/sessions', { headers: { 'X-Test-Person': ada } }));
  assert.equal(res.status, 502);
  assert.equal(code(await res.text()), 'upstream_error');
  assert.deepEqual(warned, ['relay: runyard-agents is not answering']);
});

test('a session it cannot read is a bad gateway', async (t) => {
  const u = await upstream(t);
  u.on('GET /v1/sessions/s1', (_req, res) => answer(res, 200, '{"owner":'));
  u.on('GET /v1/sessions/s2', (_req, res) => answer(res, 200, `{"owner":"${ada}","labels":{}}`));
  const relay = relayOf(u);
  assert.equal((await call(relay, ada, 'GET', '/v1/sessions/s1')).status, 502);
  // One without its id is nobody's.
  assert.equal((await call(relay, ada, 'GET', '/v1/sessions/s2')).status, 404);
});

test('a transcript is relayed as it is written', async (t) => {
  const u = await upstream(t);
  u.session('s1', ada);
  const more = deferred<void>();
  u.on('GET /v1/sessions/s1/events', (_req, res) => {
    startStream(res);
    res.write('{"line":"event","seq":1}\n');
    void more.promise.then(() => res.end('{"line":"caughtUp","seq":1}\n'));
  });
  const relay = relayOf(u);
  const res = await relay(new Request('http://app.example/agents/v1/sessions/s1/events?follow=true', { headers: { 'X-Test-Person': ada } }));
  assert.equal(res.headers.get('content-type'), 'application/x-ndjson');
  assert.equal(res.headers.get('cache-control'), 'no-store');
  assert.equal(res.headers.get('x-accel-buffering'), 'no');
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  // The first line, before runyard-agents has written the second.
  assert.equal(decoder.decode((await reader.read()).value), '{"line":"event","seq":1}\n');
  more.resolve();
  let rest = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    rest += decoder.decode(value);
  }
  assert.equal(rest, '{"line":"caughtUp","seq":1}\n');
});

test('a gapped transcript is said as runyard-agents says it', async (t) => {
  const u = await upstream(t);
  u.session('s1', ada);
  const gapped = '{"error":{"code":"gapped","message":"gone"},"oldest":40}';
  u.on('GET /v1/sessions/s1/events', (_req, res) => answer(res, 409, gapped));
  const got = await call(relayOf(u), ada, 'GET', '/v1/sessions/s1/events?from=2');
  assert.equal(got.status, 409);
  assert.equal(got.body, gapped);
});

test('changes are of the scope only', async (t) => {
  const u = await upstream(t);
  const lines = [
    `{"seq":1,"at":"2026-11-14T00:00:00Z","op":"created","sessionId":"mine","session":{"id":"mine","owner":"${ada}","labels":{"app.user":"${ada}"}}}`,
    `{"seq":2,"at":"2026-11-14T00:00:01Z","op":"created","sessionId":"theirs","session":{"id":"theirs","owner":"${grace}","labels":{"app.user":"${ada}"}}}`,
    '',
    '{"seq":3,"at":"2026-11-14T00:00:02Z","op":"deleted","sessionId":"theirs"}',
    `{"seq":4,"at":"2026-11-14T00:00:03Z","op":"updated","sessionId":"moved","session":{"id":"moved","owner":"${ada}","labels":{"app.user":"${ada}"}}}`,
    `{"seq":5,"at":"2026-11-14T00:00:04Z","op":"updated","sessionId":"moved","session":{"id":"moved","owner":"${ada}","labels":{}}}`,
    `{"seq":6,"at":"2026-11-14T00:00:05Z","op":"updated","sessionId":"moved","session":{"id":"moved","owner":"${ada}","labels":{}}}`,
    'not json',
    'null',
    '{"seq":7,"at":"2026-11-14T00:00:06Z","op":"deleted","sessionId":"mine"}',
  ];
  u.on('GET /v1/changes', (_req, res) => {
    startStream(res);
    // Written a few bytes at a time: a line is a line however it arrives.
    const all = `${lines.join('\n')}\n`;
    for (let i = 0; i < all.length; i += 7) res.write(all.slice(i, i + 7));
    res.end();
  });
  const relay = relayOf(u, { scope: app });
  const got = await call(relay, ada, 'GET', '/v1/changes?follow=true&from=1&whose=all');
  assert.equal(got.status, 200);
  assert.equal(got.headers.get('content-type'), 'application/x-ndjson');
  assert.equal(
    got.body,
    `${[
      lines[0],
      '',
      lines[4],
      '{"seq":5,"at":"2026-11-14T00:00:04Z","op":"deleted","sessionId":"moved"}',
      '{"seq":7,"at":"2026-11-14T00:00:06Z","op":"deleted","sessionId":"mine"}',
    ].join('\n')}\n`,
  );
  assert.deepEqual(Object.fromEntries(u.last('GET', '/v1/changes')!.query), { follow: 'true', from: '1' });
  u.on('GET /v1/changes', (_req, res) => answer(res, 409, '{"error":{"code":"gapped","message":"x"}}'));
  const gapped = await call(relay, ada, 'GET', '/v1/changes?from=1');
  assert.equal(gapped.status, 409);
  assert.equal(code(gapped.body), 'gapped');
});

test('changes say what was listed is gone', async (t) => {
  const u = await upstream(t);
  u.on('GET /v1/sessions', (req, res) => {
    const q = new URL(req.url ?? '/', 'http://x').searchParams;
    if (q.get('archived') === 'false' && !q.has('cursor')) {
      answer(res, 200, JSON.stringify({
        items: [
          { id: 'listed', owner: ada, labels: { 'app.user': ada } },
          { id: 'foreign', owner: grace, labels: { 'app.user': ada } },
          'not a session',
        ],
        nextCursor: 'p2',
      }));
    } else if (q.get('archived') === 'false') {
      answer(res, 200, JSON.stringify({ items: [{ id: 'second', owner: ada, labels: { 'app.user': ada } }] }));
    } else {
      answer(res, 200, JSON.stringify({ items: [{ id: 'archived', owner: ada, labels: { 'app.user': ada } }], nextCursor: '' }));
    }
  });
  u.on('GET /v1/changes', (_req, res) => {
    startStream(res);
    for (const id of ['listed', 'second', 'archived', 'foreign', 'never']) {
      res.write(`{"seq":1,"at":"2026-11-14T00:00:00Z","op":"deleted","sessionId":"${id}"}\n`);
    }
    res.end();
  });
  const relay = relayOf(u, { scope: app });
  const got = await call(relay, ada, 'GET', '/v1/changes?from=1');
  assert.equal(got.status, 200);
  assert.deepEqual(got.body.trim().split('\n').map((l) => JSON.parse(l).sessionId), ['listed', 'second', 'archived']);
  const listed = u.asked
    .filter((a) => a.path === '/v1/sessions')
    .map((a) => `${a.query.get('archived')} ${a.query.get('cursor') ?? ''} ${a.query.get('owner')} ${a.query.get('label')}`);
  assert.deepEqual(listed, [`false  ${ada} app.user=${ada}`, `false p2 ${ada} app.user=${ada}`, `true  ${ada} app.user=${ada}`]);

  u.on('GET /v1/sessions', (_req, res) => answer(res, 400, '{"error":{"code":"bad_request","message":"no"}}'));
  assert.equal((await call(relay, ada, 'GET', '/v1/changes')).status, 400);
  u.on('GET /v1/sessions', (_req, res) => answer(res, 200, '{"items":'));
  assert.equal((await call(relay, ada, 'GET', '/v1/changes')).status, 502);
});

test('a last line of changes without its newline is kept', () => {
  const seen = new Set<string>();
  const line = `{"seq":1,"sessionId":"a","session":{"owner":"${ada}"}}`;
  assert.equal(keptChange({ owner: ada }, seen, line), line);
  assert.equal(keptChange({ owner: ada }, seen, '{"seq":2}'), undefined);
});

// ----------------------------------------------------------------- sign-in

function signInRelay(u: Upstream, finished: string[] = []): Relay {
  return relayOf(u, {
    signIn: {
      provider(_req, p) {
        if (p.email === 'nobody@example.com') throw new RelayError(403, 'forbidden', 'no provider for you');
        return `claude-${p.email.split('@')[0]}`;
      },
      start(req, _p, signIn) {
        signIn.type ??= 'anthropic';
        if (new URL(req.url).searchParams.get('refuse')) throw new RelayError(409, 'conflict', 'not now');
      },
      finished(req, p, provider) {
        if (new URL(req.url).searchParams.get('fail')) throw new Error('sharing failed');
        finished.push(`${p.email} ${provider}`);
      },
    },
  });
}

test('providers are the caller’s own', async (t) => {
  const u = await upstream(t);
  u.on('GET /v1/providers', (_req, res) => answer(res, 200, '{"items":[{"name":"claude-ada","status":"ok"},{"name":"claude-grace"},{"name":"shared"}]}'));
  const relay = signInRelay(u);
  const got = await call(relay, ada, 'GET', '/v1/providers');
  assert.equal(got.status, 200);
  assert.deepEqual(JSON.parse(got.body), { items: [{ name: 'claude-ada', status: 'ok' }] });
  assert.equal((await call(relay, 'nobody@example.com', 'GET', '/v1/providers')).status, 403);
  u.on('GET /v1/providers', (_req, res) => answer(res, 404, '{"error":{"code":"not_found","message":"x"}}'));
  assert.equal((await call(relay, ada, 'GET', '/v1/providers')).status, 404);
});

test('a sign-in is the caller’s own', async (t) => {
  const u = await upstream(t);
  u.on('POST /v1/providers/claude-ada/signin', (_req, res) => answer(res, 200, '{"flowId":"f1","authorizationUrl":"https://claude.example/auth"}'));
  u.on('POST /v1/providers/claude-ada/signin/f1', (_req, res) => answer(res, 200, '{"name":"claude-ada","status":"ok"}'));
  u.on('POST /v1/providers/claude-ada/signin/f2', (_req, res) => answer(res, 400, '{"error":{"code":"provider_error","message":"wrong code"}}'));
  const finished: string[] = [];
  const relay = signInRelay(u, finished);

  let got = await call(relay, ada, 'POST', '/v1/providers/claude-ada/signin', '{"method":"code","title":"Mine"}');
  assert.equal(got.status, 200, got.body);
  assert.match(got.body, /"flowId":"f1"/);
  assert.deepEqual(JSON.parse(u.last('POST', '/v1/providers/claude-ada/signin')!.body), { method: 'code', title: 'Mine', type: 'anthropic', owner: ada });
  got = await call(relay, ada, 'POST', '/v1/providers/claude-ada/signin/f1', '{"code":"abc"}');
  assert.equal(got.status, 200);
  assert.match(got.body, /"status":"ok"/);
  assert.deepEqual(finished, [`${ada} claude-ada`]);
  assert.deepEqual(JSON.parse(u.last('POST', '/v1/providers/claude-ada/signin/f1')!.body), { code: 'abc' });

  for (const [path, body, status] of [
    ['/v1/providers/claude-grace/signin', '{}', 404],
    ['/v1/providers/claude-grace/signin/f1', '{"code":"x"}', 404],
    ['/v1/providers/claude-ada/signin', `{"owner":"${grace}"}`, 400],
    ['/v1/providers/claude-ada/signin?refuse=1', '{}', 409],
    ['/v1/providers/claude-ada/signin/f1', '{"code":"x","owner":"y"}', 400],
    ['/v1/providers/claude-ada/signin/f1?fail=1', '{"code":"x"}', 500],
    ['/v1/providers/claude-ada/signin/f2', '{"code":"x"}', 400],
  ] as const) {
    assert.equal((await call(relay, ada, 'POST', path, body)).status, status, `${path} ${body}`);
  }
  assert.equal(finished.length, 1);
  assert.equal((await call(relay, 'nobody@example.com', 'POST', '/v1/providers/claude-nobody/signin', '{}')).status, 403);
});

test('a sign-in finished without a hook is relayed', async (t) => {
  const u = await upstream(t);
  u.on('POST /v1/providers/p/signin/f1', (_req, res) => answer(res, 200, '{"name":"p"}'));
  const relay = relayOf(u, { signIn: { provider: () => 'p' } });
  const got = await call(relay, ada, 'POST', '/v1/providers/p/signin/f1', '{"code":"x"}');
  assert.equal(got.status, 200);
  assert.equal(got.body, '{"name":"p"}');
  assert.equal((await call(relay, ada, 'POST', '/v1/providers/p/signin', '{"type":"anthropic"}')).status, 200);
});

// ---------------------------------------------------------------- node:http

/** A node:http server of handler, closed when the test ends. */
async function nodeServer(t: TestContext, handler: (req: IncomingMessage, res: ServerResponse) => void): Promise<string> {
  const server = createServer(handler);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
}

test('as a node:http handler, a request is relayed with its body and its headers', async (t) => {
  const u = await upstream(t);
  u.session('s1', ada);
  const relay = relayOf(u);
  const url = await nodeServer(t, (req, res) => void toNodeHandler(relay)(req, res));
  const res = await fetch(`${url}/agents/v1/sessions/s1/turns`, {
    method: 'POST',
    headers: { 'X-Test-Person': ada, 'Content-Type': 'application/json' },
    body: '{"text":"hi","turnId":"t1"}',
  });
  assert.equal(res.status, 200);
  assert.equal(await res.text(), '{"ok":true}');
  assert.deepEqual(JSON.parse(u.last('POST', '/v1/sessions/s1/turns')!.body), { turnId: 't1', text: 'hi' });
  const big = await fetch(`${url}/agents/v1/sessions/s1/turns`, {
    method: 'POST',
    headers: { 'X-Test-Person': ada },
    body: `{"text":"${'x'.repeat(1 << 21)}"}`,
  });
  assert.equal(big.status, 400);
  await big.text();
});

test('as a node:http handler, Express’s original URL is matched against the prefix', async (t) => {
  const u = await upstream(t);
  u.on('GET /v1/sessions', (_req, res) => answer(res, 200, '{"items":[]}'));
  const relay = relayOf(u);
  const url = await nodeServer(t, (req, res) => {
    // As Express mounts it: url without the mount path, originalUrl with it.
    const mounted = Object.assign(req, { originalUrl: req.url, url: req.url!.replace(/^\/agents/, '') });
    void toNodeHandler(relay)(mounted, res);
  });
  const res = await fetch(`${url}/agents/v1/sessions`, { headers: { 'X-Test-Person': ada } });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { items: [] });
});

test('as a node:http handler, a transcript is relayed as it is written, and left upstream once left', async (t) => {
  const u = await upstream(t);
  u.session('s1', ada);
  const gone = deferred<void>();
  u.on('GET /v1/sessions/s1/events', (req, res) => {
    startStream(res);
    res.write('{"line":"event","seq":1}\n');
    req.socket.once('close', () => gone.resolve());
  });
  const relay = relayOf(u);
  const url = await nodeServer(t, (req, res) => void toNodeHandler(relay)(req, res));
  const aborted = new AbortController();
  const res = await fetch(`${url}/agents/v1/sessions/s1/events?follow=true`, { headers: { 'X-Test-Person': ada }, signal: aborted.signal });
  assert.equal(res.headers.get('content-type'), 'application/x-ndjson');
  const reader = res.body!.getReader();
  assert.equal(new TextDecoder().decode((await reader.read()).value), '{"line":"event","seq":1}\n');
  aborted.abort();
  await reader.cancel().catch(() => undefined);
  await gone.promise;
});
