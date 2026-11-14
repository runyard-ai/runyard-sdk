# KeysApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**authorizeKey**](KeysApi.md#authorizekey) | **POST** /v1/keys/authorizations | Approve a key for a program that asked for one |
| [**changeKey**](KeysApi.md#changekey) | **PATCH** /v1/keys/{keyId} | Change what a key may do |
| [**createKey**](KeysApi.md#createkey) | **POST** /v1/keys | Mint a key |
| [**getKey**](KeysApi.md#getkey) | **GET** /v1/keys/{keyId} | A key |
| [**listKeys**](KeysApi.md#listkeys) | **GET** /v1/keys | The keys of the workspace |
| [**redeemKeyAuthorization**](KeysApi.md#redeemkeyauthorization) | **POST** /v1/keys/authorizations/redeem | Trade an approval\&#39;s code for its key |
| [**revokeKey**](KeysApi.md#revokekey) | **DELETE** /v1/keys/{keyId} | Revoke a key, at once |



## authorizeKey

> KeyAuthorization authorizeKey(keyAuthorizationRequest)

Approve a key for a program that asked for one

**A program on a person\&#39;s machine asks that person for its key**, rather than being pasted one: OAuth\&#39;s authorization code with PKCE and a loopback redirect (RFC 7636, RFC 8252).  1. The program makes a random &#x60;code_verifier&#x60;, listens on a port of    its own loopback, and opens the person\&#39;s browser at the console\&#39;s    &#x60;/console/authorize&#x60;, saying what it wants. 2. The person, signed in, approves or denies. Approving is this    call, made by the page as them: nothing is minted, and a code    comes back. 3. The page sends the browser to the program\&#39;s &#x60;redirect_uri&#x60; with    &#x60;code&#x60; and &#x60;state&#x60; — or &#x60;error&#x3D;access_denied&#x60; and &#x60;state&#x60; — or,    with no &#x60;redirect_uri&#x60;, shows the code for the person to paste. 4. The program trades the code and its verifier for the key at    &#x60;POST /v1/keys/authorizations/redeem&#x60;.  The page reads what is asked from its query, and the server reads none of it:  | parameter | what it says | |---|---| | &#x60;client&#x60; | What is asking, in its own words: &#x60;ryclaude on ada-laptop&#x60;. Required; the key is named it, its ends trimmed and each run of spaces made one. | | &#x60;scopes&#x60; | The scopes asked for (&#x60;Scope&#x60;), separated by commas. Required. | | &#x60;code_challenge&#x60; | &#x60;codeChallenge&#x60;. Required. | | &#x60;redirect_uri&#x60; | Where the program listens for the code, as &#x60;redirectUri&#x60; takes it. | | &#x60;state&#x60; | Handed back to &#x60;redirect_uri&#x60; as it was given. |  Signed out, the page signs the person in and comes back to the same address. A &#x60;redirect_uri&#x60; that is not loopback, a &#x60;code_challenge&#x60; that is not one, or a scope this contract does not define, and it offers nothing to approve and sends the browser nowhere.  Needs &#x60;keys.admin&#x60;, and approves exactly what &#x60;POST /v1/keys&#x60; would mint for the same caller: scopes it holds, an expiry within ten years. **The key is the caller\&#39;s own**: there is no &#x60;owner&#x60;. From a browser, only the server\&#39;s own pages may call it.  **The code is not the key.** It passes through a browser\&#39;s address bar, so it is bound to &#x60;codeChallenge&#x60;, the SHA-256 of a verifier only the program holds. It lasts five minutes, and only its SHA-256 is kept, in this server\&#39;s memory: a restart forgets every approval waiting. An approval made with a key goes with that key: revoked or expired, what it approved can no longer be redeemed. 

### Example

```ts
import {
  Configuration,
  KeysApi,
} from '@runyard-ai/runyard-sdk';
import type { AuthorizeKeyRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new KeysApi(config);

  const body = {
    // KeyAuthorizationRequest
    keyAuthorizationRequest: ...,
  } satisfies AuthorizeKeyRequest;

  try {
    const data = await api.authorizeKey(body);
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
| **keyAuthorizationRequest** | [KeyAuthorizationRequest](KeyAuthorizationRequest.md) |  | |

### Return type

[**KeyAuthorization**](KeyAuthorization.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Approved. The code is in this answer and nowhere else. |  * Cache-Control - &#x60;no-store&#x60;: the code is a secret for as long as it lasts. <br>  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The caller lacks &#x60;keys.admin&#x60; or a scope it asked for, or is a browser on another site\&#39;s page. |  -  |
| **503** | The caller has sixteen approvals waiting to be redeemed (&#x60;capacity_exceeded&#x60;). Each lasts five minutes. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## changeKey

> Key changeKey(keyId, keyChange)

Change what a key may do

With &#x60;keys.admin&#x60;: the caller\&#39;s own keys, or anybody\&#39;s for an admin. The scopes sent replace the key\&#39;s, at once: the next call made with it holds what it holds now. Its secret, name and expiry stay as they were.  **A key is never made wider than whoever changes it**, as when it is minted: a scope the caller does not hold is refused. Nor is it given one its owner does not hold, which it could not use today and would the day they were made an admin. 

### Example

```ts
import {
  Configuration,
  KeysApi,
} from '@runyard-ai/runyard-sdk';
import type { ChangeKeyRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new KeysApi(config);

  const body = {
    // string
    keyId: keyId_example,
    // KeyChange
    keyChange: ...,
  } satisfies ChangeKeyRequest;

  try {
    const data = await api.changeKey(body);
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
| **keyId** | `string` |  | [Defaults to `undefined`] |
| **keyChange** | [KeyChange](KeyChange.md) |  | |

### Return type

[**Key**](Key.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The key, as it is now. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createKey

> MintedKey createKey(newKey)

Mint a key

The secret is in this answer and nowhere else, ever: the server keeps its hash. A key may not be given a scope its creator does not hold, and is its creator\&#39;s: it does no more than they may, goes with them when they are removed, and a member revokes only their own. 

### Example

```ts
import {
  Configuration,
  KeysApi,
} from '@runyard-ai/runyard-sdk';
import type { CreateKeyRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new KeysApi(config);

  const body = {
    // NewKey
    newKey: ...,
  } satisfies CreateKeyRequest;

  try {
    const data = await api.createKey(body);
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
| **newKey** | [NewKey](NewKey.md) |  | |

### Return type

[**MintedKey**](MintedKey.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The key, with its secret this once. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getKey

> Key getKey(keyId)

A key

### Example

```ts
import {
  Configuration,
  KeysApi,
} from '@runyard-ai/runyard-sdk';
import type { GetKeyRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new KeysApi(config);

  const body = {
    // string
    keyId: keyId_example,
  } satisfies GetKeyRequest;

  try {
    const data = await api.getKey(body);
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
| **keyId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Key**](Key.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The key. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listKeys

> KeyPage listKeys(limit, cursor)

The keys of the workspace

Every key, for an admin; a member\&#39;s own, for a member.

### Example

```ts
import {
  Configuration,
  KeysApi,
} from '@runyard-ai/runyard-sdk';
import type { ListKeysRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new KeysApi(config);

  const body = {
    // number | At most this many; the default and ceiling are in `GET /v1/info`. (optional)
    limit: 56,
    // string | From a previous page\'s `nextCursor`. Opaque; one made up is `400`. (optional)
    cursor: cursor_example,
  } satisfies ListKeysRequest;

  try {
    const data = await api.listKeys(body);
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

[**KeyPage**](KeyPage.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The keys, never their secrets. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## redeemKeyAuthorization

> MintedKey redeemKeyAuthorization(keyAuthorizationRedemption)

Trade an approval\&#39;s code for its key

What the program that asked calls, with the code the person\&#39;s browser brought it and the verifier it made before asking. The key is minted now, as its approver\&#39;s, and this answer is the only place its secret ever is.  Without a key: this is how a program gets its first. The code and the verifier stand in for one, and neither is worth anything without the other.  **A code works once**, and is spent by being presented, with the right verifier or the wrong one.  **One answer for every code that yields no key**: one never given, already redeemed, older than five minutes, shown with the wrong verifier, whose approver is gone or no longer holds &#x60;keys.admin&#x60; or a scope approved, or whose approving key was revoked or has expired. Which it was is what somebody holding a stolen code would like to know. 

### Example

```ts
import {
  Configuration,
  KeysApi,
} from '@runyard-ai/runyard-sdk';
import type { RedeemKeyAuthorizationRequest } from '@runyard-ai/runyard-sdk';

async function example() {
  console.log("🚀 Testing @runyard-ai/runyard-sdk SDK...");
  const api = new KeysApi();

  const body = {
    // KeyAuthorizationRedemption
    keyAuthorizationRedemption: ...,
  } satisfies RedeemKeyAuthorizationRequest;

  try {
    const data = await api.redeemKeyAuthorization(body);
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
| **keyAuthorizationRedemption** | [KeyAuthorizationRedemption](KeyAuthorizationRedemption.md) |  | |

### Return type

[**MintedKey**](MintedKey.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Minted; the code is spent. |  * Cache-Control - &#x60;no-store&#x60;: the body is a credential. <br>  |
| **400** | No key: the code and verifier redeem none, for any of the reasons above and without saying which; or the body is not one this contract describes. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## revokeKey

> revokeKey(keyId)

Revoke a key, at once

With &#x60;keys.admin&#x60;: the caller\&#39;s own keys, or anybody\&#39;s for an admin.  **Any key may revoke itself**, whatever its scopes: called with a key naming its own id, this needs nothing else. So a program given a key hands it back when it is done. 

### Example

```ts
import {
  Configuration,
  KeysApi,
} from '@runyard-ai/runyard-sdk';
import type { RevokeKeyRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new KeysApi(config);

  const body = {
    // string
    keyId: keyId_example,
  } satisfies RevokeKeyRequest;

  try {
    const data = await api.revokeKey(body);
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
| **keyId** | `string` |  | [Defaults to `undefined`] |

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
| **204** | It no longer works. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

