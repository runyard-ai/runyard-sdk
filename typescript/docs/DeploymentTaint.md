
# DeploymentTaint

The first command, file write or terminal in a deployment: from then on, what runs in it is not only its recipe. Never taken away.

## Properties

Name | Type
------------ | -------------
`at` | Date
`by` | string
`sessionId` | string
`route` | string

## Example

```typescript
import type { DeploymentTaint } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "at": null,
  "by": null,
  "sessionId": null,
  "route": null,
} satisfies DeploymentTaint

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DeploymentTaint
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


