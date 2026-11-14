
# TextEvent


## Properties

Name | Type
------------ | -------------
`type` | string
`text` | string
`parentToolId` | string

## Example

```typescript
import type { TextEvent } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "text": null,
  "parentToolId": null,
} satisfies TextEvent

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TextEvent
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


