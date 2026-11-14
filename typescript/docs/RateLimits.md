
# RateLimits

The provider\'s latest word on how much of the credential\'s limits is spent, read off its answers to the sessions\' calls: Anthropic\'s `anthropic-ratelimit-unified-*` headers for a Claude plan, the `x-codex-*` ones for a ChatGPT plan, and `x-ratelimit-*` for an API key. Absent until a call has been made. 

## Properties

Name | Type
------------ | -------------
`status` | string
`fiveHour` | [RateLimitWindow](RateLimitWindow.md)
`sevenDay` | [RateLimitWindow](RateLimitWindow.md)
`windows` | [Array&lt;RateLimitWindow&gt;](RateLimitWindow.md)
`credits` | [RateLimitCredits](RateLimitCredits.md)
`observedAt` | Date

## Example

```typescript
import type { RateLimits } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "status": allowed,
  "fiveHour": null,
  "sevenDay": null,
  "windows": null,
  "credits": null,
  "observedAt": null,
} satisfies RateLimits

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RateLimits
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


