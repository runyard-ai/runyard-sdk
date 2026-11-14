
# CostReport

What the workspace\'s infrastructure was spent on over a window, step by step and thing by thing, and what it costs an hour now: its sandboxes server\'s sandboxes, volumes, images and tunnels, as runyard-sandboxes meters them, at the rates its configuration names.

## Properties

Name | Type
------------ | -------------
`currency` | string
`rates` | [CostRates](CostRates.md)
`window` | [CostWindow](CostWindow.md)
`from` | Date
`to` | Date
`step` | string
`total` | [CostAmounts](CostAmounts.md)
`running` | [CostAmounts](CostAmounts.md)
`series` | [Array&lt;CostBucket&gt;](CostBucket.md)
`resources` | [Array&lt;CostResource&gt;](CostResource.md)

## Example

```typescript
import type { CostReport } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "currency": USD,
  "rates": null,
  "window": null,
  "from": null,
  "to": null,
  "step": null,
  "total": null,
  "running": null,
  "series": null,
  "resources": null,
} satisfies CostReport

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CostReport
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


