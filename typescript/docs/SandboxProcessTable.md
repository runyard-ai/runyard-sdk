
# SandboxProcessTable


## Properties

Name | Type
------------ | -------------
`total` | number
`truncated` | boolean
`cpuCount` | number
`sampledMs` | number
`items` | [Array&lt;SandboxProcess&gt;](SandboxProcess.md)

## Example

```typescript
import type { SandboxProcessTable } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "total": 42,
  "truncated": null,
  "cpuCount": 2,
  "sampledMs": 250,
  "items": null,
} satisfies SandboxProcessTable

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SandboxProcessTable
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


