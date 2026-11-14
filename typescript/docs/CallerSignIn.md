
# CallerSignIn

For a person signed in to a UI, how and when: what a UI asks them to confirm it is them with (`POST /v1/signin/confirm`, or the provider\'s sign-in with `confirm=true`). 

## Properties

Name | Type
------------ | -------------
`via` | string
`at` | Date

## Example

```typescript
import type { CallerSignIn } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "via": null,
  "at": null,
} satisfies CallerSignIn

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CallerSignIn
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


