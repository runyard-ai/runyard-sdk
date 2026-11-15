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
    type FileEntry,
    FileEntryFromJSON,
    FileEntryToJSON,
} from '../models/FileEntry.js';
import {
    type ListEgressRules200Response,
    ListEgressRules200ResponseFromJSON,
    ListEgressRules200ResponseToJSON,
} from '../models/ListEgressRules200Response.js';
import {
    type ListFiles200Response,
    ListFiles200ResponseFromJSON,
    ListFiles200ResponseToJSON,
} from '../models/ListFiles200Response.js';
import {
    type ListTunnels200Response,
    ListTunnels200ResponseFromJSON,
    ListTunnels200ResponseToJSON,
} from '../models/ListTunnels200Response.js';
import {
    type SandboxProcessTable,
    SandboxProcessTableFromJSON,
    SandboxProcessTableToJSON,
} from '../models/SandboxProcessTable.js';
import {
    type SandboxUsage,
    SandboxUsageFromJSON,
    SandboxUsageToJSON,
} from '../models/SandboxUsage.js';
import {
    type SandboxUsageHistory,
    SandboxUsageHistoryFromJSON,
    SandboxUsageHistoryToJSON,
} from '../models/SandboxUsageHistory.js';
import {
    type UsageWindow,
    UsageWindowFromJSON,
    UsageWindowToJSON,
} from '../models/UsageWindow.js';

export interface DeleteFileRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * Absolute, or relative to the session's working directory. Never outside the session's disk.
     */
    path: string;
}

export interface DropEgressRuleRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * The rule's `name`.
     */
    ruleName: string;
}

export interface GetSandboxUsageRequest {
    /**
     * 
     */
    sessionId: string;
}

export interface GetSandboxUsageHistoryRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * How far back to go. Absent is `1h`.
     */
    window?: UsageWindow;
}

export interface ListEgressRulesRequest {
    /**
     * 
     */
    sessionId: string;
}

export interface ListFilesRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * Absolute, or relative to the session's working directory. Never outside the session's disk.
     */
    path: string;
}

export interface ListSandboxProcessesRequest {
    /**
     * 
     */
    sessionId: string;
}

export interface ListTunnelsRequest {
    /**
     * 
     */
    sessionId: string;
}

export interface ReadFileRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * Absolute, or relative to the session's working directory. Never outside the session's disk.
     */
    path: string;
}

export interface WriteFileRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * Absolute, or relative to the session's working directory. Never outside the session's disk.
     */
    path: string;
    /**
     * 
     */
    body: Blob;
}

/**
 * SandboxApi - interface
 * 
 * @export
 * @interface SandboxApiInterface
 */
