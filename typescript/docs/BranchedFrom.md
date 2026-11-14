
# BranchedFrom

For `fork`.

## Properties

Name | Type
------------ | -------------
`sessionId` | string
`seq` | number

## Example

```typescript
import type { BranchedFrom } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "sessionId": 0192f6a4-3c1e-7b2a-9d4e-5f6a7b8c9d0e,
  "seq": null,
} satisfies BranchedFrom

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BranchedFrom
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


