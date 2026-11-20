
# Provider

A named credential for a provider\'s API, never the credential itself.

## Properties

Name | Type
------------ | -------------
`name` | string
`title` | string
`owner` | string
`endUser` | [EndUser](EndUser.md)
`everyone` | boolean
`users` | Array&lt;string&gt;
`type` | [ProviderType](ProviderType.md)
`kind` | [ProviderKind](ProviderKind.md)
`baseUrl` | string
`status` | string
`account` | string
`plan` | string
`isDefault` | boolean
`expiresAt` | Date
`renewedAt` | Date
`checkedAt` | Date
`limits` | [RateLimits](RateLimits.md)
`models` | [Array&lt;Model&gt;](Model.md)
`modelsReadAt` | Date
`modelsError` | string

## Example

```typescript
import type { Provider } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": github,
  "title": Work subscription,
  "owner": ada@example.com,
  "endUser": null,
  "everyone": null,
  "users": null,
  "type": null,
  "kind": null,
  "baseUrl": http://192.168.1.20:8080,
  "status": null,
  "account": null,
  "plan": max,
  "isDefault": null,
  "expiresAt": null,
  "renewedAt": null,
  "checkedAt": null,
  "limits": null,
  "models": null,
  "modelsReadAt": null,
  "modelsError": null,
} satisfies Provider

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Provider
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


