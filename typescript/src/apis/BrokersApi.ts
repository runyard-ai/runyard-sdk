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
    type Broker,
    BrokerFromJSON,
    BrokerToJSON,
} from '../models/Broker.js';
import {
    type BrokerPage,
    BrokerPageFromJSON,
    BrokerPageToJSON,
} from '../models/BrokerPage.js';
import {
    type BrokerSpec,
    BrokerSpecFromJSON,
    BrokerSpecToJSON,
} from '../models/BrokerSpec.js';
import {
    type Users,
    UsersFromJSON,
    UsersToJSON,
} from '../models/Users.js';

export interface DeleteBrokerRequest {
    /**
     * 
     */
    brokerName: string;
}

export interface GetBrokerRequest {
    /**
     * 
     */
    brokerName: string;
}

export interface ListBrokersRequest {
    /**
     * At most this many; the default and ceiling are in `GET /v1/info`.
     */
    limit?: number;
    /**
     * From a previous page's `nextCursor`. Opaque; one made up is `400`.
     */
    cursor?: string;
}

export interface PutBrokerRequest {
    /**
     * 
     */
    brokerName: string;
    /**
     * 
     */
    brokerSpec: BrokerSpec;
}

export interface PutBrokerUsersRequest {
    /**
     * 
     */
    brokerName: string;
    /**
     * 
     */
    users: Users;
}

/**
 * BrokersApi - interface
 * 
 * @export
 * @interface BrokersApiInterface
 */
export interface BrokersApiInterface {
    /**
     * Creates request options for deleteBroker without sending the request
     * @param {string} brokerName 
     * @throws {RequiredError}
     * @memberof BrokersApiInterface
     */
    deleteBrokerRequestOpts(requestParameters: DeleteBrokerRequest): Promise<runtime.RequestOpts>;

