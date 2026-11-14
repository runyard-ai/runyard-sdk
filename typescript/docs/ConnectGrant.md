
# ConnectGrant


## Properties

Name | Type
------------ | -------------
`link` | string
`workspace` | [ConnectGrantWorkspace](ConnectGrantWorkspace.md)
`sessions` | [ConnectGrantSessions](ConnectGrantSessions.md)
`approvedBy` | string

## Example

```typescript
import type { ConnectGrant } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "link": lnk_4f7k2m9q1x8c,
  "workspace": null,
  "sessions": null,
  "approvedBy": null,
} satisfies ConnectGrant

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ConnectGrant
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


