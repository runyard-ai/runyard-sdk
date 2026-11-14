
# TriggerSpec


## Properties

Name | Type
------------ | -------------
`kind` | string
`title` | string
`profileId` | string
`overrides` | [SessionConfig](SessionConfig.md)
`turn` | string
`schedule` | [Schedule](Schedule.md)
`webhook` | [Webhook](Webhook.md)
`concurrency` | string
`enabled` | boolean
`labels` | { [key: string]: string; }

## Example

```typescript
import type { TriggerSpec } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "kind": null,
  "title": null,
  "profileId": 0192f6a4-3c1e-7b2a-9d4e-5f6a7b8c9d0e,
  "overrides": null,
  "turn": Review pull request {{input.pull_request.html_url}},
  "schedule": null,
  "webhook": null,
  "concurrency": null,
  "enabled": null,
  "labels": null,
} satisfies TriggerSpec

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TriggerSpec
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


