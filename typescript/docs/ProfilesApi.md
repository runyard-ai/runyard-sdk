# ProfilesApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteProfile**](ProfilesApi.md#deleteprofile) | **DELETE** /v1/profiles/{profileId} | Delete a profile |
| [**getProfile**](ProfilesApi.md#getprofile) | **GET** /v1/profiles/{profileId} | A profile, at its latest version |
| [**getProfileVersion**](ProfilesApi.md#getprofileversion) | **GET** /v1/profiles/{profileId}/versions/{version} | A profile as it was at one version |
| [**listProfileVersions**](ProfilesApi.md#listprofileversions) | **GET** /v1/profiles/{profileId}/versions | Every version of a profile, newest first |
| [**listProfiles**](ProfilesApi.md#listprofiles) | **GET** /v1/profiles | Every profile of the account |
| [**putProfile**](ProfilesApi.md#putprofile) | **PUT** /v1/profiles/{profileId} | Create a profile, or make a new version of it |
| [**putProfileRecipe**](ProfilesApi.md#putprofilerecipe) | **PUT** /v1/profiles/{profileId}/recipe | Change the recipe its sessions\&#39; sandboxes boot |
| [**putProfileUsers**](ProfilesApi.md#putprofileusers) | **PUT** /v1/profiles/{profileId}/users | Say who besides its owner may use a profile: who may start sessions from it |
| [**restoreProfileVersion**](ProfilesApi.md#restoreprofileversion) | **POST** /v1/profiles/{profileId}/versions/{version}/restore | Go back to a version |



## deleteProfile

> deleteProfile(profileId)

Delete a profile

Sessions started from it go on as they were; triggers that start it are refused while they exist (&#x60;409 in_use&#x60;). 

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '@runyard-ai/runyard-sdk';
import type { DeleteProfileRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ProfilesApi(config);

  const body = {
    // string
    profileId: profileId_example,
  } satisfies DeleteProfileRequest;

  try {
    const data = await api.deleteProfile(body);
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
| **profileId** | `string` |  | [Defaults to `undefined`] |

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


## getProfile

> Profile getProfile(profileId)

A profile, at its latest version

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '@runyard-ai/runyard-sdk';
import type { GetProfileRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ProfilesApi(config);

  const body = {
    // string
    profileId: profileId_example,
  } satisfies GetProfileRequest;

  try {
    const data = await api.getProfile(body);
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
| **profileId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Profile**](Profile.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The profile. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getProfileVersion

> Profile getProfileVersion(profileId, version)

A profile as it was at one version

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '@runyard-ai/runyard-sdk';
import type { GetProfileVersionRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ProfilesApi(config);

  const body = {
    // string
    profileId: profileId_example,
    // number
    version: 56,
  } satisfies GetProfileVersionRequest;

  try {
    const data = await api.getProfileVersion(body);
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
| **profileId** | `string` |  | [Defaults to `undefined`] |
| **version** | `number` |  | [Defaults to `undefined`] |

### Return type

[**Profile**](Profile.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | That version. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listProfileVersions

> ProfileVersionList listProfileVersions(profileId)

Every version of a profile, newest first

What to test — a session is started from any of them with &#x60;profileVersion&#x60; — and what to go back to, with &#x60;POST …/versions/{version}/restore&#x60;. 

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '@runyard-ai/runyard-sdk';
import type { ListProfileVersionsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ProfilesApi(config);

  const body = {
    // string
    profileId: profileId_example,
  } satisfies ListProfileVersionsRequest;

  try {
    const data = await api.listProfileVersions(body);
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
| **profileId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ProfileVersionList**](ProfileVersionList.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Its versions. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listProfiles

> ProfilePage listProfiles(limit, cursor)

Every profile of the account

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '@runyard-ai/runyard-sdk';
import type { ListProfilesRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ProfilesApi(config);

  const body = {
    // number | At most this many; the default and ceiling are in `GET /v1/info`. (optional)
    limit: 56,
    // string | From a previous page\'s `nextCursor`. Opaque; one made up is `400`. (optional)
    cursor: cursor_example,
  } satisfies ListProfilesRequest;

  try {
    const data = await api.listProfiles(body);
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

[**ProfilePage**](ProfilePage.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The profiles, each at its latest version. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putProfile

> Profile putProfile(profileId, profileSpec)

Create a profile, or make a new version of it

A profile is what a session is started from: a harness, provider and model, a system prompt, brokers, MCP connectors and sandbox resources. Each change is a new &#x60;version&#x60;; a session records the version it was started from, and is never changed by a later one. The same spec again makes no version. 

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '@runyard-ai/runyard-sdk';
import type { PutProfileRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ProfilesApi(config);

  const body = {
    // string
    profileId: profileId_example,
    // ProfileSpec
    profileSpec: ...,
  } satisfies PutProfileRequest;

  try {
    const data = await api.putProfile(body);
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
| **profileId** | `string` |  | [Defaults to `undefined`] |
| **profileSpec** | [ProfileSpec](ProfileSpec.md) |  | |

### Return type

[**Profile**](Profile.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The profile, unchanged or at a new version. |  -  |
| **201** | The profile, created. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **422** | A recipe this server or the sandboxes daemon will not build (&#x60;recipe_invalid&#x60;): its message names the line.  |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putProfileRecipe

> Profile putProfileRecipe(profileId, profileRecipe)

Change the recipe its sessions\&#39; sandboxes boot

A new version of the profile with &#x60;sandbox.recipe&#x60; this, and the rest as it was; the image is built at once. Its owner\&#39;s — and, for the profile a session was started from, that session\&#39;s, as its person: so a session improves the environment sessions like it start in. Test the version by starting a session from it, and restore the one before if it is worse. The same recipe again makes no version. 

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '@runyard-ai/runyard-sdk';
import type { PutProfileRecipeRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ProfilesApi(config);

  const body = {
    // string
    profileId: profileId_example,
    // ProfileRecipe
    profileRecipe: ...,
  } satisfies PutProfileRecipeRequest;

  try {
    const data = await api.putProfileRecipe(body);
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
| **profileId** | `string` |  | [Defaults to `undefined`] |
| **profileRecipe** | [ProfileRecipe](ProfileRecipe.md) |  | |

### Return type

[**Profile**](Profile.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The profile at its latest version. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **422** | A recipe this server or the sandboxes daemon will not build (&#x60;recipe_invalid&#x60;): its message names the line.  |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putProfileUsers

> Users putProfileUsers(profileId, users)

Say who besides its owner may use a profile: who may start sessions from it

Its owner\&#39;s, or an admin\&#39;s, to say; it replaces whom it was for. 

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '@runyard-ai/runyard-sdk';
import type { PutProfileUsersRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ProfilesApi(config);

  const body = {
    // string
    profileId: profileId_example,
    // Users
    users: ...,
  } satisfies PutProfileUsersRequest;

  try {
    const data = await api.putProfileUsers(body);
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
| **profileId** | `string` |  | [Defaults to `undefined`] |
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


## restoreProfileVersion

> Profile restoreProfileVersion(profileId, version)

Go back to a version

A new version, the same as that one, becomes its latest: what came after it is kept, to go forward to again. Its owner\&#39;s — and, for a profile a session was started from, that session\&#39;s, as its person. 

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '@runyard-ai/runyard-sdk';
import type { RestoreProfileVersionRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ProfilesApi(config);

  const body = {
    // string
    profileId: profileId_example,
    // number
    version: 56,
  } satisfies RestoreProfileVersionRequest;

  try {
    const data = await api.restoreProfileVersion(body);
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
| **profileId** | `string` |  | [Defaults to `undefined`] |
| **version** | `number` |  | [Defaults to `undefined`] |

### Return type

[**Profile**](Profile.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The profile at its new latest version. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

