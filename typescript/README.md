# runyard TypeScript SDK

The TypeScript client for [runyard-agents](https://runyard.ai): open a
session, talk to it, read its transcript as it is written, and delete it.
It is the client openapi-generator makes from the API's OpenAPI document,
with what that cannot do on its own written beside it: the streams read line
by line, and the server's errors read from an answer.

It needs the platform's `fetch`, `ReadableStream` and `TextDecoder` and
nothing else, so it runs in Node 18 or later, a browser, Deno and Bun alike.
It is an ES module. It needs the address of a runyard-agents server and an
API key.

## Getting it

It is published with every release of runyard-agents, at its version, in
Runyard's npm registry, which needs no key. Point the scope at it in the
project's `.npmrc`:

```ini
@runyard-ai:registry=https://releases.runyard.ai/npm/runyard-public/
```

```sh
npm install @runyard-ai/runyard-sdk
```

Take the version of the server it talks to.

## Example

```ts
import { Configuration, SessionsApi, readEvents } from '@runyard-ai/runyard-sdk';

// The key is every request's bearer token: an API key (ryak_…) or a
// platform's JWT. A function is asked for it on each request instead.
const configuration = new Configuration({
  basePath: 'https://agents.example.com',
  accessToken: process.env.RUNYARD_AGENTS_KEY,
});

// The caller names the session: the same request again finds it rather
// than making a second one.
const sessions = new SessionsApi(configuration);
await sessions.createSession({
  sessionId: 'hello',
  sessionSpec: { firstTurn: { turnId: 't1', text: 'Say hello.' } },
});

// Its events, from the first on, and every new one as it happens.
for await (const line of await readEvents(configuration, { sessionId: 'hello', follow: true })) {
  if (line.line !== 'event') {
    continue; // a partial, or the line that says the transcript so far is read
  }
  const event = line.event;
  if (event.type === 'text') {
    console.log(event.text);
  }
  if (event.type === 'turn_ended') {
    break; // closes the stream
  }
}
```

`basePath` has no trailing slash: every path is added to it as it is. Each
part of the API is a class of its own on the same `Configuration` —
`SessionsApi`, `TurnsApi`, `ProfilesApi`, `MetaApi` and the rest — and its
`middleware`, `headers` and `fetchApi` are every request's, the streams'
included.

## Streams

A session's transcript (`readEvents`) and the changes to the account's
sessions (`readChanges`) are streams of JSON lines, and each is a `Stream`:
an async iterator of its lines as the server writes them. Not followed, it
ends with what is kept; followed, it stays open until the loop is left, the
`signal` passed as its last argument is aborted, or the server ends it.
Leaving the loop, by `break` or a throw, hangs up, and so does `close()`.

A line of a session's events is an `EventsLine`, one of three kinds, which
its `line` field says: `event`, a `SessionEvent` of the transcript;
`partial`, a `PartialLine` of text the session is still writing; and
`caughtUp`, the one `CaughtUpLine` following brings, once everything kept has
been read. `eventsLineValue` decodes a line read some other way the same way.
A line of a kind the SDK does not know, or not in its kind's shape, is a
`LineError`, and closes the stream. A server of v0.37.0 or earlier writes no
`line` field; its lines are told apart by the field only their kind has.

The generated `EventsApi.streamEvents` and `streamChanges` read the whole
body as one JSON value, which a stream is not: use these.

## Errors

A generated call that the server answers with anything but a success throws
the generated `ResponseError`, holding the answer with its body unread.
`apiError(err)` reads it: an `APIError`, a `ResponseError` itself, with the
answer's `status` and `body` and, when the body is one of the server's
errors, its `code` and `errorMessage`. `errorCode(err)` is the code alone:

```ts
import { ErrorCode, errorCode } from '@runyard-ai/runyard-sdk';

try {
  await sessions.getSession({ sessionId: 'hello' });
} catch (err) {
  if ((await errorCode(err)) !== ErrorCode.NotFound) {
    throw err;
  }
}
```

A stream that is refused throws the `APIError` already. A `409` with the
code `gapped` says what was asked for is no longer kept: read from where the
server says it starts.

## The relay

`@runyard-ai/runyard-sdk/relay` is runyard-agents' API served by your own
backend to your own front end, each person reaching only their own sessions.
The key stays on the backend. `createRelay` is a fetch handler,
`(Request) => Promise<Response>`, for Next.js, Hono, Bun or Deno.
`toNodeHandler` makes it a handler for node:http or Express:

```ts
import { RelayError, createRelay, toNodeHandler } from '@runyard-ai/runyard-sdk/relay';

const relay = createRelay({
  url: 'https://agents.example.com',
  key: process.env.RUNYARD_AGENTS_KEY!, // sessions.read, sessions.write, sessions.person
  prefix: '/agents',
  person: async (req) => ({ email: await emailOf(req) }), // throw: 401
  scope: (_req, p) => ({ owner: p.email, labels: { 'acme.user': p.email } }),
  start: (_req, p, spec) => {
    spec.profileId = 'chat';
    spec.provider = `claude-${p.email}`;
  },
  turn: (_req, p, turn) => {
    turn.provider = `claude-${p.email}`;
  },
  started: async (_req, p, session) => record(p, session.id),
});
app.use('/agents', toNodeHandler(relay));
```

A hook that throws a `RelayError(status, code, message)` has the relay answer
with it. One that throws anything else is a 500, told to `log`. What it
serves, and what it lets the browser say, is in
[the repository's README](../README.md#a-conversation-in-your-own-product-the-relay).

## Reference

[`docs/`](docs) has a page for every operation and every type, as
generated. [`../openapi/agents.yaml`](../openapi/agents.yaml) is the OpenAPI
document itself; a server also serves it at `GET /v1/openapi.yaml`, and
renders it at `GET /v1/docs`.

## Versions

The SDK is released with the server, with the same version number: SDK
`0.36.0` is the client of server `v0.36.0`. While the version is `0.x`, a
minor version may change the API.
