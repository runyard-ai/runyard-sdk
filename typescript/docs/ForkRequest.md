
# ForkRequest


## Properties

Name | Type
------------ | -------------
`newSessionId` | string
`atSeq` | number
`disk` | boolean
`title` | string
`labels` | { [key: string]: string; }
`resources` | [Resources](Resources.md)

## Example

```typescript
import type { ForkRequest } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "newSessionId": 0192f6a4-3c1e-7b2a-9d4e-5f6a7b8c9d0e,
  "atSeq": null,
  "disk": null,
  "title": null,
  "labels": null,
  "resources": null,
} satisfies ForkRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ForkRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


