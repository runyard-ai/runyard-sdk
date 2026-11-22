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
    type ConnectAppList,
    ConnectAppListFromJSON,
    ConnectAppListToJSON,
} from '../models/ConnectAppList.js';
import {
    type ConnectConsent,
    ConnectConsentFromJSON,
    ConnectConsentToJSON,
} from '../models/ConnectConsent.js';
import {
    type ConnectDecision,
    ConnectDecisionFromJSON,
    ConnectDecisionToJSON,
} from '../models/ConnectDecision.js';
import {
    type ConnectGrant,
    ConnectGrantFromJSON,
    ConnectGrantToJSON,
} from '../models/ConnectGrant.js';
import {
    type ConnectLinkList,
    ConnectLinkListFromJSON,
    ConnectLinkListToJSON,
} from '../models/ConnectLinkList.js';
import {
    type ConnectRedirect,
    ConnectRedirectFromJSON,
    ConnectRedirectToJSON,
} from '../models/ConnectRedirect.js';
import {
    type NewConnectApp,
    NewConnectAppFromJSON,
    NewConnectAppToJSON,
} from '../models/NewConnectApp.js';
import {
    type OAuthError,
    OAuthErrorFromJSON,
    OAuthErrorToJSON,
} from '../models/OAuthError.js';
import {
    type RegisteredConnectApp,
    RegisteredConnectAppFromJSON,
    RegisteredConnectAppToJSON,
} from '../models/RegisteredConnectApp.js';

export interface ConnectTokenRequest {
    /**
     * 
     */
    grantType: string;
    /**
     * 
     */
    code: string;
    /**
     * 
     */
    redirectUri: string;
    /**
     * 
     */
    codeVerifier: string;
}

export interface DecideConnectConsentRequest {
    /**
     * 
     */
    connectDecision: ConnectDecision;
}

export interface GetConnectConsentRequest {
    /**
     * 
     */
    clientId: string;
    /**
     * 
     */
    redirectUri: string;
}

export interface RegisterConnectAppRequest {
    /**
     * 
     */
    newConnectApp: NewConnectApp;
}

export interface RemoveConnectAppRequest {
    /**
     * 
     */
    appId: string;
}

export interface RevokeConnectLinkRequest {
    /**
     * 
     */
    linkId: string;
}

/**
 * ConnectApi - interface
 * 
 * @export
 * @interface ConnectApiInterface
 */
