# CostsApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteInfrastructureItem**](CostsApi.md#deleteinfrastructureitem) | **DELETE** /v1/infrastructure/{kind}/{id} | Let it go, and what it costs with it |
| [**getInfrastructureItem**](CostsApi.md#getinfrastructureitem) | **GET** /v1/infrastructure/{kind}/{id} | One thing of the workspace\&#39;s sandboxes server, and what it costs |
| [**getSessionCosts**](CostsApi.md#getsessioncosts) | **GET** /v1/sessions/{sessionId}/costs | What one session has cost, its infrastructure and its tokens |
| [**getWorkspaceCosts**](CostsApi.md#getworkspacecosts) | **GET** /v1/costs | What the workspace\&#39;s infrastructure has cost |
| [**getWorkspaceQuota**](CostsApi.md#getworkspacequota) | **GET** /v1/quota | The workspace\&#39;s quota, and what is held of it |
| [**stopInfrastructureSandbox**](CostsApi.md#stopinfrastructuresandbox) | **POST** /v1/infrastructure/sandbox/{id}/stop | Stop a sandbox, which then costs only its disk |



## deleteInfrastructureItem

> DeletedLater deleteInfrastructureItem(kind, id)

Let it go, and what it costs with it

A sandbox is powered down and deleted, its disk kept as a volume of its own; a volume or an image is deleted. One already gone is gone.  A session\&#39;s is refused, &#x60;409&#x60;: it is let go from there, as a deleted session lets its go. So are a volume a sandbox holds and an image a sandbox boots from, as the daemon refuses them.  A sandbox or a volume on a runner that is away is deleted once that runner is back: &#x60;202&#x60;, naming the runner, and it is listed &#x60;deleting&#x60; until then. 

### Example

```ts
import {
  Configuration,
  CostsApi,
} from '@runyard-ai/runyard-sdk';
import type { DeleteInfrastructureItemRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new CostsApi(config);

  const body = {
    // InfrastructureKind
    kind: ...,
    // string | A sandbox\'s id, a volume\'s name, an image\'s id.
    id: id_example,
  } satisfies DeleteInfrastructureItemRequest;

  try {
    const data = await api.deleteInfrastructureItem(body);
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
| **kind** | `InfrastructureKind` |  | [Defaults to `undefined`] [Enum: sandbox, volume, image] |
| **id** | `string` | A sandbox\&#39;s id, a volume\&#39;s name, an image\&#39;s id. | [Defaults to `undefined`] |

### Return type

[**DeletedLater**](DeletedLater.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Gone, or was already. |  -  |
| **202** | To be deleted once the runner holding it is back. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **502** | The sandboxes daemon could not do it. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getInfrastructureItem

> InfrastructureItem getInfrastructureItem(kind, id, window)

One thing of the workspace\&#39;s sandboxes server, and what it costs

One sandbox, volume or image of the workspace\&#39;s sandboxes server: what it is now, who made it, what it costs an hour and cost over the window, as the workspace\&#39;s costs say. One no longer there is said with what it cost.  One that is a session\&#39;s says so in &#x60;ownedBy&#x60;: it is managed from there. 

### Example

```ts
import {
  Configuration,
  CostsApi,
} from '@runyard-ai/runyard-sdk';
import type { GetInfrastructureItemRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new CostsApi(config);

  const body = {
    // InfrastructureKind
    kind: ...,
    // string | A sandbox\'s id, a volume\'s name, an image\'s id.
    id: id_example,
    // CostWindow | How far back its cost goes. `30d` when it is not said. (optional)
    window: ...,
  } satisfies GetInfrastructureItemRequest;

  try {
    const data = await api.getInfrastructureItem(body);
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
| **kind** | `InfrastructureKind` |  | [Defaults to `undefined`] [Enum: sandbox, volume, image] |
| **id** | `string` | A sandbox\&#39;s id, a volume\&#39;s name, an image\&#39;s id. | [Defaults to `undefined`] |
| **window** | `CostWindow` | How far back its cost goes. &#x60;30d&#x60; when it is not said. | [Optional] [Defaults to `undefined`] [Enum: 24h, 7d, 30d, 90d] |

### Return type

[**InfrastructureItem**](InfrastructureItem.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The thing. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **502** | The sandboxes daemon could not say. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSessionCosts

> SessionCostReport getSessionCosts(sessionId, window)

What one session has cost, its infrastructure and its tokens

One session\&#39;s cost over a window, hour by hour or day by day, in its two parts, which are priced apart and never added up across currencies:  - **infrastructure**: its sandboxes — one a wake, each still   listed once it is released — their tunnels and its disk, as   runyard-sandboxes meters them, at the rates its configuration   names and in its currency, with what each costs an hour now; - **tokens**: its calls to its models through the &#x60;llm&#x60; broker, at   the providers\&#39; list prices, in USD.  And its **timeline**: what the session was, from when to when, over the window, by its state events — its sandbox up and generating, up and idle, released while it slept.  An admin\&#39;s, with &#x60;sessions.read&#x60;, as the workspace\&#39;s costs are. 

### Example

```ts
import {
  Configuration,
  CostsApi,
} from '@runyard-ai/runyard-sdk';
import type { GetSessionCostsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new CostsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // SessionCostWindow | How far back to go. `7d` when it is not said. (optional)
    window: ...,
  } satisfies GetSessionCostsRequest;

  try {
    const data = await api.getSessionCosts(body);
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
| **window** | `SessionCostWindow` | How far back to go. &#x60;7d&#x60; when it is not said. | [Optional] [Defaults to `undefined`] [Enum: 24h, 7d, 30d] |

### Return type

[**SessionCostReport**](SessionCostReport.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | What the session cost over the window, and costs now. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **502** | The sandboxes daemon could not say what the infrastructure cost. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getWorkspaceCosts

> CostReport getWorkspaceCosts(window)

What the workspace\&#39;s infrastructure has cost

What the workspace\&#39;s sandboxes, volumes, images and tunnels used and cost over a window, hour by hour or day by day, and what each costs an hour now: its sandboxes server\&#39;s, as runyard-sandboxes meters them every minute and keeps them, at the rates its configuration names. What is gone — a session deleted — is listed with what it cost, &#x60;live: false&#x60;.  Its sessions\&#39; sandboxes and volumes say which session each is. An admin\&#39;s, with &#x60;sessions.read&#x60;, as the workspace\&#39;s usage is.  Not the sessions\&#39; calls to their models, which are &#x60;GET /v1/usage&#x60;. 

### Example

```ts
import {
  Configuration,
  CostsApi,
} from '@runyard-ai/runyard-sdk';
import type { GetWorkspaceCostsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new CostsApi(config);

  const body = {
    // CostWindow | How far back to go. `7d` when it is not said. (optional)
    window: ...,
  } satisfies GetWorkspaceCostsRequest;

  try {
    const data = await api.getWorkspaceCosts(body);
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
| **window** | `CostWindow` | How far back to go. &#x60;7d&#x60; when it is not said. | [Optional] [Defaults to `undefined`] [Enum: 24h, 7d, 30d, 90d] |

### Return type

[**CostReport**](CostReport.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | What was spent over the window, and what is spent an hour now. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getWorkspaceQuota

> WorkspaceQuota getWorkspaceQuota()

The workspace\&#39;s quota, and what is held of it

What the workspace\&#39;s runyard-sandboxes server may commit of its host — its ceilings of vCPUs, memory and disk, each its capacity times its overcommit — and what its sandboxes and volumes hold of them now, as the server counts them (&#x60;GET /v1/host/commitments&#x60;, read with the workspace\&#39;s own key). The server is the workspace\&#39;s alone, so its limits are the workspace\&#39;s quota. A session whose sandbox would take the workspace past a ceiling is refused &#x60;quota_exceeded&#x60; (its &#x60;sandbox.errorCode&#x60;), so a client can read this before starting one rather than find out after. One whose disk would take it past its disk ceiling is refused as it is started (&#x60;createSession&#x60;\&#39;s &#x60;507&#x60;).  What is held is counted as the server admits sandboxes: vCPUs by sandboxes running, memory by those and those paused, disk by every sandbox\&#39;s volume and every volume kept.  Read-only: the ceilings are the platform\&#39;s and the sandboxes operator\&#39;s to set, never the workspace\&#39;s. Anybody with &#x60;sessions.read&#x60; may read it. 

### Example

```ts
import {
  Configuration,
  CostsApi,
} from '@runyard-ai/runyard-sdk';
import type { GetWorkspaceQuotaRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new CostsApi(config);

  try {
    const data = await api.getWorkspaceQuota();
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

[**WorkspaceQuota**](WorkspaceQuota.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The ceilings, and what is held. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## stopInfrastructureSandbox

> stopInfrastructureSandbox(id)

Stop a sandbox, which then costs only its disk

Its machine is powered down, its disk kept: it costs its disk alone until it is started or deleted. A session\&#39;s is refused, &#x60;409&#x60;, as delete refuses it. 

### Example

```ts
import {
  Configuration,
  CostsApi,
} from '@runyard-ai/runyard-sdk';
import type { StopInfrastructureSandboxRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new CostsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies StopInfrastructureSandboxRequest;

  try {
    const data = await api.stopInfrastructureSandbox(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

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
| **204** | Stopped, or was already. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **502** | The sandboxes daemon could not do it. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

