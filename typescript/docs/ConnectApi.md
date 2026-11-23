# ConnectApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**connectToken**](ConnectApi.md#connecttoken) | **POST** /v1/connect/token | Exchange a code for the link and its key |
| [**decideConnectConsent**](ConnectApi.md#decideconnectconsent) | **POST** /v1/connect/consent | Approve or deny an application |
| [**getConnectConsent**](ConnectApi.md#getconnectconsent) | **GET** /v1/connect/consent | What the consent page asks the person signed in |
| [**listConnectApps**](ConnectApi.md#listconnectapps) | **GET** /v1/connect/apps | The applications that may connect to the workspace |
| [**listConnectLinks**](ConnectApi.md#listconnectlinks) | **GET** /v1/connect/links | The applications connected to the workspace |
| [**registerConnectApp**](ConnectApi.md#registerconnectapp) | **POST** /v1/connect/apps | Register an application |
| [**removeConnectApp**](ConnectApi.md#removeconnectapp) | **DELETE** /v1/connect/apps/{appId} | Remove a registered application, and its links |
| [**revokeConnectLink**](ConnectApi.md#revokeconnectlink) | **DELETE** /v1/connect/links/{linkId} | Disconnect an application |



## connectToken

> ConnectGrant connectToken(grantType, code, redirectUri, codeVerifier)

Exchange a code for the link and its key

What the application\&#39;s server calls, at the workspace &#x60;iss&#x60; named, with the code and the PKCE verifier. Form-encoded, as OAuth: &#x60;grant_type&#x3D;authorization_code&#x60;, &#x60;code&#x60;, &#x60;redirect_uri&#x60; (the one the code was made for) and &#x60;code_verifier&#x60;; the application authenticates with HTTP Basic, &#x60;client_id:secret&#x60;, checked against the SHA-256 kept.  **The key is minted now**, as the application\&#39;s (&#x60;app:&lt;id&gt;&#x60;), not the admin\&#39;s who approved: it outlives them, and offboarding them does not touch it. It is named after the application (&#x60;&lt;name&gt;: &lt;context&gt;&#x60;), lasts a year, and holds what of the scopes approved an application may hold. The link is recorded, with who approved it: listed and revoked at &#x60;/v1/connect/links&#x60;.  An application serving its own broker to the workspace\&#39;s sessions knows their sandboxes by &#x60;GET /v1/trust-bundle&#x60;, which it follows as it rotates, and not by anything handed here once.  Errors are OAuth\&#39;s (RFC 6749 §5.2): &#x60;401 invalid_client&#x60; for an unknown application or a wrong secret; &#x60;400 invalid_grant&#x60; for a code unknown, used, older than 60 seconds, made for another application or redirect, shown with the wrong verifier, or whose approver is no longer an admin holding what it approved — one answer for all of them. 

### Example

```ts
import {
  Configuration,
  ConnectApi,
} from '@runyard-ai/runyard-sdk';
import type { ConnectTokenRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const config = new Configuration({ 
    // To configure HTTP basic authorization: appClient
    username: "YOUR USERNAME",
    password: "YOUR PASSWORD",
  });
  const api = new ConnectApi(config);

  const body = {
    // string
    grantType: grantType_example,
    // string
    code: code_example,
    // string
    redirectUri: redirectUri_example,
    // string
    codeVerifier: codeVerifier_example,
  } satisfies ConnectTokenRequest;

  try {
    const data = await api.connectToken(body);
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
| **grantType** | `string` |  | [Defaults to `undefined`] |
| **code** | `string` |  | [Defaults to `undefined`] |
| **redirectUri** | `string` |  | [Defaults to `undefined`] |
| **codeVerifier** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ConnectGrant**](ConnectGrant.md)

### Authorization

[appClient](../README.md#appClient)

### HTTP request headers

- **Content-Type**: `application/x-www-form-urlencoded`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The link, with its key this once; the code is spent. |  * Cache-Control - &#x60;no-store&#x60;: the body is a credential. <br>  |
| **400** | &#x60;invalid_request&#x60;, &#x60;unsupported_grant_type&#x60; or &#x60;invalid_grant&#x60;. |  -  |
| **401** | &#x60;invalid_client&#x60;. |  * WWW-Authenticate -  <br>  |
| **500** | &#x60;server_error&#x60;: the sandboxes server\&#39;s CA could not be read, or the key not kept. Nothing was minted. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## decideConnectConsent

> ConnectRedirect decideConnectConsent(connectDecision)

Approve or deny an application

The consent page\&#39;s buttons, as the admin signed in. Everything the authorize request said is judged again here: this is the call anybody could make.  **Approved**, nothing is minted yet: a code is made, bound to the application, the redirect, &#x60;codeChallenge&#x60; and the caller, which lasts 60 seconds and works once; only its SHA-256 is kept, in this server\&#39;s memory. The answer is where the browser goes with it. **Denied**, the answer is the application\&#39;s redirect with &#x60;error&#x3D;access_denied&#x60;. Either carries &#x60;state&#x60; as given, and &#x60;iss&#x60;.  An admin\&#39;s, with &#x60;keys.admin&#x60;; from a browser, only from this server\&#39;s own pages (&#x60;Sec-Fetch-Site&#x60;). 

### Example

```ts
import {
  Configuration,
  ConnectApi,
} from '@runyard-ai/runyard-sdk';
import type { DecideConnectConsentRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ConnectApi(config);

  const body = {
    // ConnectDecision
    connectDecision: ...,
  } satisfies DecideConnectConsentRequest;

  try {
    const data = await api.decideConnectConsent(body);
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
| **connectDecision** | [ConnectDecision](ConnectDecision.md) |  | |

### Return type

[**ConnectRedirect**](ConnectRedirect.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Where the browser goes now. |  * Cache-Control - &#x60;no-store&#x60;: a code is a secret for as long as it lasts. <br>  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The caller is not an admin holding &#x60;keys.admin&#x60;, or is a browser on another site\&#39;s page. |  -  |
| **404** | Nothing by that id. |  -  |
| **503** | The caller has sixteen codes waiting to be exchanged (&#x60;capacity_exceeded&#x60;). Each lasts 60 seconds. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getConnectConsent

> ConnectConsent getConnectConsent(clientId, redirectUri)

What the consent page asks the person signed in

The application a request to &#x60;GET /v1/connect/authorize&#x60; names, as the consent page shows it: its name, the scopes the key would hold — the application\&#39;s, of those the caller holds — and whether the caller may approve, which only an admin of the workspace holding &#x60;keys.admin&#x60; may. Anybody signed in may ask. An unknown application, or a redirect not one of its, is &#x60;404&#x60;. 

### Example

```ts
import {
  Configuration,
  ConnectApi,
} from '@runyard-ai/runyard-sdk';
import type { GetConnectConsentRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ConnectApi(config);

  const body = {
    // string
    clientId: clientId_example,
    // string
    redirectUri: redirectUri_example,
  } satisfies GetConnectConsentRequest;

  try {
    const data = await api.getConnectConsent(body);
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
| **clientId** | `string` |  | [Defaults to `undefined`] |
| **redirectUri** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ConnectConsent**](ConnectConsent.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | What is asked. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listConnectApps

> ConnectAppList listConnectApps()

The applications that may connect to the workspace

Every application the workspace knows: those its release names (&#x60;--apps-file&#x60;, &#x60;source: release&#x60;), which are changed only by a new release, and those an admin registered here (&#x60;source: console&#x60;). Never a secret, nor its hash. An admin\&#39;s, with &#x60;keys.admin&#x60;. 

### Example

```ts
import {
  Configuration,
  ConnectApi,
} from '@runyard-ai/runyard-sdk';
import type { ListConnectAppsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ConnectApi(config);

  try {
    const data = await api.listConnectApps();
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

[**ConnectAppList**](ConnectAppList.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The applications, release ones first, each group by id. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listConnectLinks

> ConnectLinkList listConnectLinks()

The applications connected to the workspace

Each link an admin approved and its application exchanged: the application, who approved it, and the key it holds. A link ends when its key is revoked — here, at &#x60;DELETE /v1/keys/{keyId}&#x60;, or by the application handing it back — and when its application is removed. An admin\&#39;s, with &#x60;keys.admin&#x60;. 

### Example

```ts
import {
  Configuration,
  ConnectApi,
} from '@runyard-ai/runyard-sdk';
import type { ListConnectLinksRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ConnectApi(config);

  try {
    const data = await api.listConnectLinks();
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

[**ConnectLinkList**](ConnectLinkList.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The links, newest first. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## registerConnectApp

> RegisteredConnectApp registerConnectApp(newConnectApp)

Register an application

For a workspace no platform passes applications to — a self-hosted one — or one more beside them. The secret the application authenticates with at &#x60;POST /v1/connect/token&#x60; is made here and is in this answer and nowhere else, ever: only its SHA-256 is kept. An admin\&#39;s, with &#x60;keys.admin&#x60;. An id already taken, by a release application or a registered one, is &#x60;409 conflict&#x60;. 

### Example

```ts
import {
  Configuration,
  ConnectApi,
} from '@runyard-ai/runyard-sdk';
import type { RegisterConnectAppRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ConnectApi(config);

  const body = {
    // NewConnectApp
    newConnectApp: ...,
  } satisfies RegisterConnectAppRequest;

  try {
    const data = await api.registerConnectApp(body);
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
| **newConnectApp** | [NewConnectApp](NewConnectApp.md) |  | |

### Return type

[**RegisteredConnectApp**](RegisteredConnectApp.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Registered, with its secret this once. |  * Cache-Control - &#x60;no-store&#x60;: the body holds a secret. <br>  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## removeConnectApp

> removeConnectApp(appId)

Remove a registered application, and its links

An application registered in the console goes, and every link made with it is revoked with it: their keys stop working at once. A release\&#39;s application is the release\&#39;s to remove: &#x60;409 managed&#x60;. An admin\&#39;s, with &#x60;keys.admin&#x60;. 

### Example

```ts
import {
  Configuration,
  ConnectApi,
} from '@runyard-ai/runyard-sdk';
import type { RemoveConnectAppRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ConnectApi(config);

  const body = {
    // string
    appId: appId_example,
  } satisfies RemoveConnectAppRequest;

  try {
    const data = await api.removeConnectApp(body);
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
| **appId** | `string` |  | [Defaults to `undefined`] |

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
| **204** | Gone, with its links. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | The application is the release\&#39;s (&#x60;managed&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## revokeConnectLink

> revokeConnectLink(linkId)

Disconnect an application

The link\&#39;s key is revoked, at once, and the link goes with it. An admin\&#39;s, with &#x60;keys.admin&#x60;.

### Example

```ts
import {
  Configuration,
  ConnectApi,
} from '@runyard-ai/runyard-sdk';
import type { RevokeConnectLinkRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ConnectApi(config);

  const body = {
    // string
    linkId: linkId_example,
  } satisfies RevokeConnectLinkRequest;

  try {
    const data = await api.revokeConnectLink(body);
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
| **linkId** | `string` |  | [Defaults to `undefined`] |

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
| **204** | Disconnected. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

