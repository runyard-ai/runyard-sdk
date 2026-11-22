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

import { parseDate, parseDateTime, serializeDate, serializeDateTime } from '../runtime.js';
import type { AlarmEvent } from './AlarmEvent.js';
import {
    instanceOfAlarmEvent,
    AlarmEventFromJSON,
    AlarmEventFromJSONTyped,
    AlarmEventToJSON,
} from './AlarmEvent.js';
import type { BackgroundTaskEvent } from './BackgroundTaskEvent.js';
import {
    instanceOfBackgroundTaskEvent,
    BackgroundTaskEventFromJSON,
    BackgroundTaskEventFromJSONTyped,
    BackgroundTaskEventToJSON,
} from './BackgroundTaskEvent.js';
import type { CompactionEvent } from './CompactionEvent.js';
import {
    instanceOfCompactionEvent,
    CompactionEventFromJSON,
    CompactionEventFromJSONTyped,
    CompactionEventToJSON,
} from './CompactionEvent.js';
import type { EgressEvent } from './EgressEvent.js';
import {
    instanceOfEgressEvent,
    EgressEventFromJSON,
    EgressEventFromJSONTyped,
    EgressEventToJSON,
} from './EgressEvent.js';
import type { ErrorEvent } from './ErrorEvent.js';
import {
    instanceOfErrorEvent,
    ErrorEventFromJSON,
    ErrorEventFromJSONTyped,
    ErrorEventToJSON,
} from './ErrorEvent.js';
import type { RewoundEvent } from './RewoundEvent.js';
import {
    instanceOfRewoundEvent,
    RewoundEventFromJSON,
    RewoundEventFromJSONTyped,
    RewoundEventToJSON,
} from './RewoundEvent.js';
import type { SessionStartedChildEvent } from './SessionStartedChildEvent.js';
import {
    instanceOfSessionStartedChildEvent,
    SessionStartedChildEventFromJSON,
    SessionStartedChildEventFromJSONTyped,
    SessionStartedChildEventToJSON,
} from './SessionStartedChildEvent.js';
import type { SessionStartedEvent } from './SessionStartedEvent.js';
import {
    instanceOfSessionStartedEvent,
    SessionStartedEventFromJSON,
    SessionStartedEventFromJSONTyped,
    SessionStartedEventToJSON,
} from './SessionStartedEvent.js';
import type { StateEvent } from './StateEvent.js';
import {
    instanceOfStateEvent,
    StateEventFromJSON,
    StateEventFromJSONTyped,
    StateEventToJSON,
} from './StateEvent.js';
import type { SubagentEvent } from './SubagentEvent.js';
import {
    instanceOfSubagentEvent,
    SubagentEventFromJSON,
    SubagentEventFromJSONTyped,
    SubagentEventToJSON,
} from './SubagentEvent.js';
import type { TasksEvent } from './TasksEvent.js';
import {
    instanceOfTasksEvent,
    TasksEventFromJSON,
    TasksEventFromJSONTyped,
    TasksEventToJSON,
} from './TasksEvent.js';
import type { TextEvent } from './TextEvent.js';
import {
    instanceOfTextEvent,
    TextEventFromJSON,
    TextEventFromJSONTyped,
    TextEventToJSON,
} from './TextEvent.js';
import type { ThinkingEvent } from './ThinkingEvent.js';
import {
    instanceOfThinkingEvent,
    ThinkingEventFromJSON,
    ThinkingEventFromJSONTyped,
    ThinkingEventToJSON,
} from './ThinkingEvent.js';
import type { ToolCallEvent } from './ToolCallEvent.js';
import {
    instanceOfToolCallEvent,
    ToolCallEventFromJSON,
    ToolCallEventFromJSONTyped,
    ToolCallEventToJSON,
} from './ToolCallEvent.js';
import type { ToolResultEvent } from './ToolResultEvent.js';
import {
    instanceOfToolResultEvent,
    ToolResultEventFromJSON,
    ToolResultEventFromJSONTyped,
    ToolResultEventToJSON,
} from './ToolResultEvent.js';
import type { TurnEndedEvent } from './TurnEndedEvent.js';
import {
    instanceOfTurnEndedEvent,
    TurnEndedEventFromJSON,
    TurnEndedEventFromJSONTyped,
    TurnEndedEventToJSON,
} from './TurnEndedEvent.js';
import type { TurnStartedEvent } from './TurnStartedEvent.js';
import {
    instanceOfTurnStartedEvent,
    TurnStartedEventFromJSON,
    TurnStartedEventFromJSONTyped,
    TurnStartedEventToJSON,
} from './TurnStartedEvent.js';
import type { UserEvent } from './UserEvent.js';
import {
    instanceOfUserEvent,
    UserEventFromJSON,
    UserEventFromJSONTyped,
    UserEventToJSON,
} from './UserEvent.js';

/**
 * @type Event
 * What happened, by `type`. Everything a session wrote — text, tool
 * input, tool output — is the session's, and the session read things
 * written by anybody: render it as text, never as markup.
 * 
 * `parentToolId`, where present, is the sub-agent that produced the
 * event; absent, it is the session's own harness.
 * 
 * @export
 */
