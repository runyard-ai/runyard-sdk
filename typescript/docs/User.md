
# User

A person of the workspace, in their role in it.

## Properties

Name | Type
------------ | -------------
`email` | string
`name` | string
`role` | [Role](Role.md)
`owner` | boolean
`invitedBy` | string
`createdAt` | Date
`lastSeenAt` | Date
`offboardedAt` | Date

## Example

```typescript
import type { User } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "email": null,
  "name": null,
  "role": null,
  "owner": null,
  "invitedBy": null,
  "createdAt": null,
  "lastSeenAt": null,
  "offboardedAt": null,
} satisfies User

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as User
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


