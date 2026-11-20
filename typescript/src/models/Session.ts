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

import { mapValues, parseDate, parseDateTime, serializeDate, serializeDateTime } from '../runtime.js';
import type { SessionLineage } from './SessionLineage.js';
import {
    SessionLineageFromJSON,
    SessionLineageFromJSONTyped,
    SessionLineageToJSON,
    SessionLineageToJSONTyped,
} from './SessionLineage.js';
import type { SessionState } from './SessionState.js';
import {
    SessionStateFromJSON,
    SessionStateFromJSONTyped,
    SessionStateToJSON,
    SessionStateToJSONTyped,
} from './SessionState.js';
import type { ProfileRef } from './ProfileRef.js';
import {
    ProfileRefFromJSON,
    ProfileRefFromJSONTyped,
    ProfileRefToJSON,
    ProfileRefToJSONTyped,
} from './ProfileRef.js';
import type { Usage } from './Usage.js';
import {
    UsageFromJSON,
    UsageFromJSONTyped,
    UsageToJSON,
    UsageToJSONTyped,
} from './Usage.js';
import type { SessionWork } from './SessionWork.js';
import {
    SessionWorkFromJSON,
    SessionWorkFromJSONTyped,
    SessionWorkToJSON,
    SessionWorkToJSONTyped,
} from './SessionWork.js';
import type { QueuedTurn } from './QueuedTurn.js';
import {
    QueuedTurnFromJSON,
    QueuedTurnFromJSONTyped,
    QueuedTurnToJSON,
    QueuedTurnToJSONTyped,
} from './QueuedTurn.js';
import type { TitleSource } from './TitleSource.js';
import {
    TitleSourceFromJSON,
    TitleSourceFromJSONTyped,
    TitleSourceToJSON,
    TitleSourceToJSONTyped,
} from './TitleSource.js';
import type { SessionStarting } from './SessionStarting.js';
import {
    SessionStartingFromJSON,
    SessionStartingFromJSONTyped,
    SessionStartingToJSON,
    SessionStartingToJSONTyped,
} from './SessionStarting.js';
import type { SessionConfig } from './SessionConfig.js';
import {
    SessionConfigFromJSON,
    SessionConfigFromJSONTyped,
    SessionConfigToJSON,
    SessionConfigToJSONTyped,
} from './SessionConfig.js';
import type { SessionSandbox } from './SessionSandbox.js';
import {
    SessionSandboxFromJSON,
    SessionSandboxFromJSONTyped,
    SessionSandboxToJSON,
    SessionSandboxToJSONTyped,
} from './SessionSandbox.js';
import type { EndUser } from './EndUser.js';
import {
    EndUserFromJSON,
    EndUserFromJSONTyped,
    EndUserToJSON,
    EndUserToJSONTyped,
} from './EndUser.js';

/**
 * 
 * @export
 * @interface Session
 */
