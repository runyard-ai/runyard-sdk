
# SessionPage


## Properties

Name | Type
------------ | -------------
`nextCursor` | string
`items` | [Array&lt;Session&gt;](Session.md)
`changeSeq` | number

## Example

```typescript
import type { SessionPage } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "nextCursor": null,
  "items": null,
  "changeSeq": null,
} satisfies SessionPage

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionPage
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


