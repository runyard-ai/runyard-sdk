
# NewKey


## Properties

Name | Type
------------ | -------------
`name` | string
`app` | string
`scopes` | [Array&lt;Scope&gt;](Scope.md)
`expiresAt` | Date

## Example

```typescript
import type { NewKey } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "app": acme-app,
  "scopes": null,
  "expiresAt": null,
} satisfies NewKey

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as NewKey
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


