
# AlarmEvent

An alarm was set, fired, moved to the server, cancelled or expired.

## Properties

Name | Type
------------ | -------------
`type` | string
`alarm` | [Alarm](Alarm.md)

## Example

```typescript
import type { AlarmEvent } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "alarm": null,
} satisfies AlarmEvent

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AlarmEvent
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


