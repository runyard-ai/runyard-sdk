/* tslint:disable */
/* eslint-disable */
/**
 * runyard-agents
 * **Open a session, talk to it, watch what it does, and let it start others.**  A session is a conversation with a harness — Claude Code or Codex — running in a sandbox of its own. This server makes the sandbox (through runyard-sandboxes), starts the harness in it, keeps the transcript, and serves it to whoever asks: a chat UI, a console, a scheduler, a GitHub App, or another session.  It is the API workspace-platform\'s chat is adapted to: everything it does about conversations — sessions, sub-agents, background tasks, the session\'s task list, brokers, MCP connectors, sessions started by code and the lineage between them — and nothing else. Widgets, workflows, objects and the rest of workspace-platform are not here, and are not meant to be.  ### One session, one sandbox  Every session has a sandbox of its own, with its own resources, and no two sessions ever share one. There is no \"box\" to create first, no machine-wide setting to size: `cpus`, `memory` and `disk` are fields of the session, defaulted by the server (or the session\'s harness) and capped by it.  A session\'s disk outlives its sandbox. A session nobody talks to is put to **sleep**: its sandbox is released and its disk kept, and the next turn wakes it on a new one. So a session costs a machine only while it is working, and a thousand dormant ones cost a thousand disks.  ### Two liveness domains  `session.state` is its harness\'s (`idle`, `generating`, …); `session.sandbox.state` is the machine\'s (`booting`, `ready`, `released`, …). They are separate because they fail separately — a harness that crashed in a healthy sandbox is relaunched; a sandbox that is gone takes a running harness with it — and a caller that conflates them shows a person the wrong thing.  ### The caller names what it creates  A session is created with `PUT /v1/sessions/{sessionId}`, the id chosen by the caller, and so are profiles, brokers, MCP connectors and triggers. A lost response to a create is retried with the same id, and the second request finds the first\'s session rather than making a second one on a second machine. The same request again is `200`; a different one is `409 spec_conflict`. Turns are idempotent the same way, by `turnId`.  ### The transcript lives here, append-only  The server holds every event of every session, numbered by `seq`, and nothing is ever rewritten: editing an earlier message is a `rewound` event saying which events no longer count, followed by the new ones. A reader that kept its place keeps it. Presentation state — what a person has seen, what they pinned — is not stored; `labels` are the caller\'s escape hatch.  ### Streams, not webhooks  Events are read from a cursor: `GET …/events?from=<seq>&follow=true` is chunked `application/x-ndjson`, one event per line, held open while following. A reader that fell behind what is kept gets `409 gapped` naming the window, never a silent jump. The account\'s sessions change on one feed, `GET /v1/changes`, read the same way: it is how a chat UI keeps its list without polling every session. The one WebSocket is a session\'s terminal.  There are no outbound webhooks. Inbound ones — a trigger\'s hook — are.  ### Lineage  Every session says where it came from: a person (`source: user`), a caller with a key (`api`), another session\'s harness (`session`, with its `parentId`), a fork (`fork`, with `branchedFrom`) or a trigger\'s firing (`trigger`, with the trigger and the firing). `rootId` and `depth` are kept so that a tree is one query away, and `GET …/lineage` is that tree.  ### Brokers and MCP connectors keep the credentials out  Nothing that reaches a sandbox carries a secret. A **broker** is an API the session reaches through this server — GitHub, egress, tunnels, a model provider — with the credential held here; an **MCP connector** is an MCP server, its token or OAuth grant held here, served to the session through a broker of its own. Which ones a session gets is a field of the session.  ### One workspace  A server serves one **workspace**: its sessions, triggers, profiles, images, deployments, providers, brokers, MCP connectors, people, keys, usage and activity. What the workspace itself is comes from how the server is started, never from this API: its name and title (`-workspace`, `-workspace-title`), the runyard-sandboxes server it works on — the workspace\'s own (`-sandboxes`), reached with a key that reaches every sandbox there (`-sandboxes-key-file`, read at every start) — its owner (`-owner`) and its policy (`-policy-file`). `GET /v1/info` says them, but the key.  ### People, and what is whose  Everything is somebody\'s: every session, key, provider, profile, broker, MCP connector and trigger has an `owner`, the person who made it — for a session, whom it is for.  A person is a **member** or an **admin** of the workspace. An admin sees and changes everything in it; a member has the chat: their own sessions and those shared with them, which they read and do not steer. What a person *uses* — the provider a session runs on, the profile it starts from, its brokers and MCP connectors — is their own, or one its owner lets them use (`everyone`, `users`), admin or not. A key does no more than its owner, and a session calling through its brokers no more than its owner, over its own tree alone. Every key is made by a person: none is made for a session. What a person is missing is said in `GET /v1/self/notices`.  A person comes into the workspace by an admin\'s invitation, signing in with Google or the OpenID provider, or by being put in it by address (`PUT /v1/users/{userEmail}`), and signs in with Google, the OpenID provider or the password the password file holds for their address. The workspace\'s owner (`-owner`) is an admin of it from the start, always, and is never removed.  ### The UIs, and this reference  The chat is served at every path not under `/v1/` or `/console/`, and the console at every path under `/console/`: both route by the path (no `#`), so any page of either is an address to share or reload. This document is `GET /v1/openapi.yaml`, and rendered to read at `GET /v1/docs`.  ### What is deliberately not here  - **Tool approval prompts.** The session runs unattended inside its   sandbox; what it may reach outside it is what its brokers reach. - **A process and shell API.** The terminal is the one door into the   sandbox besides the session, and files the one way to move bytes. - **Widgets, workflows, objects, templates as UI.** Not conversations. - **Presentation state.** Pins, unread markers and drafts are the UI\'s. 
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
    type FireRequest,
    FireRequestFromJSON,
    FireRequestToJSON,
} from '../models/FireRequest.js';
import {
    type Firing,
    FiringFromJSON,
    FiringToJSON,
} from '../models/Firing.js';
import {
    type FiringPage,
    FiringPageFromJSON,
    FiringPageToJSON,
} from '../models/FiringPage.js';
import {
    type Trigger,
    TriggerFromJSON,
    TriggerToJSON,
} from '../models/Trigger.js';
import {
    type TriggerPage,
    TriggerPageFromJSON,
    TriggerPageToJSON,
} from '../models/TriggerPage.js';
import {
    type TriggerSpec,
    TriggerSpecFromJSON,
    TriggerSpecToJSON,
} from '../models/TriggerSpec.js';

export interface DeleteTriggerRequest {
    /**
     * 
     */
    triggerId: string;
}

