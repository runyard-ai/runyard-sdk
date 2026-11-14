
# InfrastructureVolume


## Properties

Name | Type
------------ | -------------
`state` | string
`sandbox` | string
`runner` | [InfrastructureRunner](InfrastructureRunner.md)
`transferringTo` | [InfrastructureRunner](InfrastructureRunner.md)
`waitingFor` | [InfrastructureRunner](InfrastructureRunner.md)
`bytes` | number
`allocatedBytes` | number
`lastUsedAt` | Date

## Example

```typescript
import type { InfrastructureVolume } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "state": null,
  "sandbox": null,
  "runner": null,
  "transferringTo": null,
  "waitingFor": null,
  "bytes": null,
  "allocatedBytes": null,
  "lastUsedAt": null,
} satisfies InfrastructureVolume

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as InfrastructureVolume
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


