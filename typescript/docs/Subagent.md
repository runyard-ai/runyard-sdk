
# Subagent


## Properties

Name | Type
------------ | -------------
`id` | string
`parentId` | string
`type` | string
`description` | string
`running` | boolean
`async` | boolean
`steps` | number
`startedAt` | Date
`endedAt` | Date
`startSeq` | number
`usage` | [Usage](Usage.md)

## Example

```typescript
import type { Subagent } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "parentId": null,
  "type": Explore,
  "description": null,
  "running": null,
  "async": null,
  "steps": null,
  "startedAt": null,
  "endedAt": null,
  "startSeq": null,
  "usage": null,
} satisfies Subagent

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Subagent
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


