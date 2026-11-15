
# Event

What happened, by `type`. Everything a session wrote — text, tool input, tool output — is the session\'s, and the session read things written by anybody: render it as text, never as markup.  `parentToolId`, where present, is the sub-agent that produced the event; absent, it is the session\'s own harness. 

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
`turnId` | string
`text` | string
`attachments` | [Array&lt;Attachment&gt;](Attachment.md)
`source` | [UserEventSource](UserEventSource.md)
`keyId` | string
`compact` | boolean
`parentToolId` | string
`toolId` | string
`name` | string
`input` | { [key: string]: any; }
`content` | string
`isError` | boolean
`truncated` | boolean
`images` | [Array&lt;ToolImage&gt;](ToolImage.md)
`stopReason` | string
`usage` | [Usage](Usage.md)
`trigger` | string
`preTokens` | number
`postTokens` | number
`toSeq` | number
`subagent` | [Subagent](Subagent.md)
`task` | [BackgroundTask](BackgroundTask.md)
`alarm` | [Alarm](Alarm.md)
`tasks` | [Array&lt;Task&gt;](Task.md)
`rules` | [Array&lt;EgressRule&gt;](EgressRule.md)
`sessionId` | string
`title` | string
`state` | [SessionState](SessionState.md)
`sandboxState` | [SandboxState](SandboxState.md)
`reason` | string
`starting` | [SessionStarting](SessionStarting.md)
`code` | string
`message` | string
`retrying` | boolean

## Example

```typescript
import type { Event } from '@runyard-ai/runyard-sdk'

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
  "turnId": null,
  "text": null,
  "attachments": null,
  "source": null,
  "keyId": null,
  "compact": null,
  "parentToolId": null,
  "toolId": null,
  "name": Bash,
  "input": null,
  "content": null,
  "isError": null,
  "truncated": null,
  "images": null,
  "stopReason": null,
  "usage": null,
  "trigger": null,
  "preTokens": null,
  "postTokens": null,
  "toSeq": null,
  "subagent": null,
  "task": null,
  "alarm": null,
  "tasks": null,
  "rules": null,
  "sessionId": 0192f6a4-3c1e-7b2a-9d4e-5f6a7b8c9d0e,
  "title": null,
  "state": null,
  "sandboxState": null,
  "reason": null,
  "starting": null,
  "code": null,
  "message": null,
  "retrying": null,
} satisfies Event

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Event
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


