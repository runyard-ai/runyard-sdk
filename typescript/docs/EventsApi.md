# EventsApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**streamChanges**](EventsApi.md#streamchanges) | **GET** /v1/changes | Every change to the account\&#39;s sessions, from a point on, and as it happens |
| [**streamEvents**](EventsApi.md#streamevents) | **GET** /v1/sessions/{sessionId}/events | The session\&#39;s transcript, from an event on, and as it happens |



## streamChanges

> Change streamChanges(from, follow)

Every change to the account\&#39;s sessions, from a point on, and as it happens

What a chat UI keeps its session list with: list the sessions once, note &#x60;changeSeq&#x60; from the page, and follow from it. One &#x60;Change&#x60; per line; a change carries the session as it is after it. The server keeps the last &#x60;limits.changesKept&#x60;; older is &#x60;409 gapped&#x60;, and the reader lists again. 

### Example

```ts
import {
  Configuration,
  EventsApi,
} from '@runyard-ai/runyard-sdk';
import type { StreamChangesRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new EventsApi(config);

  const body = {
    // number | The first `seq` wanted. The oldest kept when absent. (optional)
    from: 789,
    // boolean | Keep the body open and write what happens next. (optional)
    follow: true,
  } satisfies StreamChangesRequest;

  try {
    const data = await api.streamChanges(body);
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
| **from** | `number` | The first &#x60;seq&#x60; wanted. The oldest kept when absent. | [Optional] [Defaults to `undefined`] |
| **follow** | `boolean` | Keep the body open and write what happens next. | [Optional] [Defaults to `false`] |

### Return type

[**Change**](Change.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/x-ndjson`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The changes. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **409** | The cursor is older than what is kept. The answer says what is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## streamEvents

> EventsLine streamEvents(sessionId, from, follow, subagent)

The session\&#39;s transcript, from an event on, and as it happens

One &#x60;SessionEvent&#x60; per line, from &#x60;from&#x60; (the first kept when absent). With &#x60;follow&#x60;, the body stays open and every new event is written as it happens; a blank line is written at once and every 15 seconds, for proxies, and readers skip blank lines.  With &#x60;subagent&#x60;, only the events of that sub-agent, nested ones included — what a UI shows when a person opens one.  Following, the stream also carries &#x60;PartialLine&#x60;s: the text and thinking the session is writing, before the event that keeps it. They are not transcript — never stored, never in a stream that does not follow — and a reader tells the two apart by &#x60;line&#x60;. Each names the &#x60;seq&#x60; its block is expected to take, and the reader holds one partial per &#x60;seq&#x60;:  - &#x60;offset&#x60; 0 replaces what the reader holds at that &#x60;seq&#x60;; &#x60;offset&#x60;   equal to the length held appends &#x60;text&#x60; to it; any other offset is   ignored. Lengths are UTF-16 code units — a JavaScript string\&#39;s   &#x60;length&#x60;. - An event whose &#x60;seq&#x60; is at least a partial\&#39;s &#x60;seq&#x60; replaces it:   the block is now that event, or gone. A block whose expected place   moves on — another session\&#39;s event took it — comes again at its new   &#x60;seq&#x60; from &#x60;offset&#x60; 0. - &#x60;offset&#x60; 0 with empty &#x60;text&#x60; says the block at that &#x60;seq&#x60; is gone   and no event the reader was sent said so (a session stopped   mid-block, followed through &#x60;subagent&#x60;): drop it.  A reader that starts following mid-block gets the block so far, from &#x60;offset&#x60; 0. A slow reader is sent everything new of a block in one line, never a queue of them.  Following, one &#x60;CaughtUpLine&#x60; is written once every event kept when the reader asked has been: what is before it is the transcript so far, what is after it happens as it is read. It comes before any partial, once per request — a reader that reads again from where it was is told again. A reader can fold what is before it in one go, and draw a long transcript once, at its end, rather than once for every batch the server wrote. 

### Example

```ts
import {
  Configuration,
  EventsApi,
} from '@runyard-ai/runyard-sdk';
import type { StreamEventsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new EventsApi(config);

  const body = {
    // string
    sessionId: sessionId_example,
    // number | The first `seq` wanted. The oldest kept when absent. (optional)
    from: 789,
    // boolean | Keep the body open and write what happens next. (optional)
    follow: true,
    // string | A sub-agent\'s id — the tool call that started it. (optional)
    subagent: subagent_example,
  } satisfies StreamEventsRequest;

  try {
    const data = await api.streamEvents(body);
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
| **from** | `number` | The first &#x60;seq&#x60; wanted. The oldest kept when absent. | [Optional] [Defaults to `undefined`] |
| **follow** | `boolean` | Keep the body open and write what happens next. | [Optional] [Defaults to `false`] |
| **subagent** | `string` | A sub-agent\&#39;s id — the tool call that started it. | [Optional] [Defaults to `undefined`] |

### Return type

[**EventsLine**](EventsLine.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/x-ndjson`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The events and, following, where the reader caught up and the partials. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | The cursor is older than what is kept. The answer says what is. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