export interface FireTriggerRequest {
    /**
     * 
     */
    triggerId: string;
    /**
     * 
     */
    fireRequest: FireRequest;
}

export interface GetTriggerRequest {
    /**
     * 
     */
    triggerId: string;
}

export interface ListFiringsRequest {
    /**
     * 
     */
    triggerId: string;
    /**
     * At most this many; the default and ceiling are in `GET /v1/info`.
     */
    limit?: number;
    /**
     * From a previous page's `nextCursor`. Opaque; one made up is `400`.
     */
    cursor?: string;
}

export interface ListTriggersRequest {
    /**
     * At most this many; the default and ceiling are in `GET /v1/info`.
     */
    limit?: number;
    /**
     * From a previous page's `nextCursor`. Opaque; one made up is `400`.
     */
    cursor?: string;
}

export interface PutTriggerRequest {
    /**
     * 
     */
    triggerId: string;
    /**
     * 
     */
    triggerSpec: TriggerSpec;
}

export interface ReceiveHookRequest {
    /**
     * 
     */
    triggerId: string;
    /**
     * 
     */
    requestBody: { [key: string]: any; };
    /**
     * 
     */
    xRunyardSignature?: string;
    /**
     * 
     */
    xHubSignature256?: string;
}

/**
 * TriggersApi - interface
 * 
 * @export
 * @interface TriggersApiInterface
 */
