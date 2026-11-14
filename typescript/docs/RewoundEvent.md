
# RewoundEvent

Every event after `toSeq` and before this one no longer counts.

## Properties

Name | Type
------------ | -------------
`type` | string
`toSeq` | number

## Example

```typescript
import type { RewoundEvent } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "toSeq": null,
} satisfies RewoundEvent

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RewoundEvent
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


