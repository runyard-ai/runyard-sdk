# SandboxApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteFile**](SandboxApi.md#deletefile) | **DELETE** /v1/sessions/{sessionId}/files/content | Delete a file, or an empty directory |
| [**dropEgressRule**](SandboxApi.md#dropegressrule) | **DELETE** /v1/sessions/{sessionId}/egress/{ruleName} | Take a rule off the session\&#39;s sandbox, at once |
| [**getSandboxUsage**](SandboxApi.md#getsandboxusage) | **GET** /v1/sessions/{sessionId}/sandbox/usage | What the session\&#39;s machine is using now |
| [**getSandboxUsageHistory**](SandboxApi.md#getsandboxusagehistory) | **GET** /v1/sessions/{sessionId}/sandbox/usage/history | What the session\&#39;s machine has been using, and what it was given |
| [**listEgressRules**](SandboxApi.md#listegressrules) | **GET** /v1/sessions/{sessionId}/egress | What the session\&#39;s sandbox may reach |
| [**listFiles**](SandboxApi.md#listfiles) | **GET** /v1/sessions/{sessionId}/files | A directory of the session\&#39;s disk |
| [**listOwnTunnels**](SandboxApi.md#listowntunnels) | **GET** /v1/tunnels | Every tunnel of the caller\&#39;s sessions |
| [**listSandboxProcesses**](SandboxApi.md#listsandboxprocesses) | **GET** /v1/sessions/{sessionId}/sandbox/processes | What is running in the session\&#39;s machine |
| [**listTunnels**](SandboxApi.md#listtunnels) | **GET** /v1/sessions/{sessionId}/tunnels | The ports the session published, and their addresses |
| [**readFile**](SandboxApi.md#readfile) | **GET** /v1/sessions/{sessionId}/files/content | A file\&#39;s bytes |
| [**writeFile**](SandboxApi.md#writefile) | **PUT** /v1/sessions/{sessionId}/files/content | Write a file, making its directories |



## deleteFile

> deleteFile(sessionId, path)

Delete a file, or an empty directory

### Example

```ts
import {
  Configuration,
  SandboxApi,
} from '@runyard-ai/runyard-sdk';
import type { DeleteFileRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SandboxApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string | Absolute, or relative to the session\'s working directory. Never outside the session\'s disk.
    path: src/main.go,
  } satisfies DeleteFileRequest;

  try {
    const data = await api.deleteFile(body);
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
| **path** | `string` | Absolute, or relative to the session\&#39;s working directory. Never outside the session\&#39;s disk. | [Defaults to `undefined`] |

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
| **204** | Gone. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## dropEgressRule

> dropEgressRule(sessionId, ruleName)

Take a rule off the session\&#39;s sandbox, at once

What it opened is closed for the sandbox from the next connection. A rule from the session\&#39;s config comes back with its next sandbox; one the session opened comes back only if it opens it again. 

### Example

```ts
import {
  Configuration,
  SandboxApi,
} from '@runyard-ai/runyard-sdk';
import type { DropEgressRuleRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SandboxApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string | The rule\'s `name`.
    ruleName: ruleName_example,
  } satisfies DropEgressRuleRequest;

  try {
    const data = await api.dropEgressRule(body);
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
| **ruleName** | `string` | The rule\&#39;s &#x60;name&#x60;. | [Defaults to `undefined`] |

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
| **204** | It no longer opens anything. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSandboxUsage

> SandboxUsage getSandboxUsage(sessionId)

What the session\&#39;s machine is using now

As runyard-sandboxes last measured it, from the host: what its machine is using of the &#x60;resources&#x60; it was given. A session without a machine — asleep, or not yet woken — is &#x60;409&#x60;. 

### Example

```ts
import {
  Configuration,
  SandboxApi,
} from '@runyard-ai/runyard-sdk';
import type { GetSandboxUsageRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SandboxApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
  } satisfies GetSandboxUsageRequest;

  try {
    const data = await api.getSandboxUsage(body);
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

[**SandboxUsage**](SandboxUsage.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The last reading. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSandboxUsageHistory

> SandboxUsageHistory getSandboxUsageHistory(sessionId, window)

What the session\&#39;s machine has been using, and what it was given

The readings behind &#x60;GET .../sandbox/usage&#x60;, over time, as runyard-sandboxes keeps them for the machine the session runs in now, beside the size that machine was given. A machine made by an earlier wake is gone with its readings, so the history starts at the last wake. A session without a machine is &#x60;409&#x60;. 

### Example

```ts
import {
  Configuration,
  SandboxApi,
} from '@runyard-ai/runyard-sdk';
import type { GetSandboxUsageHistoryRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SandboxApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // UsageWindow | How far back to go. Absent is `1h`. (optional)
    window: ...,
  } satisfies GetSandboxUsageHistoryRequest;

  try {
    const data = await api.getSandboxUsageHistory(body);
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
| **window** | `UsageWindow` | How far back to go. Absent is &#x60;1h&#x60;. | [Optional] [Defaults to `undefined`] [Enum: 15m, 1h, 6h, 24h] |

### Return type

[**SandboxUsageHistory**](SandboxUsageHistory.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The readings, oldest first. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listEgressRules

> ListEgressRules200Response listEgressRules(sessionId)

What the session\&#39;s sandbox may reach

The egress rules of the sandbox the session runs in now: those its session\&#39;s config gave it, and the hosts its harness opened since it woke (through the egress broker). A sleeping session has no sandbox, so no rules: a &#x60;409&#x60;. 

### Example

```ts
import {
  Configuration,
  SandboxApi,
} from '@runyard-ai/runyard-sdk';
import type { ListEgressRulesRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SandboxApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
  } satisfies ListEgressRulesRequest;

  try {
    const data = await api.listEgressRules(body);
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

[**ListEgressRules200Response**](ListEgressRules200Response.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The rules, the config\&#39;s first. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listFiles

> ListFiles200Response listFiles(sessionId, path)

A directory of the session\&#39;s disk

Read through its machine, so a sleeping session is &#x60;409&#x60;; wake it first.

### Example

```ts
import {
  Configuration,
  SandboxApi,
} from '@runyard-ai/runyard-sdk';
import type { ListFilesRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SandboxApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string | Absolute, or relative to the session\'s working directory. Never outside the session\'s disk.
    path: src/main.go,
  } satisfies ListFilesRequest;

  try {
    const data = await api.listFiles(body);
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
| **path** | `string` | Absolute, or relative to the session\&#39;s working directory. Never outside the session\&#39;s disk. | [Defaults to `undefined`] |

### Return type

[**ListFiles200Response**](ListFiles200Response.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Its entries. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listOwnTunnels

> TunnelList listOwnTunnels()

Every tunnel of the caller\&#39;s sessions

A person\&#39;s own — their sessions\&#39; sandboxes\&#39; — and every one for an admin. 

### Example

```ts
import {
  Configuration,
  SandboxApi,
} from '@runyard-ai/runyard-sdk';
import type { ListOwnTunnelsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SandboxApi(config);

  try {
    const data = await api.listOwnTunnels();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**TunnelList**](TunnelList.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The tunnels. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listSandboxProcesses

> SandboxProcessTable listSandboxProcesses(sessionId)

What is running in the session\&#39;s machine

Every process in its machine, kernel threads included and marked, in pid order, as runyard-sandboxes reads them from the guest\&#39;s &#x60;/proc&#x60;. It is the guest\&#39;s own account: whatever runs as root in the machine can make it say anything, so it is shown and nothing is decided from it. CPU is measured over a short window inside the request, so this takes a moment to answer. A session without a machine is &#x60;409&#x60;. 

### Example

```ts
import {
  Configuration,
  SandboxApi,
} from '@runyard-ai/runyard-sdk';
import type { ListSandboxProcessesRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SandboxApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
  } satisfies ListSandboxProcessesRequest;

  try {
    const data = await api.listSandboxProcesses(body);
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

[**SandboxProcessTable**](SandboxProcessTable.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The process table. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listTunnels

> ListTunnels200Response listTunnels(sessionId)

The ports the session published, and their addresses

### Example

```ts
import {
  Configuration,
  SandboxApi,
} from '@runyard-ai/runyard-sdk';
import type { ListTunnelsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SandboxApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
  } satisfies ListTunnelsRequest;

  try {
    const data = await api.listTunnels(body);
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

[**ListTunnels200Response**](ListTunnels200Response.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The tunnels. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## readFile

> Blob readFile(sessionId, path)

A file\&#39;s bytes

### Example

```ts
import {
  Configuration,
  SandboxApi,
} from '@runyard-ai/runyard-sdk';
import type { ReadFileRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SandboxApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string | Absolute, or relative to the session\'s working directory. Never outside the session\'s disk.
    path: src/main.go,
  } satisfies ReadFileRequest;

  try {
    const data = await api.readFile(body);
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
| **path** | `string` | Absolute, or relative to the session\&#39;s working directory. Never outside the session\&#39;s disk. | [Defaults to `undefined`] |

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
| **200** | The file. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **413** | Bigger than &#x60;limits&#x60; allows. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## writeFile

> FileEntry writeFile(sessionId, path, body)

Write a file, making its directories

How an attachment gets to the session — written here, then named in a turn.

### Example

```ts
import {
  Configuration,
  SandboxApi,
} from '@runyard-ai/runyard-sdk';
import type { WriteFileRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SandboxApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string | Absolute, or relative to the session\'s working directory. Never outside the session\'s disk.
    path: src/main.go,
    // Blob
    body: BINARY_DATA_HERE,
  } satisfies WriteFileRequest;

  try {
    const data = await api.writeFile(body);
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
| **path** | `string` | Absolute, or relative to the session\&#39;s working directory. Never outside the session\&#39;s disk. | [Defaults to `undefined`] |
| **body** | `Blob` |  | |

### Return type

[**FileEntry**](FileEntry.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/octet-stream`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Written. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **413** | Bigger than &#x60;limits&#x60; allows. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

