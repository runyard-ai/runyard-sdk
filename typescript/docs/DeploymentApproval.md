
# DeploymentApproval


## Properties

Name | Type
------------ | -------------
`id` | string
`owner` | string
`sessionId` | string
`request` | [DeploymentRequest](DeploymentRequest.md)
`state` | [DeploymentApprovalState](DeploymentApprovalState.md)
`deploymentId` | string
`createdAt` | Date
`decidedAt` | Date

## Example

```typescript
import type { DeploymentApproval } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "owner": null,
  "sessionId": null,
  "request": null,
  "state": null,
  "deploymentId": null,
  "createdAt": null,
  "decidedAt": null,
} satisfies DeploymentApproval

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DeploymentApproval
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


