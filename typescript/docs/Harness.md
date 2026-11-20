
# Harness


## Properties

Name | Type
------------ | -------------
`name` | string
`title` | string
`bundle` | string
`providerTypes` | [Array&lt;ProviderType&gt;](ProviderType.md)
`models` | [Array&lt;HarnessModel&gt;](HarnessModel.md)
`defaultProvider` | string
`defaultModel` | string
`features` | [Array&lt;HarnessFeature&gt;](HarnessFeature.md)

## Example

```typescript
import type { Harness } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": claude-code,
  "title": Claude Code,
  "bundle": releases.runyard.ai/runyard-public/bundle-claude@sha256:9b1c…,
  "providerTypes": null,
  "models": null,
  "defaultProvider": github,
  "defaultModel": claude-opus-5-5,
  "features": null,
} satisfies Harness

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Harness
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


