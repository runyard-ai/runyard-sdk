
# ConnectDecision

The authorize request\'s query, as the consent page read it, and what the admin decided.

## Properties

Name | Type
------------ | -------------
`clientId` | string
`redirectUri` | string
`state` | string
`context` | string
`codeChallenge` | string
`codeChallengeMethod` | string
`approve` | boolean

## Example

```typescript
import type { ConnectDecision } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "clientId": null,
  "redirectUri": null,
  "state": null,
  "context": null,
  "codeChallenge": null,
  "codeChallengeMethod": null,
  "approve": null,
} satisfies ConnectDecision

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ConnectDecision
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


