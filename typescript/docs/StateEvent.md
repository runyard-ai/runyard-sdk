
# StateEvent

The session\'s state, or its sandbox\'s, changed — or, while it starts, its start moved on to another phase or another step of its build.

## Properties

Name | Type
------------ | -------------
`type` | string
`state` | [SessionState](SessionState.md)
`sandboxState` | [SandboxState](SandboxState.md)
`reason` | string
`starting` | [SessionStarting](SessionStarting.md)

## Example

```typescript
import type { StateEvent } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "state": null,
  "sandboxState": null,
  "reason": null,
  "starting": null,
} satisfies StateEvent

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as StateEvent
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


