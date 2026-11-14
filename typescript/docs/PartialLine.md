
# PartialLine

What the session is writing, before it is an event. Sent only while following.

## Properties

Name | Type
------------ | -------------
`line` | string
`partial` | [ModelPartial](ModelPartial.md)

## Example

```typescript
import type { PartialLine } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "line": null,
  "partial": null,
} satisfies PartialLine

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PartialLine
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


