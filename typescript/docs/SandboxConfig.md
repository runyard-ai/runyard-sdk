
# SandboxConfig


## Properties

Name | Type
------------ | -------------
`resources` | [Resources](Resources.md)
`idleSeconds` | number
`allow` | Array&lt;string&gt;
`internet` | boolean
`nested` | boolean
`placement` | [Placement](Placement.md)
`recipe` | string

## Example

```typescript
import type { SandboxConfig } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "resources": null,
  "idleSeconds": null,
  "allow": null,
  "internet": null,
  "nested": null,
  "placement": null,
  "recipe": FROM harness/claude-code
RUN --allow=deb.debian.org apt-get update && apt-get install -y ripgrep
,
} satisfies SandboxConfig

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SandboxConfig
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


