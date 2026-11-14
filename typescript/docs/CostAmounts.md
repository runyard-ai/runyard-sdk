
# CostAmounts

An amount, in the report\'s currency, by what it was for.

## Properties

Name | Type
------------ | -------------
`sandboxes` | number
`volumes` | number
`images` | number
`tunnels` | number
`total` | number

## Example

```typescript
import type { CostAmounts } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "sandboxes": null,
  "volumes": null,
  "images": null,
  "tunnels": null,
  "total": null,
} satisfies CostAmounts

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CostAmounts
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


