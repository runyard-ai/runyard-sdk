// ry against a server: the one RUNYARD_AGENTS_URL names, with the key
// RUNYARD_AGENTS_KEY (sessions.read, sessions.write, sessions.delete), its
// names made of RUNYARD_AGENTS_PREFIX. The same suite as the Go SDK's ry:
// runyard-agents' test/sdk runs each against a server of its own, whose
// harness says each turn back — "You said: " and its text — but a turn that
// starts with hold, which is under way until it is interrupted.
//
//	RUNYARD_AGENTS_URL=… RUNYARD_AGENTS_KEY=… npm run conformance

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { APIError, ErrorCode } from '../src/index.js';
import { Runyard, TurnGoneError } from '../src/ry.js';
import type { RunyardSession } from '../src/ry.js';
import { TurnsApi } from '../src/apis/index.js';

/** agentsserver's Hold: a turn its harness works on until it is interrupted. */
const hold = 'Hold until interrupted';

function server(): { ry: Runyard; url: string; prefix: string } {
  const url = process.env['RUNYARD_AGENTS_URL'];
  const key = process.env['RUNYARD_AGENTS_APP_KEY'];
  assert.ok(url && key, "RUNYARD_AGENTS_URL and RUNYARD_AGENTS_APP_KEY name the server, and an application's key of it");
  return { ry: new Runyard({ url, key }), url, prefix: process.env['RUNYARD_AGENTS_PREFIX'] || 'sdk-typescript' };
}

async function rejected(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (err) {
    return err;
  }
  return assert.fail('it succeeded');
}

test('ry: a session started, answered, talked to, listed and deleted', async () => {
  const { ry, prefix } = server();
  const labels = { conformance: `${prefix}-ry` };
  const s = await ry.start({ title: 'ry', text: 'Summarize ticket #42', labels });
  try {
    assert.equal(await s.reply(), 'You said: Summarize ticket #42');
    assert.equal(await s.send('Now draft a reply'), 'You said: Now draft a reply');
    // A backend's other request, after the turn ended: a handle of the id
    // alone reads the answer of the turn that ended last.
    assert.equal(await ry.session(s.id).lastReply(), 'You said: Now draft a reply');

    // A handle made of its id alone finds the same transcript.
    const users: string[] = [];
    let ended = 0;
    for await (const ev of ry.session(s.id).events()) {
      if (ev.type === 'user') users.push(ev.text);
      if (ev.type === 'turn_ended') {
        assert.equal(ev.stopReason, 'end_turn');
        if (++ended === 2) break;
      }
    }
    assert.deepEqual(users, ['Summarize ticket #42', 'Now draft a reply']);

    const listed = await ry.sessions({ labels });
    assert.deepEqual(
      listed.map((x) => [x.id, x.title]),
      [[s.id, 'ry']],
    );

    const missing = await rejected(ry.session(`${prefix}-nobodys`).send('hello'));
    assert.ok(missing instanceof APIError && missing.code === ErrorCode.NotFound, String(missing));
  } finally {
    await s.delete();
  }
  const gone = await rejected(s.info());
  assert.ok(gone instanceof APIError && gone.code === ErrorCode.NotFound, String(gone));
});

// It needs a server with session tokens and end users (docs/applications.md),
// and an application's key: until the server has them,
// POST /v1/sessions/{id}/tokens is 501 not_implemented and this fails there.
test('ry: a session for an end user, and a token for their browser', async () => {
  const { ry, url, prefix } = server();
  const user = { id: `${prefix}-u123`, email: `${prefix}-alice@acme.example` };
  const made: RunyardSession[] = [];
  try {
    const s = await ry.start({ text: 'Hello', endUser: user });
    made.push(s);
    // The handle that started it waits for its first turn: a handle made of
    // the id alone waits for the turn under way, or the next, and the first
    // may well be over by then.
    assert.equal(await s.reply(), 'You said: Hello');
    const other = await ry.start({ endUser: { id: `${prefix}-u456` } });
    made.push(other);

    const tok = await s.token({ endUser: user, ttlSeconds: 600 });
    assert.match(tok.token, /^ryst_/);
    assert.equal(tok.sessionId, s.id);
    assert.deepEqual(tok.endUser, user);
    assert.ok(tok.expiresAt.getTime() <= Date.now() + 11 * 60_000 && tok.expiresAt.getTime() > Date.now());
    const another = await rejected(s.token({ endUser: { id: `${prefix}-u456` } }));
    assert.ok(another instanceof APIError && another.code === ErrorCode.BadRequest, String(another));

    // The token is a browser's key to that one session.
    const browser = new Runyard({ url, key: tok.token });
    const mine = browser.session(s.id);
    assert.equal((await mine.info()).id, s.id);
    assert.equal(await mine.send('From the browser'), 'You said: From the browser');
    for await (const ev of mine.events()) {
      if (ev.type === 'user' && ev.text === 'From the browser') {
        assert.equal(ev.endUser?.id, user.id);
        break;
      }
    }
    await rejected(browser.session(other.id).info());
    await rejected(browser.start());
    await rejected(mine.token());
    assert.deepEqual(
      (await browser.sessions()).map((x) => x.id),
      [s.id],
    );

    // Listed by end user: theirs, and nobody else's.
    const listed = await ry.sessions({ endUser: user.id });
    assert.deepEqual(
      listed.map((x) => [x.id, x.endUser?.id]),
      [[s.id, user.id]],
    );
  } finally {
    for (const s of made) await s.delete().catch(() => undefined);
  }
});

// A turn sent behind one under way and taken out of the queue — cancelled
// from the page, or dropped by an interrupt that drops the queue — is a
// TurnGoneError to the send that waits for it, rather than a wait for ever.
for (const how of ['cancelled', 'dropped'] as const) {
  test(`ry: a turn ${how} from the queue is gone`, async () => {
    const { ry, url } = server();
    const turns = new TurnsApi(ry.configuration);
    const s = await ry.start({ text: hold });
    try {
      // Under way: what is sent now waits behind it.
      for await (const ev of s.events()) {
        if (ev.type === 'turn_started') break;
      }
      // The turn is taken out as send starts to wait for it: once it is
      // sent, and before send follows what becomes of it.
      let sent: string | undefined;
      let taken: Promise<unknown> | undefined;
      const waiting = new Runyard({
        url,
        key: process.env['RUNYARD_AGENTS_APP_KEY'] ?? '',
        fetch: async (input, init) => {
          const address = new URL(input instanceof Request ? input.url : String(input));
          if (init?.method === 'POST' && address.pathname.endsWith('/turns')) {
            sent = (JSON.parse(String(init.body)) as { turnId: string }).turnId;
          }
          if (address.pathname === '/v1/changes' && sent !== undefined && taken === undefined) {
            taken =
              how === 'cancelled'
                ? turns.cancelQueuedTurn({ sessionId: s.id, turnId: sent })
                : turns.interrupt({ sessionId: s.id, interruptRequest: { dropQueued: true } });
            await taken;
          }
          return fetch(input, init);
        },
      });
      const err = await rejected(waiting.session(s.id).send('Never started'));
      assert.ok(err instanceof TurnGoneError, String(err));
      assert.equal(err.turnId, sent);
    } finally {
      await s.delete();
    }
  });
}
