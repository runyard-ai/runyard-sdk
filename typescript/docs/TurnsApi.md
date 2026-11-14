# TurnsApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**cancelQueuedTurn**](TurnsApi.md#cancelqueuedturn) | **DELETE** /v1/sessions/{sessionId}/queue/{turnId} | Take back a turn still waiting in the session\&#39;s queue |
| [**compact**](TurnsApi.md#compactoperation) | **POST** /v1/sessions/{sessionId}/compact | Summarise the conversation so far into a smaller context |
| [**createUpload**](TurnsApi.md#createupload) | **POST** /v1/uploads | Keep a file for a message not sent yet |
| [**deleteUpload**](TurnsApi.md#deleteupload) | **DELETE** /v1/uploads/{uploadId} | Forget a file taken off a message before it was sent |
| [**editQueuedTurn**](TurnsApi.md#editqueuedturn) | **PATCH** /v1/sessions/{sessionId}/queue/{turnId} | Change what a turn still waiting in the session\&#39;s queue says |
| [**getAttachment**](TurnsApi.md#getattachment) | **GET** /v1/sessions/{sessionId}/attachments/{uploadId} | A file sent to the session with a turn, or an image a tool answered with |
| [**holdQueuedTurn**](TurnsApi.md#holdqueuedturn) | **PUT** /v1/sessions/{sessionId}/queue/{turnId}/hold | Keep a turn waiting while somebody edits it |
| [**interrupt**](TurnsApi.md#interruptoperation) | **POST** /v1/sessions/{sessionId}/interrupt | Stop what the session is generating |
| [**interruptWithQueuedTurn**](TurnsApi.md#interruptwithqueuedturn) | **POST** /v1/sessions/{sessionId}/queue/{turnId}/interrupt | Give a waiting turn now, interrupting what the session is generating |
| [**releaseQueuedTurn**](TurnsApi.md#releasequeuedturn) | **DELETE** /v1/sessions/{sessionId}/queue/{turnId}/hold | Let go of a turn held while somebody edited it |
| [**rewind**](TurnsApi.md#rewindoperation) | **POST** /v1/sessions/{sessionId}/rewind | Take the conversation back to before a turn, to edit or retry it |
| [**sendTurn**](TurnsApi.md#sendturn) | **POST** /v1/sessions/{sessionId}/turns | Say something to the session |



## cancelQueuedTurn

> QueuedTurn cancelQueuedTurn(sessionId, turnId)

Take back a turn still waiting in the session\&#39;s queue

The turn leaves the session\&#39;s &#x60;queue&#x60; and is never given to its harness. The uploads it named are the caller\&#39;s again, to attach once more or to be evicted. Its &#x60;turnId&#x60; stays used: sent again, it is &#x60;200&#x60; and changes nothing. &#x60;404&#x60; once the harness has taken it — it is on the stream then — or when no turn of that id waits. 

### Example

```ts
import {
  Configuration,
  TurnsApi,
} from '@runyard-ai/runyard-sdk';
import type { CancelQueuedTurnRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TurnsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string | The `turnId` of a turn in the session\'s `queue`.
    turnId: turnId_example,
  } satisfies CancelQueuedTurnRequest;

  try {
    const data = await api.cancelQueuedTurn(body);
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
| **turnId** | `string` | The &#x60;turnId&#x60; of a turn in the session\&#39;s &#x60;queue&#x60;. | [Defaults to `undefined`] |

### Return type

[**QueuedTurn**](QueuedTurn.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Taken back; the turn as it waited. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## compact

> compact(sessionId, compactRequest)

Summarise the conversation so far into a smaller context

Answered on the stream with a &#x60;compaction&#x60; event. &#x60;409&#x60; while generating.

### Example

```ts
import {
  Configuration,
  TurnsApi,
} from '@runyard-ai/runyard-sdk';
import type { CompactOperationRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TurnsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // CompactRequest (optional)
    compactRequest: ...,
  } satisfies CompactOperationRequest;

  try {
    const data = await api.compact(body);
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
| **compactRequest** | [CompactRequest](CompactRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Compacting. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createUpload

> Upload createUpload(name, body)

Keep a file for a message not sent yet

The bytes are kept as they are — never opened for what they say — until a turn names the upload, which makes it that turn\&#39;s session\&#39;s. Nothing runs in a sandbox for it: the file is put on the session\&#39;s disk when the session is given the turn. One no turn names within &#x60;limits.uploadTtlSeconds&#x60; is evicted. 

### Example

```ts
import {
  Configuration,
  TurnsApi,
} from '@runyard-ai/runyard-sdk';
import type { CreateUploadRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TurnsApi(config);

  const body = {
    // string | The file\'s name, without a slash. Where it goes on the session\'s disk.
    name: name_example,
    // Blob
    body: BINARY_DATA_HERE,
  } satisfies CreateUploadRequest;

  try {
    const data = await api.createUpload(body);
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
| **name** | `string` | The file\&#39;s name, without a slash. Where it goes on the session\&#39;s disk. | [Defaults to `undefined`] |
| **body** | `Blob` |  | |

### Return type

[**Upload**](Upload.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/octet-stream`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Kept. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **413** | Bigger than &#x60;limits&#x60; allows. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteUpload

> deleteUpload(uploadId)

Forget a file taken off a message before it was sent

### Example

```ts
import {
  Configuration,
  TurnsApi,
} from '@runyard-ai/runyard-sdk';
import type { DeleteUploadRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TurnsApi(config);

  const body = {
    // string
    uploadId: uploadId_example,
  } satisfies DeleteUploadRequest;

  try {
    const data = await api.deleteUpload(body);
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
| **uploadId** | `string` |  | [Defaults to `undefined`] |

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
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## editQueuedTurn

> QueuedTurn editQueuedTurn(sessionId, turnId, queuedTurnEdit)

Change what a turn still waiting in the session\&#39;s queue says

Its &#x60;text&#x60; is replaced, and it keeps its place, its &#x60;turnId&#x60; and its attachments. A hold on it (&#x60;PUT …/hold&#x60;) is let go of: the session is given it, as it says now, when its turn comes. &#x60;404&#x60; once the harness has taken it — it is on the stream then, as it was — or when no turn of that id waits; &#x60;409&#x60; for the session\&#39;s first turn, which its harness is given as soon as it is up: take it back instead. 

### Example

```ts
import {
  Configuration,
  TurnsApi,
} from '@runyard-ai/runyard-sdk';
import type { EditQueuedTurnRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TurnsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string | The `turnId` of a turn in the session\'s `queue`.
    turnId: turnId_example,
    // QueuedTurnEdit
    queuedTurnEdit: ...,
  } satisfies EditQueuedTurnRequest;

  try {
    const data = await api.editQueuedTurn(body);
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
| **turnId** | `string` | The &#x60;turnId&#x60; of a turn in the session\&#39;s &#x60;queue&#x60;. | [Defaults to `undefined`] |
| **queuedTurnEdit** | [QueuedTurnEdit](QueuedTurnEdit.md) |  | |

### Return type

[**QueuedTurn**](QueuedTurn.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Changed; the turn as it waits now. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getAttachment

> Blob getAttachment(sessionId, uploadId)

A file sent to the session with a turn, or an image a tool answered with

Kept by the server, so read whether the session is asleep or awake. Served as bytes to save, never as a page: it may be anything. 

### Example

```ts
import {
  Configuration,
  TurnsApi,
} from '@runyard-ai/runyard-sdk';
import type { GetAttachmentRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TurnsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string
    uploadId: uploadId_example,
  } satisfies GetAttachmentRequest;

  try {
    const data = await api.getAttachment(body);
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
| **uploadId** | `string` |  | [Defaults to `undefined`] |

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


## holdQueuedTurn

> QueuedTurn holdQueuedTurn(sessionId, turnId)

Keep a turn waiting while somebody edits it

While a turn is held, the session is not given it — nor any turn behind it, which keep their order — however long its harness has been free: it waits for the edit (&#x60;PATCH …/queue/{turnId}&#x60;), or for the hold to be let go of (&#x60;DELETE …/hold&#x60;), and is given then. A hold lasts until its &#x60;heldUntil&#x60;, five minutes from when it was last asked for, so that an editor that went away stops no session for long: asked again, it is kept that much longer. Turns ahead of it are given as they would be. &#x60;404&#x60; once the harness has taken it, or when no turn of that id waits; &#x60;409&#x60; for the session\&#39;s first turn, which its harness is given as soon as it is up. 

### Example

```ts
import {
  Configuration,
  TurnsApi,
} from '@runyard-ai/runyard-sdk';
import type { HoldQueuedTurnRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TurnsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string | The `turnId` of a turn in the session\'s `queue`.
    turnId: turnId_example,
  } satisfies HoldQueuedTurnRequest;

  try {
    const data = await api.holdQueuedTurn(body);
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
| **turnId** | `string` | The &#x60;turnId&#x60; of a turn in the session\&#39;s &#x60;queue&#x60;. | [Defaults to `undefined`] |

### Return type

[**QueuedTurn**](QueuedTurn.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Held; the turn as it waits, with its &#x60;heldUntil&#x60;. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## interrupt

> interrupt(sessionId, interruptRequest)

Stop what the session is generating

The turn ends with &#x60;stopReason: interrupted&#x60;. Queued turns are kept unless &#x60;dropQueued&#x60;. Background tasks and sub-agents of the turn are not stopped: they are stopped on their own. 

### Example

```ts
import {
  Configuration,
  TurnsApi,
} from '@runyard-ai/runyard-sdk';
import type { InterruptOperationRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TurnsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // InterruptRequest (optional)
    interruptRequest: ...,
  } satisfies InterruptOperationRequest;

  try {
    const data = await api.interrupt(body);
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
| **interruptRequest** | [InterruptRequest](InterruptRequest.md) |  | [Optional] |

### Return type

`void` (Empty response body)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Asked. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## interruptWithQueuedTurn

> interruptWithQueuedTurn(sessionId, turnId)

Give a waiting turn now, interrupting what the session is generating

The turn goes to the head of the session\&#39;s &#x60;queue&#x60; and what is being generated is interrupted, as a turn sent with &#x60;mode: interrupt&#x60; would: it is taken next. A session not generating takes it before the others waiting, and a sleeping one wakes for it. &#x60;404&#x60; once the harness has taken it, or when no turn of that id waits; &#x60;409&#x60; when the session is archived, or the turn is held while somebody edits it. 

### Example

```ts
import {
  Configuration,
  TurnsApi,
} from '@runyard-ai/runyard-sdk';
import type { InterruptWithQueuedTurnRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TurnsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string | The `turnId` of a turn in the session\'s `queue`.
    turnId: turnId_example,
  } satisfies InterruptWithQueuedTurnRequest;

  try {
    const data = await api.interruptWithQueuedTurn(body);
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
| **turnId** | `string` | The &#x60;turnId&#x60; of a turn in the session\&#39;s &#x60;queue&#x60;. | [Defaults to `undefined`] |

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
| **202** | Asked. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## releaseQueuedTurn

> QueuedTurn releaseQueuedTurn(sessionId, turnId)

Let go of a turn held while somebody edited it

The edit was abandoned: the turn waits as it was, and is given when its turn comes — at once, when the session was kept waiting for it. A turn not held is &#x60;200&#x60; and changes nothing. &#x60;404&#x60; once the harness has taken it, or when no turn of that id waits. 

### Example

```ts
import {
  Configuration,
  TurnsApi,
} from '@runyard-ai/runyard-sdk';
import type { ReleaseQueuedTurnRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TurnsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string | The `turnId` of a turn in the session\'s `queue`.
    turnId: turnId_example,
  } satisfies ReleaseQueuedTurnRequest;

  try {
    const data = await api.releaseQueuedTurn(body);
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
| **turnId** | `string` | The &#x60;turnId&#x60; of a turn in the session\&#39;s &#x60;queue&#x60;. | [Defaults to `undefined`] |

### Return type

[**QueuedTurn**](QueuedTurn.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Let go of; the turn as it waits. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## rewind

> rewind(sessionId, rewindRequest)

Take the conversation back to before a turn, to edit or retry it

Appends a &#x60;rewound&#x60; event: every event after &#x60;toSeq&#x60; no longer counts, for the session and for a reader that replays. The disk is not rewound — what the session did to it stays. Send the edited turn after it; to keep both versions, fork instead. &#x60;409&#x60; while generating. 

### Example

```ts
import {
  Configuration,
  TurnsApi,
} from '@runyard-ai/runyard-sdk';
import type { RewindOperationRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TurnsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // RewindRequest
    rewindRequest: ...,
  } satisfies RewindOperationRequest;

  try {
    const data = await api.rewind(body);
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
| **rewindRequest** | [RewindRequest](RewindRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Rewound. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sendTurn

> TurnAccepted sendTurn(sessionId, turn)

Say something to the session

Accepted at once and answered on the stream. While the session is generating, a turn is queued behind it (&#x60;mode: queue&#x60;, the default), or interrupts it and is taken next (&#x60;mode: interrupt&#x60;). A sleeping session wakes for it. The same &#x60;turnId&#x60; again is &#x60;200&#x60; and changes nothing — a caller that lost the answer resends.  A turn never carries bytes. A file from the caller is uploaded first (&#x60;POST /v1/uploads&#x60;) and attached by its &#x60;uploadId&#x60;: the server keeps it, and puts it on the session\&#39;s disk, under &#x60;.attachments/&lt;turnId&gt;/&#x60;, only when the session is given the turn: each at a &#x60;path&#x60; of its own, numbered when two share a &#x60;name&#x60;. A file already on the session\&#39;s disk is attached by path. An upload a turn names is the session\&#39;s from then on, served by &#x60;GET …/attachments/{uploadId}&#x60; asleep or awake; one named by no turn within &#x60;limits.uploadTtlSeconds&#x60; is evicted. 

### Example

```ts
import {
  Configuration,
  TurnsApi,
} from '@runyard-ai/runyard-sdk';
import type { SendTurnRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new TurnsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // Turn
    turn: ...,
  } satisfies SendTurnRequest;

  try {
    const data = await api.sendTurn(body);
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
| **turn** | [Turn](Turn.md) |  | |

### Return type

[**TurnAccepted**](TurnAccepted.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | That turn was taken already. |  -  |
| **202** | Taken. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **503** | No sandbox can be made now (&#x60;capacity_exceeded&#x60;) or the account is at its quota (&#x60;quota_exceeded&#x60;). The one status that says: try again.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

