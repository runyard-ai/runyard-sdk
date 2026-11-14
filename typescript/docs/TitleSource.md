
# TitleSource

Where the session\'s title came from: `default`, none was had; `first_turn`, the first line of its first turn; `summary`, its provider summarized its conversation; `given`, a person or a program gave it. Absent on a session made before it was kept. 

## Properties

Name | Type
------------ | -------------

## Example

```typescript
import type { TitleSource } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
} satisfies TitleSource

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TitleSource
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


