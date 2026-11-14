import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  APIError,
  Configuration,
  ErrorCode,
  FetchError,
  LineError,
  ResponseError,
  Stream,
  eventsLineValue,
  readChanges,
  readEvents,
} from '../src/index.js';
import type { EventsLine } from '../src/index.js';
import { answer, serveByHand, startStream } from './stub.js';

const event1 = '{"line":"event","seq":1,"at":"2026-01-02T03:04:05Z","event":{"type":"text","text":"hi"}}';
const event2 = '{"line":"event","seq":2,"at":"2026-01-02T03:04:06Z","event":{"type":"text","text":"there"}}';
const partial = '{"line":"partial","partial":{"seq":3,"kind":"text","offset":0,"text":"he"}}';
const caughtUp = '{"line":"caughtUp","caughtUp":{"seq":2}}';

function seqs(lines: EventsLine[]): number[] {
  return lines.map((l) => (l.line === 'event' ? l.seq : l.line === 'partial' ? -l.partial.seq : 0));
}

async function all<T>(stream: Stream<T>): Promise<T[]> {
  const got: T[] = [];
  for await (const v of stream) {
    got.push(v);
  }
  return got;
}

/** A Configuration whose fetch answers 200 with a body of exactly chunks, one read each. */
function chunked(chunks: Uint8Array[]): Configuration {
  return new Configuration({
    basePath: 'http://stub.invalid',
    fetchApi: async () => {
      let i = 0;
      const body = new ReadableStream<Uint8Array>({
        pull(controller) {
          const chunk = chunks[i++];
          if (chunk === undefined) {
            controller.close();
          } else {
            controller.enqueue(chunk);
          }
        },
      });
      return new Response(body, { status: 200 });
    },
  });
}

test('a followed stream is read line by line, before it ends', async (t) => {
  const server = await serveByHand(t);
  const opening = readEvents(new Configuration({ basePath: server.url }), { sessionId: 's 1', from: 3, follow: true });
  const ex = await server.next();
  assert.equal(ex.req.method, 'GET');
  assert.equal(ex.req.url, '/v1/sessions/s%201/events?from=3&follow=true');
  startStream(ex.res);
  const stream = await opening;

  ex.res.write(event1 + '\n');
  assert.deepEqual(await stream.next(), { done: false, value: eventsLineValue(JSON.parse(event1)) });
  ex.res.write(caughtUp + '\n' + partial + '\n');
  const second = await stream.next();
  assert.equal(second.done, false);
  assert.equal(second.value?.line, 'caughtUp');
  const third = await stream.next();
  assert.equal(third.value?.line, 'partial');
  ex.res.end(event2 + '\n');
  assert.deepEqual(seqs(await all(stream)), [2]);
  assert.deepEqual(await stream.next(), { done: true, value: undefined });
});

test("the Configuration's key, headers and middleware are the stream's", async (t) => {
  const server = await serveByHand(t);
  const configuration = new Configuration({
    basePath: server.url,
    accessToken: 'ryak_a_b',
    headers: { 'X-Acme-App': 'acme-app' },
    middleware: [
      {
        async pre(context) {
          return { url: context.url, init: { ...context.init, headers: { ...context.init.headers, 'X-Pre': 'yes' } } };
        },
      },
    ],
  });
  const opening = readChanges(configuration);
  const ex = await server.next();
  assert.equal(ex.req.url, '/v1/changes');
  assert.equal(ex.req.headers['authorization'], 'Bearer ryak_a_b');
  assert.equal(ex.req.headers['x-acme-app'], 'acme-app');
  assert.equal(ex.req.headers['x-pre'], 'yes');
  answer(ex.res, 200, '', 'application/x-ndjson');
  assert.deepEqual(await all(await opening), []);

  // A key that is a function is asked for on each request.
  let asked = 0;
  const each = new Configuration({ basePath: server.url, accessToken: async () => `ryak_${++asked}` });
  for (const want of ['Bearer ryak_2', 'Bearer ryak_4']) {
    const opening = readEvents(each, { sessionId: 's1' });
    const ex = await server.next();
    // Both of the contract's schemes, apiKey and platform, are bearer
    // tokens, and the generated code asks for each: the second is sent.
    assert.equal(ex.req.headers['authorization'], want);
    answer(ex.res, 200, '');
    await (await opening).close();
  }
});

