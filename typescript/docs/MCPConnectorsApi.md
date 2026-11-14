# MCPConnectorsApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**authorizeMcpConnector**](MCPConnectorsApi.md#authorizemcpconnectoroperation) | **POST** /v1/mcp-connectors/{mcpConnectorName}/authorize | Start the OAuth flow of an MCP connector |
| [**deleteMcpConnector**](MCPConnectorsApi.md#deletemcpconnector) | **DELETE** /v1/mcp-connectors/{mcpConnectorName} | Remove an MCP connector, and forget its credential |
| [**getMcpConnector**](MCPConnectorsApi.md#getmcpconnector) | **GET** /v1/mcp-connectors/{mcpConnectorName} | An MCP connector, with its tools |
| [**listMcpConnectors**](MCPConnectorsApi.md#listmcpconnectors) | **GET** /v1/mcp-connectors | Every MCP connector a session may be given |
| [**putMcpConnector**](MCPConnectorsApi.md#putmcpconnector) | **PUT** /v1/mcp-connectors/{mcpConnectorName} | Add an MCP connector, or change it |
| [**putMcpConnectorUsers**](MCPConnectorsApi.md#putmcpconnectorusers) | **PUT** /v1/mcp-connectors/{mcpConnectorName}/users | Say who besides its owner may use an MCP connector: whose sessions may be given it |



## authorizeMcpConnector

> AuthorizeMcpConnector200Response authorizeMcpConnector(mcpConnectorName, authorizeMcpConnectorRequest)

Start the OAuth flow of an MCP connector

The answer is where to send the person. The MCP server\&#39;s authorization server sends them back to &#x60;GET /v1/oauth/callback&#x60;, which keeps the tokens here and sends them on to &#x60;returnTo&#x60;. 

### Example

```ts
import {
  Configuration,
  MCPConnectorsApi,
} from '@runyard-ai/runyard-sdk';
import type { AuthorizeMcpConnectorOperationRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MCPConnectorsApi(config);

  const body = {
    // string
    mcpConnectorName: mcpConnectorName_example,
    // AuthorizeMcpConnectorRequest (optional)
    authorizeMcpConnectorRequest: ...,
  } satisfies AuthorizeMcpConnectorOperationRequest;

  try {
    const data = await api.authorizeMcpConnector(body);
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
| **mcpConnectorName** | `string` |  | [Defaults to `undefined`] |
| **authorizeMcpConnectorRequest** | [AuthorizeMcpConnectorRequest](AuthorizeMcpConnectorRequest.md) |  | [Optional] |

### Return type

[**AuthorizeMcpConnector200Response**](AuthorizeMcpConnector200Response.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Where to send the person. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteMcpConnector

> deleteMcpConnector(mcpConnectorName)

Remove an MCP connector, and forget its credential

### Example

```ts
import {
  Configuration,
  MCPConnectorsApi,
} from '@runyard-ai/runyard-sdk';
import type { DeleteMcpConnectorRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MCPConnectorsApi(config);

  const body = {
    // string
    mcpConnectorName: mcpConnectorName_example,
  } satisfies DeleteMcpConnectorRequest;

  try {
    const data = await api.deleteMcpConnector(body);
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
| **mcpConnectorName** | `string` |  | [Defaults to `undefined`] |

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
| **204** | Gone. Sessions given it lose it at their next turn. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getMcpConnector

> McpConnector getMcpConnector(mcpConnectorName)

An MCP connector, with its tools

### Example

```ts
import {
  Configuration,
  MCPConnectorsApi,
} from '@runyard-ai/runyard-sdk';
import type { GetMcpConnectorRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MCPConnectorsApi(config);

  const body = {
    // string
    mcpConnectorName: mcpConnectorName_example,
  } satisfies GetMcpConnectorRequest;

  try {
    const data = await api.getMcpConnector(body);
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
| **mcpConnectorName** | `string` |  | [Defaults to `undefined`] |

### Return type

[**McpConnector**](McpConnector.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The MCP connector, never its credential. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listMcpConnectors

> McpConnectorPage listMcpConnectors(limit, cursor)

Every MCP connector a session may be given

### Example

```ts
import {
  Configuration,
  MCPConnectorsApi,
} from '@runyard-ai/runyard-sdk';
import type { ListMcpConnectorsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MCPConnectorsApi(config);

  const body = {
    // number | At most this many; the default and ceiling are in `GET /v1/info`. (optional)
    limit: 56,
    // string | From a previous page\'s `nextCursor`. Opaque; one made up is `400`. (optional)
    cursor: cursor_example,
  } satisfies ListMcpConnectorsRequest;

  try {
    const data = await api.listMcpConnectors(body);
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

[**McpConnectorPage**](McpConnectorPage.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The MCP connectors. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putMcpConnector

> McpConnector putMcpConnector(mcpConnectorName, mcpConnectorSpec)

Add an MCP connector, or change it

A remote MCP server (streamable HTTP), and how to authenticate to it: not at all, a static header held here, or OAuth — after which the MCP connector is &#x60;needs_authorization&#x60; until a person goes through &#x60;POST …/authorize&#x60;. Its tools are listed from it. 

### Example

```ts
import {
  Configuration,
  MCPConnectorsApi,
} from '@runyard-ai/runyard-sdk';
import type { PutMcpConnectorRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MCPConnectorsApi(config);

  const body = {
    // string
    mcpConnectorName: mcpConnectorName_example,
    // McpConnectorSpec
    mcpConnectorSpec: ...,
  } satisfies PutMcpConnectorRequest;

  try {
    const data = await api.putMcpConnector(body);
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
| **mcpConnectorName** | `string` |  | [Defaults to `undefined`] |
| **mcpConnectorSpec** | [McpConnectorSpec](McpConnectorSpec.md) |  | |

### Return type

[**McpConnector**](McpConnector.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Changed. |  -  |
| **201** | Added. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putMcpConnectorUsers

> Users putMcpConnectorUsers(mcpConnectorName, users)

Say who besides its owner may use an MCP connector: whose sessions may be given it

Its owner\&#39;s, or an admin\&#39;s, to say; it replaces whom it was for. 

### Example

```ts
import {
  Configuration,
  MCPConnectorsApi,
} from '@runyard-ai/runyard-sdk';
import type { PutMcpConnectorUsersRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MCPConnectorsApi(config);

  const body = {
    // string
    mcpConnectorName: mcpConnectorName_example,
    // Users
    users: ...,
  } satisfies PutMcpConnectorUsersRequest;

  try {
    const data = await api.putMcpConnectorUsers(body);
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
| **mcpConnectorName** | `string` |  | [Defaults to `undefined`] |
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

