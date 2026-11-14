
# Key


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`owner` | string
`scopes` | [Array&lt;Scope&gt;](Scope.md)
`createdAt` | Date
`expiresAt` | Date
`lastUsedAt` | Date
`link` | boolean
`suspended` | [KeySuspension](KeySuspension.md)

## Example

```typescript
import type { Key } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": k7d2m9x4p1qa,
  "name": null,
  "owner": null,
  "scopes": null,
  "createdAt": null,
  "expiresAt": null,
  "lastUsedAt": null,
  "link": null,
  "suspended": null,
} satisfies Key

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Key
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


