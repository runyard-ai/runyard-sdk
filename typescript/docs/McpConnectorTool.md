
# McpConnectorTool


## Properties

Name | Type
------------ | -------------
`name` | string
`title` | string
`description` | string
`readOnly` | boolean
`inputSchema` | { [key: string]: any; }

## Example

```typescript
import type { McpConnectorTool } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "title": null,
  "description": null,
  "readOnly": null,
  "inputSchema": null,
} satisfies McpConnectorTool

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as McpConnectorTool
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


