
# McpConnectorPage


## Properties

Name | Type
------------ | -------------
`nextCursor` | string
`items` | [Array&lt;McpConnector&gt;](McpConnector.md)

## Example

```typescript
import type { McpConnectorPage } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "nextCursor": null,
  "items": null,
} satisfies McpConnectorPage

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as McpConnectorPage
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


