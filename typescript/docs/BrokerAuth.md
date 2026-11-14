
# BrokerAuth

How the sandboxes daemon proves to a declared broker which sandbox calls. Absent is `certificate`.  | auth | how | |---|---| | `certificate` | a TLS client certificate the daemon mints for the sandbox, the connection\'s bytes relayed as they are | | `jwt` | `Authorization: Bearer <jwt>` on every request, the daemon carrying the sandbox\'s requests as HTTP; the broker is any HTTP server, behind any proxy |  The token is ES256, signed with the key of the very certificate `certificate` would present, which it carries in `x5c`, for `aud` the broker\'s `url`: the broker verifies it as it would that certificate. The daemon puts it on in place of any `Authorization` the sandbox sent. 

## Properties

Name | Type
------------ | -------------

## Example

```typescript
import type { BrokerAuth } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
} satisfies BrokerAuth

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BrokerAuth
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


