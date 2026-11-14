
# RateLimitCredits

A ChatGPT plan\'s credits, spent when its windows are, as the provider last said.

## Properties

Name | Type
------------ | -------------
`hasCredits` | boolean
`unlimited` | boolean
`balance` | string

## Example

```typescript
import type { RateLimitCredits } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "hasCredits": null,
  "unlimited": null,
  "balance": null,
} satisfies RateLimitCredits

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RateLimitCredits
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


