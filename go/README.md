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

`go test -tags conformance ./...`, with `RUNYARD_AGENTS_URL` and
`RUNYARD_AGENTS_KEY` set, runs the conformance suite against that server.
