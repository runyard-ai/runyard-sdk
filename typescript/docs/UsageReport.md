
# UsageReport


## Properties

Name | Type
------------ | -------------
`range` | string
`step` | string
`from` | Date
`to` | Date
`totals` | [UsageTotals](UsageTotals.md)
`buckets` | [Array&lt;UsageBucket&gt;](UsageBucket.md)
`byProvider` | [Array&lt;ProviderUsage&gt;](ProviderUsage.md)
`byModel` | [Array&lt;ModelUsage&gt;](ModelUsage.md)
`bySession` | [Array&lt;SessionUsage&gt;](SessionUsage.md)

## Example

```typescript
import type { UsageReport } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "range": null,
  "step": null,
  "from": null,
  "to": null,
  "totals": null,
  "buckets": null,
  "byProvider": null,
  "byModel": null,
  "bySession": null,
} satisfies UsageReport

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UsageReport
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