test('changes are decoded as Changes', async (t) => {
  const server = await serveByHand(t);
  const opening = readChanges(new Configuration({ basePath: server.url }), { from: 7, follow: false });
  const ex = await server.next();
  assert.equal(ex.req.url, '/v1/changes?from=7&follow=false');
  answer(
    ex.res,
    200,
    '{"seq":7,"at":"2026-01-02T03:04:05Z","op":"deleted","sessionId":"s1"}\n',
    'application/x-ndjson',
  );
  const got = await all(await opening);
  assert.equal(got.length, 1);
  assert.equal(got[0]?.seq, 7);
  assert.equal(got[0]?.op, 'deleted');
  assert.deepEqual(got[0]?.at, new Date('2026-01-02T03:04:05Z'));
});

test('blank lines are skipped, wherever they are', async (t) => {
  const server = await serveByHand(t);
  const opening = readEvents(new Configuration({ basePath: server.url }), { sessionId: 's1', follow: true });
  const ex = await server.next();
  startStream(ex.res);
  const stream = await opening;
  // The server's keep-alive is a blank line at once and every 15 seconds.
  ex.res.write('\n');
  ex.res.write('\n\n   \n\t\r\n' + event1 + '\r\n\n');
  ex.res.end('\n' + event2 + '\n\n  ');
  assert.deepEqual(seqs(await all(stream)), [1, 2]);
});

test('a stream of only blank lines, or of nothing, ends with no line', async (t) => {
  const server = await serveByHand(t);
  for (const body of ['', '\n', '\n\n \r\n', ' ']) {
    const opening = readEvents(new Configuration({ basePath: server.url }), { sessionId: 's1' });
    answer((await server.next()).res, 200, body);
    assert.deepEqual(await all(await opening), [], JSON.stringify(body));
  }
  // A body of none at all, which a fetch of the caller's may answer.
  const none = new Configuration({ fetchApi: async () => new Response(null, { status: 200 }) });
  assert.deepEqual(await all(await readEvents(none, { sessionId: 's1' })), []);
});

test('a line split across chunks is one line, a character split across them one character', async () => {
  const text = 'é€😀 ok';
  const line = `{"seq":1,"at":"2026-01-02T03:04:05Z","event":{"type":"text","text":"${text}"}}\r\n`;
  const bytes = new TextEncoder().encode(line + partial);
  // Every way of cutting the body in two, then the body a byte at a time:
  // each cut through é (2 bytes), € (3) and 😀 (4) is among them.
  const cuts: Uint8Array[][] = [];
  for (let i = 1; i < bytes.length; i++) {
    cuts.push([bytes.subarray(0, i), bytes.subarray(i)]);
  }
  cuts.push(Array.from(bytes, (b) => Uint8Array.of(b)));
  for (const chunks of cuts) {
    const got = await all(await readEvents(chunked(chunks), { sessionId: 's1' }));
    assert.equal(got.length, 2, `cut at ${chunks[0]?.length}`);
    const first = got[0];
    assert.equal(first?.line, 'event');
    if (first?.line === 'event' && first.event.type === 'text') {
      assert.equal(first.event.text, text);
    } else {
      assert.fail(`cut at ${chunks[0]?.length}: ${JSON.stringify(first)}`);
    }
    assert.equal(got[1]?.line, 'partial');
  }
});

test('a line split across writes is one line, over a socket too', async (t) => {
  const server = await serveByHand(t);
  const opening = readEvents(new Configuration({ basePath: server.url }), { sessionId: 's1', follow: true });
  const ex = await server.next();
  startStream(ex.res);
  const stream = await opening;
  const bytes = Buffer.from(event1.replace('"hi"', '"h😀i"') + '\n');
  const at = bytes.indexOf(Buffer.from('😀')) + 2;
  ex.res.write(bytes.subarray(0, at));
  const next = stream.next();
  ex.res.write(bytes.subarray(at));
  const got = await next;
  assert.ok(!got.done && got.value.line === 'event' && got.value.event.type === 'text');
  assert.equal(got.value.event.text, 'h😀i');
  ex.res.end();
  assert.deepEqual(await stream.next(), { done: true, value: undefined });
});

