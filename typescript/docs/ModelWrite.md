
# ModelWrite

A model a provider offers, as its admin declares it.

## Properties

Name | Type
------------ | -------------
`id` | string
`title` | string
`contextWindow` | number
`maxOutput` | number

## Example

```typescript
import type { ModelWrite } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": qwen3:32b,
  "title": null,
  "contextWindow": 32768,
  "maxOutput": null,
} satisfies ModelWrite

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ModelWrite
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


