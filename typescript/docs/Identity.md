
# Identity

Where a person\'s role comes from, and how the server learns they have left.  - `claims` (`-signin-roles-claim`): from a claim of the identity   tokens of the OpenID provider (`-oidc-issuer`), at every sign-in   and every refresh. People are not added, changed or invited here:   the provider decides. The server keeps each person\'s refresh token   and asks the provider about them every `refreshSeconds`; one it   refuses (`invalid_grant`, or no role any more) is offboarded — their   sign-ins end, their keys and links are suspended, their sessions   paused — and what is theirs waits for an admin to hand it over or   delete it (`DELETE /v1/users/{userEmail}`). A provider that does not   answer changes nothing for `unreachableGraceSeconds`; after that,   keys are suspended until it answers again. - `local`: from the people the workspace keeps, managed here, as   with a password file (`-htpasswd`) or a provider that says no role   (Google). Removing a person revokes their keys. 

## Properties

Name | Type
------------ | -------------
`mode` | string
`claim` | string
`refreshSeconds` | number
`unreachableGraceSeconds` | number
`keyLifetimeSeconds` | number

## Example

```typescript
import type { Identity } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "mode": null,
  "claim": null,
  "refreshSeconds": null,
  "unreachableGraceSeconds": null,
  "keyLifetimeSeconds": null,
} satisfies Identity

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Identity
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


