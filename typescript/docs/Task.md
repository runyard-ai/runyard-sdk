
# Task


## Properties

Name | Type
------------ | -------------
`id` | string
`subject` | string
`description` | string
`activeForm` | string
`status` | [TaskStatus](TaskStatus.md)
`owner` | string
`blockedBy` | Array&lt;string&gt;
`updatedAt` | Date

## Example

```typescript
import type { Task } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "subject": null,
  "description": null,
  "activeForm": null,
  "status": null,
  "owner": null,
  "blockedBy": null,
  "updatedAt": null,
} satisfies Task

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Task
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


