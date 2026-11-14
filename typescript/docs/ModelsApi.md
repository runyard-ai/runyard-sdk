# ModelsApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteProvider**](ModelsApi.md#deleteprovider) | **DELETE** /v1/providers/{provider} | Remove a provider, and forget its credential |
| [**finishProviderSignIn**](ModelsApi.md#finishprovidersignin) | **POST** /v1/providers/{provider}/signin/{flowId} | Finish signing a subscription in |
| [**listHarnesses**](ModelsApi.md#listharnesses) | **GET** /v1/harnesses | The harnesses a session may run, and their models |
| [**listProviders**](ModelsApi.md#listproviders) | **GET** /v1/providers | The providers, and whether each has a working credential |
| [**putProvider**](ModelsApi.md#putprovider) | **PUT** /v1/providers/{provider} | Make a provider of an API key, or replace one with it |
| [**refreshProviderModels**](ModelsApi.md#refreshprovidermodels) | **POST** /v1/providers/{provider}/models | Read a provider\&#39;s models again, now |
| [**startProviderSignIn**](ModelsApi.md#startprovidersignin) | **POST** /v1/providers/{provider}/signin | Start making a provider of a subscription, or replacing one with it |
| [**updateProvider**](ModelsApi.md#updateprovider) | **PATCH** /v1/providers/{provider} | Retitle a provider, say who may use it, or make it the default |



## deleteProvider

> deleteProvider(provider)

Remove a provider, and forget its credential

Sessions on it move to the default at their next turn. Removing the default makes another one the default, when there is another. An admin removes any; a member, those they made. 

### Example

```ts
import {
  Configuration,
  ModelsApi,
} from '@runyard-ai/runyard-sdk';
import type { DeleteProviderRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ModelsApi(config);

  const body = {
    // string
    provider: anthropic,
  } satisfies DeleteProviderRequest;

  try {
    const data = await api.deleteProvider(body);
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
| **provider** | `string` |  | [Defaults to `undefined`] |

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


## finishProviderSignIn

> Provider finishProviderSignIn(provider, flowId, providerSignInFinish)

Finish signing a subscription in

By the flow\&#39;s &#x60;method&#x60;: &#x60;code&#x60; takes the &#x60;code&#x60; the person was shown, &#x60;redirect&#x60; the &#x60;redirectUrl&#x60; their browser was sent to, and &#x60;device&#x60; takes nothing and **waits** — until the person has entered the code and the provider is made (&#x60;200&#x60;), or the flow expires (&#x60;404&#x60;). A &#x60;device&#x60; finish cut short — a proxy\&#39;s timeout, a page reloaded — is called again: the flow goes on until it expires, and once the provider is made, finishing it again answers the provider. A field the flow\&#39;s method does not take is &#x60;400&#x60;. 

### Example

```ts
import {
  Configuration,
  ModelsApi,
} from '@runyard-ai/runyard-sdk';
import type { FinishProviderSignInRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ModelsApi(config);

  const body = {
    // string
    provider: anthropic,
    // string
    flowId: flowId_example,
    // ProviderSignInFinish (optional)
    providerSignInFinish: ...,
  } satisfies FinishProviderSignInRequest;

  try {
    const data = await api.finishProviderSignIn(body);
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
| **provider** | `string` |  | [Defaults to `undefined`] |
| **flowId** | `string` |  | [Defaults to `undefined`] |
| **providerSignInFinish** | [ProviderSignInFinish](ProviderSignInFinish.md) |  | [Optional] |

### Return type

[**Provider**](Provider.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Signed in. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listHarnesses

> ListHarnesses200Response listHarnesses()

The harnesses a session may run, and their models

&#x60;claude-code&#x60; (Claude Code, on &#x60;anthropic&#x60; providers), &#x60;codex&#x60; (OpenAI\&#39;s Codex, on &#x60;openai&#x60; providers) and &#x60;opencode&#x60; (opencode, on &#x60;openai_compatible&#x60; providers). A harness\&#39;s models are not a list this server keeps: they are what its providers\&#39; APIs answered when last asked, so a harness with no provider of a type it runs on has none. 

### Example

```ts
import {
  Configuration,
  ModelsApi,
} from '@runyard-ai/runyard-sdk';
import type { ListHarnessesRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ModelsApi(config);

  try {
    const data = await api.listHarnesses();
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

[**ListHarnesses200Response**](ListHarnesses200Response.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The harnesses. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listProviders

> ListProviders200Response listProviders()

The providers, and whether each has a working credential

A provider is a named credential for a model provider\&#39;s API — an API key, or a subscription signed in — so there may be several of one type: two subscriptions and a key, say. Exactly one is the default, which a session runs on unless it names another; the first one made is. A session whose harness does not run on the default\&#39;s type runs on the first provider, by name, of a type it does run on.  A provider is for the people it names (&#x60;users&#x60;), or for &#x60;everyone&#x60;: at first, for whoever made it alone. A session runs only on a provider its person may use — the default when they may, else the first by name they may — and a member is shown only those, an admin every one.  Each provider\&#39;s models are asked of its API, with its own credential, when it is made or signed in, every hour after, and on &#x60;POST …/models&#x60;. 

### Example

```ts
import {
  Configuration,
  ModelsApi,
} from '@runyard-ai/runyard-sdk';
import type { ListProvidersRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ModelsApi(config);

  try {
    const data = await api.listProviders();
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

[**ListProviders200Response**](ListProviders200Response.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The providers, by name. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putProvider

> Provider putProvider(provider, providerApiKey)

Make a provider of an API key, or replace one with it

Kept encrypted here, and never sent to a sandbox: the session reaches the provider through the &#x60;llm&#x60; broker, which puts it on. The server tries it before answering, says what the provider said, and reads the provider\&#39;s models with it. A provider of that name, a key or a subscription, is replaced — by an admin or whoever made it; another person\&#39;s is &#x60;409&#x60;. A provider made is for its maker alone.  An &#x60;openai_compatible&#x60; provider is a server of OpenAI\&#39;s chat completions — llama.cpp\&#39;s llama-server, vLLM — at &#x60;baseUrl&#x60;, which this server reaches: its key is optional, since such a server often takes none. 

### Example

```ts
import {
  Configuration,
  ModelsApi,
} from '@runyard-ai/runyard-sdk';
import type { PutProviderRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ModelsApi(config);

  const body = {
    // string
    provider: anthropic,
    // ProviderApiKey
    providerApiKey: ...,
  } satisfies PutProviderRequest;

  try {
    const data = await api.putProvider(body);
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
| **provider** | `string` |  | [Defaults to `undefined`] |
| **providerApiKey** | [ProviderApiKey](ProviderApiKey.md) |  | |

### Return type

[**Provider**](Provider.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Replaced, and tried. |  -  |
| **201** | Made, and tried. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## refreshProviderModels

> Provider refreshProviderModels(provider)

Read a provider\&#39;s models again, now

Asks the provider\&#39;s API for its models with the provider\&#39;s credential, as the server does every hour. A failure keeps the list read last and says why in &#x60;modelsError&#x60;: the answer is the provider either way, &#x60;modelsReadAt&#x60; saying when its list was read. 

### Example

```ts
import {
  Configuration,
  ModelsApi,
} from '@runyard-ai/runyard-sdk';
import type { RefreshProviderModelsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ModelsApi(config);

  const body = {
    // string
    provider: anthropic,
  } satisfies RefreshProviderModelsRequest;

  try {
    const data = await api.refreshProviderModels(body);
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
| **provider** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Provider**](Provider.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The provider, its models read again or why they could not be. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## startProviderSignIn

> SignInFlow startProviderSignIn(provider, providerSignIn)

Start making a provider of a subscription, or replacing one with it

A subscription signs in with OAuth, as its harness does, by one of the &#x60;method&#x60;s its type offers; &#x60;POST …/signin/{flowId}&#x60; finishes, and makes the provider of that name, or replaces it.  - &#x60;code&#x60; (&#x60;anthropic&#x60;, as Claude Code does): the person opens   &#x60;authorizationUrl&#x60;, signs in, and is shown a code; finishing with   that &#x60;code&#x60; makes the provider. - &#x60;device&#x60; (&#x60;openai&#x60;, a ChatGPT plan, as &#x60;codex login   --device-auth&#x60; does): the person opens &#x60;verificationUri&#x60; on any   machine and enters &#x60;userCode&#x60;. The server asks the provider   whether they have from the start, and makes the provider as soon   as they have, whether or not anybody is finishing. - &#x60;redirect&#x60; (&#x60;openai&#x60;, as &#x60;codex login&#x60; does): the person opens   &#x60;authorizationUrl&#x60; and signs in; their browser is then sent to an   address on &#x60;localhost&#x60; that nothing there answers. Finishing with   that address, pasted from the browser\&#39;s address bar   (&#x60;redirectUrl&#x60;), makes the provider.  The server keeps the refresh token, renews the access token before it expires, and reads the provider\&#39;s models once signed in. An &#x60;openai_compatible&#x60; provider has no subscription: &#x60;400&#x60;. 

### Example

```ts
import {
  Configuration,
  ModelsApi,
} from '@runyard-ai/runyard-sdk';
import type { StartProviderSignInRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ModelsApi(config);

  const body = {
    // string
    provider: anthropic,
    // ProviderSignIn
    providerSignIn: ...,
  } satisfies StartProviderSignInRequest;

  try {
    const data = await api.startProviderSignIn(body);
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
| **provider** | `string` |  | [Defaults to `undefined`] |
| **providerSignIn** | [ProviderSignIn](ProviderSignIn.md) |  | |

### Return type

[**SignInFlow**](SignInFlow.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Where to send the person, and what to show them. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateProvider

> Provider updateProvider(provider, providerUpdate)

Retitle a provider, say who may use it, or make it the default

Absent fields are left as they are. &#x60;isDefault: true&#x60; makes it the default and the one that was stops being; &#x60;false&#x60; is &#x60;400&#x60;, since exactly one is: make another the default instead. Whoever made it retitles it and says who may use it; only an admin makes it the default. 

### Example

```ts
import {
  Configuration,
  ModelsApi,
} from '@runyard-ai/runyard-sdk';
import type { UpdateProviderRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ModelsApi(config);

  const body = {
    // string
    provider: anthropic,
    // ProviderUpdate
    providerUpdate: ...,
  } satisfies UpdateProviderRequest;

  try {
    const data = await api.updateProvider(body);
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
| **provider** | `string` |  | [Defaults to `undefined`] |
| **providerUpdate** | [ProviderUpdate](ProviderUpdate.md) |  | |

### Return type

[**Provider**](Provider.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The provider, changed. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

