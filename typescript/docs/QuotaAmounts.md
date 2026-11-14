
# QuotaAmounts


## Properties

Name | Type
------------ | -------------
`cpus` | number
`memoryBytes` | number
`diskBytes` | number

## Example

```typescript
import type { QuotaAmounts } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "cpus": null,
  "memoryBytes": null,
  "diskBytes": null,
} satisfies QuotaAmounts

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as QuotaAmounts
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


