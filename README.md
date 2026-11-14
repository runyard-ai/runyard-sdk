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
it that a program with a key can call. The ones marked `x-sdk-excluded` are
left out, each with its reason: the console's own routes, which only its
sign-in cookie may call; a browser's sign-in redirects; and the WebSockets
(a session's terminal, attaching to it, serving it a broker), which a
generated client cannot speak. What a generated client cannot do on its own
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

## Testing them

Each SDK has a conformance suite, the same scenario in both languages: it
makes a session, follows its events until it is idle, reads its transcript,
and deletes it. Given a server and a key, it runs against that server:

```sh
export RUNYARD_AGENTS_URL=https://agents.example.com RUNYARD_AGENTS_KEY=ryak_…
(cd go && go test -tags conformance ./...)
(cd typescript && sh check.sh)
```

The key needs `sessions.read`, `sessions.write`, `sessions.delete` and
`sandbox`. runyard-agents runs these suites against its own server on every
change to it, before any of it is released.

## Versions

The SDKs are released with the server, with the same version number: SDK
`v0.36.0` is the client of server `v0.36.0`. The Go module is tagged
`go/v0.36.0` as well, which is how Go finds a module in a directory, and the
TypeScript package is `@runyard-ai/runyard-sdk@0.36.0`. While the version is
`v0.x`, a minor version may change the API.

This repository is published from the runyard-agents release process, and
every file in it is overwritten by the next release. Report issues here.

