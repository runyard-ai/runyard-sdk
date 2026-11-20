
# UserEvent

A turn, as the session was given it.

## Properties

Name | Type
------------ | -------------
`type` | string
`turnId` | string
`text` | string
`attachments` | [Array&lt;Attachment&gt;](Attachment.md)
`source` | [UserEventSource](UserEventSource.md)
`keyId` | string
`endUser` | [EndUser](EndUser.md)
`compact` | boolean

## Example

```typescript
import type { UserEvent } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "turnId": null,
  "text": null,
  "attachments": null,
  "source": null,
  "keyId": null,
  "endUser": null,
  "compact": null,
} satisfies UserEvent

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserEvent
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


