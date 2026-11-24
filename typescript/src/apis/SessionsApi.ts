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
    type Activity,
    ActivityFromJSON,
    ActivityToJSON,
} from '../models/Activity.js';
import {
    type ActivityBodies,
    ActivityBodiesFromJSON,
    ActivityBodiesToJSON,
} from '../models/ActivityBodies.js';
import {
    type ActivityPage,
    ActivityPageFromJSON,
    ActivityPageToJSON,
} from '../models/ActivityPage.js';
import {
    type AvailableRunners,
    AvailableRunnersFromJSON,
    AvailableRunnersToJSON,
} from '../models/AvailableRunners.js';
import {
    type DeletedLater,
    DeletedLaterFromJSON,
    DeletedLaterToJSON,
} from '../models/DeletedLater.js';
import {
    type ForkRequest,
    ForkRequestFromJSON,
    ForkRequestToJSON,
} from '../models/ForkRequest.js';
import {
    type Lineage,
    LineageFromJSON,
    LineageToJSON,
} from '../models/Lineage.js';
import {
    type Session,
    SessionFromJSON,
    SessionToJSON,
} from '../models/Session.js';
import {
    type SessionMatchList,
    SessionMatchListFromJSON,
    SessionMatchListToJSON,
} from '../models/SessionMatchList.js';
import {
    type SessionPage,
    SessionPageFromJSON,
    SessionPageToJSON,
} from '../models/SessionPage.js';
import {
    type SessionShares,
    SessionSharesFromJSON,
    SessionSharesToJSON,
} from '../models/SessionShares.js';
import {
    type SessionSource,
    SessionSourceFromJSON,
    SessionSourceToJSON,
} from '../models/SessionSource.js';
import {
    type SessionSpec,
    SessionSpecFromJSON,
    SessionSpecToJSON,
} from '../models/SessionSpec.js';
import {
    type SessionState,
    SessionStateFromJSON,
    SessionStateToJSON,
} from '../models/SessionState.js';
import {
    type SessionToken,
    SessionTokenFromJSON,
    SessionTokenToJSON,
} from '../models/SessionToken.js';
import {
    type SessionTokenRequest,
    SessionTokenRequestFromJSON,
    SessionTokenRequestToJSON,
} from '../models/SessionTokenRequest.js';
import {
    type SessionUpdate,
    SessionUpdateFromJSON,
    SessionUpdateToJSON,
} from '../models/SessionUpdate.js';

export interface ArchiveSessionRequest {
    /**
     * 
     */
    sessionId: string;
}

export interface CreateSessionRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    sessionSpec: SessionSpec;
}

export interface CreateSessionTokenRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    sessionTokenRequest: SessionTokenRequest;
}

export interface DeleteSessionRequest {
    /**
     * 
     */
    sessionId: string;
}

export interface ForkSessionRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    forkRequest: ForkRequest;
    /**
     * The caller's name for this request, so that sending it again — an answer lost, a connection dropped — finds what it made rather than making another. The caller's own: another caller's same key is another request.
     */
    idempotencyKey?: string;
}

export interface GetActivityRequest {
    /**
     * 
     */
    activityId: string;
}

export interface GetActivityBodyRequest {
    /**
     * 
     */
    activityId: string;
}

export interface GetLineageRequest {
    /**
     * 
     */
    sessionId: string;
}

export interface GetSessionRequest {
    /**
     * 
     */
    sessionId: string;
}

export interface GetSessionSharesRequest {
    /**
     * 
     */
    sessionId: string;
}

export interface ListActivityRequest {
    /**
     * At most this many; the default and ceiling are in `GET /v1/info`.
     */
    limit?: number;
    /**
     * From a previous page's `nextCursor`. Opaque; one made up is `400`.
     */
    cursor?: string;
    /**
     * One session's.
     */
    session?: string;
    /**
     * One broker's, by its name in the machine (`mcp-github`, `my-git`, `egress`).
     */
    broker?: string;
    /**
     * One kind's. Without it, every kind but `exec`: the programs a
     * machine ran are many more than what went through its brokers,
     * and would bury them.
     * 
     */
    kind?: ListActivityKindEnum;
}

export interface ListSessionsRequest {
    /**
     * At most this many; the default and ceiling are in `GET /v1/info`.
     */
    limit?: number;
    /**
     * From a previous page's `nextCursor`. Opaque; one made up is `400`.
     */
    cursor?: string;
    /**
     * 
     */
    whose?: ListSessionsWhoseEnum;
    /**
     * Those of this owner alone, of those the caller sees.
     */
    owner?: string;
    /**
     * Those for the end user of this id alone, of those the caller sees.
     */
    endUser?: string;
    /**
     * Any of these states.
     */
    state?: Array<SessionState>;
    /**
     * Any of these sources.
     */
    source?: Array<SessionSource>;
    /**
     * Archived sessions only, or none of them (the default).
     */
    archived?: boolean;
    /**
     * 
     */
    profileId?: string;
    /**
     * The sessions this one started or forked.
     */
    parentId?: string;
    /**
     * Every session of one tree.
     */
    rootId?: string;
    /**
     * The sessions a trigger's firings started.
     */
    triggerId?: string;
    /**
     * `key=value`, each one required.
     */
    label?: Array<string>;
}

export interface PutSessionSharesRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    sessionShares: SessionShares;
}

export interface RestoreSessionRequest {
    /**
     * 
     */
    sessionId: string;
}

export interface SearchSessionsRequest {
    /**
     * The words, separated by spaces.
     */
    q: string;
    /**
     * At most this many; the default and ceiling are in `GET /v1/info`.
     */
    limit?: number;
    /**
     * Archived sessions only, or none of them (the default).
     */
    archived?: boolean;
}

export interface SleepSessionRequest {
    /**
     * 
     */
    sessionId: string;
}

export interface StartSessionRequest {
    /**
     * 
     */
    sessionSpec: SessionSpec;
    /**
     * The caller's name for this request, so that sending it again — an answer lost, a connection dropped — finds what it made rather than making another. The caller's own: another caller's same key is another request.
     */
    idempotencyKey?: string;
}

export interface UpdateSessionRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    sessionUpdate: SessionUpdate;
}

export interface WakeSessionRequest {
    /**
     * 
     */
    sessionId: string;
}

/**
 * SessionsApi - interface
 * 
 * @export
 * @interface SessionsApiInterface
 */
