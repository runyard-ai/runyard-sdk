
# ProfileSpec


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
`title` | string
`description` | string

## Example

```typescript
import type { ProfileSpec } from '@runyard-ai/runyard-sdk'

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
  "title": Reviewer,
  "description": null,
} satisfies ProfileSpec

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProfileSpec
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


