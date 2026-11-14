import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  APIError,
  Configuration,
  ErrorCode,
  FetchError,
  RequiredError,
  ResponseError,
  SessionsApi,
  apiError,
  errorCode,
} from '../src/index.js';
import { answer, serve } from './stub.js';

/** What a generated call throws when the server answers status with body. */
async function thrown(t: Parameters<typeof serve>[0], status: number, body: string): Promise<unknown> {
  const { url } = await serve(t, ({ res }) => answer(res, status, body));
  try {
    await new SessionsApi(new Configuration({ basePath: url })).getSession({ sessionId: 's1' });
  } catch (err) {
    return err;
  }
  return assert.fail('the call succeeded');
}

test("a generated call's error is read for the server's", async (t) => {
  const err = await thrown(t, 404, '{"error":{"code":"not_found","message":"no session s1"}}');
  assert.ok(err instanceof ResponseError);
  assert.equal(await errorCode(err), ErrorCode.NotFound);
  const e = await apiError(err);
  assert.ok(e instanceof APIError);
  assert.ok(e instanceof ResponseError);
  assert.equal(e.status, 404);
  assert.equal(e.code, 'not_found');
  assert.equal(e.errorMessage, 'no session s1');
  assert.equal(e.body, '{"error":{"code":"not_found","message":"no session s1"}}');
  assert.equal(e.message, 'runyard-agents: 404 not_found: no session s1');
  assert.equal(e.response, err.response);
  // Asked again, and at once, it is the same answer: a body is read once.
  assert.equal(await apiError(err), e);
  const [a, b] = await Promise.all([apiError(err), errorCode(err)]);
  assert.equal(a, e);
  assert.equal(b, ErrorCode.NotFound);
  // An APIError is itself.
  assert.equal(await apiError(e), e);
  assert.equal(await errorCode(e), ErrorCode.NotFound);
});

test("what is not one of the server's errors has no code, and its body", async (t) => {
  for (const [status, body, message] of [
    [502, '<html>bad gateway</html>', 'runyard-agents: 502 Bad Gateway'],
    [500, '', 'runyard-agents: 500 Internal Server Error'],
    [400, 'not json', 'runyard-agents: 400 Bad Request'],
    [400, '{"error":"x"}', 'runyard-agents: 400 Bad Request'],
    [400, '{"error":null}', 'runyard-agents: 400 Bad Request'],
    [400, '{"error":[]}', 'runyard-agents: 400 Bad Request'],
    [400, '[{"error":{"code":"conflict"}}]', 'runyard-agents: 400 Bad Request'],
    [400, '{}', 'runyard-agents: 400 Bad Request'],
    [400, '{"error":{"code":""}}', 'runyard-agents: 400 Bad Request'],
    [400, '{"error":{"code":5,"message":"m"}}', 'runyard-agents: 400 Bad Request'],
  ] as const) {
    const e = await apiError(await thrown(t, status, body));
    assert.ok(e instanceof APIError, body);
    assert.equal(e.status, status);
    assert.equal(e.code, undefined, body);
    assert.equal(e.errorMessage, undefined, body);
    assert.equal(e.body, body);
    assert.equal(e.message, message);
  }
});

test('a code without a message, or with one of another type, is still the code', async (t) => {
  for (const body of ['{"error":{"code":"conflict"}}', '{"error":{"code":"conflict","message":7}}']) {
    const e = await apiError(await thrown(t, 409, body));
    assert.equal(e?.code, ErrorCode.Conflict);
    assert.equal(e?.errorMessage, undefined);
    assert.equal(e?.message, 'runyard-agents: 409 conflict');
  }
});

test('a body read already leaves the status, and no code', async (t) => {
  const err = await thrown(t, 404, '{"error":{"code":"not_found","message":"m"}}');
  assert.ok(err instanceof ResponseError);
  await err.response.text();
  const e = await apiError(err);
  assert.equal(e?.status, 404);
  assert.equal(e?.code, undefined);
  assert.equal(e?.body, '');
});

test('what is not an answer is no APIError', async (t) => {
  // A server that is gone: the generated client's FetchError.
  const { url } = await serve(t, ({ res }) => res.destroy());
  let gone: unknown;
  try {
    await new SessionsApi(new Configuration({ basePath: url })).getSession({ sessionId: 's1' });
  } catch (err) {
    gone = err;
  }
  assert.ok(gone instanceof FetchError);
  for (const err of [gone, new RequiredError('sessionId'), new Error('other'), 'a string', undefined, null, 404]) {
    assert.equal(await apiError(err), undefined);
    assert.equal(await errorCode(err), undefined);
  }
});
