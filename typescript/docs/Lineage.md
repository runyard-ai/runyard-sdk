
# Lineage


## Properties

Name | Type
------------ | -------------
`nodes` | [Array&lt;LineageNode&gt;](LineageNode.md)
`truncated` | boolean

## Example

```typescript
import type { Lineage } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "nodes": null,
  "truncated": null,
} satisfies Lineage

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Lineage
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


