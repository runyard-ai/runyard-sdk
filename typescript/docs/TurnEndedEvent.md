
# TurnEndedEvent


## Properties

Name | Type
------------ | -------------
`type` | string
`turnId` | string
`stopReason` | string
`usage` | [Usage](Usage.md)

## Example

```typescript
import type { TurnEndedEvent } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "turnId": null,
  "stopReason": null,
  "usage": null,
} satisfies TurnEndedEvent

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TurnEndedEvent
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