export interface SessionsApiInterface {
    /**
     * Creates request options for archiveSession without sending the request
     * @param {string} sessionId 
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    archiveSessionRequestOpts(requestParameters: ArchiveSessionRequest): Promise<runtime.RequestOpts>;

    /**
     * It is put to sleep, out of the default list, and refuses turns until restored. Its disk and transcript are kept. A `locked` session is `409`: unlock it first. 
     * @summary Archive a session
     * @param {string} sessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    archiveSessionRaw(requestParameters: ArchiveSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>>;

    /**
     * It is put to sleep, out of the default list, and refuses turns until restored. Its disk and transcript are kept. A `locked` session is `409`: unlock it first. 
     * Archive a session
     */
    archiveSession(requestParameters: ArchiveSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session>;

    /**
     * Creates request options for createSession without sending the request
     * @param {string} sessionId 
     * @param {SessionSpec} sessionSpec 
     * @deprecated
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    createSessionRequestOpts(requestParameters: CreateSessionRequest): Promise<runtime.RequestOpts>;

    /**
     * **Deprecated: `POST /v1/sessions`**, where the server names the session. Kept so that a caller written against it goes on working while it moves, on this timeline:  | date | | |---|---| | 2026-11-13 | deprecated: every answer says so in `Deprecation` and `Sunset` headers, and the server logs each use with its caller | | 2026-12-15 | every caller has moved | | 2027-01-31 | removed |  From a profile (`profileId`, at its latest version unless one is named), with any field of the session overridden, or from nothing but the overrides. The answer comes at once, the sandbox `creating`; the session\'s stream says when its harness is up. A first turn may be sent with it, and is taken as soon as the session is.  The same request again is `200` with the session as it is now; a different one under the same id is `409 spec_conflict`. **An id a deleted session had is never taken again**: it is `409 conflict`, so that nothing which knew the deleted session by its id is handed a new one, of somebody else\'s, in its place.  A session whose disk the workspace\'s disk budget has no room left for is refused `507 quota_exceeded`, before anything is kept: every session\'s disk is counted at its full size for as long as it is kept, so waiting frees none of it, and deleting a session does. 
     * @summary Start a session under an id the caller chose
     * @param {string} sessionId 
     * @param {SessionSpec} sessionSpec 
     * @param {*} [options] Override http request option.
     * @deprecated
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    createSessionRaw(requestParameters: CreateSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>>;

    /**
     * **Deprecated: `POST /v1/sessions`**, where the server names the session. Kept so that a caller written against it goes on working while it moves, on this timeline:  | date | | |---|---| | 2026-11-13 | deprecated: every answer says so in `Deprecation` and `Sunset` headers, and the server logs each use with its caller | | 2026-12-15 | every caller has moved | | 2027-01-31 | removed |  From a profile (`profileId`, at its latest version unless one is named), with any field of the session overridden, or from nothing but the overrides. The answer comes at once, the sandbox `creating`; the session\'s stream says when its harness is up. A first turn may be sent with it, and is taken as soon as the session is.  The same request again is `200` with the session as it is now; a different one under the same id is `409 spec_conflict`. **An id a deleted session had is never taken again**: it is `409 conflict`, so that nothing which knew the deleted session by its id is handed a new one, of somebody else\'s, in its place.  A session whose disk the workspace\'s disk budget has no room left for is refused `507 quota_exceeded`, before anything is kept: every session\'s disk is counted at its full size for as long as it is kept, so waiting frees none of it, and deleting a session does. 
     * Start a session under an id the caller chose
     * @deprecated
     */
    createSession(requestParameters: CreateSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session>;

    /**
     * Creates request options for createSessionToken without sending the request
     * @param {string} sessionId 
     * @param {SessionTokenRequest} sessionTokenRequest 
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    createSessionTokenRequestOpts(requestParameters: CreateSessionTokenRequest): Promise<runtime.RequestOpts>;

    /**
     * A session token: what an application\'s backend hands a browser so that it talks to the server directly — reading the session, its transcript, files and sub-agents, sending and steering its turns, uploading what they attach — in this session alone, and nothing else (`403`). It is answered from any origin (CORS), being no cookie.  It speaks for its end user, when it has one: its turns are sent for them (`Turn.endUser`). Absent, the session\'s end user; a session for an end user has tokens for them alone (`400`), and only an application\'s session has end users at all.  It is signed by the server and kept nowhere: it ends at `expiresAt` — an hour by default, a day at most — or with its session, or once its owner may no longer steer it. Whoever may steer the session mints one: its owner, or an admin; never a session, nor another token. 
     * @summary A token a browser talks to this session with
     * @param {string} sessionId 
     * @param {SessionTokenRequest} sessionTokenRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    createSessionTokenRaw(requestParameters: CreateSessionTokenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionToken>>;

    /**
     * A session token: what an application\'s backend hands a browser so that it talks to the server directly — reading the session, its transcript, files and sub-agents, sending and steering its turns, uploading what they attach — in this session alone, and nothing else (`403`). It is answered from any origin (CORS), being no cookie.  It speaks for its end user, when it has one: its turns are sent for them (`Turn.endUser`). Absent, the session\'s end user; a session for an end user has tokens for them alone (`400`), and only an application\'s session has end users at all.  It is signed by the server and kept nowhere: it ends at `expiresAt` — an hour by default, a day at most — or with its session, or once its owner may no longer steer it. Whoever may steer the session mints one: its owner, or an admin; never a session, nor another token. 
     * A token a browser talks to this session with
     */
    createSessionToken(requestParameters: CreateSessionTokenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionToken>;

    /**
     * Creates request options for deleteSession without sending the request
     * @param {string} sessionId 
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    deleteSessionRequestOpts(requestParameters: DeleteSessionRequest): Promise<runtime.RequestOpts>;

    /**
     * Irreversible. The sessions it started are not deleted: they keep their `parentId`, and their lineage says the parent is gone. A `locked` session is `409`: unlock it first. A session, through its `sessions` broker, deletes only the sessions it started and those under them: any other — itself, its parent, a sibling — is `404`.  A session whose disk is on a runner that is away is deleted here at once, and its machine and disk when that runner is back: `202`, naming the runner. The sandboxes server lists them `deleting` until then. 
     * @summary Delete a session, its sandbox, its disk and its transcript
     * @param {string} sessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    deleteSessionRaw(requestParameters: DeleteSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeletedLater>>;

    /**
     * Irreversible. The sessions it started are not deleted: they keep their `parentId`, and their lineage says the parent is gone. A `locked` session is `409`: unlock it first. A session, through its `sessions` broker, deletes only the sessions it started and those under them: any other — itself, its parent, a sibling — is `404`.  A session whose disk is on a runner that is away is deleted here at once, and its machine and disk when that runner is back: `202`, naming the runner. The sandboxes server lists them `deleting` until then. 
     * Delete a session, its sandbox, its disk and its transcript
     */
    deleteSession(requestParameters: DeleteSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeletedLater | null | undefined >;

    /**
     * Creates request options for forkSession without sending the request
     * @param {string} sessionId 
     * @param {ForkRequest} forkRequest 
     * @param {string} [idempotencyKey] The caller\&#39;s name for this request, so that sending it again — an answer lost, a connection dropped — finds what it made rather than making another. The caller\&#39;s own: another caller\&#39;s same key is another request.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    forkSessionRequestOpts(requestParameters: ForkSessionRequest): Promise<runtime.RequestOpts>;

    /**
     * The new session has the transcript up to `atSeq` (the whole of it when absent), its harness\'s conversation to that point, and a sandbox of its own. Its lineage is `fork`, `branchedFrom` this session at that event.  The server names the fork, as `POST /v1/sessions` names a session: its `id` is in the answer. A retry is made safe by `Idempotency-Key`, the same way. `newSessionId` is deprecated, and kept so that a caller written against it goes on working while it moves, on the timeline `PUT /v1/sessions/{sessionId}` says — removed 2027-01-31; a fork asked for under it answers `Deprecation` and `Sunset` headers. It is idempotent by it, and an id a deleted session had is never taken again (`409 conflict`). Both at once is `400`.  Its `/workspace` starts empty unless `disk` is true, which copies this session\'s `/workspace` as it is now. 
     * @summary Start a new session from this one\'s conversation, up to an event
     * @param {string} sessionId 
     * @param {ForkRequest} forkRequest 
     * @param {string} [idempotencyKey] The caller\&#39;s name for this request, so that sending it again — an answer lost, a connection dropped — finds what it made rather than making another. The caller\&#39;s own: another caller\&#39;s same key is another request.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    forkSessionRaw(requestParameters: ForkSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>>;

    /**
     * The new session has the transcript up to `atSeq` (the whole of it when absent), its harness\'s conversation to that point, and a sandbox of its own. Its lineage is `fork`, `branchedFrom` this session at that event.  The server names the fork, as `POST /v1/sessions` names a session: its `id` is in the answer. A retry is made safe by `Idempotency-Key`, the same way. `newSessionId` is deprecated, and kept so that a caller written against it goes on working while it moves, on the timeline `PUT /v1/sessions/{sessionId}` says — removed 2027-01-31; a fork asked for under it answers `Deprecation` and `Sunset` headers. It is idempotent by it, and an id a deleted session had is never taken again (`409 conflict`). Both at once is `400`.  Its `/workspace` starts empty unless `disk` is true, which copies this session\'s `/workspace` as it is now. 
     * Start a new session from this one\'s conversation, up to an event
     */
    forkSession(requestParameters: ForkSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session>;

    /**
     * Creates request options for getActivity without sending the request
     * @param {string} activityId 
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    getActivityRequestOpts(requestParameters: GetActivityRequest): Promise<runtime.RequestOpts>;

    /**
     * The request as the session\'s machine sent it and the answer as the broker gave it back: headers, and each body up to a mebibyte (`truncated` when it had more, `size` saying how much). A credential the machine sent or the answer set is not kept.  A gateway entry\'s bodies are not here (`bodiesOnRunner`): they stay on the runner that saw the exchange, and are fetched with `GET /v1/activity/{activityId}/body` only when somebody opens them. 
     * @summary One request a session sent through a broker, and its answer, whole
     * @param {string} activityId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    getActivityRaw(requestParameters: GetActivityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Activity>>;

    /**
     * The request as the session\'s machine sent it and the answer as the broker gave it back: headers, and each body up to a mebibyte (`truncated` when it had more, `size` saying how much). A credential the machine sent or the answer set is not kept.  A gateway entry\'s bodies are not here (`bodiesOnRunner`): they stay on the runner that saw the exchange, and are fetched with `GET /v1/activity/{activityId}/body` only when somebody opens them. 
     * One request a session sent through a broker, and its answer, whole
     */
    getActivity(requestParameters: GetActivityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Activity>;

    /**
     * Creates request options for getActivityBody without sending the request
     * @param {string} activityId 
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    getActivityBodyRequestOpts(requestParameters: GetActivityBodyRequest): Promise<runtime.RequestOpts>;

    /**
     * As much of the body the machine sent, and of the one it was answered, as was kept. For an entry with `bodiesOnRunner`, asked of the sandboxes server when this is called, and never before: it fetches them from the runner that saw the exchange (`activity.bodies`) and records the read in its own feed. Anyone else\'s, from here.  `503 runner_offline` while that runner is offline, naming it: the entry is listed as usual, and its bodies can be read once the runner is back. `410 gone` once they are gone for good: the runner revoked, or the bodies kept for longer than it keeps them. Read as the entry is: a member their own sessions\', an admin everyone\'s. 
     * @summary An entry\'s bodies, fetched from the runner that keeps them
     * @param {string} activityId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    getActivityBodyRaw(requestParameters: GetActivityBodyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ActivityBodies>>;

    /**
     * As much of the body the machine sent, and of the one it was answered, as was kept. For an entry with `bodiesOnRunner`, asked of the sandboxes server when this is called, and never before: it fetches them from the runner that saw the exchange (`activity.bodies`) and records the read in its own feed. Anyone else\'s, from here.  `503 runner_offline` while that runner is offline, naming it: the entry is listed as usual, and its bodies can be read once the runner is back. `410 gone` once they are gone for good: the runner revoked, or the bodies kept for longer than it keeps them. Read as the entry is: a member their own sessions\', an admin everyone\'s. 
     * An entry\'s bodies, fetched from the runner that keeps them
     */
    getActivityBody(requestParameters: GetActivityBodyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ActivityBodies>;

    /**
     * Creates request options for getAvailableRunners without sending the request
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    getAvailableRunnersRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * How many of the workspace\'s runners could take a new session\'s sandbox now, as its runyard-sandboxes server lists them (read with the workspace\'s own key): those approved and `online`, `unreachable` or `held` — not one `pending` approval, `draining`, `expired` or `revoked`. With none, a session started has its sandbox placed nowhere and fails (`unplaceable`), so a client reads this before starting one and says so instead. Anybody with `sessions.read` may read it; the runners themselves are an admin\'s (`listRunners`). 
     * @summary Whether a new session\'s sandbox has somewhere to run
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    getAvailableRunnersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AvailableRunners>>;

    /**
     * How many of the workspace\'s runners could take a new session\'s sandbox now, as its runyard-sandboxes server lists them (read with the workspace\'s own key): those approved and `online`, `unreachable` or `held` — not one `pending` approval, `draining`, `expired` or `revoked`. With none, a session started has its sandbox placed nowhere and fails (`unplaceable`), so a client reads this before starting one and says so instead. Anybody with `sessions.read` may read it; the runners themselves are an admin\'s (`listRunners`). 
     * Whether a new session\'s sandbox has somewhere to run
     */
    getAvailableRunners(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AvailableRunners>;

    /**
     * Creates request options for getLineage without sending the request
     * @param {string} sessionId 
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    getLineageRequestOpts(requestParameters: GetLineageRequest): Promise<runtime.RequestOpts>;

    /**
     * From its root — a person\'s session, a caller\'s, or a trigger\'s firing — down, depth first, every session started or forked from another in it. At most `limits.maxLineage` nodes; `truncated` says when there were more. 
     * @summary The tree this session belongs to
     * @param {string} sessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    getLineageRaw(requestParameters: GetLineageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Lineage>>;

    /**
     * From its root — a person\'s session, a caller\'s, or a trigger\'s firing — down, depth first, every session started or forked from another in it. At most `limits.maxLineage` nodes; `truncated` says when there were more. 
     * The tree this session belongs to
     */
    getLineage(requestParameters: GetLineageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Lineage>;

    /**
     * Creates request options for getSession without sending the request
     * @param {string} sessionId 
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    getSessionRequestOpts(requestParameters: GetSessionRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary A session
     * @param {string} sessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    getSessionRaw(requestParameters: GetSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>>;

    /**
     * A session
     */
    getSession(requestParameters: GetSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session>;

    /**
     * Creates request options for getSessionShares without sending the request
     * @param {string} sessionId 
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    getSessionSharesRequestOpts(requestParameters: GetSessionSharesRequest): Promise<runtime.RequestOpts>;

    /**
     * A session is shared with its tree — the sessions it started, and forks — from its root: sharing any of them shares the root\'s. 
     * @summary Whom the session is shared with
     * @param {string} sessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    getSessionSharesRaw(requestParameters: GetSessionSharesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionShares>>;

    /**
     * A session is shared with its tree — the sessions it started, and forks — from its root: sharing any of them shares the root\'s. 
     * Whom the session is shared with
     */
    getSessionShares(requestParameters: GetSessionSharesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionShares>;

    /**
     * Creates request options for listActivity without sending the request
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @param {string} [session] One session\&#39;s.
     * @param {string} [broker] One broker\&#39;s, by its name in the machine (&#x60;mcp-github&#x60;, &#x60;my-git&#x60;, &#x60;egress&#x60;).
     * @param {'mcp' | 'egress' | 'tunnels' | 'sessions' | 'images' | 'gateway' | 'one_off' | 'api' | 'exec'} [kind] One kind\&#39;s. Without it, every kind but &#x60;exec&#x60;: the programs a machine ran are many more than what went through its brokers, and would bury them. 
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    listActivityRequestOpts(requestParameters: ListActivityRequest): Promise<runtime.RequestOpts>;

    /**
     * Every request a session\'s machine sent through a broker, and the answer — recorded as it passed, not said by the session: an MCP connector\'s tool called, a `git push` and the refs it moved, a request through an http broker, a host opened through `egress`, a tunnel, a session or an image asked for. Kept a while (`--activity-kept`, a week by default) and then forgotten; kept after its session is deleted, until then.  Where the sandboxes daemon keeps a record of every brokered request — its access gateway\'s feed, which this server reads — that record is the entry, through any broker: this server\'s own, a shared one the daemon dials, one a person\'s own program serves (`kind: gateway`, with how it ended and what it carried). Before a daemon has one, this server records the brokers it serves itself, and nothing else.  The `llm` broker\'s calls are here as any broker\'s: each a call its harness made to the model from the session\'s sandbox.  And beside what sessions did, every call the Runyard platform made to this server\'s API with a platform token: `kind: api`, `actor: platform`, no session\'s and nobody\'s — an admin\'s to read.  And every program a session\'s machine ran, as its kernel recorded it before it ran (`kind: exec`): through no broker, and many for each command a harness runs, so listed only when asked for, with `kind=exec`.  A summary of each, the newest first; `GET /v1/activity/{activityId}` is one whole. A member reads their own sessions\'; an admin, everyone\'s. 
     * @summary What sessions did through their brokers, newest first
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @param {string} [session] One session\&#39;s.
     * @param {string} [broker] One broker\&#39;s, by its name in the machine (&#x60;mcp-github&#x60;, &#x60;my-git&#x60;, &#x60;egress&#x60;).
     * @param {'mcp' | 'egress' | 'tunnels' | 'sessions' | 'images' | 'gateway' | 'one_off' | 'api' | 'exec'} [kind] One kind\&#39;s. Without it, every kind but &#x60;exec&#x60;: the programs a machine ran are many more than what went through its brokers, and would bury them. 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    listActivityRaw(requestParameters: ListActivityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ActivityPage>>;

    /**
     * Every request a session\'s machine sent through a broker, and the answer — recorded as it passed, not said by the session: an MCP connector\'s tool called, a `git push` and the refs it moved, a request through an http broker, a host opened through `egress`, a tunnel, a session or an image asked for. Kept a while (`--activity-kept`, a week by default) and then forgotten; kept after its session is deleted, until then.  Where the sandboxes daemon keeps a record of every brokered request — its access gateway\'s feed, which this server reads — that record is the entry, through any broker: this server\'s own, a shared one the daemon dials, one a person\'s own program serves (`kind: gateway`, with how it ended and what it carried). Before a daemon has one, this server records the brokers it serves itself, and nothing else.  The `llm` broker\'s calls are here as any broker\'s: each a call its harness made to the model from the session\'s sandbox.  And beside what sessions did, every call the Runyard platform made to this server\'s API with a platform token: `kind: api`, `actor: platform`, no session\'s and nobody\'s — an admin\'s to read.  And every program a session\'s machine ran, as its kernel recorded it before it ran (`kind: exec`): through no broker, and many for each command a harness runs, so listed only when asked for, with `kind=exec`.  A summary of each, the newest first; `GET /v1/activity/{activityId}` is one whole. A member reads their own sessions\'; an admin, everyone\'s. 
     * What sessions did through their brokers, newest first
     */
    listActivity(requestParameters: ListActivityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ActivityPage>;

    /**
     * Creates request options for listSessions without sending the request
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @param {'all' | 'mine'} [whose] 
     * @param {string} [owner] Those of this owner alone, of those the caller sees.
     * @param {string} [endUser] Those for the end user of this id alone, of those the caller sees.
     * @param {Array<SessionState>} [state] Any of these states.
     * @param {Array<SessionSource>} [source] Any of these sources.
     * @param {boolean} [archived] Archived sessions only, or none of them (the default).
     * @param {string} [profileId] 
     * @param {string} [parentId] The sessions this one started or forked.
     * @param {string} [rootId] Every session of one tree.
     * @param {string} [triggerId] The sessions a trigger\&#39;s firings started.
     * @param {Array<string>} [label] &#x60;key&#x3D;value&#x60;, each one required.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    listSessionsRequestOpts(requestParameters: ListSessionsRequest): Promise<runtime.RequestOpts>;

    /**
     * Every session, for an admin; for a member, their own and those shared with them — which is what `whose: mine` is for an admin too. 
     * @summary The account\'s sessions, newest activity first
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @param {'all' | 'mine'} [whose] 
     * @param {string} [owner] Those of this owner alone, of those the caller sees.
     * @param {string} [endUser] Those for the end user of this id alone, of those the caller sees.
     * @param {Array<SessionState>} [state] Any of these states.
     * @param {Array<SessionSource>} [source] Any of these sources.
     * @param {boolean} [archived] Archived sessions only, or none of them (the default).
     * @param {string} [profileId] 
     * @param {string} [parentId] The sessions this one started or forked.
     * @param {string} [rootId] Every session of one tree.
     * @param {string} [triggerId] The sessions a trigger\&#39;s firings started.
     * @param {Array<string>} [label] &#x60;key&#x3D;value&#x60;, each one required.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    listSessionsRaw(requestParameters: ListSessionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionPage>>;

    /**
     * Every session, for an admin; for a member, their own and those shared with them — which is what `whose: mine` is for an admin too. 
     * The account\'s sessions, newest activity first
     */
    listSessions(requestParameters: ListSessionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionPage>;

    /**
     * Creates request options for putSessionShares without sending the request
     * @param {string} sessionId 
     * @param {SessionShares} sessionShares 
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    putSessionSharesRequestOpts(requestParameters: PutSessionSharesRequest): Promise<runtime.RequestOpts>;

    /**
     * They read it — its transcript, its files, its work — and do not steer it. Its person and an admin share it; each one named is a person of the workspace, or it is `400`. 
     * @summary Share the session with these people, and no others
     * @param {string} sessionId 
     * @param {SessionShares} sessionShares 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    putSessionSharesRaw(requestParameters: PutSessionSharesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionShares>>;

    /**
     * They read it — its transcript, its files, its work — and do not steer it. Its person and an admin share it; each one named is a person of the workspace, or it is `400`. 
     * Share the session with these people, and no others
     */
    putSessionShares(requestParameters: PutSessionSharesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionShares>;

    /**
     * Creates request options for restoreSession without sending the request
     * @param {string} sessionId 
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    restoreSessionRequestOpts(requestParameters: RestoreSessionRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary Bring an archived session back
     * @param {string} sessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    restoreSessionRaw(requestParameters: RestoreSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>>;

    /**
     * Bring an archived session back
     */
    restoreSession(requestParameters: RestoreSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session>;

    /**
     * Creates request options for searchSessions without sending the request
     * @param {string} q The words, separated by spaces.
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {boolean} [archived] Archived sessions only, or none of them (the default).
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    searchSessionsRequestOpts(requestParameters: SearchSessionsRequest): Promise<runtime.RequestOpts>;

    /**
     * Of the caller\'s sessions and those shared with them (`listSessions` with `whose: mine`, an admin\'s as a member\'s), those whose transcripts say every word of `q`: in what a person wrote to them, what they answered, the tools they called and the start of what those answered. Each comes with the newest event that says it. A word is found inside longer ones (`pull/14` finds `…/pull/143`), whatever its case and accents; a word of fewer than three characters is not searched for, and a `q` with no other word finds nothing. Titles are not searched: a caller has them already. 
     * @summary The sessions whose transcripts say something, newest activity first
     * @param {string} q The words, separated by spaces.
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {boolean} [archived] Archived sessions only, or none of them (the default).
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    searchSessionsRaw(requestParameters: SearchSessionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionMatchList>>;

    /**
     * Of the caller\'s sessions and those shared with them (`listSessions` with `whose: mine`, an admin\'s as a member\'s), those whose transcripts say every word of `q`: in what a person wrote to them, what they answered, the tools they called and the start of what those answered. Each comes with the newest event that says it. A word is found inside longer ones (`pull/14` finds `…/pull/143`), whatever its case and accents; a word of fewer than three characters is not searched for, and a `q` with no other word finds nothing. Titles are not searched: a caller has them already. 
     * The sessions whose transcripts say something, newest activity first
     */
    searchSessions(requestParameters: SearchSessionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionMatchList>;

    /**
     * Creates request options for sleepSession without sending the request
     * @param {string} sessionId 
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    sleepSessionRequestOpts(requestParameters: SleepSessionRequest): Promise<runtime.RequestOpts>;

    /**
     * What the server does by itself after `sandbox.idleSeconds` without a turn or a running background task. A generating session is `409`: interrupt it first. A pending alarm wakes it again shortly before it fires (`nextAlarmAt`). 
     * @summary Release a session\'s sandbox now, keeping its disk
     * @param {string} sessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    sleepSessionRaw(requestParameters: SleepSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>>;

    /**
     * What the server does by itself after `sandbox.idleSeconds` without a turn or a running background task. A generating session is `409`: interrupt it first. A pending alarm wakes it again shortly before it fires (`nextAlarmAt`). 
     * Release a session\'s sandbox now, keeping its disk
     */
    sleepSession(requestParameters: SleepSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session>;

    /**
     * Creates request options for startSession without sending the request
     * @param {SessionSpec} sessionSpec 
     * @param {string} [idempotencyKey] The caller\&#39;s name for this request, so that sending it again — an answer lost, a connection dropped — finds what it made rather than making another. The caller\&#39;s own: another caller\&#39;s same key is another request.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    startSessionRequestOpts(requestParameters: StartSessionRequest): Promise<runtime.RequestOpts>;

    /**
     * From a profile (`profileId`, at its latest version unless one is named), with any field of the session overridden, or from nothing but the overrides. The answer comes at once, the sandbox `creating`; the session\'s stream says when its harness is up. A first turn may be sent with it, and is taken as soon as the session is.  **The server names the session**: its `id` is in the answer, opaque, and never one a session had before. A caller cannot choose it, so nothing that knows a session by its id — a broker, an application, a log — can be handed a session somebody else made under an id it already trusts.  A retry is made safe by `Idempotency-Key`, which is the caller\'s own: the same key and the same request again is `200` with the session it made, as it is now; the same key with a different request is `409 spec_conflict`. A key is the caller\'s — another caller\'s same key is another request — and lasts as long as the session it made.  A session whose disk the workspace\'s disk budget has no room left for is refused `507 quota_exceeded`, before anything is kept: every session\'s disk is counted at its full size for as long as it is kept, so waiting frees none of it, and deleting a session does. 
     * @summary Start a session
     * @param {SessionSpec} sessionSpec 
     * @param {string} [idempotencyKey] The caller\&#39;s name for this request, so that sending it again — an answer lost, a connection dropped — finds what it made rather than making another. The caller\&#39;s own: another caller\&#39;s same key is another request.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    startSessionRaw(requestParameters: StartSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>>;

    /**
     * From a profile (`profileId`, at its latest version unless one is named), with any field of the session overridden, or from nothing but the overrides. The answer comes at once, the sandbox `creating`; the session\'s stream says when its harness is up. A first turn may be sent with it, and is taken as soon as the session is.  **The server names the session**: its `id` is in the answer, opaque, and never one a session had before. A caller cannot choose it, so nothing that knows a session by its id — a broker, an application, a log — can be handed a session somebody else made under an id it already trusts.  A retry is made safe by `Idempotency-Key`, which is the caller\'s own: the same key and the same request again is `200` with the session it made, as it is now; the same key with a different request is `409 spec_conflict`. A key is the caller\'s — another caller\'s same key is another request — and lasts as long as the session it made.  A session whose disk the workspace\'s disk budget has no room left for is refused `507 quota_exceeded`, before anything is kept: every session\'s disk is counted at its full size for as long as it is kept, so waiting frees none of it, and deleting a session does. 
     * Start a session
     */
    startSession(requestParameters: StartSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session>;

    /**
     * Creates request options for updateSession without sending the request
     * @param {string} sessionId 
     * @param {SessionUpdate} sessionUpdate 
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    updateSessionRequestOpts(requestParameters: UpdateSessionRequest): Promise<runtime.RequestOpts>;

    /**
     * Absent fields are left as they are. A change of model, brokers, or MCP connectors restarts the session at its next turn, resumed from the transcript; a change of resources applies the next time the sandbox is made — at once if `restartSandbox`, else when it wakes. 
     * @summary Retitle, relabel, or reconfigure a session
     * @param {string} sessionId 
     * @param {SessionUpdate} sessionUpdate 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    updateSessionRaw(requestParameters: UpdateSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>>;

    /**
     * Absent fields are left as they are. A change of model, brokers, or MCP connectors restarts the session at its next turn, resumed from the transcript; a change of resources applies the next time the sandbox is made — at once if `restartSandbox`, else when it wakes. 
     * Retitle, relabel, or reconfigure a session
     */
    updateSession(requestParameters: UpdateSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session>;

    /**
     * Creates request options for wakeSession without sending the request
     * @param {string} sessionId 
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    wakeSessionRequestOpts(requestParameters: WakeSessionRequest): Promise<runtime.RequestOpts>;

    /**
     * A turn wakes a session by itself; this is for a caller about to open its terminal or files.
     * @summary Give a sleeping session a sandbox again, without a turn
     * @param {string} sessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SessionsApiInterface
     */
    wakeSessionRaw(requestParameters: WakeSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>>;

    /**
     * A turn wakes a session by itself; this is for a caller about to open its terminal or files.
     * Give a sleeping session a sandbox again, without a turn
     */
    wakeSession(requestParameters: WakeSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session>;

}

/**
 * 
 */
export class SessionsApi extends runtime.BaseAPI implements SessionsApiInterface {

    /**
     * Creates request options for archiveSession without sending the request
     */
    async archiveSessionRequestOpts(requestParameters: ArchiveSessionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling archiveSession().'
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

        let urlPath = `/v1/sessions/{sessionId}/archive`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * It is put to sleep, out of the default list, and refuses turns until restored. Its disk and transcript are kept. A `locked` session is `409`: unlock it first. 
     * Archive a session
     */
    async archiveSessionRaw(requestParameters: ArchiveSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>> {
        const requestOptions = await this.archiveSessionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionFromJSON(jsonValue));
    }

    /**
     * It is put to sleep, out of the default list, and refuses turns until restored. Its disk and transcript are kept. A `locked` session is `409`: unlock it first. 
     * Archive a session
     */
    async archiveSession(requestParameters: ArchiveSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session> {
        const response = await this.archiveSessionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for createSession without sending the request
     * @deprecated
     */
    async createSessionRequestOpts(requestParameters: CreateSessionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling createSession().'
            );
        }

        if (requestParameters['sessionSpec'] == null) {
            throw new runtime.RequiredError(
                'sessionSpec',
                'Required parameter "sessionSpec" was null or undefined when calling createSession().'
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

        let urlPath = `/v1/sessions/{sessionId}`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: SessionSpecToJSON(requestParameters['sessionSpec']),
        };
    }

    /**
     * **Deprecated: `POST /v1/sessions`**, where the server names the session. Kept so that a caller written against it goes on working while it moves, on this timeline:  | date | | |---|---| | 2026-11-13 | deprecated: every answer says so in `Deprecation` and `Sunset` headers, and the server logs each use with its caller | | 2026-12-15 | every caller has moved | | 2027-01-31 | removed |  From a profile (`profileId`, at its latest version unless one is named), with any field of the session overridden, or from nothing but the overrides. The answer comes at once, the sandbox `creating`; the session\'s stream says when its harness is up. A first turn may be sent with it, and is taken as soon as the session is.  The same request again is `200` with the session as it is now; a different one under the same id is `409 spec_conflict`. **An id a deleted session had is never taken again**: it is `409 conflict`, so that nothing which knew the deleted session by its id is handed a new one, of somebody else\'s, in its place.  A session whose disk the workspace\'s disk budget has no room left for is refused `507 quota_exceeded`, before anything is kept: every session\'s disk is counted at its full size for as long as it is kept, so waiting frees none of it, and deleting a session does. 
     * Start a session under an id the caller chose
     * @deprecated
     */
    async createSessionRaw(requestParameters: CreateSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>> {
        const requestOptions = await this.createSessionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionFromJSON(jsonValue));
    }

    /**
     * **Deprecated: `POST /v1/sessions`**, where the server names the session. Kept so that a caller written against it goes on working while it moves, on this timeline:  | date | | |---|---| | 2026-11-13 | deprecated: every answer says so in `Deprecation` and `Sunset` headers, and the server logs each use with its caller | | 2026-12-15 | every caller has moved | | 2027-01-31 | removed |  From a profile (`profileId`, at its latest version unless one is named), with any field of the session overridden, or from nothing but the overrides. The answer comes at once, the sandbox `creating`; the session\'s stream says when its harness is up. A first turn may be sent with it, and is taken as soon as the session is.  The same request again is `200` with the session as it is now; a different one under the same id is `409 spec_conflict`. **An id a deleted session had is never taken again**: it is `409 conflict`, so that nothing which knew the deleted session by its id is handed a new one, of somebody else\'s, in its place.  A session whose disk the workspace\'s disk budget has no room left for is refused `507 quota_exceeded`, before anything is kept: every session\'s disk is counted at its full size for as long as it is kept, so waiting frees none of it, and deleting a session does. 
     * Start a session under an id the caller chose
     * @deprecated
     */
    async createSession(requestParameters: CreateSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session> {
        const response = await this.createSessionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for createSessionToken without sending the request
     */
    async createSessionTokenRequestOpts(requestParameters: CreateSessionTokenRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling createSessionToken().'
            );
        }

        if (requestParameters['sessionTokenRequest'] == null) {
            throw new runtime.RequiredError(
                'sessionTokenRequest',
                'Required parameter "sessionTokenRequest" was null or undefined when calling createSessionToken().'
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

        let urlPath = `/v1/sessions/{sessionId}/tokens`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SessionTokenRequestToJSON(requestParameters['sessionTokenRequest']),
        };
    }

    /**
     * A session token: what an application\'s backend hands a browser so that it talks to the server directly — reading the session, its transcript, files and sub-agents, sending and steering its turns, uploading what they attach — in this session alone, and nothing else (`403`). It is answered from any origin (CORS), being no cookie.  It speaks for its end user, when it has one: its turns are sent for them (`Turn.endUser`). Absent, the session\'s end user; a session for an end user has tokens for them alone (`400`), and only an application\'s session has end users at all.  It is signed by the server and kept nowhere: it ends at `expiresAt` — an hour by default, a day at most — or with its session, or once its owner may no longer steer it. Whoever may steer the session mints one: its owner, or an admin; never a session, nor another token. 
     * A token a browser talks to this session with
     */
    async createSessionTokenRaw(requestParameters: CreateSessionTokenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionToken>> {
        const requestOptions = await this.createSessionTokenRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionTokenFromJSON(jsonValue));
    }

    /**
     * A session token: what an application\'s backend hands a browser so that it talks to the server directly — reading the session, its transcript, files and sub-agents, sending and steering its turns, uploading what they attach — in this session alone, and nothing else (`403`). It is answered from any origin (CORS), being no cookie.  It speaks for its end user, when it has one: its turns are sent for them (`Turn.endUser`). Absent, the session\'s end user; a session for an end user has tokens for them alone (`400`), and only an application\'s session has end users at all.  It is signed by the server and kept nowhere: it ends at `expiresAt` — an hour by default, a day at most — or with its session, or once its owner may no longer steer it. Whoever may steer the session mints one: its owner, or an admin; never a session, nor another token. 
     * A token a browser talks to this session with
     */
    async createSessionToken(requestParameters: CreateSessionTokenRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionToken> {
        const response = await this.createSessionTokenRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for deleteSession without sending the request
     */
    async deleteSessionRequestOpts(requestParameters: DeleteSessionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling deleteSession().'
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

        let urlPath = `/v1/sessions/{sessionId}`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Irreversible. The sessions it started are not deleted: they keep their `parentId`, and their lineage says the parent is gone. A `locked` session is `409`: unlock it first. A session, through its `sessions` broker, deletes only the sessions it started and those under them: any other — itself, its parent, a sibling — is `404`.  A session whose disk is on a runner that is away is deleted here at once, and its machine and disk when that runner is back: `202`, naming the runner. The sandboxes server lists them `deleting` until then. 
     * Delete a session, its sandbox, its disk and its transcript
     */
    async deleteSessionRaw(requestParameters: DeleteSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeletedLater>> {
        const requestOptions = await this.deleteSessionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeletedLaterFromJSON(jsonValue));
    }

    /**
     * Irreversible. The sessions it started are not deleted: they keep their `parentId`, and their lineage says the parent is gone. A `locked` session is `409`: unlock it first. A session, through its `sessions` broker, deletes only the sessions it started and those under them: any other — itself, its parent, a sibling — is `404`.  A session whose disk is on a runner that is away is deleted here at once, and its machine and disk when that runner is back: `202`, naming the runner. The sandboxes server lists them `deleting` until then. 
     * Delete a session, its sandbox, its disk and its transcript
     */
    async deleteSession(requestParameters: DeleteSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeletedLater | null | undefined > {
        const response = await this.deleteSessionRaw(requestParameters, initOverrides);
        switch (response.raw.status) {
            case 204:
                return null;
            case 202:
                return await response.value();
            default:
                return await response.value();
        }
    }

    /**
     * Creates request options for forkSession without sending the request
     */
    async forkSessionRequestOpts(requestParameters: ForkSessionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling forkSession().'
            );
        }

        if (requestParameters['forkRequest'] == null) {
            throw new runtime.RequiredError(
                'forkRequest',
                'Required parameter "forkRequest" was null or undefined when calling forkSession().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (requestParameters['idempotencyKey'] != null) {
            headerParameters['Idempotency-Key'] = String(requestParameters['idempotencyKey']);
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

        let urlPath = `/v1/sessions/{sessionId}/fork`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ForkRequestToJSON(requestParameters['forkRequest']),
        };
    }

    /**
     * The new session has the transcript up to `atSeq` (the whole of it when absent), its harness\'s conversation to that point, and a sandbox of its own. Its lineage is `fork`, `branchedFrom` this session at that event.  The server names the fork, as `POST /v1/sessions` names a session: its `id` is in the answer. A retry is made safe by `Idempotency-Key`, the same way. `newSessionId` is deprecated, and kept so that a caller written against it goes on working while it moves, on the timeline `PUT /v1/sessions/{sessionId}` says — removed 2027-01-31; a fork asked for under it answers `Deprecation` and `Sunset` headers. It is idempotent by it, and an id a deleted session had is never taken again (`409 conflict`). Both at once is `400`.  Its `/workspace` starts empty unless `disk` is true, which copies this session\'s `/workspace` as it is now. 
     * Start a new session from this one\'s conversation, up to an event
     */
    async forkSessionRaw(requestParameters: ForkSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>> {
        const requestOptions = await this.forkSessionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionFromJSON(jsonValue));
    }

    /**
     * The new session has the transcript up to `atSeq` (the whole of it when absent), its harness\'s conversation to that point, and a sandbox of its own. Its lineage is `fork`, `branchedFrom` this session at that event.  The server names the fork, as `POST /v1/sessions` names a session: its `id` is in the answer. A retry is made safe by `Idempotency-Key`, the same way. `newSessionId` is deprecated, and kept so that a caller written against it goes on working while it moves, on the timeline `PUT /v1/sessions/{sessionId}` says — removed 2027-01-31; a fork asked for under it answers `Deprecation` and `Sunset` headers. It is idempotent by it, and an id a deleted session had is never taken again (`409 conflict`). Both at once is `400`.  Its `/workspace` starts empty unless `disk` is true, which copies this session\'s `/workspace` as it is now. 
     * Start a new session from this one\'s conversation, up to an event
     */
    async forkSession(requestParameters: ForkSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session> {
        const response = await this.forkSessionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getActivity without sending the request
     */
    async getActivityRequestOpts(requestParameters: GetActivityRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['activityId'] == null) {
            throw new runtime.RequiredError(
                'activityId',
                'Required parameter "activityId" was null or undefined when calling getActivity().'
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

        let urlPath = `/v1/activity/{activityId}`;
        urlPath = urlPath.replace('{activityId}', encodeURIComponent(String(requestParameters['activityId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The request as the session\'s machine sent it and the answer as the broker gave it back: headers, and each body up to a mebibyte (`truncated` when it had more, `size` saying how much). A credential the machine sent or the answer set is not kept.  A gateway entry\'s bodies are not here (`bodiesOnRunner`): they stay on the runner that saw the exchange, and are fetched with `GET /v1/activity/{activityId}/body` only when somebody opens them. 
     * One request a session sent through a broker, and its answer, whole
     */
    async getActivityRaw(requestParameters: GetActivityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Activity>> {
        const requestOptions = await this.getActivityRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ActivityFromJSON(jsonValue));
    }

    /**
     * The request as the session\'s machine sent it and the answer as the broker gave it back: headers, and each body up to a mebibyte (`truncated` when it had more, `size` saying how much). A credential the machine sent or the answer set is not kept.  A gateway entry\'s bodies are not here (`bodiesOnRunner`): they stay on the runner that saw the exchange, and are fetched with `GET /v1/activity/{activityId}/body` only when somebody opens them. 
     * One request a session sent through a broker, and its answer, whole
     */
    async getActivity(requestParameters: GetActivityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Activity> {
        const response = await this.getActivityRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getActivityBody without sending the request
     */
    async getActivityBodyRequestOpts(requestParameters: GetActivityBodyRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['activityId'] == null) {
            throw new runtime.RequiredError(
                'activityId',
                'Required parameter "activityId" was null or undefined when calling getActivityBody().'
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

        let urlPath = `/v1/activity/{activityId}/body`;
        urlPath = urlPath.replace('{activityId}', encodeURIComponent(String(requestParameters['activityId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * As much of the body the machine sent, and of the one it was answered, as was kept. For an entry with `bodiesOnRunner`, asked of the sandboxes server when this is called, and never before: it fetches them from the runner that saw the exchange (`activity.bodies`) and records the read in its own feed. Anyone else\'s, from here.  `503 runner_offline` while that runner is offline, naming it: the entry is listed as usual, and its bodies can be read once the runner is back. `410 gone` once they are gone for good: the runner revoked, or the bodies kept for longer than it keeps them. Read as the entry is: a member their own sessions\', an admin everyone\'s. 
     * An entry\'s bodies, fetched from the runner that keeps them
     */
    async getActivityBodyRaw(requestParameters: GetActivityBodyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ActivityBodies>> {
        const requestOptions = await this.getActivityBodyRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ActivityBodiesFromJSON(jsonValue));
    }

    /**
     * As much of the body the machine sent, and of the one it was answered, as was kept. For an entry with `bodiesOnRunner`, asked of the sandboxes server when this is called, and never before: it fetches them from the runner that saw the exchange (`activity.bodies`) and records the read in its own feed. Anyone else\'s, from here.  `503 runner_offline` while that runner is offline, naming it: the entry is listed as usual, and its bodies can be read once the runner is back. `410 gone` once they are gone for good: the runner revoked, or the bodies kept for longer than it keeps them. Read as the entry is: a member their own sessions\', an admin everyone\'s. 
     * An entry\'s bodies, fetched from the runner that keeps them
     */
    async getActivityBody(requestParameters: GetActivityBodyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ActivityBodies> {
        const response = await this.getActivityBodyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getAvailableRunners without sending the request
     */
    async getAvailableRunnersRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/available-runners`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * How many of the workspace\'s runners could take a new session\'s sandbox now, as its runyard-sandboxes server lists them (read with the workspace\'s own key): those approved and `online`, `unreachable` or `held` — not one `pending` approval, `draining`, `expired` or `revoked`. With none, a session started has its sandbox placed nowhere and fails (`unplaceable`), so a client reads this before starting one and says so instead. Anybody with `sessions.read` may read it; the runners themselves are an admin\'s (`listRunners`). 
     * Whether a new session\'s sandbox has somewhere to run
     */
    async getAvailableRunnersRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<AvailableRunners>> {
        const requestOptions = await this.getAvailableRunnersRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AvailableRunnersFromJSON(jsonValue));
    }

    /**
     * How many of the workspace\'s runners could take a new session\'s sandbox now, as its runyard-sandboxes server lists them (read with the workspace\'s own key): those approved and `online`, `unreachable` or `held` — not one `pending` approval, `draining`, `expired` or `revoked`. With none, a session started has its sandbox placed nowhere and fails (`unplaceable`), so a client reads this before starting one and says so instead. Anybody with `sessions.read` may read it; the runners themselves are an admin\'s (`listRunners`). 
     * Whether a new session\'s sandbox has somewhere to run
     */
    async getAvailableRunners(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<AvailableRunners> {
        const response = await this.getAvailableRunnersRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getLineage without sending the request
     */
    async getLineageRequestOpts(requestParameters: GetLineageRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling getLineage().'
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

        let urlPath = `/v1/sessions/{sessionId}/lineage`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * From its root — a person\'s session, a caller\'s, or a trigger\'s firing — down, depth first, every session started or forked from another in it. At most `limits.maxLineage` nodes; `truncated` says when there were more. 
     * The tree this session belongs to
     */
    async getLineageRaw(requestParameters: GetLineageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Lineage>> {
        const requestOptions = await this.getLineageRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => LineageFromJSON(jsonValue));
    }

    /**
     * From its root — a person\'s session, a caller\'s, or a trigger\'s firing — down, depth first, every session started or forked from another in it. At most `limits.maxLineage` nodes; `truncated` says when there were more. 
     * The tree this session belongs to
     */
    async getLineage(requestParameters: GetLineageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Lineage> {
        const response = await this.getLineageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getSession without sending the request
     */
    async getSessionRequestOpts(requestParameters: GetSessionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling getSession().'
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

        let urlPath = `/v1/sessions/{sessionId}`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A session
     */
    async getSessionRaw(requestParameters: GetSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>> {
        const requestOptions = await this.getSessionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionFromJSON(jsonValue));
    }

    /**
     * A session
     */
    async getSession(requestParameters: GetSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session> {
        const response = await this.getSessionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getSessionShares without sending the request
     */
    async getSessionSharesRequestOpts(requestParameters: GetSessionSharesRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling getSessionShares().'
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

        let urlPath = `/v1/sessions/{sessionId}/shares`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A session is shared with its tree — the sessions it started, and forks — from its root: sharing any of them shares the root\'s. 
     * Whom the session is shared with
     */
    async getSessionSharesRaw(requestParameters: GetSessionSharesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionShares>> {
        const requestOptions = await this.getSessionSharesRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionSharesFromJSON(jsonValue));
    }

    /**
     * A session is shared with its tree — the sessions it started, and forks — from its root: sharing any of them shares the root\'s. 
     * Whom the session is shared with
     */
    async getSessionShares(requestParameters: GetSessionSharesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionShares> {
        const response = await this.getSessionSharesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listActivity without sending the request
     */
    async listActivityRequestOpts(requestParameters: ListActivityRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['cursor'] != null) {
            queryParameters['cursor'] = requestParameters['cursor'];
        }

        if (requestParameters['session'] != null) {
            queryParameters['session'] = requestParameters['session'];
        }

        if (requestParameters['broker'] != null) {
            queryParameters['broker'] = requestParameters['broker'];
        }

        if (requestParameters['kind'] != null) {
            queryParameters['kind'] = requestParameters['kind'];
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

        let urlPath = `/v1/activity`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every request a session\'s machine sent through a broker, and the answer — recorded as it passed, not said by the session: an MCP connector\'s tool called, a `git push` and the refs it moved, a request through an http broker, a host opened through `egress`, a tunnel, a session or an image asked for. Kept a while (`--activity-kept`, a week by default) and then forgotten; kept after its session is deleted, until then.  Where the sandboxes daemon keeps a record of every brokered request — its access gateway\'s feed, which this server reads — that record is the entry, through any broker: this server\'s own, a shared one the daemon dials, one a person\'s own program serves (`kind: gateway`, with how it ended and what it carried). Before a daemon has one, this server records the brokers it serves itself, and nothing else.  The `llm` broker\'s calls are here as any broker\'s: each a call its harness made to the model from the session\'s sandbox.  And beside what sessions did, every call the Runyard platform made to this server\'s API with a platform token: `kind: api`, `actor: platform`, no session\'s and nobody\'s — an admin\'s to read.  And every program a session\'s machine ran, as its kernel recorded it before it ran (`kind: exec`): through no broker, and many for each command a harness runs, so listed only when asked for, with `kind=exec`.  A summary of each, the newest first; `GET /v1/activity/{activityId}` is one whole. A member reads their own sessions\'; an admin, everyone\'s. 
     * What sessions did through their brokers, newest first
     */
    async listActivityRaw(requestParameters: ListActivityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ActivityPage>> {
        const requestOptions = await this.listActivityRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ActivityPageFromJSON(jsonValue));
    }

    /**
     * Every request a session\'s machine sent through a broker, and the answer — recorded as it passed, not said by the session: an MCP connector\'s tool called, a `git push` and the refs it moved, a request through an http broker, a host opened through `egress`, a tunnel, a session or an image asked for. Kept a while (`--activity-kept`, a week by default) and then forgotten; kept after its session is deleted, until then.  Where the sandboxes daemon keeps a record of every brokered request — its access gateway\'s feed, which this server reads — that record is the entry, through any broker: this server\'s own, a shared one the daemon dials, one a person\'s own program serves (`kind: gateway`, with how it ended and what it carried). Before a daemon has one, this server records the brokers it serves itself, and nothing else.  The `llm` broker\'s calls are here as any broker\'s: each a call its harness made to the model from the session\'s sandbox.  And beside what sessions did, every call the Runyard platform made to this server\'s API with a platform token: `kind: api`, `actor: platform`, no session\'s and nobody\'s — an admin\'s to read.  And every program a session\'s machine ran, as its kernel recorded it before it ran (`kind: exec`): through no broker, and many for each command a harness runs, so listed only when asked for, with `kind=exec`.  A summary of each, the newest first; `GET /v1/activity/{activityId}` is one whole. A member reads their own sessions\'; an admin, everyone\'s. 
     * What sessions did through their brokers, newest first
     */
    async listActivity(requestParameters: ListActivityRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ActivityPage> {
        const response = await this.listActivityRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listSessions without sending the request
     */
    async listSessionsRequestOpts(requestParameters: ListSessionsRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['cursor'] != null) {
            queryParameters['cursor'] = requestParameters['cursor'];
        }

        if (requestParameters['whose'] != null) {
            queryParameters['whose'] = requestParameters['whose'];
        }

        if (requestParameters['owner'] != null) {
            queryParameters['owner'] = requestParameters['owner'];
        }

        if (requestParameters['endUser'] != null) {
            queryParameters['endUser'] = requestParameters['endUser'];
        }

        if (requestParameters['state'] != null) {
            queryParameters['state'] = requestParameters['state']!.join(runtime.COLLECTION_FORMATS["csv"]);
        }

        if (requestParameters['source'] != null) {
            queryParameters['source'] = requestParameters['source']!.join(runtime.COLLECTION_FORMATS["csv"]);
        }

        if (requestParameters['archived'] != null) {
            queryParameters['archived'] = requestParameters['archived'];
        }

        if (requestParameters['profileId'] != null) {
            queryParameters['profileId'] = requestParameters['profileId'];
        }

        if (requestParameters['parentId'] != null) {
            queryParameters['parentId'] = requestParameters['parentId'];
        }

        if (requestParameters['rootId'] != null) {
            queryParameters['rootId'] = requestParameters['rootId'];
        }

        if (requestParameters['triggerId'] != null) {
            queryParameters['triggerId'] = requestParameters['triggerId'];
        }

        if (requestParameters['label'] != null) {
            queryParameters['label'] = requestParameters['label'];
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

        let urlPath = `/v1/sessions`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every session, for an admin; for a member, their own and those shared with them — which is what `whose: mine` is for an admin too. 
     * The account\'s sessions, newest activity first
     */
    async listSessionsRaw(requestParameters: ListSessionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionPage>> {
        const requestOptions = await this.listSessionsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionPageFromJSON(jsonValue));
    }

    /**
     * Every session, for an admin; for a member, their own and those shared with them — which is what `whose: mine` is for an admin too. 
     * The account\'s sessions, newest activity first
     */
    async listSessions(requestParameters: ListSessionsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionPage> {
        const response = await this.listSessionsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for putSessionShares without sending the request
     */
    async putSessionSharesRequestOpts(requestParameters: PutSessionSharesRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling putSessionShares().'
            );
        }

        if (requestParameters['sessionShares'] == null) {
            throw new runtime.RequiredError(
                'sessionShares',
                'Required parameter "sessionShares" was null or undefined when calling putSessionShares().'
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

        let urlPath = `/v1/sessions/{sessionId}/shares`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: SessionSharesToJSON(requestParameters['sessionShares']),
        };
    }

    /**
     * They read it — its transcript, its files, its work — and do not steer it. Its person and an admin share it; each one named is a person of the workspace, or it is `400`. 
     * Share the session with these people, and no others
     */
    async putSessionSharesRaw(requestParameters: PutSessionSharesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionShares>> {
        const requestOptions = await this.putSessionSharesRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionSharesFromJSON(jsonValue));
    }

    /**
     * They read it — its transcript, its files, its work — and do not steer it. Its person and an admin share it; each one named is a person of the workspace, or it is `400`. 
     * Share the session with these people, and no others
     */
    async putSessionShares(requestParameters: PutSessionSharesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionShares> {
        const response = await this.putSessionSharesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for restoreSession without sending the request
     */
    async restoreSessionRequestOpts(requestParameters: RestoreSessionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling restoreSession().'
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

        let urlPath = `/v1/sessions/{sessionId}/restore`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Bring an archived session back
     */
    async restoreSessionRaw(requestParameters: RestoreSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>> {
        const requestOptions = await this.restoreSessionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionFromJSON(jsonValue));
    }

    /**
     * Bring an archived session back
     */
    async restoreSession(requestParameters: RestoreSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session> {
        const response = await this.restoreSessionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for searchSessions without sending the request
     */
    async searchSessionsRequestOpts(requestParameters: SearchSessionsRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['q'] == null) {
            throw new runtime.RequiredError(
                'q',
                'Required parameter "q" was null or undefined when calling searchSessions().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['q'] != null) {
            queryParameters['q'] = requestParameters['q'];
        }

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['archived'] != null) {
            queryParameters['archived'] = requestParameters['archived'];
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

        let urlPath = `/v1/search`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Of the caller\'s sessions and those shared with them (`listSessions` with `whose: mine`, an admin\'s as a member\'s), those whose transcripts say every word of `q`: in what a person wrote to them, what they answered, the tools they called and the start of what those answered. Each comes with the newest event that says it. A word is found inside longer ones (`pull/14` finds `…/pull/143`), whatever its case and accents; a word of fewer than three characters is not searched for, and a `q` with no other word finds nothing. Titles are not searched: a caller has them already. 
     * The sessions whose transcripts say something, newest activity first
     */
    async searchSessionsRaw(requestParameters: SearchSessionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionMatchList>> {
        const requestOptions = await this.searchSessionsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionMatchListFromJSON(jsonValue));
    }

    /**
     * Of the caller\'s sessions and those shared with them (`listSessions` with `whose: mine`, an admin\'s as a member\'s), those whose transcripts say every word of `q`: in what a person wrote to them, what they answered, the tools they called and the start of what those answered. Each comes with the newest event that says it. A word is found inside longer ones (`pull/14` finds `…/pull/143`), whatever its case and accents; a word of fewer than three characters is not searched for, and a `q` with no other word finds nothing. Titles are not searched: a caller has them already. 
     * The sessions whose transcripts say something, newest activity first
     */
    async searchSessions(requestParameters: SearchSessionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionMatchList> {
        const response = await this.searchSessionsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for sleepSession without sending the request
     */
    async sleepSessionRequestOpts(requestParameters: SleepSessionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling sleepSession().'
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

        let urlPath = `/v1/sessions/{sessionId}/sleep`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * What the server does by itself after `sandbox.idleSeconds` without a turn or a running background task. A generating session is `409`: interrupt it first. A pending alarm wakes it again shortly before it fires (`nextAlarmAt`). 
     * Release a session\'s sandbox now, keeping its disk
     */
    async sleepSessionRaw(requestParameters: SleepSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>> {
        const requestOptions = await this.sleepSessionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionFromJSON(jsonValue));
    }

    /**
     * What the server does by itself after `sandbox.idleSeconds` without a turn or a running background task. A generating session is `409`: interrupt it first. A pending alarm wakes it again shortly before it fires (`nextAlarmAt`). 
     * Release a session\'s sandbox now, keeping its disk
     */
    async sleepSession(requestParameters: SleepSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session> {
        const response = await this.sleepSessionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for startSession without sending the request
     */
    async startSessionRequestOpts(requestParameters: StartSessionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionSpec'] == null) {
            throw new runtime.RequiredError(
                'sessionSpec',
                'Required parameter "sessionSpec" was null or undefined when calling startSession().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (requestParameters['idempotencyKey'] != null) {
            headerParameters['Idempotency-Key'] = String(requestParameters['idempotencyKey']);
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

        let urlPath = `/v1/sessions`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SessionSpecToJSON(requestParameters['sessionSpec']),
        };
    }

    /**
     * From a profile (`profileId`, at its latest version unless one is named), with any field of the session overridden, or from nothing but the overrides. The answer comes at once, the sandbox `creating`; the session\'s stream says when its harness is up. A first turn may be sent with it, and is taken as soon as the session is.  **The server names the session**: its `id` is in the answer, opaque, and never one a session had before. A caller cannot choose it, so nothing that knows a session by its id — a broker, an application, a log — can be handed a session somebody else made under an id it already trusts.  A retry is made safe by `Idempotency-Key`, which is the caller\'s own: the same key and the same request again is `200` with the session it made, as it is now; the same key with a different request is `409 spec_conflict`. A key is the caller\'s — another caller\'s same key is another request — and lasts as long as the session it made.  A session whose disk the workspace\'s disk budget has no room left for is refused `507 quota_exceeded`, before anything is kept: every session\'s disk is counted at its full size for as long as it is kept, so waiting frees none of it, and deleting a session does. 
     * Start a session
     */
    async startSessionRaw(requestParameters: StartSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>> {
        const requestOptions = await this.startSessionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionFromJSON(jsonValue));
    }

    /**
     * From a profile (`profileId`, at its latest version unless one is named), with any field of the session overridden, or from nothing but the overrides. The answer comes at once, the sandbox `creating`; the session\'s stream says when its harness is up. A first turn may be sent with it, and is taken as soon as the session is.  **The server names the session**: its `id` is in the answer, opaque, and never one a session had before. A caller cannot choose it, so nothing that knows a session by its id — a broker, an application, a log — can be handed a session somebody else made under an id it already trusts.  A retry is made safe by `Idempotency-Key`, which is the caller\'s own: the same key and the same request again is `200` with the session it made, as it is now; the same key with a different request is `409 spec_conflict`. A key is the caller\'s — another caller\'s same key is another request — and lasts as long as the session it made.  A session whose disk the workspace\'s disk budget has no room left for is refused `507 quota_exceeded`, before anything is kept: every session\'s disk is counted at its full size for as long as it is kept, so waiting frees none of it, and deleting a session does. 
     * Start a session
     */
    async startSession(requestParameters: StartSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session> {
        const response = await this.startSessionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for updateSession without sending the request
     */
    async updateSessionRequestOpts(requestParameters: UpdateSessionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling updateSession().'
            );
        }

        if (requestParameters['sessionUpdate'] == null) {
            throw new runtime.RequiredError(
                'sessionUpdate',
                'Required parameter "sessionUpdate" was null or undefined when calling updateSession().'
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

        let urlPath = `/v1/sessions/{sessionId}`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: SessionUpdateToJSON(requestParameters['sessionUpdate']),
        };
    }

    /**
     * Absent fields are left as they are. A change of model, brokers, or MCP connectors restarts the session at its next turn, resumed from the transcript; a change of resources applies the next time the sandbox is made — at once if `restartSandbox`, else when it wakes. 
     * Retitle, relabel, or reconfigure a session
     */
    async updateSessionRaw(requestParameters: UpdateSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>> {
        const requestOptions = await this.updateSessionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionFromJSON(jsonValue));
    }

    /**
     * Absent fields are left as they are. A change of model, brokers, or MCP connectors restarts the session at its next turn, resumed from the transcript; a change of resources applies the next time the sandbox is made — at once if `restartSandbox`, else when it wakes. 
     * Retitle, relabel, or reconfigure a session
     */
    async updateSession(requestParameters: UpdateSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session> {
        const response = await this.updateSessionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for wakeSession without sending the request
     */
    async wakeSessionRequestOpts(requestParameters: WakeSessionRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling wakeSession().'
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

        let urlPath = `/v1/sessions/{sessionId}/wake`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A turn wakes a session by itself; this is for a caller about to open its terminal or files.
     * Give a sleeping session a sandbox again, without a turn
     */
    async wakeSessionRaw(requestParameters: WakeSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Session>> {
        const requestOptions = await this.wakeSessionRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionFromJSON(jsonValue));
    }

    /**
     * A turn wakes a session by itself; this is for a caller about to open its terminal or files.
     * Give a sleeping session a sandbox again, without a turn
     */
    async wakeSession(requestParameters: WakeSessionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Session> {
        const response = await this.wakeSessionRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ListActivityKindEnum = {
    Mcp: 'mcp',
    Egress: 'egress',
    Tunnels: 'tunnels',
    Sessions: 'sessions',
    Images: 'images',
    Gateway: 'gateway',
    OneOff: 'one_off',
    Api: 'api',
    Exec: 'exec',
} as const;
export type ListActivityKindEnum = typeof ListActivityKindEnum[keyof typeof ListActivityKindEnum];
/**
 * @export
 */
export const ListSessionsWhoseEnum = {
    All: 'all',
    Mine: 'mine',
} as const;
export type ListSessionsWhoseEnum = typeof ListSessionsWhoseEnum[keyof typeof ListSessionsWhoseEnum];
