
# Alarm


## Properties

Name | Type
------------ | -------------
`id` | string
`kind` | string
`prompt` | string
`cron` | string
`reason` | string
`recurring` | boolean
`durable` | boolean
`firedBy` | string
`state` | string
`createdAt` | Date
`nextAt` | Date
`lastFiredAt` | Date
`expiresAt` | Date

## Example

```typescript
import type { Alarm } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "kind": null,
  "prompt": null,
  "cron": */5 * * * *,
  "reason": null,
  "recurring": null,
  "durable": null,
  "firedBy": null,
  "state": null,
  "createdAt": null,
  "nextAt": null,
  "lastFiredAt": null,
  "expiresAt": null,
} satisfies Alarm

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Alarm
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


