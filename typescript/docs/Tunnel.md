
# Tunnel


## Properties

Name | Type
------------ | -------------
`name` | string
`port` | number
`url` | string
`state` | string
`message` | string
`description` | string
`emails` | Array&lt;string&gt;
`deploymentId` | string
`sessionId` | string

## Example

```typescript
import type { Tunnel } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "port": null,
  "url": null,
  "state": null,
  "message": null,
  "description": null,
  "emails": null,
  "deploymentId": null,
  "sessionId": null,
} satisfies Tunnel

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Tunnel
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


