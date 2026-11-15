/* tslint:disable */
/* eslint-disable */
/**
 * runyard-agents
 * **Open a session, talk to it, watch what it does, and let it start others.**  A session is a conversation with a harness — Claude Code or Codex — running in a sandbox of its own. This server makes the sandbox (through runyard-sandboxes), starts the harness in it, keeps the transcript, and serves it to whoever asks: a chat UI, a console, a scheduler, a GitHub App, or another session.  It is the API workspace-platform\'s chat is adapted to: everything it does about conversations — sessions, sub-agents, background tasks, the session\'s task list, brokers, MCP connectors, sessions started by code and the lineage between them — and nothing else. Widgets, workflows, objects and the rest of workspace-platform are not here, and are not meant to be.  ### One session, one sandbox  Every session has a sandbox of its own, with its own resources, and no two sessions ever share one. There is no \"box\" to create first, no machine-wide setting to size: `cpus`, `memory` and `disk` are fields of the session, defaulted by the server (or the session\'s harness) and capped by it.  A session\'s disk outlives its sandbox. A session nobody talks to is put to **sleep**: its sandbox is released and its disk kept, and the next turn wakes it on a new one. So a session costs a machine only while it is working, and a thousand dormant ones cost a thousand disks.  ### Two liveness domains  `session.state` is its harness\'s (`idle`, `generating`, …); `session.sandbox.state` is the machine\'s (`booting`, `ready`, `released`, …). They are separate because they fail separately — a harness that crashed in a healthy sandbox is relaunched; a sandbox that is gone takes a running harness with it — and a caller that conflates them shows a person the wrong thing.  ### The caller names what it creates  A session is created with `PUT /v1/sessions/{sessionId}`, the id chosen by the caller, and so are profiles, brokers, MCP connectors and triggers. A lost response to a create is retried with the same id, and the second request finds the first\'s session rather than making a second one on a second machine. The same request again is `200`; a different one is `409 spec_conflict`. Turns are idempotent the same way, by `turnId`.  ### The transcript lives here, append-only  The server holds every event of every session, numbered by `seq`, and nothing is ever rewritten: editing an earlier message is a `rewound` event saying which events no longer count, followed by the new ones. A reader that kept its place keeps it. Presentation state — what a person has seen, what they pinned — is not stored; `labels` are the caller\'s escape hatch.  ### Streams, not webhooks  Events are read from a cursor: `GET …/events?from=<seq>&follow=true` is chunked `application/x-ndjson`, one event per line, held open while following. A reader that fell behind what is kept gets `409 gapped` naming the window, never a silent jump. The account\'s sessions change on one feed, `GET /v1/changes`, read the same way: it is how a chat UI keeps its list without polling every session. The one WebSocket is a session\'s terminal.  There are no outbound webhooks. Inbound ones — a trigger\'s hook — are.  ### Lineage  Every session says where it came from: a person (`source: user`), a caller with a key (`api`), another session\'s harness (`session`, with its `parentId`), a fork (`fork`, with `branchedFrom`) or a trigger\'s firing (`trigger`, with the trigger and the firing). `rootId` and `depth` are kept so that a tree is one query away, and `GET …/lineage` is that tree.  ### Brokers and MCP connectors keep the credentials out  Nothing that reaches a sandbox carries a secret. A **broker** is an API the session reaches through this server — GitHub, egress, tunnels, a model provider — with the credential held here; an **MCP connector** is an MCP server, its token or OAuth grant held here, served to the session through a broker of its own. Which ones a session gets is a field of the session.  ### One workspace  A server serves one **workspace**: its sessions, triggers, profiles, images, deployments, providers, brokers, MCP connectors, people, keys, usage and activity. What the workspace itself is comes from how the server is started, never from this API: its name and title (`--workspace`, `--workspace-title`), the runyard-sandboxes server it works on — the workspace\'s own (`--sandboxes`), reached with a key that reaches every sandbox there (`--sandboxes-key-file`, read at every start) — its owner (`--owner`) and its policy (`--policy-file`). `GET /v1/info` says them, but the key.  ### People, and what is whose  Everything is somebody\'s: every session, key, provider, profile, broker, MCP connector and trigger has an `owner`, the person who made it — for a session, whom it is for.  A person is a **member** or an **admin** of the workspace. An admin sees and changes everything in it; a member has the chat: their own sessions and those shared with them, which they read and do not steer. What a person *uses* — the provider a session runs on, the profile it starts from, its brokers and MCP connectors — is their own, or one its owner lets them use (`everyone`, `users`), admin or not. A key does no more than its owner, and a session calling through its brokers no more than its owner, over its own tree alone. Every key is made by a person: none is made for a session. What a person is missing is said in `GET /v1/self/notices`.  A person comes into the workspace by an admin\'s invitation, signing in with Google or the OpenID provider, or by being put in it by address (`PUT /v1/users/{userEmail}`), and signs in with Google, the OpenID provider or the password the password file holds for their address. The workspace\'s owner (`--owner`) is an admin of it from the start, always, and is never removed.  ### The UIs, and this reference  The chat is served at every path not under `/v1/` or `/console/`, and the console at every path under `/console/`: both route by the path (no `#`), so any page of either is an address to share or reload. This document is `GET /v1/openapi.yaml`, and rendered to read at `GET /v1/docs`.  ### What is deliberately not here  - **Tool approval prompts.** The session runs unattended inside its   sandbox; what it may reach outside it is what its brokers reach. - **A process and shell API.** The terminal is the one door into the   sandbox besides the session, and files the one way to move bytes. - **Widgets, workflows, objects, templates as UI.** Not conversations. - **Presentation state.** Pins, unread markers and drafts are the UI\'s. 
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import * as runtime from '../runtime.js';
import {
    type Image,
    ImageFromJSON,
    ImageToJSON,
} from '../models/Image.js';
import {
    type ImageList,
    ImageListFromJSON,
    ImageListToJSON,
} from '../models/ImageList.js';
import {
    type ImageName,
    ImageNameFromJSON,
    ImageNameToJSON,
} from '../models/ImageName.js';
import {
    type ImageRequest,
    ImageRequestFromJSON,
    ImageRequestToJSON,
} from '../models/ImageRequest.js';

export interface BuildImageRequest {
    /**
     * 
     */
    imageRequest: ImageRequest;
}

