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
    type CompactRequest,
    CompactRequestFromJSON,
    CompactRequestToJSON,
} from '../models/CompactRequest.js';
import {
    type InterruptRequest,
    InterruptRequestFromJSON,
    InterruptRequestToJSON,
} from '../models/InterruptRequest.js';
import {
    type QueuedTurn,
    QueuedTurnFromJSON,
    QueuedTurnToJSON,
} from '../models/QueuedTurn.js';
import {
    type QueuedTurnEdit,
    QueuedTurnEditFromJSON,
    QueuedTurnEditToJSON,
} from '../models/QueuedTurnEdit.js';
import {
    type RewindRequest,
    RewindRequestFromJSON,
    RewindRequestToJSON,
} from '../models/RewindRequest.js';
import {
    type Turn,
    TurnFromJSON,
    TurnToJSON,
} from '../models/Turn.js';
import {
    type TurnAccepted,
    TurnAcceptedFromJSON,
    TurnAcceptedToJSON,
} from '../models/TurnAccepted.js';
import {
    type Upload,
    UploadFromJSON,
    UploadToJSON,
} from '../models/Upload.js';

export interface CancelQueuedTurnRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * The `turnId` of a turn in the session's `queue`.
     */
    turnId: string;
}

export interface CompactOperationRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    compactRequest?: CompactRequest;
}

export interface CreateUploadRequest {
    /**
     * The file's name, without a slash. Where it goes on the session's disk.
     */
    name: string;
    /**
     * 
     */
    body: Blob;
}

export interface DeleteUploadRequest {
    /**
     * 
     */
    uploadId: string;
}

export interface EditQueuedTurnRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * The `turnId` of a turn in the session's `queue`.
     */
    turnId: string;
    /**
     * 
     */
    queuedTurnEdit: QueuedTurnEdit;
}

export interface GetAttachmentRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    uploadId: string;
}

export interface HoldQueuedTurnRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * The `turnId` of a turn in the session's `queue`.
     */
    turnId: string;
}

export interface InterruptOperationRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    interruptRequest?: InterruptRequest;
}

export interface InterruptWithQueuedTurnRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * The `turnId` of a turn in the session's `queue`.
     */
    turnId: string;
}

export interface ReleaseQueuedTurnRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * The `turnId` of a turn in the session's `queue`.
     */
    turnId: string;
}

export interface RewindOperationRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    rewindRequest: RewindRequest;
}

export interface SendTurnRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    turn: Turn;
}

/**
 * TurnsApi - interface
 * 
 * @export
 * @interface TurnsApiInterface
 */
