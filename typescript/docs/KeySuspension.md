
# KeySuspension

Why a key does not work now, though it is kept and listed: an admin may delete it, and it works again when its cause ends.  | reason | cause | ends when | |---|---|---| | `offboarded` | the OpenID provider refused its person | they sign in with a role again | | `issuer_unreachable` | the provider has not answered about its person for longer than the grace | the provider answers | | `signin_expired` | a provider that gives no refresh tokens, and its person has not signed in for `keyLifetimeSeconds` | they sign in | 

## Properties

Name | Type
------------ | -------------
`reason` | string
`since` | Date

## Example

```typescript
import type { KeySuspension } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "reason": null,
  "since": null,
} satisfies KeySuspension

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as KeySuspension
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


