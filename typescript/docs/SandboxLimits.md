
# SandboxLimits

The size the machine was given — the session\'s `resources`, with the host\'s defaults filled in. A figure the host did not say is absent. 

## Properties

Name | Type
------------ | -------------
`cpus` | number
`memoryBytes` | number
`diskBytes` | number

## Example

```typescript
import type { SandboxLimits } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "cpus": 2,
  "memoryBytes": 4294967296,
  "diskBytes": 21474836480,
} satisfies SandboxLimits

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SandboxLimits
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


