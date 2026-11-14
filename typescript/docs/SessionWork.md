
# SessionWork

What it is doing besides answering, counted — what a list shows.

## Properties

Name | Type
------------ | -------------
`queuedTurns` | number
`subagentsRunning` | number
`backgroundTasksRunning` | number
`tasksOpen` | number
`alarmsPending` | number

## Example

```typescript
import type { SessionWork } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "queuedTurns": null,
  "subagentsRunning": null,
  "backgroundTasksRunning": null,
  "tasksOpen": null,
  "alarmsPending": null,
} satisfies SessionWork

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionWork
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


