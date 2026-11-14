
# ImageRequest


## Properties

Name | Type
------------ | -------------
`recipe` | string
`name` | string
`description` | string

## Example

```typescript
import type { ImageRequest } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "recipe": null,
  "name": Coder,
  "description": Go, Node and the GitHub CLI, for working on runyard.,
} satisfies ImageRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ImageRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


