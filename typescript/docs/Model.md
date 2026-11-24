
# Model

A model a provider offers, as its admin declared it. What was not said is absent, never guessed. 

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


