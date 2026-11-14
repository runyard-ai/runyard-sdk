
# Model

A model as its provider\'s API lists it. What the API does not say is absent, never guessed: OpenAI\'s `/v1/models` says no context window, for one. 

## Properties

Name | Type
------------ | -------------
`id` | string
`title` | string
`contextWindow` | number
`maxOutput` | number
`createdAt` | Date

## Example

```typescript
import type { Model } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": claude-opus-5-5,
  "title": Claude Opus 5.5,
  "contextWindow": 1000000,
  "maxOutput": 128000,
  "createdAt": null,
} satisfies Model

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Model
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


