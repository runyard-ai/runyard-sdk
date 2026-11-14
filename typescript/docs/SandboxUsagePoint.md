
# SandboxUsagePoint

One reading, measured from the host. A figure the host could not read is absent, and the CPU on the first reading: it is a difference between two. 

## Properties

Name | Type
------------ | -------------
`at` | Date
`cpuPercent` | number
`memoryBytes` | number
`diskBytes` | number

## Example

```typescript
import type { SandboxUsagePoint } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "at": null,
  "cpuPercent": 37.5,
  "memoryBytes": null,
  "diskBytes": null,
} satisfies SandboxUsagePoint

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SandboxUsagePoint
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


