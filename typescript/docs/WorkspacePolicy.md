
# WorkspacePolicy

What the operator lets the workspace\'s sessions have: the file `--policy-file` names, read when the server starts, and shown here read-only. A change is a restart, and reaches each session as it next wakes. 

## Properties

Name | Type
------------ | -------------
`brokers` | [Array&lt;BuiltInBroker&gt;](BuiltInBroker.md)
`egress` | Array&lt;string&gt;

## Example

```typescript
import type { WorkspacePolicy } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "brokers": null,
  "egress": null,
} satisfies WorkspacePolicy

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WorkspacePolicy
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


