# runyard Go SDK

[![Go Reference](https://pkg.go.dev/badge/github.com/runyard-ai/runyard-sdk/go.svg)](https://pkg.go.dev/github.com/runyard-ai/runyard-sdk/go)

```sh
go get github.com/runyard-ai/runyard-sdk/go
```

It needs Go 1.26 or later.

## ry: start a session, and read its answer

Package [`ry`](https://pkg.go.dev/github.com/runyard-ai/runyard-sdk/go/ry)
is the short way, with your application's key (`sessions.read`,
`sessions.write`):

```go
c, err := ry.New("https://agents.example.com", os.Getenv("RUNYARD_KEY"))
if err != nil {
	log.Fatal(err)
}
s, err := c.Start(ctx, ry.Start{Profile: "support", Text: "Summarize ticket #42"})
if err != nil {
	log.Fatal(err)
}
answer, err := s.Reply(ctx) // waits for the turn to end: what the session said
answer, err = s.Send(ctx, "Now draft a reply")

// Everything it does, as it happens.
for ev, err := range s.Events(ctx) {
	if err != nil {
		log.Fatal(err)
	}
	switch e := ev.(type) {
	case ry.Text:
		fmt.Println(e.Text)
	case ry.ToolCall:
		fmt.Println("calls", e.Name)
	case ry.TurnEnded:
		fmt.Println("done:", e.StopReason)
	}
}
```

`c.Session(id)` is a handle on a session you started before, and
`c.Sessions(ctx, ry.List{...})` lists them. `Reply` waits for the turn under
way, or the next: a turn that already ended — sent in one request, read in
another — is `LastReply`'s, the answer of the turn that ended last.

```go
answer, err := c.Session(id).LastReply(ctx)
```

A turn that ends other than as it should is a `*ry.TurnError`. A turn `Send`
waits for that the session never starts — cancelled from the page while it
waited, dropped by an interrupt that dropped the queue, or refused as it was
given to the harness — is a `*ry.TurnGoneError`, as soon as it is gone.

### Your users, and their browsers

A session may be for one of your users — `EndUser`, your own id for them —
and their browser talks to it directly, with a **session token** your
backend mints: it reaches that one session, sends its turns for that user,
and nothing else. Your key never leaves your backend.

```go
s, err := c.Start(ctx, ry.Start{Profile: "support", EndUser: &ry.EndUser{ID: user.ID}})
// TTL: a minute to a day; zero is the server's default, an hour.
tok, err := s.Token(ctx, ry.TokenOptions{EndUser: &ry.EndUser{ID: user.ID, Email: user.Email}, TTL: time.Hour})
// The page: <TranscriptProvider options={{ apiBase: "https://agents.example.com/v1", token }}>
mine, err := c.Sessions(ctx, ry.List{EndUser: user.ID})
```

See [the examples](../examples).

## runyard: the whole API

Package [`runyard`](https://pkg.go.dev/github.com/runyard-ai/runyard-sdk/go)
is the client generated from [`../openapi/agents.yaml`](../openapi/agents.yaml),
beneath `ry` (`c.API()`), with what it cannot do on its own beside it:

- `WithKey` puts the API key on every request.
- `Checked` turns an answer into an error, an `*APIError`; `IsCode` reads its
  code — from `ry`'s errors too.
- `Events` and `Changes` read the streams line by line.

```go
client, err := runyard.NewClientWithResponses("https://agents.example.com", runyard.WithKey(os.Getenv("RUNYARD_KEY")))
if err != nil {
	log.Fatal(err)
}
made, err := client.StartSessionWithResponse(ctx, nil, runyard.SessionSpec{})
if err := runyard.Checked(made, err); err != nil {
	log.Fatal(err)
}
id := made.JSON201.Id

follow := true
events, err := client.Events(ctx, id, &runyard.StreamEventsParams{Follow: &follow})
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

Package [`relay`](relay) is deprecated, and is being removed: session
tokens do what it did.

`go test -tags conformance ./...`, with `RUNYARD_AGENTS_URL` and
`RUNYARD_AGENTS_KEY` set, runs the conformance suite against that server.
