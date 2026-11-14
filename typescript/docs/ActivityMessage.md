
# ActivityMessage

A request or an answer as it was sent.

## Properties

Name | Type
------------ | -------------
`method` | string
`url` | string
`status` | number
`headers` | { [key: string]: Array&lt;string&gt;; }
`body` | string
`bodyEncoding` | [BodyEncoding](BodyEncoding.md)
`size` | number
`truncated` | boolean

## Example

```typescript
import type { ActivityMessage } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "method": null,
  "url": null,
  "status": null,
  "headers": null,
  "body": null,
  "bodyEncoding": null,
  "size": null,
  "truncated": null,
} satisfies ActivityMessage

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ActivityMessage
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


