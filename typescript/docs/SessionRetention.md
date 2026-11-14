
# SessionRetention

How long a session may stay idle — since its `idleSince` — before it is archived, and before it is deleted. Neither is done to a session that is `locked` or `pinned`, nor to one at work: starting, generating, attached, with turns queued, sub-agents or background tasks running, or an alarm pending. Its next turn starts the count again.  Without `archiveAfterSeconds` no session is archived for being idle; without `deleteAfterSeconds` none is deleted. With both, deleting comes after archiving. 

## Properties

Name | Type
------------ | -------------
`archiveAfterSeconds` | number
`deleteAfterSeconds` | number

## Example

```typescript
import type { SessionRetention } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "archiveAfterSeconds": null,
  "deleteAfterSeconds": null,
} satisfies SessionRetention

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionRetention
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


