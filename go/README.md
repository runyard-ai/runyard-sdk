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

The [repository's README](../README.md) has an example.

Package [`relay`](relay) is runyard-agents' API served by your own backend to
your own front end, each person reaching only their own sessions: see
[the repository's README](../README.md#a-conversation-in-your-own-product-the-relay).

`go test -tags conformance ./...`, with `RUNYARD_AGENTS_URL` and
`RUNYARD_AGENTS_KEY` set, runs the conformance suite against that server.
