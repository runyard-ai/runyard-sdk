
# HarnessModel

A model a harness may run, and the providers that offer it.

## Properties

Name | Type
------------ | -------------
`id` | string
`title` | string
`contextWindow` | number
`maxOutput` | number
`createdAt` | Date
`providerType` | [ProviderType](ProviderType.md)
`providers` | Array&lt;string&gt;

## Example

```typescript
import type { HarnessModel } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": claude-opus-5-5,
  "title": Claude Opus 5.5,
  "contextWindow": 1000000,
  "maxOutput": 128000,
  "createdAt": null,
  "providerType": null,
  "providers": null,
} satisfies HarnessModel

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as HarnessModel
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


