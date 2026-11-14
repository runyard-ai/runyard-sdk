
# FileEntry


## Properties

Name | Type
------------ | -------------
`name` | string
`kind` | string
`size` | number
`modifiedAt` | Date

## Example

```typescript
import type { FileEntry } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "kind": null,
  "size": null,
  "modifiedAt": null,
} satisfies FileEntry

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FileEntry
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


