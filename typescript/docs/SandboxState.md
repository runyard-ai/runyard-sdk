
# SandboxState

| state | what it means | |---|---| | `creating` | asked of runyard-sandboxes | | `booting` | made, and starting | | `ready` | up | | `unreachable` | up, and not answering | | `released` | given back while the session sleeps; the disk is kept | | `failed` | could not be made, or died; `error` says why | 

## Properties

Name | Type
------------ | -------------

## Example

```typescript
import type { SandboxState } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
} satisfies SandboxState

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SandboxState
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


