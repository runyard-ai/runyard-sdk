
# RateLimitWindow


## Properties

Name | Type
------------ | -------------
`name` | string
`windowMinutes` | number
`utilization` | number
`resetsAt` | Date

## Example

```typescript
import type { RateLimitWindow } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": primary,
  "windowMinutes": 300,
  "utilization": 0.42,
  "resetsAt": null,
} satisfies RateLimitWindow

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RateLimitWindow
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


