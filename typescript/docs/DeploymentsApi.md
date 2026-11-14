# DeploymentsApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**approveDeployment**](DeploymentsApi.md#approvedeployment) | **POST** /v1/deployment-approvals/{approvalId}/approve | Make the deployment a session asked for |
| [**createDeployment**](DeploymentsApi.md#createdeployment) | **POST** /v1/deployments | Boot a sealed sandbox from a built image |
| [**deleteDeployment**](DeploymentsApi.md#deletedeployment) | **DELETE** /v1/deployments/{deploymentId} | Delete a deployment, its sandbox, disk and tunnels |
| [**deleteDeploymentTunnel**](DeploymentsApi.md#deletedeploymenttunnel) | **DELETE** /v1/deployments/{deploymentId}/tunnels/{tunnelName} | Take a tunnel down |
| [**extendDeployment**](DeploymentsApi.md#extenddeployment) | **POST** /v1/deployments/{deploymentId}/extend | Move its expiry to ttlSeconds from now |
| [**getDeployment**](DeploymentsApi.md#getdeployment) | **GET** /v1/deployments/{deploymentId} | A deployment |
| [**getDeploymentApproval**](DeploymentsApi.md#getdeploymentapproval) | **GET** /v1/deployment-approvals/{approvalId} | A deployment asked for, and what was decided |
| [**listDeploymentApprovals**](DeploymentsApi.md#listdeploymentapprovals) | **GET** /v1/deployment-approvals | Deployments the caller\&#39;s sessions asked for, waiting or decided |
| [**listDeploymentTunnels**](DeploymentsApi.md#listdeploymenttunnels) | **GET** /v1/deployments/{deploymentId}/tunnels | Its tunnels |
| [**listDeployments**](DeploymentsApi.md#listdeployments) | **GET** /v1/deployments | The caller\&#39;s deployments |
| [**listOwnTunnels**](DeploymentsApi.md#listowntunnels) | **GET** /v1/tunnels | Every tunnel of the caller\&#39;s deployments and sessions |
| [**putDeploymentTunnel**](DeploymentsApi.md#putdeploymenttunnel) | **PUT** /v1/deployments/{deploymentId}/tunnels/{tunnelName} | Publish one of its ports at an address |
| [**readDeploymentLogs**](DeploymentsApi.md#readdeploymentlogs) | **GET** /v1/deployments/{deploymentId}/logs | What it printed, from a byte offset |
| [**refuseDeployment**](DeploymentsApi.md#refusedeployment) | **POST** /v1/deployment-approvals/{approvalId}/refuse | Refuse the deployment a session asked for |
| [**requestDeployment**](DeploymentsApi.md#requestdeployment) | **POST** /v1/deployment-approvals | Ask the caller\&#39;s person to make a deployment |
| [**runDeploymentCommand**](DeploymentsApi.md#rundeploymentcommand) | **POST** /v1/deployments/{deploymentId}/commands | Run a command in an unsealed deployment, and wait for it |
| [**sealDeployment**](DeploymentsApi.md#sealdeployment) | **POST** /v1/deployments/{deploymentId}/seal | Refuse commands and terminals in it from now on |
| [**startDeployment**](DeploymentsApi.md#startdeployment) | **POST** /v1/deployments/{deploymentId}/start | Boot a stopped or expired deployment again |
| [**stopDeployment**](DeploymentsApi.md#stopdeployment) | **POST** /v1/deployments/{deploymentId}/stop | Switch it off, its disk kept |
| [**unsealDeployment**](DeploymentsApi.md#unsealdeployment) | **POST** /v1/deployments/{deploymentId}/unseal | Let commands and a terminal into it |



## approveDeployment

> DeploymentApproval approveDeployment(approvalId)

Make the deployment a session asked for

Its person\&#39;s alone: a session is refused (&#x60;403&#x60;), and so is anybody else. The deployment is made now; one that cannot be — its image gone, a secret forgotten — is answered as &#x60;POST …/deployments&#x60; answers it, and the approval stays waiting. 

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { ApproveDeploymentRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // string
    approvalId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApproveDeploymentRequest;

  try {
    const data = await api.approveDeployment(body);
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
| **approvalId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**DeploymentApproval**](DeploymentApproval.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Approved; &#x60;deploymentId&#x60; is the deployment. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |
| **503** | No sandbox can be made now (&#x60;capacity_exceeded&#x60;) or the account is at its quota (&#x60;quota_exceeded&#x60;). The one status that says: try again.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createDeployment

> Deployment createDeployment(deploymentRequest)

Boot a sealed sandbox from a built image

The sandbox runs the image\&#39;s own &#x60;ENTRYPOINT&#x60;/&#x60;CMD&#x60; and nothing else: it is **sealed**, so the sandboxes daemon refuses every command, file write and terminal in it, to everyone, until it is unsealed — and the first after that makes it &#x60;tainted&#x60; for good. Its logs are read (&#x60;…/logs&#x60;) and its ports published (&#x60;…/tunnels&#x60;); it reaches nothing on the internet but the hosts it is made with (&#x60;allow&#x60;).  With &#x60;secrets&#x60;, a session is refused (&#x60;403&#x60;): it asks its person through &#x60;POST …/deployment-approvals&#x60;.  It is the caller\&#39;s person\&#39;s, and stays theirs when the session that made it is deleted. It is stopped once &#x60;expiresAt&#x60; passes — a day from now unless &#x60;ttlSeconds&#x60; says otherwise, a week at most — and &#x60;POST …/start&#x60; boots it again on the disk it had. 

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { CreateDeploymentRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // DeploymentRequest
    deploymentRequest: ...,
  } satisfies CreateDeploymentRequest;

  try {
    const data = await api.createDeployment(body);
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
| **deploymentRequest** | [DeploymentRequest](DeploymentRequest.md) |  | |

### Return type

[**Deployment**](Deployment.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Booting. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |
| **503** | No sandbox can be made now (&#x60;capacity_exceeded&#x60;) or the account is at its quota (&#x60;quota_exceeded&#x60;). The one status that says: try again.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteDeployment

> deleteDeployment(deploymentId)

Delete a deployment, its sandbox, disk and tunnels

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { DeleteDeploymentRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // string
    deploymentId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteDeploymentRequest;

  try {
    const data = await api.deleteDeployment(body);
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
| **deploymentId** | `string` |  | [Defaults to `undefined`] |

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
| **204** | Deleted. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteDeploymentTunnel

> deleteDeploymentTunnel(deploymentId, tunnelName)

Take a tunnel down

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { DeleteDeploymentTunnelRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // string
    deploymentId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // string
    tunnelName: tunnelName_example,
  } satisfies DeleteDeploymentTunnelRequest;

  try {
    const data = await api.deleteDeploymentTunnel(body);
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
| **deploymentId** | `string` |  | [Defaults to `undefined`] |
| **tunnelName** | `string` |  | [Defaults to `undefined`] |

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
| **204** | Deleted. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## extendDeployment

> Deployment extendDeployment(deploymentId, deploymentLease)

Move its expiry to ttlSeconds from now

A week from now at most. It does not boot one that is stopped.

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { ExtendDeploymentRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // string
    deploymentId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // DeploymentLease
    deploymentLease: ...,
  } satisfies ExtendDeploymentRequest;

  try {
    const data = await api.extendDeployment(body);
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
| **deploymentId** | `string` |  | [Defaults to `undefined`] |
| **deploymentLease** | [DeploymentLease](DeploymentLease.md) |  | |

### Return type

[**Deployment**](Deployment.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Its new expiry. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getDeployment

> Deployment getDeployment(deploymentId)

A deployment

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { GetDeploymentRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // string
    deploymentId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetDeploymentRequest;

  try {
    const data = await api.getDeployment(body);
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
| **deploymentId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Deployment**](Deployment.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The deployment. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getDeploymentApproval

> DeploymentApproval getDeploymentApproval(approvalId)

A deployment asked for, and what was decided

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { GetDeploymentApprovalRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // string
    approvalId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetDeploymentApprovalRequest;

  try {
    const data = await api.getDeploymentApproval(body);
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
| **approvalId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**DeploymentApproval**](DeploymentApproval.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The approval. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listDeploymentApprovals

> DeploymentApprovalList listDeploymentApprovals()

Deployments the caller\&#39;s sessions asked for, waiting or decided

A person\&#39;s, newest first: those still waiting, and those decided in the last week. A session sees those it asked for. 

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { ListDeploymentApprovalsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  try {
    const data = await api.listDeploymentApprovals();
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

[**DeploymentApprovalList**](DeploymentApprovalList.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The approvals. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listDeploymentTunnels

> TunnelList listDeploymentTunnels(deploymentId)

Its tunnels

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { ListDeploymentTunnelsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // string
    deploymentId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ListDeploymentTunnelsRequest;

  try {
    const data = await api.listDeploymentTunnels(body);
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
| **deploymentId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**TunnelList**](TunnelList.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Its tunnels. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listDeployments

> DeploymentList listDeployments()

The caller\&#39;s deployments

A person\&#39;s own, whichever of their sessions made them, and every one for an admin. Newest first. 

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { ListDeploymentsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  try {
    const data = await api.listDeployments();
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

[**DeploymentList**](DeploymentList.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The deployments. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listOwnTunnels

> TunnelList listOwnTunnels()

Every tunnel of the caller\&#39;s deployments and sessions

A person\&#39;s own — their deployments\&#39; and their sessions\&#39; sandboxes\&#39; — and every one for an admin. 

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { ListOwnTunnelsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  try {
    const data = await api.listOwnTunnels();
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

[**TunnelList**](TunnelList.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The tunnels. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putDeploymentTunnel

> Tunnel putDeploymentTunnel(deploymentId, tunnelName, tunnelSpec)

Publish one of its ports at an address

Reached by the people &#x60;access&#x60; names, signing in at the tunnel gateway — the deployment\&#39;s owner when it names nobody — and nobody else. 

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { PutDeploymentTunnelRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // string
    deploymentId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // string
    tunnelName: tunnelName_example,
    // TunnelSpec
    tunnelSpec: ...,
  } satisfies PutDeploymentTunnelRequest;

  try {
    const data = await api.putDeploymentTunnel(body);
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
| **deploymentId** | `string` |  | [Defaults to `undefined`] |
| **tunnelName** | `string` |  | [Defaults to `undefined`] |
| **tunnelSpec** | [TunnelSpec](TunnelSpec.md) |  | |

### Return type

[**Tunnel**](Tunnel.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The tunnel. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## readDeploymentLogs

> string readDeploymentLogs(deploymentId, stream, from, follow)

What it printed, from a byte offset

&#x60;stdout&#x60; and &#x60;stderr&#x60; are its entrypoint\&#39;s, since it last booted; &#x60;console&#x60; is what its kernel and init wrote while it booted — what there is when it never came up. &#x60;from&#x60; is a byte offset, so a reader that dropped resumes where it stopped; with &#x60;follow&#x60; the body stays open while there is more to come. 

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { ReadDeploymentLogsRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // string
    deploymentId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // 'stdout' | 'stderr' | 'console' (optional)
    stream: stream_example,
    // number | The first byte wanted. (optional)
    from: 789,
    // boolean | Keep the body open and write what happens next. (optional)
    follow: true,
  } satisfies ReadDeploymentLogsRequest;

  try {
    const data = await api.readDeploymentLogs(body);
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
| **deploymentId** | `string` |  | [Defaults to `undefined`] |
| **stream** | `stdout`, `stderr`, `console` |  | [Optional] [Defaults to `&#39;stdout&#39;`] [Enum: stdout, stderr, console] |
| **from** | `number` | The first byte wanted. | [Optional] [Defaults to `0`] |
| **follow** | `boolean` | Keep the body open and write what happens next. | [Optional] [Defaults to `false`] |

### Return type

**string**

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/plain`, `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The bytes. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## refuseDeployment

> DeploymentApproval refuseDeployment(approvalId)

Refuse the deployment a session asked for

Its person\&#39;s alone, as approving is.

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { RefuseDeploymentRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // string
    approvalId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies RefuseDeploymentRequest;

  try {
    const data = await api.refuseDeployment(body);
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
| **approvalId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**DeploymentApproval**](DeploymentApproval.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Refused. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## requestDeployment

> DeploymentApproval requestDeployment(deploymentRequest)

Ask the caller\&#39;s person to make a deployment

How a session gets a deployment that has its person\&#39;s &#x60;secrets&#x60;: the image it built could send them to any host it reaches, so its person decides, seeing the image, the hosts and the secrets together. They are told in their notices. Nothing is made until they approve, and it is then made as if they had asked, with this session as the one that made it.  What is asked is checked now as &#x60;POST …/deployments&#x60; checks it, the image and the secrets included; and again when it is approved. 

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { RequestDeploymentRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // DeploymentRequest
    deploymentRequest: ...,
  } satisfies RequestDeploymentRequest;

  try {
    const data = await api.requestDeployment(body);
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
| **deploymentRequest** | [DeploymentRequest](DeploymentRequest.md) |  | |

### Return type

[**DeploymentApproval**](DeploymentApproval.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Waiting for the person. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## runDeploymentCommand

> DeploymentCommandResult runDeploymentCommand(deploymentId, deploymentCommand)

Run a command in an unsealed deployment, and wait for it

A sealed one is &#x60;409&#x60;: unseal it first. The first command taints it for good, and says who ran it. 

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { RunDeploymentCommandRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // string
    deploymentId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // DeploymentCommand
    deploymentCommand: ...,
  } satisfies RunDeploymentCommandRequest;

  try {
    const data = await api.runDeploymentCommand(body);
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
| **deploymentId** | `string` |  | [Defaults to `undefined`] |
| **deploymentCommand** | [DeploymentCommand](DeploymentCommand.md) |  | |

### Return type

[**DeploymentCommandResult**](DeploymentCommandResult.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | It ran; its exit code may say it failed. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sealDeployment

> Deployment sealDeployment(deploymentId)

Refuse commands and terminals in it from now on

A terminal open on it is hung up. What runs in it goes on, and a taint stays. 

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { SealDeploymentRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // string
    deploymentId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies SealDeploymentRequest;

  try {
    const data = await api.sealDeployment(body);
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
| **deploymentId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Deployment**](Deployment.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Sealed, or already. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## startDeployment

> Deployment startDeployment(deploymentId, deploymentLease)

Boot a stopped or expired deployment again

On the disk it had, until &#x60;ttlSeconds&#x60; from now — a day unless it says otherwise. Starting one that runs only moves its expiry. 

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { StartDeploymentRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // string
    deploymentId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // DeploymentLease (optional)
    deploymentLease: ...,
  } satisfies StartDeploymentRequest;

  try {
    const data = await api.startDeployment(body);
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
| **deploymentId** | `string` |  | [Defaults to `undefined`] |
| **deploymentLease** | [DeploymentLease](DeploymentLease.md) |  | [Optional] |

### Return type

[**Deployment**](Deployment.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Booting, or running. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **409** | Not in the state this needs (&#x60;conflict&#x60;), a different spec under an id already used (&#x60;spec_conflict&#x60;), or still used by something (&#x60;in_use&#x60;).  |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## stopDeployment

> Deployment stopDeployment(deploymentId)

Switch it off, its disk kept

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { StopDeploymentRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // string
    deploymentId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies StopDeploymentRequest;

  try {
    const data = await api.stopDeployment(body);
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
| **deploymentId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Deployment**](Deployment.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Stopped. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## unsealDeployment

> Deployment unsealDeployment(deploymentId)

Let commands and a terminal into it

For debugging one that does not do what its recipe says. Nothing has run yet: the first command or terminal after it makes the deployment &#x60;tainted&#x60; for good — whoever runs it, a session or a person — and sealing it again does not take that away. 

### Example

```ts
import {
  Configuration,
  DeploymentsApi,
} from '@runyard-ai/runyard-sdk';
import type { UnsealDeploymentRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new DeploymentsApi(config);

  const body = {
    // string
    deploymentId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies UnsealDeploymentRequest;

  try {
    const data = await api.unsealDeployment(body);
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
| **deploymentId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Deployment**](Deployment.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Unsealed, or already. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

