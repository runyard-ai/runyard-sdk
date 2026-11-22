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
    type Profile,
    ProfileFromJSON,
    ProfileToJSON,
} from '../models/Profile.js';
import {
    type ProfilePage,
    ProfilePageFromJSON,
    ProfilePageToJSON,
} from '../models/ProfilePage.js';
import {
    type ProfileSpec,
    ProfileSpecFromJSON,
    ProfileSpecToJSON,
} from '../models/ProfileSpec.js';
import {
    type ProfileVersionList,
    ProfileVersionListFromJSON,
    ProfileVersionListToJSON,
} from '../models/ProfileVersionList.js';
import {
    type Users,
    UsersFromJSON,
    UsersToJSON,
} from '../models/Users.js';

export interface DeleteProfileRequest {
    /**
     * 
     */
    profileId: string;
}

export interface GetProfileRequest {
    /**
     * 
     */
    profileId: string;
}

export interface GetProfileVersionRequest {
    /**
     * 
     */
    profileId: string;
    /**
     * 
     */
    version: number;
}

export interface ListProfileVersionsRequest {
    /**
     * 
     */
    profileId: string;
}

export interface ListProfilesRequest {
    /**
     * At most this many; the default and ceiling are in `GET /v1/info`.
     */
    limit?: number;
    /**
     * From a previous page's `nextCursor`. Opaque; one made up is `400`.
     */
    cursor?: string;
}

export interface PutProfileRequest {
    /**
     * 
     */
    profileId: string;
    /**
     * 
     */
    profileSpec: ProfileSpec;
}

export interface PutProfileUsersRequest {
    /**
     * 
     */
    profileId: string;
    /**
     * 
     */
    users: Users;
}

export interface RestoreProfileVersionRequest {
    /**
     * 
     */
    profileId: string;
    /**
     * 
     */
    version: number;
}

/**
 * ProfilesApi - interface
 * 
 * @export
 * @interface ProfilesApiInterface
 */
