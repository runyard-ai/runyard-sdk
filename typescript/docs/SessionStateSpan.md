
# SessionStateSpan


## Properties

Name | Type
------------ | -------------
`from` | Date
`to` | Date
`state` | [SessionState](SessionState.md)
`sandboxState` | [SandboxState](SandboxState.md)

## Example

```typescript
import type { SessionStateSpan } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "from": null,
  "to": null,
  "state": null,
  "sandboxState": null,
} satisfies SessionStateSpan

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionStateSpan
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


