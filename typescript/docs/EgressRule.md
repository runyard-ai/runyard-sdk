
# EgressRule


## Properties

Name | Type
------------ | -------------
`name` | string
`openedBySession` | boolean
`domains` | Array&lt;string&gt;
`cidrs` | Array&lt;string&gt;
`internet` | boolean
`ports` | Array&lt;string&gt;
`paused` | boolean

## Example

```typescript
import type { EgressRule } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": agent-pypi-org-3f2a9c1e,
  "openedBySession": null,
  "domains": null,
  "cidrs": null,
  "internet": null,
  "ports": ["tcp/443"],
  "paused": null,
} satisfies EgressRule

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EgressRule
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


