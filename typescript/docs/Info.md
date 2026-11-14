
# Info


## Properties

Name | Type
------------ | -------------
`version` | string
`workspace` | [Workspace](Workspace.md)
`homeUrl` | string
`image` | string
`defaults` | [Defaults](Defaults.md)
`limits` | [Limits](Limits.md)
`identity` | [Identity](Identity.md)
`consoleKey` | string

## Example

```typescript
import type { Info } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "version": 0.1.0,
  "workspace": null,
  "homeUrl": null,
  "image": null,
  "defaults": null,
  "limits": null,
  "identity": null,
  "consoleKey": null,
} satisfies Info

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Info
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