test('a last line without a newline is read', async (t) => {
  const server = await serveByHand(t);
  const opening = readEvents(new Configuration({ basePath: server.url }), { sessionId: 's1' });
  answer((await server.next()).res, 200, event1 + '\n' + event2);
  assert.deepEqual(seqs(await all(await opening)), [1, 2]);

  const split = new TextEncoder().encode(event1 + '\n' + caughtUp);
  const got = await all(await readEvents(chunked([split.subarray(0, split.length - 3), split.subarray(split.length - 3)]), { sessionId: 's1' }));
  assert.deepEqual(got.map((l) => l.line), ['event', 'caughtUp']);
});

test('many lines in one chunk are each read, in order', async (t) => {
  const server = await serveByHand(t);
  const opening = readEvents(new Configuration({ basePath: server.url }), { sessionId: 's1' });
  const lines = Array.from({ length: 5000 }, (_, i) => event1.replace('"seq":1', `"seq":${i}`));
  answer((await server.next()).res, 200, lines.join('\n') + '\n');
  assert.deepEqual(seqs(await all(await opening)), lines.map((_, i) => i));
});

test('a malformed line is a LineError, and closes the stream', async (t) => {
  for (const [bad, why] of [
    ['{"seq":', 'JSON'],
    ['not json', 'JSON'],
    ['[1,2]', 'not a JSON object'],
    ['42', 'not a JSON object'],
    ['null', 'not a JSON object'],
    ['"event"', 'not a JSON object'],
    ['{"seq":5,"at":"2026-01-02T03:04:05Z"}', 'no kind'],
    ['{"line":"later","seq":5,"at":"2026-01-02T03:04:05Z","event":{}}', 'no kind'],
    ['{"line":"event","seq":"5","at":"2026-01-02T03:04:05Z","event":{}}', 'shape of its kind, event'],
  ] as const) {
    const server = await serveByHand(t);
    const opening = readEvents(new Configuration({ basePath: server.url }), { sessionId: 's1', follow: true });
    const ex = await server.next();
    startStream(ex.res);
    const stream = await opening;
    ex.res.write(event1 + '\n' + bad + '\n' + event2 + '\n');
    assert.deepEqual(seqs([(await stream.next()).value as EventsLine]), [1]);
    await assert.rejects(stream.next(), (err: unknown) => {
      assert.ok(err instanceof LineError, `${bad}: ${String(err)}`);
      assert.match(err.message, new RegExp(`^runyard-agents: a line of the stream: .*${why}`));
      assert.equal(err.line, bad);
      return true;
    });
    // The server is hung up on: a followed stream nobody reads is not left open.
    await ex.closed;
    assert.deepEqual(await stream.next(), { done: true, value: undefined });
  }
});

test('a body that fails partway rejects, and the stream is done', async (t) => {
  const server = await serveByHand(t);
  const opening = readEvents(new Configuration({ basePath: server.url }), { sessionId: 's1', follow: true });
  const ex = await server.next();
  startStream(ex.res);
  const stream = await opening;
  ex.res.write(event1 + '\n{"seq":2,');
  assert.equal((await stream.next()).done, false);
  const next = stream.next();
  ex.res.destroy();
  await assert.rejects(next, TypeError);
  assert.deepEqual(await stream.next(), { done: true, value: undefined });
  // A body that failed has nothing for close to cancel.
  await stream.close();
});

test('breaking out of the loop hangs up', async (t) => {
  const server = await serveByHand(t);
  const opening = readEvents(new Configuration({ basePath: server.url }), { sessionId: 's1', follow: true });
  const ex = await server.next();
  startStream(ex.res);
  const stream = await opening;
  ex.res.write(event1 + '\n' + event2 + '\n');
  for await (const line of stream) {
    assert.equal(line.line, 'event');
    break;
  }
  await ex.closed;
  // What was read and not taken is not handed out after the stream was left.
  assert.deepEqual(await stream.next(), { done: true, value: undefined });
});

