
# TaskPage


## Properties

Name | Type
------------ | -------------
`nextCursor` | string
`items` | [Array&lt;SessionTask&gt;](SessionTask.md)

## Example

```typescript
import type { TaskPage } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "nextCursor": null,
  "items": null,
} satisfies TaskPage

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TaskPage
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


