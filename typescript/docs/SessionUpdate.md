
# SessionUpdate


## Properties

Name | Type
------------ | -------------
`title` | string
`autoTitle` | boolean
`labels` | { [key: string]: string; }
`provider` | string
`model` | string
`brokers` | Array&lt;string&gt;
`mcpConnectors` | Array&lt;string&gt;
`resources` | [Resources](Resources.md)
`restartSandbox` | boolean
`locked` | boolean
`pinned` | boolean

## Example

```typescript
import type { SessionUpdate } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "title": null,
  "autoTitle": null,
  "labels": null,
  "provider": github,
  "model": null,
  "brokers": null,
  "mcpConnectors": null,
  "resources": null,
  "restartSandbox": null,
  "locked": null,
  "pinned": null,
} satisfies SessionUpdate

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionUpdate
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


