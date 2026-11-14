
# CostResource

One thing that cost anything in the window, or was held in it: what it was when it was last seen, what it used and cost, and, while it is held, what it costs an hour.

## Properties

Name | Type
------------ | -------------
`kind` | [CostKind](CostKind.md)
`id` | string
`name` | string
`labels` | { [key: string]: string; }
`cpus` | number
`memoryBytes` | number
`diskBytes` | number
`live` | boolean
`paused` | boolean
`perHour` | number
`firstSeenAt` | Date
`lastSeenAt` | Date
`use` | [CostUse](CostUse.md)
`charge` | [CostCharge](CostCharge.md)
`cost` | number
`session` | [CostResourceSession](CostResourceSession.md)
`deployment` | string

## Example

```typescript
import type { CostResource } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "kind": null,
  "id": null,
  "name": null,
  "labels": null,
  "cpus": null,
  "memoryBytes": null,
  "diskBytes": null,
  "live": null,
  "paused": null,
  "perHour": null,
  "firstSeenAt": null,
  "lastSeenAt": null,
  "use": null,
  "charge": null,
  "cost": null,
  "session": null,
  "deployment": null,
} satisfies CostResource

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CostResource
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


