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
    type AuthorizeMcpConnector200Response,
    AuthorizeMcpConnector200ResponseFromJSON,
    AuthorizeMcpConnector200ResponseToJSON,
} from '../models/AuthorizeMcpConnector200Response.js';
import {
    type AuthorizeMcpConnectorRequest,
    AuthorizeMcpConnectorRequestFromJSON,
    AuthorizeMcpConnectorRequestToJSON,
} from '../models/AuthorizeMcpConnectorRequest.js';
import {
    type McpConnector,
    McpConnectorFromJSON,
    McpConnectorToJSON,
} from '../models/McpConnector.js';
import {
    type McpConnectorPage,
    McpConnectorPageFromJSON,
    McpConnectorPageToJSON,
} from '../models/McpConnectorPage.js';
import {
    type McpConnectorSpec,
    McpConnectorSpecFromJSON,
    McpConnectorSpecToJSON,
} from '../models/McpConnectorSpec.js';
import {
    type Users,
    UsersFromJSON,
    UsersToJSON,
} from '../models/Users.js';

export interface AuthorizeMcpConnectorOperationRequest {
    /**
     * 
     */
    mcpConnectorName: string;
    /**
     * 
     */
    authorizeMcpConnectorRequest?: AuthorizeMcpConnectorRequest;
}

export interface DeleteMcpConnectorRequest {
    /**
     * 
     */
    mcpConnectorName: string;
}

export interface GetMcpConnectorRequest {
    /**
     * 
     */
    mcpConnectorName: string;
}

export interface ListMcpConnectorsRequest {
    /**
     * At most this many; the default and ceiling are in `GET /v1/info`.
     */
    limit?: number;
    /**
     * From a previous page's `nextCursor`. Opaque; one made up is `400`.
     */
    cursor?: string;
}

export interface PutMcpConnectorRequest {
    /**
     * 
     */
    mcpConnectorName: string;
    /**
     * 
     */
    mcpConnectorSpec: McpConnectorSpec;
}

export interface PutMcpConnectorUsersRequest {
    /**
     * 
     */
    mcpConnectorName: string;
    /**
     * 
     */
    users: Users;
}

/**
 * MCPConnectorsApi - interface
 * 
 * @export
 * @interface MCPConnectorsApiInterface
 */
export interface MCPConnectorsApiInterface {
    /**
     * Creates request options for authorizeMcpConnector without sending the request
     * @param {string} mcpConnectorName 
     * @param {AuthorizeMcpConnectorRequest} [authorizeMcpConnectorRequest] 
     * @throws {RequiredError}
     * @memberof MCPConnectorsApiInterface
     */
    authorizeMcpConnectorRequestOpts(requestParameters: AuthorizeMcpConnectorOperationRequest): Promise<runtime.RequestOpts>;

