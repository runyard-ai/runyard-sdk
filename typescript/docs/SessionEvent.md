
# SessionEvent


## Properties

Name | Type
------------ | -------------
`line` | string
`seq` | number
`at` | Date
`event` | [Event](Event.md)

## Example

```typescript
import type { SessionEvent } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "line": null,
  "seq": null,
  "at": null,
  "event": null,
} satisfies SessionEvent

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionEvent
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