test('a throw inside the loop hangs up too', async (t) => {
  const server = await serveByHand(t);
  const opening = readChanges(new Configuration({ basePath: server.url }), { follow: true });
  const ex = await server.next();
  startStream(ex.res);
  const stream = await opening;
  ex.res.write('{"seq":1,"at":"2026-01-02T03:04:05Z","op":"created","sessionId":"s1"}\n');
  await assert.rejects(async () => {
    for await (const change of stream) {
      throw new Error(`stop at ${change.seq}`);
    }
  }, /stop at 1/);
  await ex.closed;
});

test('closing while a line is awaited ends the wait, and closing again does nothing', async (t) => {
  const server = await serveByHand(t);
  const opening = readEvents(new Configuration({ basePath: server.url }), { sessionId: 's1', follow: true });
  const ex = await server.next();
  startStream(ex.res);
  const stream = await opening;
  const waiting = stream.next();
  await stream.close();
  assert.deepEqual(await waiting, { done: true, value: undefined });
  await ex.closed;
  await stream.close();
  assert.deepEqual(await stream.return(), { done: true, value: undefined });
  assert.deepEqual(await stream.next(), { done: true, value: undefined });
});

test('an aborted signal ends the stream, waiting or not', async (t) => {
  const server = await serveByHand(t);
  const abort = new AbortController();
  const opening = readEvents(new Configuration({ basePath: server.url }), { sessionId: 's1', follow: true }, { signal: abort.signal });
  const ex = await server.next();
  startStream(ex.res);
  const stream = await opening;
  ex.res.write(event1 + '\n');
  assert.equal((await stream.next()).done, false);
  const waiting = stream.next();
  abort.abort();
  await assert.rejects(waiting, { name: 'AbortError' });
  await ex.closed;
  assert.deepEqual(await stream.next(), { done: true, value: undefined });

  // Aborted before the answer, it is the generated client's FetchError.
  const early = new AbortController();
  const refused = readEvents(new Configuration({ basePath: server.url }), { sessionId: 's1' }, { signal: early.signal });
  const pending = await server.next();
  early.abort();
  await assert.rejects(refused, (err: unknown) => err instanceof FetchError && err.cause.name === 'AbortError');
  await pending.closed;
});

test('lines asked for at once are handed out in order', async (t) => {
  const server = await serveByHand(t);
  const opening = readEvents(new Configuration({ basePath: server.url }), { sessionId: 's1', follow: true });
  const ex = await server.next();
  startStream(ex.res);
  const stream = await opening;
  const asked = [stream.next(), stream.next(), stream.next()];
  ex.res.write(event1 + '\n');
  ex.res.end(event2 + '\n');
  const got = await Promise.all(asked);
  assert.deepEqual(
    got.map((r) => (r.done ? 'done' : r.value.line === 'event' ? r.value.seq : r.value.line)),
    [1, 2, 'done'],
  );

  // A line in two chunks, asked for twice at once: the second ask must not
  // take the second chunk and finish the first ask's line before it does.
  const bytes = new TextEncoder().encode(event1 + '\n' + event2 + '\n');
  const at = event1.length / 2;
  const split = await readEvents(chunked([bytes.subarray(0, at), bytes.subarray(at)]), { sessionId: 's1' });
  const both = await Promise.all([split.next(), split.next(), split.next()]);
  assert.deepEqual(
    both.map((r) => (r.done ? 'done' : r.value.line === 'event' ? r.value.seq : r.value.line)),
    [1, 2, 'done'],
  );
});

