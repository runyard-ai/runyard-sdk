
# CaughtUpLine

Every event kept when the reader asked has been sent. Sent only while following, once.

## Properties

Name | Type
------------ | -------------
`line` | string
`caughtUp` | [CaughtUp](CaughtUp.md)

## Example

```typescript
import type { CaughtUpLine } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "line": null,
  "caughtUp": null,
} satisfies CaughtUpLine

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CaughtUpLine
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


