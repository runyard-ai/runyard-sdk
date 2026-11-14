
# TunnelSpec


## Properties

Name | Type
------------ | -------------
`port` | number
`description` | string
`emails` | Array&lt;string&gt;

## Example

```typescript
import type { TunnelSpec } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "port": 8080,
  "description": null,
  "emails": null,
} satisfies TunnelSpec

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TunnelSpec
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


