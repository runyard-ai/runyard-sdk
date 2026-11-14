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
    type Key,
    KeyFromJSON,
    KeyToJSON,
} from '../models/Key.js';
import {
    type KeyAuthorization,
    KeyAuthorizationFromJSON,
    KeyAuthorizationToJSON,
} from '../models/KeyAuthorization.js';
import {
    type KeyAuthorizationRedemption,
    KeyAuthorizationRedemptionFromJSON,
    KeyAuthorizationRedemptionToJSON,
} from '../models/KeyAuthorizationRedemption.js';
import {
    type KeyAuthorizationRequest,
    KeyAuthorizationRequestFromJSON,
    KeyAuthorizationRequestToJSON,
} from '../models/KeyAuthorizationRequest.js';
import {
    type KeyChange,
    KeyChangeFromJSON,
    KeyChangeToJSON,
} from '../models/KeyChange.js';
import {
    type KeyPage,
    KeyPageFromJSON,
    KeyPageToJSON,
} from '../models/KeyPage.js';
import {
    type MintedKey,
    MintedKeyFromJSON,
    MintedKeyToJSON,
} from '../models/MintedKey.js';
import {
    type NewKey,
    NewKeyFromJSON,
    NewKeyToJSON,
} from '../models/NewKey.js';

export interface AuthorizeKeyRequest {
    /**
     * 
     */
    keyAuthorizationRequest: KeyAuthorizationRequest;
}

export interface ChangeKeyRequest {
    /**
     * 
     */
    keyId: string;
    /**
     * 
     */
    keyChange: KeyChange;
}

export interface CreateKeyRequest {
    /**
     * 
     */
    newKey: NewKey;
}

export interface GetKeyRequest {
    /**
     * 
     */
    keyId: string;
}

export interface ListKeysRequest {
    /**
     * At most this many; the default and ceiling are in `GET /v1/info`.
     */
    limit?: number;
    /**
     * From a previous page's `nextCursor`. Opaque; one made up is `400`.
     */
    cursor?: string;
}

export interface RedeemKeyAuthorizationRequest {
    /**
     * 
     */
    keyAuthorizationRedemption: KeyAuthorizationRedemption;
}

export interface RevokeKeyRequest {
    /**
     * 
     */
    keyId: string;
}

/**
 * KeysApi - interface
 * 
 * @export
 * @interface KeysApiInterface
 */
export interface KeysApiInterface {
    /**
     * Creates request options for authorizeKey without sending the request
     * @param {KeyAuthorizationRequest} keyAuthorizationRequest 
     * @throws {RequiredError}
     * @memberof KeysApiInterface
     */
    authorizeKeyRequestOpts(requestParameters: AuthorizeKeyRequest): Promise<runtime.RequestOpts>;

