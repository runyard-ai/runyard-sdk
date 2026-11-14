# TriggersApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteTrigger**](TriggersApi.md#deletetrigger) | **DELETE** /v1/triggers/{triggerId} | Delete a trigger |
| [**fireTrigger**](TriggersApi.md#firetrigger) | **POST** /v1/triggers/{triggerId}/fire | Fire a trigger from code |
| [**getTrigger**](TriggersApi.md#gettrigger) | **GET** /v1/triggers/{triggerId} | A trigger |
| [**listFirings**](TriggersApi.md#listfirings) | **GET** /v1/triggers/{triggerId}/firings | A trigger\&#39;s firings, newest first |
| [**listTriggers**](TriggersApi.md#listtriggers) | **GET** /v1/triggers | The triggers the caller owns — every one, for an admin |
| [**putTrigger**](TriggersApi.md#puttrigger) | **PUT** /v1/triggers/{triggerId} | Create a trigger, or change it |
| [**receiveHook**](TriggersApi.md#receivehook) | **POST** /v1/hooks/{triggerId} | A webhook trigger\&#39;s address |



## deleteTrigger

> deleteTrigger(triggerId)

Delete a trigger

Its sessions go on, their lineage naming a trigger that is gone.

### Example

```ts
import {
  Configuration,
  TriggersApi,
} from '@runyard-ai/runyard-sdk';
import type { DeleteTriggerRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TriggersApi(config);

  const body = {
    // string
    triggerId: triggerId_example,
  } satisfies DeleteTriggerRequest;

  try {
    const data = await api.deleteTrigger(body);
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
| **triggerId** | `string` |  | [Defaults to `undefined`] |

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
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## fireTrigger

> Firing fireTrigger(triggerId, fireRequest)

Fire a trigger from code

Any trigger may be fired this way, whatever its kind. &#x60;input&#x60; fills the turn template\&#39;s &#x60;{{input.*}}&#x60;. Idempotent by &#x60;firingId&#x60;: a caller retrying a lost answer gets the first firing, not a second session. &#x60;parentId&#x60; makes the firing\&#39;s session a child of a session in lineage — how a session\&#39;s harness fans work out through a trigger. 

### Example

```ts
import {
  Configuration,
  TriggersApi,
} from '@runyard-ai/runyard-sdk';
import type { FireTriggerRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TriggersApi(config);

  const body = {
    // string
    triggerId: triggerId_example,
    // FireRequest
    fireRequest: ...,
  } satisfies FireTriggerRequest;

  try {
    const data = await api.fireTrigger(body);
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
| **triggerId** | `string` |  | [Defaults to `undefined`] |
| **fireRequest** | [FireRequest](FireRequest.md) |  | |

### Return type

[**Firing**](Firing.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | That firing happened already. |  -  |
| **202** | Fired. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **503** | No sandbox can be made now (&#x60;capacity_exceeded&#x60;) or the account is at its quota (&#x60;quota_exceeded&#x60;). The one status that says: try again.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getTrigger

> Trigger getTrigger(triggerId)

A trigger

### Example

```ts
import {
  Configuration,
  TriggersApi,
} from '@runyard-ai/runyard-sdk';
import type { GetTriggerRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TriggersApi(config);

  const body = {
    // string
    triggerId: triggerId_example,
  } satisfies GetTriggerRequest;

  try {
    const data = await api.getTrigger(body);
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
| **triggerId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Trigger**](Trigger.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The trigger. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listFirings

> FiringPage listFirings(triggerId, limit, cursor)

A trigger\&#39;s firings, newest first

### Example

```ts
import {
  Configuration,
  TriggersApi,
} from '@runyard-ai/runyard-sdk';
import type { ListFiringsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TriggersApi(config);

  const body = {
    // string
    triggerId: triggerId_example,
    // number | At most this many; the default and ceiling are in `GET /v1/info`. (optional)
    limit: 56,
    // string | From a previous page\'s `nextCursor`. Opaque; one made up is `400`. (optional)
    cursor: cursor_example,
  } satisfies ListFiringsRequest;

  try {
    const data = await api.listFirings(body);
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
| **triggerId** | `string` |  | [Defaults to `undefined`] |
| **limit** | `number` | At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;. | [Optional] [Defaults to `undefined`] |
| **cursor** | `string` | From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;. | [Optional] [Defaults to `undefined`] |

### Return type

[**FiringPage**](FiringPage.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The firings. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listTriggers

> TriggerPage listTriggers(limit, cursor)

The triggers the caller owns — every one, for an admin

### Example

```ts
import {
  Configuration,
  TriggersApi,
} from '@runyard-ai/runyard-sdk';
import type { ListTriggersRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TriggersApi(config);

  const body = {
    // number | At most this many; the default and ceiling are in `GET /v1/info`. (optional)
    limit: 56,
    // string | From a previous page\'s `nextCursor`. Opaque; one made up is `400`. (optional)
    cursor: cursor_example,
  } satisfies ListTriggersRequest;

  try {
    const data = await api.listTriggers(body);
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

### Return type

[**TriggerPage**](TriggerPage.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The triggers. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putTrigger

> Trigger putTrigger(triggerId, triggerSpec)

Create a trigger, or change it

A trigger starts a session from a profile, with a first turn made from a template and what fired it: a call (&#x60;api&#x60;), a schedule (&#x60;schedule&#x60;), or a signed request to its hook (&#x60;webhook&#x60;). Each firing is recorded, with the session it started, and the session\&#39;s lineage names both.  &#x60;concurrency&#x60; says what a firing does while the trigger\&#39;s last session is still at work: start another (&#x60;parallel&#x60;), be dropped (&#x60;skip&#x60;), or become a turn of that session (&#x60;queue&#x60;). 

### Example

```ts
import {
  Configuration,
  TriggersApi,
} from '@runyard-ai/runyard-sdk';
import type { PutTriggerRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TriggersApi(config);

  const body = {
    // string
    triggerId: triggerId_example,
    // TriggerSpec
    triggerSpec: ...,
  } satisfies PutTriggerRequest;

  try {
    const data = await api.putTrigger(body);
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
| **triggerId** | `string` |  | [Defaults to `undefined`] |
| **triggerSpec** | [TriggerSpec](TriggerSpec.md) |  | |

### Return type

[**Trigger**](Trigger.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Changed. |  -  |
| **201** | Created. A webhook\&#39;s secret is in this answer only. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## receiveHook

> Firing receiveHook(triggerId, requestBody, xRunyardSignature, xHubSignature256)

A webhook trigger\&#39;s address

Not called with a key: the body is signed with the trigger\&#39;s secret, &#x60;X-Runyard-Signature: sha256&#x3D;&lt;hex HMAC of the body&gt;&#x60;, or — for a trigger declared &#x60;github&#x60; — GitHub\&#39;s own &#x60;X-Hub-Signature-256&#x60;. Anything unsigned, or signed otherwise, is the same &#x60;404&#x60; as a trigger that does not exist. The body is the firing\&#39;s &#x60;input&#x60;; its delivery id header, when the sender gives one, its &#x60;firingId&#x60;. 

### Example

```ts
import {
  Configuration,
  TriggersApi,
} from '@runyard-ai/runyard-sdk';
import type { ReceiveHookRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const api = new TriggersApi();

  const body = {
    // string
    triggerId: triggerId_example,
    // { [key: string]: any; }
    requestBody: Object,
    // string (optional)
    xRunyardSignature: xRunyardSignature_example,
    // string (optional)
    xHubSignature256: xHubSignature256_example,
  } satisfies ReceiveHookRequest;

  try {
    const data = await api.receiveHook(body);
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
| **triggerId** | `string` |  | [Defaults to `undefined`] |
| **requestBody** | `{ [key: string]: any; }` |  | |
| **xRunyardSignature** | `string` |  | [Optional] [Defaults to `undefined`] |
| **xHubSignature256** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**Firing**](Firing.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Fired. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **404** | Nothing by that id. |  -  |
| **413** | Bigger than &#x60;limits&#x60; allows. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

