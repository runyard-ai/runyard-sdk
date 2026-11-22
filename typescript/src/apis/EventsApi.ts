/* tslint:disable */
/* eslint-disable */
/**
 * runyard-agents
 * **Open a session, talk to it, watch what it does, and let it start others.**  A session is a conversation with a harness — Claude Code or Codex — running in a sandbox of its own. This server makes the sandbox (through runyard-sandboxes), starts the harness in it, keeps the transcript, and serves it to whoever asks: a chat UI, a console, a scheduler, a GitHub App, or another session.  It is the API workspace-platform\'s chat is adapted to: everything it does about conversations — sessions, sub-agents, background tasks, the session\'s task list, brokers, MCP connectors, sessions started by code and the lineage between them — and nothing else. Widgets, workflows, objects and the rest of workspace-platform are not here, and are not meant to be.  ### One session, one sandbox  Every session has a sandbox of its own, with its own resources, and no two sessions ever share one. There is no \"box\" to create first, no machine-wide setting to size: `cpus`, `memory` and `disk` are fields of the session, defaulted by the server (or the session\'s harness) and capped by it.  A session\'s disk outlives its sandbox. A session nobody talks to is put to **sleep**: its sandbox is released and its disk kept, and the next turn wakes it on a new one. So a session costs a machine only while it is working, and a thousand dormant ones cost a thousand disks.  ### Two liveness domains  `session.state` is its harness\'s (`idle`, `generating`, …); `session.sandbox.state` is the machine\'s (`booting`, `ready`, `released`, …). They are separate because they fail separately — a harness that crashed in a healthy sandbox is relaunched; a sandbox that is gone takes a running harness with it — and a caller that conflates them shows a person the wrong thing.  ### The caller names what it creates  A session is created with `PUT /v1/sessions/{sessionId}`, the id chosen by the caller, and so are profiles, brokers, MCP connectors and triggers. A lost response to a create is retried with the same id, and the second request finds the first\'s session rather than making a second one on a second machine. The same request again is `200`; a different one is `409 spec_conflict`. Turns are idempotent the same way, by `turnId`.  ### The transcript lives here, append-only  The server holds every event of every session, numbered by `seq`, and nothing is ever rewritten: editing an earlier message is a `rewound` event saying which events no longer count, followed by the new ones. A reader that kept its place keeps it. Presentation state — what a person has seen, what they pinned — is not stored; `labels` are the caller\'s escape hatch.  ### Streams, not webhooks  Events are read from a cursor: `GET …/events?from=<seq>&follow=true` is chunked `application/x-ndjson`, one event per line, held open while following. A reader that fell behind what is kept gets `409 gapped` naming the window, never a silent jump. The account\'s sessions change on one feed, `GET /v1/changes`, read the same way: it is how a chat UI keeps its list without polling every session. The one WebSocket is a session\'s terminal.  There are no outbound webhooks. Inbound ones — a trigger\'s hook — are.  ### Lineage  Every session says where it came from: a person (`source: user`), a caller with a key (`api`), another session\'s harness (`session`, with its `parentId`), a fork (`fork`, with `branchedFrom`) or a trigger\'s firing (`trigger`, with the trigger and the firing). `rootId` and `depth` are kept so that a tree is one query away, and `GET …/lineage` is that tree.  ### Brokers and MCP connectors keep the credentials out  Nothing that reaches a sandbox carries a secret. A **broker** is an API the session reaches through this server — GitHub, egress, tunnels, a model provider — with the credential held here; an **MCP connector** is an MCP server, its token or OAuth grant held here, served to the session through a broker of its own. Which ones a session gets is a field of the session.  ### One workspace  A server serves one **workspace**: its sessions, triggers, profiles, images, providers, brokers, MCP connectors, people, keys, usage and activity. What the workspace itself is comes from how the server is started, never from this API: its name and title (`--workspace`, `--workspace-title`), the runyard-sandboxes server it works on — the workspace\'s own (`--sandboxes`), reached with a key that reaches every sandbox there (`--sandboxes-key-file`, read at every start) — its owner (`--owner`) and its policy (`--policy-file`). `GET /v1/info` says them, but the key.  ### People, and what is whose  Everything is somebody\'s: every session, key, provider, profile, broker, MCP connector and trigger has an `owner`, the person who made it — for a session, whom it is for.  A person is a **member** or an **admin** of the workspace. An admin sees and changes everything in it; a member has the chat: their own sessions and those shared with them, which they read and do not steer. What a person *uses* — the provider a session runs on, the profile it starts from, its brokers and MCP connectors — is their own, or one its owner lets them use (`everyone`, `users`), admin or not. A key does no more than its owner, and a session calling through its brokers no more than its owner, over its own tree alone. Every key is made by a person: none is made for a session. What a person is missing is said in `GET /v1/self/notices`.  A person comes into the workspace by an admin\'s invitation, signing in with Google or the OpenID provider, or by being put in it by address (`PUT /v1/users/{userEmail}`), and signs in with Google, the OpenID provider or the password the password file holds for their address. The workspace\'s owner (`--owner`) is an admin of it from the start, always, and is never removed.  ### The UIs, and this reference  The chat is served at every path not under `/v1/` or `/console/`, and the console at every path under `/console/`: both route by the path (no `#`), so any page of either is an address to share or reload. This document is `GET /v1/openapi.yaml`, and rendered to read at `GET /v1/docs`.  ### What is deliberately not here  - **Tool approval prompts.** The session runs unattended inside its   sandbox; what it may reach outside it is what its brokers reach. - **A process and shell API.** The terminal is the one door into the   sandbox besides the session, and files the one way to move bytes. - **Widgets, workflows, objects, templates as UI.** Not conversations. - **Presentation state.** Pins, unread markers and drafts are the UI\'s. 
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
    type Change,
    ChangeFromJSON,
    ChangeToJSON,
} from '../models/Change.js';
import {
    type EventsLine,
    EventsLineFromJSON,
    EventsLineToJSON,
} from '../models/EventsLine.js';
import {
    type GapError,
    GapErrorFromJSON,
    GapErrorToJSON,
} from '../models/GapError.js';

export interface StreamChangesRequest {
    /**
     * The first `seq` wanted. The oldest kept when absent.
     */
    from?: number;
    /**
     * Keep the body open and write what happens next.
     */
    follow?: boolean;
}

