
# DirectoryWorkspace


## Properties

Name | Type
------------ | -------------
`id` | string
`slug` | string
`title` | string
`org` | string
`url` | string
`access` | string

## Example

```typescript
import type { DirectoryWorkspace } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": wsp_p4m1,
  "slug": research-p4m1,
  "title": Research,
  "org": acme-7qx2,
  "url": https://research-p4m1.example.com,
  "access": null,
} satisfies DirectoryWorkspace

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DirectoryWorkspace
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


