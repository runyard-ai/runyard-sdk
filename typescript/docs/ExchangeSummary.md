
# ExchangeSummary

One call a session\'s harness made to the model, in short.

## Properties

Name | Type
------------ | -------------
`id` | string
`at` | Date
`durationMs` | number
`provider` | string
`path` | string
`model` | string
`status` | number
`stopReason` | string
`usage` | [UsageTokens](UsageTokens.md)
`cost` | [ExchangeCost](ExchangeCost.md)
`messageCount` | number
`toolCount` | number
`systemChars` | number

## Example

```typescript
import type { ExchangeSummary } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "at": null,
  "durationMs": null,
  "provider": github,
  "path": /v1/messages,
  "model": claude-opus-5-5,
  "status": 200,
  "stopReason": tool_use,
  "usage": null,
  "cost": null,
  "messageCount": null,
  "toolCount": null,
  "systemChars": null,
} satisfies ExchangeSummary

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ExchangeSummary
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


