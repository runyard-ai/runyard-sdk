
# UsageTokens

The same four for every provider. `input` is what was not read from the cache — OpenAI\'s `input_tokens` less its cached ones, which are `cacheRead`; OpenAI caches without charging a write, so its `cacheWrite` is 0. 

## Properties

Name | Type
------------ | -------------
`input` | number
`output` | number
`cacheWrite` | number
`cacheRead` | number
`reasoning` | number
`total` | number

## Example

```typescript
import type { UsageTokens } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "input": null,
  "output": null,
  "cacheWrite": null,
  "cacheRead": null,
  "reasoning": null,
  "total": null,
} satisfies UsageTokens

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UsageTokens
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


