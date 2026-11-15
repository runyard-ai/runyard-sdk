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
import type { Image } from './Image.js';
import {
    ImageFromJSON,
    ImageFromJSONTyped,
    ImageToJSON,
    ImageToJSONTyped,
} from './Image.js';
import type { SandboxConfig } from './SandboxConfig.js';
import {
    SandboxConfigFromJSON,
    SandboxConfigFromJSONTyped,
    SandboxConfigToJSON,
    SandboxConfigToJSONTyped,
} from './SandboxConfig.js';

/**
 * 
 * @export
 * @interface Profile
 */
export interface Profile {
    /**
     * `claude-code` or `codex`; when absent, its recipe's, or the server's default. A session's is fixed once made.
     */
    harness?: string;
    /**
     * Whether a person runs the harness in a terminal, as on their own
     * machine (`GET /v1/sessions/{sessionId}/attach`), rather than the
     * server giving it turns. Such a session takes no turn, compaction,
     * rewind or fork, and has no transcript of its conversation: its
     * harness's screen is the person's. Fixed once made.
     * 
     */
    terminal?: boolean;
    /**
     * The provider it runs on, by name, of a type its harness runs on
     * (`400` otherwise); when absent, that of the session that started
     * it, if on the same harness and its person may use it, else its
     * harness's `defaultProvider`.
     * 
     */
    provider?: string;
    /**
     * One of its provider's `models`, as the provider spells it. When
     * absent, and nothing it is started from names one: that of the
     * session that started it, as it runs now, if on the same harness
     * and its provider lists it; else the server's configured model
     * for the harness, if its provider lists it; else its provider's
     * newest. One the provider has not
     * listed is not refused here — the provider is the judge, at the
     * turn.
     * 
     */
    model?: string;
    /**
     * Appended to the harness's own.
     */
    systemPrompt?: string;
    /**
     * The brokers the session is given, by name. `llm` always is; absent, the server's own four.
     * Built-ins the workspace's policy does not allow are dropped, as kept and as read.
     * 
     */
    brokers?: Array<string>;
    /**
     * The MCP connectors the session is given, by name.
     */
    mcpConnectors?: Array<string>;
    /**
     * Variables of the session's environment. Never a secret — those are brokers'.
     */
    env?: { [key: string]: string; };
    /**
     * 
     */
    sandbox?: SandboxConfig;
    /**
     * 
     */
    title: string;
    /**
     * 
     */
    description?: string;
    /**
     * Who made it, who may use it always.
     */
    owner: string;
    /**
     * Every person may use it.
     */
    everyone: boolean;
    /**
     * The people besides its owner who may use it, by address, sorted.
     */
    users: Array<string>;
    /**
     * Chosen by the caller, opaque to the server. A UUID unless the caller has a better one.
     */
    id: string;
    /**
     * 
     */
    version: number;
    /**
     * Its `sandbox.recipe`'s image, when it has one.
     */
    image?: Image;
    /**
     * 
     */
    createdAt: Date;
    /**
     * 
     */
    updatedAt: Date;
}

/**
 * Check if a given object implements the Profile interface.
 */
export function instanceOfProfile(value: object): value is Profile {
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('owner' in value) || value['owner'] === undefined) return false;
    if (!('everyone' in value) || value['everyone'] === undefined) return false;
    if (!('users' in value) || value['users'] === undefined) return false;
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('version' in value) || value['version'] === undefined) return false;
    if (!('createdAt' in value) || value['createdAt'] === undefined) return false;
    if (!('updatedAt' in value) || value['updatedAt'] === undefined) return false;
    return true;
}

export function ProfileFromJSON(json: any): Profile {
    return ProfileFromJSONTyped(json, false);
}

export function ProfileFromJSONTyped(json: any, ignoreDiscriminator: boolean): Profile {
    if (json == null) {
        return json;
    }
    return {
        
        'harness': json['harness'] == null ? undefined : json['harness'],
        'terminal': json['terminal'] == null ? undefined : json['terminal'],
        'provider': json['provider'] == null ? undefined : json['provider'],
        'model': json['model'] == null ? undefined : json['model'],
        'systemPrompt': json['systemPrompt'] == null ? undefined : json['systemPrompt'],
        'brokers': json['brokers'] == null ? undefined : json['brokers'],
        'mcpConnectors': json['mcpConnectors'] == null ? undefined : json['mcpConnectors'],
        'env': json['env'] == null ? undefined : json['env'],
        'sandbox': json['sandbox'] == null ? undefined : SandboxConfigFromJSON(json['sandbox']),
        'title': json['title'],
        'description': json['description'] == null ? undefined : json['description'],
        'owner': json['owner'],
        'everyone': json['everyone'],
        'users': json['users'],
        'id': json['id'],
        'version': json['version'],
        'image': json['image'] == null ? undefined : ImageFromJSON(json['image']),
        'createdAt': (json['createdAt'] == null ? json['createdAt'] : parseDateTime(json['createdAt'])),
        'updatedAt': (json['updatedAt'] == null ? json['updatedAt'] : parseDateTime(json['updatedAt'])),
    };
}

export function ProfileToJSON(json: any): Profile {
    return ProfileToJSONTyped(json, false);
}

export function ProfileToJSONTyped(value?: Profile | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'harness': value['harness'],
        'terminal': value['terminal'],
        'provider': value['provider'],
        'model': value['model'],
        'systemPrompt': value['systemPrompt'],
        'brokers': value['brokers'],
        'mcpConnectors': value['mcpConnectors'],
        'env': value['env'],
        'sandbox': SandboxConfigToJSON(value['sandbox']),
        'title': value['title'],
        'description': value['description'],
        'owner': value['owner'],
        'everyone': value['everyone'],
        'users': value['users'],
        'id': value['id'],
        'version': value['version'],
        'image': ImageToJSON(value['image']),
        'createdAt': value['createdAt'] == null ? value['createdAt'] : serializeDateTime(value['createdAt']),
        'updatedAt': value['updatedAt'] == null ? value['updatedAt'] : serializeDateTime(value['updatedAt']),
    };
}

