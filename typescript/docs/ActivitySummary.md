
# ActivitySummary

One request a session sent through a broker — or the platform sent to this server\'s API (`kind: api`) — said in a line. 

## Properties

Name | Type
------------ | -------------
`id` | string
`at` | Date
`sessionId` | string
`owner` | string
`broker` | string
`actor` | string
`kind` | string
`action` | string
`target` | string
`status` | number
`error` | string
`durationMs` | number
`outcome` | string
`bytesIn` | number
`bytesOut` | number

## Example

```typescript
import type { ActivitySummary } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "at": null,
  "sessionId": 0192f6a4-3c1e-7b2a-9d4e-5f6a7b8c9d0e,
  "owner": null,
  "broker": mcp-github,
  "actor": null,
  "kind": null,
  "action": call create_issue,
  "target": github,
  "status": null,
  "error": null,
  "durationMs": null,
  "outcome": null,
  "bytesIn": null,
  "bytesOut": null,
} satisfies ActivitySummary

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ActivitySummary
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


