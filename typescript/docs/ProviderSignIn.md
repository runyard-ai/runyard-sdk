
# ProviderSignIn


## Properties

Name | Type
------------ | -------------
`type` | [ProviderType](ProviderType.md)
`method` | [SignInMethod](SignInMethod.md)
`title` | string
`endUser` | [EndUser](EndUser.md)

## Example

```typescript
import type { ProviderSignIn } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "method": null,
  "title": null,
  "endUser": null,
} satisfies ProviderSignIn

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProviderSignIn
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


