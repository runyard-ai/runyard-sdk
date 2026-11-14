
# ProviderSignInFinish

By the flow\'s method — `code` for `code`, `redirectUrl` for `redirect`, nothing for `device`.

## Properties

Name | Type
------------ | -------------
`code` | string
`redirectUrl` | string

## Example

```typescript
import type { ProviderSignInFinish } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "code": null,
  "redirectUrl": http://localhost:1455/auth/callback?code=…&state=…,
} satisfies ProviderSignInFinish

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProviderSignInFinish
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


