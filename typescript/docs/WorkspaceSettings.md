
# WorkspaceSettings


## Properties

Name | Type
------------ | -------------
`sessionRetention` | [SessionRetention](SessionRetention.md)
`titleSummaries` | boolean

## Example

```typescript
import type { WorkspaceSettings } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "sessionRetention": null,
  "titleSummaries": null,
} satisfies WorkspaceSettings

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WorkspaceSettings
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


