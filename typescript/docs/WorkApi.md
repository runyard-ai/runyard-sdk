# WorkApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getSessionHarness**](WorkApi.md#getsessionharness) | **GET** /v1/sessions/{sessionId}/harness | What the session\&#39;s harness was given, as it last started |
| [**getSubagent**](WorkApi.md#getsubagent) | **GET** /v1/sessions/{sessionId}/subagents/{subagentId} | A sub-agent |
| [**listAlarms**](WorkApi.md#listalarms) | **GET** /v1/sessions/{sessionId}/alarms | What the session asked to be woken for, and what it was |
| [**listBackgroundTasks**](WorkApi.md#listbackgroundtasks) | **GET** /v1/sessions/{sessionId}/background-tasks | What the session left running, and what ended lately |
| [**listSessionSkillFiles**](WorkApi.md#listsessionskillfiles) | **GET** /v1/sessions/{sessionId}/harness/skills/{skillName}/files | The files of a skill the session has |
| [**listSessionTasks**](WorkApi.md#listsessiontasks) | **GET** /v1/sessions/{sessionId}/tasks | The session\&#39;s task list |
| [**listSubagents**](WorkApi.md#listsubagents) | **GET** /v1/sessions/{sessionId}/subagents | The sub-agents the session\&#39;s harness started, running first |
| [**listTasks**](WorkApi.md#listtasks) | **GET** /v1/tasks | The tasks of every session, for one board |
| [**readSessionSkill**](WorkApi.md#readsessionskill) | **GET** /v1/sessions/{sessionId}/harness/skills/{skillName} | The SKILL.md of a skill the session has |
| [**readSessionSkillFile**](WorkApi.md#readsessionskillfile) | **GET** /v1/sessions/{sessionId}/harness/skills/{skillName}/file | One file of a skill the session has |
| [**stopBackgroundTask**](WorkApi.md#stopbackgroundtask) | **POST** /v1/sessions/{sessionId}/background-tasks/{taskId}/stop | Stop a background task |



## getSessionHarness

> SessionHarness getSessionHarness(sessionId)

What the session\&#39;s harness was given, as it last started

The session\&#39;s newest &#x60;session_started&#x60;: its tools, the MCP connectors and skills they come with, and the brokers it reaches — what a person looks at to know what the session can do. Nothing in &#x60;started&#x60; until the session has started once. 

### Example

```ts
import {
  Configuration,
  WorkApi,
} from '@runyard-ai/runyard-sdk';
import type { GetSessionHarnessRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: console
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
    // Configure HTTP bearer authorization: platform
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WorkApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
  } satisfies GetSessionHarnessRequest;

  try {
    const data = await api.getSessionHarness(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sessionId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**SessionHarness**](SessionHarness.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The session as it last started. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSubagent

> Subagent getSubagent(sessionId, subagentId)

A sub-agent

### Example

```ts
import {
  Configuration,
  WorkApi,
} from '@runyard-ai/runyard-sdk';
import type { GetSubagentRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: console
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
    // Configure HTTP bearer authorization: platform
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WorkApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string
    subagentId: subagentId_example,
  } satisfies GetSubagentRequest;

  try {
    const data = await api.getSubagent(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sessionId** | `string` |  | [Defaults to `undefined`] |
| **subagentId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Subagent**](Subagent.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The sub-agent. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listAlarms

> ListAlarms200Response listAlarms(sessionId, pending)

What the session asked to be woken for, and what it was

An alarm is a prompt the session\&#39;s harness set to be given to it later — once, after a delay, or on a cron expression. While the harness\&#39;s process holds one it fires it itself (&#x60;firedBy: harness&#x60;); one its process could not keep — the session slept, or the harness was started again — is the server\&#39;s to fire (&#x60;firedBy: server&#x60;), as a turn with &#x60;source: alarm&#x60;. Either way a sleeping session is woken for it: &#x60;nextAlarmAt&#x60; on the session says when.  Pending first, each soonest first; then what fired or was cancelled, latest first. 

### Example

```ts
import {
  Configuration,
  WorkApi,
} from '@runyard-ai/runyard-sdk';
import type { ListAlarmsRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: console
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
    // Configure HTTP bearer authorization: platform
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WorkApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // boolean (optional)
    pending: true,
  } satisfies ListAlarmsRequest;

  try {
    const data = await api.listAlarms(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sessionId** | `string` |  | [Defaults to `undefined`] |
| **pending** | `boolean` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ListAlarms200Response**](ListAlarms200Response.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The alarms. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listBackgroundTasks

> ListBackgroundTasks200Response listBackgroundTasks(sessionId, running)

What the session left running, and what ended lately

A background task is something the session started and did not wait for — a shell command, a monitor, an asynchronous sub-agent. The session keeps its sandbox while one runs, and the session is told when it ends. 

### Example

```ts
import {
  Configuration,
  WorkApi,
} from '@runyard-ai/runyard-sdk';
import type { ListBackgroundTasksRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: console
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
    // Configure HTTP bearer authorization: platform
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WorkApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // boolean (optional)
    running: true,
  } satisfies ListBackgroundTasksRequest;

  try {
    const data = await api.listBackgroundTasks(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sessionId** | `string` |  | [Defaults to `undefined`] |
| **running** | `boolean` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ListBackgroundTasks200Response**](ListBackgroundTasks200Response.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The tasks. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listSessionSkillFiles

> SkillFiles listSessionSkillFiles(sessionId, skillName)

The files of a skill the session has

Every file of the skill\&#39;s directory the server keeps — its SKILL.md, and the scripts, references and anything else beside it — by path, read as &#x60;readSessionSkill&#x60; is. 

### Example

```ts
import {
  Configuration,
  WorkApi,
} from '@runyard-ai/runyard-sdk';
import type { ListSessionSkillFilesRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: console
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
    // Configure HTTP bearer authorization: platform
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WorkApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string
    skillName: skillName_example,
  } satisfies ListSessionSkillFilesRequest;

  try {
    const data = await api.listSessionSkillFiles(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sessionId** | `string` |  | [Defaults to `undefined`] |
| **skillName** | `string` |  | [Defaults to `undefined`] |

### Return type

[**SkillFiles**](SkillFiles.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Its files. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listSessionTasks

> ListSessionTasks200Response listSessionTasks(sessionId)

The session\&#39;s task list

The plan the session keeps for itself — Claude Code\&#39;s task tools — as it stands now, read from the transcript. It is the session\&#39;s: a person changes it by telling the session. 

### Example

```ts
import {
  Configuration,
  WorkApi,
} from '@runyard-ai/runyard-sdk';
import type { ListSessionTasksRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: console
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
    // Configure HTTP bearer authorization: platform
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WorkApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
  } satisfies ListSessionTasksRequest;

  try {
    const data = await api.listSessionTasks(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sessionId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ListSessionTasks200Response**](ListSessionTasks200Response.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The tasks, in the session\&#39;s order. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listSubagents

> ListSubagents200Response listSubagents(sessionId, running)

The sub-agents the session\&#39;s harness started, running first

A sub-agent is the harness delegating to another inside the same sandbox and the same transcript — Claude Code\&#39;s &#x60;Agent&#x60; tool. Its events are the session\&#39;s, each marked with the sub-agent\&#39;s id as &#x60;parentToolId&#x60;. A sub-agent may start sub-agents. For another session in a sandbox of its own, the harness starts a session. 

### Example

```ts
import {
  Configuration,
  WorkApi,
} from '@runyard-ai/runyard-sdk';
import type { ListSubagentsRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: console
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
    // Configure HTTP bearer authorization: platform
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WorkApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // boolean (optional)
    running: true,
  } satisfies ListSubagentsRequest;

  try {
    const data = await api.listSubagents(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sessionId** | `string` |  | [Defaults to `undefined`] |
| **running** | `boolean` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ListSubagents200Response**](ListSubagents200Response.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The sub-agents. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listTasks

> TaskPage listTasks(limit, cursor, status, rootId)

The tasks of every session, for one board

Each with its session. Archived sessions\&#39; are left out.

### Example

```ts
import {
  Configuration,
  WorkApi,
} from '@runyard-ai/runyard-sdk';
import type { ListTasksRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: console
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
    // Configure HTTP bearer authorization: platform
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WorkApi(config);

  const body = {
    // number | At most this many; the default and ceiling are in `GET /v1/info`. (optional)
    limit: 56,
    // string | From a previous page\'s `nextCursor`. Opaque; one made up is `400`. (optional)
    cursor: cursor_example,
    // Array<TaskStatus> (optional)
    status: ...,
    // string | The tasks of one tree of sessions. (optional)
    rootId: rootId_example,
  } satisfies ListTasksRequest;

  try {
    const data = await api.listTasks(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` | At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;. | [Optional] [Defaults to `undefined`] |
| **cursor** | `string` | From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;. | [Optional] [Defaults to `undefined`] |
| **status** | `Array<TaskStatus>` |  | [Optional] |
| **rootId** | `string` | The tasks of one tree of sessions. | [Optional] [Defaults to `undefined`] |

### Return type

[**TaskPage**](TaskPage.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The tasks. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## readSessionSkill

> string readSessionSkill(sessionId, skillName)

The SKILL.md of a skill the session has

Kept by the server, with every file of the skill\&#39;s directory (&#x60;listSessionSkillFiles&#x60;), so read while the session sleeps, with no sandbox. A broker\&#39;s and an MCP connector\&#39;s are as the session was given them when it last started, and the repository\&#39;s as its disk had them when it last started or ended a turn. One built into the harness is on no disk: it is kept once a session of the same harness version has loaded it, as the harness gave it to the session, and the files the harness put beside it from the end of that turn. Until then there is none, and the answer is 404. 

### Example

```ts
import {
  Configuration,
  WorkApi,
} from '@runyard-ai/runyard-sdk';
import type { ReadSessionSkillRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: console
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
    // Configure HTTP bearer authorization: platform
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WorkApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string
    skillName: skillName_example,
  } satisfies ReadSessionSkillRequest;

  try {
    const data = await api.readSessionSkill(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sessionId** | `string` |  | [Defaults to `undefined`] |
| **skillName** | `string` |  | [Defaults to `undefined`] |

### Return type

**string**

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/markdown`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Its SKILL.md. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## readSessionSkillFile

> Blob readSessionSkillFile(sessionId, skillName, path)

One file of a skill the session has

As &#x60;listSessionSkillFiles&#x60; lists it. Served as bytes to save, never as a page: it may be anything. 

### Example

```ts
import {
  Configuration,
  WorkApi,
} from '@runyard-ai/runyard-sdk';
import type { ReadSessionSkillFileRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: console
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
    // Configure HTTP bearer authorization: platform
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WorkApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string
    skillName: skillName_example,
    // string | Its path in the skill\'s directory, as listed.
    path: path_example,
  } satisfies ReadSessionSkillFileRequest;

  try {
    const data = await api.readSessionSkillFile(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sessionId** | `string` |  | [Defaults to `undefined`] |
| **skillName** | `string` |  | [Defaults to `undefined`] |
| **path** | `string` | Its path in the skill\&#39;s directory, as listed. | [Defaults to `undefined`] |

### Return type

**Blob**

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/octet-stream`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Its bytes. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## stopBackgroundTask

> stopBackgroundTask(sessionId, taskId)

Stop a background task

The session is told to stop it, in a turn of the server\&#39;s (&#x60;source: system&#x60;): the process is the session\&#39;s, and so is knowing what stopping it leaves behind. 

### Example

```ts
import {
  Configuration,
  WorkApi,
} from '@runyard-ai/runyard-sdk';
import type { StopBackgroundTaskRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const config = new Configuration({ 
    // To configure API key authorization: console
    apiKey: "YOUR API KEY",
    // Configure HTTP bearer authorization: apiKey
    accessToken: "YOUR BEARER TOKEN",
    // Configure HTTP bearer authorization: platform
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WorkApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string
    taskId: taskId_example,
  } satisfies StopBackgroundTaskRequest;

  try {
    const data = await api.stopBackgroundTask(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sessionId** | `string` |  | [Defaults to `undefined`] |
| **taskId** | `string` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Stopping. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