export interface TriggersApiInterface {
    /**
     * Creates request options for deleteTrigger without sending the request
     * @param {string} triggerId 
     * @throws {RequiredError}
     * @memberof TriggersApiInterface
     */
    deleteTriggerRequestOpts(requestParameters: DeleteTriggerRequest): Promise<runtime.RequestOpts>;

    /**
     * Its sessions go on, their lineage naming a trigger that is gone.
     * @summary Delete a trigger
     * @param {string} triggerId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TriggersApiInterface
     */
    deleteTriggerRaw(requestParameters: DeleteTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Its sessions go on, their lineage naming a trigger that is gone.
     * Delete a trigger
     */
    deleteTrigger(requestParameters: DeleteTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for fireTrigger without sending the request
     * @param {string} triggerId 
     * @param {FireRequest} fireRequest 
     * @throws {RequiredError}
     * @memberof TriggersApiInterface
     */
    fireTriggerRequestOpts(requestParameters: FireTriggerRequest): Promise<runtime.RequestOpts>;

    /**
     * Any trigger may be fired this way, whatever its kind. `input` fills the turn template\'s `{{input.*}}`. Idempotent by `firingId`: a caller retrying a lost answer gets the first firing, not a second session. `parentId` makes the firing\'s session a child of a session in lineage — how a session\'s harness fans work out through a trigger. 
     * @summary Fire a trigger from code
     * @param {string} triggerId 
     * @param {FireRequest} fireRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TriggersApiInterface
     */
    fireTriggerRaw(requestParameters: FireTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Firing>>;

    /**
     * Any trigger may be fired this way, whatever its kind. `input` fills the turn template\'s `{{input.*}}`. Idempotent by `firingId`: a caller retrying a lost answer gets the first firing, not a second session. `parentId` makes the firing\'s session a child of a session in lineage — how a session\'s harness fans work out through a trigger. 
     * Fire a trigger from code
     */
    fireTrigger(requestParameters: FireTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Firing>;

    /**
     * Creates request options for getTrigger without sending the request
     * @param {string} triggerId 
     * @throws {RequiredError}
     * @memberof TriggersApiInterface
     */
    getTriggerRequestOpts(requestParameters: GetTriggerRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary A trigger
     * @param {string} triggerId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TriggersApiInterface
     */
    getTriggerRaw(requestParameters: GetTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Trigger>>;

    /**
     * A trigger
     */
    getTrigger(requestParameters: GetTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Trigger>;

    /**
     * Creates request options for listFirings without sending the request
     * @param {string} triggerId 
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @throws {RequiredError}
     * @memberof TriggersApiInterface
     */
    listFiringsRequestOpts(requestParameters: ListFiringsRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary A trigger\'s firings, newest first
     * @param {string} triggerId 
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TriggersApiInterface
     */
    listFiringsRaw(requestParameters: ListFiringsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FiringPage>>;

    /**
     * A trigger\'s firings, newest first
     */
    listFirings(requestParameters: ListFiringsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FiringPage>;

    /**
     * Creates request options for listTriggers without sending the request
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @throws {RequiredError}
     * @memberof TriggersApiInterface
     */
    listTriggersRequestOpts(requestParameters: ListTriggersRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary The triggers the caller owns — every one, for an admin
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TriggersApiInterface
     */
    listTriggersRaw(requestParameters: ListTriggersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TriggerPage>>;

    /**
     * The triggers the caller owns — every one, for an admin
     */
    listTriggers(requestParameters: ListTriggersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TriggerPage>;

    /**
     * Creates request options for putTrigger without sending the request
     * @param {string} triggerId 
     * @param {TriggerSpec} triggerSpec 
     * @throws {RequiredError}
     * @memberof TriggersApiInterface
     */
    putTriggerRequestOpts(requestParameters: PutTriggerRequest): Promise<runtime.RequestOpts>;

    /**
     * A trigger starts a session from a profile, with a first turn made from a template and what fired it: a call (`api`), a schedule (`schedule`), or a signed request to its hook (`webhook`). Each firing is recorded, with the session it started, and the session\'s lineage names both.  `concurrency` says what a firing does while the trigger\'s last session is still at work: start another (`parallel`), be dropped (`skip`), or become a turn of that session (`queue`). 
     * @summary Create a trigger, or change it
     * @param {string} triggerId 
     * @param {TriggerSpec} triggerSpec 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TriggersApiInterface
     */
    putTriggerRaw(requestParameters: PutTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Trigger>>;

    /**
     * A trigger starts a session from a profile, with a first turn made from a template and what fired it: a call (`api`), a schedule (`schedule`), or a signed request to its hook (`webhook`). Each firing is recorded, with the session it started, and the session\'s lineage names both.  `concurrency` says what a firing does while the trigger\'s last session is still at work: start another (`parallel`), be dropped (`skip`), or become a turn of that session (`queue`). 
     * Create a trigger, or change it
     */
    putTrigger(requestParameters: PutTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Trigger>;

    /**
     * Creates request options for receiveHook without sending the request
     * @param {string} triggerId 
     * @param {{ [key: string]: any; }} requestBody 
     * @param {string} [xRunyardSignature] 
     * @param {string} [xHubSignature256] 
     * @throws {RequiredError}
     * @memberof TriggersApiInterface
     */
    receiveHookRequestOpts(requestParameters: ReceiveHookRequest): Promise<runtime.RequestOpts>;

    /**
     * Not called with a key: the body is signed with the trigger\'s secret, `X-Runyard-Signature: sha256=<hex HMAC of the body>`, or — for a trigger declared `github` — GitHub\'s own `X-Hub-Signature-256`. Anything unsigned, or signed otherwise, is the same `404` as a trigger that does not exist. The body is the firing\'s `input`; its delivery id header, when the sender gives one, its `firingId`. 
     * @summary A webhook trigger\'s address
     * @param {string} triggerId 
     * @param {{ [key: string]: any; }} requestBody 
     * @param {string} [xRunyardSignature] 
     * @param {string} [xHubSignature256] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TriggersApiInterface
     */
    receiveHookRaw(requestParameters: ReceiveHookRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Firing>>;

    /**
     * Not called with a key: the body is signed with the trigger\'s secret, `X-Runyard-Signature: sha256=<hex HMAC of the body>`, or — for a trigger declared `github` — GitHub\'s own `X-Hub-Signature-256`. Anything unsigned, or signed otherwise, is the same `404` as a trigger that does not exist. The body is the firing\'s `input`; its delivery id header, when the sender gives one, its `firingId`. 
     * A webhook trigger\'s address
     */
    receiveHook(requestParameters: ReceiveHookRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Firing>;

}

/**
 * 
 */
export class TriggersApi extends runtime.BaseAPI implements TriggersApiInterface {

    /**
     * Creates request options for deleteTrigger without sending the request
     */
    async deleteTriggerRequestOpts(requestParameters: DeleteTriggerRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['triggerId'] == null) {
            throw new runtime.RequiredError(
                'triggerId',
                'Required parameter "triggerId" was null or undefined when calling deleteTrigger().'
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

        let urlPath = `/v1/triggers/{triggerId}`;
        urlPath = urlPath.replace('{triggerId}', encodeURIComponent(String(requestParameters['triggerId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Its sessions go on, their lineage naming a trigger that is gone.
     * Delete a trigger
     */
    async deleteTriggerRaw(requestParameters: DeleteTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteTriggerRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Its sessions go on, their lineage naming a trigger that is gone.
     * Delete a trigger
     */
    async deleteTrigger(requestParameters: DeleteTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteTriggerRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for fireTrigger without sending the request
     */
    async fireTriggerRequestOpts(requestParameters: FireTriggerRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['triggerId'] == null) {
            throw new runtime.RequiredError(
                'triggerId',
                'Required parameter "triggerId" was null or undefined when calling fireTrigger().'
            );
        }

        if (requestParameters['fireRequest'] == null) {
            throw new runtime.RequiredError(
                'fireRequest',
                'Required parameter "fireRequest" was null or undefined when calling fireTrigger().'
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

        let urlPath = `/v1/triggers/{triggerId}/fire`;
        urlPath = urlPath.replace('{triggerId}', encodeURIComponent(String(requestParameters['triggerId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: FireRequestToJSON(requestParameters['fireRequest']),
        };
    }

    /**
     * Any trigger may be fired this way, whatever its kind. `input` fills the turn template\'s `{{input.*}}`. Idempotent by `firingId`: a caller retrying a lost answer gets the first firing, not a second session. `parentId` makes the firing\'s session a child of a session in lineage — how a session\'s harness fans work out through a trigger. 
     * Fire a trigger from code
     */
    async fireTriggerRaw(requestParameters: FireTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Firing>> {
        const requestOptions = await this.fireTriggerRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FiringFromJSON(jsonValue));
    }

    /**
     * Any trigger may be fired this way, whatever its kind. `input` fills the turn template\'s `{{input.*}}`. Idempotent by `firingId`: a caller retrying a lost answer gets the first firing, not a second session. `parentId` makes the firing\'s session a child of a session in lineage — how a session\'s harness fans work out through a trigger. 
     * Fire a trigger from code
     */
    async fireTrigger(requestParameters: FireTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Firing> {
        const response = await this.fireTriggerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getTrigger without sending the request
     */
    async getTriggerRequestOpts(requestParameters: GetTriggerRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['triggerId'] == null) {
            throw new runtime.RequiredError(
                'triggerId',
                'Required parameter "triggerId" was null or undefined when calling getTrigger().'
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

        let urlPath = `/v1/triggers/{triggerId}`;
        urlPath = urlPath.replace('{triggerId}', encodeURIComponent(String(requestParameters['triggerId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A trigger
     */
    async getTriggerRaw(requestParameters: GetTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Trigger>> {
        const requestOptions = await this.getTriggerRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TriggerFromJSON(jsonValue));
    }

    /**
     * A trigger
     */
    async getTrigger(requestParameters: GetTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Trigger> {
        const response = await this.getTriggerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listFirings without sending the request
     */
    async listFiringsRequestOpts(requestParameters: ListFiringsRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['triggerId'] == null) {
            throw new runtime.RequiredError(
                'triggerId',
                'Required parameter "triggerId" was null or undefined when calling listFirings().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['cursor'] != null) {
            queryParameters['cursor'] = requestParameters['cursor'];
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

        let urlPath = `/v1/triggers/{triggerId}/firings`;
        urlPath = urlPath.replace('{triggerId}', encodeURIComponent(String(requestParameters['triggerId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A trigger\'s firings, newest first
     */
    async listFiringsRaw(requestParameters: ListFiringsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FiringPage>> {
        const requestOptions = await this.listFiringsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FiringPageFromJSON(jsonValue));
    }

    /**
     * A trigger\'s firings, newest first
     */
    async listFirings(requestParameters: ListFiringsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FiringPage> {
        const response = await this.listFiringsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listTriggers without sending the request
     */
    async listTriggersRequestOpts(requestParameters: ListTriggersRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['cursor'] != null) {
            queryParameters['cursor'] = requestParameters['cursor'];
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

        let urlPath = `/v1/triggers`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The triggers the caller owns — every one, for an admin
     */
    async listTriggersRaw(requestParameters: ListTriggersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TriggerPage>> {
        const requestOptions = await this.listTriggersRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TriggerPageFromJSON(jsonValue));
    }

    /**
     * The triggers the caller owns — every one, for an admin
     */
    async listTriggers(requestParameters: ListTriggersRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TriggerPage> {
        const response = await this.listTriggersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for putTrigger without sending the request
     */
    async putTriggerRequestOpts(requestParameters: PutTriggerRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['triggerId'] == null) {
            throw new runtime.RequiredError(
                'triggerId',
                'Required parameter "triggerId" was null or undefined when calling putTrigger().'
            );
        }

        if (requestParameters['triggerSpec'] == null) {
            throw new runtime.RequiredError(
                'triggerSpec',
                'Required parameter "triggerSpec" was null or undefined when calling putTrigger().'
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

        let urlPath = `/v1/triggers/{triggerId}`;
        urlPath = urlPath.replace('{triggerId}', encodeURIComponent(String(requestParameters['triggerId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: TriggerSpecToJSON(requestParameters['triggerSpec']),
        };
    }

    /**
     * A trigger starts a session from a profile, with a first turn made from a template and what fired it: a call (`api`), a schedule (`schedule`), or a signed request to its hook (`webhook`). Each firing is recorded, with the session it started, and the session\'s lineage names both.  `concurrency` says what a firing does while the trigger\'s last session is still at work: start another (`parallel`), be dropped (`skip`), or become a turn of that session (`queue`). 
     * Create a trigger, or change it
     */
    async putTriggerRaw(requestParameters: PutTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Trigger>> {
        const requestOptions = await this.putTriggerRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TriggerFromJSON(jsonValue));
    }

    /**
     * A trigger starts a session from a profile, with a first turn made from a template and what fired it: a call (`api`), a schedule (`schedule`), or a signed request to its hook (`webhook`). Each firing is recorded, with the session it started, and the session\'s lineage names both.  `concurrency` says what a firing does while the trigger\'s last session is still at work: start another (`parallel`), be dropped (`skip`), or become a turn of that session (`queue`). 
     * Create a trigger, or change it
     */
    async putTrigger(requestParameters: PutTriggerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Trigger> {
        const response = await this.putTriggerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for receiveHook without sending the request
     */
    async receiveHookRequestOpts(requestParameters: ReceiveHookRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['triggerId'] == null) {
            throw new runtime.RequiredError(
                'triggerId',
                'Required parameter "triggerId" was null or undefined when calling receiveHook().'
            );
        }

        if (requestParameters['requestBody'] == null) {
            throw new runtime.RequiredError(
                'requestBody',
                'Required parameter "requestBody" was null or undefined when calling receiveHook().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (requestParameters['xRunyardSignature'] != null) {
            headerParameters['X-Runyard-Signature'] = String(requestParameters['xRunyardSignature']);
        }

        if (requestParameters['xHubSignature256'] != null) {
            headerParameters['X-Hub-Signature-256'] = String(requestParameters['xHubSignature256']);
        }


        let urlPath = `/v1/hooks/{triggerId}`;
        urlPath = urlPath.replace('{triggerId}', encodeURIComponent(String(requestParameters['triggerId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['requestBody'],
        };
    }

    /**
     * Not called with a key: the body is signed with the trigger\'s secret, `X-Runyard-Signature: sha256=<hex HMAC of the body>`, or — for a trigger declared `github` — GitHub\'s own `X-Hub-Signature-256`. Anything unsigned, or signed otherwise, is the same `404` as a trigger that does not exist. The body is the firing\'s `input`; its delivery id header, when the sender gives one, its `firingId`. 
     * A webhook trigger\'s address
     */
    async receiveHookRaw(requestParameters: ReceiveHookRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Firing>> {
        const requestOptions = await this.receiveHookRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FiringFromJSON(jsonValue));
    }

    /**
     * Not called with a key: the body is signed with the trigger\'s secret, `X-Runyard-Signature: sha256=<hex HMAC of the body>`, or — for a trigger declared `github` — GitHub\'s own `X-Hub-Signature-256`. Anything unsigned, or signed otherwise, is the same `404` as a trigger that does not exist. The body is the firing\'s `input`; its delivery id header, when the sender gives one, its `firingId`. 
     * A webhook trigger\'s address
     */
    async receiveHook(requestParameters: ReceiveHookRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Firing> {
        const response = await this.receiveHookRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
