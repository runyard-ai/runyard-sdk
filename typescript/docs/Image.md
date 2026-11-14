
# Image


## Properties

Name | Type
------------ | -------------
`id` | string
`recipe` | string
`name` | string
`description` | string
`state` | [ImageState](ImageState.md)
`error` | string
`ref` | string
`createdAt` | Date
`finishedAt` | Date

## Example

```typescript
import type { Image } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": img_4c1e9a7f2b06d3a1,
  "recipe": null,
  "name": Coder,
  "description": Go, Node and the GitHub CLI, for working on runyard.,
  "state": null,
  "error": null,
  "ref": 127.0.0.1:5002/runyard/agents/img_4c1e9a7f2b06d3a1@sha256:1805c461…,
  "createdAt": null,
  "finishedAt": null,
} satisfies Image

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Image
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


