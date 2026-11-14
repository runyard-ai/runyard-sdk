
# BackgroundTask


## Properties

Name | Type
------------ | -------------
`id` | string
`kind` | string
`description` | string
`command` | string
`state` | string
`startedAt` | Date
`endedAt` | Date
`outputPath` | string

## Example

```typescript
import type { BackgroundTask } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "kind": null,
  "description": null,
  "command": null,
  "state": null,
  "startedAt": null,
  "endedAt": null,
  "outputPath": null,
} satisfies BackgroundTask

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BackgroundTask
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