export type Event = { type: 'alarm' } & AlarmEvent | { type: 'background_task' } & BackgroundTaskEvent | { type: 'child_session' } & SessionStartedChildEvent | { type: 'compaction' } & CompactionEvent | { type: 'egress_rules' } & EgressEvent | { type: 'error' } & ErrorEvent | { type: 'rewound' } & RewoundEvent | { type: 'session_started' } & SessionStartedEvent | { type: 'state' } & StateEvent | { type: 'subagent' } & SubagentEvent | { type: 'tasks' } & TasksEvent | { type: 'text' } & TextEvent | { type: 'thinking' } & ThinkingEvent | { type: 'tool_call' } & ToolCallEvent | { type: 'tool_result' } & ToolResultEvent | { type: 'turn_ended' } & TurnEndedEvent | { type: 'turn_started' } & TurnStartedEvent | { type: 'user' } & UserEvent;

export function EventFromJSON(json: any): Event {
    return EventFromJSONTyped(json, false);
}

export function EventFromJSONTyped(json: any, ignoreDiscriminator: boolean): Event {
    if (json == null) {
        return json;
    }
    switch (json['type']) {
        case 'alarm':
            return Object.assign({}, AlarmEventFromJSONTyped(json, true), { type: 'alarm' } as const);
        case 'background_task':
            return Object.assign({}, BackgroundTaskEventFromJSONTyped(json, true), { type: 'background_task' } as const);
        case 'child_session':
            return Object.assign({}, SessionStartedChildEventFromJSONTyped(json, true), { type: 'child_session' } as const);
        case 'compaction':
            return Object.assign({}, CompactionEventFromJSONTyped(json, true), { type: 'compaction' } as const);
        case 'egress_rules':
            return Object.assign({}, EgressEventFromJSONTyped(json, true), { type: 'egress_rules' } as const);
        case 'error':
            return Object.assign({}, ErrorEventFromJSONTyped(json, true), { type: 'error' } as const);
        case 'rewound':
            return Object.assign({}, RewoundEventFromJSONTyped(json, true), { type: 'rewound' } as const);
        case 'session_started':
            return Object.assign({}, SessionStartedEventFromJSONTyped(json, true), { type: 'session_started' } as const);
        case 'state':
            return Object.assign({}, StateEventFromJSONTyped(json, true), { type: 'state' } as const);
        case 'subagent':
            return Object.assign({}, SubagentEventFromJSONTyped(json, true), { type: 'subagent' } as const);
        case 'tasks':
            return Object.assign({}, TasksEventFromJSONTyped(json, true), { type: 'tasks' } as const);
        case 'text':
            return Object.assign({}, TextEventFromJSONTyped(json, true), { type: 'text' } as const);
        case 'thinking':
            return Object.assign({}, ThinkingEventFromJSONTyped(json, true), { type: 'thinking' } as const);
        case 'tool_call':
            return Object.assign({}, ToolCallEventFromJSONTyped(json, true), { type: 'tool_call' } as const);
        case 'tool_result':
            return Object.assign({}, ToolResultEventFromJSONTyped(json, true), { type: 'tool_result' } as const);
        case 'turn_ended':
            return Object.assign({}, TurnEndedEventFromJSONTyped(json, true), { type: 'turn_ended' } as const);
        case 'turn_started':
            return Object.assign({}, TurnStartedEventFromJSONTyped(json, true), { type: 'turn_started' } as const);
        case 'user':
            return Object.assign({}, UserEventFromJSONTyped(json, true), { type: 'user' } as const);
        default:
            return json;
    }
}

export function EventToJSON(json: any): any {
    return EventToJSONTyped(json, false);
}

export function EventToJSONTyped(value?: Event | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }
    switch (value['type']) {
        case 'alarm':
            return Object.assign({}, AlarmEventToJSON(value), { 'type': 'alarm' } as const);
        case 'background_task':
            return Object.assign({}, BackgroundTaskEventToJSON(value), { 'type': 'background_task' } as const);
        case 'child_session':
            return Object.assign({}, SessionStartedChildEventToJSON(value), { 'type': 'child_session' } as const);
        case 'compaction':
            return Object.assign({}, CompactionEventToJSON(value), { 'type': 'compaction' } as const);
        case 'egress_rules':
            return Object.assign({}, EgressEventToJSON(value), { 'type': 'egress_rules' } as const);
        case 'error':
            return Object.assign({}, ErrorEventToJSON(value), { 'type': 'error' } as const);
        case 'rewound':
            return Object.assign({}, RewoundEventToJSON(value), { 'type': 'rewound' } as const);
        case 'session_started':
            return Object.assign({}, SessionStartedEventToJSON(value), { 'type': 'session_started' } as const);
        case 'state':
            return Object.assign({}, StateEventToJSON(value), { 'type': 'state' } as const);
        case 'subagent':
            return Object.assign({}, SubagentEventToJSON(value), { 'type': 'subagent' } as const);
        case 'tasks':
            return Object.assign({}, TasksEventToJSON(value), { 'type': 'tasks' } as const);
        case 'text':
            return Object.assign({}, TextEventToJSON(value), { 'type': 'text' } as const);
        case 'thinking':
            return Object.assign({}, ThinkingEventToJSON(value), { 'type': 'thinking' } as const);
        case 'tool_call':
            return Object.assign({}, ToolCallEventToJSON(value), { 'type': 'tool_call' } as const);
        case 'tool_result':
            return Object.assign({}, ToolResultEventToJSON(value), { 'type': 'tool_result' } as const);
        case 'turn_ended':
            return Object.assign({}, TurnEndedEventToJSON(value), { 'type': 'turn_ended' } as const);
        case 'turn_started':
            return Object.assign({}, TurnStartedEventToJSON(value), { 'type': 'turn_started' } as const);
        case 'user':
            return Object.assign({}, UserEventToJSON(value), { 'type': 'user' } as const);
        default:
            return value;
    }
}