    /**
     * **A program on a person\'s machine asks that person for its key**, rather than being pasted one: OAuth\'s authorization code with PKCE and a loopback redirect (RFC 7636, RFC 8252).  1. The program makes a random `code_verifier`, listens on a port of    its own loopback, and opens the person\'s browser at the console\'s    `/console/authorize`, saying what it wants. 2. The person, signed in, approves or denies. Approving is this    call, made by the page as them: nothing is minted, and a code    comes back. 3. The page sends the browser to the program\'s `redirect_uri` with    `code` and `state` — or `error=access_denied` and `state` — or,    with no `redirect_uri`, shows the code for the person to paste. 4. The program trades the code and its verifier for the key at    `POST /v1/keys/authorizations/redeem`.  The page reads what is asked from its query, and the server reads none of it:  | parameter | what it says | |---|---| | `client` | What is asking, in its own words: `ryclaude on ada-laptop`. Required; the key is named it, its ends trimmed and each run of spaces made one. | | `scopes` | The scopes asked for (`Scope`), separated by commas. Required. | | `code_challenge` | `codeChallenge`. Required. | | `redirect_uri` | Where the program listens for the code, as `redirectUri` takes it. | | `state` | Handed back to `redirect_uri` as it was given. |  Signed out, the page signs the person in and comes back to the same address. A `redirect_uri` that is not loopback, a `code_challenge` that is not one, or a scope this contract does not define, and it offers nothing to approve and sends the browser nowhere.  Needs `keys.admin`, and approves exactly what `POST /v1/keys` would mint for the same caller: scopes it holds, an expiry within ten years. **The key is the caller\'s own**: there is no `owner`. From a browser, only the server\'s own pages may call it.  **The code is not the key.** It passes through a browser\'s address bar, so it is bound to `codeChallenge`, the SHA-256 of a verifier only the program holds. It lasts five minutes, and only its SHA-256 is kept, in this server\'s memory: a restart forgets every approval waiting. An approval made with a key goes with that key: revoked or expired, what it approved can no longer be redeemed. 
     * @summary Approve a key for a program that asked for one
     * @param {KeyAuthorizationRequest} keyAuthorizationRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof KeysApiInterface
     */
    authorizeKeyRaw(requestParameters: AuthorizeKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<KeyAuthorization>>;

    /**
     * **A program on a person\'s machine asks that person for its key**, rather than being pasted one: OAuth\'s authorization code with PKCE and a loopback redirect (RFC 7636, RFC 8252).  1. The program makes a random `code_verifier`, listens on a port of    its own loopback, and opens the person\'s browser at the console\'s    `/console/authorize`, saying what it wants. 2. The person, signed in, approves or denies. Approving is this    call, made by the page as them: nothing is minted, and a code    comes back. 3. The page sends the browser to the program\'s `redirect_uri` with    `code` and `state` — or `error=access_denied` and `state` — or,    with no `redirect_uri`, shows the code for the person to paste. 4. The program trades the code and its verifier for the key at    `POST /v1/keys/authorizations/redeem`.  The page reads what is asked from its query, and the server reads none of it:  | parameter | what it says | |---|---| | `client` | What is asking, in its own words: `ryclaude on ada-laptop`. Required; the key is named it, its ends trimmed and each run of spaces made one. | | `scopes` | The scopes asked for (`Scope`), separated by commas. Required. | | `code_challenge` | `codeChallenge`. Required. | | `redirect_uri` | Where the program listens for the code, as `redirectUri` takes it. | | `state` | Handed back to `redirect_uri` as it was given. |  Signed out, the page signs the person in and comes back to the same address. A `redirect_uri` that is not loopback, a `code_challenge` that is not one, or a scope this contract does not define, and it offers nothing to approve and sends the browser nowhere.  Needs `keys.admin`, and approves exactly what `POST /v1/keys` would mint for the same caller: scopes it holds, an expiry within ten years. **The key is the caller\'s own**: there is no `owner`. From a browser, only the server\'s own pages may call it.  **The code is not the key.** It passes through a browser\'s address bar, so it is bound to `codeChallenge`, the SHA-256 of a verifier only the program holds. It lasts five minutes, and only its SHA-256 is kept, in this server\'s memory: a restart forgets every approval waiting. An approval made with a key goes with that key: revoked or expired, what it approved can no longer be redeemed. 
     * Approve a key for a program that asked for one
     */
    authorizeKey(requestParameters: AuthorizeKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<KeyAuthorization>;

    /**
     * Creates request options for changeKey without sending the request
     * @param {string} keyId 
     * @param {KeyChange} keyChange 
     * @throws {RequiredError}
     * @memberof KeysApiInterface
     */
    changeKeyRequestOpts(requestParameters: ChangeKeyRequest): Promise<runtime.RequestOpts>;

    /**
     * With `keys.admin`: the caller\'s own keys, or anybody\'s for an admin. The scopes sent replace the key\'s, at once: the next call made with it holds what it holds now. Its secret, name and expiry stay as they were.  **A key is never made wider than whoever changes it**, as when it is minted: a scope the caller does not hold is refused. Nor is it given one its owner does not hold, which it could not use today and would the day they were made an admin. 
     * @summary Change what a key may do
     * @param {string} keyId 
     * @param {KeyChange} keyChange 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof KeysApiInterface
     */
    changeKeyRaw(requestParameters: ChangeKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Key>>;

    /**
     * With `keys.admin`: the caller\'s own keys, or anybody\'s for an admin. The scopes sent replace the key\'s, at once: the next call made with it holds what it holds now. Its secret, name and expiry stay as they were.  **A key is never made wider than whoever changes it**, as when it is minted: a scope the caller does not hold is refused. Nor is it given one its owner does not hold, which it could not use today and would the day they were made an admin. 
     * Change what a key may do
     */
    changeKey(requestParameters: ChangeKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Key>;

    /**
     * Creates request options for createKey without sending the request
     * @param {NewKey} newKey 
     * @throws {RequiredError}
     * @memberof KeysApiInterface
     */
    createKeyRequestOpts(requestParameters: CreateKeyRequest): Promise<runtime.RequestOpts>;

    /**
     * The secret is in this answer and nowhere else, ever: the server keeps its hash. A key may not be given a scope its creator does not hold, and is its creator\'s: it does no more than they may, goes with them when they are removed, and a member revokes only their own. 
     * @summary Mint a key
     * @param {NewKey} newKey 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof KeysApiInterface
     */
    createKeyRaw(requestParameters: CreateKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MintedKey>>;

    /**
     * The secret is in this answer and nowhere else, ever: the server keeps its hash. A key may not be given a scope its creator does not hold, and is its creator\'s: it does no more than they may, goes with them when they are removed, and a member revokes only their own. 
     * Mint a key
     */
    createKey(requestParameters: CreateKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MintedKey>;

    /**
     * Creates request options for getKey without sending the request
     * @param {string} keyId 
     * @throws {RequiredError}
     * @memberof KeysApiInterface
     */
    getKeyRequestOpts(requestParameters: GetKeyRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary A key
     * @param {string} keyId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof KeysApiInterface
     */
    getKeyRaw(requestParameters: GetKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Key>>;

    /**
     * A key
     */
    getKey(requestParameters: GetKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Key>;

    /**
     * Creates request options for listKeys without sending the request
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @throws {RequiredError}
     * @memberof KeysApiInterface
     */
    listKeysRequestOpts(requestParameters: ListKeysRequest): Promise<runtime.RequestOpts>;

    /**
     * Every key, for an admin; a member\'s own, for a member.
     * @summary The keys of the workspace
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof KeysApiInterface
     */
    listKeysRaw(requestParameters: ListKeysRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<KeyPage>>;

    /**
     * Every key, for an admin; a member\'s own, for a member.
     * The keys of the workspace
     */
    listKeys(requestParameters: ListKeysRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<KeyPage>;

    /**
     * Creates request options for redeemKeyAuthorization without sending the request
     * @param {KeyAuthorizationRedemption} keyAuthorizationRedemption 
     * @throws {RequiredError}
     * @memberof KeysApiInterface
     */
    redeemKeyAuthorizationRequestOpts(requestParameters: RedeemKeyAuthorizationRequest): Promise<runtime.RequestOpts>;

    /**
     * What the program that asked calls, with the code the person\'s browser brought it and the verifier it made before asking. The key is minted now, as its approver\'s, and this answer is the only place its secret ever is.  Without a key: this is how a program gets its first. The code and the verifier stand in for one, and neither is worth anything without the other.  **A code works once**, and is spent by being presented, with the right verifier or the wrong one.  **One answer for every code that yields no key**: one never given, already redeemed, older than five minutes, shown with the wrong verifier, whose approver is gone or no longer holds `keys.admin` or a scope approved, or whose approving key was revoked or has expired. Which it was is what somebody holding a stolen code would like to know. 
     * @summary Trade an approval\'s code for its key
     * @param {KeyAuthorizationRedemption} keyAuthorizationRedemption 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof KeysApiInterface
     */
    redeemKeyAuthorizationRaw(requestParameters: RedeemKeyAuthorizationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MintedKey>>;

    /**
     * What the program that asked calls, with the code the person\'s browser brought it and the verifier it made before asking. The key is minted now, as its approver\'s, and this answer is the only place its secret ever is.  Without a key: this is how a program gets its first. The code and the verifier stand in for one, and neither is worth anything without the other.  **A code works once**, and is spent by being presented, with the right verifier or the wrong one.  **One answer for every code that yields no key**: one never given, already redeemed, older than five minutes, shown with the wrong verifier, whose approver is gone or no longer holds `keys.admin` or a scope approved, or whose approving key was revoked or has expired. Which it was is what somebody holding a stolen code would like to know. 
     * Trade an approval\'s code for its key
     */
    redeemKeyAuthorization(requestParameters: RedeemKeyAuthorizationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MintedKey>;

    /**
     * Creates request options for revokeKey without sending the request
     * @param {string} keyId 
     * @throws {RequiredError}
     * @memberof KeysApiInterface
     */
    revokeKeyRequestOpts(requestParameters: RevokeKeyRequest): Promise<runtime.RequestOpts>;

    /**
     * With `keys.admin`: the caller\'s own keys, or anybody\'s for an admin.  **Any key may revoke itself**, whatever its scopes: called with a key naming its own id, this needs nothing else. So a program given a key hands it back when it is done. 
     * @summary Revoke a key, at once
     * @param {string} keyId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof KeysApiInterface
     */
    revokeKeyRaw(requestParameters: RevokeKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * With `keys.admin`: the caller\'s own keys, or anybody\'s for an admin.  **Any key may revoke itself**, whatever its scopes: called with a key naming its own id, this needs nothing else. So a program given a key hands it back when it is done. 
     * Revoke a key, at once
     */
    revokeKey(requestParameters: RevokeKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

}

/**
 * 
 */
export class KeysApi extends runtime.BaseAPI implements KeysApiInterface {

    /**
     * Creates request options for authorizeKey without sending the request
     */
    async authorizeKeyRequestOpts(requestParameters: AuthorizeKeyRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['keyAuthorizationRequest'] == null) {
            throw new runtime.RequiredError(
                'keyAuthorizationRequest',
                'Required parameter "keyAuthorizationRequest" was null or undefined when calling authorizeKey().'
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

        let urlPath = `/v1/keys/authorizations`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: KeyAuthorizationRequestToJSON(requestParameters['keyAuthorizationRequest']),
        };
    }

    /**
     * **A program on a person\'s machine asks that person for its key**, rather than being pasted one: OAuth\'s authorization code with PKCE and a loopback redirect (RFC 7636, RFC 8252).  1. The program makes a random `code_verifier`, listens on a port of    its own loopback, and opens the person\'s browser at the console\'s    `/console/authorize`, saying what it wants. 2. The person, signed in, approves or denies. Approving is this    call, made by the page as them: nothing is minted, and a code    comes back. 3. The page sends the browser to the program\'s `redirect_uri` with    `code` and `state` — or `error=access_denied` and `state` — or,    with no `redirect_uri`, shows the code for the person to paste. 4. The program trades the code and its verifier for the key at    `POST /v1/keys/authorizations/redeem`.  The page reads what is asked from its query, and the server reads none of it:  | parameter | what it says | |---|---| | `client` | What is asking, in its own words: `ryclaude on ada-laptop`. Required; the key is named it, its ends trimmed and each run of spaces made one. | | `scopes` | The scopes asked for (`Scope`), separated by commas. Required. | | `code_challenge` | `codeChallenge`. Required. | | `redirect_uri` | Where the program listens for the code, as `redirectUri` takes it. | | `state` | Handed back to `redirect_uri` as it was given. |  Signed out, the page signs the person in and comes back to the same address. A `redirect_uri` that is not loopback, a `code_challenge` that is not one, or a scope this contract does not define, and it offers nothing to approve and sends the browser nowhere.  Needs `keys.admin`, and approves exactly what `POST /v1/keys` would mint for the same caller: scopes it holds, an expiry within ten years. **The key is the caller\'s own**: there is no `owner`. From a browser, only the server\'s own pages may call it.  **The code is not the key.** It passes through a browser\'s address bar, so it is bound to `codeChallenge`, the SHA-256 of a verifier only the program holds. It lasts five minutes, and only its SHA-256 is kept, in this server\'s memory: a restart forgets every approval waiting. An approval made with a key goes with that key: revoked or expired, what it approved can no longer be redeemed. 
     * Approve a key for a program that asked for one
     */
    async authorizeKeyRaw(requestParameters: AuthorizeKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<KeyAuthorization>> {
        const requestOptions = await this.authorizeKeyRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => KeyAuthorizationFromJSON(jsonValue));
    }

    /**
     * **A program on a person\'s machine asks that person for its key**, rather than being pasted one: OAuth\'s authorization code with PKCE and a loopback redirect (RFC 7636, RFC 8252).  1. The program makes a random `code_verifier`, listens on a port of    its own loopback, and opens the person\'s browser at the console\'s    `/console/authorize`, saying what it wants. 2. The person, signed in, approves or denies. Approving is this    call, made by the page as them: nothing is minted, and a code    comes back. 3. The page sends the browser to the program\'s `redirect_uri` with    `code` and `state` — or `error=access_denied` and `state` — or,    with no `redirect_uri`, shows the code for the person to paste. 4. The program trades the code and its verifier for the key at    `POST /v1/keys/authorizations/redeem`.  The page reads what is asked from its query, and the server reads none of it:  | parameter | what it says | |---|---| | `client` | What is asking, in its own words: `ryclaude on ada-laptop`. Required; the key is named it, its ends trimmed and each run of spaces made one. | | `scopes` | The scopes asked for (`Scope`), separated by commas. Required. | | `code_challenge` | `codeChallenge`. Required. | | `redirect_uri` | Where the program listens for the code, as `redirectUri` takes it. | | `state` | Handed back to `redirect_uri` as it was given. |  Signed out, the page signs the person in and comes back to the same address. A `redirect_uri` that is not loopback, a `code_challenge` that is not one, or a scope this contract does not define, and it offers nothing to approve and sends the browser nowhere.  Needs `keys.admin`, and approves exactly what `POST /v1/keys` would mint for the same caller: scopes it holds, an expiry within ten years. **The key is the caller\'s own**: there is no `owner`. From a browser, only the server\'s own pages may call it.  **The code is not the key.** It passes through a browser\'s address bar, so it is bound to `codeChallenge`, the SHA-256 of a verifier only the program holds. It lasts five minutes, and only its SHA-256 is kept, in this server\'s memory: a restart forgets every approval waiting. An approval made with a key goes with that key: revoked or expired, what it approved can no longer be redeemed. 
     * Approve a key for a program that asked for one
     */
    async authorizeKey(requestParameters: AuthorizeKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<KeyAuthorization> {
        const response = await this.authorizeKeyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for changeKey without sending the request
     */
    async changeKeyRequestOpts(requestParameters: ChangeKeyRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['keyId'] == null) {
            throw new runtime.RequiredError(
                'keyId',
                'Required parameter "keyId" was null or undefined when calling changeKey().'
            );
        }

        if (requestParameters['keyChange'] == null) {
            throw new runtime.RequiredError(
                'keyChange',
                'Required parameter "keyChange" was null or undefined when calling changeKey().'
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

        let urlPath = `/v1/keys/{keyId}`;
        urlPath = urlPath.replace('{keyId}', encodeURIComponent(String(requestParameters['keyId'])));

        return {
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: KeyChangeToJSON(requestParameters['keyChange']),
        };
    }

    /**
     * With `keys.admin`: the caller\'s own keys, or anybody\'s for an admin. The scopes sent replace the key\'s, at once: the next call made with it holds what it holds now. Its secret, name and expiry stay as they were.  **A key is never made wider than whoever changes it**, as when it is minted: a scope the caller does not hold is refused. Nor is it given one its owner does not hold, which it could not use today and would the day they were made an admin. 
     * Change what a key may do
     */
    async changeKeyRaw(requestParameters: ChangeKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Key>> {
        const requestOptions = await this.changeKeyRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => KeyFromJSON(jsonValue));
    }

    /**
     * With `keys.admin`: the caller\'s own keys, or anybody\'s for an admin. The scopes sent replace the key\'s, at once: the next call made with it holds what it holds now. Its secret, name and expiry stay as they were.  **A key is never made wider than whoever changes it**, as when it is minted: a scope the caller does not hold is refused. Nor is it given one its owner does not hold, which it could not use today and would the day they were made an admin. 
     * Change what a key may do
     */
    async changeKey(requestParameters: ChangeKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Key> {
        const response = await this.changeKeyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for createKey without sending the request
     */
    async createKeyRequestOpts(requestParameters: CreateKeyRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['newKey'] == null) {
            throw new runtime.RequiredError(
                'newKey',
                'Required parameter "newKey" was null or undefined when calling createKey().'
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

        let urlPath = `/v1/keys`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: NewKeyToJSON(requestParameters['newKey']),
        };
    }

    /**
     * The secret is in this answer and nowhere else, ever: the server keeps its hash. A key may not be given a scope its creator does not hold, and is its creator\'s: it does no more than they may, goes with them when they are removed, and a member revokes only their own. 
     * Mint a key
     */
    async createKeyRaw(requestParameters: CreateKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MintedKey>> {
        const requestOptions = await this.createKeyRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => MintedKeyFromJSON(jsonValue));
    }

    /**
     * The secret is in this answer and nowhere else, ever: the server keeps its hash. A key may not be given a scope its creator does not hold, and is its creator\'s: it does no more than they may, goes with them when they are removed, and a member revokes only their own. 
     * Mint a key
     */
    async createKey(requestParameters: CreateKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MintedKey> {
        const response = await this.createKeyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getKey without sending the request
     */
    async getKeyRequestOpts(requestParameters: GetKeyRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['keyId'] == null) {
            throw new runtime.RequiredError(
                'keyId',
                'Required parameter "keyId" was null or undefined when calling getKey().'
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

        let urlPath = `/v1/keys/{keyId}`;
        urlPath = urlPath.replace('{keyId}', encodeURIComponent(String(requestParameters['keyId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A key
     */
    async getKeyRaw(requestParameters: GetKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Key>> {
        const requestOptions = await this.getKeyRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => KeyFromJSON(jsonValue));
    }

    /**
     * A key
     */
    async getKey(requestParameters: GetKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Key> {
        const response = await this.getKeyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listKeys without sending the request
     */
    async listKeysRequestOpts(requestParameters: ListKeysRequest): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/keys`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every key, for an admin; a member\'s own, for a member.
     * The keys of the workspace
     */
    async listKeysRaw(requestParameters: ListKeysRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<KeyPage>> {
        const requestOptions = await this.listKeysRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => KeyPageFromJSON(jsonValue));
    }

    /**
     * Every key, for an admin; a member\'s own, for a member.
     * The keys of the workspace
     */
    async listKeys(requestParameters: ListKeysRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<KeyPage> {
        const response = await this.listKeysRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for redeemKeyAuthorization without sending the request
     */
    async redeemKeyAuthorizationRequestOpts(requestParameters: RedeemKeyAuthorizationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['keyAuthorizationRedemption'] == null) {
            throw new runtime.RequiredError(
                'keyAuthorizationRedemption',
                'Required parameter "keyAuthorizationRedemption" was null or undefined when calling redeemKeyAuthorization().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';


        let urlPath = `/v1/keys/authorizations/redeem`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: KeyAuthorizationRedemptionToJSON(requestParameters['keyAuthorizationRedemption']),
        };
    }

    /**
     * What the program that asked calls, with the code the person\'s browser brought it and the verifier it made before asking. The key is minted now, as its approver\'s, and this answer is the only place its secret ever is.  Without a key: this is how a program gets its first. The code and the verifier stand in for one, and neither is worth anything without the other.  **A code works once**, and is spent by being presented, with the right verifier or the wrong one.  **One answer for every code that yields no key**: one never given, already redeemed, older than five minutes, shown with the wrong verifier, whose approver is gone or no longer holds `keys.admin` or a scope approved, or whose approving key was revoked or has expired. Which it was is what somebody holding a stolen code would like to know. 
     * Trade an approval\'s code for its key
     */
    async redeemKeyAuthorizationRaw(requestParameters: RedeemKeyAuthorizationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MintedKey>> {
        const requestOptions = await this.redeemKeyAuthorizationRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => MintedKeyFromJSON(jsonValue));
    }

    /**
     * What the program that asked calls, with the code the person\'s browser brought it and the verifier it made before asking. The key is minted now, as its approver\'s, and this answer is the only place its secret ever is.  Without a key: this is how a program gets its first. The code and the verifier stand in for one, and neither is worth anything without the other.  **A code works once**, and is spent by being presented, with the right verifier or the wrong one.  **One answer for every code that yields no key**: one never given, already redeemed, older than five minutes, shown with the wrong verifier, whose approver is gone or no longer holds `keys.admin` or a scope approved, or whose approving key was revoked or has expired. Which it was is what somebody holding a stolen code would like to know. 
     * Trade an approval\'s code for its key
     */
    async redeemKeyAuthorization(requestParameters: RedeemKeyAuthorizationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MintedKey> {
        const response = await this.redeemKeyAuthorizationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for revokeKey without sending the request
     */
    async revokeKeyRequestOpts(requestParameters: RevokeKeyRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['keyId'] == null) {
            throw new runtime.RequiredError(
                'keyId',
                'Required parameter "keyId" was null or undefined when calling revokeKey().'
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

        let urlPath = `/v1/keys/{keyId}`;
        urlPath = urlPath.replace('{keyId}', encodeURIComponent(String(requestParameters['keyId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * With `keys.admin`: the caller\'s own keys, or anybody\'s for an admin.  **Any key may revoke itself**, whatever its scopes: called with a key naming its own id, this needs nothing else. So a program given a key hands it back when it is done. 
     * Revoke a key, at once
     */
    async revokeKeyRaw(requestParameters: RevokeKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.revokeKeyRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * With `keys.admin`: the caller\'s own keys, or anybody\'s for an admin.  **Any key may revoke itself**, whatever its scopes: called with a key naming its own id, this needs nothing else. So a program given a key hands it back when it is done. 
     * Revoke a key, at once
     */
    async revokeKey(requestParameters: RevokeKeyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.revokeKeyRaw(requestParameters, initOverrides);
    }

}
