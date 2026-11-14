
# Broker


## Properties

Name | Type
------------ | -------------
`name` | string
`title` | string
`url` | string
`ca` | string
`console` | string
`auth` | [BrokerAuth](BrokerAuth.md)
`kind` | [BrokerKind](BrokerKind.md)
`builtin` | boolean
`owner` | string
`everyone` | boolean
`users` | Array&lt;string&gt;
`updatedAt` | Date
`describedAt` | Date
`mcp` | [BrokerMcp](BrokerMcp.md)

## Example

```typescript
import type { Broker } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": github,
  "title": null,
  "url": null,
  "ca": null,
  "console": null,
  "auth": null,
  "kind": null,
  "builtin": null,
  "owner": null,
  "everyone": null,
  "users": null,
  "updatedAt": null,
  "describedAt": null,
  "mcp": null,
} satisfies Broker

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Broker
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


