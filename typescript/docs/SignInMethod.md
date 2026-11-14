
# SignInMethod

How a subscription signs in: `code` (Anthropic: a code shown, and pasted), `device` (OpenAI: a code entered on the provider\'s page, the server waiting for it), or `redirect` (OpenAI: the address the browser ended on, pasted). 

## Properties

Name | Type
------------ | -------------

## Example

```typescript
import type { SignInMethod } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
} satisfies SignInMethod

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SignInMethod
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


