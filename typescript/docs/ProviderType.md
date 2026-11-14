
# ProviderType

Whose API a provider reaches. A harness says which types it runs on. `openai_compatible` is a server of OpenAI\'s chat completions that is not OpenAI\'s — llama.cpp\'s llama-server, vLLM — at the provider\'s `baseUrl`. 

## Properties

Name | Type
------------ | -------------

## Example

```typescript
import type { ProviderType } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
} satisfies ProviderType

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProviderType
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


