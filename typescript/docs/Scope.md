
# Scope

| scope | lets a key | |---|---| | `sessions.read` | read sessions, their events, work and files, and usage | | `sessions.write` | start sessions, send turns, steer them, write files, share them | | `sessions.person` | have the sessions it starts and the turns it sends recorded as a person\'s (`source: user`) rather than its own (`api`): the key of a front end that signs its people in itself and speaks for them | | `sessions.delete` | delete sessions | | `sandbox` | open a session\'s terminal | | `profiles.write` | change profiles | | `brokers.write` | change brokers and MCP connectors | | `triggers.write` | change triggers | | `triggers.fire` | fire triggers — and nothing else, for a scheduler\'s key | | `keys.admin` | mint and revoke keys | | `providers.write` | make, change and remove providers | | `users.admin` | invite people into the workspace, make them its admins or members, remove them | | `settings.write` | change the workspace\'s settings | | `usage.read` | read the workspace\'s usage (`GET /v1/usage`), and nothing else: what the platform bills it by |  A member holds `sessions.read`, `sessions.write`, `sessions.delete`, `sandbox`, `keys.admin` and `providers.write`, over what is theirs; an admin holds every scope, over everything in the workspace. A key holds what it was given of what its person holds now. The platform, calling with a platform token, holds what the token names of `--platform-scopes`, and never `keys.admin`, `users.admin` or `sessions.person`. 

## Properties

Name | Type
------------ | -------------

## Example

```typescript
import type { Scope } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
} satisfies Scope

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Scope
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