export interface TurnsApiInterface {
    /**
     * Creates request options for cancelQueuedTurn without sending the request
     * @param {string} sessionId 
     * @param {string} turnId The &#x60;turnId&#x60; of a turn in the session\&#39;s &#x60;queue&#x60;.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    cancelQueuedTurnRequestOpts(requestParameters: CancelQueuedTurnRequest): Promise<runtime.RequestOpts>;

    /**
     * The turn leaves the session\'s `queue` and is never given to its harness. The uploads it named are the caller\'s again, to attach once more or to be evicted. Its `turnId` stays used: sent again, it is `200` and changes nothing. `404` once the harness has taken it — it is on the stream then — or when no turn of that id waits. 
     * @summary Take back a turn still waiting in the session\'s queue
     * @param {string} sessionId 
     * @param {string} turnId The &#x60;turnId&#x60; of a turn in the session\&#39;s &#x60;queue&#x60;.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    cancelQueuedTurnRaw(requestParameters: CancelQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<QueuedTurn>>;

    /**
     * The turn leaves the session\'s `queue` and is never given to its harness. The uploads it named are the caller\'s again, to attach once more or to be evicted. Its `turnId` stays used: sent again, it is `200` and changes nothing. `404` once the harness has taken it — it is on the stream then — or when no turn of that id waits. 
     * Take back a turn still waiting in the session\'s queue
     */
    cancelQueuedTurn(requestParameters: CancelQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<QueuedTurn>;

    /**
     * Creates request options for compact without sending the request
     * @param {string} sessionId 
     * @param {CompactRequest} [compactRequest] 
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    compactRequestOpts(requestParameters: CompactOperationRequest): Promise<runtime.RequestOpts>;

    /**
     * Answered on the stream with a `compaction` event. `409` while generating.
     * @summary Summarise the conversation so far into a smaller context
     * @param {string} sessionId 
     * @param {CompactRequest} [compactRequest] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    compactRaw(requestParameters: CompactOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Answered on the stream with a `compaction` event. `409` while generating.
     * Summarise the conversation so far into a smaller context
     */
    compact(requestParameters: CompactOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for createUpload without sending the request
     * @param {string} name The file\&#39;s name, without a slash. Where it goes on the session\&#39;s disk.
     * @param {Blob} body 
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    createUploadRequestOpts(requestParameters: CreateUploadRequest): Promise<runtime.RequestOpts>;

    /**
     * The bytes are kept as they are — never opened for what they say — until a turn names the upload, which makes it that turn\'s session\'s. Nothing runs in a sandbox for it: the file is put on the session\'s disk when the session is given the turn. One no turn names within `limits.uploadTtlSeconds` is evicted. 
     * @summary Keep a file for a message not sent yet
     * @param {string} name The file\&#39;s name, without a slash. Where it goes on the session\&#39;s disk.
     * @param {Blob} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    createUploadRaw(requestParameters: CreateUploadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Upload>>;

    /**
     * The bytes are kept as they are — never opened for what they say — until a turn names the upload, which makes it that turn\'s session\'s. Nothing runs in a sandbox for it: the file is put on the session\'s disk when the session is given the turn. One no turn names within `limits.uploadTtlSeconds` is evicted. 
     * Keep a file for a message not sent yet
     */
    createUpload(requestParameters: CreateUploadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Upload>;

    /**
     * Creates request options for deleteUpload without sending the request
     * @param {string} uploadId 
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    deleteUploadRequestOpts(requestParameters: DeleteUploadRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary Forget a file taken off a message before it was sent
     * @param {string} uploadId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    deleteUploadRaw(requestParameters: DeleteUploadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Forget a file taken off a message before it was sent
     */
    deleteUpload(requestParameters: DeleteUploadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for editQueuedTurn without sending the request
     * @param {string} sessionId 
     * @param {string} turnId The &#x60;turnId&#x60; of a turn in the session\&#39;s &#x60;queue&#x60;.
     * @param {QueuedTurnEdit} queuedTurnEdit 
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    editQueuedTurnRequestOpts(requestParameters: EditQueuedTurnRequest): Promise<runtime.RequestOpts>;

    /**
     * Its `text` is replaced, and it keeps its place, its `turnId` and its attachments. A hold on it (`PUT …/hold`) is let go of: the session is given it, as it says now, when its turn comes. `404` once the harness has taken it — it is on the stream then, as it was — or when no turn of that id waits; `409` for the session\'s first turn, which its harness is given as soon as it is up: take it back instead. 
     * @summary Change what a turn still waiting in the session\'s queue says
     * @param {string} sessionId 
     * @param {string} turnId The &#x60;turnId&#x60; of a turn in the session\&#39;s &#x60;queue&#x60;.
     * @param {QueuedTurnEdit} queuedTurnEdit 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    editQueuedTurnRaw(requestParameters: EditQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<QueuedTurn>>;

    /**
     * Its `text` is replaced, and it keeps its place, its `turnId` and its attachments. A hold on it (`PUT …/hold`) is let go of: the session is given it, as it says now, when its turn comes. `404` once the harness has taken it — it is on the stream then, as it was — or when no turn of that id waits; `409` for the session\'s first turn, which its harness is given as soon as it is up: take it back instead. 
     * Change what a turn still waiting in the session\'s queue says
     */
    editQueuedTurn(requestParameters: EditQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<QueuedTurn>;

    /**
     * Creates request options for getAttachment without sending the request
     * @param {string} sessionId 
     * @param {string} uploadId 
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    getAttachmentRequestOpts(requestParameters: GetAttachmentRequest): Promise<runtime.RequestOpts>;

    /**
     * Kept by the server, so read whether the session is asleep or awake. Served as bytes to save, never as a page: it may be anything. 
     * @summary A file sent to the session with a turn, or an image a tool answered with
     * @param {string} sessionId 
     * @param {string} uploadId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    getAttachmentRaw(requestParameters: GetAttachmentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<runtime.HttpFile>>;

    /**
     * Kept by the server, so read whether the session is asleep or awake. Served as bytes to save, never as a page: it may be anything. 
     * A file sent to the session with a turn, or an image a tool answered with
     */
    getAttachment(requestParameters: GetAttachmentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.HttpFile>;

    /**
     * Creates request options for holdQueuedTurn without sending the request
     * @param {string} sessionId 
     * @param {string} turnId The &#x60;turnId&#x60; of a turn in the session\&#39;s &#x60;queue&#x60;.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    holdQueuedTurnRequestOpts(requestParameters: HoldQueuedTurnRequest): Promise<runtime.RequestOpts>;

    /**
     * While a turn is held, the session is not given it — nor any turn behind it, which keep their order — however long its harness has been free: it waits for the edit (`PATCH …/queue/{turnId}`), or for the hold to be let go of (`DELETE …/hold`), and is given then. A hold lasts until its `heldUntil`, five minutes from when it was last asked for, so that an editor that went away stops no session for long: asked again, it is kept that much longer. Turns ahead of it are given as they would be. `404` once the harness has taken it, or when no turn of that id waits; `409` for the session\'s first turn, which its harness is given as soon as it is up. 
     * @summary Keep a turn waiting while somebody edits it
     * @param {string} sessionId 
     * @param {string} turnId The &#x60;turnId&#x60; of a turn in the session\&#39;s &#x60;queue&#x60;.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    holdQueuedTurnRaw(requestParameters: HoldQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<QueuedTurn>>;

    /**
     * While a turn is held, the session is not given it — nor any turn behind it, which keep their order — however long its harness has been free: it waits for the edit (`PATCH …/queue/{turnId}`), or for the hold to be let go of (`DELETE …/hold`), and is given then. A hold lasts until its `heldUntil`, five minutes from when it was last asked for, so that an editor that went away stops no session for long: asked again, it is kept that much longer. Turns ahead of it are given as they would be. `404` once the harness has taken it, or when no turn of that id waits; `409` for the session\'s first turn, which its harness is given as soon as it is up. 
     * Keep a turn waiting while somebody edits it
     */
    holdQueuedTurn(requestParameters: HoldQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<QueuedTurn>;

    /**
     * Creates request options for interrupt without sending the request
     * @param {string} sessionId 
     * @param {InterruptRequest} [interruptRequest] 
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    interruptRequestOpts(requestParameters: InterruptOperationRequest): Promise<runtime.RequestOpts>;

    /**
     * The turn ends with `stopReason: interrupted`. Queued turns are kept unless `dropQueued`. Background tasks and sub-agents of the turn are not stopped: they are stopped on their own. 
     * @summary Stop what the session is generating
     * @param {string} sessionId 
     * @param {InterruptRequest} [interruptRequest] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    interruptRaw(requestParameters: InterruptOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * The turn ends with `stopReason: interrupted`. Queued turns are kept unless `dropQueued`. Background tasks and sub-agents of the turn are not stopped: they are stopped on their own. 
     * Stop what the session is generating
     */
    interrupt(requestParameters: InterruptOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for interruptWithQueuedTurn without sending the request
     * @param {string} sessionId 
     * @param {string} turnId The &#x60;turnId&#x60; of a turn in the session\&#39;s &#x60;queue&#x60;.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    interruptWithQueuedTurnRequestOpts(requestParameters: InterruptWithQueuedTurnRequest): Promise<runtime.RequestOpts>;

    /**
     * The turn goes to the head of the session\'s `queue` and what is being generated is interrupted, as a turn sent with `mode: interrupt` would: it is taken next. A session not generating takes it before the others waiting, and a sleeping one wakes for it. `404` once the harness has taken it, or when no turn of that id waits; `409` when the session is archived, or the turn is held while somebody edits it. 
     * @summary Give a waiting turn now, interrupting what the session is generating
     * @param {string} sessionId 
     * @param {string} turnId The &#x60;turnId&#x60; of a turn in the session\&#39;s &#x60;queue&#x60;.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    interruptWithQueuedTurnRaw(requestParameters: InterruptWithQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * The turn goes to the head of the session\'s `queue` and what is being generated is interrupted, as a turn sent with `mode: interrupt` would: it is taken next. A session not generating takes it before the others waiting, and a sleeping one wakes for it. `404` once the harness has taken it, or when no turn of that id waits; `409` when the session is archived, or the turn is held while somebody edits it. 
     * Give a waiting turn now, interrupting what the session is generating
     */
    interruptWithQueuedTurn(requestParameters: InterruptWithQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for releaseQueuedTurn without sending the request
     * @param {string} sessionId 
     * @param {string} turnId The &#x60;turnId&#x60; of a turn in the session\&#39;s &#x60;queue&#x60;.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    releaseQueuedTurnRequestOpts(requestParameters: ReleaseQueuedTurnRequest): Promise<runtime.RequestOpts>;

    /**
     * The edit was abandoned: the turn waits as it was, and is given when its turn comes — at once, when the session was kept waiting for it. A turn not held is `200` and changes nothing. `404` once the harness has taken it, or when no turn of that id waits. 
     * @summary Let go of a turn held while somebody edited it
     * @param {string} sessionId 
     * @param {string} turnId The &#x60;turnId&#x60; of a turn in the session\&#39;s &#x60;queue&#x60;.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    releaseQueuedTurnRaw(requestParameters: ReleaseQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<QueuedTurn>>;

    /**
     * The edit was abandoned: the turn waits as it was, and is given when its turn comes — at once, when the session was kept waiting for it. A turn not held is `200` and changes nothing. `404` once the harness has taken it, or when no turn of that id waits. 
     * Let go of a turn held while somebody edited it
     */
    releaseQueuedTurn(requestParameters: ReleaseQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<QueuedTurn>;

    /**
     * Creates request options for rewind without sending the request
     * @param {string} sessionId 
     * @param {RewindRequest} rewindRequest 
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    rewindRequestOpts(requestParameters: RewindOperationRequest): Promise<runtime.RequestOpts>;

    /**
     * Appends a `rewound` event: every event after `toSeq` no longer counts, for the session and for a reader that replays. The disk is not rewound — what the session did to it stays. Send the edited turn after it; to keep both versions, fork instead. `409` while generating. 
     * @summary Take the conversation back to before a turn, to edit or retry it
     * @param {string} sessionId 
     * @param {RewindRequest} rewindRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    rewindRaw(requestParameters: RewindOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Appends a `rewound` event: every event after `toSeq` no longer counts, for the session and for a reader that replays. The disk is not rewound — what the session did to it stays. Send the edited turn after it; to keep both versions, fork instead. `409` while generating. 
     * Take the conversation back to before a turn, to edit or retry it
     */
    rewind(requestParameters: RewindOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for sendTurn without sending the request
     * @param {string} sessionId 
     * @param {Turn} turn 
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    sendTurnRequestOpts(requestParameters: SendTurnRequest): Promise<runtime.RequestOpts>;

    /**
     * Accepted at once and answered on the stream. While the session is generating, a turn is queued behind it (`mode: queue`, the default), or interrupts it and is taken next (`mode: interrupt`). A sleeping session wakes for it. The same `turnId` again is `200` and changes nothing — a caller that lost the answer resends.  A turn never carries bytes. A file from the caller is uploaded first (`POST /v1/uploads`) and attached by its `uploadId`: the server keeps it, and puts it on the session\'s disk, under `.attachments/<turnId>/`, only when the session is given the turn: each at a `path` of its own, numbered when two share a `name`. A file already on the session\'s disk is attached by path. An upload a turn names is the session\'s from then on, served by `GET …/attachments/{uploadId}` asleep or awake; one named by no turn within `limits.uploadTtlSeconds` is evicted. 
     * @summary Say something to the session
     * @param {string} sessionId 
     * @param {Turn} turn 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TurnsApiInterface
     */
    sendTurnRaw(requestParameters: SendTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TurnAccepted>>;

    /**
     * Accepted at once and answered on the stream. While the session is generating, a turn is queued behind it (`mode: queue`, the default), or interrupts it and is taken next (`mode: interrupt`). A sleeping session wakes for it. The same `turnId` again is `200` and changes nothing — a caller that lost the answer resends.  A turn never carries bytes. A file from the caller is uploaded first (`POST /v1/uploads`) and attached by its `uploadId`: the server keeps it, and puts it on the session\'s disk, under `.attachments/<turnId>/`, only when the session is given the turn: each at a `path` of its own, numbered when two share a `name`. A file already on the session\'s disk is attached by path. An upload a turn names is the session\'s from then on, served by `GET …/attachments/{uploadId}` asleep or awake; one named by no turn within `limits.uploadTtlSeconds` is evicted. 
     * Say something to the session
     */
    sendTurn(requestParameters: SendTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TurnAccepted>;

}

/**
 * 
 */
export class TurnsApi extends runtime.BaseAPI implements TurnsApiInterface {

    /**
     * Creates request options for cancelQueuedTurn without sending the request
     */
    async cancelQueuedTurnRequestOpts(requestParameters: CancelQueuedTurnRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling cancelQueuedTurn().'
            );
        }

        if (requestParameters['turnId'] == null) {
            throw new runtime.RequiredError(
                'turnId',
                'Required parameter "turnId" was null or undefined when calling cancelQueuedTurn().'
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

        let urlPath = `/v1/sessions/{sessionId}/queue/{turnId}`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));
        urlPath = urlPath.replace('{turnId}', encodeURIComponent(String(requestParameters['turnId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The turn leaves the session\'s `queue` and is never given to its harness. The uploads it named are the caller\'s again, to attach once more or to be evicted. Its `turnId` stays used: sent again, it is `200` and changes nothing. `404` once the harness has taken it — it is on the stream then — or when no turn of that id waits. 
     * Take back a turn still waiting in the session\'s queue
     */
    async cancelQueuedTurnRaw(requestParameters: CancelQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<QueuedTurn>> {
        const requestOptions = await this.cancelQueuedTurnRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => QueuedTurnFromJSON(jsonValue));
    }

    /**
     * The turn leaves the session\'s `queue` and is never given to its harness. The uploads it named are the caller\'s again, to attach once more or to be evicted. Its `turnId` stays used: sent again, it is `200` and changes nothing. `404` once the harness has taken it — it is on the stream then — or when no turn of that id waits. 
     * Take back a turn still waiting in the session\'s queue
     */
    async cancelQueuedTurn(requestParameters: CancelQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<QueuedTurn> {
        const response = await this.cancelQueuedTurnRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for compact without sending the request
     */
    async compactRequestOpts(requestParameters: CompactOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling compact().'
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

        let urlPath = `/v1/sessions/{sessionId}/compact`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CompactRequestToJSON(requestParameters['compactRequest']),
        };
    }

    /**
     * Answered on the stream with a `compaction` event. `409` while generating.
     * Summarise the conversation so far into a smaller context
     */
    async compactRaw(requestParameters: CompactOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.compactRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Answered on the stream with a `compaction` event. `409` while generating.
     * Summarise the conversation so far into a smaller context
     */
    async compact(requestParameters: CompactOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.compactRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for createUpload without sending the request
     */
    async createUploadRequestOpts(requestParameters: CreateUploadRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['name'] == null) {
            throw new runtime.RequiredError(
                'name',
                'Required parameter "name" was null or undefined when calling createUpload().'
            );
        }

        if (requestParameters['body'] == null) {
            throw new runtime.RequiredError(
                'body',
                'Required parameter "body" was null or undefined when calling createUpload().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['name'] != null) {
            queryParameters['name'] = requestParameters['name'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/octet-stream';

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

        let urlPath = `/v1/uploads`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['body'] as any,
        };
    }

    /**
     * The bytes are kept as they are — never opened for what they say — until a turn names the upload, which makes it that turn\'s session\'s. Nothing runs in a sandbox for it: the file is put on the session\'s disk when the session is given the turn. One no turn names within `limits.uploadTtlSeconds` is evicted. 
     * Keep a file for a message not sent yet
     */
    async createUploadRaw(requestParameters: CreateUploadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Upload>> {
        const requestOptions = await this.createUploadRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UploadFromJSON(jsonValue));
    }

    /**
     * The bytes are kept as they are — never opened for what they say — until a turn names the upload, which makes it that turn\'s session\'s. Nothing runs in a sandbox for it: the file is put on the session\'s disk when the session is given the turn. One no turn names within `limits.uploadTtlSeconds` is evicted. 
     * Keep a file for a message not sent yet
     */
    async createUpload(requestParameters: CreateUploadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Upload> {
        const response = await this.createUploadRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for deleteUpload without sending the request
     */
    async deleteUploadRequestOpts(requestParameters: DeleteUploadRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['uploadId'] == null) {
            throw new runtime.RequiredError(
                'uploadId',
                'Required parameter "uploadId" was null or undefined when calling deleteUpload().'
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

        let urlPath = `/v1/uploads/{uploadId}`;
        urlPath = urlPath.replace('{uploadId}', encodeURIComponent(String(requestParameters['uploadId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Forget a file taken off a message before it was sent
     */
    async deleteUploadRaw(requestParameters: DeleteUploadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteUploadRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Forget a file taken off a message before it was sent
     */
    async deleteUpload(requestParameters: DeleteUploadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteUploadRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for editQueuedTurn without sending the request
     */
    async editQueuedTurnRequestOpts(requestParameters: EditQueuedTurnRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling editQueuedTurn().'
            );
        }

        if (requestParameters['turnId'] == null) {
            throw new runtime.RequiredError(
                'turnId',
                'Required parameter "turnId" was null or undefined when calling editQueuedTurn().'
            );
        }

        if (requestParameters['queuedTurnEdit'] == null) {
            throw new runtime.RequiredError(
                'queuedTurnEdit',
                'Required parameter "queuedTurnEdit" was null or undefined when calling editQueuedTurn().'
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

        let urlPath = `/v1/sessions/{sessionId}/queue/{turnId}`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));
        urlPath = urlPath.replace('{turnId}', encodeURIComponent(String(requestParameters['turnId'])));

        return {
            path: urlPath,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: QueuedTurnEditToJSON(requestParameters['queuedTurnEdit']),
        };
    }

    /**
     * Its `text` is replaced, and it keeps its place, its `turnId` and its attachments. A hold on it (`PUT …/hold`) is let go of: the session is given it, as it says now, when its turn comes. `404` once the harness has taken it — it is on the stream then, as it was — or when no turn of that id waits; `409` for the session\'s first turn, which its harness is given as soon as it is up: take it back instead. 
     * Change what a turn still waiting in the session\'s queue says
     */
    async editQueuedTurnRaw(requestParameters: EditQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<QueuedTurn>> {
        const requestOptions = await this.editQueuedTurnRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => QueuedTurnFromJSON(jsonValue));
    }

    /**
     * Its `text` is replaced, and it keeps its place, its `turnId` and its attachments. A hold on it (`PUT …/hold`) is let go of: the session is given it, as it says now, when its turn comes. `404` once the harness has taken it — it is on the stream then, as it was — or when no turn of that id waits; `409` for the session\'s first turn, which its harness is given as soon as it is up: take it back instead. 
     * Change what a turn still waiting in the session\'s queue says
     */
    async editQueuedTurn(requestParameters: EditQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<QueuedTurn> {
        const response = await this.editQueuedTurnRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getAttachment without sending the request
     */
    async getAttachmentRequestOpts(requestParameters: GetAttachmentRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling getAttachment().'
            );
        }

        if (requestParameters['uploadId'] == null) {
            throw new runtime.RequiredError(
                'uploadId',
                'Required parameter "uploadId" was null or undefined when calling getAttachment().'
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

        let urlPath = `/v1/sessions/{sessionId}/attachments/{uploadId}`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));
        urlPath = urlPath.replace('{uploadId}', encodeURIComponent(String(requestParameters['uploadId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Kept by the server, so read whether the session is asleep or awake. Served as bytes to save, never as a page: it may be anything. 
     * A file sent to the session with a turn, or an image a tool answered with
     */
    async getAttachmentRaw(requestParameters: GetAttachmentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<runtime.HttpFile>> {
        const requestOptions = await this.getAttachmentRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.BlobApiResponse(response);
    }

    /**
     * Kept by the server, so read whether the session is asleep or awake. Served as bytes to save, never as a page: it may be anything. 
     * A file sent to the session with a turn, or an image a tool answered with
     */
    async getAttachment(requestParameters: GetAttachmentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.HttpFile> {
        const response = await this.getAttachmentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for holdQueuedTurn without sending the request
     */
    async holdQueuedTurnRequestOpts(requestParameters: HoldQueuedTurnRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling holdQueuedTurn().'
            );
        }

        if (requestParameters['turnId'] == null) {
            throw new runtime.RequiredError(
                'turnId',
                'Required parameter "turnId" was null or undefined when calling holdQueuedTurn().'
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

        let urlPath = `/v1/sessions/{sessionId}/queue/{turnId}/hold`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));
        urlPath = urlPath.replace('{turnId}', encodeURIComponent(String(requestParameters['turnId'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * While a turn is held, the session is not given it — nor any turn behind it, which keep their order — however long its harness has been free: it waits for the edit (`PATCH …/queue/{turnId}`), or for the hold to be let go of (`DELETE …/hold`), and is given then. A hold lasts until its `heldUntil`, five minutes from when it was last asked for, so that an editor that went away stops no session for long: asked again, it is kept that much longer. Turns ahead of it are given as they would be. `404` once the harness has taken it, or when no turn of that id waits; `409` for the session\'s first turn, which its harness is given as soon as it is up. 
     * Keep a turn waiting while somebody edits it
     */
    async holdQueuedTurnRaw(requestParameters: HoldQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<QueuedTurn>> {
        const requestOptions = await this.holdQueuedTurnRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => QueuedTurnFromJSON(jsonValue));
    }

    /**
     * While a turn is held, the session is not given it — nor any turn behind it, which keep their order — however long its harness has been free: it waits for the edit (`PATCH …/queue/{turnId}`), or for the hold to be let go of (`DELETE …/hold`), and is given then. A hold lasts until its `heldUntil`, five minutes from when it was last asked for, so that an editor that went away stops no session for long: asked again, it is kept that much longer. Turns ahead of it are given as they would be. `404` once the harness has taken it, or when no turn of that id waits; `409` for the session\'s first turn, which its harness is given as soon as it is up. 
     * Keep a turn waiting while somebody edits it
     */
    async holdQueuedTurn(requestParameters: HoldQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<QueuedTurn> {
        const response = await this.holdQueuedTurnRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for interrupt without sending the request
     */
    async interruptRequestOpts(requestParameters: InterruptOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling interrupt().'
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

        let urlPath = `/v1/sessions/{sessionId}/interrupt`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: InterruptRequestToJSON(requestParameters['interruptRequest']),
        };
    }

    /**
     * The turn ends with `stopReason: interrupted`. Queued turns are kept unless `dropQueued`. Background tasks and sub-agents of the turn are not stopped: they are stopped on their own. 
     * Stop what the session is generating
     */
    async interruptRaw(requestParameters: InterruptOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.interruptRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The turn ends with `stopReason: interrupted`. Queued turns are kept unless `dropQueued`. Background tasks and sub-agents of the turn are not stopped: they are stopped on their own. 
     * Stop what the session is generating
     */
    async interrupt(requestParameters: InterruptOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.interruptRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for interruptWithQueuedTurn without sending the request
     */
    async interruptWithQueuedTurnRequestOpts(requestParameters: InterruptWithQueuedTurnRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling interruptWithQueuedTurn().'
            );
        }

        if (requestParameters['turnId'] == null) {
            throw new runtime.RequiredError(
                'turnId',
                'Required parameter "turnId" was null or undefined when calling interruptWithQueuedTurn().'
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

        let urlPath = `/v1/sessions/{sessionId}/queue/{turnId}/interrupt`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));
        urlPath = urlPath.replace('{turnId}', encodeURIComponent(String(requestParameters['turnId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The turn goes to the head of the session\'s `queue` and what is being generated is interrupted, as a turn sent with `mode: interrupt` would: it is taken next. A session not generating takes it before the others waiting, and a sleeping one wakes for it. `404` once the harness has taken it, or when no turn of that id waits; `409` when the session is archived, or the turn is held while somebody edits it. 
     * Give a waiting turn now, interrupting what the session is generating
     */
    async interruptWithQueuedTurnRaw(requestParameters: InterruptWithQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.interruptWithQueuedTurnRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The turn goes to the head of the session\'s `queue` and what is being generated is interrupted, as a turn sent with `mode: interrupt` would: it is taken next. A session not generating takes it before the others waiting, and a sleeping one wakes for it. `404` once the harness has taken it, or when no turn of that id waits; `409` when the session is archived, or the turn is held while somebody edits it. 
     * Give a waiting turn now, interrupting what the session is generating
     */
    async interruptWithQueuedTurn(requestParameters: InterruptWithQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.interruptWithQueuedTurnRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for releaseQueuedTurn without sending the request
     */
    async releaseQueuedTurnRequestOpts(requestParameters: ReleaseQueuedTurnRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling releaseQueuedTurn().'
            );
        }

        if (requestParameters['turnId'] == null) {
            throw new runtime.RequiredError(
                'turnId',
                'Required parameter "turnId" was null or undefined when calling releaseQueuedTurn().'
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

        let urlPath = `/v1/sessions/{sessionId}/queue/{turnId}/hold`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));
        urlPath = urlPath.replace('{turnId}', encodeURIComponent(String(requestParameters['turnId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The edit was abandoned: the turn waits as it was, and is given when its turn comes — at once, when the session was kept waiting for it. A turn not held is `200` and changes nothing. `404` once the harness has taken it, or when no turn of that id waits. 
     * Let go of a turn held while somebody edited it
     */
    async releaseQueuedTurnRaw(requestParameters: ReleaseQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<QueuedTurn>> {
        const requestOptions = await this.releaseQueuedTurnRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => QueuedTurnFromJSON(jsonValue));
    }

    /**
     * The edit was abandoned: the turn waits as it was, and is given when its turn comes — at once, when the session was kept waiting for it. A turn not held is `200` and changes nothing. `404` once the harness has taken it, or when no turn of that id waits. 
     * Let go of a turn held while somebody edited it
     */
    async releaseQueuedTurn(requestParameters: ReleaseQueuedTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<QueuedTurn> {
        const response = await this.releaseQueuedTurnRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for rewind without sending the request
     */
    async rewindRequestOpts(requestParameters: RewindOperationRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling rewind().'
            );
        }

        if (requestParameters['rewindRequest'] == null) {
            throw new runtime.RequiredError(
                'rewindRequest',
                'Required parameter "rewindRequest" was null or undefined when calling rewind().'
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

        let urlPath = `/v1/sessions/{sessionId}/rewind`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RewindRequestToJSON(requestParameters['rewindRequest']),
        };
    }

    /**
     * Appends a `rewound` event: every event after `toSeq` no longer counts, for the session and for a reader that replays. The disk is not rewound — what the session did to it stays. Send the edited turn after it; to keep both versions, fork instead. `409` while generating. 
     * Take the conversation back to before a turn, to edit or retry it
     */
    async rewindRaw(requestParameters: RewindOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.rewindRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Appends a `rewound` event: every event after `toSeq` no longer counts, for the session and for a reader that replays. The disk is not rewound — what the session did to it stays. Send the edited turn after it; to keep both versions, fork instead. `409` while generating. 
     * Take the conversation back to before a turn, to edit or retry it
     */
    async rewind(requestParameters: RewindOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.rewindRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for sendTurn without sending the request
     */
    async sendTurnRequestOpts(requestParameters: SendTurnRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling sendTurn().'
            );
        }

        if (requestParameters['turn'] == null) {
            throw new runtime.RequiredError(
                'turn',
                'Required parameter "turn" was null or undefined when calling sendTurn().'
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

        let urlPath = `/v1/sessions/{sessionId}/turns`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TurnToJSON(requestParameters['turn']),
        };
    }

    /**
     * Accepted at once and answered on the stream. While the session is generating, a turn is queued behind it (`mode: queue`, the default), or interrupts it and is taken next (`mode: interrupt`). A sleeping session wakes for it. The same `turnId` again is `200` and changes nothing — a caller that lost the answer resends.  A turn never carries bytes. A file from the caller is uploaded first (`POST /v1/uploads`) and attached by its `uploadId`: the server keeps it, and puts it on the session\'s disk, under `.attachments/<turnId>/`, only when the session is given the turn: each at a `path` of its own, numbered when two share a `name`. A file already on the session\'s disk is attached by path. An upload a turn names is the session\'s from then on, served by `GET …/attachments/{uploadId}` asleep or awake; one named by no turn within `limits.uploadTtlSeconds` is evicted. 
     * Say something to the session
     */
    async sendTurnRaw(requestParameters: SendTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TurnAccepted>> {
        const requestOptions = await this.sendTurnRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TurnAcceptedFromJSON(jsonValue));
    }

    /**
     * Accepted at once and answered on the stream. While the session is generating, a turn is queued behind it (`mode: queue`, the default), or interrupts it and is taken next (`mode: interrupt`). A sleeping session wakes for it. The same `turnId` again is `200` and changes nothing — a caller that lost the answer resends.  A turn never carries bytes. A file from the caller is uploaded first (`POST /v1/uploads`) and attached by its `uploadId`: the server keeps it, and puts it on the session\'s disk, under `.attachments/<turnId>/`, only when the session is given the turn: each at a `path` of its own, numbered when two share a `name`. A file already on the session\'s disk is attached by path. An upload a turn names is the session\'s from then on, served by `GET …/attachments/{uploadId}` asleep or awake; one named by no turn within `limits.uploadTtlSeconds` is evicted. 
     * Say something to the session
     */
    async sendTurn(requestParameters: SendTurnRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TurnAccepted> {
        const response = await this.sendTurnRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
