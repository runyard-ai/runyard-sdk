
# TasksEvent

The session\'s task list changed; this is all of it now.

## Properties

Name | Type
------------ | -------------
`type` | string
`tasks` | [Array&lt;Task&gt;](Task.md)

## Example

```typescript
import type { TasksEvent } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "tasks": null,
} satisfies TasksEvent

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TasksEvent
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


