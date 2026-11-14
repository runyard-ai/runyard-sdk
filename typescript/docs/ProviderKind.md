
# ProviderKind

An API key (`PUT`), or a subscription signed in (`…/signin`): a Claude plan for `anthropic`, a ChatGPT plan for `openai`. An `openai_compatible` provider is an `api_key`, whether or not it was given one.  When the workspace\'s shared broker `llm` is one its runners provide (declared `url: runner` on the sandboxes server), a session on an `anthropic` or `openai` provider reaches the model through its runner\'s `llm` broker, which this server lends the credential to for each turn alone, and takes it back from when the turn ends. 

## Properties

Name | Type
------------ | -------------

## Example

```typescript
import type { ProviderKind } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
} satisfies ProviderKind

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ProviderKind
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


