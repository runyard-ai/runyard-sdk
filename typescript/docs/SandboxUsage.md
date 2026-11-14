
# SandboxUsage


## Properties

Name | Type
------------ | -------------
`cpuPercent` | number
`memoryBytes` | number
`diskBytes` | number

## Example

```typescript
import type { SandboxUsage } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "cpuPercent": 37.5,
  "memoryBytes": null,
  "diskBytes": null,
} satisfies SandboxUsage

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SandboxUsage
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


