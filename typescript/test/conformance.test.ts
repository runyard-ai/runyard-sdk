// The SDK against a server: the one RUNYARD_AGENTS_URL names, with the key
// RUNYARD_AGENTS_KEY (sessions.read, sessions.write, sessions.delete and
// sandbox), making a session named for RUNYARD_AGENTS_PREFIX and deleting it.
// The same suite as every other language's SDK has: runyard-agents' test/sdk
// runs each against a server of its own.
//
//	RUNYARD_AGENTS_URL=… RUNYARD_AGENTS_KEY=… npm run conformance

import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  Configuration,
  ErrorCode,
  MetaApi,
  SessionState,
  SessionsApi,
  apiError,
  errorCode,
  readEvents,
} from '../src/index.js';

/** What promise threw: it is an error for it not to. */
async function failure(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (err) {
    return err;
  }
  return assert.fail('it succeeded');
}

test('conformance', async () => {
  const url = process.env['RUNYARD_AGENTS_URL'];
  const key = process.env['RUNYARD_AGENTS_KEY'];
  const prefix = process.env['RUNYARD_AGENTS_PREFIX'] || 'sdk-typescript';
  assert.ok(url && key, 'RUNYARD_AGENTS_URL and RUNYARD_AGENTS_KEY name the server, and a key of it');
  const configuration = new Configuration({ basePath: url, accessToken: key });
  const sessions = new SessionsApi(configuration);

  // Who the key is.
  const self = await new MetaApi(configuration).getSelf();
  const owner = process.env['RUNYARD_AGENTS_OWNER'];
  if (owner) {
    assert.equal(self.email, owner, 'self');
  }

  // A session made, read back and listed.
  const id = `${prefix}-session`;
  const made = await sessions.createSessionRaw({ sessionId: id, sessionSpec: { terminal: true, harness: 'codex' } });
  assert.equal(made.raw.status, 201);
  assert.equal((await made.value()).id, id);
  assert.equal((await sessions.getSession({ sessionId: id })).id, id);
  const listed = await sessions.listSessions();
  assert.ok(listed.items.some((s) => s.id === id), `${id} is not listed`);

  // Its events followed until it is idle: the stream read as it is written.
  const seen: number[] = [];
  let idle = false;
  for await (const line of await readEvents(configuration, { sessionId: id, follow: true })) {
    if (line.line !== 'event') {
      continue;
    }
    seen.push(line.seq);
    const event = line.event;
    if (event.type === 'state' && event.state === SessionState.Idle) {
      idle = true;
      break;
    }
  }
  assert.ok(idle, 'the stream ended before the session was idle');

  // Not followed, the transcript so far, and then its end.
  const kept: number[] = [];
  for await (const line of await readEvents(configuration, { sessionId: id })) {
    assert.equal(line.line, 'event', 'a stream not followed has a line of another kind');
    if (line.line === 'event') {
      kept.push(line.seq);
    }
  }
  assert.ok(kept.length >= seen.length, `kept ${kept}, followed ${seen}`);
  assert.deepEqual(kept.slice(0, seen.length), seen, `kept ${kept}, followed ${seen}`);
  assert.deepEqual(kept, [...kept].sort((a, b) => a - b), `kept ${kept}`);

  // What the server refuses is an error with its code.
  const missing = await failure(sessions.getSession({ sessionId: `${prefix}-nobodys` }));
  assert.equal(await errorCode(missing), ErrorCode.NotFound, String(await apiError(missing)));
  const stream = await failure(readEvents(configuration, { sessionId: `${prefix}-nobodys` }));
  assert.equal(await errorCode(stream), ErrorCode.NotFound, String(stream));

  // Deleted, it is not there.
  const gone = await sessions.deleteSessionRaw({ sessionId: id });
  assert.ok(gone.raw.ok, `delete: ${gone.raw.status}`);
  const after = await failure(sessions.getSession({ sessionId: id }));
  assert.equal(await errorCode(after), ErrorCode.NotFound, `a session deleted: ${String(await apiError(after))}`);
});
