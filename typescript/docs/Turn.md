
# Turn


## Properties

Name | Type
------------ | -------------
`turnId` | string
`text` | string
`attachments` | [Array&lt;Attachment&gt;](Attachment.md)
`mode` | string
`provider` | string
`model` | string

## Example

```typescript
import type { Turn } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "turnId": null,
  "text": null,
  "attachments": null,
  "mode": null,
  "provider": github,
  "model": claude-haiku-4-5-20251001,
} satisfies Turn

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Turn
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


