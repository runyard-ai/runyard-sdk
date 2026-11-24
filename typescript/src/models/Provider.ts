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
import type { Placement } from './Placement.js';
import {
    PlacementFromJSON,
    PlacementFromJSONTyped,
    PlacementToJSON,
    PlacementToJSONTyped,
} from './Placement.js';
import type { Model } from './Model.js';
import {
    ModelFromJSON,
    ModelFromJSONTyped,
    ModelToJSON,
    ModelToJSONTyped,
} from './Model.js';
import type { ProviderKind } from './ProviderKind.js';
import {
    ProviderKindFromJSON,
    ProviderKindFromJSONTyped,
    ProviderKindToJSON,
    ProviderKindToJSONTyped,
} from './ProviderKind.js';
import type { EndUser } from './EndUser.js';
import {
    EndUserFromJSON,
    EndUserFromJSONTyped,
    EndUserToJSON,
    EndUserToJSONTyped,
} from './EndUser.js';
import type { ProviderType } from './ProviderType.js';
import {
    ProviderTypeFromJSON,
    ProviderTypeFromJSONTyped,
    ProviderTypeToJSON,
    ProviderTypeToJSONTyped,
} from './ProviderType.js';

/**
 * A named credential for a provider's API, never the credential itself.
 * @export
 * @interface Provider
 */
export interface Provider {
    /**
     * 
     */
    name: string;
    /**
     * 
     */
    title: string;
    /**
     * Who made it, who may use it always.
     */
    owner: string;
    /**
     * For an application's provider, the end user whose own it is.
     */
    endUser?: EndUser;
    /**
     * Every person may use it, whoever `users` names.
     */
    everyone: boolean;
    /**
     * The people besides its owner who may use it, by address, sorted.
     */
    users: Array<string>;
    /**
     * 
     */
    type: ProviderType;
    /**
     * 
     */
    kind: ProviderKind;
    /**
     * `needs_signin` is a subscription whose renewal the provider
     * refused: sign it in again. Nothing else is tried here — this
     * server calls no provider — so what a key's provider says of it is
     * what its sessions' calls are answered.
     * 
     */
    status: ProviderStatusEnum;
    /**
     * Who the subscription is, when the provider says.
     */
    account?: string;
    /**
     * The subscription's plan, when the provider says.
     */
    plan?: string;
    /**
     * What a session runs on when it names no provider. Exactly one is.
     */
    isDefault: boolean;
    /**
     * When a subscription's access token expires. The server renews it before.
     */
    expiresAt?: Date;
    /**
     * When a subscription's access token was last renewed.
     */
    renewedAt?: Date;
    /**
     * The runners that reach it: a session on it is placed only on a
     * runner with every one of these labels, as well as its own
     * `sandbox.placement`'s, and fails to start when it names a label
     * otherwise — a model on one runner's own network, say. Absent is
     * any runner.
     * 
     */
    placement?: Placement;
    /**
     * The models it offers, as its admin declared them, in that
     * order: what a session on it is offered to pick, the first its
     * default. Empty is none declared — a session on it names its
     * model, or runs its harness's default.
     * 
     */
    models: Array<Model>;
}


/**
 * @export
 */
export const ProviderStatusEnum = {
    Ok: 'ok',
    NeedsSignin: 'needs_signin',
} as const;
export type ProviderStatusEnum = typeof ProviderStatusEnum[keyof typeof ProviderStatusEnum];


/**
 * Check if a given object implements the Provider interface.
 */
export function instanceOfProvider(value: object): value is Provider {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('owner' in value) || value['owner'] === undefined) return false;
    if (!('everyone' in value) || value['everyone'] === undefined) return false;
    if (!('users' in value) || value['users'] === undefined) return false;
    if (!('type' in value) || value['type'] === undefined) return false;
    if (!('kind' in value) || value['kind'] === undefined) return false;
    if (!('status' in value) || value['status'] === undefined) return false;
    if (!('isDefault' in value) || value['isDefault'] === undefined) return false;
    if (!('models' in value) || value['models'] === undefined) return false;
    return true;
}

export function ProviderFromJSON(json: any): Provider {
    return ProviderFromJSONTyped(json, false);
}

export function ProviderFromJSONTyped(json: any, ignoreDiscriminator: boolean): Provider {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'title': json['title'],
        'owner': json['owner'],
        'endUser': json['endUser'] == null ? undefined : EndUserFromJSON(json['endUser']),
        'everyone': json['everyone'],
        'users': json['users'],
        'type': ProviderTypeFromJSON(json['type']),
        'kind': ProviderKindFromJSON(json['kind']),
        'status': json['status'],
        'account': json['account'] == null ? undefined : json['account'],
        'plan': json['plan'] == null ? undefined : json['plan'],
        'isDefault': json['isDefault'],
        'expiresAt': json['expiresAt'] == null ? undefined : (parseDateTime(json['expiresAt'])),
        'renewedAt': json['renewedAt'] == null ? undefined : (parseDateTime(json['renewedAt'])),
        'placement': json['placement'] == null ? undefined : PlacementFromJSON(json['placement']),
        'models': ((json['models'] as Array<any>).map(ModelFromJSON)),
    };
}

export function ProviderToJSON(json: any): Provider {
    return ProviderToJSONTyped(json, false);
}

export function ProviderToJSONTyped(value?: Provider | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'title': value['title'],
        'owner': value['owner'],
        'endUser': EndUserToJSON(value['endUser']),
        'everyone': value['everyone'],
        'users': value['users'],
        'type': ProviderTypeToJSON(value['type']),
        'kind': ProviderKindToJSON(value['kind']),
        'status': value['status'],
        'account': value['account'],
        'plan': value['plan'],
        'isDefault': value['isDefault'],
        'expiresAt': value['expiresAt'] == null ? value['expiresAt'] : serializeDateTime(value['expiresAt']),
        'renewedAt': value['renewedAt'] == null ? value['renewedAt'] : serializeDateTime(value['renewedAt']),
        'placement': PlacementToJSON(value['placement']),
        'models': ((value['models'] as Array<any>).map(ModelToJSON)),
    };
}

