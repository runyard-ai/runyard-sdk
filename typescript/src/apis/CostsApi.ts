/* tslint:disable */
/* eslint-disable */
/**
 * runyard-agents
 * **Open a session, talk to it, watch what it does, and let it start others.**  A session is a conversation with a harness — Claude Code or Codex — running in a sandbox of its own. This server makes the sandbox (through runyard-sandboxes), starts the harness in it, keeps the transcript, and serves it to whoever asks: a chat UI, a console, a scheduler, a GitHub App, or another session.  It is the API workspace-platform\'s chat is adapted to: everything it does about conversations — sessions, sub-agents, background tasks, the session\'s task list, brokers, MCP connectors, sessions started by code and the lineage between them — and nothing else. Widgets, workflows, objects and the rest of workspace-platform are not here, and are not meant to be.  ### One session, one sandbox  Every session has a sandbox of its own, with its own resources, and no two sessions ever share one. There is no \"box\" to create first, no machine-wide setting to size: `cpus`, `memory` and `disk` are fields of the session, defaulted by the server (or the session\'s harness) and capped by it.  A session\'s disk outlives its sandbox. A session nobody talks to is put to **sleep**: its sandbox is released and its disk kept, and the next turn wakes it on a new one. So a session costs a machine only while it is working, and a thousand dormant ones cost a thousand disks.  ### Two liveness domains  `session.state` is its harness\'s (`idle`, `generating`, …); `session.sandbox.state` is the machine\'s (`booting`, `ready`, `released`, …). They are separate because they fail separately — a harness that crashed in a healthy sandbox is relaunched; a sandbox that is gone takes a running harness with it — and a caller that conflates them shows a person the wrong thing.  ### The caller names what it creates  A session is created with `PUT /v1/sessions/{sessionId}`, the id chosen by the caller, and so are profiles, brokers, MCP connectors and triggers. A lost response to a create is retried with the same id, and the second request finds the first\'s session rather than making a second one on a second machine. The same request again is `200`; a different one is `409 spec_conflict`. Turns are idempotent the same way, by `turnId`.  ### The transcript lives here, append-only  The server holds every event of every session, numbered by `seq`, and nothing is ever rewritten: editing an earlier message is a `rewound` event saying which events no longer count, followed by the new ones. A reader that kept its place keeps it. Presentation state — what a person has seen, what they pinned — is not stored; `labels` are the caller\'s escape hatch.  ### Streams, not webhooks  Events are read from a cursor: `GET …/events?from=<seq>&follow=true` is chunked `application/x-ndjson`, one event per line, held open while following. A reader that fell behind what is kept gets `409 gapped` naming the window, never a silent jump. The account\'s sessions change on one feed, `GET /v1/changes`, read the same way: it is how a chat UI keeps its list without polling every session. The one WebSocket is a session\'s terminal.  There are no outbound webhooks. Inbound ones — a trigger\'s hook — are.  ### Lineage  Every session says where it came from: a person (`source: user`), a caller with a key (`api`), another session\'s harness (`session`, with its `parentId`), a fork (`fork`, with `branchedFrom`) or a trigger\'s firing (`trigger`, with the trigger and the firing). `rootId` and `depth` are kept so that a tree is one query away, and `GET …/lineage` is that tree.  ### Brokers and MCP connectors keep the credentials out  Nothing that reaches a sandbox carries a secret. A **broker** is an API the session reaches through this server — GitHub, egress, tunnels, a model provider — with the credential held here; an **MCP connector** is an MCP server, its token or OAuth grant held here, served to the session through a broker of its own. Which ones a session gets is a field of the session.  ### One workspace  A server serves one **workspace**: its sessions, triggers, profiles, images, providers, brokers, MCP connectors, people, keys, usage and activity. What the workspace itself is comes from how the server is started, never from this API: its name and title (`--workspace`, `--workspace-title`), the runyard-sandboxes server it works on — the workspace\'s own (`--sandboxes`), reached with a key that reaches every sandbox there (`--sandboxes-key-file`, read at every start) — its owner (`--owner`) and its policy (`--policy-file`). `GET /v1/info` says them, but the key.  ### People, and what is whose  Everything is somebody\'s: every session, key, provider, profile, broker, MCP connector and trigger has an `owner`, the person who made it — for a session, whom it is for.  A person is a **member** or an **admin** of the workspace. An admin sees and changes everything in it; a member has the chat: their own sessions and those shared with them, which they read and do not steer. What a person *uses* — the provider a session runs on, the profile it starts from, its brokers and MCP connectors — is their own, or one its owner lets them use (`everyone`, `users`), admin or not. A key does no more than its owner, and a session calling through its brokers no more than its owner, over its own tree alone. Every key is made by a person: none is made for a session. What a person is missing is said in `GET /v1/self/notices`.  A person comes into the workspace by an admin\'s invitation, signing in with Google or the OpenID provider, or by being put in it by address (`PUT /v1/users/{userEmail}`), and signs in with Google, the OpenID provider or the password the password file holds for their address. The workspace\'s owner (`--owner`) is an admin of it from the start, always, and is never removed.  ### The UIs, and this reference  The chat is served at every path not under `/v1/` or `/console/`, and the console at every path under `/console/`: both route by the path (no `#`), so any page of either is an address to share or reload. This document is `GET /v1/openapi.yaml`, and rendered to read at `GET /v1/docs`.  ### What is deliberately not here  - **Tool approval prompts.** The session runs unattended inside its   sandbox; what it may reach outside it is what its brokers reach. - **A process and shell API.** The terminal is the one door into the   sandbox besides the session, and files the one way to move bytes. - **Widgets, workflows, objects, templates as UI.** Not conversations. - **Presentation state.** Pins, unread markers and drafts are the UI\'s. 
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
    type CostReport,
    CostReportFromJSON,
    CostReportToJSON,
} from '../models/CostReport.js';
import {
    type CostWindow,
    CostWindowFromJSON,
    CostWindowToJSON,
} from '../models/CostWindow.js';
import {
    type DeletedLater,
    DeletedLaterFromJSON,
    DeletedLaterToJSON,
} from '../models/DeletedLater.js';
import {
    type InfrastructureItem,
    InfrastructureItemFromJSON,
    InfrastructureItemToJSON,
} from '../models/InfrastructureItem.js';
import {
    type InfrastructureKind,
    InfrastructureKindFromJSON,
    InfrastructureKindToJSON,
} from '../models/InfrastructureKind.js';
import {
    type SessionCostReport,
    SessionCostReportFromJSON,
    SessionCostReportToJSON,
} from '../models/SessionCostReport.js';
import {
    type SessionCostWindow,
    SessionCostWindowFromJSON,
    SessionCostWindowToJSON,
} from '../models/SessionCostWindow.js';
import {
    type WorkspaceQuota,
    WorkspaceQuotaFromJSON,
    WorkspaceQuotaToJSON,
} from '../models/WorkspaceQuota.js';

export interface DeleteInfrastructureItemRequest {
    /**
     * 
     */
    kind: InfrastructureKind;
    /**
     * A sandbox's id, a volume's name, an image's id.
     */
    id: string;
}

