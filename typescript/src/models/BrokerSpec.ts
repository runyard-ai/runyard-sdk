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

import { mapValues } from '../runtime.js';
import type { BrokerAuth } from './BrokerAuth.js';
import {
    BrokerAuthFromJSON,
    BrokerAuthFromJSONTyped,
    BrokerAuthToJSON,
    BrokerAuthToJSONTyped,
} from './BrokerAuth.js';

/**
 * A broker this workspace declares: by name, a title for people, and
 * where it listens. The sandboxes daemon dials it there for each
 * session given it, presenting the session's sandbox's certificate, so the
 * broker knows which sandbox calls and holds whatever credential it
 * needs itself — or, with `auth: jwt`, putting a token saying so on
 * each of its requests. How a session reaches it is the broker's to
 * say — the environment and git configuration it describes at
 * `/.well-known/runyard-broker`, `{url}` in them being its address in
 * the machine:
 * 
 * ```json
 * {"version": "1",
 *  "env": {"SOME_API_URL": "{url}/v1"},
 *  "git": {"path": "/git/", "insteadOf": ["https://github.com/"]},
 *  "mcp": {"path": "/mcp"}}
 * ```
 * 
 * All are optional, and a broker that answers `404` there describes
 * nothing; a description this server does not read is said in its log
 * and given to no session. An `env` name is in capitals, digits and `_`,
 * and none starts with `RUNYARD_`. `mcp` says the broker serves an MCP
 * server (streamable HTTP) at `{url}{path}`: the session's harness is
 * given it, named after the broker, beside its MCP connectors — with
 * no credential, since the broker knows the sandbox by its
 * certificate. An MCP connector of the session's of the same name is
 * given instead. Its `path` starts with `/`, is at most 256
 * characters, and has no `..`, query or fragment — nor a space, a
 * control character or a backslash, which no address has.
 * 
 * What a broker answers at `/.well-known/runyard-broker` and
 * `/.well-known/agent-skills` is the same for every sandbox of the
 * workspace, whichever presents its certificate: what one session's
 * start is answered is given to the next. `Cache-Control: max-age` on
 * either says how long that holds, taken for at most a day; once it
 * has passed, a start is given what was kept while the broker is
 * asked again beside it. Without it, or with `no-store` or
 * `no-cache`, the broker is asked at every start. The files of its
 * skills are kept by the SHA-256 its manifest names, whatever it
 * says: a start fetches only those of a hash it does not have.
 * 
 * @export
 * @interface BrokerSpec
 */
export interface BrokerSpec {
    /**
     * 
     */
    title: string;
    /**
     * Where the broker listens. With `auth: certificate`, `https`, as the sandbox's certificate is presented over TLS, and only its host and port are used: a session's request carries its own path. With `auth: jwt`, `http` or `https`, and its path is a prefix put before every request's own; `http` carries the token and everything else in the clear, for loopback or a private link.
     */
    url: string;
    /**
     * 
     */
    auth?: BrokerAuth;
    /**
     * PEM certificates the broker's own is verified with, for one whose certificate is not signed by a CA the sandboxes daemon's host trusts. A certificate, never a key.
     */
    ca?: string;
    /**
     * Where this server reaches the broker's own console — its control plane, which has no sign-in of its own — opened to the workspace's admins at `/v1/brokers/{brokerName}/console/`. For a broker beside this server, on a private address only it reaches: an absolute `http` or `https` URL, with a path or none, and no user, query or fragment.
     */
    console?: string;
}



/**
 * Check if a given object implements the BrokerSpec interface.
 */
export function instanceOfBrokerSpec(value: object): value is BrokerSpec {
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('url' in value) || value['url'] === undefined) return false;
    return true;
}

export function BrokerSpecFromJSON(json: any): BrokerSpec {
    return BrokerSpecFromJSONTyped(json, false);
}

export function BrokerSpecFromJSONTyped(json: any, ignoreDiscriminator: boolean): BrokerSpec {
    if (json == null) {
        return json;
    }
    return {
        
        'title': json['title'],
        'url': json['url'],
        'auth': json['auth'] == null ? undefined : BrokerAuthFromJSON(json['auth']),
        'ca': json['ca'] == null ? undefined : json['ca'],
        'console': json['console'] == null ? undefined : json['console'],
    };
}

export function BrokerSpecToJSON(json: any): BrokerSpec {
    return BrokerSpecToJSONTyped(json, false);
}

export function BrokerSpecToJSONTyped(value?: BrokerSpec | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'title': value['title'],
        'url': value['url'],
        'auth': BrokerAuthToJSON(value['auth']),
        'ca': value['ca'],
        'console': value['console'],
    };
}

