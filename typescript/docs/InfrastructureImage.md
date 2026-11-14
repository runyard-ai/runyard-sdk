
# InfrastructureImage


## Properties

Name | Type
------------ | -------------
`ref` | string
`state` | string
`sizeBytes` | number
`sandboxes` | number

## Example

```typescript
import type { InfrastructureImage } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "ref": null,
  "state": null,
  "sizeBytes": null,
  "sandboxes": null,
} satisfies InfrastructureImage

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as InfrastructureImage
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