export interface SandboxApiInterface {
    /**
     * Creates request options for deleteFile without sending the request
     * @param {string} sessionId 
     * @param {string} path Absolute, or relative to the session\&#39;s working directory. Never outside the session\&#39;s disk.
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    deleteFileRequestOpts(requestParameters: DeleteFileRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary Delete a file, or an empty directory
     * @param {string} sessionId 
     * @param {string} path Absolute, or relative to the session\&#39;s working directory. Never outside the session\&#39;s disk.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    deleteFileRaw(requestParameters: DeleteFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Delete a file, or an empty directory
     */
    deleteFile(requestParameters: DeleteFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for dropEgressRule without sending the request
     * @param {string} sessionId 
     * @param {string} ruleName The rule\&#39;s &#x60;name&#x60;.
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    dropEgressRuleRequestOpts(requestParameters: DropEgressRuleRequest): Promise<runtime.RequestOpts>;

    /**
     * What it opened is closed for the sandbox from the next connection. A rule from the session\'s config comes back with its next sandbox; one the session opened comes back only if it opens it again. 
     * @summary Take a rule off the session\'s sandbox, at once
     * @param {string} sessionId 
     * @param {string} ruleName The rule\&#39;s &#x60;name&#x60;.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    dropEgressRuleRaw(requestParameters: DropEgressRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * What it opened is closed for the sandbox from the next connection. A rule from the session\'s config comes back with its next sandbox; one the session opened comes back only if it opens it again. 
     * Take a rule off the session\'s sandbox, at once
     */
    dropEgressRule(requestParameters: DropEgressRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for getSandboxUsage without sending the request
     * @param {string} sessionId 
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    getSandboxUsageRequestOpts(requestParameters: GetSandboxUsageRequest): Promise<runtime.RequestOpts>;

    /**
     * As runyard-sandboxes last measured it, from the host: what its machine is using of the `resources` it was given. A session without a machine — asleep, or not yet woken — is `409`. 
     * @summary What the session\'s machine is using now
     * @param {string} sessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    getSandboxUsageRaw(requestParameters: GetSandboxUsageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SandboxUsage>>;

    /**
     * As runyard-sandboxes last measured it, from the host: what its machine is using of the `resources` it was given. A session without a machine — asleep, or not yet woken — is `409`. 
     * What the session\'s machine is using now
     */
    getSandboxUsage(requestParameters: GetSandboxUsageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SandboxUsage>;

    /**
     * Creates request options for getSandboxUsageHistory without sending the request
     * @param {string} sessionId 
     * @param {UsageWindow} [window] How far back to go. Absent is &#x60;1h&#x60;.
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    getSandboxUsageHistoryRequestOpts(requestParameters: GetSandboxUsageHistoryRequest): Promise<runtime.RequestOpts>;

    /**
     * The readings behind `GET .../sandbox/usage`, over time, as runyard-sandboxes keeps them for the machine the session runs in now, beside the size that machine was given. A machine made by an earlier wake is gone with its readings, so the history starts at the last wake. A session without a machine is `409`. 
     * @summary What the session\'s machine has been using, and what it was given
     * @param {string} sessionId 
     * @param {UsageWindow} [window] How far back to go. Absent is &#x60;1h&#x60;.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    getSandboxUsageHistoryRaw(requestParameters: GetSandboxUsageHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SandboxUsageHistory>>;

    /**
     * The readings behind `GET .../sandbox/usage`, over time, as runyard-sandboxes keeps them for the machine the session runs in now, beside the size that machine was given. A machine made by an earlier wake is gone with its readings, so the history starts at the last wake. A session without a machine is `409`. 
     * What the session\'s machine has been using, and what it was given
     */
    getSandboxUsageHistory(requestParameters: GetSandboxUsageHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SandboxUsageHistory>;

    /**
     * Creates request options for listEgressRules without sending the request
     * @param {string} sessionId 
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    listEgressRulesRequestOpts(requestParameters: ListEgressRulesRequest): Promise<runtime.RequestOpts>;

    /**
     * The egress rules of the sandbox the session runs in now: those its session\'s config gave it, and the hosts its harness opened since it woke (through the egress broker). A sleeping session has no sandbox, so no rules: a `409`. 
     * @summary What the session\'s sandbox may reach
     * @param {string} sessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    listEgressRulesRaw(requestParameters: ListEgressRulesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListEgressRules200Response>>;

    /**
     * The egress rules of the sandbox the session runs in now: those its session\'s config gave it, and the hosts its harness opened since it woke (through the egress broker). A sleeping session has no sandbox, so no rules: a `409`. 
     * What the session\'s sandbox may reach
     */
    listEgressRules(requestParameters: ListEgressRulesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListEgressRules200Response>;

    /**
     * Creates request options for listFiles without sending the request
     * @param {string} sessionId 
     * @param {string} path Absolute, or relative to the session\&#39;s working directory. Never outside the session\&#39;s disk.
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    listFilesRequestOpts(requestParameters: ListFilesRequest): Promise<runtime.RequestOpts>;

    /**
     * Read through its machine, so a sleeping session is `409`; wake it first.
     * @summary A directory of the session\'s disk
     * @param {string} sessionId 
     * @param {string} path Absolute, or relative to the session\&#39;s working directory. Never outside the session\&#39;s disk.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    listFilesRaw(requestParameters: ListFilesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListFiles200Response>>;

    /**
     * Read through its machine, so a sleeping session is `409`; wake it first.
     * A directory of the session\'s disk
     */
    listFiles(requestParameters: ListFilesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListFiles200Response>;

    /**
     * Creates request options for listSandboxProcesses without sending the request
     * @param {string} sessionId 
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    listSandboxProcessesRequestOpts(requestParameters: ListSandboxProcessesRequest): Promise<runtime.RequestOpts>;

    /**
     * Every process in its machine, kernel threads included and marked, in pid order, as runyard-sandboxes reads them from the guest\'s `/proc`. It is the guest\'s own account: whatever runs as root in the machine can make it say anything, so it is shown and nothing is decided from it. CPU is measured over a short window inside the request, so this takes a moment to answer. A session without a machine is `409`. 
     * @summary What is running in the session\'s machine
     * @param {string} sessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    listSandboxProcessesRaw(requestParameters: ListSandboxProcessesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SandboxProcessTable>>;

    /**
     * Every process in its machine, kernel threads included and marked, in pid order, as runyard-sandboxes reads them from the guest\'s `/proc`. It is the guest\'s own account: whatever runs as root in the machine can make it say anything, so it is shown and nothing is decided from it. CPU is measured over a short window inside the request, so this takes a moment to answer. A session without a machine is `409`. 
     * What is running in the session\'s machine
     */
    listSandboxProcesses(requestParameters: ListSandboxProcessesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SandboxProcessTable>;

    /**
     * Creates request options for listTunnels without sending the request
     * @param {string} sessionId 
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    listTunnelsRequestOpts(requestParameters: ListTunnelsRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary The ports the session published, and their addresses
     * @param {string} sessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    listTunnelsRaw(requestParameters: ListTunnelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListTunnels200Response>>;

    /**
     * The ports the session published, and their addresses
     */
    listTunnels(requestParameters: ListTunnelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListTunnels200Response>;

    /**
     * Creates request options for readFile without sending the request
     * @param {string} sessionId 
     * @param {string} path Absolute, or relative to the session\&#39;s working directory. Never outside the session\&#39;s disk.
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    readFileRequestOpts(requestParameters: ReadFileRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary A file\'s bytes
     * @param {string} sessionId 
     * @param {string} path Absolute, or relative to the session\&#39;s working directory. Never outside the session\&#39;s disk.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    readFileRaw(requestParameters: ReadFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<runtime.HttpFile>>;

    /**
     * A file\'s bytes
     */
    readFile(requestParameters: ReadFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.HttpFile>;

    /**
     * Creates request options for writeFile without sending the request
     * @param {string} sessionId 
     * @param {string} path Absolute, or relative to the session\&#39;s working directory. Never outside the session\&#39;s disk.
     * @param {Blob} body 
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    writeFileRequestOpts(requestParameters: WriteFileRequest): Promise<runtime.RequestOpts>;

    /**
     * How an attachment gets to the session — written here, then named in a turn.
     * @summary Write a file, making its directories
     * @param {string} sessionId 
     * @param {string} path Absolute, or relative to the session\&#39;s working directory. Never outside the session\&#39;s disk.
     * @param {Blob} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SandboxApiInterface
     */
    writeFileRaw(requestParameters: WriteFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FileEntry>>;

    /**
     * How an attachment gets to the session — written here, then named in a turn.
     * Write a file, making its directories
     */
    writeFile(requestParameters: WriteFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FileEntry>;

}

/**
 * 
 */
export class SandboxApi extends runtime.BaseAPI implements SandboxApiInterface {

    /**
     * Creates request options for deleteFile without sending the request
     */
    async deleteFileRequestOpts(requestParameters: DeleteFileRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling deleteFile().'
            );
        }

        if (requestParameters['path'] == null) {
            throw new runtime.RequiredError(
                'path',
                'Required parameter "path" was null or undefined when calling deleteFile().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['path'] != null) {
            queryParameters['path'] = requestParameters['path'];
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

        let urlPath = `/v1/sessions/{sessionId}/files/content`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Delete a file, or an empty directory
     */
    async deleteFileRaw(requestParameters: DeleteFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteFileRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a file, or an empty directory
     */
    async deleteFile(requestParameters: DeleteFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteFileRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for dropEgressRule without sending the request
     */
    async dropEgressRuleRequestOpts(requestParameters: DropEgressRuleRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling dropEgressRule().'
            );
        }

        if (requestParameters['ruleName'] == null) {
            throw new runtime.RequiredError(
                'ruleName',
                'Required parameter "ruleName" was null or undefined when calling dropEgressRule().'
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

        let urlPath = `/v1/sessions/{sessionId}/egress/{ruleName}`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));
        urlPath = urlPath.replace('{ruleName}', encodeURIComponent(String(requestParameters['ruleName'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * What it opened is closed for the sandbox from the next connection. A rule from the session\'s config comes back with its next sandbox; one the session opened comes back only if it opens it again. 
     * Take a rule off the session\'s sandbox, at once
     */
    async dropEgressRuleRaw(requestParameters: DropEgressRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.dropEgressRuleRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * What it opened is closed for the sandbox from the next connection. A rule from the session\'s config comes back with its next sandbox; one the session opened comes back only if it opens it again. 
     * Take a rule off the session\'s sandbox, at once
     */
    async dropEgressRule(requestParameters: DropEgressRuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.dropEgressRuleRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for getSandboxUsage without sending the request
     */
    async getSandboxUsageRequestOpts(requestParameters: GetSandboxUsageRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling getSandboxUsage().'
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

        let urlPath = `/v1/sessions/{sessionId}/sandbox/usage`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * As runyard-sandboxes last measured it, from the host: what its machine is using of the `resources` it was given. A session without a machine — asleep, or not yet woken — is `409`. 
     * What the session\'s machine is using now
     */
    async getSandboxUsageRaw(requestParameters: GetSandboxUsageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SandboxUsage>> {
        const requestOptions = await this.getSandboxUsageRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SandboxUsageFromJSON(jsonValue));
    }

    /**
     * As runyard-sandboxes last measured it, from the host: what its machine is using of the `resources` it was given. A session without a machine — asleep, or not yet woken — is `409`. 
     * What the session\'s machine is using now
     */
    async getSandboxUsage(requestParameters: GetSandboxUsageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SandboxUsage> {
        const response = await this.getSandboxUsageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getSandboxUsageHistory without sending the request
     */
    async getSandboxUsageHistoryRequestOpts(requestParameters: GetSandboxUsageHistoryRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling getSandboxUsageHistory().'
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

        let urlPath = `/v1/sessions/{sessionId}/sandbox/usage/history`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The readings behind `GET .../sandbox/usage`, over time, as runyard-sandboxes keeps them for the machine the session runs in now, beside the size that machine was given. A machine made by an earlier wake is gone with its readings, so the history starts at the last wake. A session without a machine is `409`. 
     * What the session\'s machine has been using, and what it was given
     */
    async getSandboxUsageHistoryRaw(requestParameters: GetSandboxUsageHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SandboxUsageHistory>> {
        const requestOptions = await this.getSandboxUsageHistoryRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SandboxUsageHistoryFromJSON(jsonValue));
    }

    /**
     * The readings behind `GET .../sandbox/usage`, over time, as runyard-sandboxes keeps them for the machine the session runs in now, beside the size that machine was given. A machine made by an earlier wake is gone with its readings, so the history starts at the last wake. A session without a machine is `409`. 
     * What the session\'s machine has been using, and what it was given
     */
    async getSandboxUsageHistory(requestParameters: GetSandboxUsageHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SandboxUsageHistory> {
        const response = await this.getSandboxUsageHistoryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listEgressRules without sending the request
     */
    async listEgressRulesRequestOpts(requestParameters: ListEgressRulesRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling listEgressRules().'
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

        let urlPath = `/v1/sessions/{sessionId}/egress`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The egress rules of the sandbox the session runs in now: those its session\'s config gave it, and the hosts its harness opened since it woke (through the egress broker). A sleeping session has no sandbox, so no rules: a `409`. 
     * What the session\'s sandbox may reach
     */
    async listEgressRulesRaw(requestParameters: ListEgressRulesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListEgressRules200Response>> {
        const requestOptions = await this.listEgressRulesRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListEgressRules200ResponseFromJSON(jsonValue));
    }

    /**
     * The egress rules of the sandbox the session runs in now: those its session\'s config gave it, and the hosts its harness opened since it woke (through the egress broker). A sleeping session has no sandbox, so no rules: a `409`. 
     * What the session\'s sandbox may reach
     */
    async listEgressRules(requestParameters: ListEgressRulesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListEgressRules200Response> {
        const response = await this.listEgressRulesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listFiles without sending the request
     */
    async listFilesRequestOpts(requestParameters: ListFilesRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling listFiles().'
            );
        }

        if (requestParameters['path'] == null) {
            throw new runtime.RequiredError(
                'path',
                'Required parameter "path" was null or undefined when calling listFiles().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['path'] != null) {
            queryParameters['path'] = requestParameters['path'];
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

        let urlPath = `/v1/sessions/{sessionId}/files`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Read through its machine, so a sleeping session is `409`; wake it first.
     * A directory of the session\'s disk
     */
    async listFilesRaw(requestParameters: ListFilesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListFiles200Response>> {
        const requestOptions = await this.listFilesRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListFiles200ResponseFromJSON(jsonValue));
    }

    /**
     * Read through its machine, so a sleeping session is `409`; wake it first.
     * A directory of the session\'s disk
     */
    async listFiles(requestParameters: ListFilesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListFiles200Response> {
        const response = await this.listFilesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listSandboxProcesses without sending the request
     */
    async listSandboxProcessesRequestOpts(requestParameters: ListSandboxProcessesRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling listSandboxProcesses().'
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

        let urlPath = `/v1/sessions/{sessionId}/sandbox/processes`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every process in its machine, kernel threads included and marked, in pid order, as runyard-sandboxes reads them from the guest\'s `/proc`. It is the guest\'s own account: whatever runs as root in the machine can make it say anything, so it is shown and nothing is decided from it. CPU is measured over a short window inside the request, so this takes a moment to answer. A session without a machine is `409`. 
     * What is running in the session\'s machine
     */
    async listSandboxProcessesRaw(requestParameters: ListSandboxProcessesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SandboxProcessTable>> {
        const requestOptions = await this.listSandboxProcessesRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SandboxProcessTableFromJSON(jsonValue));
    }

    /**
     * Every process in its machine, kernel threads included and marked, in pid order, as runyard-sandboxes reads them from the guest\'s `/proc`. It is the guest\'s own account: whatever runs as root in the machine can make it say anything, so it is shown and nothing is decided from it. CPU is measured over a short window inside the request, so this takes a moment to answer. A session without a machine is `409`. 
     * What is running in the session\'s machine
     */
    async listSandboxProcesses(requestParameters: ListSandboxProcessesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SandboxProcessTable> {
        const response = await this.listSandboxProcessesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listTunnels without sending the request
     */
    async listTunnelsRequestOpts(requestParameters: ListTunnelsRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling listTunnels().'
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

        let urlPath = `/v1/sessions/{sessionId}/tunnels`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The ports the session published, and their addresses
     */
    async listTunnelsRaw(requestParameters: ListTunnelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListTunnels200Response>> {
        const requestOptions = await this.listTunnelsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListTunnels200ResponseFromJSON(jsonValue));
    }

    /**
     * The ports the session published, and their addresses
     */
    async listTunnels(requestParameters: ListTunnelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListTunnels200Response> {
        const response = await this.listTunnelsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readFile without sending the request
     */
    async readFileRequestOpts(requestParameters: ReadFileRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling readFile().'
            );
        }

        if (requestParameters['path'] == null) {
            throw new runtime.RequiredError(
                'path',
                'Required parameter "path" was null or undefined when calling readFile().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['path'] != null) {
            queryParameters['path'] = requestParameters['path'];
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

        let urlPath = `/v1/sessions/{sessionId}/files/content`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A file\'s bytes
     */
    async readFileRaw(requestParameters: ReadFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<runtime.HttpFile>> {
        const requestOptions = await this.readFileRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.BlobApiResponse(response);
    }

    /**
     * A file\'s bytes
     */
    async readFile(requestParameters: ReadFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.HttpFile> {
        const response = await this.readFileRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for writeFile without sending the request
     */
    async writeFileRequestOpts(requestParameters: WriteFileRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling writeFile().'
            );
        }

        if (requestParameters['path'] == null) {
            throw new runtime.RequiredError(
                'path',
                'Required parameter "path" was null or undefined when calling writeFile().'
            );
        }

        if (requestParameters['body'] == null) {
            throw new runtime.RequiredError(
                'body',
                'Required parameter "body" was null or undefined when calling writeFile().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['path'] != null) {
            queryParameters['path'] = requestParameters['path'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/octet-stream';

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

        let urlPath = `/v1/sessions/{sessionId}/files/content`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['body'] as any,
        };
    }

    /**
     * How an attachment gets to the session — written here, then named in a turn.
     * Write a file, making its directories
     */
    async writeFileRaw(requestParameters: WriteFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FileEntry>> {
        const requestOptions = await this.writeFileRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FileEntryFromJSON(jsonValue));
    }

    /**
     * How an attachment gets to the session — written here, then named in a turn.
     * Write a file, making its directories
     */
    async writeFile(requestParameters: WriteFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FileEntry> {
        const response = await this.writeFileRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
