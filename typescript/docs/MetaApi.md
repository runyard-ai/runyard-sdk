# MetaApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**confirmSignIn**](MetaApi.md#confirmsignin) | **POST** /v1/signin/confirm | Confirm it is you, with your password again |
| [**getContract**](MetaApi.md#getcontract) | **GET** /v1/openapi.yaml | This document, as the server serves it |
| [**getInfo**](MetaApi.md#getinfo) | **GET** /v1/info | The workspace, and the server\&#39;s defaults and limits |
| [**getPreferences**](MetaApi.md#getpreferences) | **GET** /v1/self/preferences | The person\&#39;s own choices |
| [**getSelf**](MetaApi.md#getself) | **GET** /v1/self | The key, person, session or platform calling |
| [**getSelfDirectory**](MetaApi.md#getselfdirectory) | **GET** /v1/self/directory | The orgs and workspaces the caller\&#39;s person may reach |
| [**getSelfPicture**](MetaApi.md#getselfpicture) | **GET** /v1/self/picture | The person\&#39;s profile picture |
| [**getWorkspaceSettings**](MetaApi.md#getworkspacesettings) | **GET** /v1/settings | The workspace\&#39;s settings |
| [**health**](MetaApi.md#health) | **GET** /healthz | Whether the server is up |
| [**listNotices**](MetaApi.md#listnotices) | **GET** /v1/self/notices | What the caller should know and act on |
| [**putPreferences**](MetaApi.md#putpreferences) | **PUT** /v1/self/preferences | Change the person\&#39;s own choices |
| [**putWorkspaceSettings**](MetaApi.md#putworkspacesettings) | **PUT** /v1/settings | Change the workspace\&#39;s settings |



## confirmSignIn

> confirmSignIn(confirmSignIn)

Confirm it is you, with your password again

A person signed in to a UI with a password, typing it again: their sign-in is made anew, and is recent from now — which adding, approving, changing or revoking a runner asks for (&#x60;recent_signin_required&#x60;). A UI asks for it there and then, over the page that was refused, and does what was refused again; nobody is signed out. A person signed in with Google or the OpenID provider confirms with it instead, &#x60;GET /v1/auth/google&#x60; or &#x60;GET /v1/auth/oidc&#x60; with &#x60;confirm&#x3D;true&#x60; (&#x60;400&#x60; here); a key, or anything not a person signed in to a UI, is refused (&#x60;403&#x60;), as is a password that is not theirs. 

### Example

```ts
import {
  Configuration,
  MetaApi,
} from '@runyard-ai/runyard-sdk';
import type { ConfirmSignInRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MetaApi(config);

  const body = {
    // ConfirmSignIn
    confirmSignIn: ...,
  } satisfies ConfirmSignInRequest;

  try {
    const data = await api.confirmSignIn(body);
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
| **confirmSignIn** | [ConfirmSignIn](ConfirmSignIn.md) |  | |

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
| **204** | Confirmed; the cookie is set anew. |  * Set-Cookie -  <br>  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getContract

> string getContract()

This document, as the server serves it

### Example

```ts
import {
  Configuration,
  MetaApi,
} from '@runyard-ai/runyard-sdk';
import type { GetContractRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const api = new MetaApi();

  try {
    const data = await api.getContract();
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

**string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/yaml`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The contract. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getInfo

> Info getInfo()

The workspace, and the server\&#39;s defaults and limits

### Example

```ts
import {
  Configuration,
  MetaApi,
} from '@runyard-ai/runyard-sdk';
import type { GetInfoRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MetaApi(config);

  try {
    const data = await api.getInfo();
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

[**Info**](Info.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The workspace, defaults and limits. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPreferences

> Preferences getPreferences()

The person\&#39;s own choices

What the caller\&#39;s person chose for themselves, as opposed to what the workspace\&#39;s admins chose for everybody (&#x60;/v1/settings&#x60;): a key\&#39;s are its person\&#39;s. A person who never chose has the defaults. Needs &#x60;sessions.read&#x60;, and &#x60;sessions.write&#x60; to change them: they are of the person\&#39;s sessions. A session calling through its brokers has none: &#x60;403&#x60;. 

### Example

```ts
import {
  Configuration,
  MetaApi,
} from '@runyard-ai/runyard-sdk';
import type { GetPreferencesRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MetaApi(config);

  try {
    const data = await api.getPreferences();
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

[**Preferences**](Preferences.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The preferences. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSelf

> Caller getSelf()

The key, person, session or platform calling

Who the caller is: a person signed in, a key, a session\&#39;s harness calling through its brokers, or the Runyard platform with a platform token (&#x60;-platform-issuer&#x60;) — with its role in the workspace and the scopes it holds. The platform has no role and no address: it answers &#x60;{kind: platform, name: \&quot;Runyard platform\&quot;, scopes}&#x60;, which is how the platform finds out a workspace takes its tokens. 

### Example

```ts
import {
  Configuration,
  MetaApi,
} from '@runyard-ai/runyard-sdk';
import type { GetSelfRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MetaApi(config);

  try {
    const data = await api.getSelf();
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

[**Caller**](Caller.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The caller. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSelfDirectory

> SelfDirectory getSelfDirectory()

The orgs and workspaces the caller\&#39;s person may reach

What the platform (&#x60;-home-url&#x60;) last said the caller\&#39;s person may reach — their orgs and the workspaces they may open — for the UIs\&#39; top bar. The server asks the platform (&#x60;GET &lt;issuer&gt;/api/me&#x60;, with the person\&#39;s access token) server to server right after each sign-in with the OpenID provider and each refresh of it, only when the provider is the platform: the &#x60;-oidc-issuer&#x60;\&#39;s origin is the &#x60;-home-url&#x60;\&#39;s. A failure keeps what was last said. A person never asked about has empty lists and no &#x60;fetchedAt&#x60;. &#x60;404&#x60; when the server has no &#x60;-home-url&#x60;. 

### Example

```ts
import {
  Configuration,
  MetaApi,
} from '@runyard-ai/runyard-sdk';
import type { GetSelfDirectoryRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MetaApi(config);

  try {
    const data = await api.getSelfDirectory();
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

[**SelfDirectory**](SelfDirectory.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The directory. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSelfPicture

> Blob getSelfPicture(ifNoneMatch)

The person\&#39;s profile picture

Google\&#39;s picture of the person signed in, fetched from Google once and kept by the server, and by the browser for a day: the page never loads it from Google. A &#x60;304&#x60; answers an &#x60;If-None-Match&#x60; it still matches. 

### Example

```ts
import {
  Configuration,
  MetaApi,
} from '@runyard-ai/runyard-sdk';
import type { GetSelfPictureRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MetaApi(config);

  const body = {
    // string (optional)
    ifNoneMatch: ifNoneMatch_example,
  } satisfies GetSelfPictureRequest;

  try {
    const data = await api.getSelfPicture(body);
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
| **ifNoneMatch** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

**Blob**

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `image/*`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The picture. |  * ETag -  <br>  * Cache-Control -  <br>  |
| **304** | The picture the browser has is still it. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **404** | Nothing by that id. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getWorkspaceSettings

> WorkspaceSettings getWorkspaceSettings()

The workspace\&#39;s settings

What the workspace\&#39;s admins chose for it, as opposed to how the server was started (&#x60;GET /v1/info&#x60;). Anybody with &#x60;sessions.read&#x60; may read them: a chat says from them when a session will be archived and deleted. 

### Example

```ts
import {
  Configuration,
  MetaApi,
} from '@runyard-ai/runyard-sdk';
import type { GetWorkspaceSettingsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MetaApi(config);

  try {
    const data = await api.getWorkspaceSettings();
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

[**WorkspaceSettings**](WorkspaceSettings.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The settings. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## health

> string health()

Whether the server is up

### Example

```ts
import {
  Configuration,
  MetaApi,
} from '@runyard-ai/runyard-sdk';
import type { HealthRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const api = new MetaApi();

  try {
    const data = await api.health();
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

**string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/plain`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | It is. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listNotices

> NoticeList listNotices()

What the caller should know and act on

The warnings and errors that stand for the caller\&#39;s person now — a profile they may start that uses what they may not, a provider of theirs to sign in again — each gone once it is resolved. 

### Example

```ts
import {
  Configuration,
  MetaApi,
} from '@runyard-ai/runyard-sdk';
import type { ListNoticesRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MetaApi(config);

  try {
    const data = await api.listNotices();
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

[**NoticeList**](NoticeList.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The notices, the errors first. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putPreferences

> Preferences putPreferences(preferences)

Change the person\&#39;s own choices

Replaces them all, as &#x60;PUT /v1/settings&#x60; does the workspace\&#39;s.

### Example

```ts
import {
  Configuration,
  MetaApi,
} from '@runyard-ai/runyard-sdk';
import type { PutPreferencesRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MetaApi(config);

  const body = {
    // Preferences
    preferences: ...,
  } satisfies PutPreferencesRequest;

  try {
    const data = await api.putPreferences(body);
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
| **preferences** | [Preferences](Preferences.md) |  | |

### Return type

[**Preferences**](Preferences.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The preferences, changed. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putWorkspaceSettings

> WorkspaceSettings putWorkspaceSettings(workspaceSettings)

Change the workspace\&#39;s settings

Replaces them all: a field left out is unset. Needs &#x60;settings.write&#x60;, which only an admin holds. A change applies at once to every session, counted from when each was last idle: one already past a new limit is archived or deleted straight away. 

### Example

```ts
import {
  Configuration,
  MetaApi,
} from '@runyard-ai/runyard-sdk';
import type { PutWorkspaceSettingsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new MetaApi(config);

  const body = {
    // WorkspaceSettings
    workspaceSettings: ...,
  } satisfies PutWorkspaceSettingsRequest;

  try {
    const data = await api.putWorkspaceSettings(body);
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
| **workspaceSettings** | [WorkspaceSettings](WorkspaceSettings.md) |  | |

### Return type

[**WorkspaceSettings**](WorkspaceSettings.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The settings, changed. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

