
# DeploymentRequest


## Properties

Name | Type
------------ | -------------
`image` | string
`name` | string
`cpus` | number
`memory` | string
`disk` | string
`ttlSeconds` | number
`nested` | boolean
`allow` | Array&lt;string&gt;
`secrets` | Set&lt;string&gt;

## Example

```typescript
import type { DeploymentRequest } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "image": img_4c1e9a7f2b06d3a1,
  "name": preview,
  "cpus": null,
  "memory": 1Gi,
  "disk": 100Gi,
  "ttlSeconds": null,
  "nested": null,
  "allow": null,
  "secrets": null,
} satisfies DeploymentRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DeploymentRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


