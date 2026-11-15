
# Caller

A key — sent as a bearer, or the one a UI was signed in with — a person signed in with a password or Google, who holds their role\'s scopes, a session\'s harness calling through its brokers, or the Runyard platform calling with a platform token.  The platform is nobody: no person, not the workspace\'s owner. It has no `email` and no `role`, and holds the scopes its token names of those the server was started to grant it (`--platform-scopes`), over the workspace — and nothing else.  A session is no key: nobody made one for it, and none is kept. The server knows it by the broker the call came through, and it acts as its owner — reading and starting sessions and firing triggers, in its own tree alone. 

## Properties

Name | Type
------------ | -------------
`kind` | string
`name` | string
`email` | string
`role` | [Role](Role.md)
`hasPicture` | boolean
`signIn` | [CallerSignIn](CallerSignIn.md)
`keyId` | string
`scopes` | [Array&lt;Scope&gt;](Scope.md)
`sessionId` | string
`profile` | [ProfileRef](ProfileRef.md)

## Example

```typescript
import type { Caller } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "kind": null,
  "name": null,
  "email": null,
  "role": null,
  "hasPicture": null,
  "signIn": null,
  "keyId": null,
  "scopes": null,
  "sessionId": null,
  "profile": null,
} satisfies Caller

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Caller
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


