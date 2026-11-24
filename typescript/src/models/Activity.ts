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

import { mapValues, parseDate, parseDateTime, serializeDate, serializeDateTime } from '../runtime.js';
import type { ActivityExec } from './ActivityExec.js';
import {
    ActivityExecFromJSON,
    ActivityExecFromJSONTyped,
    ActivityExecToJSON,
    ActivityExecToJSONTyped,
} from './ActivityExec.js';
import type { ActivityMessage } from './ActivityMessage.js';
import {
    ActivityMessageFromJSON,
    ActivityMessageFromJSONTyped,
    ActivityMessageToJSON,
    ActivityMessageToJSONTyped,
} from './ActivityMessage.js';

/**
 * 
 * @export
 * @interface Activity
 */
export interface Activity {
    /**
     * 
     */
    id: string;
    /**
     * When it was sent.
     */
    at: Date;
    /**
     * The session whose machine sent it. Absent for a gateway entry of a
     * sandbox that is no session's — one the server never knew — which is its person's to read, or an admin's when it
     * is nobody's.
     * 
     */
    sessionId?: string;
    /**
     * The session's owner. Absent when it is nobody's.
     */
    owner?: string;
    /**
     * The broker's name in the machine; empty for a call to this server's API (`kind: api`).
     */
    broker: string;
    /**
     * Who sent it, when no session's machine did: `platform`, the
     * Runyard platform calling this server's API with a platform
     * token (`kind: api`). Absent for everything a session sent.
     * 
     */
    actor?: ActivityActorEnum;
    /**
     * What the broker is, which says how its requests are read.
     * `gateway` is the sandboxes daemon's record of the request,
     * through whatever broker: its `action` is what the broker said it
     * was (`Runyard-Activity`), or the method, path and status.
     * `one_off` is a call the server made for the session through its
     * `llm` broker, as its harness would have — `summarize title`,
     * say — and not one its machine sent: its `target` is the model.
     * `api` is a call made to this server's own API by `actor`: its
     * `action` is the method and the path.
     * `exec` is a program the session's machine ran, through no broker
     * and taking no time: its `action` is `exec`, the program's name
     * and its arguments, and the entry whole says the rest (`exec`).
     * 
     */
    kind: ActivityKindEnum;
    /**
     * What it was, in a few words.
     */
    action: string;
    /**
     * What it was done to — the MCP connector, the repository — when that is not the broker.
     */
    target: string;
    /**
     * The answer's HTTP status; 0 when there was none.
     */
    status: number;
    /**
     * What went wrong, when something did — the answer's words, or the tool's, or the gateway's.
     */
    error?: string;
    /**
     * 
     */
    durationMs: number;
    /**
     * A gateway entry's: `ok`; `refused` by the daemon, nothing sent
     * anywhere — a broker the machine was not given, its connection
     * limit; `unreachable`, a broker that could not be reached;
     * `broken`, cut part of the way; `lost`, standing for records the
     * daemon could not keep, how many in `error`.
     * 
     */
    outcome?: ActivityOutcomeEnum;
    /**
     * A gateway entry's bytes from the machine.
     */
    bytesIn?: number;
    /**
     * A gateway entry's bytes to the machine.
     */
    bytesOut?: number;
    /**
     * 
     */
    request: ActivityMessage;
    /**
     * 
     */
    response: ActivityMessage;
    /**
     * That its bodies are not in `request` and `response` but on the
     * runner that saw the exchange: `GET
     * /v1/activity/{activityId}/body` fetches them. Absent when they
     * are here, or there were none.
     * 
     */
    bodiesOnRunner?: boolean;
    /**
     * 
     */
    exec?: ActivityExec;
}


/**
 * @export
 */
export const ActivityActorEnum = {
    Platform: 'platform',
} as const;
export type ActivityActorEnum = typeof ActivityActorEnum[keyof typeof ActivityActorEnum];

/**
 * @export
 */
export const ActivityKindEnum = {
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
export type ActivityKindEnum = typeof ActivityKindEnum[keyof typeof ActivityKindEnum];

/**
 * @export
 */
export const ActivityOutcomeEnum = {
    Ok: 'ok',
    Refused: 'refused',
    Unreachable: 'unreachable',
    Broken: 'broken',
    Lost: 'lost',
} as const;
export type ActivityOutcomeEnum = typeof ActivityOutcomeEnum[keyof typeof ActivityOutcomeEnum];


/**
 * Check if a given object implements the Activity interface.
 */
export function instanceOfActivity(value: object): value is Activity {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('at' in value) || value['at'] === undefined) return false;
    if (!('broker' in value) || value['broker'] === undefined) return false;
    if (!('kind' in value) || value['kind'] === undefined) return false;
    if (!('action' in value) || value['action'] === undefined) return false;
    if (!('target' in value) || value['target'] === undefined) return false;
    if (!('status' in value) || value['status'] === undefined) return false;
    if (!('durationMs' in value) || value['durationMs'] === undefined) return false;
    if (!('request' in value) || value['request'] === undefined) return false;
    if (!('response' in value) || value['response'] === undefined) return false;
    return true;
}

export function ActivityFromJSON(json: any): Activity {
    return ActivityFromJSONTyped(json, false);
}

export function ActivityFromJSONTyped(json: any, ignoreDiscriminator: boolean): Activity {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'at': (json['at'] == null ? json['at'] : parseDateTime(json['at'])),
        'sessionId': json['sessionId'] == null ? undefined : json['sessionId'],
        'owner': json['owner'] == null ? undefined : json['owner'],
        'broker': json['broker'],
        'actor': json['actor'] == null ? undefined : json['actor'],
        'kind': json['kind'],
        'action': json['action'],
        'target': json['target'],
        'status': json['status'],
        'error': json['error'] == null ? undefined : json['error'],
        'durationMs': json['durationMs'],
        'outcome': json['outcome'] == null ? undefined : json['outcome'],
        'bytesIn': json['bytesIn'] == null ? undefined : json['bytesIn'],
        'bytesOut': json['bytesOut'] == null ? undefined : json['bytesOut'],
        'request': ActivityMessageFromJSON(json['request']),
        'response': ActivityMessageFromJSON(json['response']),
        'bodiesOnRunner': json['bodiesOnRunner'] == null ? undefined : json['bodiesOnRunner'],
        'exec': json['exec'] == null ? undefined : ActivityExecFromJSON(json['exec']),
    };
}

export function ActivityToJSON(json: any): Activity {
    return ActivityToJSONTyped(json, false);
}

export function ActivityToJSONTyped(value?: Activity | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'at': value['at'] == null ? value['at'] : serializeDateTime(value['at']),
        'sessionId': value['sessionId'],
        'owner': value['owner'],
        'broker': value['broker'],
        'actor': value['actor'],
        'kind': value['kind'],
        'action': value['action'],
        'target': value['target'],
        'status': value['status'],
        'error': value['error'],
        'durationMs': value['durationMs'],
        'outcome': value['outcome'],
        'bytesIn': value['bytesIn'],
        'bytesOut': value['bytesOut'],
        'request': ActivityMessageToJSON(value['request']),
        'response': ActivityMessageToJSON(value['response']),
        'bodiesOnRunner': value['bodiesOnRunner'],
        'exec': ActivityExecToJSON(value['exec']),
    };
}

