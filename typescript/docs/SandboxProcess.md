
# SandboxProcess

One process, as the guest says it is. A figure the guest did not give is absent. 

## Properties

Name | Type
------------ | -------------
`pid` | number
`ppid` | number
`name` | string
`state` | string
`argv` | Array&lt;string&gt;
`uid` | number
`user` | string
`threads` | number
`cpuPercent` | number
`memoryBytes` | number
`startedAt` | Date
`kernelThread` | boolean

## Example

```typescript
import type { SandboxProcess } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "pid": 42,
  "ppid": 1,
  "name": node,
  "state": S,
  "argv": ["node","server.js","--port","8080"],
  "uid": 1000,
  "user": node,
  "threads": 11,
  "cpuPercent": 12.5,
  "memoryBytes": 52428800,
  "startedAt": null,
  "kernelThread": null,
} satisfies SandboxProcess

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SandboxProcess
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


