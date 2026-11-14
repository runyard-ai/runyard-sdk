
# SessionState

The session\'s state; the sandbox\'s is `sandbox.state`.  | state | what it means | what to do | |---|---|---| | `starting` | its sandbox is being made, or its harness started | wait; turns are queued | | `idle` | the session waits for a turn | send one | | `generating` | the session is answering | read the stream; a turn is queued | | `attached` | a person runs its harness in a terminal | wait for them to leave | | `sleeping` | its sandbox is released, its disk kept | send a turn, or wake it | | `archived` | asleep, and refusing turns | restore it | | `failed` | its sandbox could not be made, or the session could not be started, again and again | read `error`; delete it, or fork it | 

## Properties

Name | Type
------------ | -------------

## Example

```typescript
import type { SessionState } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
} satisfies SessionState

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionState
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