    /**
     * The answer is where to send the person. The MCP server\'s authorization server sends them back to `GET /v1/oauth/callback`, which keeps the tokens here and sends them on to `returnTo`. 
     * @summary Start the OAuth flow of an MCP connector
     * @param {string} mcpConnectorName 
     * @param {AuthorizeMcpConnectorRequest} [authorizeMcpConnectorRequest] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MCPConnectorsApiInterface
     */
    authorizeMcpConnectorRaw(requestParameters: AuthorizeMcpConnectorOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AuthorizeMcpConnector200Response>>;

    /**
     * The answer is where to send the person. The MCP server\'s authorization server sends them back to `GET /v1/oauth/callback`, which keeps the tokens here and sends them on to `returnTo`. 
     * Start the OAuth flow of an MCP connector
     */
    authorizeMcpConnector(requestParameters: AuthorizeMcpConnectorOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AuthorizeMcpConnector200Response>;

    /**
     * Creates request options for deleteMcpConnector without sending the request
     * @param {string} mcpConnectorName 
     * @throws {RequiredError}
     * @memberof MCPConnectorsApiInterface
     */
    deleteMcpConnectorRequestOpts(requestParameters: DeleteMcpConnectorRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary Remove an MCP connector, and forget its credential
     * @param {string} mcpConnectorName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MCPConnectorsApiInterface
     */
    deleteMcpConnectorRaw(requestParameters: DeleteMcpConnectorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Remove an MCP connector, and forget its credential
     */
    deleteMcpConnector(requestParameters: DeleteMcpConnectorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for getMcpConnector without sending the request
     * @param {string} mcpConnectorName 
     * @throws {RequiredError}
     * @memberof MCPConnectorsApiInterface
     */
    getMcpConnectorRequestOpts(requestParameters: GetMcpConnectorRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary An MCP connector, with its tools
     * @param {string} mcpConnectorName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MCPConnectorsApiInterface
     */
    getMcpConnectorRaw(requestParameters: GetMcpConnectorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<McpConnector>>;

    /**
     * An MCP connector, with its tools
     */
    getMcpConnector(requestParameters: GetMcpConnectorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<McpConnector>;

    /**
     * Creates request options for listMcpConnectors without sending the request
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @throws {RequiredError}
     * @memberof MCPConnectorsApiInterface
     */
    listMcpConnectorsRequestOpts(requestParameters: ListMcpConnectorsRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary Every MCP connector a session may be given
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MCPConnectorsApiInterface
     */
    listMcpConnectorsRaw(requestParameters: ListMcpConnectorsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<McpConnectorPage>>;

    /**
     * Every MCP connector a session may be given
     */
    listMcpConnectors(requestParameters: ListMcpConnectorsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<McpConnectorPage>;

    /**
     * Creates request options for putMcpConnector without sending the request
     * @param {string} mcpConnectorName 
     * @param {McpConnectorSpec} mcpConnectorSpec 
     * @throws {RequiredError}
     * @memberof MCPConnectorsApiInterface
     */
    putMcpConnectorRequestOpts(requestParameters: PutMcpConnectorRequest): Promise<runtime.RequestOpts>;

    /**
     * A remote MCP server (streamable HTTP), and how to authenticate to it: not at all, a static header held here, or OAuth — after which the MCP connector is `needs_authorization` until a person goes through `POST …/authorize`. Its tools are listed from it. 
     * @summary Add an MCP connector, or change it
     * @param {string} mcpConnectorName 
     * @param {McpConnectorSpec} mcpConnectorSpec 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MCPConnectorsApiInterface
     */
    putMcpConnectorRaw(requestParameters: PutMcpConnectorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<McpConnector>>;

    /**
     * A remote MCP server (streamable HTTP), and how to authenticate to it: not at all, a static header held here, or OAuth — after which the MCP connector is `needs_authorization` until a person goes through `POST …/authorize`. Its tools are listed from it. 
     * Add an MCP connector, or change it
     */
    putMcpConnector(requestParameters: PutMcpConnectorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<McpConnector>;

    /**
     * Creates request options for putMcpConnectorUsers without sending the request
     * @param {string} mcpConnectorName 
     * @param {Users} users 
     * @throws {RequiredError}
     * @memberof MCPConnectorsApiInterface
     */
    putMcpConnectorUsersRequestOpts(requestParameters: PutMcpConnectorUsersRequest): Promise<runtime.RequestOpts>;

    /**
     * Its owner\'s, or an admin\'s, to say; it replaces whom it was for. 
     * @summary Say who besides its owner may use an MCP connector: whose sessions may be given it
     * @param {string} mcpConnectorName 
     * @param {Users} users 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MCPConnectorsApiInterface
     */
    putMcpConnectorUsersRaw(requestParameters: PutMcpConnectorUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Users>>;

    /**
     * Its owner\'s, or an admin\'s, to say; it replaces whom it was for. 
     * Say who besides its owner may use an MCP connector: whose sessions may be given it
     */
    putMcpConnectorUsers(requestParameters: PutMcpConnectorUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Users>;

}

/**
 * 
 */
export class MCPConnectorsApi extends runtime.BaseAPI implements MCPConnectorsApiInterface {

    /**
     * Creates request options for authorizeMcpConnector without sending the request
     */
    async authorizeMcpConnectorRequestOpts(requestParameters: AuthorizeMcpConnectorOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['mcpConnectorName'] == null) {
            throw new runtime.RequiredError(
                'mcpConnectorName',
                'Required parameter "mcpConnectorName" was null or undefined when calling authorizeMcpConnector().'
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

        let urlPath = `/v1/mcp-connectors/{mcpConnectorName}/authorize`;
        urlPath = urlPath.replace('{mcpConnectorName}', encodeURIComponent(String(requestParameters['mcpConnectorName'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AuthorizeMcpConnectorRequestToJSON(requestParameters['authorizeMcpConnectorRequest']),
        };
    }

    /**
     * The answer is where to send the person. The MCP server\'s authorization server sends them back to `GET /v1/oauth/callback`, which keeps the tokens here and sends them on to `returnTo`. 
     * Start the OAuth flow of an MCP connector
     */
    async authorizeMcpConnectorRaw(requestParameters: AuthorizeMcpConnectorOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AuthorizeMcpConnector200Response>> {
        const requestOptions = await this.authorizeMcpConnectorRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AuthorizeMcpConnector200ResponseFromJSON(jsonValue));
    }

    /**
     * The answer is where to send the person. The MCP server\'s authorization server sends them back to `GET /v1/oauth/callback`, which keeps the tokens here and sends them on to `returnTo`. 
     * Start the OAuth flow of an MCP connector
     */
    async authorizeMcpConnector(requestParameters: AuthorizeMcpConnectorOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AuthorizeMcpConnector200Response> {
        const response = await this.authorizeMcpConnectorRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for deleteMcpConnector without sending the request
     */
    async deleteMcpConnectorRequestOpts(requestParameters: DeleteMcpConnectorRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['mcpConnectorName'] == null) {
            throw new runtime.RequiredError(
                'mcpConnectorName',
                'Required parameter "mcpConnectorName" was null or undefined when calling deleteMcpConnector().'
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

        let urlPath = `/v1/mcp-connectors/{mcpConnectorName}`;
        urlPath = urlPath.replace('{mcpConnectorName}', encodeURIComponent(String(requestParameters['mcpConnectorName'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Remove an MCP connector, and forget its credential
     */
    async deleteMcpConnectorRaw(requestParameters: DeleteMcpConnectorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteMcpConnectorRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Remove an MCP connector, and forget its credential
     */
    async deleteMcpConnector(requestParameters: DeleteMcpConnectorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteMcpConnectorRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for getMcpConnector without sending the request
     */
    async getMcpConnectorRequestOpts(requestParameters: GetMcpConnectorRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['mcpConnectorName'] == null) {
            throw new runtime.RequiredError(
                'mcpConnectorName',
                'Required parameter "mcpConnectorName" was null or undefined when calling getMcpConnector().'
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

        let urlPath = `/v1/mcp-connectors/{mcpConnectorName}`;
        urlPath = urlPath.replace('{mcpConnectorName}', encodeURIComponent(String(requestParameters['mcpConnectorName'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * An MCP connector, with its tools
     */
    async getMcpConnectorRaw(requestParameters: GetMcpConnectorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<McpConnector>> {
        const requestOptions = await this.getMcpConnectorRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => McpConnectorFromJSON(jsonValue));
    }

    /**
     * An MCP connector, with its tools
     */
    async getMcpConnector(requestParameters: GetMcpConnectorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<McpConnector> {
        const response = await this.getMcpConnectorRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listMcpConnectors without sending the request
     */
    async listMcpConnectorsRequestOpts(requestParameters: ListMcpConnectorsRequest): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/mcp-connectors`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every MCP connector a session may be given
     */
    async listMcpConnectorsRaw(requestParameters: ListMcpConnectorsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<McpConnectorPage>> {
        const requestOptions = await this.listMcpConnectorsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => McpConnectorPageFromJSON(jsonValue));
    }

    /**
     * Every MCP connector a session may be given
     */
    async listMcpConnectors(requestParameters: ListMcpConnectorsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<McpConnectorPage> {
        const response = await this.listMcpConnectorsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for putMcpConnector without sending the request
     */
    async putMcpConnectorRequestOpts(requestParameters: PutMcpConnectorRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['mcpConnectorName'] == null) {
            throw new runtime.RequiredError(
                'mcpConnectorName',
                'Required parameter "mcpConnectorName" was null or undefined when calling putMcpConnector().'
            );
        }

        if (requestParameters['mcpConnectorSpec'] == null) {
            throw new runtime.RequiredError(
                'mcpConnectorSpec',
                'Required parameter "mcpConnectorSpec" was null or undefined when calling putMcpConnector().'
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

        let urlPath = `/v1/mcp-connectors/{mcpConnectorName}`;
        urlPath = urlPath.replace('{mcpConnectorName}', encodeURIComponent(String(requestParameters['mcpConnectorName'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: McpConnectorSpecToJSON(requestParameters['mcpConnectorSpec']),
        };
    }

    /**
     * A remote MCP server (streamable HTTP), and how to authenticate to it: not at all, a static header held here, or OAuth — after which the MCP connector is `needs_authorization` until a person goes through `POST …/authorize`. Its tools are listed from it. 
     * Add an MCP connector, or change it
     */
    async putMcpConnectorRaw(requestParameters: PutMcpConnectorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<McpConnector>> {
        const requestOptions = await this.putMcpConnectorRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => McpConnectorFromJSON(jsonValue));
    }

    /**
     * A remote MCP server (streamable HTTP), and how to authenticate to it: not at all, a static header held here, or OAuth — after which the MCP connector is `needs_authorization` until a person goes through `POST …/authorize`. Its tools are listed from it. 
     * Add an MCP connector, or change it
     */
    async putMcpConnector(requestParameters: PutMcpConnectorRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<McpConnector> {
        const response = await this.putMcpConnectorRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for putMcpConnectorUsers without sending the request
     */
    async putMcpConnectorUsersRequestOpts(requestParameters: PutMcpConnectorUsersRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['mcpConnectorName'] == null) {
            throw new runtime.RequiredError(
                'mcpConnectorName',
                'Required parameter "mcpConnectorName" was null or undefined when calling putMcpConnectorUsers().'
            );
        }

        if (requestParameters['users'] == null) {
            throw new runtime.RequiredError(
                'users',
                'Required parameter "users" was null or undefined when calling putMcpConnectorUsers().'
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

        let urlPath = `/v1/mcp-connectors/{mcpConnectorName}/users`;
        urlPath = urlPath.replace('{mcpConnectorName}', encodeURIComponent(String(requestParameters['mcpConnectorName'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: UsersToJSON(requestParameters['users']),
        };
    }

    /**
     * Its owner\'s, or an admin\'s, to say; it replaces whom it was for. 
     * Say who besides its owner may use an MCP connector: whose sessions may be given it
     */
    async putMcpConnectorUsersRaw(requestParameters: PutMcpConnectorUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Users>> {
        const requestOptions = await this.putMcpConnectorUsersRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UsersFromJSON(jsonValue));
    }

    /**
     * Its owner\'s, or an admin\'s, to say; it replaces whom it was for. 
     * Say who besides its owner may use an MCP connector: whose sessions may be given it
     */
    async putMcpConnectorUsers(requestParameters: PutMcpConnectorUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Users> {
        const response = await this.putMcpConnectorUsersRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
