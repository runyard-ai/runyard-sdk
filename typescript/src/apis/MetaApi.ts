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
    type Caller,
    CallerFromJSON,
    CallerToJSON,
} from '../models/Caller.js';
import {
    type ConfirmSignIn,
    ConfirmSignInFromJSON,
    ConfirmSignInToJSON,
} from '../models/ConfirmSignIn.js';
import {
    type Info,
    InfoFromJSON,
    InfoToJSON,
} from '../models/Info.js';
import {
    type NoticeList,
    NoticeListFromJSON,
    NoticeListToJSON,
} from '../models/NoticeList.js';
import {
    type Preferences,
    PreferencesFromJSON,
    PreferencesToJSON,
} from '../models/Preferences.js';
import {
    type SelfDirectory,
    SelfDirectoryFromJSON,
    SelfDirectoryToJSON,
} from '../models/SelfDirectory.js';
import {
    type WorkspaceSettings,
    WorkspaceSettingsFromJSON,
    WorkspaceSettingsToJSON,
} from '../models/WorkspaceSettings.js';

export interface ConfirmSignInRequest {
    /**
     * 
     */
    confirmSignIn: ConfirmSignIn;
}

export interface GetSelfPictureRequest {
    /**
     * 
     */
    ifNoneMatch?: string;
}

export interface PutPreferencesRequest {
    /**
     * 
     */
    preferences: Preferences;
}

export interface PutWorkspaceSettingsRequest {
    /**
     * 
     */
    workspaceSettings: WorkspaceSettings;
}

/**
 * MetaApi - interface
 * 
 * @export
 * @interface MetaApiInterface
 */
