
# ActivityExec

The program an entry of `kind: exec` says the machine ran, as the guest\'s kernel recorded it as the program was loaded, before it ran. It is what that kernel said: one changed by whoever is root in the machine can say anything. 

## Properties

Name | Type
------------ | -------------
`path` | string
`argv` | Array&lt;string&gt;
`cwd` | string
`pid` | number
`ppid` | number
`uid` | number
`euid` | number
`boot` | string
`seq` | number
`truncated` | boolean

## Example

```typescript
import type { ActivityExec } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "path": null,
  "argv": null,
  "cwd": null,
  "pid": null,
  "ppid": null,
  "uid": null,
  "euid": null,
  "boot": null,
  "seq": null,
  "truncated": null,
} satisfies ActivityExec

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ActivityExec
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


