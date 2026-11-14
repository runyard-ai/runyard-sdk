
# SessionMatch

A session whose transcript says what was searched for, and where it last says it.

## Properties

Name | Type
------------ | -------------
`session` | [Session](Session.md)
`seq` | number
`at` | Date
`snippet` | [Array&lt;SnippetPart&gt;](SnippetPart.md)

## Example

```typescript
import type { SessionMatch } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "session": null,
  "seq": null,
  "at": null,
  "snippet": null,
} satisfies SessionMatch

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionMatch
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


