# runyard SDKs

Clients for [runyard](https://runyard.ai)'s agents API, in Go and TypeScript:
start sessions, talk to them, follow what they do.

## Start a session, and read its answer

With a key of your application's, on your backend:

```go
c, err := ry.New("https://agents.example.com", os.Getenv("RUNYARD_KEY"))
s, err := c.Start(ctx, ry.Start{Profile: "support", Text: "Summarize ticket #42"})
answer, err := s.Reply(ctx)
answer, err = s.Send(ctx, "Now draft a reply")
```

```ts
const ry = new Runyard({ url: 'https://agents.example.com', key: process.env.RUNYARD_KEY! });
const s = await ry.start({ profile: 'support', text: 'Summarize ticket #42' });
const answer = await s.reply();
const next = await s.send('Now draft a reply');
```

## Add a chat to your web app

![A chat page served by runyard](examples/screenshot.png)

Each of your users gets sessions of their own: start one for them
(`endUser`, your own id for them), and have your backend mint a **session
token** for it. The page talks to runyard directly with the token, which
reaches that one session and nothing else, and draws the chat with
`@runyard-ai/runyard-react`. Your key never leaves your backend.

```go
s, err := c.Start(ctx, ry.Start{Profile: "support", EndUser: &ry.EndUser{ID: user.ID}})
tok, err := s.Token(ctx, ry.TokenOptions{EndUser: &ry.EndUser{ID: user.ID, Email: user.Email}})
// Hand the page s.ID(), tok.Value and https://agents.example.com/v1.
```

[`examples/`](examples) is that page, with its backend in
[Node](examples/node/server.js) or [Go](examples/go/main.go). Start there.

## Install

| | |
|---|---|
| Go | `go get github.com/runyard-ai/runyard-sdk/go` |
| TypeScript | `npm install @runyard-ai/runyard-sdk` |

The npm packages are in runyard's registry, which needs no key. Add it to
`.npmrc`:

```ini
@runyard-ai:registry=https://releases.runyard.ai/npm/runyard-public/
```

Every call needs a key: your application's (`ryak_…`, with
`sessions.read` and `sessions.write`), which an admin makes for it
(`POST /v1/keys` with its `app`, or the console) or which it is given when
it connects — or, in a browser, a session token.

## More

- [Go SDK](go/README.md) and [TypeScript SDK](typescript/README.md): `ry`,
  and the client generated from the API beneath it, for everything else
- The API: [`openapi/agents.yaml`](openapi/agents.yaml)
- The relay (`go/relay`, `@runyard-ai/runyard-sdk/relay`) is deprecated, and
  is being removed: session tokens do what it did.

SDK `vX.Y.Z` is the client of server `vX.Y.Z`. This repository is generated
from runyard-agents at each release. Report issues here.
