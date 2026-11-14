
# SessionStartedEvent

The session is up — at the start, and again each time it is restarted or woken.

## Properties

Name | Type
------------ | -------------
`type` | string
`harness` | string
`harnessVersion` | string
`model` | string
`cwd` | string
`contextWindow` | number
`tools` | [Array&lt;SessionTool&gt;](SessionTool.md)
`brokers` | [Array&lt;SessionBroker&gt;](SessionBroker.md)
`mcpConnectors` | [Array&lt;SessionMcpConnector&gt;](SessionMcpConnector.md)
`skills` | [Array&lt;SessionSkill&gt;](SessionSkill.md)
`skillsNotGiven` | [Array&lt;SessionSkill&gt;](SessionSkill.md)

## Example

```typescript
import type { SessionStartedEvent } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "harness": null,
  "harnessVersion": null,
  "model": null,
  "cwd": null,
  "contextWindow": null,
  "tools": null,
  "brokers": null,
  "mcpConnectors": null,
  "skills": null,
  "skillsNotGiven": null,
} satisfies SessionStartedEvent

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionStartedEvent
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


