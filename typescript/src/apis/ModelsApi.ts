/* tslint:disable */
/* eslint-disable */
/**
 * runyard-agents
 * **Open a session, talk to it, watch what it does, and let it start others.**  A session is a conversation with a harness — Claude Code or Codex — running in a sandbox of its own. This server makes the sandbox (through runyard-sandboxes), starts the harness in it, keeps the transcript, and serves it to whoever asks: a chat UI, a console, a scheduler, a GitHub App, or another session.  It is the API workspace-platform\'s chat is adapted to: everything it does about conversations — sessions, sub-agents, background tasks, the session\'s task list, brokers, MCP connectors, sessions started by code and the lineage between them — and nothing else. Widgets, workflows, objects and the rest of workspace-platform are not here, and are not meant to be.  ### One session, one sandbox  Every session has a sandbox of its own, with its own resources, and no two sessions ever share one. There is no \"box\" to create first, no machine-wide setting to size: `cpus`, `memory` and `disk` are fields of the session, defaulted by the server (or the session\'s harness) and capped by it.  A session\'s disk outlives its sandbox. A session nobody talks to is put to **sleep**: its sandbox is released and its disk kept, and the next turn wakes it on a new one. So a session costs a machine only while it is working, and a thousand dormant ones cost a thousand disks.  ### Two liveness domains  `session.state` is its harness\'s (`idle`, `generating`, …); `session.sandbox.state` is the machine\'s (`booting`, `ready`, `released`, …). They are separate because they fail separately — a harness that crashed in a healthy sandbox is relaunched; a sandbox that is gone takes a running harness with it — and a caller that conflates them shows a person the wrong thing.  ### The caller names what it creates  A session is created with `PUT /v1/sessions/{sessionId}`, the id chosen by the caller, and so are profiles, brokers, MCP connectors and triggers. A lost response to a create is retried with the same id, and the second request finds the first\'s session rather than making a second one on a second machine. The same request again is `200`; a different one is `409 spec_conflict`. Turns are idempotent the same way, by `turnId`.  ### The transcript lives here, append-only  The server holds every event of every session, numbered by `seq`, and nothing is ever rewritten: editing an earlier message is a `rewound` event saying which events no longer count, followed by the new ones. A reader that kept its place keeps it. Presentation state — what a person has seen, what they pinned — is not stored; `labels` are the caller\'s escape hatch.  ### Streams, not webhooks  Events are read from a cursor: `GET …/events?from=<seq>&follow=true` is chunked `application/x-ndjson`, one event per line, held open while following. A reader that fell behind what is kept gets `409 gapped` naming the window, never a silent jump. The account\'s sessions change on one feed, `GET /v1/changes`, read the same way: it is how a chat UI keeps its list without polling every session. The one WebSocket is a session\'s terminal.  There are no outbound webhooks. Inbound ones — a trigger\'s hook — are.  ### Lineage  Every session says where it came from: a person (`source: user`), a caller with a key (`api`), another session\'s harness (`session`, with its `parentId`), a fork (`fork`, with `branchedFrom`) or a trigger\'s firing (`trigger`, with the trigger and the firing). `rootId` and `depth` are kept so that a tree is one query away, and `GET …/lineage` is that tree.  ### Brokers and MCP connectors keep the credentials out  Nothing that reaches a sandbox carries a secret. A **broker** is an API the session reaches through this server — GitHub, egress, tunnels, a model provider — with the credential held here; an **MCP connector** is an MCP server, its token or OAuth grant held here, served to the session through a broker of its own. Which ones a session gets is a field of the session.  ### One workspace  A server serves one **workspace**: its sessions, triggers, profiles, providers, brokers, MCP connectors, people, keys, usage and activity. What the workspace itself is comes from how the server is started, never from this API: its name and title (`--workspace`, `--workspace-title`), the runyard-sandboxes server it works on — the workspace\'s own (`--sandboxes`), reached with a key that reaches every sandbox there (`--sandboxes-key-file`, read at every start) — its owner (`--owner`) and its policy (`--policy-file`). `GET /v1/info` says them, but the key.  ### People, and what is whose  Everything is somebody\'s: every session, key, provider, profile, broker, MCP connector and trigger has an `owner`, the person who made it — for a session, whom it is for.  A person is a **member** or an **admin** of the workspace. An admin sees and changes everything in it; a member has the chat: their own sessions and those shared with them, which they read and do not steer. What a person *uses* — the provider a session runs on, the profile it starts from, its brokers and MCP connectors — is their own, or one its owner lets them use (`everyone`, `users`), admin or not. A key does no more than its owner, and a session calling through its brokers no more than its owner, over its own tree alone. Every key is made by a person: none is made for a session. What a person is missing is said in `GET /v1/self/notices`.  A person comes into the workspace by an admin\'s invitation, signing in with Google or the OpenID provider, or by being put in it by address (`PUT /v1/users/{userEmail}`), and signs in with Google, the OpenID provider or the password the password file holds for their address. The workspace\'s owner (`--owner`) is an admin of it from the start, always, and is never removed.  ### The UIs, and this reference  The chat is served at every path not under `/v1/` or `/console/`, and the console at every path under `/console/`: both route by the path (no `#`), so any page of either is an address to share or reload. This document is `GET /v1/openapi.yaml`, and rendered to read at `GET /v1/docs`.  ### What is deliberately not here  - **Tool approval prompts.** The session runs unattended inside its   sandbox; what it may reach outside it is what its brokers reach. - **A process and shell API.** The terminal is the one door into the   sandbox besides the session, and files the one way to move bytes. - **Widgets, workflows, objects, templates as UI.** Not conversations. - **Presentation state.** Pins, unread markers and drafts are the UI\'s. 
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
    type ListHarnesses200Response,
    ListHarnesses200ResponseFromJSON,
    ListHarnesses200ResponseToJSON,
} from '../models/ListHarnesses200Response.js';
import {
    type ListProviders200Response,
    ListProviders200ResponseFromJSON,
    ListProviders200ResponseToJSON,
} from '../models/ListProviders200Response.js';
import {
    type Provider,
    ProviderFromJSON,
    ProviderToJSON,
} from '../models/Provider.js';
import {
    type ProviderApiKey,
    ProviderApiKeyFromJSON,
    ProviderApiKeyToJSON,
} from '../models/ProviderApiKey.js';
import {
    type ProviderSignIn,
    ProviderSignInFromJSON,
    ProviderSignInToJSON,
} from '../models/ProviderSignIn.js';
import {
    type ProviderSignInFinish,
    ProviderSignInFinishFromJSON,
    ProviderSignInFinishToJSON,
} from '../models/ProviderSignInFinish.js';
import {
    type ProviderUpdate,
    ProviderUpdateFromJSON,
    ProviderUpdateToJSON,
} from '../models/ProviderUpdate.js';
import {
    type SignInFlow,
    SignInFlowFromJSON,
    SignInFlowToJSON,
} from '../models/SignInFlow.js';

export interface DeleteProviderRequest {
    /**
     * 
     */
    provider: string;
}

