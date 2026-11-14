
# NewConnectApp


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`redirectUris` | Array&lt;string&gt;
`scopes` | [Array&lt;Scope&gt;](Scope.md)

## Example

```typescript
import type { NewConnectApp } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": acme-app,
  "name": null,
  "redirectUris": null,
  "scopes": null,
} satisfies NewConnectApp

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as NewConnectApp
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


