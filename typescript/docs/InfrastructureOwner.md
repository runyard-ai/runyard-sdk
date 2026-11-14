
# InfrastructureOwner


## Properties

Name | Type
------------ | -------------
`session` | [SessionRef](SessionRef.md)
`deployment` | string
`image` | string

## Example

```typescript
import type { InfrastructureOwner } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "session": null,
  "deployment": null,
  "image": null,
} satisfies InfrastructureOwner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as InfrastructureOwner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