export interface FinishProviderSignInRequest {
    /**
     * 
     */
    provider: string;
    /**
     * 
     */
    flowId: string;
    /**
     * 
     */
    providerSignInFinish?: ProviderSignInFinish;
}

export interface ListProvidersRequest {
    /**
     * Those of the end user of this id alone.
     */
    endUser?: string;
}

export interface PutProviderRequest {
    /**
     * 
     */
    provider: string;
    /**
     * 
     */
    providerApiKey: ProviderApiKey;
}

export interface RefreshProviderModelsRequest {
    /**
     * 
     */
    provider: string;
}

export interface StartProviderSignInRequest {
    /**
     * 
     */
    provider: string;
    /**
     * 
     */
    providerSignIn: ProviderSignIn;
}

export interface UpdateProviderRequest {
    /**
     * 
     */
    provider: string;
    /**
     * 
     */
    providerUpdate: ProviderUpdate;
}

/**
 * ModelsApi - interface
 * 
 * @export
 * @interface ModelsApiInterface
 */
export interface ModelsApiInterface {
    /**
     * Creates request options for deleteProvider without sending the request
     * @param {string} provider 
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    deleteProviderRequestOpts(requestParameters: DeleteProviderRequest): Promise<runtime.RequestOpts>;

    /**
     * Sessions on it move to the default at their next turn. Removing the default makes another one the default, when there is another. An admin removes any; a member, those they made. 
     * @summary Remove a provider, and forget its credential
     * @param {string} provider 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    deleteProviderRaw(requestParameters: DeleteProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Sessions on it move to the default at their next turn. Removing the default makes another one the default, when there is another. An admin removes any; a member, those they made. 
     * Remove a provider, and forget its credential
     */
    deleteProvider(requestParameters: DeleteProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for finishProviderSignIn without sending the request
     * @param {string} provider 
     * @param {string} flowId 
     * @param {ProviderSignInFinish} [providerSignInFinish] 
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    finishProviderSignInRequestOpts(requestParameters: FinishProviderSignInRequest): Promise<runtime.RequestOpts>;

    /**
     * By the flow\'s `method`: `code` takes the `code` the person was shown, `redirect` the `redirectUrl` their browser was sent to, and `device` takes nothing and **waits** — until the person has entered the code and the provider is made (`200`), or the flow expires (`404`). A `device` finish cut short — a proxy\'s timeout, a page reloaded — is called again: the flow goes on until it expires, and once the provider is made, finishing it again answers the provider. A field the flow\'s method does not take is `400`. 
     * @summary Finish signing a subscription in
     * @param {string} provider 
     * @param {string} flowId 
     * @param {ProviderSignInFinish} [providerSignInFinish] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    finishProviderSignInRaw(requestParameters: FinishProviderSignInRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Provider>>;

    /**
     * By the flow\'s `method`: `code` takes the `code` the person was shown, `redirect` the `redirectUrl` their browser was sent to, and `device` takes nothing and **waits** — until the person has entered the code and the provider is made (`200`), or the flow expires (`404`). A `device` finish cut short — a proxy\'s timeout, a page reloaded — is called again: the flow goes on until it expires, and once the provider is made, finishing it again answers the provider. A field the flow\'s method does not take is `400`. 
     * Finish signing a subscription in
     */
    finishProviderSignIn(requestParameters: FinishProviderSignInRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Provider>;

    /**
     * Creates request options for listHarnesses without sending the request
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    listHarnessesRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * `claude-code` (Claude Code, on `anthropic` providers), `codex` (OpenAI\'s Codex, on `openai` providers) and `opencode` (opencode, on `openai_compatible` providers). A harness\'s models are not a list this server keeps: they are what its providers\' APIs answered when last asked, so a harness with no provider of a type it runs on has none. 
     * @summary The harnesses a session may run, and their models
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    listHarnessesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListHarnesses200Response>>;

    /**
     * `claude-code` (Claude Code, on `anthropic` providers), `codex` (OpenAI\'s Codex, on `openai` providers) and `opencode` (opencode, on `openai_compatible` providers). A harness\'s models are not a list this server keeps: they are what its providers\' APIs answered when last asked, so a harness with no provider of a type it runs on has none. 
     * The harnesses a session may run, and their models
     */
    listHarnesses(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListHarnesses200Response>;

    /**
     * Creates request options for listProviders without sending the request
     * @param {string} [endUser] Those of the end user of this id alone.
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    listProvidersRequestOpts(requestParameters: ListProvidersRequest): Promise<runtime.RequestOpts>;

    /**
     * A provider is a named credential for a model provider\'s API — an API key, or a subscription signed in — so there may be several of one type: two subscriptions and a key, say. Exactly one is the default, which a session runs on unless it names another; the first one made is. A session whose harness does not run on the default\'s type runs on the first provider, by name, of a type it does run on.  A provider is for the people it names (`users`), or for `everyone`: at first, for whoever made it alone. A session runs only on a provider its person may use — the default when they may, else the first by name they may — and a member is shown only those, an admin every one.  Each provider\'s models are asked of its API, with its own credential, when it is made or signed in, every hour after, and on `POST …/models`.  An application sees its own, each end user\'s among them. 
     * @summary The providers, and whether each has a working credential
     * @param {string} [endUser] Those of the end user of this id alone.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    listProvidersRaw(requestParameters: ListProvidersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListProviders200Response>>;

    /**
     * A provider is a named credential for a model provider\'s API — an API key, or a subscription signed in — so there may be several of one type: two subscriptions and a key, say. Exactly one is the default, which a session runs on unless it names another; the first one made is. A session whose harness does not run on the default\'s type runs on the first provider, by name, of a type it does run on.  A provider is for the people it names (`users`), or for `everyone`: at first, for whoever made it alone. A session runs only on a provider its person may use — the default when they may, else the first by name they may — and a member is shown only those, an admin every one.  Each provider\'s models are asked of its API, with its own credential, when it is made or signed in, every hour after, and on `POST …/models`.  An application sees its own, each end user\'s among them. 
     * The providers, and whether each has a working credential
     */
    listProviders(requestParameters: ListProvidersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListProviders200Response>;

    /**
     * Creates request options for putProvider without sending the request
     * @param {string} provider 
     * @param {ProviderApiKey} providerApiKey 
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    putProviderRequestOpts(requestParameters: PutProviderRequest): Promise<runtime.RequestOpts>;

    /**
     * Kept encrypted here, and never sent to a sandbox: the session reaches the provider through the `llm` broker, which puts it on. The server tries it before answering, says what the provider said, and reads the provider\'s models with it. A provider of that name, a key or a subscription, is replaced — by an admin or whoever made it; another person\'s is `409`. A provider made is for its maker alone.  An `openai_compatible` provider is a server of OpenAI\'s chat completions — llama.cpp\'s llama-server, vLLM — at `baseUrl`, which this server reaches: its key is optional, since such a server often takes none. 
     * @summary Make a provider of an API key, or replace one with it
     * @param {string} provider 
     * @param {ProviderApiKey} providerApiKey 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    putProviderRaw(requestParameters: PutProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Provider>>;

    /**
     * Kept encrypted here, and never sent to a sandbox: the session reaches the provider through the `llm` broker, which puts it on. The server tries it before answering, says what the provider said, and reads the provider\'s models with it. A provider of that name, a key or a subscription, is replaced — by an admin or whoever made it; another person\'s is `409`. A provider made is for its maker alone.  An `openai_compatible` provider is a server of OpenAI\'s chat completions — llama.cpp\'s llama-server, vLLM — at `baseUrl`, which this server reaches: its key is optional, since such a server often takes none. 
     * Make a provider of an API key, or replace one with it
     */
    putProvider(requestParameters: PutProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Provider>;

    /**
     * Creates request options for refreshProviderModels without sending the request
     * @param {string} provider 
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    refreshProviderModelsRequestOpts(requestParameters: RefreshProviderModelsRequest): Promise<runtime.RequestOpts>;

    /**
     * Asks the provider\'s API for its models with the provider\'s credential, as the server does every hour. A failure keeps the list read last and says why in `modelsError`: the answer is the provider either way, `modelsReadAt` saying when its list was read. 
     * @summary Read a provider\'s models again, now
     * @param {string} provider 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    refreshProviderModelsRaw(requestParameters: RefreshProviderModelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Provider>>;

    /**
     * Asks the provider\'s API for its models with the provider\'s credential, as the server does every hour. A failure keeps the list read last and says why in `modelsError`: the answer is the provider either way, `modelsReadAt` saying when its list was read. 
     * Read a provider\'s models again, now
     */
    refreshProviderModels(requestParameters: RefreshProviderModelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Provider>;

    /**
     * Creates request options for startProviderSignIn without sending the request
     * @param {string} provider 
     * @param {ProviderSignIn} providerSignIn 
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    startProviderSignInRequestOpts(requestParameters: StartProviderSignInRequest): Promise<runtime.RequestOpts>;

    /**
     * A subscription signs in with OAuth, as its harness does, by one of the `method`s its type offers; `POST …/signin/{flowId}` finishes, and makes the provider of that name, or replaces it.  - `code` (`anthropic`, as Claude Code does): the person opens   `authorizationUrl`, signs in, and is shown a code; finishing with   that `code` makes the provider. - `device` (`openai`, a ChatGPT plan, as `codex login   --device-auth` does): the person opens `verificationUri` on any   machine and enters `userCode`. The server asks the provider   whether they have from the start, and makes the provider as soon   as they have, whether or not anybody is finishing. - `redirect` (`openai`, as `codex login` does): the person opens   `authorizationUrl` and signs in; their browser is then sent to an   address on `localhost` that nothing there answers. Finishing with   that address, pasted from the browser\'s address bar   (`redirectUrl`), makes the provider.  The server keeps the refresh token, renews the access token before it expires, and reads the provider\'s models once signed in. An `openai_compatible` provider has no subscription: `400`. 
     * @summary Start making a provider of a subscription, or replacing one with it
     * @param {string} provider 
     * @param {ProviderSignIn} providerSignIn 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    startProviderSignInRaw(requestParameters: StartProviderSignInRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SignInFlow>>;

    /**
     * A subscription signs in with OAuth, as its harness does, by one of the `method`s its type offers; `POST …/signin/{flowId}` finishes, and makes the provider of that name, or replaces it.  - `code` (`anthropic`, as Claude Code does): the person opens   `authorizationUrl`, signs in, and is shown a code; finishing with   that `code` makes the provider. - `device` (`openai`, a ChatGPT plan, as `codex login   --device-auth` does): the person opens `verificationUri` on any   machine and enters `userCode`. The server asks the provider   whether they have from the start, and makes the provider as soon   as they have, whether or not anybody is finishing. - `redirect` (`openai`, as `codex login` does): the person opens   `authorizationUrl` and signs in; their browser is then sent to an   address on `localhost` that nothing there answers. Finishing with   that address, pasted from the browser\'s address bar   (`redirectUrl`), makes the provider.  The server keeps the refresh token, renews the access token before it expires, and reads the provider\'s models once signed in. An `openai_compatible` provider has no subscription: `400`. 
     * Start making a provider of a subscription, or replacing one with it
     */
    startProviderSignIn(requestParameters: StartProviderSignInRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SignInFlow>;

    /**
     * Creates request options for updateProvider without sending the request
     * @param {string} provider 
     * @param {ProviderUpdate} providerUpdate 
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    updateProviderRequestOpts(requestParameters: UpdateProviderRequest): Promise<runtime.RequestOpts>;

    /**
     * Absent fields are left as they are. `isDefault: true` makes it the default and the one that was stops being; `false` is `400`, since exactly one is: make another the default instead. Whoever made it retitles it and says who may use it; only an admin makes it the default. 
     * @summary Retitle a provider, say who may use it, or make it the default
     * @param {string} provider 
     * @param {ProviderUpdate} providerUpdate 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ModelsApiInterface
     */
    updateProviderRaw(requestParameters: UpdateProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Provider>>;

    /**
     * Absent fields are left as they are. `isDefault: true` makes it the default and the one that was stops being; `false` is `400`, since exactly one is: make another the default instead. Whoever made it retitles it and says who may use it; only an admin makes it the default. 
     * Retitle a provider, say who may use it, or make it the default
     */
    updateProvider(requestParameters: UpdateProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Provider>;

}

/**
 * 
 */
export class ModelsApi extends runtime.BaseAPI implements ModelsApiInterface {

    /**
     * Creates request options for deleteProvider without sending the request
     */
    async deleteProviderRequestOpts(requestParameters: DeleteProviderRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['provider'] == null) {
            throw new runtime.RequiredError(
                'provider',
                'Required parameter "provider" was null or undefined when calling deleteProvider().'
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

        let urlPath = `/v1/providers/{provider}`;
        urlPath = urlPath.replace('{provider}', encodeURIComponent(String(requestParameters['provider'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Sessions on it move to the default at their next turn. Removing the default makes another one the default, when there is another. An admin removes any; a member, those they made. 
     * Remove a provider, and forget its credential
     */
    async deleteProviderRaw(requestParameters: DeleteProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteProviderRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Sessions on it move to the default at their next turn. Removing the default makes another one the default, when there is another. An admin removes any; a member, those they made. 
     * Remove a provider, and forget its credential
     */
    async deleteProvider(requestParameters: DeleteProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteProviderRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for finishProviderSignIn without sending the request
     */
    async finishProviderSignInRequestOpts(requestParameters: FinishProviderSignInRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['provider'] == null) {
            throw new runtime.RequiredError(
                'provider',
                'Required parameter "provider" was null or undefined when calling finishProviderSignIn().'
            );
        }

        if (requestParameters['flowId'] == null) {
            throw new runtime.RequiredError(
                'flowId',
                'Required parameter "flowId" was null or undefined when calling finishProviderSignIn().'
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

        let urlPath = `/v1/providers/{provider}/signin/{flowId}`;
        urlPath = urlPath.replace('{provider}', encodeURIComponent(String(requestParameters['provider'])));
        urlPath = urlPath.replace('{flowId}', encodeURIComponent(String(requestParameters['flowId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ProviderSignInFinishToJSON(requestParameters['providerSignInFinish']),
        };
    }

    /**
     * By the flow\'s `method`: `code` takes the `code` the person was shown, `redirect` the `redirectUrl` their browser was sent to, and `device` takes nothing and **waits** — until the person has entered the code and the provider is made (`200`), or the flow expires (`404`). A `device` finish cut short — a proxy\'s timeout, a page reloaded — is called again: the flow goes on until it expires, and once the provider is made, finishing it again answers the provider. A field the flow\'s method does not take is `400`. 
     * Finish signing a subscription in
     */
    async finishProviderSignInRaw(requestParameters: FinishProviderSignInRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Provider>> {
        const requestOptions = await this.finishProviderSignInRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProviderFromJSON(jsonValue));
    }

    /**
     * By the flow\'s `method`: `code` takes the `code` the person was shown, `redirect` the `redirectUrl` their browser was sent to, and `device` takes nothing and **waits** — until the person has entered the code and the provider is made (`200`), or the flow expires (`404`). A `device` finish cut short — a proxy\'s timeout, a page reloaded — is called again: the flow goes on until it expires, and once the provider is made, finishing it again answers the provider. A field the flow\'s method does not take is `400`. 
     * Finish signing a subscription in
     */
    async finishProviderSignIn(requestParameters: FinishProviderSignInRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Provider> {
        const response = await this.finishProviderSignInRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listHarnesses without sending the request
     */
    async listHarnessesRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/harnesses`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * `claude-code` (Claude Code, on `anthropic` providers), `codex` (OpenAI\'s Codex, on `openai` providers) and `opencode` (opencode, on `openai_compatible` providers). A harness\'s models are not a list this server keeps: they are what its providers\' APIs answered when last asked, so a harness with no provider of a type it runs on has none. 
     * The harnesses a session may run, and their models
     */
    async listHarnessesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListHarnesses200Response>> {
        const requestOptions = await this.listHarnessesRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListHarnesses200ResponseFromJSON(jsonValue));
    }

    /**
     * `claude-code` (Claude Code, on `anthropic` providers), `codex` (OpenAI\'s Codex, on `openai` providers) and `opencode` (opencode, on `openai_compatible` providers). A harness\'s models are not a list this server keeps: they are what its providers\' APIs answered when last asked, so a harness with no provider of a type it runs on has none. 
     * The harnesses a session may run, and their models
     */
    async listHarnesses(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListHarnesses200Response> {
        const response = await this.listHarnessesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listProviders without sending the request
     */
    async listProvidersRequestOpts(requestParameters: ListProvidersRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['endUser'] != null) {
            queryParameters['endUser'] = requestParameters['endUser'];
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

        let urlPath = `/v1/providers`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A provider is a named credential for a model provider\'s API — an API key, or a subscription signed in — so there may be several of one type: two subscriptions and a key, say. Exactly one is the default, which a session runs on unless it names another; the first one made is. A session whose harness does not run on the default\'s type runs on the first provider, by name, of a type it does run on.  A provider is for the people it names (`users`), or for `everyone`: at first, for whoever made it alone. A session runs only on a provider its person may use — the default when they may, else the first by name they may — and a member is shown only those, an admin every one.  Each provider\'s models are asked of its API, with its own credential, when it is made or signed in, every hour after, and on `POST …/models`.  An application sees its own, each end user\'s among them. 
     * The providers, and whether each has a working credential
     */
    async listProvidersRaw(requestParameters: ListProvidersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListProviders200Response>> {
        const requestOptions = await this.listProvidersRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListProviders200ResponseFromJSON(jsonValue));
    }

    /**
     * A provider is a named credential for a model provider\'s API — an API key, or a subscription signed in — so there may be several of one type: two subscriptions and a key, say. Exactly one is the default, which a session runs on unless it names another; the first one made is. A session whose harness does not run on the default\'s type runs on the first provider, by name, of a type it does run on.  A provider is for the people it names (`users`), or for `everyone`: at first, for whoever made it alone. A session runs only on a provider its person may use — the default when they may, else the first by name they may — and a member is shown only those, an admin every one.  Each provider\'s models are asked of its API, with its own credential, when it is made or signed in, every hour after, and on `POST …/models`.  An application sees its own, each end user\'s among them. 
     * The providers, and whether each has a working credential
     */
    async listProviders(requestParameters: ListProvidersRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListProviders200Response> {
        const response = await this.listProvidersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for putProvider without sending the request
     */
    async putProviderRequestOpts(requestParameters: PutProviderRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['provider'] == null) {
            throw new runtime.RequiredError(
                'provider',
                'Required parameter "provider" was null or undefined when calling putProvider().'
            );
        }

        if (requestParameters['providerApiKey'] == null) {
            throw new runtime.RequiredError(
                'providerApiKey',
                'Required parameter "providerApiKey" was null or undefined when calling putProvider().'
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

        let urlPath = `/v1/providers/{provider}`;
        urlPath = urlPath.replace('{provider}', encodeURIComponent(String(requestParameters['provider'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ProviderApiKeyToJSON(requestParameters['providerApiKey']),
        };
    }

    /**
     * Kept encrypted here, and never sent to a sandbox: the session reaches the provider through the `llm` broker, which puts it on. The server tries it before answering, says what the provider said, and reads the provider\'s models with it. A provider of that name, a key or a subscription, is replaced — by an admin or whoever made it; another person\'s is `409`. A provider made is for its maker alone.  An `openai_compatible` provider is a server of OpenAI\'s chat completions — llama.cpp\'s llama-server, vLLM — at `baseUrl`, which this server reaches: its key is optional, since such a server often takes none. 
     * Make a provider of an API key, or replace one with it
     */
    async putProviderRaw(requestParameters: PutProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Provider>> {
        const requestOptions = await this.putProviderRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProviderFromJSON(jsonValue));
    }

    /**
     * Kept encrypted here, and never sent to a sandbox: the session reaches the provider through the `llm` broker, which puts it on. The server tries it before answering, says what the provider said, and reads the provider\'s models with it. A provider of that name, a key or a subscription, is replaced — by an admin or whoever made it; another person\'s is `409`. A provider made is for its maker alone.  An `openai_compatible` provider is a server of OpenAI\'s chat completions — llama.cpp\'s llama-server, vLLM — at `baseUrl`, which this server reaches: its key is optional, since such a server often takes none. 
     * Make a provider of an API key, or replace one with it
     */
    async putProvider(requestParameters: PutProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Provider> {
        const response = await this.putProviderRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for refreshProviderModels without sending the request
     */
    async refreshProviderModelsRequestOpts(requestParameters: RefreshProviderModelsRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['provider'] == null) {
            throw new runtime.RequiredError(
                'provider',
                'Required parameter "provider" was null or undefined when calling refreshProviderModels().'
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

        let urlPath = `/v1/providers/{provider}/models`;
        urlPath = urlPath.replace('{provider}', encodeURIComponent(String(requestParameters['provider'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Asks the provider\'s API for its models with the provider\'s credential, as the server does every hour. A failure keeps the list read last and says why in `modelsError`: the answer is the provider either way, `modelsReadAt` saying when its list was read. 
     * Read a provider\'s models again, now
     */
    async refreshProviderModelsRaw(requestParameters: RefreshProviderModelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Provider>> {
        const requestOptions = await this.refreshProviderModelsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProviderFromJSON(jsonValue));
    }

    /**
     * Asks the provider\'s API for its models with the provider\'s credential, as the server does every hour. A failure keeps the list read last and says why in `modelsError`: the answer is the provider either way, `modelsReadAt` saying when its list was read. 
     * Read a provider\'s models again, now
     */
    async refreshProviderModels(requestParameters: RefreshProviderModelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Provider> {
        const response = await this.refreshProviderModelsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for startProviderSignIn without sending the request
     */
    async startProviderSignInRequestOpts(requestParameters: StartProviderSignInRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['provider'] == null) {
            throw new runtime.RequiredError(
                'provider',
                'Required parameter "provider" was null or undefined when calling startProviderSignIn().'
            );
        }

        if (requestParameters['providerSignIn'] == null) {
            throw new runtime.RequiredError(
                'providerSignIn',
                'Required parameter "providerSignIn" was null or undefined when calling startProviderSignIn().'
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

        let urlPath = `/v1/providers/{provider}/signin`;
        urlPath = urlPath.replace('{provider}', encodeURIComponent(String(requestParameters['provider'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ProviderSignInToJSON(requestParameters['providerSignIn']),
        };
    }

    /**
     * A subscription signs in with OAuth, as its harness does, by one of the `method`s its type offers; `POST …/signin/{flowId}` finishes, and makes the provider of that name, or replaces it.  - `code` (`anthropic`, as Claude Code does): the person opens   `authorizationUrl`, signs in, and is shown a code; finishing with   that `code` makes the provider. - `device` (`openai`, a ChatGPT plan, as `codex login   --device-auth` does): the person opens `verificationUri` on any   machine and enters `userCode`. The server asks the provider   whether they have from the start, and makes the provider as soon   as they have, whether or not anybody is finishing. - `redirect` (`openai`, as `codex login` does): the person opens   `authorizationUrl` and signs in; their browser is then sent to an   address on `localhost` that nothing there answers. Finishing with   that address, pasted from the browser\'s address bar   (`redirectUrl`), makes the provider.  The server keeps the refresh token, renews the access token before it expires, and reads the provider\'s models once signed in. An `openai_compatible` provider has no subscription: `400`. 
     * Start making a provider of a subscription, or replacing one with it
     */
    async startProviderSignInRaw(requestParameters: StartProviderSignInRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SignInFlow>> {
        const requestOptions = await this.startProviderSignInRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SignInFlowFromJSON(jsonValue));
    }

    /**
     * A subscription signs in with OAuth, as its harness does, by one of the `method`s its type offers; `POST …/signin/{flowId}` finishes, and makes the provider of that name, or replaces it.  - `code` (`anthropic`, as Claude Code does): the person opens   `authorizationUrl`, signs in, and is shown a code; finishing with   that `code` makes the provider. - `device` (`openai`, a ChatGPT plan, as `codex login   --device-auth` does): the person opens `verificationUri` on any   machine and enters `userCode`. The server asks the provider   whether they have from the start, and makes the provider as soon   as they have, whether or not anybody is finishing. - `redirect` (`openai`, as `codex login` does): the person opens   `authorizationUrl` and signs in; their browser is then sent to an   address on `localhost` that nothing there answers. Finishing with   that address, pasted from the browser\'s address bar   (`redirectUrl`), makes the provider.  The server keeps the refresh token, renews the access token before it expires, and reads the provider\'s models once signed in. An `openai_compatible` provider has no subscription: `400`. 
     * Start making a provider of a subscription, or replacing one with it
     */
    async startProviderSignIn(requestParameters: StartProviderSignInRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SignInFlow> {
        const response = await this.startProviderSignInRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for updateProvider without sending the request
     */
    async updateProviderRequestOpts(requestParameters: UpdateProviderRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['provider'] == null) {
            throw new runtime.RequiredError(
                'provider',
                'Required parameter "provider" was null or undefined when calling updateProvider().'
            );
        }

        if (requestParameters['providerUpdate'] == null) {
            throw new runtime.RequiredError(
                'providerUpdate',
                'Required parameter "providerUpdate" was null or undefined when calling updateProvider().'
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

        let urlPath = `/v1/providers/{provider}`;
        urlPath = urlPath.replace('{provider}', encodeURIComponent(String(requestParameters['provider'])));

        return {
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: ProviderUpdateToJSON(requestParameters['providerUpdate']),
        };
    }

    /**
     * Absent fields are left as they are. `isDefault: true` makes it the default and the one that was stops being; `false` is `400`, since exactly one is: make another the default instead. Whoever made it retitles it and says who may use it; only an admin makes it the default. 
     * Retitle a provider, say who may use it, or make it the default
     */
    async updateProviderRaw(requestParameters: UpdateProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Provider>> {
        const requestOptions = await this.updateProviderRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProviderFromJSON(jsonValue));
    }

    /**
     * Absent fields are left as they are. `isDefault: true` makes it the default and the one that was stops being; `false` is `400`, since exactly one is: make another the default instead. Whoever made it retitles it and says who may use it; only an admin makes it the default. 
     * Retitle a provider, say who may use it, or make it the default
     */
    async updateProvider(requestParameters: UpdateProviderRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Provider> {
        const response = await this.updateProviderRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
