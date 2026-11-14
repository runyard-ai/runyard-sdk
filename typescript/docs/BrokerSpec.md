
# BrokerSpec

A broker this workspace declares: by name, a title for people, and where it listens. The sandboxes daemon dials it there for each session given it, presenting the session\'s sandbox\'s certificate, so the broker knows which sandbox calls and holds whatever credential it needs itself — or, with `auth: jwt`, putting a token saying so on each of its requests. How a session reaches it is the broker\'s to say — the environment and git configuration it describes at `/.well-known/runyard-broker`, `{url}` in them being its address in the machine:  ```json {\"version\": \"1\",  \"env\": {\"SOME_API_URL\": \"{url}/v1\"},  \"git\": {\"path\": \"/git/\", \"insteadOf\": [\"https://github.com/\"]},  \"mcp\": {\"path\": \"/mcp\"}} ```  All are optional, and a broker that answers `404` there describes nothing; a description this server does not read is said in its log and given to no session. An `env` name is in capitals, digits and `_`, and none starts with `RUNYARD_`. `mcp` says the broker serves an MCP server (streamable HTTP) at `{url}{path}`: the session\'s harness is given it, named after the broker, beside its MCP connectors — with no credential, since the broker knows the sandbox by its certificate. An MCP connector of the session\'s of the same name is given instead. Its `path` starts with `/`, is at most 256 characters, and has no `..`, query or fragment — nor a space, a control character or a backslash, which no address has. 

## Properties

Name | Type
------------ | -------------
`title` | string
`url` | string
`auth` | [BrokerAuth](BrokerAuth.md)
`ca` | string
`console` | string

## Example

```typescript
import type { BrokerSpec } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "title": null,
  "url": https://127.0.0.1:8453,
  "auth": null,
  "ca": null,
  "console": http://github-broker.acme.svc.cluster.local:8090,
} satisfies BrokerSpec

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BrokerSpec
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


