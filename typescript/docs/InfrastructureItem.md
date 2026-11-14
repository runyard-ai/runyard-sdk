
# InfrastructureItem

One thing of the workspace\'s sandboxes server: what it is now, when it is there, and what it costs, when it was metered in the window.

## Properties

Name | Type
------------ | -------------
`kind` | [InfrastructureKind](InfrastructureKind.md)
`id` | string
`name` | string
`there` | boolean
`window` | [CostWindow](CostWindow.md)
`currency` | string
`cost` | [CostResource](CostResource.md)
`ownedBy` | [InfrastructureOwner](InfrastructureOwner.md)
`madeBy` | string
`createdAt` | Date
`sandbox` | [InfrastructureSandbox](InfrastructureSandbox.md)
`volume` | [InfrastructureVolume](InfrastructureVolume.md)
`image` | [InfrastructureImage](InfrastructureImage.md)

## Example

```typescript
import type { InfrastructureItem } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "kind": null,
  "id": null,
  "name": null,
  "there": null,
  "window": null,
  "currency": null,
  "cost": null,
  "ownedBy": null,
  "madeBy": null,
  "createdAt": null,
  "sandbox": null,
  "volume": null,
  "image": null,
} satisfies InfrastructureItem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as InfrastructureItem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


