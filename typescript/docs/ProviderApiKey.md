
# ProviderApiKey


## Properties

Name | Type
------------ | -------------
`type` | [ProviderType](ProviderType.md)
`kind` | [ProviderKind](ProviderKind.md)
`title` | string
`secret` | string
`placement` | [Placement](Placement.md)
`models` | [Array&lt;ModelWrite&gt;](ModelWrite.md)

## Example

```typescript
import type { ProviderApiKey } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "kind": null,
  "title": null,
  "secret": null,
  "placement": null,
  "models": null,
} satisfies ProviderApiKey

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProviderApiKey
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