export interface GetInfrastructureItemRequest {
    /**
     * 
     */
    kind: InfrastructureKind;
    /**
     * A sandbox's id, a volume's name, an image's id.
     */
    id: string;
    /**
     * How far back its cost goes. `30d` when it is not said.
     */
    window?: CostWindow;
}

export interface GetSessionCostsRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * How far back to go. `7d` when it is not said.
     */
    window?: SessionCostWindow;
}

export interface GetWorkspaceCostsRequest {
    /**
     * How far back to go. `7d` when it is not said.
     */
    window?: CostWindow;
}

export interface StopInfrastructureSandboxRequest {
    /**
     * 
     */
    id: string;
}

/**
 * CostsApi - interface
 * 
 * @export
 * @interface CostsApiInterface
 */
export interface CostsApiInterface {
    /**
     * Creates request options for deleteInfrastructureItem without sending the request
     * @param {InfrastructureKind} kind 
     * @param {string} id A sandbox\&#39;s id, a volume\&#39;s name, an image\&#39;s id.
     * @throws {RequiredError}
     * @memberof CostsApiInterface
     */
    deleteInfrastructureItemRequestOpts(requestParameters: DeleteInfrastructureItemRequest): Promise<runtime.RequestOpts>;

    /**
     * A sandbox is powered down and deleted, its disk kept as a volume of its own; a volume or an image is deleted. One already gone is gone.  A session\'s or one of the workspace\'s images is refused, `409`: it is let go from there, as a deleted session lets its go. So are a volume a sandbox holds and an image a sandbox boots from, as the daemon refuses them.  A sandbox or a volume on a runner that is away is deleted once that runner is back: `202`, naming the runner, and it is listed `deleting` until then. 
     * @summary Let it go, and what it costs with it
     * @param {InfrastructureKind} kind 
     * @param {string} id A sandbox\&#39;s id, a volume\&#39;s name, an image\&#39;s id.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CostsApiInterface
     */
    deleteInfrastructureItemRaw(requestParameters: DeleteInfrastructureItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeletedLater>>;

    /**
     * A sandbox is powered down and deleted, its disk kept as a volume of its own; a volume or an image is deleted. One already gone is gone.  A session\'s or one of the workspace\'s images is refused, `409`: it is let go from there, as a deleted session lets its go. So are a volume a sandbox holds and an image a sandbox boots from, as the daemon refuses them.  A sandbox or a volume on a runner that is away is deleted once that runner is back: `202`, naming the runner, and it is listed `deleting` until then. 
     * Let it go, and what it costs with it
     */
    deleteInfrastructureItem(requestParameters: DeleteInfrastructureItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeletedLater | null | undefined >;

    /**
     * Creates request options for getInfrastructureItem without sending the request
     * @param {InfrastructureKind} kind 
     * @param {string} id A sandbox\&#39;s id, a volume\&#39;s name, an image\&#39;s id.
     * @param {CostWindow} [window] How far back its cost goes. &#x60;30d&#x60; when it is not said.
     * @throws {RequiredError}
     * @memberof CostsApiInterface
     */
    getInfrastructureItemRequestOpts(requestParameters: GetInfrastructureItemRequest): Promise<runtime.RequestOpts>;

    /**
     * One sandbox, volume or image of the workspace\'s sandboxes server: what it is now, who made it, what it costs an hour and cost over the window, as the workspace\'s costs say. One no longer there is said with what it cost.  One that is a session\'s, or one of the workspace\'s own images, says so in `ownedBy`: it is managed from there. 
     * @summary One thing of the workspace\'s sandboxes server, and what it costs
     * @param {InfrastructureKind} kind 
     * @param {string} id A sandbox\&#39;s id, a volume\&#39;s name, an image\&#39;s id.
     * @param {CostWindow} [window] How far back its cost goes. &#x60;30d&#x60; when it is not said.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CostsApiInterface
     */
    getInfrastructureItemRaw(requestParameters: GetInfrastructureItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<InfrastructureItem>>;

    /**
     * One sandbox, volume or image of the workspace\'s sandboxes server: what it is now, who made it, what it costs an hour and cost over the window, as the workspace\'s costs say. One no longer there is said with what it cost.  One that is a session\'s, or one of the workspace\'s own images, says so in `ownedBy`: it is managed from there. 
     * One thing of the workspace\'s sandboxes server, and what it costs
     */
    getInfrastructureItem(requestParameters: GetInfrastructureItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<InfrastructureItem>;

    /**
     * Creates request options for getSessionCosts without sending the request
     * @param {string} sessionId 
     * @param {SessionCostWindow} [window] How far back to go. &#x60;7d&#x60; when it is not said.
     * @throws {RequiredError}
     * @memberof CostsApiInterface
     */
    getSessionCostsRequestOpts(requestParameters: GetSessionCostsRequest): Promise<runtime.RequestOpts>;

    /**
     * One session\'s cost over a window, hour by hour or day by day, in its two parts, which are priced apart and never added up across currencies:  - **infrastructure**: its sandboxes — one a wake, each still   listed once it is released — their tunnels and its disk, as   runyard-sandboxes meters them, at the rates its configuration   names and in its currency, with what each costs an hour now; - **tokens**: its calls to its models through the `llm` broker, at   the providers\' list prices, in USD.  And its **timeline**: what the session was, from when to when, over the window, by its state events — its sandbox up and generating, up and idle, released while it slept.  An admin\'s, with `sessions.read`, as the workspace\'s costs are. 
     * @summary What one session has cost, its infrastructure and its tokens
     * @param {string} sessionId 
     * @param {SessionCostWindow} [window] How far back to go. &#x60;7d&#x60; when it is not said.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CostsApiInterface
     */
    getSessionCostsRaw(requestParameters: GetSessionCostsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionCostReport>>;

    /**
     * One session\'s cost over a window, hour by hour or day by day, in its two parts, which are priced apart and never added up across currencies:  - **infrastructure**: its sandboxes — one a wake, each still   listed once it is released — their tunnels and its disk, as   runyard-sandboxes meters them, at the rates its configuration   names and in its currency, with what each costs an hour now; - **tokens**: its calls to its models through the `llm` broker, at   the providers\' list prices, in USD.  And its **timeline**: what the session was, from when to when, over the window, by its state events — its sandbox up and generating, up and idle, released while it slept.  An admin\'s, with `sessions.read`, as the workspace\'s costs are. 
     * What one session has cost, its infrastructure and its tokens
     */
    getSessionCosts(requestParameters: GetSessionCostsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionCostReport>;

    /**
     * Creates request options for getWorkspaceCosts without sending the request
     * @param {CostWindow} [window] How far back to go. &#x60;7d&#x60; when it is not said.
     * @throws {RequiredError}
     * @memberof CostsApiInterface
     */
    getWorkspaceCostsRequestOpts(requestParameters: GetWorkspaceCostsRequest): Promise<runtime.RequestOpts>;

    /**
     * What the workspace\'s sandboxes, volumes, images and tunnels used and cost over a window, hour by hour or day by day, and what each costs an hour now: its sandboxes server\'s, as runyard-sandboxes meters them every minute and keeps them, at the rates its configuration names. What is gone — a session deleted — is listed with what it cost, `live: false`.  Its sessions\' sandboxes and volumes say which session each is. An admin\'s, with `sessions.read`, as the workspace\'s usage is.  Not the sessions\' calls to their models, which are `GET /v1/usage`. 
     * @summary What the workspace\'s infrastructure has cost
     * @param {CostWindow} [window] How far back to go. &#x60;7d&#x60; when it is not said.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CostsApiInterface
     */
    getWorkspaceCostsRaw(requestParameters: GetWorkspaceCostsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CostReport>>;

    /**
     * What the workspace\'s sandboxes, volumes, images and tunnels used and cost over a window, hour by hour or day by day, and what each costs an hour now: its sandboxes server\'s, as runyard-sandboxes meters them every minute and keeps them, at the rates its configuration names. What is gone — a session deleted — is listed with what it cost, `live: false`.  Its sessions\' sandboxes and volumes say which session each is. An admin\'s, with `sessions.read`, as the workspace\'s usage is.  Not the sessions\' calls to their models, which are `GET /v1/usage`. 
     * What the workspace\'s infrastructure has cost
     */
    getWorkspaceCosts(requestParameters: GetWorkspaceCostsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CostReport>;

    /**
     * Creates request options for getWorkspaceQuota without sending the request
     * @throws {RequiredError}
     * @memberof CostsApiInterface
     */
    getWorkspaceQuotaRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * What the workspace\'s runyard-sandboxes server may commit of its host — its ceilings of vCPUs, memory and disk, each its capacity times its overcommit — and what its sandboxes and volumes hold of them now, as the server counts them (`GET /v1/host/commitments`, read with the workspace\'s own key). The server is the workspace\'s alone, so its limits are the workspace\'s quota. A session whose sandbox would take the workspace past a ceiling is refused `quota_exceeded` (its `sandbox.errorCode`), so a client can read this before starting one rather than find out after. One whose disk would take it past its disk ceiling is refused as it is started (`createSession`\'s `507`).  What is held is counted as the server admits sandboxes: vCPUs by sandboxes running, memory by those and those paused, disk by every sandbox\'s volume and every volume kept.  Read-only: the ceilings are the platform\'s and the sandboxes operator\'s to set, never the workspace\'s. Anybody with `sessions.read` may read it. 
     * @summary The workspace\'s quota, and what is held of it
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CostsApiInterface
     */
    getWorkspaceQuotaRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<WorkspaceQuota>>;

    /**
     * What the workspace\'s runyard-sandboxes server may commit of its host — its ceilings of vCPUs, memory and disk, each its capacity times its overcommit — and what its sandboxes and volumes hold of them now, as the server counts them (`GET /v1/host/commitments`, read with the workspace\'s own key). The server is the workspace\'s alone, so its limits are the workspace\'s quota. A session whose sandbox would take the workspace past a ceiling is refused `quota_exceeded` (its `sandbox.errorCode`), so a client can read this before starting one rather than find out after. One whose disk would take it past its disk ceiling is refused as it is started (`createSession`\'s `507`).  What is held is counted as the server admits sandboxes: vCPUs by sandboxes running, memory by those and those paused, disk by every sandbox\'s volume and every volume kept.  Read-only: the ceilings are the platform\'s and the sandboxes operator\'s to set, never the workspace\'s. Anybody with `sessions.read` may read it. 
     * The workspace\'s quota, and what is held of it
     */
    getWorkspaceQuota(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<WorkspaceQuota>;

    /**
     * Creates request options for stopInfrastructureSandbox without sending the request
     * @param {string} id 
     * @throws {RequiredError}
     * @memberof CostsApiInterface
     */
    stopInfrastructureSandboxRequestOpts(requestParameters: StopInfrastructureSandboxRequest): Promise<runtime.RequestOpts>;

    /**
     * Its machine is powered down, its disk kept: it costs its disk alone until it is started or deleted. A session\'s is refused, `409`, as delete refuses it. 
     * @summary Stop a sandbox, which then costs only its disk
     * @param {string} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CostsApiInterface
     */
    stopInfrastructureSandboxRaw(requestParameters: StopInfrastructureSandboxRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Its machine is powered down, its disk kept: it costs its disk alone until it is started or deleted. A session\'s is refused, `409`, as delete refuses it. 
     * Stop a sandbox, which then costs only its disk
     */
    stopInfrastructureSandbox(requestParameters: StopInfrastructureSandboxRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

}

/**
 * 
 */
export class CostsApi extends runtime.BaseAPI implements CostsApiInterface {

    /**
     * Creates request options for deleteInfrastructureItem without sending the request
     */
    async deleteInfrastructureItemRequestOpts(requestParameters: DeleteInfrastructureItemRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['kind'] == null) {
            throw new runtime.RequiredError(
                'kind',
                'Required parameter "kind" was null or undefined when calling deleteInfrastructureItem().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling deleteInfrastructureItem().'
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

        let urlPath = `/v1/infrastructure/{kind}/{id}`;
        urlPath = urlPath.replace('{kind}', encodeURIComponent(String(requestParameters['kind'])));
        urlPath = urlPath.replace('{id}', encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A sandbox is powered down and deleted, its disk kept as a volume of its own; a volume or an image is deleted. One already gone is gone.  A session\'s or one of the workspace\'s images is refused, `409`: it is let go from there, as a deleted session lets its go. So are a volume a sandbox holds and an image a sandbox boots from, as the daemon refuses them.  A sandbox or a volume on a runner that is away is deleted once that runner is back: `202`, naming the runner, and it is listed `deleting` until then. 
     * Let it go, and what it costs with it
     */
    async deleteInfrastructureItemRaw(requestParameters: DeleteInfrastructureItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeletedLater>> {
        const requestOptions = await this.deleteInfrastructureItemRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeletedLaterFromJSON(jsonValue));
    }

    /**
     * A sandbox is powered down and deleted, its disk kept as a volume of its own; a volume or an image is deleted. One already gone is gone.  A session\'s or one of the workspace\'s images is refused, `409`: it is let go from there, as a deleted session lets its go. So are a volume a sandbox holds and an image a sandbox boots from, as the daemon refuses them.  A sandbox or a volume on a runner that is away is deleted once that runner is back: `202`, naming the runner, and it is listed `deleting` until then. 
     * Let it go, and what it costs with it
     */
    async deleteInfrastructureItem(requestParameters: DeleteInfrastructureItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeletedLater | null | undefined > {
        const response = await this.deleteInfrastructureItemRaw(requestParameters, initOverrides);
        switch (response.raw.status) {
            case 204:
                return null;
            case 202:
                return await response.value();
            default:
                return await response.value();
        }
    }

    /**
     * Creates request options for getInfrastructureItem without sending the request
     */
    async getInfrastructureItemRequestOpts(requestParameters: GetInfrastructureItemRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['kind'] == null) {
            throw new runtime.RequiredError(
                'kind',
                'Required parameter "kind" was null or undefined when calling getInfrastructureItem().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling getInfrastructureItem().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['window'] != null) {
            queryParameters['window'] = requestParameters['window'];
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

        let urlPath = `/v1/infrastructure/{kind}/{id}`;
        urlPath = urlPath.replace('{kind}', encodeURIComponent(String(requestParameters['kind'])));
        urlPath = urlPath.replace('{id}', encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * One sandbox, volume or image of the workspace\'s sandboxes server: what it is now, who made it, what it costs an hour and cost over the window, as the workspace\'s costs say. One no longer there is said with what it cost.  One that is a session\'s, or one of the workspace\'s own images, says so in `ownedBy`: it is managed from there. 
     * One thing of the workspace\'s sandboxes server, and what it costs
     */
    async getInfrastructureItemRaw(requestParameters: GetInfrastructureItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<InfrastructureItem>> {
        const requestOptions = await this.getInfrastructureItemRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => InfrastructureItemFromJSON(jsonValue));
    }

    /**
     * One sandbox, volume or image of the workspace\'s sandboxes server: what it is now, who made it, what it costs an hour and cost over the window, as the workspace\'s costs say. One no longer there is said with what it cost.  One that is a session\'s, or one of the workspace\'s own images, says so in `ownedBy`: it is managed from there. 
     * One thing of the workspace\'s sandboxes server, and what it costs
     */
    async getInfrastructureItem(requestParameters: GetInfrastructureItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<InfrastructureItem> {
        const response = await this.getInfrastructureItemRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getSessionCosts without sending the request
     */
    async getSessionCostsRequestOpts(requestParameters: GetSessionCostsRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling getSessionCosts().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['window'] != null) {
            queryParameters['window'] = requestParameters['window'];
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

        let urlPath = `/v1/sessions/{sessionId}/costs`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * One session\'s cost over a window, hour by hour or day by day, in its two parts, which are priced apart and never added up across currencies:  - **infrastructure**: its sandboxes — one a wake, each still   listed once it is released — their tunnels and its disk, as   runyard-sandboxes meters them, at the rates its configuration   names and in its currency, with what each costs an hour now; - **tokens**: its calls to its models through the `llm` broker, at   the providers\' list prices, in USD.  And its **timeline**: what the session was, from when to when, over the window, by its state events — its sandbox up and generating, up and idle, released while it slept.  An admin\'s, with `sessions.read`, as the workspace\'s costs are. 
     * What one session has cost, its infrastructure and its tokens
     */
    async getSessionCostsRaw(requestParameters: GetSessionCostsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionCostReport>> {
        const requestOptions = await this.getSessionCostsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionCostReportFromJSON(jsonValue));
    }

    /**
     * One session\'s cost over a window, hour by hour or day by day, in its two parts, which are priced apart and never added up across currencies:  - **infrastructure**: its sandboxes — one a wake, each still   listed once it is released — their tunnels and its disk, as   runyard-sandboxes meters them, at the rates its configuration   names and in its currency, with what each costs an hour now; - **tokens**: its calls to its models through the `llm` broker, at   the providers\' list prices, in USD.  And its **timeline**: what the session was, from when to when, over the window, by its state events — its sandbox up and generating, up and idle, released while it slept.  An admin\'s, with `sessions.read`, as the workspace\'s costs are. 
     * What one session has cost, its infrastructure and its tokens
     */
    async getSessionCosts(requestParameters: GetSessionCostsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionCostReport> {
        const response = await this.getSessionCostsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getWorkspaceCosts without sending the request
     */
    async getWorkspaceCostsRequestOpts(requestParameters: GetWorkspaceCostsRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['window'] != null) {
            queryParameters['window'] = requestParameters['window'];
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

        let urlPath = `/v1/costs`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * What the workspace\'s sandboxes, volumes, images and tunnels used and cost over a window, hour by hour or day by day, and what each costs an hour now: its sandboxes server\'s, as runyard-sandboxes meters them every minute and keeps them, at the rates its configuration names. What is gone — a session deleted — is listed with what it cost, `live: false`.  Its sessions\' sandboxes and volumes say which session each is. An admin\'s, with `sessions.read`, as the workspace\'s usage is.  Not the sessions\' calls to their models, which are `GET /v1/usage`. 
     * What the workspace\'s infrastructure has cost
     */
    async getWorkspaceCostsRaw(requestParameters: GetWorkspaceCostsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CostReport>> {
        const requestOptions = await this.getWorkspaceCostsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CostReportFromJSON(jsonValue));
    }

    /**
     * What the workspace\'s sandboxes, volumes, images and tunnels used and cost over a window, hour by hour or day by day, and what each costs an hour now: its sandboxes server\'s, as runyard-sandboxes meters them every minute and keeps them, at the rates its configuration names. What is gone — a session deleted — is listed with what it cost, `live: false`.  Its sessions\' sandboxes and volumes say which session each is. An admin\'s, with `sessions.read`, as the workspace\'s usage is.  Not the sessions\' calls to their models, which are `GET /v1/usage`. 
     * What the workspace\'s infrastructure has cost
     */
    async getWorkspaceCosts(requestParameters: GetWorkspaceCostsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CostReport> {
        const response = await this.getWorkspaceCostsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getWorkspaceQuota without sending the request
     */
    async getWorkspaceQuotaRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/quota`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * What the workspace\'s runyard-sandboxes server may commit of its host — its ceilings of vCPUs, memory and disk, each its capacity times its overcommit — and what its sandboxes and volumes hold of them now, as the server counts them (`GET /v1/host/commitments`, read with the workspace\'s own key). The server is the workspace\'s alone, so its limits are the workspace\'s quota. A session whose sandbox would take the workspace past a ceiling is refused `quota_exceeded` (its `sandbox.errorCode`), so a client can read this before starting one rather than find out after. One whose disk would take it past its disk ceiling is refused as it is started (`createSession`\'s `507`).  What is held is counted as the server admits sandboxes: vCPUs by sandboxes running, memory by those and those paused, disk by every sandbox\'s volume and every volume kept.  Read-only: the ceilings are the platform\'s and the sandboxes operator\'s to set, never the workspace\'s. Anybody with `sessions.read` may read it. 
     * The workspace\'s quota, and what is held of it
     */
    async getWorkspaceQuotaRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<WorkspaceQuota>> {
        const requestOptions = await this.getWorkspaceQuotaRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => WorkspaceQuotaFromJSON(jsonValue));
    }

    /**
     * What the workspace\'s runyard-sandboxes server may commit of its host — its ceilings of vCPUs, memory and disk, each its capacity times its overcommit — and what its sandboxes and volumes hold of them now, as the server counts them (`GET /v1/host/commitments`, read with the workspace\'s own key). The server is the workspace\'s alone, so its limits are the workspace\'s quota. A session whose sandbox would take the workspace past a ceiling is refused `quota_exceeded` (its `sandbox.errorCode`), so a client can read this before starting one rather than find out after. One whose disk would take it past its disk ceiling is refused as it is started (`createSession`\'s `507`).  What is held is counted as the server admits sandboxes: vCPUs by sandboxes running, memory by those and those paused, disk by every sandbox\'s volume and every volume kept.  Read-only: the ceilings are the platform\'s and the sandboxes operator\'s to set, never the workspace\'s. Anybody with `sessions.read` may read it. 
     * The workspace\'s quota, and what is held of it
     */
    async getWorkspaceQuota(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<WorkspaceQuota> {
        const response = await this.getWorkspaceQuotaRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for stopInfrastructureSandbox without sending the request
     */
    async stopInfrastructureSandboxRequestOpts(requestParameters: StopInfrastructureSandboxRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling stopInfrastructureSandbox().'
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

        let urlPath = `/v1/infrastructure/sandbox/{id}/stop`;
        urlPath = urlPath.replace('{id}', encodeURIComponent(String(requestParameters['id'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Its machine is powered down, its disk kept: it costs its disk alone until it is started or deleted. A session\'s is refused, `409`, as delete refuses it. 
     * Stop a sandbox, which then costs only its disk
     */
    async stopInfrastructureSandboxRaw(requestParameters: StopInfrastructureSandboxRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.stopInfrastructureSandboxRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Its machine is powered down, its disk kept: it costs its disk alone until it is started or deleted. A session\'s is refused, `409`, as delete refuses it. 
     * Stop a sandbox, which then costs only its disk
     */
    async stopInfrastructureSandbox(requestParameters: StopInfrastructureSandboxRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.stopInfrastructureSandboxRaw(requestParameters, initOverrides);
    }

}
