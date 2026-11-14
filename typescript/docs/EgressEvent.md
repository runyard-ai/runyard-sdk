
# EgressEvent

What the session\'s sandbox may reach changed; this is all of it now. Written when a sandbox wakes with rules other than the last ones written, when the session opens or closes a host, and when a rule is dropped (`DELETE /v1/sessions/{sessionId}/egress/{ruleName}`). 

## Properties

Name | Type
------------ | -------------
`type` | string
`rules` | [Array&lt;EgressRule&gt;](EgressRule.md)

## Example

```typescript
import type { EgressEvent } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "rules": null,
} satisfies EgressEvent

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EgressEvent
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


