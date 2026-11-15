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
    type Secret,
    SecretFromJSON,
    SecretToJSON,
} from '../models/Secret.js';
import {
    type SecretList,
    SecretListFromJSON,
    SecretListToJSON,
} from '../models/SecretList.js';
import {
    type SecretValue,
    SecretValueFromJSON,
    SecretValueToJSON,
} from '../models/SecretValue.js';

export interface DeleteSecretRequest {
    /**
     * 
     */
    secretName: string;
}

export interface PutSecretRequest {
    /**
     * 
     */
    secretName: string;
    /**
     * 
     */
    secretValue: SecretValue;
}

/**
 * SecretsApi - interface
 * 
 * @export
 * @interface SecretsApiInterface
 */
export interface SecretsApiInterface {
    /**
     * Creates request options for deleteSecret without sending the request
     * @param {string} secretName 
     * @throws {RequiredError}
     * @memberof SecretsApiInterface
     */
    deleteSecretRequestOpts(requestParameters: DeleteSecretRequest): Promise<runtime.RequestOpts>;

    /**
     * A person\'s alone. Deployments made with it keep the value they were made with; an approval still waiting that names it fails when it is approved. 
     * @summary Forget one of the caller\'s secrets
     * @param {string} secretName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SecretsApiInterface
     */
    deleteSecretRaw(requestParameters: DeleteSecretRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * A person\'s alone. Deployments made with it keep the value they were made with; an approval still waiting that names it fails when it is approved. 
     * Forget one of the caller\'s secrets
     */
    deleteSecret(requestParameters: DeleteSecretRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for listSecrets without sending the request
     * @throws {RequiredError}
     * @memberof SecretsApiInterface
     */
    listSecretsRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * Names and when they were set, never a value: nothing reads a value back. A person\'s own alone, an admin\'s too, and a session sees its person\'s, to name them in a deployment it asks for. 
     * @summary The caller\'s person\'s secrets, by name
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SecretsApiInterface
     */
    listSecretsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SecretList>>;

    /**
     * Names and when they were set, never a value: nothing reads a value back. A person\'s own alone, an admin\'s too, and a session sees its person\'s, to name them in a deployment it asks for. 
     * The caller\'s person\'s secrets, by name
     */
    listSecrets(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SecretList>;

    /**
     * Creates request options for putSecret without sending the request
     * @param {string} secretName 
     * @param {SecretValue} secretValue 
     * @throws {RequiredError}
     * @memberof SecretsApiInterface
     */
    putSecretRequestOpts(requestParameters: PutSecretRequest): Promise<runtime.RequestOpts>;

    /**
     * A person\'s alone to set: a session is refused (`403`), so a value is never in a session\'s context. A deployment already made keeps the value it was made with; one made after has the new one. 
     * @summary Set one of the caller\'s secrets, or replace its value
     * @param {string} secretName 
     * @param {SecretValue} secretValue 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SecretsApiInterface
     */
    putSecretRaw(requestParameters: PutSecretRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Secret>>;

    /**
     * A person\'s alone to set: a session is refused (`403`), so a value is never in a session\'s context. A deployment already made keeps the value it was made with; one made after has the new one. 
     * Set one of the caller\'s secrets, or replace its value
     */
    putSecret(requestParameters: PutSecretRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Secret>;

}

/**
 * 
 */
export class SecretsApi extends runtime.BaseAPI implements SecretsApiInterface {

    /**
     * Creates request options for deleteSecret without sending the request
     */
    async deleteSecretRequestOpts(requestParameters: DeleteSecretRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['secretName'] == null) {
            throw new runtime.RequiredError(
                'secretName',
                'Required parameter "secretName" was null or undefined when calling deleteSecret().'
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

        let urlPath = `/v1/secrets/{secretName}`;
        urlPath = urlPath.replace('{secretName}', encodeURIComponent(String(requestParameters['secretName'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A person\'s alone. Deployments made with it keep the value they were made with; an approval still waiting that names it fails when it is approved. 
     * Forget one of the caller\'s secrets
     */
    async deleteSecretRaw(requestParameters: DeleteSecretRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteSecretRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * A person\'s alone. Deployments made with it keep the value they were made with; an approval still waiting that names it fails when it is approved. 
     * Forget one of the caller\'s secrets
     */
    async deleteSecret(requestParameters: DeleteSecretRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteSecretRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for listSecrets without sending the request
     */
    async listSecretsRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/secrets`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Names and when they were set, never a value: nothing reads a value back. A person\'s own alone, an admin\'s too, and a session sees its person\'s, to name them in a deployment it asks for. 
     * The caller\'s person\'s secrets, by name
     */
    async listSecretsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SecretList>> {
        const requestOptions = await this.listSecretsRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SecretListFromJSON(jsonValue));
    }

    /**
     * Names and when they were set, never a value: nothing reads a value back. A person\'s own alone, an admin\'s too, and a session sees its person\'s, to name them in a deployment it asks for. 
     * The caller\'s person\'s secrets, by name
     */
    async listSecrets(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SecretList> {
        const response = await this.listSecretsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for putSecret without sending the request
     */
    async putSecretRequestOpts(requestParameters: PutSecretRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['secretName'] == null) {
            throw new runtime.RequiredError(
                'secretName',
                'Required parameter "secretName" was null or undefined when calling putSecret().'
            );
        }

        if (requestParameters['secretValue'] == null) {
            throw new runtime.RequiredError(
                'secretValue',
                'Required parameter "secretValue" was null or undefined when calling putSecret().'
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

        let urlPath = `/v1/secrets/{secretName}`;
        urlPath = urlPath.replace('{secretName}', encodeURIComponent(String(requestParameters['secretName'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: SecretValueToJSON(requestParameters['secretValue']),
        };
    }

    /**
     * A person\'s alone to set: a session is refused (`403`), so a value is never in a session\'s context. A deployment already made keeps the value it was made with; one made after has the new one. 
     * Set one of the caller\'s secrets, or replace its value
     */
    async putSecretRaw(requestParameters: PutSecretRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Secret>> {
        const requestOptions = await this.putSecretRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SecretFromJSON(jsonValue));
    }

    /**
     * A person\'s alone to set: a session is refused (`403`), so a value is never in a session\'s context. A deployment already made keeps the value it was made with; one made after has the new one. 
     * Set one of the caller\'s secrets, or replace its value
     */
    async putSecret(requestParameters: PutSecretRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Secret> {
        const response = await this.putSecretRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
