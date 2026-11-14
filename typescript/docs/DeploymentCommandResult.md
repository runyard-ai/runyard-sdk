
# DeploymentCommandResult


## Properties

Name | Type
------------ | -------------
`exitCode` | number
`stdout` | string
`stderr` | string
`truncated` | boolean
`durationMs` | number

## Example

```typescript
import type { DeploymentCommandResult } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "exitCode": null,
  "stdout": null,
  "stderr": null,
  "truncated": null,
  "durationMs": null,
} satisfies DeploymentCommandResult

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DeploymentCommandResult
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