export interface ProfilesApiInterface {
    /**
     * Creates request options for deleteProfile without sending the request
     * @param {string} profileId 
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    deleteProfileRequestOpts(requestParameters: DeleteProfileRequest): Promise<runtime.RequestOpts>;

    /**
     * Sessions started from it go on as they were; triggers that start it are refused while they exist (`409 in_use`). 
     * @summary Delete a profile
     * @param {string} profileId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    deleteProfileRaw(requestParameters: DeleteProfileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Sessions started from it go on as they were; triggers that start it are refused while they exist (`409 in_use`). 
     * Delete a profile
     */
    deleteProfile(requestParameters: DeleteProfileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for getProfile without sending the request
     * @param {string} profileId 
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    getProfileRequestOpts(requestParameters: GetProfileRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary A profile, at its latest version
     * @param {string} profileId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    getProfileRaw(requestParameters: GetProfileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Profile>>;

    /**
     * A profile, at its latest version
     */
    getProfile(requestParameters: GetProfileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Profile>;

    /**
     * Creates request options for getProfileVersion without sending the request
     * @param {string} profileId 
     * @param {number} version 
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    getProfileVersionRequestOpts(requestParameters: GetProfileVersionRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary A profile as it was at one version
     * @param {string} profileId 
     * @param {number} version 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    getProfileVersionRaw(requestParameters: GetProfileVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Profile>>;

    /**
     * A profile as it was at one version
     */
    getProfileVersion(requestParameters: GetProfileVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Profile>;

    /**
     * Creates request options for listProfileVersions without sending the request
     * @param {string} profileId 
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    listProfileVersionsRequestOpts(requestParameters: ListProfileVersionsRequest): Promise<runtime.RequestOpts>;

    /**
     * What to test — a session is started from any of them with `profileVersion` — and what to go back to, with `POST …/versions/{version}/restore`. 
     * @summary Every version of a profile, newest first
     * @param {string} profileId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    listProfileVersionsRaw(requestParameters: ListProfileVersionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ProfileVersionList>>;

    /**
     * What to test — a session is started from any of them with `profileVersion` — and what to go back to, with `POST …/versions/{version}/restore`. 
     * Every version of a profile, newest first
     */
    listProfileVersions(requestParameters: ListProfileVersionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ProfileVersionList>;

    /**
     * Creates request options for listProfiles without sending the request
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    listProfilesRequestOpts(requestParameters: ListProfilesRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary Every profile of the account
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    listProfilesRaw(requestParameters: ListProfilesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ProfilePage>>;

    /**
     * Every profile of the account
     */
    listProfiles(requestParameters: ListProfilesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ProfilePage>;

    /**
     * Creates request options for putProfile without sending the request
     * @param {string} profileId 
     * @param {ProfileSpec} profileSpec 
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    putProfileRequestOpts(requestParameters: PutProfileRequest): Promise<runtime.RequestOpts>;

    /**
     * A profile is what a session is started from: a harness, provider and model, a system prompt, brokers, MCP connectors and sandbox resources. Each change is a new `version`; a session records the version it was started from, and is never changed by a later one. The same spec again makes no version. 
     * @summary Create a profile, or make a new version of it
     * @param {string} profileId 
     * @param {ProfileSpec} profileSpec 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    putProfileRaw(requestParameters: PutProfileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Profile>>;

    /**
     * A profile is what a session is started from: a harness, provider and model, a system prompt, brokers, MCP connectors and sandbox resources. Each change is a new `version`; a session records the version it was started from, and is never changed by a later one. The same spec again makes no version. 
     * Create a profile, or make a new version of it
     */
    putProfile(requestParameters: PutProfileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Profile>;

    /**
     * Creates request options for putProfileUsers without sending the request
     * @param {string} profileId 
     * @param {Users} users 
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    putProfileUsersRequestOpts(requestParameters: PutProfileUsersRequest): Promise<runtime.RequestOpts>;

    /**
     * Its owner\'s, or an admin\'s, to say; it replaces whom it was for. 
     * @summary Say who besides its owner may use a profile: who may start sessions from it
     * @param {string} profileId 
     * @param {Users} users 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    putProfileUsersRaw(requestParameters: PutProfileUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Users>>;

    /**
     * Its owner\'s, or an admin\'s, to say; it replaces whom it was for. 
     * Say who besides its owner may use a profile: who may start sessions from it
     */
    putProfileUsers(requestParameters: PutProfileUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Users>;

    /**
     * Creates request options for restoreProfileVersion without sending the request
     * @param {string} profileId 
     * @param {number} version 
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    restoreProfileVersionRequestOpts(requestParameters: RestoreProfileVersionRequest): Promise<runtime.RequestOpts>;

    /**
     * A new version, the same as that one, becomes its latest: what came after it is kept, to go forward to again. Its owner\'s to do. 
     * @summary Go back to a version
     * @param {string} profileId 
     * @param {number} version 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProfilesApiInterface
     */
    restoreProfileVersionRaw(requestParameters: RestoreProfileVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Profile>>;

    /**
     * A new version, the same as that one, becomes its latest: what came after it is kept, to go forward to again. Its owner\'s to do. 
     * Go back to a version
     */
    restoreProfileVersion(requestParameters: RestoreProfileVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Profile>;

}

/**
 * 
 */
export class ProfilesApi extends runtime.BaseAPI implements ProfilesApiInterface {

    /**
     * Creates request options for deleteProfile without sending the request
     */
    async deleteProfileRequestOpts(requestParameters: DeleteProfileRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['profileId'] == null) {
            throw new runtime.RequiredError(
                'profileId',
                'Required parameter "profileId" was null or undefined when calling deleteProfile().'
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

        let urlPath = `/v1/profiles/{profileId}`;
        urlPath = urlPath.replace('{profileId}', encodeURIComponent(String(requestParameters['profileId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Sessions started from it go on as they were; triggers that start it are refused while they exist (`409 in_use`). 
     * Delete a profile
     */
    async deleteProfileRaw(requestParameters: DeleteProfileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteProfileRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Sessions started from it go on as they were; triggers that start it are refused while they exist (`409 in_use`). 
     * Delete a profile
     */
    async deleteProfile(requestParameters: DeleteProfileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteProfileRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for getProfile without sending the request
     */
    async getProfileRequestOpts(requestParameters: GetProfileRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['profileId'] == null) {
            throw new runtime.RequiredError(
                'profileId',
                'Required parameter "profileId" was null or undefined when calling getProfile().'
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

        let urlPath = `/v1/profiles/{profileId}`;
        urlPath = urlPath.replace('{profileId}', encodeURIComponent(String(requestParameters['profileId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A profile, at its latest version
     */
    async getProfileRaw(requestParameters: GetProfileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Profile>> {
        const requestOptions = await this.getProfileRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProfileFromJSON(jsonValue));
    }

    /**
     * A profile, at its latest version
     */
    async getProfile(requestParameters: GetProfileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Profile> {
        const response = await this.getProfileRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getProfileVersion without sending the request
     */
    async getProfileVersionRequestOpts(requestParameters: GetProfileVersionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['profileId'] == null) {
            throw new runtime.RequiredError(
                'profileId',
                'Required parameter "profileId" was null or undefined when calling getProfileVersion().'
            );
        }

        if (requestParameters['version'] == null) {
            throw new runtime.RequiredError(
                'version',
                'Required parameter "version" was null or undefined when calling getProfileVersion().'
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

        let urlPath = `/v1/profiles/{profileId}/versions/{version}`;
        urlPath = urlPath.replace('{profileId}', encodeURIComponent(String(requestParameters['profileId'])));
        urlPath = urlPath.replace('{version}', encodeURIComponent(String(requestParameters['version'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A profile as it was at one version
     */
    async getProfileVersionRaw(requestParameters: GetProfileVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Profile>> {
        const requestOptions = await this.getProfileVersionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProfileFromJSON(jsonValue));
    }

    /**
     * A profile as it was at one version
     */
    async getProfileVersion(requestParameters: GetProfileVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Profile> {
        const response = await this.getProfileVersionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listProfileVersions without sending the request
     */
    async listProfileVersionsRequestOpts(requestParameters: ListProfileVersionsRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['profileId'] == null) {
            throw new runtime.RequiredError(
                'profileId',
                'Required parameter "profileId" was null or undefined when calling listProfileVersions().'
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

        let urlPath = `/v1/profiles/{profileId}/versions`;
        urlPath = urlPath.replace('{profileId}', encodeURIComponent(String(requestParameters['profileId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * What to test — a session is started from any of them with `profileVersion` — and what to go back to, with `POST …/versions/{version}/restore`. 
     * Every version of a profile, newest first
     */
    async listProfileVersionsRaw(requestParameters: ListProfileVersionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ProfileVersionList>> {
        const requestOptions = await this.listProfileVersionsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProfileVersionListFromJSON(jsonValue));
    }

    /**
     * What to test — a session is started from any of them with `profileVersion` — and what to go back to, with `POST …/versions/{version}/restore`. 
     * Every version of a profile, newest first
     */
    async listProfileVersions(requestParameters: ListProfileVersionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ProfileVersionList> {
        const response = await this.listProfileVersionsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listProfiles without sending the request
     */
    async listProfilesRequestOpts(requestParameters: ListProfilesRequest): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/profiles`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every profile of the account
     */
    async listProfilesRaw(requestParameters: ListProfilesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ProfilePage>> {
        const requestOptions = await this.listProfilesRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProfilePageFromJSON(jsonValue));
    }

    /**
     * Every profile of the account
     */
    async listProfiles(requestParameters: ListProfilesRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ProfilePage> {
        const response = await this.listProfilesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for putProfile without sending the request
     */
    async putProfileRequestOpts(requestParameters: PutProfileRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['profileId'] == null) {
            throw new runtime.RequiredError(
                'profileId',
                'Required parameter "profileId" was null or undefined when calling putProfile().'
            );
        }

        if (requestParameters['profileSpec'] == null) {
            throw new runtime.RequiredError(
                'profileSpec',
                'Required parameter "profileSpec" was null or undefined when calling putProfile().'
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

        let urlPath = `/v1/profiles/{profileId}`;
        urlPath = urlPath.replace('{profileId}', encodeURIComponent(String(requestParameters['profileId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ProfileSpecToJSON(requestParameters['profileSpec']),
        };
    }

    /**
     * A profile is what a session is started from: a harness, provider and model, a system prompt, brokers, MCP connectors and sandbox resources. Each change is a new `version`; a session records the version it was started from, and is never changed by a later one. The same spec again makes no version. 
     * Create a profile, or make a new version of it
     */
    async putProfileRaw(requestParameters: PutProfileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Profile>> {
        const requestOptions = await this.putProfileRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProfileFromJSON(jsonValue));
    }

    /**
     * A profile is what a session is started from: a harness, provider and model, a system prompt, brokers, MCP connectors and sandbox resources. Each change is a new `version`; a session records the version it was started from, and is never changed by a later one. The same spec again makes no version. 
     * Create a profile, or make a new version of it
     */
    async putProfile(requestParameters: PutProfileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Profile> {
        const response = await this.putProfileRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for putProfileUsers without sending the request
     */
    async putProfileUsersRequestOpts(requestParameters: PutProfileUsersRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['profileId'] == null) {
            throw new runtime.RequiredError(
                'profileId',
                'Required parameter "profileId" was null or undefined when calling putProfileUsers().'
            );
        }

        if (requestParameters['users'] == null) {
            throw new runtime.RequiredError(
                'users',
                'Required parameter "users" was null or undefined when calling putProfileUsers().'
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

        let urlPath = `/v1/profiles/{profileId}/users`;
        urlPath = urlPath.replace('{profileId}', encodeURIComponent(String(requestParameters['profileId'])));

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
     * Say who besides its owner may use a profile: who may start sessions from it
     */
    async putProfileUsersRaw(requestParameters: PutProfileUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Users>> {
        const requestOptions = await this.putProfileUsersRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UsersFromJSON(jsonValue));
    }

    /**
     * Its owner\'s, or an admin\'s, to say; it replaces whom it was for. 
     * Say who besides its owner may use a profile: who may start sessions from it
     */
    async putProfileUsers(requestParameters: PutProfileUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Users> {
        const response = await this.putProfileUsersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for restoreProfileVersion without sending the request
     */
    async restoreProfileVersionRequestOpts(requestParameters: RestoreProfileVersionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['profileId'] == null) {
            throw new runtime.RequiredError(
                'profileId',
                'Required parameter "profileId" was null or undefined when calling restoreProfileVersion().'
            );
        }

        if (requestParameters['version'] == null) {
            throw new runtime.RequiredError(
                'version',
                'Required parameter "version" was null or undefined when calling restoreProfileVersion().'
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

        let urlPath = `/v1/profiles/{profileId}/versions/{version}/restore`;
        urlPath = urlPath.replace('{profileId}', encodeURIComponent(String(requestParameters['profileId'])));
        urlPath = urlPath.replace('{version}', encodeURIComponent(String(requestParameters['version'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A new version, the same as that one, becomes its latest: what came after it is kept, to go forward to again. Its owner\'s to do. 
     * Go back to a version
     */
    async restoreProfileVersionRaw(requestParameters: RestoreProfileVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Profile>> {
        const requestOptions = await this.restoreProfileVersionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProfileFromJSON(jsonValue));
    }

    /**
     * A new version, the same as that one, becomes its latest: what came after it is kept, to go forward to again. Its owner\'s to do. 
     * Go back to a version
     */
    async restoreProfileVersion(requestParameters: RestoreProfileVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Profile> {
        const response = await this.restoreProfileVersionRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
