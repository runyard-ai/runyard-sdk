
# ConnectApp

An application that may ask the workspace\'s admins for a key (`GET /v1/connect/authorize`). Its secret is never here, nor its hash. 

## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`redirectUris` | Array&lt;string&gt;
`scopes` | [Array&lt;Scope&gt;](Scope.md)
`source` | [ConnectAppSource](ConnectAppSource.md)
`createdAt` | Date

## Example

```typescript
import type { ConnectApp } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": acme-app,
  "name": Acme App,
  "redirectUris": ["https://acme-app.example/runyard/callback"],
  "scopes": null,
  "source": null,
  "createdAt": null,
} satisfies ConnectApp

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ConnectApp
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


