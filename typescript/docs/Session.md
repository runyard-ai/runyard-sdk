
# Session


## Properties

Name | Type
------------ | -------------
`id` | string
`title` | string
`titleSource` | [TitleSource](TitleSource.md)
`autoTitle` | boolean
`owner` | string
`endUser` | [EndUser](EndUser.md)
`state` | [SessionState](SessionState.md)
`error` | string
`profile` | [ProfileRef](ProfileRef.md)
`config` | [SessionConfig](SessionConfig.md)
`sandbox` | [SessionSandbox](SessionSandbox.md)
`starting` | [SessionStarting](SessionStarting.md)
`lineage` | [SessionLineage](SessionLineage.md)
`labels` | { [key: string]: string; }
`work` | [SessionWork](SessionWork.md)
`queue` | [Array&lt;QueuedTurn&gt;](QueuedTurn.md)
`usage` | [Usage](Usage.md)
`pendingUsage` | [Usage](Usage.md)
`firstSeq` | number
`lastSeq` | number
`createdAt` | Date
`lastActivityAt` | Date
`nextAlarmAt` | Date
`archivedAt` | Date
`pausedAt` | Date
`idleSince` | Date
`locked` | boolean
`pinned` | boolean

## Example

```typescript
import type { Session } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": 0192f6a4-3c1e-7b2a-9d4e-5f6a7b8c9d0e,
  "title": null,
  "titleSource": null,
  "autoTitle": null,
  "owner": ada@example.com,
  "endUser": null,
  "state": null,
  "error": null,
  "profile": null,
  "config": null,
  "sandbox": null,
  "starting": null,
  "lineage": null,
  "labels": null,
  "work": null,
  "queue": null,
  "usage": null,
  "pendingUsage": null,
  "firstSeq": null,
  "lastSeq": null,
  "createdAt": null,
  "lastActivityAt": null,
  "nextAlarmAt": null,
  "archivedAt": null,
  "pausedAt": null,
  "idleSince": null,
  "locked": null,
  "pinned": null,
} satisfies Session

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Session
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