test("an answer other than 200 is an APIError with the server's error", async (t) => {
  const server = await serveByHand(t);
  const configuration = new Configuration({ basePath: server.url });
  const cases: { status: number; body: string; code?: ErrorCode; errorMessage?: string; message: string }[] = [
    {
      status: 404,
      body: '{"error":{"code":"not_found","message":"no session s1"}}',
      code: ErrorCode.NotFound,
      errorMessage: 'no session s1',
      message: 'runyard-agents: 404 not_found: no session s1',
    },
    {
      status: 409,
      body: '{"error":{"code":"gapped","message":"events before 9 are no longer kept"}}',
      code: ErrorCode.Gapped,
      errorMessage: 'events before 9 are no longer kept',
      message: 'runyard-agents: 409 gapped: events before 9 are no longer kept',
    },
    // What is not one of the server's errors — a proxy's page, nothing, a
    // body of another shape — is an error still, with its body.
    { status: 502, body: '<html>bad gateway</html>', message: 'runyard-agents: 502 Bad Gateway' },
    { status: 500, body: '', message: 'runyard-agents: 500 Internal Server Error' },
    { status: 401, body: '{"error":"x"}', message: 'runyard-agents: 401 Unauthorized' },
    // A success that is not a stream is not taken for an empty one.
    { status: 202, body: '{"seq":1}\n', message: 'runyard-agents: 202 Accepted' },
    { status: 204, body: '', message: 'runyard-agents: 204 No Content' },
  ];
  for (const c of cases) {
    for (const open of [
      () => readEvents(configuration, { sessionId: 's1' }),
      () => readChanges(configuration, { follow: true }),
    ]) {
      const opening = open();
      answer((await server.next()).res, c.status, c.body);
      await assert.rejects(opening, (err: unknown) => {
        assert.ok(err instanceof APIError, String(err));
        assert.ok(err instanceof ResponseError);
        assert.equal(err.status, c.status);
        assert.equal(err.response.status, c.status);
        assert.equal(err.code, c.code);
        assert.equal(err.errorMessage, c.errorMessage);
        assert.equal(err.body, c.body);
        assert.equal(err.message, c.message);
        return true;
      });
    }
  }
});

test('a request the generated client refuses is its error', async () => {
  const configuration = new Configuration({
    fetchApi: async () => assert.fail('nothing is sent'),
  });
  await assert.rejects(
    readEvents(configuration, { sessionId: undefined as unknown as string }),
    { name: 'RequiredError' },
  );
});

test('an events line is the kind its line field says', () => {
  const event = eventsLineValue(JSON.parse(event1));
  assert.ok(event.line === 'event');
  assert.equal(event.seq, 1);
  assert.deepEqual(event.at, new Date('2026-01-02T03:04:05Z'));
  assert.deepEqual(event.event, { type: 'text', text: 'hi', parentToolId: undefined });

  const p = eventsLineValue(JSON.parse(partial));
  assert.ok(p.line === 'partial');
  assert.deepEqual(p.partial, { seq: 3, kind: 'text', offset: 0, text: 'he', parentToolId: undefined });

  const c = eventsLineValue(JSON.parse(caughtUp));
  assert.deepEqual(c, { line: 'caughtUp', caughtUp: { seq: 2 } });

  // What the line says it is, it is, whatever else it carries.
  const said = eventsLineValue({
    line: 'event',
    partial: { seq: 3, kind: 'text', offset: 0, text: 'x' },
    caughtUp: { seq: 1 },
    seq: 7,
    at: '2026-01-02T03:04:05Z',
    event: { type: 'text', text: 'x' },
  });
  assert.ok(said.line === 'event');
  assert.equal(said.seq, 7);
  const up = eventsLineValue({ line: 'caughtUp', caughtUp: { seq: 9 }, event: {}, partial: {} });
  assert.ok(up.line === 'caughtUp');
  assert.equal(up.caughtUp.seq, 9);
  // A field the API adds to a kind later is no matter.
  assert.equal(eventsLineValue({ ...JSON.parse(event1), more: 1 }).line, 'event');
});

