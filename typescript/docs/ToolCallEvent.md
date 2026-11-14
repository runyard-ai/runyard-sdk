
# ToolCallEvent

A tool the session called, by the harness\'s own name for it, with what it was given; its `tool_result` follows with the same `toolId`. Claude Code\'s are its tools\' (`Bash`, `Edit`, …, and `mcp__<server>__<tool>`). Codex\'s are:  - `shell` — a command run: `{\"command\": \"<the command line>\",   \"cwd\": \"<where>\"}`; its result is the command\'s output, `isError`   when it exited other than 0. - `apply_patch` — files changed: `{\"changes\": [{\"path\": \"…\",   \"kind\": \"add\" | \"delete\" | \"update\", \"movePath\"?: \"…\", \"diff\":   \"<unified diff; an added file\'s content>\"}]}`; its result is   `applied`, or why not with `isError`. - `mcp__<server>__<tool>` — an MCP tool, as Claude Code names   them, its arguments as the input. - `web_search` — `{\"query\": \"…\"}`. - `view_image` — `{\"path\": \"…\"}`. - `image_generation` — `{\"prompt\"?: \"…\"}`; its result is where the   image was saved. - any other tool Codex is given — its own name, its arguments as   the input. 

## Properties

Name | Type
------------ | -------------
`type` | string
`toolId` | string
`name` | string
`input` | { [key: string]: any; }
`parentToolId` | string

## Example

```typescript
import type { ToolCallEvent } from '@runyard-ai/runyard-sdk'

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "toolId": null,
  "name": Bash,
  "input": null,
  "parentToolId": null,
} satisfies ToolCallEvent

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ToolCallEvent
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


