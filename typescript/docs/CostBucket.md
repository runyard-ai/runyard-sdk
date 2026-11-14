
# CostBucket

What was spent in one step of the window, from `at`.

## Properties

Name | Type
------------ | -------------
`at` | Date
`amounts` | [CostAmounts](CostAmounts.md)

## Example

```typescript
import type { CostBucket } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "at": null,
  "amounts": null,
} satisfies CostBucket

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CostBucket
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


