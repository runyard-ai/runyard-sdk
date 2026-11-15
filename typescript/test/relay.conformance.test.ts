// The relay against a server: the one RUNYARD_AGENTS_URL names, with the key
// RUNYARD_AGENTS_KEY (sessions.read, sessions.write, sessions.delete,
// sessions.person and users.admin), two people of the workspace it adds each
// reaching only their own sessions through it. The same suite as the Go
// relay's: runyard-agents' test/sdk runs each against a server of its own.
//
// What reads the relay is the SDK itself, over a socket: the relay is
// runyard-agents' API, under the same paths and in the same words.
//
//	RUNYARD_AGENTS_URL=… RUNYARD_AGENTS_KEY=… sh check.sh

import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';

import {
  AttachmentKindEnum,
  Configuration,
  ErrorCode,
  PeopleApi,
  Role,
  SessionState,
  SessionsApi,
  TurnsApi,
  errorCode,
  readChanges,
  readEvents,
} from '../src/index.js';
import { createRelay, toNodeHandler } from '../src/relay.js';

/** What promise threw: it is an error for it not to. */
async function failure(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (err) {
    return err;
  }
  return assert.fail('it succeeded');
}

test('relay conformance', async (t) => {
  const url = process.env['RUNYARD_AGENTS_URL'];
  const key = process.env['RUNYARD_AGENTS_KEY'];
  const prefix = process.env['RUNYARD_AGENTS_PREFIX'] || 'sdk-typescript';
  assert.ok(url && key, 'RUNYARD_AGENTS_URL and RUNYARD_AGENTS_KEY name the server, and a key of it');
  const admin = new Configuration({ basePath: url, accessToken: key });
  const grace = `${prefix}-grace@example.com`;
  const alan = `${prefix}-alan@example.com`;
  for (const email of [grace, alan]) {
    await new PeopleApi(admin).addUser({ userEmail: email, userUpdate: { role: Role.Member } });
  }

  const relay = createRelay({
    url,
    key,
    prefix: '/agents',
    person(req) {
      const email = req.headers.get('x-test-person');
      if (!email) throw new Error('not signed in');
      return { email };
    },
    scope: (_req, p) => ({ owner: p.email, labels: { 'conformance.user': p.email } }),
    // A session no provider is needed for, as the SDK's own suite starts.
    start(_req, _p, spec) {
      spec.terminal = true;
      spec.harness = 'codex';
    },
  });
  const handler = toNodeHandler(relay);
  const server = createServer((req, res) => void handler(req, res));
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
  const relayUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}/agents`;
  const as = (email: string) => new Configuration({ basePath: relayUrl, headers: { 'X-Test-Person': email } });
  const asGrace = as(grace);
  const asAlan = as(alan);

  // Started through the relay: Grace's, labelled hers, whatever she says.
  const made = await new SessionsApi(asGrace).startSession({ sessionSpec: { title: "Grace's" } });
  assert.equal(made.owner.toLowerCase(), grace);
  assert.equal(made.labels['conformance.user'], grace);
  assert.equal(made.title, "Grace's");
  const id = made.id;
  const forged = await failure(new SessionsApi(asGrace).startSession({ sessionSpec: { owner: grace } }));
  assert.equal(await errorCode(forged), ErrorCode.BadRequest);

  // Hers to read, list and follow; nobody else's.
  assert.equal((await new SessionsApi(asGrace).getSession({ sessionId: id })).id, id);
  assert.ok((await new SessionsApi(asGrace).listSessions()).items.some((s) => s.id === id), 'not listed');
  assert.equal(await errorCode(await failure(new SessionsApi(asAlan).getSession({ sessionId: id }))), ErrorCode.NotFound);
  assert.equal(await errorCode(await failure(readEvents(asAlan, { sessionId: id }))), ErrorCode.NotFound);
  assert.ok(!(await new SessionsApi(asAlan).listSessions()).items.some((s) => s.id === id), "Alan's list has Grace's");
  assert.equal(await errorCode(await failure(new SessionsApi(asAlan).deleteSession({ sessionId: id }))), ErrorCode.NotFound);

  // Its transcript followed through the relay until it is idle, as it is
  // written.
  let idle = false;
  for await (const line of await readEvents(asGrace, { sessionId: id, follow: true })) {
    if (line.line === 'event' && line.event.type === 'state' && line.event.state === SessionState.Idle) {
      idle = true;
      break;
    }
  }
  assert.ok(idle, 'the stream ended before the session was idle');

  // Its changes: Grace's have hers, Alan's none of it.
  for (const [email, configuration] of [[grace, asGrace], [alan, asAlan]] as const) {
    const ids: string[] = [];
    for await (const change of await readChanges(configuration)) {
      ids.push(change.sessionId);
    }
    assert.equal(ids.includes(id), email === grace, `${email}'s changes: ${ids}`);
  }

  // A file she attaches is kept for her: hers to take off, not Alan's.
  const kept = await new TurnsApi(asGrace).createUpload({ name: 'notes.txt', body: new Blob(['hello']) });
  assert.equal(kept.size, 5);
  assert.equal(await errorCode(await failure(new TurnsApi(asAlan).deleteUpload({ uploadId: kept.id }))), ErrorCode.NotFound);
  // Nor is her session his to name in a turn of his own.
  const alansOwn = await new SessionsApi(asAlan).startSession({ sessionSpec: {} });
  const naming = new TurnsApi(asAlan).sendTurn({
    sessionId: alansOwn.id,
    turn: { turnId: 'naming-graces', text: 'read hers', attachments: [{ kind: AttachmentKindEnum.Session, sessionId: id }] },
  });
  assert.equal(await errorCode(await failure(naming)), ErrorCode.BadRequest);
  await new SessionsApi(asAlan).deleteSession({ sessionId: alansOwn.id });
  await new TurnsApi(asGrace).deleteUpload({ uploadId: kept.id });

  // Renamed, and deleted, by her.
  const renamed = await new SessionsApi(asGrace).updateSession({ sessionId: id, sessionUpdate: { title: 'Renamed' } });
  assert.equal(renamed.title, 'Renamed');
  await new SessionsApi(asGrace).deleteSession({ sessionId: id });
  assert.equal(await errorCode(await failure(new SessionsApi(admin).getSession({ sessionId: id }))), ErrorCode.NotFound);
});
