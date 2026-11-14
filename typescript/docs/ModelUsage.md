
# ModelUsage


## Properties

Name | Type
------------ | -------------
`model` | string
`totals` | [UsageTotals](UsageTotals.md)

## Example

```typescript
import type { ModelUsage } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "model": claude-opus-5-5,
  "totals": null,
} satisfies ModelUsage

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ModelUsage
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


