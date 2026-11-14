
# SessionUsage


## Properties

Name | Type
------------ | -------------
`sessionId` | string
`title` | string
`totals` | [UsageTotals](UsageTotals.md)

## Example

```typescript
import type { SessionUsage } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "sessionId": 0192f6a4-3c1e-7b2a-9d4e-5f6a7b8c9d0e,
  "title": null,
  "totals": null,
} satisfies SessionUsage

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionUsage
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


