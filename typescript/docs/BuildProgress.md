
# BuildProgress

How far the build of an image has got.

## Properties

Name | Type
------------ | -------------
`image` | string
`step` | number
`steps` | number
`instruction` | string
`stepSince` | Date
`logTail` | Array&lt;string&gt;

## Example

```typescript
import type { BuildProgress } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "image": img_4c1e9a7f2b06d3a1,
  "step": null,
  "steps": null,
  "instruction": RUN go install github.com/bufbuild/buf/cmd/buf@v1.47.2,
  "stepSince": null,
  "logTail": null,
} satisfies BuildProgress

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BuildProgress
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


