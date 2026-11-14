
# SessionCostReport

One session\'s cost over a window: its infrastructure and its tokens, each in its own currency, and what it was from when to when.

## Properties

Name | Type
------------ | -------------
`session` | [SessionCostReportSession](SessionCostReportSession.md)
`window` | [SessionCostWindow](SessionCostWindow.md)
`from` | Date
`to` | Date
`step` | string
`infrastructure` | [CostReport](CostReport.md)
`tokens` | [UsageReport](UsageReport.md)
`tokensThisHour` | [UsageTotals](UsageTotals.md)
`timeline` | [Array&lt;SessionStateSpan&gt;](SessionStateSpan.md)

## Example

```typescript
import type { SessionCostReport } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "session": null,
  "window": null,
  "from": null,
  "to": null,
  "step": null,
  "infrastructure": null,
  "tokens": null,
  "tokensThisHour": null,
  "timeline": null,
} satisfies SessionCostReport

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionCostReport
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


