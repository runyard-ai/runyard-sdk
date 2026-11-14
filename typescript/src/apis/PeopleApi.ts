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
    type ListInvitations200Response,
    ListInvitations200ResponseFromJSON,
    ListInvitations200ResponseToJSON,
} from '../models/ListInvitations200Response.js';
import {
    type ListUsers200Response,
    ListUsers200ResponseFromJSON,
    ListUsers200ResponseToJSON,
} from '../models/ListUsers200Response.js';
import {
    type MadeInvitation,
    MadeInvitationFromJSON,
    MadeInvitationToJSON,
} from '../models/MadeInvitation.js';
import {
    type NewInvitation,
    NewInvitationFromJSON,
    NewInvitationToJSON,
} from '../models/NewInvitation.js';
import {
    type User,
    UserFromJSON,
    UserToJSON,
} from '../models/User.js';
import {
    type UserUpdate,
    UserUpdateFromJSON,
    UserUpdateToJSON,
} from '../models/UserUpdate.js';

export interface AddUserRequest {
    /**
     * 
     */
    userEmail: string;
    /**
     * 
     */
    userUpdate: UserUpdate;
}

export interface CreateInvitationRequest {
    /**
     * 
     */
    newInvitation: NewInvitation;
}

export interface DeleteUserRequest {
    /**
     * 
     */
    userEmail: string;
    /**
     * 
     */
    theirs?: DeleteUserTheirsEnum;
}

export interface RevokeInvitationRequest {
    /**
     * 
     */
    invitationId: string;
}

export interface UpdateUserRequest {
    /**
     * 
     */
    userEmail: string;
    /**
     * 
     */
    userUpdate: UserUpdate;
}

/**
 * PeopleApi - interface
 * 
 * @export
 * @interface PeopleApiInterface
 */
export interface PeopleApiInterface {
    /**
     * Creates request options for addUser without sending the request
     * @param {string} userEmail 
     * @param {UserUpdate} userUpdate 
     * @throws {RequiredError}
     * @memberof PeopleApiInterface
     */
    addUserRequestOpts(requestParameters: AddUserRequest): Promise<runtime.RequestOpts>;

