# UsageApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getUsage**](UsageApi.md#getusage) | **GET** /v1/usage | What the sessions used, by hour or by day |



## getUsage

> UsageReport getUsage(range, provider, session, model)

What the sessions used, by hour or by day

An admin\&#39;s holding &#x60;sessions.read&#x60;, or any caller holding &#x60;usage.read&#x60; — the scope that reads this and nothing else, which is what the platform bills a workspace by.  Every call a session\&#39;s harness made to a provider through the &#x60;llm&#x60; broker, counted from what the broker said of it in its &#x60;Runyard-Activity&#x60; annotation, as the sandboxes server\&#39;s activity feed records it: requests, errors and tokens. Consumption, never a price: whoever bills prices it on their side.  &#x60;1d&#x60; is the last 24 hours by hour; &#x60;7d&#x60; and &#x60;30d&#x60; are by day, in UTC. Every bucket of the range is in the answer, the empty ones too, oldest first. The filters narrow everything in the answer. 

### Example

```ts
import {
  Configuration,
  UsageApi,
} from '@runyard-ai/runyard-sdk';
import type { GetUsageRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new UsageApi(config);

  const body = {
    // '1d' | '7d' | '30d' (optional)
    range: range_example,
    // string | One provider\'s calls, by name. (optional)
    provider: provider_example,
    // string | One session\'s calls. (optional)
    session: session_example,
    // string | One model\'s calls. (optional)
    model: claude-opus-5-5,
  } satisfies GetUsageRequest;

  try {
    const data = await api.getUsage(body);
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
| **range** | `1d`, `7d`, `30d` |  | [Optional] [Defaults to `&#39;1d&#39;`] [Enum: 1d, 7d, 30d] |
| **provider** | `string` | One provider\&#39;s calls, by name. | [Optional] [Defaults to `undefined`] |
| **session** | `string` | One session\&#39;s calls. | [Optional] [Defaults to `undefined`] |
| **model** | `string` | One model\&#39;s calls. | [Optional] [Defaults to `undefined`] |

### Return type

[**UsageReport**](UsageReport.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The usage. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

