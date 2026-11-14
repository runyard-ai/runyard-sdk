
# GapError


## Properties

Name | Type
------------ | -------------
`error` | [GapErrorError](GapErrorError.md)
`firstSeq` | number
`lastSeq` | number

## Example

```typescript
import type { GapError } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "error": null,
  "firstSeq": null,
  "lastSeq": null,
} satisfies GapError

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GapError
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


