
# Limits


## Properties

Name | Type
------------ | -------------
`maxResources` | [Resources](Resources.md)
`maxPageLimit` | number
`eventsKept` | number
`changesKept` | number
`maxLineage` | number
`maxDepth` | number
`maxFileBytes` | number
`uploadTtlSeconds` | number

## Example

```typescript
import type { Limits } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "maxResources": null,
  "maxPageLimit": 500,
  "eventsKept": null,
  "changesKept": 10000,
  "maxLineage": 200,
  "maxDepth": 8,
  "maxFileBytes": 104857600,
  "uploadTtlSeconds": 86400,
} satisfies Limits

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Limits
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


