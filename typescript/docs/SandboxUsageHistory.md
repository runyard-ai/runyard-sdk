
# SandboxUsageHistory


## Properties

Name | Type
------------ | -------------
`window` | [UsageWindow](UsageWindow.md)
`stepSeconds` | number
`limits` | [SandboxLimits](SandboxLimits.md)
`points` | [Array&lt;SandboxUsagePoint&gt;](SandboxUsagePoint.md)

## Example

```typescript
import type { SandboxUsageHistory } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "window": null,
  "stepSeconds": 10,
  "limits": null,
  "points": null,
} satisfies SandboxUsageHistory

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SandboxUsageHistory
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


