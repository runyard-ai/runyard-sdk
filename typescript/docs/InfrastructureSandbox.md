
# InfrastructureSandbox


## Properties

Name | Type
------------ | -------------
`state` | string
`image` | string
`cpus` | number
`memory` | string
`labels` | { [key: string]: string; }
`volume` | string
`runner` | [InfrastructureRunner](InfrastructureRunner.md)
`transferringTo` | [InfrastructureRunner](InfrastructureRunner.md)
`waitingFor` | [InfrastructureRunner](InfrastructureRunner.md)

## Example

```typescript
import type { InfrastructureSandbox } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "state": null,
  "image": null,
  "cpus": null,
  "memory": null,
  "labels": null,
  "volume": null,
  "runner": null,
  "transferringTo": null,
  "waitingFor": null,
} satisfies InfrastructureSandbox

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as InfrastructureSandbox
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


