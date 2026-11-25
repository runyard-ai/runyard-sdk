
# SessionStarting

What a session that is `starting` is doing, and how far it got. Kept on one whose start `failed`, saying where (`failed`), until it starts again; absent otherwise.  | phase | what it means | |---|---| | `image` | its sandbox is being made: its image had on the runner it is placed on — pulled and unpacked, the first time that runner runs it, which takes minutes for an image of a few GB — and its disk and network made | | `booting` | its sandbox is booting | | `harness` | its harness is being started in its sandbox |  A start goes through them in that order. `image` is waited for up to 20 minutes, and `booting` up to 3 from when it began; past either, the start fails. 

## Properties

Name | Type
------------ | -------------
`phase` | string
`since` | Date
`failed` | boolean

## Example

```typescript
import type { SessionStarting } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "phase": null,
  "since": null,
  "failed": null,
} satisfies SessionStarting

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionStarting
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