    /**
     * Sessions given it lose it at their next turn. The server\'s own are `409 in_use`.
     * @summary Remove a broker
     * @param {string} brokerName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BrokersApiInterface
     */
    deleteBrokerRaw(requestParameters: DeleteBrokerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Sessions given it lose it at their next turn. The server\'s own are `409 in_use`.
     * Remove a broker
     */
    deleteBroker(requestParameters: DeleteBrokerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for getBroker without sending the request
     * @param {string} brokerName 
     * @throws {RequiredError}
     * @memberof BrokersApiInterface
     */
    getBrokerRequestOpts(requestParameters: GetBrokerRequest): Promise<runtime.RequestOpts>;

    /**
     * A built-in broker the workspace\'s policy does not allow is `404`.
     * @summary A broker
     * @param {string} brokerName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BrokersApiInterface
     */
    getBrokerRaw(requestParameters: GetBrokerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Broker>>;

    /**
     * A built-in broker the workspace\'s policy does not allow is `404`.
     * A broker
     */
    getBroker(requestParameters: GetBrokerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Broker>;

    /**
     * Creates request options for listBrokers without sending the request
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @throws {RequiredError}
     * @memberof BrokersApiInterface
     */
    listBrokersRequestOpts(requestParameters: ListBrokersRequest): Promise<runtime.RequestOpts>;

    /**
     * The server\'s own brokers the workspace\'s policy allows — every one when it has none — and the declared ones, by name. A built-in its policy does not list is not listed, and is `404` to get. 
     * @summary Every broker a session may be given
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BrokersApiInterface
     */
    listBrokersRaw(requestParameters: ListBrokersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BrokerPage>>;

    /**
     * The server\'s own brokers the workspace\'s policy allows — every one when it has none — and the declared ones, by name. A built-in its policy does not list is not listed, and is `404` to get. 
     * Every broker a session may be given
     */
    listBrokers(requestParameters: ListBrokersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BrokerPage>;

    /**
     * Creates request options for putBroker without sending the request
     * @param {string} brokerName 
     * @param {BrokerSpec} brokerSpec 
     * @throws {RequiredError}
     * @memberof BrokersApiInterface
     */
    putBrokerRequestOpts(requestParameters: PutBrokerRequest): Promise<runtime.RequestOpts>;

    /**
     * `llm`, `egress`, `tunnels`, `sessions` and `images` are the server\'s own: they always exist and are not changed here (`409 in_use`). Any other is a `shared` broker: one the sandboxes daemon declares under the same name, and dials with the machine\'s certificate. A session\'s machine is given it, and the broker says the rest itself: what the session\'s environment and git are given to reach it, and the MCP server it serves, at `/.well-known/runyard-broker`, and its skills, at `/.well-known/agent-skills`. Its credentials, and what it lets through, are the broker\'s. 
     * @summary Declare a broker, or change it
     * @param {string} brokerName 
     * @param {BrokerSpec} brokerSpec 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BrokersApiInterface
     */
    putBrokerRaw(requestParameters: PutBrokerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Broker>>;

    /**
     * `llm`, `egress`, `tunnels`, `sessions` and `images` are the server\'s own: they always exist and are not changed here (`409 in_use`). Any other is a `shared` broker: one the sandboxes daemon declares under the same name, and dials with the machine\'s certificate. A session\'s machine is given it, and the broker says the rest itself: what the session\'s environment and git are given to reach it, and the MCP server it serves, at `/.well-known/runyard-broker`, and its skills, at `/.well-known/agent-skills`. Its credentials, and what it lets through, are the broker\'s. 
     * Declare a broker, or change it
     */
    putBroker(requestParameters: PutBrokerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Broker>;

    /**
     * Creates request options for putBrokerUsers without sending the request
     * @param {string} brokerName 
     * @param {Users} users 
     * @throws {RequiredError}
     * @memberof BrokersApiInterface
     */
    putBrokerUsersRequestOpts(requestParameters: PutBrokerUsersRequest): Promise<runtime.RequestOpts>;

    /**
     * Its owner\'s, or an admin\'s, to say; it replaces whom it was for. 
     * @summary Say who besides its owner may use a broker: whose sessions may be given it
     * @param {string} brokerName 
     * @param {Users} users 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BrokersApiInterface
     */
    putBrokerUsersRaw(requestParameters: PutBrokerUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Users>>;

    /**
     * Its owner\'s, or an admin\'s, to say; it replaces whom it was for. 
     * Say who besides its owner may use a broker: whose sessions may be given it
     */
    putBrokerUsers(requestParameters: PutBrokerUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Users>;

}

/**
 * 
 */
export class BrokersApi extends runtime.BaseAPI implements BrokersApiInterface {

    /**
     * Creates request options for deleteBroker without sending the request
     */
    async deleteBrokerRequestOpts(requestParameters: DeleteBrokerRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['brokerName'] == null) {
            throw new runtime.RequiredError(
                'brokerName',
                'Required parameter "brokerName" was null or undefined when calling deleteBroker().'
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

        let urlPath = `/v1/brokers/{brokerName}`;
        urlPath = urlPath.replace('{brokerName}', encodeURIComponent(String(requestParameters['brokerName'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Sessions given it lose it at their next turn. The server\'s own are `409 in_use`.
     * Remove a broker
     */
    async deleteBrokerRaw(requestParameters: DeleteBrokerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteBrokerRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Sessions given it lose it at their next turn. The server\'s own are `409 in_use`.
     * Remove a broker
     */
    async deleteBroker(requestParameters: DeleteBrokerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteBrokerRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for getBroker without sending the request
     */
    async getBrokerRequestOpts(requestParameters: GetBrokerRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['brokerName'] == null) {
            throw new runtime.RequiredError(
                'brokerName',
                'Required parameter "brokerName" was null or undefined when calling getBroker().'
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

        let urlPath = `/v1/brokers/{brokerName}`;
        urlPath = urlPath.replace('{brokerName}', encodeURIComponent(String(requestParameters['brokerName'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A built-in broker the workspace\'s policy does not allow is `404`.
     * A broker
     */
    async getBrokerRaw(requestParameters: GetBrokerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Broker>> {
        const requestOptions = await this.getBrokerRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BrokerFromJSON(jsonValue));
    }

    /**
     * A built-in broker the workspace\'s policy does not allow is `404`.
     * A broker
     */
    async getBroker(requestParameters: GetBrokerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Broker> {
        const response = await this.getBrokerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listBrokers without sending the request
     */
    async listBrokersRequestOpts(requestParameters: ListBrokersRequest): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/brokers`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The server\'s own brokers the workspace\'s policy allows — every one when it has none — and the declared ones, by name. A built-in its policy does not list is not listed, and is `404` to get. 
     * Every broker a session may be given
     */
    async listBrokersRaw(requestParameters: ListBrokersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BrokerPage>> {
        const requestOptions = await this.listBrokersRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BrokerPageFromJSON(jsonValue));
    }

    /**
     * The server\'s own brokers the workspace\'s policy allows — every one when it has none — and the declared ones, by name. A built-in its policy does not list is not listed, and is `404` to get. 
     * Every broker a session may be given
     */
    async listBrokers(requestParameters: ListBrokersRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BrokerPage> {
        const response = await this.listBrokersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for putBroker without sending the request
     */
    async putBrokerRequestOpts(requestParameters: PutBrokerRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['brokerName'] == null) {
            throw new runtime.RequiredError(
                'brokerName',
                'Required parameter "brokerName" was null or undefined when calling putBroker().'
            );
        }

        if (requestParameters['brokerSpec'] == null) {
            throw new runtime.RequiredError(
                'brokerSpec',
                'Required parameter "brokerSpec" was null or undefined when calling putBroker().'
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

        let urlPath = `/v1/brokers/{brokerName}`;
        urlPath = urlPath.replace('{brokerName}', encodeURIComponent(String(requestParameters['brokerName'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: BrokerSpecToJSON(requestParameters['brokerSpec']),
        };
    }

    /**
     * `llm`, `egress`, `tunnels`, `sessions` and `images` are the server\'s own: they always exist and are not changed here (`409 in_use`). Any other is a `shared` broker: one the sandboxes daemon declares under the same name, and dials with the machine\'s certificate. A session\'s machine is given it, and the broker says the rest itself: what the session\'s environment and git are given to reach it, and the MCP server it serves, at `/.well-known/runyard-broker`, and its skills, at `/.well-known/agent-skills`. Its credentials, and what it lets through, are the broker\'s. 
     * Declare a broker, or change it
     */
    async putBrokerRaw(requestParameters: PutBrokerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Broker>> {
        const requestOptions = await this.putBrokerRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BrokerFromJSON(jsonValue));
    }

    /**
     * `llm`, `egress`, `tunnels`, `sessions` and `images` are the server\'s own: they always exist and are not changed here (`409 in_use`). Any other is a `shared` broker: one the sandboxes daemon declares under the same name, and dials with the machine\'s certificate. A session\'s machine is given it, and the broker says the rest itself: what the session\'s environment and git are given to reach it, and the MCP server it serves, at `/.well-known/runyard-broker`, and its skills, at `/.well-known/agent-skills`. Its credentials, and what it lets through, are the broker\'s. 
     * Declare a broker, or change it
     */
    async putBroker(requestParameters: PutBrokerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Broker> {
        const response = await this.putBrokerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for putBrokerUsers without sending the request
     */
    async putBrokerUsersRequestOpts(requestParameters: PutBrokerUsersRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['brokerName'] == null) {
            throw new runtime.RequiredError(
                'brokerName',
                'Required parameter "brokerName" was null or undefined when calling putBrokerUsers().'
            );
        }

        if (requestParameters['users'] == null) {
            throw new runtime.RequiredError(
                'users',
                'Required parameter "users" was null or undefined when calling putBrokerUsers().'
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

        let urlPath = `/v1/brokers/{brokerName}/users`;
        urlPath = urlPath.replace('{brokerName}', encodeURIComponent(String(requestParameters['brokerName'])));

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
     * Say who besides its owner may use a broker: whose sessions may be given it
     */
    async putBrokerUsersRaw(requestParameters: PutBrokerUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Users>> {
        const requestOptions = await this.putBrokerUsersRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UsersFromJSON(jsonValue));
    }

    /**
     * Its owner\'s, or an admin\'s, to say; it replaces whom it was for. 
     * Say who besides its owner may use a broker: whose sessions may be given it
     */
    async putBrokerUsers(requestParameters: PutBrokerUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Users> {
        const response = await this.putBrokerUsersRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
