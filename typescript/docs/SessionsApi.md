# SessionsApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**archiveSession**](SessionsApi.md#archivesession) | **POST** /v1/sessions/{sessionId}/archive | Archive a session |
| [**createSession**](SessionsApi.md#createsession) | **PUT** /v1/sessions/{sessionId} | Start a session under an id the caller chose |
| [**createSessionToken**](SessionsApi.md#createsessiontoken) | **POST** /v1/sessions/{sessionId}/tokens | A token a browser talks to this session with |
| [**deleteSession**](SessionsApi.md#deletesession) | **DELETE** /v1/sessions/{sessionId} | Delete a session, its sandbox, its disk and its transcript |
| [**forkSession**](SessionsApi.md#forksession) | **POST** /v1/sessions/{sessionId}/fork | Start a new session from this one\&#39;s conversation, up to an event |
| [**getActivity**](SessionsApi.md#getactivity) | **GET** /v1/activity/{activityId} | One request a session sent through a broker, and its answer, whole |
| [**getActivityBody**](SessionsApi.md#getactivitybody) | **GET** /v1/activity/{activityId}/body | An entry\&#39;s bodies, fetched from the runner that keeps them |
| [**getAvailableRunners**](SessionsApi.md#getavailablerunners) | **GET** /v1/available-runners | Whether a new session\&#39;s sandbox has somewhere to run |
| [**getExchange**](SessionsApi.md#getexchange) | **GET** /v1/sessions/{sessionId}/exchanges/{exchangeId} | One call the session\&#39;s harness made to the model, whole |
| [**getLineage**](SessionsApi.md#getlineage) | **GET** /v1/sessions/{sessionId}/lineage | The tree this session belongs to |
| [**getSession**](SessionsApi.md#getsession) | **GET** /v1/sessions/{sessionId} | A session |
| [**getSessionShares**](SessionsApi.md#getsessionshares) | **GET** /v1/sessions/{sessionId}/shares | Whom the session is shared with |
| [**listActivity**](SessionsApi.md#listactivity) | **GET** /v1/activity | What sessions did through their brokers, newest first |
| [**listExchanges**](SessionsApi.md#listexchanges) | **GET** /v1/sessions/{sessionId}/exchanges | The calls the session\&#39;s harness made to the model, newest first |
| [**listSessions**](SessionsApi.md#listsessions) | **GET** /v1/sessions | The account\&#39;s sessions, newest activity first |
| [**putSessionShares**](SessionsApi.md#putsessionshares) | **PUT** /v1/sessions/{sessionId}/shares | Share the session with these people, and no others |
| [**restoreSession**](SessionsApi.md#restoresession) | **POST** /v1/sessions/{sessionId}/restore | Bring an archived session back |
| [**retitle**](SessionsApi.md#retitle) | **POST** /v1/sessions/{sessionId}/retitle | Title the session from its conversation now |
| [**searchSessions**](SessionsApi.md#searchsessions) | **GET** /v1/search | The sessions whose transcripts say something, newest activity first |
| [**sleepSession**](SessionsApi.md#sleepsession) | **POST** /v1/sessions/{sessionId}/sleep | Release a session\&#39;s sandbox now, keeping its disk |
| [**startSession**](SessionsApi.md#startsession) | **POST** /v1/sessions | Start a session |
| [**updateSession**](SessionsApi.md#updatesession) | **PATCH** /v1/sessions/{sessionId} | Retitle, relabel, or reconfigure a session |
| [**wakeSession**](SessionsApi.md#wakesession) | **POST** /v1/sessions/{sessionId}/wake | Give a sleeping session a sandbox again, without a turn |



## archiveSession

> Session archiveSession(sessionId)

Archive a session

It is put to sleep, out of the default list, and refuses turns until restored. Its disk and transcript are kept. A &#x60;locked&#x60; session is &#x60;409&#x60;: unlock it first. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { ArchiveSessionRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
  } satisfies ArchiveSessionRequest;

  try {
    const data = await api.archiveSession(body);
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

[**Session**](Session.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Archived. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createSession

> Session createSession(sessionId, sessionSpec)

Start a session under an id the caller chose

**Deprecated: &#x60;POST /v1/sessions&#x60;**, where the server names the session. Kept so that a caller written against it goes on working while it moves, on this timeline:  | date | | |---|---| | 2026-11-13 | deprecated: every answer says so in &#x60;Deprecation&#x60; and &#x60;Sunset&#x60; headers, and the server logs each use with its caller | | 2026-12-15 | every caller has moved | | 2027-01-31 | removed |  From a profile (&#x60;profileId&#x60;, at its latest version unless one is named), with any field of the session overridden, or from nothing but the overrides. The answer comes at once, the sandbox &#x60;creating&#x60;; the session\&#39;s stream says when its harness is up. A first turn may be sent with it, and is taken as soon as the session is.  The same request again is &#x60;200&#x60; with the session as it is now; a different one under the same id is &#x60;409 spec_conflict&#x60;. **An id a deleted session had is never taken again**: it is &#x60;409 conflict&#x60;, so that nothing which knew the deleted session by its id is handed a new one, of somebody else\&#39;s, in its place.  A session whose disk the workspace\&#39;s disk budget has no room left for is refused &#x60;507 quota_exceeded&#x60;, before anything is kept: every session\&#39;s disk is counted at its full size for as long as it is kept, so waiting frees none of it, and deleting a session does. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { CreateSessionRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // SessionSpec
    sessionSpec: ...,
  } satisfies CreateSessionRequest;

  try {
    const data = await api.createSession(body);
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
| **sessionSpec** | [SessionSpec](SessionSpec.md) |  | |

### Return type

[**Session**](Session.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | It existed already, made by this same request. |  * Deprecation - When choosing a session\&#39;s id was deprecated (RFC 9745): &#x60;@1794528000&#x60;, 2026-11-13. <br>  * Sunset - When it is removed (RFC 8594): Sun, 31 Jan 2027 00:00:00 GMT. <br>  |
| **201** | Started. |  * Deprecation - When choosing a session\&#39;s id was deprecated (RFC 9745): &#x60;@1794528000&#x60;, 2026-11-13. <br>  * Sunset - When it is removed (RFC 8594): Sun, 31 Jan 2027 00:00:00 GMT. <br>  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |
| **503** | No sandbox can be made now (&#x60;capacity_exceeded&#x60;) or the account is at its quota (&#x60;quota_exceeded&#x60;). The one status that says: try again.  |  -  |
| **507** | The workspace\&#39;s disk budget is full (&#x60;quota_exceeded&#x60;): the disks of its sessions, each counted at its full size, leave no room for this one\&#39;s. The message says the budget, what is held of it and what was asked (&#x60;GET /v1/quota&#x60;). Not a status to try again on: a disk is given back when its session is deleted, and not by waiting.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createSessionToken

> SessionToken createSessionToken(sessionId, sessionTokenRequest)

A token a browser talks to this session with

A session token: what an application\&#39;s backend hands a browser so that it talks to the server directly — reading the session, its transcript, files and sub-agents, sending and steering its turns, uploading what they attach — in this session alone, and nothing else (&#x60;403&#x60;). It is answered from any origin (CORS), being no cookie.  It speaks for its end user, when it has one: its turns are sent for them (&#x60;Turn.endUser&#x60;). Absent, the session\&#39;s end user; a session for an end user has tokens for them alone (&#x60;400&#x60;), and only an application\&#39;s session has end users at all.  It is signed by the server and kept nowhere: it ends at &#x60;expiresAt&#x60; — an hour by default, a day at most — or with its session, or once its owner may no longer steer it. Whoever may steer the session mints one: its owner, or an admin; never a session, nor another token. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { CreateSessionTokenRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // SessionTokenRequest
    sessionTokenRequest: ...,
  } satisfies CreateSessionTokenRequest;

  try {
    const data = await api.createSessionToken(body);
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
| **sessionTokenRequest** | [SessionTokenRequest](SessionTokenRequest.md) |  | |

### Return type

[**SessionToken**](SessionToken.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The token. |  * Cache-Control - &#x60;no-store&#x60;: the body is a credential. <br>  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteSession

> DeletedLater deleteSession(sessionId)

Delete a session, its sandbox, its disk and its transcript

Irreversible. The sessions it started are not deleted: they keep their &#x60;parentId&#x60;, and their lineage says the parent is gone. A &#x60;locked&#x60; session is &#x60;409&#x60;: unlock it first. A session, through its &#x60;sessions&#x60; broker, deletes only the sessions it started and those under them: any other — itself, its parent, a sibling — is &#x60;404&#x60;.  A session whose disk is on a runner that is away is deleted here at once, and its machine and disk when that runner is back: &#x60;202&#x60;, naming the runner. The sandboxes server lists them &#x60;deleting&#x60; until then. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { DeleteSessionRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
  } satisfies DeleteSessionRequest;

  try {
    const data = await api.deleteSession(body);
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

[**DeletedLater**](DeletedLater.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Gone. |  -  |
| **202** | Gone, but for its machine and disk, deleted once the runner holding them is back. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## forkSession

> Session forkSession(sessionId, forkRequest, idempotencyKey)

Start a new session from this one\&#39;s conversation, up to an event

The new session has the transcript up to &#x60;atSeq&#x60; (the whole of it when absent), its harness\&#39;s conversation to that point, and a sandbox of its own. Its lineage is &#x60;fork&#x60;, &#x60;branchedFrom&#x60; this session at that event.  The server names the fork, as &#x60;POST /v1/sessions&#x60; names a session: its &#x60;id&#x60; is in the answer. A retry is made safe by &#x60;Idempotency-Key&#x60;, the same way. &#x60;newSessionId&#x60; is deprecated, and kept so that a caller written against it goes on working while it moves, on the timeline &#x60;PUT /v1/sessions/{sessionId}&#x60; says — removed 2027-01-31; a fork asked for under it answers &#x60;Deprecation&#x60; and &#x60;Sunset&#x60; headers. It is idempotent by it, and an id a deleted session had is never taken again (&#x60;409 conflict&#x60;). Both at once is &#x60;400&#x60;.  Its &#x60;/workspace&#x60; starts empty unless &#x60;disk&#x60; is true, which copies this session\&#39;s &#x60;/workspace&#x60; as it is now. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { ForkSessionRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // ForkRequest
    forkRequest: ...,
    // string | The caller\'s name for this request, so that sending it again — an answer lost, a connection dropped — finds what it made rather than making another. The caller\'s own: another caller\'s same key is another request. (optional)
    idempotencyKey: idempotencyKey_example,
  } satisfies ForkSessionRequest;

  try {
    const data = await api.forkSession(body);
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
| **forkRequest** | [ForkRequest](ForkRequest.md) |  | |
| **idempotencyKey** | `string` | The caller\&#39;s name for this request, so that sending it again — an answer lost, a connection dropped — finds what it made rather than making another. The caller\&#39;s own: another caller\&#39;s same key is another request. | [Optional] [Defaults to `undefined`] |

### Return type

[**Session**](Session.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | That fork existed already. |  * Deprecation - When choosing a session\&#39;s id was deprecated (RFC 9745): &#x60;@1794528000&#x60;, 2026-11-13. <br>  * Sunset - When it is removed (RFC 8594): Sun, 31 Jan 2027 00:00:00 GMT. <br>  |
| **201** | The fork. |  * Deprecation - When choosing a session\&#39;s id was deprecated (RFC 9745): &#x60;@1794528000&#x60;, 2026-11-13. <br>  * Sunset - When it is removed (RFC 8594): Sun, 31 Jan 2027 00:00:00 GMT. <br>  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **503** | No sandbox can be made now (&#x60;capacity_exceeded&#x60;) or the account is at its quota (&#x60;quota_exceeded&#x60;). The one status that says: try again.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getActivity

> Activity getActivity(activityId)

One request a session sent through a broker, and its answer, whole

The request as the session\&#39;s machine sent it and the answer as the broker gave it back: headers, and each body up to a mebibyte (&#x60;truncated&#x60; when it had more, &#x60;size&#x60; saying how much). A credential the machine sent or the answer set is not kept.  A gateway entry\&#39;s bodies are not here (&#x60;bodiesOnRunner&#x60;): they stay on the runner that saw the exchange, and are fetched with &#x60;GET /v1/activity/{activityId}/body&#x60; only when somebody opens them. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { GetActivityRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    activityId: activityId_example,
  } satisfies GetActivityRequest;

  try {
    const data = await api.getActivity(body);
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
| **activityId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Activity**](Activity.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The entry. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getActivityBody

> ActivityBodies getActivityBody(activityId)

An entry\&#39;s bodies, fetched from the runner that keeps them

As much of the body the machine sent, and of the one it was answered, as was kept. For an entry with &#x60;bodiesOnRunner&#x60;, asked of the sandboxes server when this is called, and never before: it fetches them from the runner that saw the exchange (&#x60;activity.bodies&#x60;) and records the read in its own feed. Anyone else\&#39;s, from here.  &#x60;503 runner_offline&#x60; while that runner is offline, naming it: the entry is listed as usual, and its bodies can be read once the runner is back. &#x60;410 gone&#x60; once they are gone for good: the runner revoked, or the bodies kept for longer than it keeps them. Read as the entry is: a member their own sessions\&#39;, an admin everyone\&#39;s. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { GetActivityBodyRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    activityId: activityId_example,
  } satisfies GetActivityBodyRequest;

  try {
    const data = await api.getActivityBody(body);
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
| **activityId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ActivityBodies**](ActivityBodies.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The bodies. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **410** | The bodies are gone for good (&#x60;gone&#x60;), and the message says why. |  -  |
| **503** | The runner that keeps them is offline (&#x60;runner_offline&#x60;), and the message names it. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getAvailableRunners

> AvailableRunners getAvailableRunners()

Whether a new session\&#39;s sandbox has somewhere to run

How many of the workspace\&#39;s runners could take a new session\&#39;s sandbox now, as its runyard-sandboxes server lists them (read with the workspace\&#39;s own key): those approved and &#x60;online&#x60;, &#x60;unreachable&#x60; or &#x60;held&#x60; — not one &#x60;pending&#x60; approval, &#x60;draining&#x60;, &#x60;expired&#x60; or &#x60;revoked&#x60;. With none, a session started has its sandbox placed nowhere and fails (&#x60;unplaceable&#x60;), so a client reads this before starting one and says so instead. Anybody with &#x60;sessions.read&#x60; may read it; the runners themselves are an admin\&#39;s (&#x60;listRunners&#x60;). 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { GetAvailableRunnersRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  try {
    const data = await api.getAvailableRunners();
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

[**AvailableRunners**](AvailableRunners.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The runners a sandbox could be placed on. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getExchange

> Exchange getExchange(sessionId, exchangeId)

One call the session\&#39;s harness made to the model, whole

What the session sent — the request body as it went to the provider: the system prompt, the messages, the tool definitions, thinking, &#x60;max_tokens&#x60;, &#x60;metadata&#x60; and the rest — with the headers that change its meaning (&#x60;anthropic-beta&#x60;, &#x60;anthropic-version&#x60;, &#x60;openai-beta&#x60;, …), and what the provider answered. A credential is never kept, and so is never here.  A streamed answer is the message assembled from its events — what the same call would have answered without &#x60;stream&#x60; — as far as it got: one cut short has no &#x60;stop_reason&#x60;, and one the provider ended with an error event carries that &#x60;error&#x60;. Any other answer is its body; one that is not a JSON object is &#x60;{\&quot;text\&quot;: &lt;the body&gt;}&#x60;.  &#x60;previousId&#x60; and &#x60;nextId&#x60; are the session\&#39;s neighbouring exchanges by when they were sent, so a caller can walk them from any one. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { GetExchangeRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // string
    exchangeId: exchangeId_example,
  } satisfies GetExchangeRequest;

  try {
    const data = await api.getExchange(body);
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
| **exchangeId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Exchange**](Exchange.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The exchange. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getLineage

> Lineage getLineage(sessionId)

The tree this session belongs to

From its root — a person\&#39;s session, a caller\&#39;s, or a trigger\&#39;s firing — down, depth first, every session started or forked from another in it. At most &#x60;limits.maxLineage&#x60; nodes; &#x60;truncated&#x60; says when there were more. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { GetLineageRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
  } satisfies GetLineageRequest;

  try {
    const data = await api.getLineage(body);
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

[**Lineage**](Lineage.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The tree. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSession

> Session getSession(sessionId)

A session

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { GetSessionRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
  } satisfies GetSessionRequest;

  try {
    const data = await api.getSession(body);
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

[**Session**](Session.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The session. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSessionShares

> SessionShares getSessionShares(sessionId)

Whom the session is shared with

A session is shared with its tree — the sessions it started, and forks — from its root: sharing any of them shares the root\&#39;s. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { GetSessionSharesRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
  } satisfies GetSessionSharesRequest;

  try {
    const data = await api.getSessionShares(body);
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

[**SessionShares**](SessionShares.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The people it is shared with. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listActivity

> ActivityPage listActivity(limit, cursor, session, broker, kind)

What sessions did through their brokers, newest first

Every request a session\&#39;s machine sent through a broker, and the answer — recorded as it passed, not said by the session: an MCP connector\&#39;s tool called, a &#x60;git push&#x60; and the refs it moved, a request through an http broker, a host opened through &#x60;egress&#x60;, a tunnel, a session or an image asked for. Kept a while (&#x60;--activity-kept&#x60;, a week by default) and then forgotten; kept after its session is deleted, until then.  Where the sandboxes daemon keeps a record of every brokered request — its access gateway\&#39;s feed, which this server reads — that record is the entry, through any broker: this server\&#39;s own, a shared one the daemon dials, one a person\&#39;s own program serves (&#x60;kind: gateway&#x60;, with how it ended and what it carried). Before a daemon has one, this server records the brokers it serves itself, and nothing else.  Not here: the &#x60;llm&#x60; broker\&#39;s calls, which are the session\&#39;s exchanges (&#x60;GET /v1/sessions/{sessionId}/exchanges&#x60;) — but the ones the server made itself for the session, as its harness would have, which are no part of its conversation: each is here, a &#x60;one_off&#x60;.  And beside what sessions did, every call the Runyard platform made to this server\&#39;s API with a platform token: &#x60;kind: api&#x60;, &#x60;actor: platform&#x60;, no session\&#39;s and nobody\&#39;s — an admin\&#39;s to read.  And every program a session\&#39;s machine ran, as its kernel recorded it before it ran (&#x60;kind: exec&#x60;): through no broker, and many for each command a harness runs, so listed only when asked for, with &#x60;kind&#x3D;exec&#x60;.  A summary of each, the newest first; &#x60;GET /v1/activity/{activityId}&#x60; is one whole. A member reads their own sessions\&#39;; an admin, everyone\&#39;s. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { ListActivityRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // number | At most this many; the default and ceiling are in `GET /v1/info`. (optional)
    limit: 56,
    // string | From a previous page\'s `nextCursor`. Opaque; one made up is `400`. (optional)
    cursor: cursor_example,
    // string | One session\'s. (optional)
    session: session_example,
    // string | One broker\'s, by its name in the machine (`mcp-github`, `my-git`, `egress`). (optional)
    broker: broker_example,
    // 'mcp' | 'egress' | 'tunnels' | 'sessions' | 'images' | 'gateway' | 'one_off' | 'api' | 'exec' | One kind\'s. Without it, every kind but `exec`: the programs a machine ran are many more than what went through its brokers, and would bury them.  (optional)
    kind: kind_example,
  } satisfies ListActivityRequest;

  try {
    const data = await api.listActivity(body);
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
| **session** | `string` | One session\&#39;s. | [Optional] [Defaults to `undefined`] |
| **broker** | `string` | One broker\&#39;s, by its name in the machine (&#x60;mcp-github&#x60;, &#x60;my-git&#x60;, &#x60;egress&#x60;). | [Optional] [Defaults to `undefined`] |
| **kind** | `mcp`, `egress`, `tunnels`, `sessions`, `images`, `gateway`, `one_off`, `api`, `exec` | One kind\&#39;s. Without it, every kind but &#x60;exec&#x60;: the programs a machine ran are many more than what went through its brokers, and would bury them.  | [Optional] [Defaults to `undefined`] [Enum: mcp, egress, tunnels, sessions, images, gateway, one_off, api, exec] |

### Return type

[**ActivityPage**](ActivityPage.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The entries. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listExchanges

> ExchangePage listExchanges(sessionId, limit, cursor, model, status)

The calls the session\&#39;s harness made to the model, newest first

The record of what the harness sent: every call the session\&#39;s &#x60;llm&#x60; broker carried to the provider and back — an *exchange* — kept for a while (&#x60;--exchanges-kept&#x60;, a week by default) and then forgotten, and with the session when it is deleted. Calls that count tokens and that list the models are kept too, told apart by &#x60;path&#x60;.  This is a summary of each, newest first by when it was sent; &#x60;GET …/exchanges/{exchangeId}&#x60; is one whole: the request as sent, and the answer. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { ListExchangesRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // number | At most this many; the default and ceiling are in `GET /v1/info`. (optional)
    limit: 56,
    // string | From a previous page\'s `nextCursor`. Opaque; one made up is `400`. (optional)
    cursor: cursor_example,
    // string | One model\'s calls. (optional)
    model: claude-opus-5-5,
    // 'ok' | 'error' | `ok`, the calls the provider answered with a status below 400; `error`, those it answered with 400 or more.  (optional)
    status: status_example,
  } satisfies ListExchangesRequest;

  try {
    const data = await api.listExchanges(body);
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
| **limit** | `number` | At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;. | [Optional] [Defaults to `undefined`] |
| **cursor** | `string` | From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;. | [Optional] [Defaults to `undefined`] |
| **model** | `string` | One model\&#39;s calls. | [Optional] [Defaults to `undefined`] |
| **status** | `ok`, `error` | &#x60;ok&#x60;, the calls the provider answered with a status below 400; &#x60;error&#x60;, those it answered with 400 or more.  | [Optional] [Defaults to `undefined`] [Enum: ok, error] |

### Return type

[**ExchangePage**](ExchangePage.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The exchanges. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listSessions

> SessionPage listSessions(limit, cursor, whose, owner, endUser, state, source, archived, profileId, parentId, rootId, triggerId, label)

The account\&#39;s sessions, newest activity first

Every session, for an admin; for a member, their own and those shared with them — which is what &#x60;whose: mine&#x60; is for an admin too. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { ListSessionsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // number | At most this many; the default and ceiling are in `GET /v1/info`. (optional)
    limit: 56,
    // string | From a previous page\'s `nextCursor`. Opaque; one made up is `400`. (optional)
    cursor: cursor_example,
    // 'all' | 'mine' (optional)
    whose: whose_example,
    // string | Those of this owner alone, of those the caller sees. (optional)
    owner: owner_example,
    // string | Those for the end user of this id alone, of those the caller sees. (optional)
    endUser: endUser_example,
    // Array<SessionState> | Any of these states. (optional)
    state: ...,
    // Array<SessionSource> | Any of these sources. (optional)
    source: ...,
    // boolean | Archived sessions only, or none of them (the default). (optional)
    archived: true,
    // string (optional)
    profileId: profileId_example,
    // string | The sessions this one started or forked. (optional)
    parentId: parentId_example,
    // string | Every session of one tree. (optional)
    rootId: rootId_example,
    // string | The sessions a trigger\'s firings started. (optional)
    triggerId: triggerId_example,
    // Array<string> | `key=value`, each one required. (optional)
    label: ...,
  } satisfies ListSessionsRequest;

  try {
    const data = await api.listSessions(body);
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
| **whose** | `all`, `mine` |  | [Optional] [Defaults to `&#39;all&#39;`] [Enum: all, mine] |
| **owner** | `string` | Those of this owner alone, of those the caller sees. | [Optional] [Defaults to `undefined`] |
| **endUser** | `string` | Those for the end user of this id alone, of those the caller sees. | [Optional] [Defaults to `undefined`] |
| **state** | `Array<SessionState>` | Any of these states. | [Optional] |
| **source** | `Array<SessionSource>` | Any of these sources. | [Optional] |
| **archived** | `boolean` | Archived sessions only, or none of them (the default). | [Optional] [Defaults to `false`] |
| **profileId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **parentId** | `string` | The sessions this one started or forked. | [Optional] [Defaults to `undefined`] |
| **rootId** | `string` | Every session of one tree. | [Optional] [Defaults to `undefined`] |
| **triggerId** | `string` | The sessions a trigger\&#39;s firings started. | [Optional] [Defaults to `undefined`] |
| **label** | `Array<string>` | &#x60;key&#x3D;value&#x60;, each one required. | [Optional] |

### Return type

[**SessionPage**](SessionPage.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The sessions. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putSessionShares

> SessionShares putSessionShares(sessionId, sessionShares)

Share the session with these people, and no others

They read it — its transcript, its files, its work — and do not steer it. Its person and an admin share it; each one named is a person of the workspace, or it is &#x60;400&#x60;. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { PutSessionSharesRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // SessionShares
    sessionShares: ...,
  } satisfies PutSessionSharesRequest;

  try {
    const data = await api.putSessionShares(body);
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
| **sessionShares** | [SessionShares](SessionShares.md) |  | |

### Return type

[**SessionShares**](SessionShares.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Shared. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## restoreSession

> Session restoreSession(sessionId)

Bring an archived session back

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { RestoreSessionRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
  } satisfies RestoreSessionRequest;

  try {
    const data = await api.restoreSession(body);
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

[**Session**](Session.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Restored, asleep until spoken to. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## retitle

> Session retitle(sessionId)

Title the session from its conversation now

Asks the session\&#39;s provider for a title of what its conversation is about, and gives the session it: &#x60;titleSource&#x60; is &#x60;summary&#x60;. The call is made by the server, not the session\&#39;s machine, but as the session\&#39;s harness makes its own — its request, its prompt, its model — and is paid for as the session\&#39;s (&#x60;…/costs&#x60;). It is not one of the session\&#39;s exchanges: it is in the activity (&#x60;GET /v1/activity&#x60;), a &#x60;one_off&#x60;.  &#x60;403&#x60; when the workspace\&#39;s &#x60;titleSummaries&#x60; are off; &#x60;400 not_supported&#x60; when the session\&#39;s harness does not title (its &#x60;features&#x60; lack &#x60;title&#x60;); &#x60;409&#x60; when it has not called its model yet, or the conversation has nothing to title; &#x60;502&#x60; when the provider failed or answered no title. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { RetitleRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
  } satisfies RetitleRequest;

  try {
    const data = await api.retitle(body);
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

[**Session**](Session.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The session, titled. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## searchSessions

> SessionMatchList searchSessions(q, limit, archived)

The sessions whose transcripts say something, newest activity first

Of the caller\&#39;s sessions and those shared with them (&#x60;listSessions&#x60; with &#x60;whose: mine&#x60;, an admin\&#39;s as a member\&#39;s), those whose transcripts say every word of &#x60;q&#x60;: in what a person wrote to them, what they answered, the tools they called and the start of what those answered. Each comes with the newest event that says it. A word is found inside longer ones (&#x60;pull/14&#x60; finds &#x60;…/pull/143&#x60;), whatever its case and accents; a word of fewer than three characters is not searched for, and a &#x60;q&#x60; with no other word finds nothing. Titles are not searched: a caller has them already. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { SearchSessionsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string | The words, separated by spaces.
    q: q_example,
    // number | At most this many; the default and ceiling are in `GET /v1/info`. (optional)
    limit: 56,
    // boolean | Archived sessions only, or none of them (the default). (optional)
    archived: true,
  } satisfies SearchSessionsRequest;

  try {
    const data = await api.searchSessions(body);
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
| **q** | `string` | The words, separated by spaces. | [Defaults to `undefined`] |
| **limit** | `number` | At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;. | [Optional] [Defaults to `undefined`] |
| **archived** | `boolean` | Archived sessions only, or none of them (the default). | [Optional] [Defaults to `false`] |

### Return type

[**SessionMatchList**](SessionMatchList.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The sessions found, at most &#x60;limit&#x60; of them. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sleepSession

> Session sleepSession(sessionId)

Release a session\&#39;s sandbox now, keeping its disk

What the server does by itself after &#x60;sandbox.idleSeconds&#x60; without a turn or a running background task. A generating session is &#x60;409&#x60;: interrupt it first. A pending alarm wakes it again shortly before it fires (&#x60;nextAlarmAt&#x60;). 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { SleepSessionRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
  } satisfies SleepSessionRequest;

  try {
    const data = await api.sleepSession(body);
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

[**Session**](Session.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Going to sleep. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## startSession

> Session startSession(sessionSpec, idempotencyKey)

Start a session

From a profile (&#x60;profileId&#x60;, at its latest version unless one is named), with any field of the session overridden, or from nothing but the overrides. The answer comes at once, the sandbox &#x60;creating&#x60;; the session\&#39;s stream says when its harness is up. A first turn may be sent with it, and is taken as soon as the session is.  **The server names the session**: its &#x60;id&#x60; is in the answer, opaque, and never one a session had before. A caller cannot choose it, so nothing that knows a session by its id — a broker, an application, a log — can be handed a session somebody else made under an id it already trusts.  A retry is made safe by &#x60;Idempotency-Key&#x60;, which is the caller\&#39;s own: the same key and the same request again is &#x60;200&#x60; with the session it made, as it is now; the same key with a different request is &#x60;409 spec_conflict&#x60;. A key is the caller\&#39;s — another caller\&#39;s same key is another request — and lasts as long as the session it made.  A session whose disk the workspace\&#39;s disk budget has no room left for is refused &#x60;507 quota_exceeded&#x60;, before anything is kept: every session\&#39;s disk is counted at its full size for as long as it is kept, so waiting frees none of it, and deleting a session does. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { StartSessionRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // SessionSpec
    sessionSpec: ...,
    // string | The caller\'s name for this request, so that sending it again — an answer lost, a connection dropped — finds what it made rather than making another. The caller\'s own: another caller\'s same key is another request. (optional)
    idempotencyKey: idempotencyKey_example,
  } satisfies StartSessionRequest;

  try {
    const data = await api.startSession(body);
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
| **sessionSpec** | [SessionSpec](SessionSpec.md) |  | |
| **idempotencyKey** | `string` | The caller\&#39;s name for this request, so that sending it again — an answer lost, a connection dropped — finds what it made rather than making another. The caller\&#39;s own: another caller\&#39;s same key is another request. | [Optional] [Defaults to `undefined`] |

### Return type

[**Session**](Session.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | It existed already, made by this same request under the same &#x60;Idempotency-Key&#x60;. |  -  |
| **201** | Started. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |
| **503** | No sandbox can be made now (&#x60;capacity_exceeded&#x60;) or the account is at its quota (&#x60;quota_exceeded&#x60;). The one status that says: try again.  |  -  |
| **507** | The workspace\&#39;s disk budget is full (&#x60;quota_exceeded&#x60;): the disks of its sessions, each counted at its full size, leave no room for this one\&#39;s. The message says the budget, what is held of it and what was asked (&#x60;GET /v1/quota&#x60;). Not a status to try again on: a disk is given back when its session is deleted, and not by waiting.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateSession

> Session updateSession(sessionId, sessionUpdate)

Retitle, relabel, or reconfigure a session

Absent fields are left as they are. A change of model, brokers, or MCP connectors restarts the session at its next turn, resumed from the transcript; a change of resources applies the next time the sandbox is made — at once if &#x60;restartSandbox&#x60;, else when it wakes. 

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { UpdateSessionRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // SessionUpdate
    sessionUpdate: ...,
  } satisfies UpdateSessionRequest;

  try {
    const data = await api.updateSession(body);
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
| **sessionUpdate** | [SessionUpdate](SessionUpdate.md) |  | |

### Return type

[**Session**](Session.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The session, changed. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## wakeSession

> Session wakeSession(sessionId)

Give a sleeping session a sandbox again, without a turn

A turn wakes a session by itself; this is for a caller about to open its terminal or files.

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@runyard-ai/runyard-sdk';
import type { WakeSessionRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SessionsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
  } satisfies WakeSessionRequest;

  try {
    const data = await api.wakeSession(body);
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

[**Session**](Session.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Waking. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **503** | No sandbox can be made now (&#x60;capacity_exceeded&#x60;) or the account is at its quota (&#x60;quota_exceeded&#x60;). The one status that says: try again.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

