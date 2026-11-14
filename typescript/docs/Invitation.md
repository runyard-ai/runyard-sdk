
# Invitation


## Properties

Name | Type
------------ | -------------
`id` | string
`role` | [Role](Role.md)
`email` | string
`createdBy` | string
`createdAt` | Date
`expiresAt` | Date

## Example

```typescript
import type { Invitation } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": k7d2m9x4p1qa,
  "role": null,
  "email": null,
  "createdBy": null,
  "createdAt": null,
  "expiresAt": null,
} satisfies Invitation

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Invitation
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


