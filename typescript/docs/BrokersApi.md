# BrokersApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteBroker**](BrokersApi.md#deletebroker) | **DELETE** /v1/brokers/{brokerName} | Remove a broker |
| [**getBroker**](BrokersApi.md#getbroker) | **GET** /v1/brokers/{brokerName} | A broker |
| [**listBrokers**](BrokersApi.md#listbrokers) | **GET** /v1/brokers | Every broker a session may be given |
| [**putBroker**](BrokersApi.md#putbroker) | **PUT** /v1/brokers/{brokerName} | Declare a broker, or change it |
| [**putBrokerUsers**](BrokersApi.md#putbrokerusers) | **PUT** /v1/brokers/{brokerName}/users | Say who besides its owner may use a broker: whose sessions may be given it |



## deleteBroker

> deleteBroker(brokerName)

Remove a broker

Sessions given it lose it at their next turn. The server\&#39;s own are &#x60;409 in_use&#x60;.

### Example

```ts
import {
  Configuration,
  BrokersApi,
} from '@runyard-ai/runyard-sdk';
import type { DeleteBrokerRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new BrokersApi(config);

  const body = {
    // string
    brokerName: brokerName_example,
  } satisfies DeleteBrokerRequest;

  try {
    const data = await api.deleteBroker(body);
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
| **brokerName** | `string` |  | [Defaults to `undefined`] |

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


## getBroker

> Broker getBroker(brokerName)

A broker

A built-in broker the workspace\&#39;s policy does not allow is &#x60;404&#x60;.

### Example

```ts
import {
  Configuration,
  BrokersApi,
} from '@runyard-ai/runyard-sdk';
import type { GetBrokerRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new BrokersApi(config);

  const body = {
    // string
    brokerName: brokerName_example,
  } satisfies GetBrokerRequest;

  try {
    const data = await api.getBroker(body);
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
| **brokerName** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Broker**](Broker.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The broker. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listBrokers

> BrokerPage listBrokers(limit, cursor)

Every broker a session may be given

The server\&#39;s own brokers the workspace\&#39;s policy allows — every one when it has none — and the declared ones, by name. A built-in its policy does not list is not listed, and is &#x60;404&#x60; to get. 

### Example

```ts
import {
  Configuration,
  BrokersApi,
} from '@runyard-ai/runyard-sdk';
import type { ListBrokersRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new BrokersApi(config);

  const body = {
    // number | At most this many; the default and ceiling are in `GET /v1/info`. (optional)
    limit: 56,
    // string | From a previous page\'s `nextCursor`. Opaque; one made up is `400`. (optional)
    cursor: cursor_example,
  } satisfies ListBrokersRequest;

  try {
    const data = await api.listBrokers(body);
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

[**BrokerPage**](BrokerPage.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The brokers. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putBroker

> Broker putBroker(brokerName, brokerSpec)

Declare a broker, or change it

&#x60;llm&#x60;, &#x60;egress&#x60;, &#x60;tunnels&#x60; and &#x60;sessions&#x60; are the server\&#39;s own: they always exist and are not changed here (&#x60;409 in_use&#x60;). Any other is a &#x60;shared&#x60; broker: one the sandboxes daemon declares under the same name, and dials with the machine\&#39;s certificate. A session\&#39;s machine is given it, and the broker says the rest itself: what the session\&#39;s environment and git are given to reach it, and the MCP server it serves, at &#x60;/.well-known/runyard-broker&#x60;, and its skills, at &#x60;/.well-known/agent-skills&#x60;. What it answers at both is the same for every sandbox of the workspace, and kept as long as its &#x60;Cache-Control: max-age&#x60; says (&#x60;BrokerSpec&#x60;). Its credentials, and what it lets through, are the broker\&#39;s. Another\&#39;s is changed by an admin alone: to anybody else its name is &#x60;409&#x60;. 

### Example

```ts
import {
  Configuration,
  BrokersApi,
} from '@runyard-ai/runyard-sdk';
import type { PutBrokerRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new BrokersApi(config);

  const body = {
    // string
    brokerName: brokerName_example,
    // BrokerSpec
    brokerSpec: ...,
  } satisfies PutBrokerRequest;

  try {
    const data = await api.putBroker(body);
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
| **brokerName** | `string` |  | [Defaults to `undefined`] |
| **brokerSpec** | [BrokerSpec](BrokerSpec.md) |  | |

### Return type

[**Broker**](Broker.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Changed. |  -  |
| **201** | Declared. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putBrokerUsers

> Users putBrokerUsers(brokerName, users)

Say who besides its owner may use a broker: whose sessions may be given it

Its owner\&#39;s, or an admin\&#39;s, to say; it replaces whom it was for. 

### Example

```ts
import {
  Configuration,
  BrokersApi,
} from '@runyard-ai/runyard-sdk';
import type { PutBrokerUsersRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new BrokersApi(config);

  const body = {
    // string
    brokerName: brokerName_example,
    // Users
    users: ...,
  } satisfies PutBrokerUsersRequest;

  try {
    const data = await api.putBrokerUsers(body);
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
| **brokerName** | `string` |  | [Defaults to `undefined`] |
| **users** | [Users](Users.md) |  | |

### Return type

[**Users**](Users.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Whom it is for now. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

