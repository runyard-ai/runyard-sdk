
# Transfer


## Properties

Name | Type
------------ | -------------
`to` | string
`sessions` | [Array&lt;TransferSessionsInner&gt;](TransferSessionsInner.md)
`providers` | [Array&lt;TransferProvidersInner&gt;](TransferProvidersInner.md)
`profiles` | Array&lt;string&gt;
`brokers` | Array&lt;string&gt;
`mcpConnectors` | Array&lt;string&gt;
`triggers` | Array&lt;string&gt;
`links` | Array&lt;string&gt;

## Example

```typescript
import type { Transfer } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "to": ada@example.com,
  "sessions": null,
  "providers": null,
  "profiles": null,
  "brokers": null,
  "mcpConnectors": null,
  "triggers": null,
  "links": null,
} satisfies Transfer

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Transfer
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


