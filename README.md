# runyard SDKs

The clients of [runyard-agents](https://runyard.ai): open a session — a
coding harness, Claude Code or Codex, in a sandbox of its own — talk to it,
follow what it does as it happens, and manage the workspace it runs in.

| Language | Directory | Get it |
|---|---|---|
| Go | [`go/`](go) | `go get github.com/runyard-ai/runyard-sdk/go` |
| TypeScript | [`typescript/`](typescript) | `npm install @runyard-ai/runyard-sdk`, from Runyard's registry (below) |

The TypeScript package is published in Runyard's npm registry, which needs no
key. Point the scope at it in the project's `.npmrc`:

```ini
@runyard-ai:registry=https://releases.runyard.ai/npm/runyard-public/
```

Each is generated from the API's OpenAPI document,
[`openapi/agents.yaml`](openapi/agents.yaml), and covers every operation in
it: the ones runyard promises to programs with a key, and only those. What a generated client cannot do on its own
is written beside it, the same in both languages:

- **The streams, read as they are written.** A session's transcript
  (`GET /v1/sessions/{id}/events`) and the changes to the account's sessions
  (`GET /v1/changes`) are JSON lines. When followed they stay open, and a
  generated client would wait for the end of a body that never ends. Each
  SDK reads them line by line instead, and skips the blank lines the server
  writes to keep a quiet stream open through proxies. Each events line says
  what kind it is in its `line` field (`event`, `partial` or `caughtUp`),
  which the generated union reads. Lines from a server of v0.37.0 or
  earlier, which have no `line`, are told apart by the field only their kind
  has.
- **The server's errors, as errors.** An answer that is not a success comes
  with the server's error code (`not_found`, `conflict`, `gapped`, …) and
  message.

Both read the same API key, `Authorization: Bearer ryak_…`, made in the
server's console or with `POST /v1/keys`.

## Go

```go
client, err := runyard.NewClientWithResponses("https://runyard.example.com", runyard.WithKey(os.Getenv("RUNYARD_KEY")))
if err != nil {
	log.Fatal(err)
}
made, err := client.CreateSessionWithResponse(ctx, "hello", runyard.SessionSpec{})
if err := runyard.Checked(made, err); err != nil {
	log.Fatal(err)
}

follow := true
events, err := client.Events(ctx, "hello", &runyard.StreamEventsParams{Follow: &follow})
if err != nil {
	log.Fatal(err)
}
defer events.Close()
for {
	line, err := events.Next()
	if err != nil {
		log.Fatal(err) // io.EOF when the server ends it
	}
	switch v, _ := line.Value(); v := v.(type) {
	case *runyard.SessionEvent:
		kind, _ := v.Event.Discriminator()
		fmt.Println(v.Seq, kind)
	case *runyard.CaughtUpLine:
		fmt.Println("caught up at", v.CaughtUp.Seq)
	}
}
```

`runyard.Checked(res, err)` is nil for a success, the call's error when there
was no answer, and an `*runyard.APIError` with the server's code otherwise:
`runyard.IsCode(err, runyard.ErrorCodeNotFound)`. Every answer has `Raw()`, the
body it was read from.

TypeScript is described in [its own README](typescript/README.md).

## A conversation in your own product: the relay

A product that signs its own people in, and shows them conversations drawn
with [`@runyard-ai/runyard-react`](https://releases.runyard.ai/npm/runyard-public/),
holds one key of the workspace, with `sessions.person`. That key can act on
every session in the workspace, so it stays on the product's backend, and
the browser talks to a relay there instead: package
[`relay`](go/relay) in Go, `@runyard-ai/runyard-sdk/relay` in TypeScript.
Both are the same relay.

```go
h, err := relay.New(relay.Config{
	URL: "https://agents.example.com", Key: os.Getenv("RUNYARD_KEY"),
	// Who is asking, from the product's own sign-in.
	Person: func(r *http.Request) (relay.Person, error) { return relay.Person{Email: emailOf(r)}, nil },
	// Which sessions they reach: theirs, and of this product.
	Scope: func(r *http.Request, p relay.Person) (relay.Scope, error) {
		return relay.Scope{Owner: p.Email, Labels: map[string]string{"acme.user": p.Email}}, nil
	},
	// What a session is started with, besides what the browser says.
	Start: func(r *http.Request, p relay.Person, spec *runyard.SessionSpec) error {
		profile := "chat"
		spec.ProfileId = &profile
		return nil
	},
})
mux.Handle("/agents/", http.StripPrefix("/agents", h))
```

```ts
import { createRelay, toNodeHandler } from '@runyard-ai/runyard-sdk/relay';

const relay = createRelay({
  url: 'https://agents.example.com', key: process.env.RUNYARD_KEY!, prefix: '/agents',
  person: (req) => ({ email: emailOf(req) }),
  scope: (_req, p) => ({ owner: p.email, labels: { 'acme.user': p.email } }),
  start: (_req, _p, spec) => { spec.profileId = 'chat'; },
});
// A fetch handler — Next.js, Hono, Bun, Deno: relay(request).
app.use('/agents', toNodeHandler(relay)); // node:http, Express
```

What the relay serves is runyard-agents' API, under the same paths, as
runyard-agents wrote it. The front end reads it with the same code it would
read runyard-agents with: `apiBase: '/agents/v1'`. It serves:

- **Sessions:** listing, starting, reading, renaming, pinning, archiving,
  restoring and deleting them.
- **The streams:** a session's transcript, followed as it is written, and
  the changes to the caller's sessions.
- **Turns:** sending, interrupting and taking them back (rewind), and editing, holding and
  cancelling queued ones.
- **What a transcript shows:** its attachments, its files and its
  sub-agents.
- **Optionally, provider sign-in** (`SignIn`): a person signing in their own
  provider, such as their Claude subscription.

It decides, on every request:

- **Who:** the product's `Person` hook says who is asking. Without a person,
  the answer is `401`.
- **Whose:** a session is reached only when its owner and labels are the
  caller's scope's. Any other session is `404`, as one that does not exist
  is. Lists and the change feed carry only the scope's sessions.
- **What the browser may say:** a session's title and first turn, a turn's
  text and mode, and a few flags. Owner, labels, profile, provider, brokers,
  the sandbox and everything else are the backend's, set in its hooks. A
  body with any other field is refused (`400`), so that nobody thinks it was
  said.
- **Nothing else:** any other route is `404`. A refusal of the key itself is
  the relay's failure (`502`), not the browser's.

## Testing them

Each SDK has a conformance suite, the same scenario in both languages: it
makes a session, follows its events until it is idle, reads its transcript,
and deletes it. Each relay has one too: it adds two people to the workspace,
and holds each to their own sessions through the relay. Given a server and a
key, they run against that server:

```sh
export RUNYARD_AGENTS_URL=https://agents.example.com RUNYARD_AGENTS_KEY=ryak_…
(cd go && go test -tags conformance ./...)
(cd typescript && sh check.sh)
```

The key needs `sessions.read`, `sessions.write`, `sessions.delete`,
`sessions.person`, `sandbox` and `users.admin`. runyard-agents runs these suites against its own server on every
change to it, before any of it is released.

## Versions

The SDKs are released with the server, with the same version number: SDK
`v0.36.0` is the client of server `v0.36.0`. The Go module is tagged
`go/v0.36.0` as well, which is how Go finds a module in a directory, and the
TypeScript package is `@runyard-ai/runyard-sdk@0.36.0`. While the version is
`v0.x`, a minor version may change the API.

This repository is published from the runyard-agents release process, and
every file in it is overwritten by the next release. Report issues here.

