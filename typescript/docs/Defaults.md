
# Defaults

What a session gets when it names nothing. Its model, which depends on the providers, is its harness\'s `defaultModel`.

## Properties

Name | Type
------------ | -------------
`harness` | string
`resources` | [Resources](Resources.md)
`idleSeconds` | number
`pageLimit` | number

## Example

```typescript
import type { Defaults } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "harness": claude-code,
  "resources": null,
  "idleSeconds": 900,
  "pageLimit": 100,
} satisfies Defaults

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Defaults
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


