
# DeploymentCommand


## Properties

Name | Type
------------ | -------------
`argv` | Array&lt;string&gt;
`dir` | string
`env` | { [key: string]: string; }
`user` | string
`timeoutSeconds` | number

## Example

```typescript
import type { DeploymentCommand } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "argv": null,
  "dir": null,
  "env": null,
  "user": null,
  "timeoutSeconds": null,
} satisfies DeploymentCommand

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DeploymentCommand
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


