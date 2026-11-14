
# SelfDirectory

What the platform last said the caller\'s person may reach, as its `GET /api/me` lists it.

## Properties

Name | Type
------------ | -------------
`homeUrl` | string
`orgs` | [Array&lt;DirectoryOrg&gt;](DirectoryOrg.md)
`workspaces` | [Array&lt;DirectoryWorkspace&gt;](DirectoryWorkspace.md)
`current` | [SelfDirectoryCurrent](SelfDirectoryCurrent.md)
`fetchedAt` | Date

## Example

```typescript
import type { SelfDirectory } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "homeUrl": null,
  "orgs": null,
  "workspaces": null,
  "current": null,
  "fetchedAt": null,
} satisfies SelfDirectory

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SelfDirectory
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