export interface Session {
    /**
     * Chosen by the caller, opaque to the server. A UUID unless the caller has a better one.
     */
    id: string;
    /**
     * 
     */
    title: string;
    /**
     * 
     */
    titleSource?: TitleSource;
    /**
     * Whether its title is summarized from its conversation, as its
     * harness would, a few seconds after its first answer begins —
     * once, and never over a title a person gave it. Only where its
     * harness has the `title` feature and the workspace's
     * `titleSummaries` allow it.
     * 
     */
    autoTitle?: boolean;
    /**
     * Whose it is — who steers it, shares it and opens its tunnels, and what it may use.
     */
    owner: string;
    /**
     * For an application's session, whom it is for, when it is for somebody.
     */
    endUser?: EndUser;
    /**
     * 
     */
    state: SessionState;
    /**
     * Why it failed, or why its last turn did.
     */
    error?: string;
    /**
     * 
     */
    profile?: ProfileRef;
    /**
     * What it runs with, its profile's and its overrides resolved, and
     * its turns' choices since: `provider` and `model` always say
     * what it is on.
     * 
     */
    config: SessionConfig;
    /**
     * 
     */
    sandbox: SessionSandbox;
    /**
     * 
     */
    starting?: SessionStarting;
    /**
     * 
     */
    lineage: SessionLineage;
    /**
     * 
     */
    labels: { [key: string]: string; };
    /**
     * 
     */
    work: SessionWork;
    /**
     * The turns waiting for its harness, in the order it is given them:
     * its `firstTurn`, from when it is made until a harness is up to take
     * it — kept while its sandbox is made, and when that failed, for its
     * next wake — then those sent while it was generating or starting.
     * None is on its stream until the harness takes it — each then a
     * `user` event of the same `turnId`. Absent when none waits.
     * 
     * Kept until it is taken or taken back: a server that stops, a
     * session put to sleep, archived, or whose machine could not be
     * made loses none of it. A server that starts wakes every session
     * asleep, and not archived, with turns waiting.
     * `work.queuedTurns` counts those sent after the first.
     * 
     */
    queue?: Array<QueuedTurn>;
    /**
     * Summed over the session's turns — its sub-agents' included — but
     * `contextTokens` and `contextWindow`, which are the last turn's.
     * 
     */
    usage: Usage;
    /**
     * What the turn in flight has spent so far, as its harness has said
     * message by message, at list prices — its sub-agents' included —
     * and `contextTokens`, how full its context is now: kept again as
     * each message fills it, and as a compaction in the turn empties it.
     * Not yet in `usage`, which the turn's end adds its own count to.
     * Absent while no turn is in flight, or none has spent anything yet.
     * 
     */
    pendingUsage?: Usage;
    /**
     * The oldest event kept.
     */
    firstSeq: number;
    /**
     * The newest event.
     */
    lastSeq: number;
    /**
     * 
     */
    createdAt: Date;
    /**
     * When it was last sent a turn, or made: what a list of sessions is ordered by. What it does of itself — its answers, its alarms — does not move it.
     */
    lastActivityAt: Date;
    /**
     * When the soonest of its pending alarms fires. A sleeping session is woken shortly before.
     */
    nextAlarmAt?: Date;
    /**
     * 
     */
    archivedAt?: Date;
    /**
     * When its person was offboarded (`User.offboardedAt`): it sleeps,
     * and wakes for nothing — a turn, an alarm, a trigger — until they
     * are back or an admin takes it over.
     * 
     */
    pausedAt?: Date;
    /**
     * When it last stopped working — made, a turn of its ended, its
     * terminal left, restored, unlocked or unpinned — which the workspace's
     * `sessionRetention` counts from. Absent for a session made before
     * it was kept, which counts from `lastActivityAt`.
     * 
     */
    idleSince?: Date;
    /**
     * It is neither archived nor deleted, by the workspace's
     * `sessionRetention` or by anybody, until it is unlocked
     * (`PATCH` with `locked`). Absent is unlocked.
     * 
     */
    locked?: boolean;
    /**
     * Its sandbox is never put to sleep for being idle, and the
     * workspace's `sessionRetention` neither archives nor deletes it,
     * until it is unpinned (`PATCH` with `pinned`). Absent is unpinned.
     * 
     */
    pinned?: boolean;
}



/**
 * Check if a given object implements the Session interface.
 */
export function instanceOfSession(value: object): value is Session {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('owner' in value) || value['owner'] === undefined) return false;
    if (!('state' in value) || value['state'] === undefined) return false;
    if (!('config' in value) || value['config'] === undefined) return false;
    if (!('sandbox' in value) || value['sandbox'] === undefined) return false;
    if (!('lineage' in value) || value['lineage'] === undefined) return false;
    if (!('labels' in value) || value['labels'] === undefined) return false;
    if (!('work' in value) || value['work'] === undefined) return false;
    if (!('usage' in value) || value['usage'] === undefined) return false;
    if (!('firstSeq' in value) || value['firstSeq'] === undefined) return false;
    if (!('lastSeq' in value) || value['lastSeq'] === undefined) return false;
    if (!('createdAt' in value) || value['createdAt'] === undefined) return false;
    if (!('lastActivityAt' in value) || value['lastActivityAt'] === undefined) return false;
    return true;
}

export function SessionFromJSON(json: any): Session {
    return SessionFromJSONTyped(json, false);
}

