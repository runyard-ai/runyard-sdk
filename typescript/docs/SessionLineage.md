
# SessionLineage


## Properties

Name | Type
------------ | -------------
`source` | [SessionSource](SessionSource.md)
`parentId` | string
`parentToolId` | string
`rootId` | string
`depth` | number
`branchedFrom` | [BranchedFrom](BranchedFrom.md)
`trigger` | [TriggerRef](TriggerRef.md)
`keyId` | string

## Example

```typescript
import type { SessionLineage } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "source": null,
  "parentId": 0192f6a4-3c1e-7b2a-9d4e-5f6a7b8c9d0e,
  "parentToolId": null,
  "rootId": 0192f6a4-3c1e-7b2a-9d4e-5f6a7b8c9d0e,
  "depth": null,
  "branchedFrom": null,
  "trigger": null,
  "keyId": null,
} satisfies SessionLineage

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionLineage
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


