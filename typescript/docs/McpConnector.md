
# McpConnector


## Properties

Name | Type
------------ | -------------
`title` | string
`url` | string
`auth` | [McpConnectorAuth](McpConnectorAuth.md)
`owner` | string
`everyone` | boolean
`users` | Array&lt;string&gt;
`name` | string
`status` | string
`tools` | [Array&lt;McpConnectorTool&gt;](McpConnectorTool.md)
`skills` | [Array&lt;McpConnectorSkill&gt;](McpConnectorSkill.md)
`skillsError` | string
`skillsIgnored` | Array&lt;string&gt;
`listedAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { McpConnector } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "title": null,
  "url": https://mcp.example.com/mcp,
  "auth": null,
  "owner": null,
  "everyone": null,
  "users": null,
  "name": github,
  "status": null,
  "tools": null,
  "skills": null,
  "skillsError": null,
  "skillsIgnored": null,
  "listedAt": null,
  "updatedAt": null,
} satisfies McpConnector

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as McpConnector
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