export interface ConnectApiInterface {
    /**
     * Creates request options for connectToken without sending the request
     * @param {string} grantType 
     * @param {string} code 
     * @param {string} redirectUri 
     * @param {string} codeVerifier 
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    connectTokenRequestOpts(requestParameters: ConnectTokenRequest): Promise<runtime.RequestOpts>;

    /**
     * What the application\'s server calls, at the workspace `iss` named, with the code and the PKCE verifier. Form-encoded, as OAuth: `grant_type=authorization_code`, `code`, `redirect_uri` (the one the code was made for) and `code_verifier`; the application authenticates with HTTP Basic, `client_id:secret`, checked against the SHA-256 kept.  **The key is minted now**, as the application\'s (`app:<id>`), not the admin\'s who approved: it outlives them, and offboarding them does not touch it. It is named after the application (`<name>: <context>`), lasts a year, and holds what of the scopes approved an application may hold. The link is recorded, with who approved it: listed and revoked at `/v1/connect/links`.  `workspace.sandboxesCa` is the certificate authority of the workspace\'s runyard-sandboxes server, read from it now with the workspace\'s key: an application serving its own broker to the workspace\'s sessions trusts it to know their sandboxes. A CA that cannot be read fails the exchange (`500 server_error`) before anything is minted.  Errors are OAuth\'s (RFC 6749 §5.2): `401 invalid_client` for an unknown application or a wrong secret; `400 invalid_grant` for a code unknown, used, older than 60 seconds, made for another application or redirect, shown with the wrong verifier, or whose approver is no longer an admin holding what it approved — one answer for all of them. 
     * @summary Exchange a code for the link and its key
     * @param {string} grantType 
     * @param {string} code 
     * @param {string} redirectUri 
     * @param {string} codeVerifier 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    connectTokenRaw(requestParameters: ConnectTokenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConnectGrant>>;

    /**
     * What the application\'s server calls, at the workspace `iss` named, with the code and the PKCE verifier. Form-encoded, as OAuth: `grant_type=authorization_code`, `code`, `redirect_uri` (the one the code was made for) and `code_verifier`; the application authenticates with HTTP Basic, `client_id:secret`, checked against the SHA-256 kept.  **The key is minted now**, as the application\'s (`app:<id>`), not the admin\'s who approved: it outlives them, and offboarding them does not touch it. It is named after the application (`<name>: <context>`), lasts a year, and holds what of the scopes approved an application may hold. The link is recorded, with who approved it: listed and revoked at `/v1/connect/links`.  `workspace.sandboxesCa` is the certificate authority of the workspace\'s runyard-sandboxes server, read from it now with the workspace\'s key: an application serving its own broker to the workspace\'s sessions trusts it to know their sandboxes. A CA that cannot be read fails the exchange (`500 server_error`) before anything is minted.  Errors are OAuth\'s (RFC 6749 §5.2): `401 invalid_client` for an unknown application or a wrong secret; `400 invalid_grant` for a code unknown, used, older than 60 seconds, made for another application or redirect, shown with the wrong verifier, or whose approver is no longer an admin holding what it approved — one answer for all of them. 
     * Exchange a code for the link and its key
     */
    connectToken(requestParameters: ConnectTokenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConnectGrant>;

    /**
     * Creates request options for decideConnectConsent without sending the request
     * @param {ConnectDecision} connectDecision 
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    decideConnectConsentRequestOpts(requestParameters: DecideConnectConsentRequest): Promise<runtime.RequestOpts>;

    /**
     * The consent page\'s buttons, as the admin signed in. Everything the authorize request said is judged again here: this is the call anybody could make.  **Approved**, nothing is minted yet: a code is made, bound to the application, the redirect, `codeChallenge` and the caller, which lasts 60 seconds and works once; only its SHA-256 is kept, in this server\'s memory. The answer is where the browser goes with it. **Denied**, the answer is the application\'s redirect with `error=access_denied`. Either carries `state` as given, and `iss`.  An admin\'s, with `keys.admin`; from a browser, only from this server\'s own pages (`Sec-Fetch-Site`). 
     * @summary Approve or deny an application
     * @param {ConnectDecision} connectDecision 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    decideConnectConsentRaw(requestParameters: DecideConnectConsentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConnectRedirect>>;

    /**
     * The consent page\'s buttons, as the admin signed in. Everything the authorize request said is judged again here: this is the call anybody could make.  **Approved**, nothing is minted yet: a code is made, bound to the application, the redirect, `codeChallenge` and the caller, which lasts 60 seconds and works once; only its SHA-256 is kept, in this server\'s memory. The answer is where the browser goes with it. **Denied**, the answer is the application\'s redirect with `error=access_denied`. Either carries `state` as given, and `iss`.  An admin\'s, with `keys.admin`; from a browser, only from this server\'s own pages (`Sec-Fetch-Site`). 
     * Approve or deny an application
     */
    decideConnectConsent(requestParameters: DecideConnectConsentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConnectRedirect>;

    /**
     * Creates request options for getConnectConsent without sending the request
     * @param {string} clientId 
     * @param {string} redirectUri 
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    getConnectConsentRequestOpts(requestParameters: GetConnectConsentRequest): Promise<runtime.RequestOpts>;

    /**
     * The application a request to `GET /v1/connect/authorize` names, as the consent page shows it: its name, the scopes the key would hold — the application\'s, of those the caller holds — and whether the caller may approve, which only an admin of the workspace holding `keys.admin` may. Anybody signed in may ask. An unknown application, or a redirect not one of its, is `404`. 
     * @summary What the consent page asks the person signed in
     * @param {string} clientId 
     * @param {string} redirectUri 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    getConnectConsentRaw(requestParameters: GetConnectConsentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConnectConsent>>;

    /**
     * The application a request to `GET /v1/connect/authorize` names, as the consent page shows it: its name, the scopes the key would hold — the application\'s, of those the caller holds — and whether the caller may approve, which only an admin of the workspace holding `keys.admin` may. Anybody signed in may ask. An unknown application, or a redirect not one of its, is `404`. 
     * What the consent page asks the person signed in
     */
    getConnectConsent(requestParameters: GetConnectConsentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConnectConsent>;

    /**
     * Creates request options for listConnectApps without sending the request
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    listConnectAppsRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * Every application the workspace knows: those its release names (`--apps-file`, `source: release`), which are changed only by a new release, and those an admin registered here (`source: console`). Never a secret, nor its hash. An admin\'s, with `keys.admin`. 
     * @summary The applications that may connect to the workspace
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    listConnectAppsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConnectAppList>>;

    /**
     * Every application the workspace knows: those its release names (`--apps-file`, `source: release`), which are changed only by a new release, and those an admin registered here (`source: console`). Never a secret, nor its hash. An admin\'s, with `keys.admin`. 
     * The applications that may connect to the workspace
     */
    listConnectApps(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConnectAppList>;

    /**
     * Creates request options for listConnectLinks without sending the request
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    listConnectLinksRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * Each link an admin approved and its application exchanged: the application, who approved it, and the key it holds. A link ends when its key is revoked — here, at `DELETE /v1/keys/{keyId}`, or by the application handing it back — and when its application is removed. An admin\'s, with `keys.admin`. 
     * @summary The applications connected to the workspace
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    listConnectLinksRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConnectLinkList>>;

    /**
     * Each link an admin approved and its application exchanged: the application, who approved it, and the key it holds. A link ends when its key is revoked — here, at `DELETE /v1/keys/{keyId}`, or by the application handing it back — and when its application is removed. An admin\'s, with `keys.admin`. 
     * The applications connected to the workspace
     */
    listConnectLinks(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConnectLinkList>;

    /**
     * Creates request options for registerConnectApp without sending the request
     * @param {NewConnectApp} newConnectApp 
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    registerConnectAppRequestOpts(requestParameters: RegisterConnectAppRequest): Promise<runtime.RequestOpts>;

    /**
     * For a workspace no platform passes applications to — a self-hosted one — or one more beside them. The secret the application authenticates with at `POST /v1/connect/token` is made here and is in this answer and nowhere else, ever: only its SHA-256 is kept. An admin\'s, with `keys.admin`. An id already taken, by a release application or a registered one, is `409 conflict`. 
     * @summary Register an application
     * @param {NewConnectApp} newConnectApp 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    registerConnectAppRaw(requestParameters: RegisterConnectAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RegisteredConnectApp>>;

    /**
     * For a workspace no platform passes applications to — a self-hosted one — or one more beside them. The secret the application authenticates with at `POST /v1/connect/token` is made here and is in this answer and nowhere else, ever: only its SHA-256 is kept. An admin\'s, with `keys.admin`. An id already taken, by a release application or a registered one, is `409 conflict`. 
     * Register an application
     */
    registerConnectApp(requestParameters: RegisterConnectAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RegisteredConnectApp>;

    /**
     * Creates request options for removeConnectApp without sending the request
     * @param {string} appId 
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    removeConnectAppRequestOpts(requestParameters: RemoveConnectAppRequest): Promise<runtime.RequestOpts>;

    /**
     * An application registered in the console goes, and every link made with it is revoked with it: their keys stop working at once. A release\'s application is the release\'s to remove: `409 managed`. An admin\'s, with `keys.admin`. 
     * @summary Remove a registered application, and its links
     * @param {string} appId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    removeConnectAppRaw(requestParameters: RemoveConnectAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * An application registered in the console goes, and every link made with it is revoked with it: their keys stop working at once. A release\'s application is the release\'s to remove: `409 managed`. An admin\'s, with `keys.admin`. 
     * Remove a registered application, and its links
     */
    removeConnectApp(requestParameters: RemoveConnectAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for revokeConnectLink without sending the request
     * @param {string} linkId 
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    revokeConnectLinkRequestOpts(requestParameters: RevokeConnectLinkRequest): Promise<runtime.RequestOpts>;

    /**
     * The link\'s key is revoked, at once, and the link goes with it. An admin\'s, with `keys.admin`.
     * @summary Disconnect an application
     * @param {string} linkId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ConnectApiInterface
     */
    revokeConnectLinkRaw(requestParameters: RevokeConnectLinkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * The link\'s key is revoked, at once, and the link goes with it. An admin\'s, with `keys.admin`.
     * Disconnect an application
     */
    revokeConnectLink(requestParameters: RevokeConnectLinkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

}

/**
 * 
 */
export class ConnectApi extends runtime.BaseAPI implements ConnectApiInterface {

    /**
     * Creates request options for connectToken without sending the request
     */
    async connectTokenRequestOpts(requestParameters: ConnectTokenRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['grantType'] == null) {
            throw new runtime.RequiredError(
                'grantType',
                'Required parameter "grantType" was null or undefined when calling connectToken().'
            );
        }

        if (requestParameters['code'] == null) {
            throw new runtime.RequiredError(
                'code',
                'Required parameter "code" was null or undefined when calling connectToken().'
            );
        }

        if (requestParameters['redirectUri'] == null) {
            throw new runtime.RequiredError(
                'redirectUri',
                'Required parameter "redirectUri" was null or undefined when calling connectToken().'
            );
        }

        if (requestParameters['codeVerifier'] == null) {
            throw new runtime.RequiredError(
                'codeVerifier',
                'Required parameter "codeVerifier" was null or undefined when calling connectToken().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa((this.configuration.username || "") + ":" + (this.configuration.password || ""));
        }
        const consumes: runtime.Consume[] = [
            { contentType: 'application/x-www-form-urlencoded' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters['grantType'] != null) {
            formParams.append('grant_type', requestParameters['grantType'] as any);
        }

        if (requestParameters['code'] != null) {
            formParams.append('code', requestParameters['code'] as any);
        }

        if (requestParameters['redirectUri'] != null) {
            formParams.append('redirect_uri', requestParameters['redirectUri'] as any);
        }

        if (requestParameters['codeVerifier'] != null) {
            formParams.append('code_verifier', requestParameters['codeVerifier'] as any);
        }


        let urlPath = `/v1/connect/token`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        };
    }

    /**
     * What the application\'s server calls, at the workspace `iss` named, with the code and the PKCE verifier. Form-encoded, as OAuth: `grant_type=authorization_code`, `code`, `redirect_uri` (the one the code was made for) and `code_verifier`; the application authenticates with HTTP Basic, `client_id:secret`, checked against the SHA-256 kept.  **The key is minted now**, as the application\'s (`app:<id>`), not the admin\'s who approved: it outlives them, and offboarding them does not touch it. It is named after the application (`<name>: <context>`), lasts a year, and holds what of the scopes approved an application may hold. The link is recorded, with who approved it: listed and revoked at `/v1/connect/links`.  `workspace.sandboxesCa` is the certificate authority of the workspace\'s runyard-sandboxes server, read from it now with the workspace\'s key: an application serving its own broker to the workspace\'s sessions trusts it to know their sandboxes. A CA that cannot be read fails the exchange (`500 server_error`) before anything is minted.  Errors are OAuth\'s (RFC 6749 §5.2): `401 invalid_client` for an unknown application or a wrong secret; `400 invalid_grant` for a code unknown, used, older than 60 seconds, made for another application or redirect, shown with the wrong verifier, or whose approver is no longer an admin holding what it approved — one answer for all of them. 
     * Exchange a code for the link and its key
     */
    async connectTokenRaw(requestParameters: ConnectTokenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConnectGrant>> {
        const requestOptions = await this.connectTokenRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ConnectGrantFromJSON(jsonValue));
    }

    /**
     * What the application\'s server calls, at the workspace `iss` named, with the code and the PKCE verifier. Form-encoded, as OAuth: `grant_type=authorization_code`, `code`, `redirect_uri` (the one the code was made for) and `code_verifier`; the application authenticates with HTTP Basic, `client_id:secret`, checked against the SHA-256 kept.  **The key is minted now**, as the application\'s (`app:<id>`), not the admin\'s who approved: it outlives them, and offboarding them does not touch it. It is named after the application (`<name>: <context>`), lasts a year, and holds what of the scopes approved an application may hold. The link is recorded, with who approved it: listed and revoked at `/v1/connect/links`.  `workspace.sandboxesCa` is the certificate authority of the workspace\'s runyard-sandboxes server, read from it now with the workspace\'s key: an application serving its own broker to the workspace\'s sessions trusts it to know their sandboxes. A CA that cannot be read fails the exchange (`500 server_error`) before anything is minted.  Errors are OAuth\'s (RFC 6749 §5.2): `401 invalid_client` for an unknown application or a wrong secret; `400 invalid_grant` for a code unknown, used, older than 60 seconds, made for another application or redirect, shown with the wrong verifier, or whose approver is no longer an admin holding what it approved — one answer for all of them. 
     * Exchange a code for the link and its key
     */
    async connectToken(requestParameters: ConnectTokenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConnectGrant> {
        const response = await this.connectTokenRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for decideConnectConsent without sending the request
     */
    async decideConnectConsentRequestOpts(requestParameters: DecideConnectConsentRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['connectDecision'] == null) {
            throw new runtime.RequiredError(
                'connectDecision',
                'Required parameter "connectDecision" was null or undefined when calling decideConnectConsent().'
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

        let urlPath = `/v1/connect/consent`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ConnectDecisionToJSON(requestParameters['connectDecision']),
        };
    }

    /**
     * The consent page\'s buttons, as the admin signed in. Everything the authorize request said is judged again here: this is the call anybody could make.  **Approved**, nothing is minted yet: a code is made, bound to the application, the redirect, `codeChallenge` and the caller, which lasts 60 seconds and works once; only its SHA-256 is kept, in this server\'s memory. The answer is where the browser goes with it. **Denied**, the answer is the application\'s redirect with `error=access_denied`. Either carries `state` as given, and `iss`.  An admin\'s, with `keys.admin`; from a browser, only from this server\'s own pages (`Sec-Fetch-Site`). 
     * Approve or deny an application
     */
    async decideConnectConsentRaw(requestParameters: DecideConnectConsentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConnectRedirect>> {
        const requestOptions = await this.decideConnectConsentRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ConnectRedirectFromJSON(jsonValue));
    }

    /**
     * The consent page\'s buttons, as the admin signed in. Everything the authorize request said is judged again here: this is the call anybody could make.  **Approved**, nothing is minted yet: a code is made, bound to the application, the redirect, `codeChallenge` and the caller, which lasts 60 seconds and works once; only its SHA-256 is kept, in this server\'s memory. The answer is where the browser goes with it. **Denied**, the answer is the application\'s redirect with `error=access_denied`. Either carries `state` as given, and `iss`.  An admin\'s, with `keys.admin`; from a browser, only from this server\'s own pages (`Sec-Fetch-Site`). 
     * Approve or deny an application
     */
    async decideConnectConsent(requestParameters: DecideConnectConsentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConnectRedirect> {
        const response = await this.decideConnectConsentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getConnectConsent without sending the request
     */
    async getConnectConsentRequestOpts(requestParameters: GetConnectConsentRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['clientId'] == null) {
            throw new runtime.RequiredError(
                'clientId',
                'Required parameter "clientId" was null or undefined when calling getConnectConsent().'
            );
        }

        if (requestParameters['redirectUri'] == null) {
            throw new runtime.RequiredError(
                'redirectUri',
                'Required parameter "redirectUri" was null or undefined when calling getConnectConsent().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['clientId'] != null) {
            queryParameters['client_id'] = requestParameters['clientId'];
        }

        if (requestParameters['redirectUri'] != null) {
            queryParameters['redirect_uri'] = requestParameters['redirectUri'];
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

        let urlPath = `/v1/connect/consent`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The application a request to `GET /v1/connect/authorize` names, as the consent page shows it: its name, the scopes the key would hold — the application\'s, of those the caller holds — and whether the caller may approve, which only an admin of the workspace holding `keys.admin` may. Anybody signed in may ask. An unknown application, or a redirect not one of its, is `404`. 
     * What the consent page asks the person signed in
     */
    async getConnectConsentRaw(requestParameters: GetConnectConsentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConnectConsent>> {
        const requestOptions = await this.getConnectConsentRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ConnectConsentFromJSON(jsonValue));
    }

    /**
     * The application a request to `GET /v1/connect/authorize` names, as the consent page shows it: its name, the scopes the key would hold — the application\'s, of those the caller holds — and whether the caller may approve, which only an admin of the workspace holding `keys.admin` may. Anybody signed in may ask. An unknown application, or a redirect not one of its, is `404`. 
     * What the consent page asks the person signed in
     */
    async getConnectConsent(requestParameters: GetConnectConsentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConnectConsent> {
        const response = await this.getConnectConsentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listConnectApps without sending the request
     */
    async listConnectAppsRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/connect/apps`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every application the workspace knows: those its release names (`--apps-file`, `source: release`), which are changed only by a new release, and those an admin registered here (`source: console`). Never a secret, nor its hash. An admin\'s, with `keys.admin`. 
     * The applications that may connect to the workspace
     */
    async listConnectAppsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConnectAppList>> {
        const requestOptions = await this.listConnectAppsRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ConnectAppListFromJSON(jsonValue));
    }

    /**
     * Every application the workspace knows: those its release names (`--apps-file`, `source: release`), which are changed only by a new release, and those an admin registered here (`source: console`). Never a secret, nor its hash. An admin\'s, with `keys.admin`. 
     * The applications that may connect to the workspace
     */
    async listConnectApps(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConnectAppList> {
        const response = await this.listConnectAppsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listConnectLinks without sending the request
     */
    async listConnectLinksRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/connect/links`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Each link an admin approved and its application exchanged: the application, who approved it, and the key it holds. A link ends when its key is revoked — here, at `DELETE /v1/keys/{keyId}`, or by the application handing it back — and when its application is removed. An admin\'s, with `keys.admin`. 
     * The applications connected to the workspace
     */
    async listConnectLinksRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConnectLinkList>> {
        const requestOptions = await this.listConnectLinksRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ConnectLinkListFromJSON(jsonValue));
    }

    /**
     * Each link an admin approved and its application exchanged: the application, who approved it, and the key it holds. A link ends when its key is revoked — here, at `DELETE /v1/keys/{keyId}`, or by the application handing it back — and when its application is removed. An admin\'s, with `keys.admin`. 
     * The applications connected to the workspace
     */
    async listConnectLinks(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConnectLinkList> {
        const response = await this.listConnectLinksRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for registerConnectApp without sending the request
     */
    async registerConnectAppRequestOpts(requestParameters: RegisterConnectAppRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['newConnectApp'] == null) {
            throw new runtime.RequiredError(
                'newConnectApp',
                'Required parameter "newConnectApp" was null or undefined when calling registerConnectApp().'
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

        let urlPath = `/v1/connect/apps`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: NewConnectAppToJSON(requestParameters['newConnectApp']),
        };
    }

    /**
     * For a workspace no platform passes applications to — a self-hosted one — or one more beside them. The secret the application authenticates with at `POST /v1/connect/token` is made here and is in this answer and nowhere else, ever: only its SHA-256 is kept. An admin\'s, with `keys.admin`. An id already taken, by a release application or a registered one, is `409 conflict`. 
     * Register an application
     */
    async registerConnectAppRaw(requestParameters: RegisterConnectAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RegisteredConnectApp>> {
        const requestOptions = await this.registerConnectAppRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RegisteredConnectAppFromJSON(jsonValue));
    }

    /**
     * For a workspace no platform passes applications to — a self-hosted one — or one more beside them. The secret the application authenticates with at `POST /v1/connect/token` is made here and is in this answer and nowhere else, ever: only its SHA-256 is kept. An admin\'s, with `keys.admin`. An id already taken, by a release application or a registered one, is `409 conflict`. 
     * Register an application
     */
    async registerConnectApp(requestParameters: RegisterConnectAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RegisteredConnectApp> {
        const response = await this.registerConnectAppRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for removeConnectApp without sending the request
     */
    async removeConnectAppRequestOpts(requestParameters: RemoveConnectAppRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['appId'] == null) {
            throw new runtime.RequiredError(
                'appId',
                'Required parameter "appId" was null or undefined when calling removeConnectApp().'
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

        let urlPath = `/v1/connect/apps/{appId}`;
        urlPath = urlPath.replace('{appId}', encodeURIComponent(String(requestParameters['appId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * An application registered in the console goes, and every link made with it is revoked with it: their keys stop working at once. A release\'s application is the release\'s to remove: `409 managed`. An admin\'s, with `keys.admin`. 
     * Remove a registered application, and its links
     */
    async removeConnectAppRaw(requestParameters: RemoveConnectAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.removeConnectAppRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * An application registered in the console goes, and every link made with it is revoked with it: their keys stop working at once. A release\'s application is the release\'s to remove: `409 managed`. An admin\'s, with `keys.admin`. 
     * Remove a registered application, and its links
     */
    async removeConnectApp(requestParameters: RemoveConnectAppRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.removeConnectAppRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for revokeConnectLink without sending the request
     */
    async revokeConnectLinkRequestOpts(requestParameters: RevokeConnectLinkRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['linkId'] == null) {
            throw new runtime.RequiredError(
                'linkId',
                'Required parameter "linkId" was null or undefined when calling revokeConnectLink().'
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

        let urlPath = `/v1/connect/links/{linkId}`;
        urlPath = urlPath.replace('{linkId}', encodeURIComponent(String(requestParameters['linkId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The link\'s key is revoked, at once, and the link goes with it. An admin\'s, with `keys.admin`.
     * Disconnect an application
     */
    async revokeConnectLinkRaw(requestParameters: RevokeConnectLinkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.revokeConnectLinkRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The link\'s key is revoked, at once, and the link goes with it. An admin\'s, with `keys.admin`.
     * Disconnect an application
     */
    async revokeConnectLink(requestParameters: RevokeConnectLinkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.revokeConnectLinkRaw(requestParameters, initOverrides);
    }

}
