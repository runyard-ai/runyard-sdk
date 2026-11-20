
# UserEventSource

Who sent it, from the key that did — `user` for a person signed in, or a session token in a browser; `system` for what the server told the session, as a background task ending; `alarm` for an alarm of the session\'s own that the server fired.

## Properties

Name | Type
------------ | -------------

## Example

```typescript
import type { UserEventSource } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
} satisfies UserEventSource

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserEventSource
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


