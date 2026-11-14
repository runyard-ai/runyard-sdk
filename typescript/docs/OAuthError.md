
# OAuthError

OAuth\'s error answer (RFC 6749 §5.2), not this contract\'s `Error`.

## Properties

Name | Type
------------ | -------------
`error` | string
`errorDescription` | string

## Example

```typescript
import type { OAuthError } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "error": null,
  "errorDescription": null,
} satisfies OAuthError

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OAuthError
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


