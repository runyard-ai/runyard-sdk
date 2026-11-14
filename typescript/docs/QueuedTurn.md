
# QueuedTurn

A turn waiting for the session\'s harness, as it was sent.

## Properties

Name | Type
------------ | -------------
`turnId` | string
`text` | string
`attachments` | [Array&lt;Attachment&gt;](Attachment.md)
`source` | [UserEventSource](UserEventSource.md)
`heldUntil` | Date

## Example

```typescript
import type { QueuedTurn } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "turnId": null,
  "text": null,
  "attachments": null,
  "source": null,
  "heldUntil": null,
} satisfies QueuedTurn

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as QueuedTurn
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


