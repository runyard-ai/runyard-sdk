
# KeyAuthorizationRequest

A key a person approves for a program, as `NewKey`, and what its code is bound to. No `owner`: the key is its approver\'s.

## Properties

Name | Type
------------ | -------------
`name` | string
`scopes` | [Array&lt;Scope&gt;](Scope.md)
`expiresAt` | Date
`codeChallenge` | string
`redirectUri` | string
`replaces` | string

## Example

```typescript
import type { KeyAuthorizationRequest } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": ryclaude on ada-laptop,
  "scopes": null,
  "expiresAt": null,
  "codeChallenge": E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM,
  "redirectUri": http://127.0.0.1:49152/callback,
  "replaces": null,
} satisfies KeyAuthorizationRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as KeyAuthorizationRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


