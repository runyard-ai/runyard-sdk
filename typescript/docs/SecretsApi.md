# SecretsApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteSecret**](SecretsApi.md#deletesecret) | **DELETE** /v1/secrets/{secretName} | Forget one of the caller\&#39;s secrets |
| [**listSecrets**](SecretsApi.md#listsecrets) | **GET** /v1/secrets | The caller\&#39;s person\&#39;s secrets, by name |
| [**putSecret**](SecretsApi.md#putsecret) | **PUT** /v1/secrets/{secretName} | Set one of the caller\&#39;s secrets, or replace its value |



## deleteSecret

> deleteSecret(secretName)

Forget one of the caller\&#39;s secrets

A person\&#39;s alone. Deployments made with it keep the value they were made with; an approval still waiting that names it fails when it is approved. 

### Example

```ts
import {
  Configuration,
  SecretsApi,
} from '@runyard-ai/runyard-sdk';
import type { DeleteSecretRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SecretsApi(config);

  const body = {
    // string
    secretName: secretName_example,
  } satisfies DeleteSecretRequest;

  try {
    const data = await api.deleteSecret(body);
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
| **secretName** | `string` |  | [Defaults to `undefined`] |

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
| **204** | Forgotten. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listSecrets

> SecretList listSecrets()

The caller\&#39;s person\&#39;s secrets, by name

Names and when they were set, never a value: nothing reads a value back. A person\&#39;s own alone, an admin\&#39;s too, and a session sees its person\&#39;s, to name them in a deployment it asks for. 

### Example

```ts
import {
  Configuration,
  SecretsApi,
} from '@runyard-ai/runyard-sdk';
import type { ListSecretsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SecretsApi(config);

  try {
    const data = await api.listSecrets();
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

[**SecretList**](SecretList.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The secrets. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putSecret

> Secret putSecret(secretName, secretValue)

Set one of the caller\&#39;s secrets, or replace its value

A person\&#39;s alone to set: a session is refused (&#x60;403&#x60;), so a value is never in a session\&#39;s context. A deployment already made keeps the value it was made with; one made after has the new one. 

### Example

```ts
import {
  Configuration,
  SecretsApi,
} from '@runyard-ai/runyard-sdk';
import type { PutSecretRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new SecretsApi(config);

  const body = {
    // string
    secretName: secretName_example,
    // SecretValue
    secretValue: ...,
  } satisfies PutSecretRequest;

  try {
    const data = await api.putSecret(body);
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
| **secretName** | `string` |  | [Defaults to `undefined`] |
| **secretValue** | [SecretValue](SecretValue.md) |  | |

### Return type

[**Secret**](Secret.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Replaced. |  -  |
| **201** | Set. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