export interface StreamEventsRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * The first `seq` wanted. The oldest kept when absent.
     */
    from?: number;
    /**
     * Keep the body open and write what happens next.
     */
    follow?: boolean;
    /**
     * A sub-agent's id — the tool call that started it.
     */
    subagent?: string;
}

/**
 * EventsApi - interface
 * 
 * @export
 * @interface EventsApiInterface
 */
export interface EventsApiInterface {
    /**
     * Creates request options for streamChanges without sending the request
     * @param {number} [from] The first &#x60;seq&#x60; wanted. The oldest kept when absent.
     * @param {boolean} [follow] Keep the body open and write what happens next.
     * @throws {RequiredError}
     * @memberof EventsApiInterface
     */
    streamChangesRequestOpts(requestParameters: StreamChangesRequest): Promise<runtime.RequestOpts>;

    /**
     * What a chat UI keeps its session list with: list the sessions once, note `changeSeq` from the page, and follow from it. One `Change` per line; a change carries the session as it is after it. The server keeps the last `limits.changesKept`; older is `409 gapped`, and the reader lists again. 
     * @summary Every change to the account\'s sessions, from a point on, and as it happens
     * @param {number} [from] The first &#x60;seq&#x60; wanted. The oldest kept when absent.
     * @param {boolean} [follow] Keep the body open and write what happens next.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EventsApiInterface
     */
    streamChangesRaw(requestParameters: StreamChangesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Change>>;

    /**
     * What a chat UI keeps its session list with: list the sessions once, note `changeSeq` from the page, and follow from it. One `Change` per line; a change carries the session as it is after it. The server keeps the last `limits.changesKept`; older is `409 gapped`, and the reader lists again. 
     * Every change to the account\'s sessions, from a point on, and as it happens
     */
    streamChanges(requestParameters: StreamChangesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Change>;

    /**
     * Creates request options for streamEvents without sending the request
     * @param {string} sessionId 
     * @param {number} [from] The first &#x60;seq&#x60; wanted. The oldest kept when absent.
     * @param {boolean} [follow] Keep the body open and write what happens next.
     * @param {string} [subagent] A sub-agent\&#39;s id — the tool call that started it.
     * @throws {RequiredError}
     * @memberof EventsApiInterface
     */
    streamEventsRequestOpts(requestParameters: StreamEventsRequest): Promise<runtime.RequestOpts>;

    /**
     * One `SessionEvent` per line, from `from` (the first kept when absent). With `follow`, the body stays open and every new event is written as it happens; a blank line is written at once and every 15 seconds, for proxies, and readers skip blank lines.  With `subagent`, only the events of that sub-agent, nested ones included — what a UI shows when a person opens one.  Following, the stream also carries `PartialLine`s: the text and thinking the session is writing, before the event that keeps it. They are not transcript — never stored, never in a stream that does not follow — and a reader tells the two apart by `line`. Each names the `seq` its block is expected to take, and the reader holds one partial per `seq`:  - `offset` 0 replaces what the reader holds at that `seq`; `offset`   equal to the length held appends `text` to it; any other offset is   ignored. Lengths are UTF-16 code units — a JavaScript string\'s   `length`. - An event whose `seq` is at least a partial\'s `seq` replaces it:   the block is now that event, or gone. A block whose expected place   moves on — another session\'s event took it — comes again at its new   `seq` from `offset` 0. - `offset` 0 with empty `text` says the block at that `seq` is gone   and no event the reader was sent said so (a session stopped   mid-block, followed through `subagent`): drop it.  A reader that starts following mid-block gets the block so far, from `offset` 0. A slow reader is sent everything new of a block in one line, never a queue of them.  Following, one `CaughtUpLine` is written once every event kept when the reader asked has been: what is before it is the transcript so far, what is after it happens as it is read. It comes before any partial, once per request — a reader that reads again from where it was is told again. A reader can fold what is before it in one go, and draw a long transcript once, at its end, rather than once for every batch the server wrote. 
     * @summary The session\'s transcript, from an event on, and as it happens
     * @param {string} sessionId 
     * @param {number} [from] The first &#x60;seq&#x60; wanted. The oldest kept when absent.
     * @param {boolean} [follow] Keep the body open and write what happens next.
     * @param {string} [subagent] A sub-agent\&#39;s id — the tool call that started it.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof EventsApiInterface
     */
    streamEventsRaw(requestParameters: StreamEventsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<EventsLine>>;

    /**
     * One `SessionEvent` per line, from `from` (the first kept when absent). With `follow`, the body stays open and every new event is written as it happens; a blank line is written at once and every 15 seconds, for proxies, and readers skip blank lines.  With `subagent`, only the events of that sub-agent, nested ones included — what a UI shows when a person opens one.  Following, the stream also carries `PartialLine`s: the text and thinking the session is writing, before the event that keeps it. They are not transcript — never stored, never in a stream that does not follow — and a reader tells the two apart by `line`. Each names the `seq` its block is expected to take, and the reader holds one partial per `seq`:  - `offset` 0 replaces what the reader holds at that `seq`; `offset`   equal to the length held appends `text` to it; any other offset is   ignored. Lengths are UTF-16 code units — a JavaScript string\'s   `length`. - An event whose `seq` is at least a partial\'s `seq` replaces it:   the block is now that event, or gone. A block whose expected place   moves on — another session\'s event took it — comes again at its new   `seq` from `offset` 0. - `offset` 0 with empty `text` says the block at that `seq` is gone   and no event the reader was sent said so (a session stopped   mid-block, followed through `subagent`): drop it.  A reader that starts following mid-block gets the block so far, from `offset` 0. A slow reader is sent everything new of a block in one line, never a queue of them.  Following, one `CaughtUpLine` is written once every event kept when the reader asked has been: what is before it is the transcript so far, what is after it happens as it is read. It comes before any partial, once per request — a reader that reads again from where it was is told again. A reader can fold what is before it in one go, and draw a long transcript once, at its end, rather than once for every batch the server wrote. 
     * The session\'s transcript, from an event on, and as it happens
     */
    streamEvents(requestParameters: StreamEventsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<EventsLine>;

}

/**
 * 
 */
export class EventsApi extends runtime.BaseAPI implements EventsApiInterface {

    /**
     * Creates request options for streamChanges without sending the request
     */
    async streamChangesRequestOpts(requestParameters: StreamChangesRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['from'] != null) {
            queryParameters['from'] = requestParameters['from'];
        }

        if (requestParameters['follow'] != null) {
            queryParameters['follow'] = requestParameters['follow'];
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

        let urlPath = `/v1/changes`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * What a chat UI keeps its session list with: list the sessions once, note `changeSeq` from the page, and follow from it. One `Change` per line; a change carries the session as it is after it. The server keeps the last `limits.changesKept`; older is `409 gapped`, and the reader lists again. 
     * Every change to the account\'s sessions, from a point on, and as it happens
     */
    async streamChangesRaw(requestParameters: StreamChangesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Change>> {
        const requestOptions = await this.streamChangesRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ChangeFromJSON(jsonValue));
    }

    /**
     * What a chat UI keeps its session list with: list the sessions once, note `changeSeq` from the page, and follow from it. One `Change` per line; a change carries the session as it is after it. The server keeps the last `limits.changesKept`; older is `409 gapped`, and the reader lists again. 
     * Every change to the account\'s sessions, from a point on, and as it happens
     */
    async streamChanges(requestParameters: StreamChangesRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Change> {
        const response = await this.streamChangesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for streamEvents without sending the request
     */
    async streamEventsRequestOpts(requestParameters: StreamEventsRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling streamEvents().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['from'] != null) {
            queryParameters['from'] = requestParameters['from'];
        }

        if (requestParameters['follow'] != null) {
            queryParameters['follow'] = requestParameters['follow'];
        }

        if (requestParameters['subagent'] != null) {
            queryParameters['subagent'] = requestParameters['subagent'];
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

        let urlPath = `/v1/sessions/{sessionId}/events`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * One `SessionEvent` per line, from `from` (the first kept when absent). With `follow`, the body stays open and every new event is written as it happens; a blank line is written at once and every 15 seconds, for proxies, and readers skip blank lines.  With `subagent`, only the events of that sub-agent, nested ones included — what a UI shows when a person opens one.  Following, the stream also carries `PartialLine`s: the text and thinking the session is writing, before the event that keeps it. They are not transcript — never stored, never in a stream that does not follow — and a reader tells the two apart by `line`. Each names the `seq` its block is expected to take, and the reader holds one partial per `seq`:  - `offset` 0 replaces what the reader holds at that `seq`; `offset`   equal to the length held appends `text` to it; any other offset is   ignored. Lengths are UTF-16 code units — a JavaScript string\'s   `length`. - An event whose `seq` is at least a partial\'s `seq` replaces it:   the block is now that event, or gone. A block whose expected place   moves on — another session\'s event took it — comes again at its new   `seq` from `offset` 0. - `offset` 0 with empty `text` says the block at that `seq` is gone   and no event the reader was sent said so (a session stopped   mid-block, followed through `subagent`): drop it.  A reader that starts following mid-block gets the block so far, from `offset` 0. A slow reader is sent everything new of a block in one line, never a queue of them.  Following, one `CaughtUpLine` is written once every event kept when the reader asked has been: what is before it is the transcript so far, what is after it happens as it is read. It comes before any partial, once per request — a reader that reads again from where it was is told again. A reader can fold what is before it in one go, and draw a long transcript once, at its end, rather than once for every batch the server wrote. 
     * The session\'s transcript, from an event on, and as it happens
     */
    async streamEventsRaw(requestParameters: StreamEventsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<EventsLine>> {
        const requestOptions = await this.streamEventsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => EventsLineFromJSON(jsonValue));
    }

    /**
     * One `SessionEvent` per line, from `from` (the first kept when absent). With `follow`, the body stays open and every new event is written as it happens; a blank line is written at once and every 15 seconds, for proxies, and readers skip blank lines.  With `subagent`, only the events of that sub-agent, nested ones included — what a UI shows when a person opens one.  Following, the stream also carries `PartialLine`s: the text and thinking the session is writing, before the event that keeps it. They are not transcript — never stored, never in a stream that does not follow — and a reader tells the two apart by `line`. Each names the `seq` its block is expected to take, and the reader holds one partial per `seq`:  - `offset` 0 replaces what the reader holds at that `seq`; `offset`   equal to the length held appends `text` to it; any other offset is   ignored. Lengths are UTF-16 code units — a JavaScript string\'s   `length`. - An event whose `seq` is at least a partial\'s `seq` replaces it:   the block is now that event, or gone. A block whose expected place   moves on — another session\'s event took it — comes again at its new   `seq` from `offset` 0. - `offset` 0 with empty `text` says the block at that `seq` is gone   and no event the reader was sent said so (a session stopped   mid-block, followed through `subagent`): drop it.  A reader that starts following mid-block gets the block so far, from `offset` 0. A slow reader is sent everything new of a block in one line, never a queue of them.  Following, one `CaughtUpLine` is written once every event kept when the reader asked has been: what is before it is the transcript so far, what is after it happens as it is read. It comes before any partial, once per request — a reader that reads again from where it was is told again. A reader can fold what is before it in one go, and draw a long transcript once, at its end, rather than once for every batch the server wrote. 
     * The session\'s transcript, from an event on, and as it happens
     */
    async streamEvents(requestParameters: StreamEventsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<EventsLine> {
        const response = await this.streamEventsRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
