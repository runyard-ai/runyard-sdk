
# DirectoryOrg


## Properties

Name | Type
------------ | -------------
`id` | string
`handle` | string
`name` | string
`kind` | string
`role` | string

## Example

```typescript
import type { DirectoryOrg } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": acc_7qx2,
  "handle": acme-7qx2,
  "name": Acme,
  "kind": null,
  "role": null,
} satisfies DirectoryOrg

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DirectoryOrg
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


