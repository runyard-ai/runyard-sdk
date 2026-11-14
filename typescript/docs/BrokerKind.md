
# BrokerKind

| kind | what the session reaches | |---|---| | `llm` | the model providers, with their credentials — the server\'s own | | `egress` | the internet, one host at a time, as the session asks — the server\'s own | | `tunnels` | publishing its ports as addresses — the server\'s own | | `sessions` | this server, as its session — to start and talk to other sessions — the server\'s own | | `images` | this server, as its session — to build images from recipes, and deploy them: boot sealed sandboxes, read their logs, publish their ports — the server\'s own | | `shared` | a broker declared here, which the sandboxes daemon dials at its `url` with the machine\'s certificate, and this server serves nothing — so it keeps working while this server restarts | 

## Properties

Name | Type
------------ | -------------

## Example

```typescript
import type { BrokerKind } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
} satisfies BrokerKind

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BrokerKind
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


