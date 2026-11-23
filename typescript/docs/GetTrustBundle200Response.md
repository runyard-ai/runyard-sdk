
# GetTrustBundle200Response


## Properties

Name | Type
------------ | -------------
`keys` | Array&lt;{ [key: string]: any; }&gt;
`spiffeSequence` | number
`spiffeRefreshHint` | number
`runyardTenant` | string

## Example

```typescript
import type { GetTrustBundle200Response } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "keys": null,
  "spiffeSequence": null,
  "spiffeRefreshHint": null,
  "runyardTenant": null,
} satisfies GetTrustBundle200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetTrustBundle200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