test('a line of no kind this SDK knows, or not in its shape, is a LineError', () => {
  const at = '2026-01-02T03:04:05Z';
  for (const [bad, why] of [
    // Of a kind it does not know, or none it can read: the generated
    // EventsLineFromJSON hands these back as they were.
    [{ line: 'later', seq: 1, at, event: {} }, /no kind/],
    [{ line: 5, partial: {} }, /no kind/],
    [{ line: '', event: {} }, /no kind/],
    [{ line: null, seq: 1, at, event: {} }, /no kind/],
    [{ line: 'Event', seq: 1, at, event: {} }, /no kind/],
    [{ line: 'toString', seq: 1, at, event: {} }, /no kind/],
    [{ line: ['event'], seq: 1, at, event: {} }, /no kind/],
    // Said to be a kind, and not in its shape.
    [{ line: 'event', seq: 'one', at, event: {} }, /shape of its kind, event$/],
    [{ line: 'event', seq: 1.5, at, event: {} }, /shape of its kind, event$/],
    [{ line: 'event', seq: 1, at: 'yesterday', event: {} }, /shape of its kind, event$/],
    [{ line: 'event', seq: 1, event: {} }, /shape of its kind, event$/],
    [{ line: 'event', seq: 1, at, event: 'text' }, /shape of its kind, event$/],
    [{ line: 'event', partial: { seq: 1, kind: 'text', offset: 0, text: 'x' } }, /shape of its kind, event$/],
    [{ line: 'caughtUp', caughtUp: { seq: 'one' } }, /shape of its kind, caughtUp$/],
    [{ line: 'caughtUp', seq: 1 }, /shape of its kind, caughtUp$/],
    [{ line: 'partial', partial: [1] }, /shape of its kind, partial$/],
    [{ line: 'partial', partial: { seq: 1, kind: 'text', offset: '0', text: 'x' } }, /shape of its kind, partial$/],
    [{ line: 'partial', partial: { seq: 1, kind: 'text', offset: 0 } }, /shape of its kind, partial$/],
    [{ line: 'partial', partial: null }, /shape of its kind, partial$/],
    // Without the line field, as a server of v0.37.0 or earlier writes them.
    [{ seq: 'one', at, event: {} }, /shape of its kind, event$/],
    [{ caughtUp: { seq: 'one' } }, /shape of its kind, caughtUp$/],
    [{ partial: [1] }, /shape of its kind, partial$/],
    [{ partial: null }, /shape of its kind, partial$/],
    [{}, /no kind/],
    [{ seq: 1, at }, /no kind/],
    [{ Partial: {} }, /no kind/],
  ] as const) {
    assert.throws(() => eventsLineValue(bad), (err: unknown) => {
      assert.ok(err instanceof LineError, JSON.stringify(bad));
      assert.match(err.message, why, JSON.stringify(bad));
      // The line as it was read, but for the kind found for a line without one.
      const { line: _found, ...read } = JSON.parse(err.line) as Record<string, unknown>;
      const { line: _said, ...want } = bad as Record<string, unknown>;
      assert.deepEqual(read, want);
      return true;
    });
  }
  // Inherited fields are not the line's own.
  assert.throws(() => eventsLineValue(Object.create({ line: 'caughtUp', caughtUp: { seq: 1 } })), LineError);
  for (const notObject of [null, undefined, 1, 'partial', [], [{ line: 'caughtUp', caughtUp: { seq: 1 } }], true]) {
    assert.throws(() => eventsLineValue(notObject), /not a JSON object/);
  }
});

test('a line without a line field, as a server of v0.37.0 or earlier writes it, is told apart by the field only its kind has', () => {
  const at = '2026-01-02T03:04:05Z';
  const cases: [unknown, EventsLine['line']][] = [
    [{ partial: { seq: 3, kind: 'thinking', offset: 4, text: 'x' }, seq: 7, at, event: {} }, 'partial'],
    [{ partial: { seq: 3, kind: 'thinking', offset: 4, text: 'x' }, caughtUp: { seq: 2 } }, 'partial'],
    [{ caughtUp: { seq: 2 }, seq: 1, at, event: {} }, 'caughtUp'],
    [{ seq: 1, at, event: { type: 'text', text: 'x' } }, 'event'],
  ];
  for (const [old, want] of cases) {
    assert.equal(eventsLineValue(old).line, want, JSON.stringify(old));
  }
  const event = eventsLineValue({ seq: 1, at, event: { type: 'state', state: 'idle', sandboxState: 'ready' } });
  assert.ok(event.line === 'event' && event.event.type === 'state');
  assert.equal(event.event.state, 'idle');
});

test('a stream of lines without a line field is read as before', async (t) => {
  const server = await serveByHand(t);
  const opening = readEvents(new Configuration({ basePath: server.url }), { sessionId: 's1' });
  const old = [event1, caughtUp, partial].map((l) => l.replace(/"line":"[a-zA-Z]+",/, ''));
  assert.ok(old.every((l) => !l.includes('"line"')));
  answer((await server.next()).res, 200, old.join('\n') + '\n');
  assert.deepEqual((await all(await opening)).map((l) => l.line), ['event', 'caughtUp', 'partial']);
});
