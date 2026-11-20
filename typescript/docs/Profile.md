
# Profile


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
`owner` | string
`everyone` | boolean
`users` | Array&lt;string&gt;
`id` | string
`version` | number
`image` | [Image](Image.md)
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { Profile } from '@runyard-ai/runyard-sdk'

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
  "owner": ada@example.com,
  "everyone": null,
  "users": null,
  "id": 0192f6a4-3c1e-7b2a-9d4e-5f6a7b8c9d0e,
  "version": null,
  "image": null,
  "createdAt": null,
  "updatedAt": null,
} satisfies Profile

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Profile
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


