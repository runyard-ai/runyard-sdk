
# ProviderUpdate


## Properties

Name | Type
------------ | -------------
`title` | string
`isDefault` | boolean
`everyone` | boolean
`users` | Array&lt;string&gt;

## Example

```typescript
import type { ProviderUpdate } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "title": null,
  "isDefault": null,
  "everyone": null,
  "users": null,
} satisfies ProviderUpdate

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProviderUpdate
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


