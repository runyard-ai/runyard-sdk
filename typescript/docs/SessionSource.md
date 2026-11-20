
# SessionSource

| source | started by | |---|---| | `user` | a person, in the chat UI or console, or a session token in their browser | | `api` | a caller with a key | | `session` | another session\'s harness — `parentId` | | `fork` | forking another session — `branchedFrom` | | `trigger` | a trigger\'s firing — `trigger` | 

## Properties

Name | Type
------------ | -------------

## Example

```typescript
import type { SessionSource } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
} satisfies SessionSource

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionSource
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


