
# Notice

Something the person should know and act on, as it stands now: it is gone once resolved. 

## Properties

Name | Type
------------ | -------------
`id` | string
`level` | string
`title` | string
`text` | string

## Example

```typescript
import type { Notice } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "level": null,
  "title": null,
  "text": null,
} satisfies Notice

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Notice
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


