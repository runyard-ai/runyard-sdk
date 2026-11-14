
# DeploymentState

| state | what it means | |---|---| | `booting` | its sandbox is being made or booted | | `running` | its entrypoint runs | | `stopped` | switched off, its disk kept; `start` boots it | | `expired` | stopped because `expiresAt` passed; `start` boots it | | `failed` | its sandbox failed; `error` says why | 

## Properties

Name | Type
------------ | -------------

## Example

```typescript
import type { DeploymentState } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
} satisfies DeploymentState

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DeploymentState
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


