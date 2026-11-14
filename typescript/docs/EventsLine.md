
# EventsLine

One line of a session\'s events stream, which `line` says the kind of: an event of the transcript, a partial, or where the reader caught up. 

## Properties

Name | Type
------------ | -------------
`line` | string
`seq` | number
`at` | Date
`event` | [Event](Event.md)
`partial` | [ModelPartial](ModelPartial.md)
`caughtUp` | [CaughtUp](CaughtUp.md)

## Example

```typescript
import type { EventsLine } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "line": null,
  "seq": null,
  "at": null,
  "event": null,
  "partial": null,
  "caughtUp": null,
} satisfies EventsLine

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EventsLine
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