export interface MetaApiInterface {
    /**
     * Creates request options for confirmSignIn without sending the request
     * @param {ConfirmSignIn} confirmSignIn 
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    confirmSignInRequestOpts(requestParameters: ConfirmSignInRequest): Promise<runtime.RequestOpts>;

    /**
     * A person signed in to a UI with a password, typing it again: their sign-in is made anew, and is recent from now — which adding, approving, changing or revoking a runner asks for (`recent_signin_required`). A UI asks for it there and then, over the page that was refused, and does what was refused again; nobody is signed out. A person signed in with Google or the OpenID provider confirms with it instead, `GET /v1/auth/google` or `GET /v1/auth/oidc` with `confirm=true` (`400` here); a key, or anything not a person signed in to a UI, is refused (`403`), as is a password that is not theirs. 
     * @summary Confirm it is you, with your password again
     * @param {ConfirmSignIn} confirmSignIn 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    confirmSignInRaw(requestParameters: ConfirmSignInRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * A person signed in to a UI with a password, typing it again: their sign-in is made anew, and is recent from now — which adding, approving, changing or revoking a runner asks for (`recent_signin_required`). A UI asks for it there and then, over the page that was refused, and does what was refused again; nobody is signed out. A person signed in with Google or the OpenID provider confirms with it instead, `GET /v1/auth/google` or `GET /v1/auth/oidc` with `confirm=true` (`400` here); a key, or anything not a person signed in to a UI, is refused (`403`), as is a password that is not theirs. 
     * Confirm it is you, with your password again
     */
    confirmSignIn(requestParameters: ConfirmSignInRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for getContract without sending the request
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    getContractRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary This document, as the server serves it
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    getContractRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;

    /**
     * This document, as the server serves it
     */
    getContract(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;

    /**
     * Creates request options for getInfo without sending the request
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    getInfoRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary The workspace, and the server\'s defaults and limits
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    getInfoRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Info>>;

    /**
     * The workspace, and the server\'s defaults and limits
     */
    getInfo(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Info>;

    /**
     * Creates request options for getPreferences without sending the request
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    getPreferencesRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * What the caller\'s person chose for themselves, as opposed to what the workspace\'s admins chose for everybody (`/v1/settings`): a key\'s are its person\'s. A person who never chose has the defaults. Needs `sessions.read`, and `sessions.write` to change them: they are of the person\'s sessions. A session calling through its brokers has none: `403`. 
     * @summary The person\'s own choices
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    getPreferencesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Preferences>>;

    /**
     * What the caller\'s person chose for themselves, as opposed to what the workspace\'s admins chose for everybody (`/v1/settings`): a key\'s are its person\'s. A person who never chose has the defaults. Needs `sessions.read`, and `sessions.write` to change them: they are of the person\'s sessions. A session calling through its brokers has none: `403`. 
     * The person\'s own choices
     */
    getPreferences(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Preferences>;

    /**
     * Creates request options for getSelf without sending the request
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    getSelfRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * Who the caller is: a person signed in, a key, a session\'s harness calling through its brokers, or the Runyard platform with a platform token (`-platform-issuer`) — with its role in the workspace and the scopes it holds. The platform has no role and no address: it answers `{kind: platform, name: \"Runyard platform\", scopes}`, which is how the platform finds out a workspace takes its tokens. 
     * @summary The key, person, session or platform calling
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    getSelfRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Caller>>;

    /**
     * Who the caller is: a person signed in, a key, a session\'s harness calling through its brokers, or the Runyard platform with a platform token (`-platform-issuer`) — with its role in the workspace and the scopes it holds. The platform has no role and no address: it answers `{kind: platform, name: \"Runyard platform\", scopes}`, which is how the platform finds out a workspace takes its tokens. 
     * The key, person, session or platform calling
     */
    getSelf(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Caller>;

    /**
     * Creates request options for getSelfDirectory without sending the request
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    getSelfDirectoryRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * What the platform (`-home-url`) last said the caller\'s person may reach — their orgs and the workspaces they may open — for the UIs\' top bar. The server asks the platform (`GET <issuer>/api/me`, with the person\'s access token) server to server right after each sign-in with the OpenID provider and each refresh of it, only when the provider is the platform: the `-oidc-issuer`\'s origin is the `-home-url`\'s. A failure keeps what was last said. A person never asked about has empty lists and no `fetchedAt`. `404` when the server has no `-home-url`. 
     * @summary The orgs and workspaces the caller\'s person may reach
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    getSelfDirectoryRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SelfDirectory>>;

    /**
     * What the platform (`-home-url`) last said the caller\'s person may reach — their orgs and the workspaces they may open — for the UIs\' top bar. The server asks the platform (`GET <issuer>/api/me`, with the person\'s access token) server to server right after each sign-in with the OpenID provider and each refresh of it, only when the provider is the platform: the `-oidc-issuer`\'s origin is the `-home-url`\'s. A failure keeps what was last said. A person never asked about has empty lists and no `fetchedAt`. `404` when the server has no `-home-url`. 
     * The orgs and workspaces the caller\'s person may reach
     */
    getSelfDirectory(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SelfDirectory>;

    /**
     * Creates request options for getSelfPicture without sending the request
     * @param {string} [ifNoneMatch] 
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    getSelfPictureRequestOpts(requestParameters: GetSelfPictureRequest): Promise<runtime.RequestOpts>;

    /**
     * Google\'s picture of the person signed in, fetched from Google once and kept by the server, and by the browser for a day: the page never loads it from Google. A `304` answers an `If-None-Match` it still matches. 
     * @summary The person\'s profile picture
     * @param {string} [ifNoneMatch] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    getSelfPictureRaw(requestParameters: GetSelfPictureRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<runtime.HttpFile>>;

    /**
     * Google\'s picture of the person signed in, fetched from Google once and kept by the server, and by the browser for a day: the page never loads it from Google. A `304` answers an `If-None-Match` it still matches. 
     * The person\'s profile picture
     */
    getSelfPicture(requestParameters: GetSelfPictureRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.HttpFile>;

    /**
     * Creates request options for getWorkspaceSettings without sending the request
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    getWorkspaceSettingsRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * What the workspace\'s admins chose for it, as opposed to how the server was started (`GET /v1/info`). Anybody with `sessions.read` may read them: a chat says from them when a session will be archived and deleted. 
     * @summary The workspace\'s settings
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    getWorkspaceSettingsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<WorkspaceSettings>>;

    /**
     * What the workspace\'s admins chose for it, as opposed to how the server was started (`GET /v1/info`). Anybody with `sessions.read` may read them: a chat says from them when a session will be archived and deleted. 
     * The workspace\'s settings
     */
    getWorkspaceSettings(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<WorkspaceSettings>;

    /**
     * Creates request options for health without sending the request
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    healthRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary Whether the server is up
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    healthRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;

    /**
     * Whether the server is up
     */
    health(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;

    /**
     * Creates request options for listNotices without sending the request
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    listNoticesRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * The warnings and errors that stand for the caller\'s person now — a profile they may start that uses what they may not, a provider of theirs to sign in again — each gone once it is resolved. 
     * @summary What the caller should know and act on
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    listNoticesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<NoticeList>>;

    /**
     * The warnings and errors that stand for the caller\'s person now — a profile they may start that uses what they may not, a provider of theirs to sign in again — each gone once it is resolved. 
     * What the caller should know and act on
     */
    listNotices(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<NoticeList>;

    /**
     * Creates request options for putPreferences without sending the request
     * @param {Preferences} preferences 
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    putPreferencesRequestOpts(requestParameters: PutPreferencesRequest): Promise<runtime.RequestOpts>;

    /**
     * Replaces them all, as `PUT /v1/settings` does the workspace\'s.
     * @summary Change the person\'s own choices
     * @param {Preferences} preferences 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    putPreferencesRaw(requestParameters: PutPreferencesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Preferences>>;

    /**
     * Replaces them all, as `PUT /v1/settings` does the workspace\'s.
     * Change the person\'s own choices
     */
    putPreferences(requestParameters: PutPreferencesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Preferences>;

    /**
     * Creates request options for putWorkspaceSettings without sending the request
     * @param {WorkspaceSettings} workspaceSettings 
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    putWorkspaceSettingsRequestOpts(requestParameters: PutWorkspaceSettingsRequest): Promise<runtime.RequestOpts>;

    /**
     * Replaces them all: a field left out is unset. Needs `settings.write`, which only an admin holds. A change applies at once to every session, counted from when each was last idle: one already past a new limit is archived or deleted straight away. 
     * @summary Change the workspace\'s settings
     * @param {WorkspaceSettings} workspaceSettings 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MetaApiInterface
     */
    putWorkspaceSettingsRaw(requestParameters: PutWorkspaceSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<WorkspaceSettings>>;

    /**
     * Replaces them all: a field left out is unset. Needs `settings.write`, which only an admin holds. A change applies at once to every session, counted from when each was last idle: one already past a new limit is archived or deleted straight away. 
     * Change the workspace\'s settings
     */
    putWorkspaceSettings(requestParameters: PutWorkspaceSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<WorkspaceSettings>;

}

/**
 * 
 */
export class MetaApi extends runtime.BaseAPI implements MetaApiInterface {

    /**
     * Creates request options for confirmSignIn without sending the request
     */
    async confirmSignInRequestOpts(requestParameters: ConfirmSignInRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['confirmSignIn'] == null) {
            throw new runtime.RequiredError(
                'confirmSignIn',
                'Required parameter "confirmSignIn" was null or undefined when calling confirmSignIn().'
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

        let urlPath = `/v1/signin/confirm`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ConfirmSignInToJSON(requestParameters['confirmSignIn']),
        };
    }

    /**
     * A person signed in to a UI with a password, typing it again: their sign-in is made anew, and is recent from now — which adding, approving, changing or revoking a runner asks for (`recent_signin_required`). A UI asks for it there and then, over the page that was refused, and does what was refused again; nobody is signed out. A person signed in with Google or the OpenID provider confirms with it instead, `GET /v1/auth/google` or `GET /v1/auth/oidc` with `confirm=true` (`400` here); a key, or anything not a person signed in to a UI, is refused (`403`), as is a password that is not theirs. 
     * Confirm it is you, with your password again
     */
    async confirmSignInRaw(requestParameters: ConfirmSignInRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.confirmSignInRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * A person signed in to a UI with a password, typing it again: their sign-in is made anew, and is recent from now — which adding, approving, changing or revoking a runner asks for (`recent_signin_required`). A UI asks for it there and then, over the page that was refused, and does what was refused again; nobody is signed out. A person signed in with Google or the OpenID provider confirms with it instead, `GET /v1/auth/google` or `GET /v1/auth/oidc` with `confirm=true` (`400` here); a key, or anything not a person signed in to a UI, is refused (`403`), as is a password that is not theirs. 
     * Confirm it is you, with your password again
     */
    async confirmSignIn(requestParameters: ConfirmSignInRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.confirmSignInRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for getContract without sending the request
     */
    async getContractRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};


        let urlPath = `/v1/openapi.yaml`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * This document, as the server serves it
     */
    async getContractRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const requestOptions = await this.getContractRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * This document, as the server serves it
     */
    async getContract(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.getContractRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getInfo without sending the request
     */
    async getInfoRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/info`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The workspace, and the server\'s defaults and limits
     */
    async getInfoRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Info>> {
        const requestOptions = await this.getInfoRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => InfoFromJSON(jsonValue));
    }

    /**
     * The workspace, and the server\'s defaults and limits
     */
    async getInfo(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Info> {
        const response = await this.getInfoRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getPreferences without sending the request
     */
    async getPreferencesRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/self/preferences`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * What the caller\'s person chose for themselves, as opposed to what the workspace\'s admins chose for everybody (`/v1/settings`): a key\'s are its person\'s. A person who never chose has the defaults. Needs `sessions.read`, and `sessions.write` to change them: they are of the person\'s sessions. A session calling through its brokers has none: `403`. 
     * The person\'s own choices
     */
    async getPreferencesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Preferences>> {
        const requestOptions = await this.getPreferencesRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PreferencesFromJSON(jsonValue));
    }

    /**
     * What the caller\'s person chose for themselves, as opposed to what the workspace\'s admins chose for everybody (`/v1/settings`): a key\'s are its person\'s. A person who never chose has the defaults. Needs `sessions.read`, and `sessions.write` to change them: they are of the person\'s sessions. A session calling through its brokers has none: `403`. 
     * The person\'s own choices
     */
    async getPreferences(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Preferences> {
        const response = await this.getPreferencesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getSelf without sending the request
     */
    async getSelfRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/self`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Who the caller is: a person signed in, a key, a session\'s harness calling through its brokers, or the Runyard platform with a platform token (`-platform-issuer`) — with its role in the workspace and the scopes it holds. The platform has no role and no address: it answers `{kind: platform, name: \"Runyard platform\", scopes}`, which is how the platform finds out a workspace takes its tokens. 
     * The key, person, session or platform calling
     */
    async getSelfRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Caller>> {
        const requestOptions = await this.getSelfRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CallerFromJSON(jsonValue));
    }

    /**
     * Who the caller is: a person signed in, a key, a session\'s harness calling through its brokers, or the Runyard platform with a platform token (`-platform-issuer`) — with its role in the workspace and the scopes it holds. The platform has no role and no address: it answers `{kind: platform, name: \"Runyard platform\", scopes}`, which is how the platform finds out a workspace takes its tokens. 
     * The key, person, session or platform calling
     */
    async getSelf(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Caller> {
        const response = await this.getSelfRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getSelfDirectory without sending the request
     */
    async getSelfDirectoryRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/self/directory`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * What the platform (`-home-url`) last said the caller\'s person may reach — their orgs and the workspaces they may open — for the UIs\' top bar. The server asks the platform (`GET <issuer>/api/me`, with the person\'s access token) server to server right after each sign-in with the OpenID provider and each refresh of it, only when the provider is the platform: the `-oidc-issuer`\'s origin is the `-home-url`\'s. A failure keeps what was last said. A person never asked about has empty lists and no `fetchedAt`. `404` when the server has no `-home-url`. 
     * The orgs and workspaces the caller\'s person may reach
     */
    async getSelfDirectoryRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SelfDirectory>> {
        const requestOptions = await this.getSelfDirectoryRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SelfDirectoryFromJSON(jsonValue));
    }

    /**
     * What the platform (`-home-url`) last said the caller\'s person may reach — their orgs and the workspaces they may open — for the UIs\' top bar. The server asks the platform (`GET <issuer>/api/me`, with the person\'s access token) server to server right after each sign-in with the OpenID provider and each refresh of it, only when the provider is the platform: the `-oidc-issuer`\'s origin is the `-home-url`\'s. A failure keeps what was last said. A person never asked about has empty lists and no `fetchedAt`. `404` when the server has no `-home-url`. 
     * The orgs and workspaces the caller\'s person may reach
     */
    async getSelfDirectory(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SelfDirectory> {
        const response = await this.getSelfDirectoryRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getSelfPicture without sending the request
     */
    async getSelfPictureRequestOpts(requestParameters: GetSelfPictureRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters['ifNoneMatch'] != null) {
            headerParameters['If-None-Match'] = String(requestParameters['ifNoneMatch']);
        }

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

        let urlPath = `/v1/self/picture`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Google\'s picture of the person signed in, fetched from Google once and kept by the server, and by the browser for a day: the page never loads it from Google. A `304` answers an `If-None-Match` it still matches. 
     * The person\'s profile picture
     */
    async getSelfPictureRaw(requestParameters: GetSelfPictureRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<runtime.HttpFile>> {
        const requestOptions = await this.getSelfPictureRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.BlobApiResponse(response);
    }

    /**
     * Google\'s picture of the person signed in, fetched from Google once and kept by the server, and by the browser for a day: the page never loads it from Google. A `304` answers an `If-None-Match` it still matches. 
     * The person\'s profile picture
     */
    async getSelfPicture(requestParameters: GetSelfPictureRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.HttpFile> {
        const response = await this.getSelfPictureRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getWorkspaceSettings without sending the request
     */
    async getWorkspaceSettingsRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/settings`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * What the workspace\'s admins chose for it, as opposed to how the server was started (`GET /v1/info`). Anybody with `sessions.read` may read them: a chat says from them when a session will be archived and deleted. 
     * The workspace\'s settings
     */
    async getWorkspaceSettingsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<WorkspaceSettings>> {
        const requestOptions = await this.getWorkspaceSettingsRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => WorkspaceSettingsFromJSON(jsonValue));
    }

    /**
     * What the workspace\'s admins chose for it, as opposed to how the server was started (`GET /v1/info`). Anybody with `sessions.read` may read them: a chat says from them when a session will be archived and deleted. 
     * The workspace\'s settings
     */
    async getWorkspaceSettings(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<WorkspaceSettings> {
        const response = await this.getWorkspaceSettingsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for health without sending the request
     */
    async healthRequestOpts(): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};


        let urlPath = `/healthz`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Whether the server is up
     */
    async healthRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const requestOptions = await this.healthRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Whether the server is up
     */
    async health(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.healthRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listNotices without sending the request
     */
    async listNoticesRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/self/notices`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The warnings and errors that stand for the caller\'s person now — a profile they may start that uses what they may not, a provider of theirs to sign in again — each gone once it is resolved. 
     * What the caller should know and act on
     */
    async listNoticesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<NoticeList>> {
        const requestOptions = await this.listNoticesRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => NoticeListFromJSON(jsonValue));
    }

    /**
     * The warnings and errors that stand for the caller\'s person now — a profile they may start that uses what they may not, a provider of theirs to sign in again — each gone once it is resolved. 
     * What the caller should know and act on
     */
    async listNotices(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<NoticeList> {
        const response = await this.listNoticesRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for putPreferences without sending the request
     */
    async putPreferencesRequestOpts(requestParameters: PutPreferencesRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['preferences'] == null) {
            throw new runtime.RequiredError(
                'preferences',
                'Required parameter "preferences" was null or undefined when calling putPreferences().'
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

        let urlPath = `/v1/self/preferences`;

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: PreferencesToJSON(requestParameters['preferences']),
        };
    }

    /**
     * Replaces them all, as `PUT /v1/settings` does the workspace\'s.
     * Change the person\'s own choices
     */
    async putPreferencesRaw(requestParameters: PutPreferencesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Preferences>> {
        const requestOptions = await this.putPreferencesRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PreferencesFromJSON(jsonValue));
    }

    /**
     * Replaces them all, as `PUT /v1/settings` does the workspace\'s.
     * Change the person\'s own choices
     */
    async putPreferences(requestParameters: PutPreferencesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Preferences> {
        const response = await this.putPreferencesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for putWorkspaceSettings without sending the request
     */
    async putWorkspaceSettingsRequestOpts(requestParameters: PutWorkspaceSettingsRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['workspaceSettings'] == null) {
            throw new runtime.RequiredError(
                'workspaceSettings',
                'Required parameter "workspaceSettings" was null or undefined when calling putWorkspaceSettings().'
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

        let urlPath = `/v1/settings`;

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: WorkspaceSettingsToJSON(requestParameters['workspaceSettings']),
        };
    }

    /**
     * Replaces them all: a field left out is unset. Needs `settings.write`, which only an admin holds. A change applies at once to every session, counted from when each was last idle: one already past a new limit is archived or deleted straight away. 
     * Change the workspace\'s settings
     */
    async putWorkspaceSettingsRaw(requestParameters: PutWorkspaceSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<WorkspaceSettings>> {
        const requestOptions = await this.putWorkspaceSettingsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => WorkspaceSettingsFromJSON(jsonValue));
    }

    /**
     * Replaces them all: a field left out is unset. Needs `settings.write`, which only an admin holds. A change applies at once to every session, counted from when each was last idle: one already past a new limit is archived or deleted straight away. 
     * Change the workspace\'s settings
     */
    async putWorkspaceSettings(requestParameters: PutWorkspaceSettingsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<WorkspaceSettings> {
        const response = await this.putWorkspaceSettingsRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
