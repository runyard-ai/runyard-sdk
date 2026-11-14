
# SignInFlow

A subscription\'s sign-in begun. What to show the person is by `method`.

## Properties

Name | Type
------------ | -------------
`flowId` | string
`method` | [SignInMethod](SignInMethod.md)
`authorizationUrl` | string
`verificationUri` | string
`userCode` | string
`expiresAt` | Date

## Example

```typescript
import type { SignInFlow } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "flowId": null,
  "method": null,
  "authorizationUrl": null,
  "verificationUri": null,
  "userCode": ABCD-EFGH,
  "expiresAt": null,
} satisfies SignInFlow

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SignInFlow
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


