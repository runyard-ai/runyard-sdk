
# BrokerPage


## Properties

Name | Type
------------ | -------------
`nextCursor` | string
`items` | [Array&lt;Broker&gt;](Broker.md)

## Example

```typescript
import type { BrokerPage } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "nextCursor": null,
  "items": null,
} satisfies BrokerPage

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BrokerPage
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


