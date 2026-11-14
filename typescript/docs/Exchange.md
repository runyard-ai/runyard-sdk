
# Exchange

One call a session\'s harness made to the model, whole: the record of what it sent, and what it was answered. 

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
`request` | { [key: string]: any; }
`requestHeaders` | { [key: string]: string; }
`response` | { [key: string]: any; }
`responseHeaders` | { [key: string]: string; }
`previousId` | string
`nextId` | string

## Example

```typescript
import type { Exchange } from '@runyard-ai/runyard-sdk'

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
  "request": null,
  "requestHeaders": null,
  "response": null,
  "responseHeaders": null,
  "previousId": null,
  "nextId": null,
} satisfies Exchange

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Exchange
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


