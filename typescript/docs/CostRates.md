
# CostRates

What an hour of each thing costs now, in `currency`, as the daemon\'s configuration names it.

## Properties

Name | Type
------------ | -------------
`currency` | string
`vcpuHour` | number
`memoryGiBHour` | number
`diskGiBHour` | number
`tunnelHour` | number

## Example

```typescript
import type { CostRates } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "currency": USD,
  "vcpuHour": 0.04,
  "memoryGiBHour": 0.005,
  "diskGiBHour": 0.00010,
  "tunnelHour": 0.01,
} satisfies CostRates

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CostRates
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


