
# Resources

A sandbox\'s size. Absent fields are the default; more than `limits.maxResources` is `400`.

## Properties

Name | Type
------------ | -------------
`cpus` | number
`memory` | string
`disk` | string

## Example

```typescript
import type { Resources } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "cpus": 2,
  "memory": 4Gi,
  "disk": 20Gi,
} satisfies Resources

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Resources
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


