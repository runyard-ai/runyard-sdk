
# EndUser

Somebody an application signs in itself, whom a session, a provider or a turn of the application\'s is for. No person of the workspace: no role, no sign-in, no key. 

## Properties

Name | Type
------------ | -------------
`id` | string
`email` | string

## Example

```typescript
import type { EndUser } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": u123,
  "email": null,
} satisfies EndUser

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EndUser
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