export interface GetImageRequest {
    /**
     * 
     */
    imageId: string;
}

export interface PutImageNameRequest {
    /**
     * 
     */
    imageId: string;
    /**
     * 
     */
    imageName: ImageName;
}

export interface ReadImageLogRequest {
    /**
     * 
     */
    imageId: string;
    /**
     * The first byte wanted.
     */
    from?: number;
    /**
     * Keep the body open and write what happens next.
     */
    follow?: boolean;
}

/**
 * ImagesApi - interface
 * 
 * @export
 * @interface ImagesApiInterface
 */
export interface ImagesApiInterface {
    /**
     * Creates request options for buildImage without sending the request
     * @param {ImageRequest} imageRequest 
     * @throws {RequiredError}
     * @memberof ImagesApiInterface
     */
    buildImageRequestOpts(requestParameters: BuildImageRequest): Promise<runtime.RequestOpts>;

    /**
     * A recipe is a Dockerfile of one stage. One that starts `FROM harness/<name>` — `FROM harness/claude-code` — is built on the image of that harness, which holds what a session of it runs: what a profile\'s or a session\'s `sandbox.recipe` is. One that starts `FROM` any other image is built on it, for a deployment (`POST /v1/deployments`). Every `RUN` says what it may reach, for that step alone — `--allow=<host>,…` and `--broker=<name>` — and nothing else is reached. The runyard-sandboxes daemon builds it, each step in a sandbox of its own.  An image is identified by what it is made of — the recipe, its harness\'s image in place of `harness/<name>` — so the same recipe again is the same image: built once, `200` while it builds and after. A recipe whose build failed is built again. A server whose harness image changes builds every recipe again, on the new one.  A profile or a session whose `sandbox.recipe` is set asks for its image when it is saved; a session waits for it before its first wake.  Its `name`, and what it is for, are what people pick it by: they name the image as `PUT …/images/{imageId}/name` does. 
     * @summary The image a recipe makes, built if it is not yet
     * @param {ImageRequest} imageRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ImagesApiInterface
     */
    buildImageRaw(requestParameters: BuildImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Image>>;

    /**
     * A recipe is a Dockerfile of one stage. One that starts `FROM harness/<name>` — `FROM harness/claude-code` — is built on the image of that harness, which holds what a session of it runs: what a profile\'s or a session\'s `sandbox.recipe` is. One that starts `FROM` any other image is built on it, for a deployment (`POST /v1/deployments`). Every `RUN` says what it may reach, for that step alone — `--allow=<host>,…` and `--broker=<name>` — and nothing else is reached. The runyard-sandboxes daemon builds it, each step in a sandbox of its own.  An image is identified by what it is made of — the recipe, its harness\'s image in place of `harness/<name>` — so the same recipe again is the same image: built once, `200` while it builds and after. A recipe whose build failed is built again. A server whose harness image changes builds every recipe again, on the new one.  A profile or a session whose `sandbox.recipe` is set asks for its image when it is saved; a session waits for it before its first wake.  Its `name`, and what it is for, are what people pick it by: they name the image as `PUT …/images/{imageId}/name` does. 
     * The image a recipe makes, built if it is not yet
     */
    buildImage(requestParameters: BuildImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Image>;

    /**
     * Creates request options for getImage without sending the request
     * @param {string} imageId 
     * @throws {RequiredError}
     * @memberof ImagesApiInterface
     */
    getImageRequestOpts(requestParameters: GetImageRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary An image, and where its build is
     * @param {string} imageId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ImagesApiInterface
     */
    getImageRaw(requestParameters: GetImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Image>>;

    /**
     * An image, and where its build is
     */
    getImage(requestParameters: GetImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Image>;

    /**
     * Creates request options for listImages without sending the request
     * @throws {RequiredError}
     * @memberof ImagesApiInterface
     */
    listImagesRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * An image is named by what it is made of and is nobody\'s, so what a person is shown is what is theirs uses: their profiles\' recipes, their sessions\' images, and their deployments\', and the images they named. An admin is shown every image this server knows. Newest first. 
     * @summary The images the caller\'s profiles, sessions and deployments use
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ImagesApiInterface
     */
    listImagesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ImageList>>;

    /**
     * An image is named by what it is made of and is nobody\'s, so what a person is shown is what is theirs uses: their profiles\' recipes, their sessions\' images, and their deployments\', and the images they named. An admin is shown every image this server knows. Newest first. 
     * The images the caller\'s profiles, sessions and deployments use
     */
    listImages(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ImageList>;

    /**
     * Creates request options for putImageName without sending the request
     * @param {string} imageId 
     * @param {ImageName} imageName 
     * @throws {RequiredError}
     * @memberof ImagesApiInterface
     */
    putImageNameRequestOpts(requestParameters: PutImageNameRequest): Promise<runtime.RequestOpts>;

    /**
     * What a person picks an image by, in place of its id: whoever may see the image may name it, in place of what it was called, and sees it among their images from then on. The name is kept by the image\'s id, so a recipe built again is named as it was. 
     * @summary Name an image, and say what it is for
     * @param {string} imageId 
     * @param {ImageName} imageName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ImagesApiInterface
     */
    putImageNameRaw(requestParameters: PutImageNameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Image>>;

    /**
     * What a person picks an image by, in place of its id: whoever may see the image may name it, in place of what it was called, and sees it among their images from then on. The name is kept by the image\'s id, so a recipe built again is named as it was. 
     * Name an image, and say what it is for
     */
    putImageName(requestParameters: PutImageNameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Image>;

    /**
     * Creates request options for readImageLog without sending the request
     * @param {string} imageId 
     * @param {number} [from] The first byte wanted.
     * @param {boolean} [follow] Keep the body open and write what happens next.
     * @throws {RequiredError}
     * @memberof ImagesApiInterface
     */
    readImageLogRequestOpts(requestParameters: ReadImageLogRequest): Promise<runtime.RequestOpts>;

    /**
     * Each step begins with a line naming it, followed by what it printed. `from` is a byte offset, so a reader that dropped resumes where it stopped; with `follow` the body stays open until the build ends. 
     * @summary What its build printed, from a byte offset
     * @param {string} imageId 
     * @param {number} [from] The first byte wanted.
     * @param {boolean} [follow] Keep the body open and write what happens next.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ImagesApiInterface
     */
    readImageLogRaw(requestParameters: ReadImageLogRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;

    /**
     * Each step begins with a line naming it, followed by what it printed. `from` is a byte offset, so a reader that dropped resumes where it stopped; with `follow` the body stays open until the build ends. 
     * What its build printed, from a byte offset
     */
    readImageLog(requestParameters: ReadImageLogRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;

}

/**
 * 
 */
export class ImagesApi extends runtime.BaseAPI implements ImagesApiInterface {

    /**
     * Creates request options for buildImage without sending the request
     */
    async buildImageRequestOpts(requestParameters: BuildImageRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['imageRequest'] == null) {
            throw new runtime.RequiredError(
                'imageRequest',
                'Required parameter "imageRequest" was null or undefined when calling buildImage().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("platform", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/v1/images`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ImageRequestToJSON(requestParameters['imageRequest']),
        };
    }

    /**
     * A recipe is a Dockerfile of one stage. One that starts `FROM harness/<name>` — `FROM harness/claude-code` — is built on the image of that harness, which holds what a session of it runs: what a profile\'s or a session\'s `sandbox.recipe` is. One that starts `FROM` any other image is built on it, for a deployment (`POST /v1/deployments`). Every `RUN` says what it may reach, for that step alone — `--allow=<host>,…` and `--broker=<name>` — and nothing else is reached. The runyard-sandboxes daemon builds it, each step in a sandbox of its own.  An image is identified by what it is made of — the recipe, its harness\'s image in place of `harness/<name>` — so the same recipe again is the same image: built once, `200` while it builds and after. A recipe whose build failed is built again. A server whose harness image changes builds every recipe again, on the new one.  A profile or a session whose `sandbox.recipe` is set asks for its image when it is saved; a session waits for it before its first wake.  Its `name`, and what it is for, are what people pick it by: they name the image as `PUT …/images/{imageId}/name` does. 
     * The image a recipe makes, built if it is not yet
     */
    async buildImageRaw(requestParameters: BuildImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Image>> {
        const requestOptions = await this.buildImageRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ImageFromJSON(jsonValue));
    }

    /**
     * A recipe is a Dockerfile of one stage. One that starts `FROM harness/<name>` — `FROM harness/claude-code` — is built on the image of that harness, which holds what a session of it runs: what a profile\'s or a session\'s `sandbox.recipe` is. One that starts `FROM` any other image is built on it, for a deployment (`POST /v1/deployments`). Every `RUN` says what it may reach, for that step alone — `--allow=<host>,…` and `--broker=<name>` — and nothing else is reached. The runyard-sandboxes daemon builds it, each step in a sandbox of its own.  An image is identified by what it is made of — the recipe, its harness\'s image in place of `harness/<name>` — so the same recipe again is the same image: built once, `200` while it builds and after. A recipe whose build failed is built again. A server whose harness image changes builds every recipe again, on the new one.  A profile or a session whose `sandbox.recipe` is set asks for its image when it is saved; a session waits for it before its first wake.  Its `name`, and what it is for, are what people pick it by: they name the image as `PUT …/images/{imageId}/name` does. 
     * The image a recipe makes, built if it is not yet
     */
    async buildImage(requestParameters: BuildImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Image> {
        const response = await this.buildImageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getImage without sending the request
     */
    async getImageRequestOpts(requestParameters: GetImageRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['imageId'] == null) {
            throw new runtime.RequiredError(
                'imageId',
                'Required parameter "imageId" was null or undefined when calling getImage().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("platform", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/v1/images/{imageId}`;
        urlPath = urlPath.replace('{imageId}', encodeURIComponent(String(requestParameters['imageId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * An image, and where its build is
     */
    async getImageRaw(requestParameters: GetImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Image>> {
        const requestOptions = await this.getImageRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ImageFromJSON(jsonValue));
    }

    /**
     * An image, and where its build is
     */
    async getImage(requestParameters: GetImageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Image> {
        const response = await this.getImageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listImages without sending the request
     */
    async listImagesRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("platform", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/v1/images`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * An image is named by what it is made of and is nobody\'s, so what a person is shown is what is theirs uses: their profiles\' recipes, their sessions\' images, and their deployments\', and the images they named. An admin is shown every image this server knows. Newest first. 
     * The images the caller\'s profiles, sessions and deployments use
     */
    async listImagesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ImageList>> {
        const requestOptions = await this.listImagesRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ImageListFromJSON(jsonValue));
    }

    /**
     * An image is named by what it is made of and is nobody\'s, so what a person is shown is what is theirs uses: their profiles\' recipes, their sessions\' images, and their deployments\', and the images they named. An admin is shown every image this server knows. Newest first. 
     * The images the caller\'s profiles, sessions and deployments use
     */
    async listImages(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ImageList> {
        const response = await this.listImagesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for putImageName without sending the request
     */
    async putImageNameRequestOpts(requestParameters: PutImageNameRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['imageId'] == null) {
            throw new runtime.RequiredError(
                'imageId',
                'Required parameter "imageId" was null or undefined when calling putImageName().'
            );
        }

        if (requestParameters['imageName'] == null) {
            throw new runtime.RequiredError(
                'imageName',
                'Required parameter "imageName" was null or undefined when calling putImageName().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("platform", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/v1/images/{imageId}/name`;
        urlPath = urlPath.replace('{imageId}', encodeURIComponent(String(requestParameters['imageId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ImageNameToJSON(requestParameters['imageName']),
        };
    }

    /**
     * What a person picks an image by, in place of its id: whoever may see the image may name it, in place of what it was called, and sees it among their images from then on. The name is kept by the image\'s id, so a recipe built again is named as it was. 
     * Name an image, and say what it is for
     */
    async putImageNameRaw(requestParameters: PutImageNameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Image>> {
        const requestOptions = await this.putImageNameRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ImageFromJSON(jsonValue));
    }

    /**
     * What a person picks an image by, in place of its id: whoever may see the image may name it, in place of what it was called, and sees it among their images from then on. The name is kept by the image\'s id, so a recipe built again is named as it was. 
     * Name an image, and say what it is for
     */
    async putImageName(requestParameters: PutImageNameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Image> {
        const response = await this.putImageNameRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readImageLog without sending the request
     */
    async readImageLogRequestOpts(requestParameters: ReadImageLogRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['imageId'] == null) {
            throw new runtime.RequiredError(
                'imageId',
                'Required parameter "imageId" was null or undefined when calling readImageLog().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['from'] != null) {
            queryParameters['from'] = requestParameters['from'];
        }

        if (requestParameters['follow'] != null) {
            queryParameters['follow'] = requestParameters['follow'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("apiKey", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("platform", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }

        let urlPath = `/v1/images/{imageId}/log`;
        urlPath = urlPath.replace('{imageId}', encodeURIComponent(String(requestParameters['imageId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Each step begins with a line naming it, followed by what it printed. `from` is a byte offset, so a reader that dropped resumes where it stopped; with `follow` the body stays open until the build ends. 
     * What its build printed, from a byte offset
     */
    async readImageLogRaw(requestParameters: ReadImageLogRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const requestOptions = await this.readImageLogRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Each step begins with a line naming it, followed by what it printed. `from` is a byte offset, so a reader that dropped resumes where it stopped; with `follow` the body stays open until the build ends. 
     * What its build printed, from a byte offset
     */
    async readImageLog(requestParameters: ReadImageLogRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.readImageLogRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