export function SessionFromJSONTyped(json: any, ignoreDiscriminator: boolean): Session {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'title': json['title'],
        'titleSource': json['titleSource'] == null ? undefined : TitleSourceFromJSON(json['titleSource']),
        'autoTitle': json['autoTitle'] == null ? undefined : json['autoTitle'],
        'owner': json['owner'],
        'endUser': json['endUser'] == null ? undefined : EndUserFromJSON(json['endUser']),
        'state': SessionStateFromJSON(json['state']),
        'error': json['error'] == null ? undefined : json['error'],
        'profile': json['profile'] == null ? undefined : ProfileRefFromJSON(json['profile']),
        'config': SessionConfigFromJSON(json['config']),
        'sandbox': SessionSandboxFromJSON(json['sandbox']),
        'starting': json['starting'] == null ? undefined : SessionStartingFromJSON(json['starting']),
        'lineage': SessionLineageFromJSON(json['lineage']),
        'labels': json['labels'],
        'work': SessionWorkFromJSON(json['work']),
        'queue': json['queue'] == null ? undefined : ((json['queue'] as Array<any>).map(QueuedTurnFromJSON)),
        'usage': UsageFromJSON(json['usage']),
        'pendingUsage': json['pendingUsage'] == null ? undefined : UsageFromJSON(json['pendingUsage']),
        'firstSeq': json['firstSeq'],
        'lastSeq': json['lastSeq'],
        'createdAt': (json['createdAt'] == null ? json['createdAt'] : parseDateTime(json['createdAt'])),
        'lastActivityAt': (json['lastActivityAt'] == null ? json['lastActivityAt'] : parseDateTime(json['lastActivityAt'])),
        'nextAlarmAt': json['nextAlarmAt'] == null ? undefined : (parseDateTime(json['nextAlarmAt'])),
        'archivedAt': json['archivedAt'] == null ? undefined : (parseDateTime(json['archivedAt'])),
        'pausedAt': json['pausedAt'] == null ? undefined : (parseDateTime(json['pausedAt'])),
        'idleSince': json['idleSince'] == null ? undefined : (parseDateTime(json['idleSince'])),
        'locked': json['locked'] == null ? undefined : json['locked'],
        'pinned': json['pinned'] == null ? undefined : json['pinned'],
    };
}

export function SessionToJSON(json: any): Session {
    return SessionToJSONTyped(json, false);
}

export function SessionToJSONTyped(value?: Session | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'title': value['title'],
        'titleSource': TitleSourceToJSON(value['titleSource']),
        'autoTitle': value['autoTitle'],
        'owner': value['owner'],
        'endUser': EndUserToJSON(value['endUser']),
        'state': SessionStateToJSON(value['state']),
        'error': value['error'],
        'profile': ProfileRefToJSON(value['profile']),
        'config': SessionConfigToJSON(value['config']),
        'sandbox': SessionSandboxToJSON(value['sandbox']),
        'starting': SessionStartingToJSON(value['starting']),
        'lineage': SessionLineageToJSON(value['lineage']),
        'labels': value['labels'],
        'work': SessionWorkToJSON(value['work']),
        'queue': value['queue'] == null ? undefined : ((value['queue'] as Array<any>).map(QueuedTurnToJSON)),
        'usage': UsageToJSON(value['usage']),
        'pendingUsage': UsageToJSON(value['pendingUsage']),
        'firstSeq': value['firstSeq'],
        'lastSeq': value['lastSeq'],
        'createdAt': value['createdAt'] == null ? value['createdAt'] : serializeDateTime(value['createdAt']),
        'lastActivityAt': value['lastActivityAt'] == null ? value['lastActivityAt'] : serializeDateTime(value['lastActivityAt']),
        'nextAlarmAt': value['nextAlarmAt'] == null ? value['nextAlarmAt'] : serializeDateTime(value['nextAlarmAt']),
        'archivedAt': value['archivedAt'] == null ? value['archivedAt'] : serializeDateTime(value['archivedAt']),
        'pausedAt': value['pausedAt'] == null ? value['pausedAt'] : serializeDateTime(value['pausedAt']),
        'idleSince': value['idleSince'] == null ? value['idleSince'] : serializeDateTime(value['idleSince']),
        'locked': value['locked'],
        'pinned': value['pinned'],
    };
}

