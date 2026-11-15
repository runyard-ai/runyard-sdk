# runyard Go SDK

[![Go Reference](https://pkg.go.dev/badge/github.com/runyard-ai/runyard-sdk/go.svg)](https://pkg.go.dev/github.com/runyard-ai/runyard-sdk/go)

```sh
go get github.com/runyard-ai/runyard-sdk/go
```

It needs Go 1.26 or later. Package
[`runyard`](https://pkg.go.dev/github.com/runyard-ai/runyard-sdk/go)
is the client generated from [`../openapi/agents.yaml`](../openapi/agents.yaml),
with what it cannot do on its own beside it:

- `WithKey` puts the API key on every request.
- `Checked` turns an answer into an error.
- `Events` and `Changes` read the streams line by line.

```go
client, err := runyard.NewClientWithResponses("https://agents.example.com", runyard.WithKey(os.Getenv("RUNYARD_KEY")))
if err != nil {
	log.Fatal(err)
}
// You name the session: the same request again finds it rather than making a second one.
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

Package [`relay`](relay) is runyard-agents' API served by your own backend to
your own front end, each person reaching only their own sessions: see
[the examples](../examples).

`go test -tags conformance ./...`, with `RUNYARD_AGENTS_URL` and
`RUNYARD_AGENTS_KEY` set, runs the conformance suite against that server.
