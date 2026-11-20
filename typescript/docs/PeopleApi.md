# PeopleApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addUser**](PeopleApi.md#adduser) | **PUT** /v1/users/{userEmail} | Put a person in the workspace |
| [**createInvitation**](PeopleApi.md#createinvitation) | **POST** /v1/invitations | Invite somebody |
| [**deleteUser**](PeopleApi.md#deleteuser) | **DELETE** /v1/users/{userEmail} | Remove a person from the workspace, and what is theirs in it, at once |
| [**listInvitations**](PeopleApi.md#listinvitations) | **GET** /v1/invitations | The invitations nobody has used yet |
| [**listUsers**](PeopleApi.md#listusers) | **GET** /v1/users | The people of the workspace |
| [**revokeInvitation**](PeopleApi.md#revokeinvitation) | **DELETE** /v1/invitations/{invitationId} | Revoke an invitation, at once |
| [**transfer**](PeopleApi.md#transfer) | **POST** /v1/transfers | Hand things to another owner |
| [**updateUser**](PeopleApi.md#updateuser) | **PATCH** /v1/users/{userEmail} | Make a person an admin of the workspace, or a member |



## addUser

> User addUser(userEmail, userUpdate)

Put a person in the workspace

In the role given, as an invitation would — for a person who signs in with a password, the one way in. They sign in with Google, the OpenID provider or the password file\&#39;s password for their address. A person already in the workspace is &#x60;409&#x60;: their role is changed with &#x60;PATCH&#x60;. With &#x60;claims&#x60; (&#x60;Identity&#x60;) the provider decides who is in: &#x60;409&#x60;. 

### Example

```ts
import {
  Configuration,
  PeopleApi,
} from '@runyard-ai/runyard-sdk';
import type { AddUserRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new PeopleApi(config);

  const body = {
    // string
    userEmail: userEmail_example,
    // UserUpdate
    userUpdate: ...,
  } satisfies AddUserRequest;

  try {
    const data = await api.addUser(body);
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
| **userEmail** | `string` |  | [Defaults to `undefined`] |
| **userUpdate** | [UserUpdate](UserUpdate.md) |  | |

### Return type

[**User**](User.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | In the workspace. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createInvitation

> MadeInvitation createInvitation(newInvitation)

Invite somebody

A link that signs one person in with Google, once, into the workspace as the &#x60;role&#x60; it says — for &#x60;email&#x60; alone, when it names one. It expires after &#x60;expiresInDays&#x60;. The link is in this answer and nowhere else, ever: the server keeps the hash of its code. A server without Google sign-in invites nobody: &#x60;409&#x60;; nor does one with &#x60;claims&#x60; (&#x60;Identity&#x60;), whose provider decides who is in. 

### Example

```ts
import {
  Configuration,
  PeopleApi,
} from '@runyard-ai/runyard-sdk';
import type { CreateInvitationRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new PeopleApi(config);

  const body = {
    // NewInvitation
    newInvitation: ...,
  } satisfies CreateInvitationRequest;

  try {
    const data = await api.createInvitation(body);
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
| **newInvitation** | [NewInvitation](NewInvitation.md) |  | |

### Return type

[**MadeInvitation**](MadeInvitation.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The invitation, with its link this once. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteUser

> deleteUser(userEmail, theirs)

Remove a person from the workspace, and what is theirs in it, at once

Their keys are revoked. Their subscriptions are deleted: each is their own account, and signing in again is theirs to do. Their sessions and the other providers they made are handed over to the admin removing them (&#x60;theirs: hand_over&#x60;), or deleted with them (&#x60;delete&#x60;). What others shared with them no longer is, and is not handed to the admin. Oneself, and the workspace\&#39;s owner, are not removed: &#x60;409&#x60;.  With &#x60;claims&#x60; (&#x60;Identity&#x60;) the provider decides who is in, and only a person it offboarded (&#x60;offboardedAt&#x60;) is taken here: what is theirs is handed over or deleted, and the person is kept, with their keys suspended, as the record of who they were — they come back if the provider lets them sign in again. Anybody else is &#x60;409&#x60;. 

### Example

```ts
import {
  Configuration,
  PeopleApi,
} from '@runyard-ai/runyard-sdk';
import type { DeleteUserRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new PeopleApi(config);

  const body = {
    // string
    userEmail: userEmail_example,
    // 'hand_over' | 'delete' (optional)
    theirs: theirs_example,
  } satisfies DeleteUserRequest;

  try {
    const data = await api.deleteUser(body);
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
| **userEmail** | `string` |  | [Defaults to `undefined`] |
| **theirs** | `hand_over`, `delete` |  | [Optional] [Defaults to `&#39;hand_over&#39;`] [Enum: hand_over, delete] |

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
| **204** | Gone, and what was theirs handed over or deleted. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listInvitations

> ListInvitations200Response listInvitations()

The invitations nobody has used yet

Never their codes, which only their making shows.

### Example

```ts
import {
  Configuration,
  PeopleApi,
} from '@runyard-ai/runyard-sdk';
import type { ListInvitationsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new PeopleApi(config);

  try {
    const data = await api.listInvitations();
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

[**ListInvitations200Response**](ListInvitations200Response.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The invitations, newest first. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listUsers

> ListUsers200Response listUsers()

The people of the workspace

Every person of the workspace, by address, in their role in it: whom a session, or a thing they own, may be shared with. It needs &#x60;sessions.write&#x60;, or &#x60;users.admin&#x60;; an application is never shown them (&#x60;403&#x60;), its end users being its own. 

### Example

```ts
import {
  Configuration,
  PeopleApi,
} from '@runyard-ai/runyard-sdk';
import type { ListUsersRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new PeopleApi(config);

  try {
    const data = await api.listUsers();
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

[**ListUsers200Response**](ListUsers200Response.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The people. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## revokeInvitation

> revokeInvitation(invitationId)

Revoke an invitation, at once

### Example

```ts
import {
  Configuration,
  PeopleApi,
} from '@runyard-ai/runyard-sdk';
import type { RevokeInvitationRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new PeopleApi(config);

  const body = {
    // string
    invitationId: invitationId_example,
  } satisfies RevokeInvitationRequest;

  try {
    const data = await api.revokeInvitation(body);
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
| **invitationId** | `string` |  | [Defaults to `undefined`] |

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
| **204** | Its link no longer signs anybody in. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## transfer

> Transfer transfer(transfer)

Hand things to another owner

An admin hands things to another owner, a person or an application, all of them or none (&#x60;404&#x60; for one that is not there, &#x60;400&#x60; for one that cannot be): sessions, each with every session of its tree; providers; profiles, brokers, MCP connectors and triggers; and connect links, whose keys become their application\&#39;s, holding what of their scopes an application may.  A session or a provider handed to an application may be given an end user; one handed to a person may not. A link is handed to its own application alone. A session awake is put to sleep, so that it wakes as its new owner\&#39;s. 

### Example

```ts
import {
  Configuration,
  PeopleApi,
} from '@runyard-ai/runyard-sdk';
import type { TransferRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new PeopleApi(config);

  const body = {
    // Transfer
    transfer: ...,
  } satisfies TransferRequest;

  try {
    const data = await api.transfer(body);
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
| **transfer** | [Transfer](Transfer.md) |  | |

### Return type

[**Transfer**](Transfer.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Handed over. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateUser

> User updateUser(userEmail, userUpdate)

Make a person an admin of the workspace, or a member

Takes effect at their next request, their keys\&#39; too. The workspace\&#39;s owner is always an admin: making them a member is &#x60;409&#x60;. With &#x60;claims&#x60; (&#x60;Identity&#x60;) roles are the provider\&#39;s: &#x60;409&#x60;. 

### Example

```ts
import {
  Configuration,
  PeopleApi,
} from '@runyard-ai/runyard-sdk';
import type { UpdateUserRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new PeopleApi(config);

  const body = {
    // string
    userEmail: userEmail_example,
    // UserUpdate
    userUpdate: ...,
  } satisfies UpdateUserRequest;

  try {
    const data = await api.updateUser(body);
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
| **userEmail** | `string` |  | [Defaults to `undefined`] |
| **userUpdate** | [UserUpdate](UserUpdate.md) |  | |

### Return type

[**User**](User.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The person, changed. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

