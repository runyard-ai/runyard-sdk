
# KeyAuthorization

An approval waiting to be redeemed.

## Properties

Name | Type
------------ | -------------
`code` | string
`expiresAt` | Date

## Example

```typescript
import type { KeyAuthorization } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "code": 3q2-7wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,
  "expiresAt": null,
} satisfies KeyAuthorization

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as KeyAuthorization
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


