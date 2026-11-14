
# UsageBucket


## Properties

Name | Type
------------ | -------------
`requests` | number
`errors` | number
`tokens` | [UsageTokens](UsageTokens.md)
`start` | Date

## Example

```typescript
import type { UsageBucket } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "requests": null,
  "errors": null,
  "tokens": null,
  "start": null,
} satisfies UsageBucket

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UsageBucket
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


