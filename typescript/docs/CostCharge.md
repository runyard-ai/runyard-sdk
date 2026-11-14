
# CostCharge

What each part of a use cost, at the rates of the moment it was used.

## Properties

Name | Type
------------ | -------------
`vcpu` | number
`memory` | number
`disk` | number
`tunnel` | number

## Example

```typescript
import type { CostCharge } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "vcpu": null,
  "memory": null,
  "disk": null,
  "tunnel": null,
} satisfies CostCharge

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CostCharge
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


