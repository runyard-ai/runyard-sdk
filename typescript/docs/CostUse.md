
# CostUse

What something used over the window: each quantity it held, times the hours it held it.

## Properties

Name | Type
------------ | -------------
`seconds` | number
`vcpuHours` | number
`memoryGiBHours` | number
`diskGiBHours` | number
`tunnelHours` | number

## Example

```typescript
import type { CostUse } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "seconds": null,
  "vcpuHours": null,
  "memoryGiBHours": null,
  "diskGiBHours": null,
  "tunnelHours": null,
} satisfies CostUse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CostUse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


