
# SessionTokenRequest


## Properties

Name | Type
------------ | -------------
`endUser` | [EndUser](EndUser.md)
`ttlSeconds` | number

## Example

```typescript
import type { SessionTokenRequest } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "endUser": null,
  "ttlSeconds": null,
} satisfies SessionTokenRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionTokenRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


