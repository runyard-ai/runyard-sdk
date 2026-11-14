
# Schedule

For `schedule`.

## Properties

Name | Type
------------ | -------------
`cron` | string
`timezone` | string

## Example

```typescript
import type { Schedule } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "cron": 0 7 * * 1-5,
  "timezone": Europe/Paris,
} satisfies Schedule

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Schedule
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


