
# NewInvitation


## Properties

Name | Type
------------ | -------------
`role` | [Role](Role.md)
`email` | string
`expiresInDays` | number

## Example

```typescript
import type { NewInvitation } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "role": null,
  "email": null,
  "expiresInDays": null,
} satisfies NewInvitation

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as NewInvitation
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


