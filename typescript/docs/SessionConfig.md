
# SessionConfig

Everything a session is started with. In a session, any field overrides its profile\'s.

## Properties

Name | Type
------------ | -------------
`harness` | string
`terminal` | boolean
`provider` | string
`model` | string
`systemPrompt` | string
`brokers` | Array&lt;string&gt;
`mcpConnectors` | Array&lt;string&gt;
`env` | { [key: string]: string; }
`sandbox` | [SandboxConfig](SandboxConfig.md)

## Example

```typescript
import type { SessionConfig } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "harness": claude-code,
  "terminal": null,
  "provider": github,
  "model": claude-opus-5-5,
  "systemPrompt": null,
  "brokers": null,
  "mcpConnectors": null,
  "env": null,
  "sandbox": null,
} satisfies SessionConfig

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionConfig
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


