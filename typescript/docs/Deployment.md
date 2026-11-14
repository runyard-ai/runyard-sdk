
# Deployment


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`image` | string
`owner` | string
`sessionId` | string
`state` | [DeploymentState](DeploymentState.md)
`error` | string
`cpus` | number
`memory` | string
`disk` | string
`nested` | boolean
`secrets` | Array&lt;string&gt;
`allow` | Array&lt;string&gt;
`sealed` | boolean
`tainted` | [DeploymentTaint](DeploymentTaint.md)
`expiresAt` | Date
`createdAt` | Date

## Example

```typescript
import type { Deployment } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "image": img_4c1e9a7f2b06d3a1,
  "owner": null,
  "sessionId": null,
  "state": null,
  "error": null,
  "cpus": null,
  "memory": null,
  "disk": null,
  "nested": null,
  "secrets": null,
  "allow": null,
  "sealed": null,
  "tainted": null,
  "expiresAt": null,
  "createdAt": null,
} satisfies Deployment

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Deployment
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