    /**
     * In the role given, as an invitation would — for a person who signs in with a password, the one way in. They sign in with Google, the OpenID provider or the password file\'s password for their address. A person already in the workspace is `409`: their role is changed with `PATCH`. With `claims` (`Identity`) the provider decides who is in: `409`. 
     * @summary Put a person in the workspace
     * @param {string} userEmail 
     * @param {UserUpdate} userUpdate 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PeopleApiInterface
     */
    addUserRaw(requestParameters: AddUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>>;

    /**
     * In the role given, as an invitation would — for a person who signs in with a password, the one way in. They sign in with Google, the OpenID provider or the password file\'s password for their address. A person already in the workspace is `409`: their role is changed with `PATCH`. With `claims` (`Identity`) the provider decides who is in: `409`. 
     * Put a person in the workspace
     */
    addUser(requestParameters: AddUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User>;

    /**
     * Creates request options for createInvitation without sending the request
     * @param {NewInvitation} newInvitation 
     * @throws {RequiredError}
     * @memberof PeopleApiInterface
     */
    createInvitationRequestOpts(requestParameters: CreateInvitationRequest): Promise<runtime.RequestOpts>;

    /**
     * A link that signs one person in with Google, once, into the workspace as the `role` it says — for `email` alone, when it names one. It expires after `expiresInDays`. The link is in this answer and nowhere else, ever: the server keeps the hash of its code. A server without Google sign-in invites nobody: `409`; nor does one with `claims` (`Identity`), whose provider decides who is in. 
     * @summary Invite somebody
     * @param {NewInvitation} newInvitation 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PeopleApiInterface
     */
    createInvitationRaw(requestParameters: CreateInvitationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MadeInvitation>>;

    /**
     * A link that signs one person in with Google, once, into the workspace as the `role` it says — for `email` alone, when it names one. It expires after `expiresInDays`. The link is in this answer and nowhere else, ever: the server keeps the hash of its code. A server without Google sign-in invites nobody: `409`; nor does one with `claims` (`Identity`), whose provider decides who is in. 
     * Invite somebody
     */
    createInvitation(requestParameters: CreateInvitationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MadeInvitation>;

    /**
     * Creates request options for deleteUser without sending the request
     * @param {string} userEmail 
     * @param {'hand_over' | 'delete'} [theirs] 
     * @throws {RequiredError}
     * @memberof PeopleApiInterface
     */
    deleteUserRequestOpts(requestParameters: DeleteUserRequest): Promise<runtime.RequestOpts>;

    /**
     * Their keys are revoked. Their subscriptions are deleted: each is their own account, and signing in again is theirs to do. Their sessions and the other providers they made are handed over to the admin removing them (`theirs: hand_over`), or deleted with them (`delete`). What others shared with them no longer is, and is not handed to the admin. Oneself, and the workspace\'s owner, are not removed: `409`.  With `claims` (`Identity`) the provider decides who is in, and only a person it offboarded (`offboardedAt`) is taken here: what is theirs is handed over or deleted, and the person is kept, with their keys suspended, as the record of who they were — they come back if the provider lets them sign in again. Anybody else is `409`. 
     * @summary Remove a person from the workspace, and what is theirs in it, at once
     * @param {string} userEmail 
     * @param {'hand_over' | 'delete'} [theirs] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PeopleApiInterface
     */
    deleteUserRaw(requestParameters: DeleteUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Their keys are revoked. Their subscriptions are deleted: each is their own account, and signing in again is theirs to do. Their sessions and the other providers they made are handed over to the admin removing them (`theirs: hand_over`), or deleted with them (`delete`). What others shared with them no longer is, and is not handed to the admin. Oneself, and the workspace\'s owner, are not removed: `409`.  With `claims` (`Identity`) the provider decides who is in, and only a person it offboarded (`offboardedAt`) is taken here: what is theirs is handed over or deleted, and the person is kept, with their keys suspended, as the record of who they were — they come back if the provider lets them sign in again. Anybody else is `409`. 
     * Remove a person from the workspace, and what is theirs in it, at once
     */
    deleteUser(requestParameters: DeleteUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for listInvitations without sending the request
     * @throws {RequiredError}
     * @memberof PeopleApiInterface
     */
    listInvitationsRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * Never their codes, which only their making shows.
     * @summary The invitations nobody has used yet
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PeopleApiInterface
     */
    listInvitationsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListInvitations200Response>>;

    /**
     * Never their codes, which only their making shows.
     * The invitations nobody has used yet
     */
    listInvitations(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListInvitations200Response>;

    /**
     * Creates request options for listUsers without sending the request
     * @throws {RequiredError}
     * @memberof PeopleApiInterface
     */
    listUsersRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * Every person of the workspace, by address, in their role in it: whom a session, or a thing they own, may be shared with. It needs `sessions.write`, or `users.admin`. 
     * @summary The people of the workspace
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PeopleApiInterface
     */
    listUsersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListUsers200Response>>;

    /**
     * Every person of the workspace, by address, in their role in it: whom a session, or a thing they own, may be shared with. It needs `sessions.write`, or `users.admin`. 
     * The people of the workspace
     */
    listUsers(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListUsers200Response>;

    /**
     * Creates request options for revokeInvitation without sending the request
     * @param {string} invitationId 
     * @throws {RequiredError}
     * @memberof PeopleApiInterface
     */
    revokeInvitationRequestOpts(requestParameters: RevokeInvitationRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary Revoke an invitation, at once
     * @param {string} invitationId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PeopleApiInterface
     */
    revokeInvitationRaw(requestParameters: RevokeInvitationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Revoke an invitation, at once
     */
    revokeInvitation(requestParameters: RevokeInvitationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for updateUser without sending the request
     * @param {string} userEmail 
     * @param {UserUpdate} userUpdate 
     * @throws {RequiredError}
     * @memberof PeopleApiInterface
     */
    updateUserRequestOpts(requestParameters: UpdateUserRequest): Promise<runtime.RequestOpts>;

    /**
     * Takes effect at their next request, their keys\' too. The workspace\'s owner is always an admin: making them a member is `409`. With `claims` (`Identity`) roles are the provider\'s: `409`. 
     * @summary Make a person an admin of the workspace, or a member
     * @param {string} userEmail 
     * @param {UserUpdate} userUpdate 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PeopleApiInterface
     */
    updateUserRaw(requestParameters: UpdateUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>>;

    /**
     * Takes effect at their next request, their keys\' too. The workspace\'s owner is always an admin: making them a member is `409`. With `claims` (`Identity`) roles are the provider\'s: `409`. 
     * Make a person an admin of the workspace, or a member
     */
    updateUser(requestParameters: UpdateUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User>;

}

/**
 * 
 */
export class PeopleApi extends runtime.BaseAPI implements PeopleApiInterface {

    /**
     * Creates request options for addUser without sending the request
     */
    async addUserRequestOpts(requestParameters: AddUserRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['userEmail'] == null) {
            throw new runtime.RequiredError(
                'userEmail',
                'Required parameter "userEmail" was null or undefined when calling addUser().'
            );
        }

        if (requestParameters['userUpdate'] == null) {
            throw new runtime.RequiredError(
                'userUpdate',
                'Required parameter "userUpdate" was null or undefined when calling addUser().'
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

        let urlPath = `/v1/users/{userEmail}`;
        urlPath = urlPath.replace('{userEmail}', encodeURIComponent(String(requestParameters['userEmail'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: UserUpdateToJSON(requestParameters['userUpdate']),
        };
    }

    /**
     * In the role given, as an invitation would — for a person who signs in with a password, the one way in. They sign in with Google, the OpenID provider or the password file\'s password for their address. A person already in the workspace is `409`: their role is changed with `PATCH`. With `claims` (`Identity`) the provider decides who is in: `409`. 
     * Put a person in the workspace
     */
    async addUserRaw(requestParameters: AddUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>> {
        const requestOptions = await this.addUserRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     * In the role given, as an invitation would — for a person who signs in with a password, the one way in. They sign in with Google, the OpenID provider or the password file\'s password for their address. A person already in the workspace is `409`: their role is changed with `PATCH`. With `claims` (`Identity`) the provider decides who is in: `409`. 
     * Put a person in the workspace
     */
    async addUser(requestParameters: AddUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User> {
        const response = await this.addUserRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for createInvitation without sending the request
     */
    async createInvitationRequestOpts(requestParameters: CreateInvitationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['newInvitation'] == null) {
            throw new runtime.RequiredError(
                'newInvitation',
                'Required parameter "newInvitation" was null or undefined when calling createInvitation().'
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

        let urlPath = `/v1/invitations`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: NewInvitationToJSON(requestParameters['newInvitation']),
        };
    }

    /**
     * A link that signs one person in with Google, once, into the workspace as the `role` it says — for `email` alone, when it names one. It expires after `expiresInDays`. The link is in this answer and nowhere else, ever: the server keeps the hash of its code. A server without Google sign-in invites nobody: `409`; nor does one with `claims` (`Identity`), whose provider decides who is in. 
     * Invite somebody
     */
    async createInvitationRaw(requestParameters: CreateInvitationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MadeInvitation>> {
        const requestOptions = await this.createInvitationRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => MadeInvitationFromJSON(jsonValue));
    }

    /**
     * A link that signs one person in with Google, once, into the workspace as the `role` it says — for `email` alone, when it names one. It expires after `expiresInDays`. The link is in this answer and nowhere else, ever: the server keeps the hash of its code. A server without Google sign-in invites nobody: `409`; nor does one with `claims` (`Identity`), whose provider decides who is in. 
     * Invite somebody
     */
    async createInvitation(requestParameters: CreateInvitationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MadeInvitation> {
        const response = await this.createInvitationRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for deleteUser without sending the request
     */
    async deleteUserRequestOpts(requestParameters: DeleteUserRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['userEmail'] == null) {
            throw new runtime.RequiredError(
                'userEmail',
                'Required parameter "userEmail" was null or undefined when calling deleteUser().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['theirs'] != null) {
            queryParameters['theirs'] = requestParameters['theirs'];
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

        let urlPath = `/v1/users/{userEmail}`;
        urlPath = urlPath.replace('{userEmail}', encodeURIComponent(String(requestParameters['userEmail'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Their keys are revoked. Their subscriptions are deleted: each is their own account, and signing in again is theirs to do. Their sessions and the other providers they made are handed over to the admin removing them (`theirs: hand_over`), or deleted with them (`delete`). What others shared with them no longer is, and is not handed to the admin. Oneself, and the workspace\'s owner, are not removed: `409`.  With `claims` (`Identity`) the provider decides who is in, and only a person it offboarded (`offboardedAt`) is taken here: what is theirs is handed over or deleted, and the person is kept, with their keys suspended, as the record of who they were — they come back if the provider lets them sign in again. Anybody else is `409`. 
     * Remove a person from the workspace, and what is theirs in it, at once
     */
    async deleteUserRaw(requestParameters: DeleteUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteUserRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Their keys are revoked. Their subscriptions are deleted: each is their own account, and signing in again is theirs to do. Their sessions and the other providers they made are handed over to the admin removing them (`theirs: hand_over`), or deleted with them (`delete`). What others shared with them no longer is, and is not handed to the admin. Oneself, and the workspace\'s owner, are not removed: `409`.  With `claims` (`Identity`) the provider decides who is in, and only a person it offboarded (`offboardedAt`) is taken here: what is theirs is handed over or deleted, and the person is kept, with their keys suspended, as the record of who they were — they come back if the provider lets them sign in again. Anybody else is `409`. 
     * Remove a person from the workspace, and what is theirs in it, at once
     */
    async deleteUser(requestParameters: DeleteUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteUserRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for listInvitations without sending the request
     */
    async listInvitationsRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/invitations`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Never their codes, which only their making shows.
     * The invitations nobody has used yet
     */
    async listInvitationsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListInvitations200Response>> {
        const requestOptions = await this.listInvitationsRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListInvitations200ResponseFromJSON(jsonValue));
    }

    /**
     * Never their codes, which only their making shows.
     * The invitations nobody has used yet
     */
    async listInvitations(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListInvitations200Response> {
        const response = await this.listInvitationsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listUsers without sending the request
     */
    async listUsersRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/users`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every person of the workspace, by address, in their role in it: whom a session, or a thing they own, may be shared with. It needs `sessions.write`, or `users.admin`. 
     * The people of the workspace
     */
    async listUsersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListUsers200Response>> {
        const requestOptions = await this.listUsersRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListUsers200ResponseFromJSON(jsonValue));
    }

    /**
     * Every person of the workspace, by address, in their role in it: whom a session, or a thing they own, may be shared with. It needs `sessions.write`, or `users.admin`. 
     * The people of the workspace
     */
    async listUsers(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListUsers200Response> {
        const response = await this.listUsersRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for revokeInvitation without sending the request
     */
    async revokeInvitationRequestOpts(requestParameters: RevokeInvitationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['invitationId'] == null) {
            throw new runtime.RequiredError(
                'invitationId',
                'Required parameter "invitationId" was null or undefined when calling revokeInvitation().'
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

        let urlPath = `/v1/invitations/{invitationId}`;
        urlPath = urlPath.replace('{invitationId}', encodeURIComponent(String(requestParameters['invitationId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Revoke an invitation, at once
     */
    async revokeInvitationRaw(requestParameters: RevokeInvitationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.revokeInvitationRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Revoke an invitation, at once
     */
    async revokeInvitation(requestParameters: RevokeInvitationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.revokeInvitationRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for updateUser without sending the request
     */
    async updateUserRequestOpts(requestParameters: UpdateUserRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['userEmail'] == null) {
            throw new runtime.RequiredError(
                'userEmail',
                'Required parameter "userEmail" was null or undefined when calling updateUser().'
            );
        }

        if (requestParameters['userUpdate'] == null) {
            throw new runtime.RequiredError(
                'userUpdate',
                'Required parameter "userUpdate" was null or undefined when calling updateUser().'
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

        let urlPath = `/v1/users/{userEmail}`;
        urlPath = urlPath.replace('{userEmail}', encodeURIComponent(String(requestParameters['userEmail'])));

        return {
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UserUpdateToJSON(requestParameters['userUpdate']),
        };
    }

    /**
     * Takes effect at their next request, their keys\' too. The workspace\'s owner is always an admin: making them a member is `409`. With `claims` (`Identity`) roles are the provider\'s: `409`. 
     * Make a person an admin of the workspace, or a member
     */
    async updateUserRaw(requestParameters: UpdateUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>> {
        const requestOptions = await this.updateUserRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     * Takes effect at their next request, their keys\' too. The workspace\'s owner is always an admin: making them a member is `409`. With `claims` (`Identity`) roles are the provider\'s: `409`. 
     * Make a person an admin of the workspace, or a member
     */
    async updateUser(requestParameters: UpdateUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User> {
        const response = await this.updateUserRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const DeleteUserTheirsEnum = {
    HandOver: 'hand_over',
    Delete: 'delete',
} as const;
export type DeleteUserTheirsEnum = typeof DeleteUserTheirsEnum[keyof typeof DeleteUserTheirsEnum];
