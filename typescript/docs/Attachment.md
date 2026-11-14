
# Attachment

| kind | what it is | |---|---| | `file` | a file on the session\'s disk, at `path` | | `upload` | a file uploaded for the turn, `uploadId`; once the turn is taken, its `name` is said too — while it waits in the queue as well — and once the session is given it, the `path` it was put at | | `quote` | `text` quoted from a session\'s event, `sessionId` and `seq` | | `session` | another session, `sessionId`, referenced for the session to read through the `sessions` broker, and from then on its to read; its title is said as `name`, the server\'s to say. One the caller cannot read is refused | 

## Properties

Name | Type
------------ | -------------
`kind` | string
`path` | string
`uploadId` | string
`name` | string
`text` | string
`sessionId` | string
`seq` | number

## Example

```typescript
import type { Attachment } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "kind": null,
  "path": null,
  "uploadId": null,
  "name": null,
  "text": null,
  "sessionId": 0192f6a4-3c1e-7b2a-9d4e-5f6a7b8c9d0e,
  "seq": null,
} satisfies Attachment

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Attachment
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


