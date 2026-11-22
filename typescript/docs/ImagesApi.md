# ImagesApi

All URIs are relative to *http://127.0.0.1:8140*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**buildImage**](ImagesApi.md#buildimage) | **POST** /v1/images | The image a recipe makes, built if it is not yet |
| [**getImage**](ImagesApi.md#getimage) | **GET** /v1/images/{imageId} | An image, and where its build is |
| [**listImages**](ImagesApi.md#listimages) | **GET** /v1/images | The images the caller\&#39;s profiles and sessions use |
| [**putImageName**](ImagesApi.md#putimagename) | **PUT** /v1/images/{imageId}/name | Name an image, and say what it is for |
| [**readImageLog**](ImagesApi.md#readimagelog) | **GET** /v1/images/{imageId}/log | What its build printed, from a byte offset |



## buildImage

> Image buildImage(imageRequest)

The image a recipe makes, built if it is not yet

A recipe is a Dockerfile of one stage. One that starts &#x60;FROM harness/&lt;name&gt;&#x60; — &#x60;FROM harness/claude-code&#x60; — is built on the image of that harness, which holds what a session of it runs: what a profile\&#39;s or a session\&#39;s &#x60;sandbox.recipe&#x60; is. One that starts &#x60;FROM&#x60; any other image is built on it, and a session boots it with its harness mounted beside it. Every &#x60;RUN&#x60; says what it may reach, for that step alone — &#x60;--allow&#x3D;&lt;host&gt;,…&#x60; and &#x60;--broker&#x3D;&lt;name&gt;&#x60; — and nothing else is reached. The runyard-sandboxes daemon builds it, each step in a sandbox of its own.  An image is identified by what it is made of — the recipe, its harness\&#39;s image in place of &#x60;harness/&lt;name&gt;&#x60; — so the same recipe again is the same image: built once, &#x60;200&#x60; while it builds and after. A recipe whose build failed is built again. A server whose harness image changes builds every recipe again, on the new one.  A profile or a session whose &#x60;sandbox.recipe&#x60; is set asks for its image when it is saved; a session waits for it before its first wake.  Its &#x60;name&#x60;, and what it is for, are what people pick it by: they name the image as &#x60;PUT …/images/{imageId}/name&#x60; does. 

### Example

```ts
import {
  Configuration,
  ImagesApi,
} from '@runyard-ai/runyard-sdk';
import type { BuildImageRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ImagesApi(config);

  const body = {
    // ImageRequest
    imageRequest: ...,
  } satisfies BuildImageRequest;

  try {
    const data = await api.buildImage(body);
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
| **imageRequest** | [ImageRequest](ImageRequest.md) |  | |

### Return type

[**Image**](Image.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The image, building, built or failed. |  -  |
| **202** | Its build, started. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **422** | A recipe this server or the sandboxes daemon will not build (&#x60;recipe_invalid&#x60;): its message names the line.  |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getImage

> Image getImage(imageId)

An image, and where its build is

### Example

```ts
import {
  Configuration,
  ImagesApi,
} from '@runyard-ai/runyard-sdk';
import type { GetImageRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ImagesApi(config);

  const body = {
    // string
    imageId: imageId_example,
  } satisfies GetImageRequest;

  try {
    const data = await api.getImage(body);
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
| **imageId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Image**](Image.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The image. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listImages

> ImageList listImages()

The images the caller\&#39;s profiles and sessions use

An image is named by what it is made of and is nobody\&#39;s, so what a person is shown is what is theirs uses: their profiles\&#39; recipes, their sessions\&#39; images, and the images they named. An admin is shown every image this server knows. Newest first. 

### Example

```ts
import {
  Configuration,
  ImagesApi,
} from '@runyard-ai/runyard-sdk';
import type { ListImagesRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ImagesApi(config);

  try {
    const data = await api.listImages();
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

[**ImageList**](ImageList.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The images. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **502** | Somebody else\&#39;s server answered badly, or not at all (&#x60;provider_error&#x60;, &#x60;upstream_error&#x60;). |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## putImageName

> Image putImageName(imageId, imageName)

Name an image, and say what it is for

What a person picks an image by, in place of its id: whoever may see the image may name it, in place of what it was called, and sees it among their images from then on. The name is kept by the image\&#39;s id, so a recipe built again is named as it was. 

### Example

```ts
import {
  Configuration,
  ImagesApi,
} from '@runyard-ai/runyard-sdk';
import type { PutImageNameRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ImagesApi(config);

  const body = {
    // string
    imageId: imageId_example,
    // ImageName
    imageName: ...,
  } satisfies PutImageNameRequest;

  try {
    const data = await api.putImageName(body);
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
| **imageId** | `string` |  | [Defaults to `undefined`] |
| **imageName** | [ImageName](ImageName.md) |  | |

### Return type

[**Image**](Image.md)

### Authorization

[console](../README.md#console), [apiKey](../README.md#apiKey), [platform](../README.md#platform)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The image, named. |  -  |
| **400** | The request is not one this contract describes, or not one that makes sense. |  -  |
| **401** | No key, or not a working one — one answer for every cause. |  -  |
| **403** | The key works, and lacks the scope this needs — or its person, what this is. |  -  |
| **404** | Nothing by that id. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## readImageLog

> string readImageLog(imageId, from, follow)

What its build printed, from a byte offset

Each step begins with a line naming it, followed by what it printed. &#x60;from&#x60; is a byte offset, so a reader that dropped resumes where it stopped; with &#x60;follow&#x60; the body stays open until the build ends. 

### Example

```ts
import {
  Configuration,
  ImagesApi,
} from '@runyard-ai/runyard-sdk';
import type { ReadImageLogRequest } from '@runyard-ai/runyard-sdk';

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
  const api = new ImagesApi(config);

  const body = {
    // string
    imageId: imageId_example,
    // number | The first byte wanted. (optional)
    from: 789,
    // boolean | Keep the body open and write what happens next. (optional)
    follow: true,
  } satisfies ReadImageLogRequest;

  try {
    const data = await api.readImageLog(body);
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
| **imageId** | `string` |  | [Defaults to `undefined`] |
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

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

