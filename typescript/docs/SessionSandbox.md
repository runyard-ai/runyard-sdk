
# SessionSandbox


## Properties

Name | Type
------------ | -------------
`state` | [SandboxState](SandboxState.md)
`id` | string
`resources` | [Resources](Resources.md)
`error` | string
`errorCode` | [ErrorCode](ErrorCode.md)
`runner` | [SessionSandboxRunner](SessionSandboxRunner.md)
`image` | string
`bundle` | string

## Example

```typescript
import type { SessionSandbox } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "state": null,
  "id": null,
  "resources": null,
  "error": null,
  "errorCode": null,
  "runner": null,
  "image": null,
  "bundle": null,
} satisfies SessionSandbox

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionSandbox
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


