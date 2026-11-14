
# ConnectLink


## Properties

Name | Type
------------ | -------------
`id` | string
`app` | [ConnectAppRef](ConnectAppRef.md)
`context` | string
`approvedBy` | string
`keyId` | string
`createdAt` | Date

## Example

```typescript
import type { ConnectLink } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": lnk_4f7k2m9q1x8c,
  "app": null,
  "context": null,
  "approvedBy": null,
  "keyId": null,
  "createdAt": null,
} satisfies ConnectLink

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ConnectLink
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


