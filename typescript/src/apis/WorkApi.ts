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

import * as runtime from '../runtime.js';
import {
    type ListAlarms200Response,
    ListAlarms200ResponseFromJSON,
    ListAlarms200ResponseToJSON,
} from '../models/ListAlarms200Response.js';
import {
    type ListBackgroundTasks200Response,
    ListBackgroundTasks200ResponseFromJSON,
    ListBackgroundTasks200ResponseToJSON,
} from '../models/ListBackgroundTasks200Response.js';
import {
    type ListSessionTasks200Response,
    ListSessionTasks200ResponseFromJSON,
    ListSessionTasks200ResponseToJSON,
} from '../models/ListSessionTasks200Response.js';
import {
    type ListSubagents200Response,
    ListSubagents200ResponseFromJSON,
    ListSubagents200ResponseToJSON,
} from '../models/ListSubagents200Response.js';
import {
    type SessionHarness,
    SessionHarnessFromJSON,
    SessionHarnessToJSON,
} from '../models/SessionHarness.js';
import {
    type SkillFiles,
    SkillFilesFromJSON,
    SkillFilesToJSON,
} from '../models/SkillFiles.js';
import {
    type Subagent,
    SubagentFromJSON,
    SubagentToJSON,
} from '../models/Subagent.js';
import {
    type TaskPage,
    TaskPageFromJSON,
    TaskPageToJSON,
} from '../models/TaskPage.js';
import {
    type TaskStatus,
    TaskStatusFromJSON,
    TaskStatusToJSON,
} from '../models/TaskStatus.js';

export interface GetSessionHarnessRequest {
    /**
     * 
     */
    sessionId: string;
}

export interface GetSubagentRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    subagentId: string;
}

export interface ListAlarmsRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    pending?: boolean;
}

export interface ListBackgroundTasksRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    running?: boolean;
}

export interface ListSessionSkillFilesRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    skillName: string;
}

export interface ListSessionTasksRequest {
    /**
     * 
     */
    sessionId: string;
}

export interface ListSubagentsRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    running?: boolean;
}

export interface ListTasksRequest {
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
    status?: Array<TaskStatus>;
    /**
     * The tasks of one tree of sessions.
     */
    rootId?: string;
}

export interface ReadSessionSkillRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    skillName: string;
}

export interface ReadSessionSkillFileRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    skillName: string;
    /**
     * Its path in the skill's directory, as listed.
     */
    path: string;
}

export interface StopBackgroundTaskRequest {
    /**
     * 
     */
    sessionId: string;
    /**
     * 
     */
    taskId: string;
}

/**
 * WorkApi - interface
 * 
 * @export
 * @interface WorkApiInterface
 */
export interface WorkApiInterface {
    /**
     * Creates request options for getSessionHarness without sending the request
     * @param {string} sessionId 
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    getSessionHarnessRequestOpts(requestParameters: GetSessionHarnessRequest): Promise<runtime.RequestOpts>;

    /**
     * The session\'s newest `session_started`: its tools, the MCP connectors and skills they come with, and the brokers it reaches — what a person looks at to know what the session can do. Nothing in `started` until the session has started once. 
     * @summary What the session\'s harness was given, as it last started
     * @param {string} sessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    getSessionHarnessRaw(requestParameters: GetSessionHarnessRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionHarness>>;

    /**
     * The session\'s newest `session_started`: its tools, the MCP connectors and skills they come with, and the brokers it reaches — what a person looks at to know what the session can do. Nothing in `started` until the session has started once. 
     * What the session\'s harness was given, as it last started
     */
    getSessionHarness(requestParameters: GetSessionHarnessRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionHarness>;

    /**
     * Creates request options for getSubagent without sending the request
     * @param {string} sessionId 
     * @param {string} subagentId 
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    getSubagentRequestOpts(requestParameters: GetSubagentRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary A sub-agent
     * @param {string} sessionId 
     * @param {string} subagentId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    getSubagentRaw(requestParameters: GetSubagentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Subagent>>;

    /**
     * A sub-agent
     */
    getSubagent(requestParameters: GetSubagentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Subagent>;

    /**
     * Creates request options for listAlarms without sending the request
     * @param {string} sessionId 
     * @param {boolean} [pending] 
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    listAlarmsRequestOpts(requestParameters: ListAlarmsRequest): Promise<runtime.RequestOpts>;

    /**
     * An alarm is a prompt the session\'s harness set to be given to it later — once, after a delay, or on a cron expression. While the harness\'s process holds one it fires it itself (`firedBy: harness`); one its process could not keep — the session slept, or the harness was started again — is the server\'s to fire (`firedBy: server`), as a turn with `source: alarm`. Either way a sleeping session is woken for it: `nextAlarmAt` on the session says when.  Pending first, each soonest first; then what fired or was cancelled, latest first. 
     * @summary What the session asked to be woken for, and what it was
     * @param {string} sessionId 
     * @param {boolean} [pending] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    listAlarmsRaw(requestParameters: ListAlarmsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListAlarms200Response>>;

    /**
     * An alarm is a prompt the session\'s harness set to be given to it later — once, after a delay, or on a cron expression. While the harness\'s process holds one it fires it itself (`firedBy: harness`); one its process could not keep — the session slept, or the harness was started again — is the server\'s to fire (`firedBy: server`), as a turn with `source: alarm`. Either way a sleeping session is woken for it: `nextAlarmAt` on the session says when.  Pending first, each soonest first; then what fired or was cancelled, latest first. 
     * What the session asked to be woken for, and what it was
     */
    listAlarms(requestParameters: ListAlarmsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListAlarms200Response>;

    /**
     * Creates request options for listBackgroundTasks without sending the request
     * @param {string} sessionId 
     * @param {boolean} [running] 
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    listBackgroundTasksRequestOpts(requestParameters: ListBackgroundTasksRequest): Promise<runtime.RequestOpts>;

    /**
     * A background task is something the session started and did not wait for — a shell command, a monitor, an asynchronous sub-agent. The session keeps its sandbox while one runs, and the session is told when it ends. 
     * @summary What the session left running, and what ended lately
     * @param {string} sessionId 
     * @param {boolean} [running] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    listBackgroundTasksRaw(requestParameters: ListBackgroundTasksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListBackgroundTasks200Response>>;

    /**
     * A background task is something the session started and did not wait for — a shell command, a monitor, an asynchronous sub-agent. The session keeps its sandbox while one runs, and the session is told when it ends. 
     * What the session left running, and what ended lately
     */
    listBackgroundTasks(requestParameters: ListBackgroundTasksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListBackgroundTasks200Response>;

    /**
     * Creates request options for listSessionSkillFiles without sending the request
     * @param {string} sessionId 
     * @param {string} skillName 
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    listSessionSkillFilesRequestOpts(requestParameters: ListSessionSkillFilesRequest): Promise<runtime.RequestOpts>;

    /**
     * Every file of the skill\'s directory the server keeps — its SKILL.md, and the scripts, references and anything else beside it — by path, read as `readSessionSkill` is. 
     * @summary The files of a skill the session has
     * @param {string} sessionId 
     * @param {string} skillName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    listSessionSkillFilesRaw(requestParameters: ListSessionSkillFilesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SkillFiles>>;

    /**
     * Every file of the skill\'s directory the server keeps — its SKILL.md, and the scripts, references and anything else beside it — by path, read as `readSessionSkill` is. 
     * The files of a skill the session has
     */
    listSessionSkillFiles(requestParameters: ListSessionSkillFilesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SkillFiles>;

    /**
     * Creates request options for listSessionTasks without sending the request
     * @param {string} sessionId 
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    listSessionTasksRequestOpts(requestParameters: ListSessionTasksRequest): Promise<runtime.RequestOpts>;

    /**
     * The plan the session keeps for itself — Claude Code\'s task tools — as it stands now, read from the transcript. It is the session\'s: a person changes it by telling the session. 
     * @summary The session\'s task list
     * @param {string} sessionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    listSessionTasksRaw(requestParameters: ListSessionTasksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListSessionTasks200Response>>;

    /**
     * The plan the session keeps for itself — Claude Code\'s task tools — as it stands now, read from the transcript. It is the session\'s: a person changes it by telling the session. 
     * The session\'s task list
     */
    listSessionTasks(requestParameters: ListSessionTasksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListSessionTasks200Response>;

    /**
     * Creates request options for listSubagents without sending the request
     * @param {string} sessionId 
     * @param {boolean} [running] 
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    listSubagentsRequestOpts(requestParameters: ListSubagentsRequest): Promise<runtime.RequestOpts>;

    /**
     * A sub-agent is the harness delegating to another inside the same sandbox and the same transcript — Claude Code\'s `Agent` tool. Its events are the session\'s, each marked with the sub-agent\'s id as `parentToolId`. A sub-agent may start sub-agents. For another session in a sandbox of its own, the harness starts a session. 
     * @summary The sub-agents the session\'s harness started, running first
     * @param {string} sessionId 
     * @param {boolean} [running] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    listSubagentsRaw(requestParameters: ListSubagentsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListSubagents200Response>>;

    /**
     * A sub-agent is the harness delegating to another inside the same sandbox and the same transcript — Claude Code\'s `Agent` tool. Its events are the session\'s, each marked with the sub-agent\'s id as `parentToolId`. A sub-agent may start sub-agents. For another session in a sandbox of its own, the harness starts a session. 
     * The sub-agents the session\'s harness started, running first
     */
    listSubagents(requestParameters: ListSubagentsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListSubagents200Response>;

    /**
     * Creates request options for listTasks without sending the request
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @param {Array<TaskStatus>} [status] 
     * @param {string} [rootId] The tasks of one tree of sessions.
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    listTasksRequestOpts(requestParameters: ListTasksRequest): Promise<runtime.RequestOpts>;

    /**
     * Each with its session. Archived sessions\' are left out.
     * @summary The tasks of every session, for one board
     * @param {number} [limit] At most this many; the default and ceiling are in &#x60;GET /v1/info&#x60;.
     * @param {string} [cursor] From a previous page\&#39;s &#x60;nextCursor&#x60;. Opaque; one made up is &#x60;400&#x60;.
     * @param {Array<TaskStatus>} [status] 
     * @param {string} [rootId] The tasks of one tree of sessions.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    listTasksRaw(requestParameters: ListTasksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TaskPage>>;

    /**
     * Each with its session. Archived sessions\' are left out.
     * The tasks of every session, for one board
     */
    listTasks(requestParameters: ListTasksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TaskPage>;

    /**
     * Creates request options for readSessionSkill without sending the request
     * @param {string} sessionId 
     * @param {string} skillName 
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    readSessionSkillRequestOpts(requestParameters: ReadSessionSkillRequest): Promise<runtime.RequestOpts>;

    /**
     * Kept by the server, with every file of the skill\'s directory (`listSessionSkillFiles`), so read while the session sleeps, with no sandbox. A broker\'s and an MCP connector\'s are as the session was given them when it last started, and the repository\'s as its disk had them when it last started or ended a turn. One built into the harness is on no disk: it is kept once a session of the same harness version has loaded it, as the harness gave it to the session, and the files the harness put beside it from the end of that turn. Until then there is none, and the answer is 404. 
     * @summary The SKILL.md of a skill the session has
     * @param {string} sessionId 
     * @param {string} skillName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    readSessionSkillRaw(requestParameters: ReadSessionSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;

    /**
     * Kept by the server, with every file of the skill\'s directory (`listSessionSkillFiles`), so read while the session sleeps, with no sandbox. A broker\'s and an MCP connector\'s are as the session was given them when it last started, and the repository\'s as its disk had them when it last started or ended a turn. One built into the harness is on no disk: it is kept once a session of the same harness version has loaded it, as the harness gave it to the session, and the files the harness put beside it from the end of that turn. Until then there is none, and the answer is 404. 
     * The SKILL.md of a skill the session has
     */
    readSessionSkill(requestParameters: ReadSessionSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;

    /**
     * Creates request options for readSessionSkillFile without sending the request
     * @param {string} sessionId 
     * @param {string} skillName 
     * @param {string} path Its path in the skill\&#39;s directory, as listed.
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    readSessionSkillFileRequestOpts(requestParameters: ReadSessionSkillFileRequest): Promise<runtime.RequestOpts>;

    /**
     * As `listSessionSkillFiles` lists it. Served as bytes to save, never as a page: it may be anything. 
     * @summary One file of a skill the session has
     * @param {string} sessionId 
     * @param {string} skillName 
     * @param {string} path Its path in the skill\&#39;s directory, as listed.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    readSessionSkillFileRaw(requestParameters: ReadSessionSkillFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<runtime.HttpFile>>;

    /**
     * As `listSessionSkillFiles` lists it. Served as bytes to save, never as a page: it may be anything. 
     * One file of a skill the session has
     */
    readSessionSkillFile(requestParameters: ReadSessionSkillFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.HttpFile>;

    /**
     * Creates request options for stopBackgroundTask without sending the request
     * @param {string} sessionId 
     * @param {string} taskId 
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    stopBackgroundTaskRequestOpts(requestParameters: StopBackgroundTaskRequest): Promise<runtime.RequestOpts>;

    /**
     * The session is told to stop it, in a turn of the server\'s (`source: system`): the process is the session\'s, and so is knowing what stopping it leaves behind. 
     * @summary Stop a background task
     * @param {string} sessionId 
     * @param {string} taskId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WorkApiInterface
     */
    stopBackgroundTaskRaw(requestParameters: StopBackgroundTaskRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * The session is told to stop it, in a turn of the server\'s (`source: system`): the process is the session\'s, and so is knowing what stopping it leaves behind. 
     * Stop a background task
     */
    stopBackgroundTask(requestParameters: StopBackgroundTaskRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

}

/**
 * 
 */
export class WorkApi extends runtime.BaseAPI implements WorkApiInterface {

    /**
     * Creates request options for getSessionHarness without sending the request
     */
    async getSessionHarnessRequestOpts(requestParameters: GetSessionHarnessRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling getSessionHarness().'
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

        let urlPath = `/v1/sessions/{sessionId}/harness`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The session\'s newest `session_started`: its tools, the MCP connectors and skills they come with, and the brokers it reaches — what a person looks at to know what the session can do. Nothing in `started` until the session has started once. 
     * What the session\'s harness was given, as it last started
     */
    async getSessionHarnessRaw(requestParameters: GetSessionHarnessRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SessionHarness>> {
        const requestOptions = await this.getSessionHarnessRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SessionHarnessFromJSON(jsonValue));
    }

    /**
     * The session\'s newest `session_started`: its tools, the MCP connectors and skills they come with, and the brokers it reaches — what a person looks at to know what the session can do. Nothing in `started` until the session has started once. 
     * What the session\'s harness was given, as it last started
     */
    async getSessionHarness(requestParameters: GetSessionHarnessRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SessionHarness> {
        const response = await this.getSessionHarnessRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getSubagent without sending the request
     */
    async getSubagentRequestOpts(requestParameters: GetSubagentRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling getSubagent().'
            );
        }

        if (requestParameters['subagentId'] == null) {
            throw new runtime.RequiredError(
                'subagentId',
                'Required parameter "subagentId" was null or undefined when calling getSubagent().'
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

        let urlPath = `/v1/sessions/{sessionId}/subagents/{subagentId}`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));
        urlPath = urlPath.replace('{subagentId}', encodeURIComponent(String(requestParameters['subagentId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A sub-agent
     */
    async getSubagentRaw(requestParameters: GetSubagentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Subagent>> {
        const requestOptions = await this.getSubagentRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SubagentFromJSON(jsonValue));
    }

    /**
     * A sub-agent
     */
    async getSubagent(requestParameters: GetSubagentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Subagent> {
        const response = await this.getSubagentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listAlarms without sending the request
     */
    async listAlarmsRequestOpts(requestParameters: ListAlarmsRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling listAlarms().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['pending'] != null) {
            queryParameters['pending'] = requestParameters['pending'];
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

        let urlPath = `/v1/sessions/{sessionId}/alarms`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * An alarm is a prompt the session\'s harness set to be given to it later — once, after a delay, or on a cron expression. While the harness\'s process holds one it fires it itself (`firedBy: harness`); one its process could not keep — the session slept, or the harness was started again — is the server\'s to fire (`firedBy: server`), as a turn with `source: alarm`. Either way a sleeping session is woken for it: `nextAlarmAt` on the session says when.  Pending first, each soonest first; then what fired or was cancelled, latest first. 
     * What the session asked to be woken for, and what it was
     */
    async listAlarmsRaw(requestParameters: ListAlarmsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListAlarms200Response>> {
        const requestOptions = await this.listAlarmsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListAlarms200ResponseFromJSON(jsonValue));
    }

    /**
     * An alarm is a prompt the session\'s harness set to be given to it later — once, after a delay, or on a cron expression. While the harness\'s process holds one it fires it itself (`firedBy: harness`); one its process could not keep — the session slept, or the harness was started again — is the server\'s to fire (`firedBy: server`), as a turn with `source: alarm`. Either way a sleeping session is woken for it: `nextAlarmAt` on the session says when.  Pending first, each soonest first; then what fired or was cancelled, latest first. 
     * What the session asked to be woken for, and what it was
     */
    async listAlarms(requestParameters: ListAlarmsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListAlarms200Response> {
        const response = await this.listAlarmsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listBackgroundTasks without sending the request
     */
    async listBackgroundTasksRequestOpts(requestParameters: ListBackgroundTasksRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling listBackgroundTasks().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['running'] != null) {
            queryParameters['running'] = requestParameters['running'];
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

        let urlPath = `/v1/sessions/{sessionId}/background-tasks`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A background task is something the session started and did not wait for — a shell command, a monitor, an asynchronous sub-agent. The session keeps its sandbox while one runs, and the session is told when it ends. 
     * What the session left running, and what ended lately
     */
    async listBackgroundTasksRaw(requestParameters: ListBackgroundTasksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListBackgroundTasks200Response>> {
        const requestOptions = await this.listBackgroundTasksRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListBackgroundTasks200ResponseFromJSON(jsonValue));
    }

    /**
     * A background task is something the session started and did not wait for — a shell command, a monitor, an asynchronous sub-agent. The session keeps its sandbox while one runs, and the session is told when it ends. 
     * What the session left running, and what ended lately
     */
    async listBackgroundTasks(requestParameters: ListBackgroundTasksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListBackgroundTasks200Response> {
        const response = await this.listBackgroundTasksRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listSessionSkillFiles without sending the request
     */
    async listSessionSkillFilesRequestOpts(requestParameters: ListSessionSkillFilesRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling listSessionSkillFiles().'
            );
        }

        if (requestParameters['skillName'] == null) {
            throw new runtime.RequiredError(
                'skillName',
                'Required parameter "skillName" was null or undefined when calling listSessionSkillFiles().'
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

        let urlPath = `/v1/sessions/{sessionId}/harness/skills/{skillName}/files`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));
        urlPath = urlPath.replace('{skillName}', encodeURIComponent(String(requestParameters['skillName'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Every file of the skill\'s directory the server keeps — its SKILL.md, and the scripts, references and anything else beside it — by path, read as `readSessionSkill` is. 
     * The files of a skill the session has
     */
    async listSessionSkillFilesRaw(requestParameters: ListSessionSkillFilesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<SkillFiles>> {
        const requestOptions = await this.listSessionSkillFilesRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SkillFilesFromJSON(jsonValue));
    }

    /**
     * Every file of the skill\'s directory the server keeps — its SKILL.md, and the scripts, references and anything else beside it — by path, read as `readSessionSkill` is. 
     * The files of a skill the session has
     */
    async listSessionSkillFiles(requestParameters: ListSessionSkillFilesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<SkillFiles> {
        const response = await this.listSessionSkillFilesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listSessionTasks without sending the request
     */
    async listSessionTasksRequestOpts(requestParameters: ListSessionTasksRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling listSessionTasks().'
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

        let urlPath = `/v1/sessions/{sessionId}/tasks`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The plan the session keeps for itself — Claude Code\'s task tools — as it stands now, read from the transcript. It is the session\'s: a person changes it by telling the session. 
     * The session\'s task list
     */
    async listSessionTasksRaw(requestParameters: ListSessionTasksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListSessionTasks200Response>> {
        const requestOptions = await this.listSessionTasksRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListSessionTasks200ResponseFromJSON(jsonValue));
    }

    /**
     * The plan the session keeps for itself — Claude Code\'s task tools — as it stands now, read from the transcript. It is the session\'s: a person changes it by telling the session. 
     * The session\'s task list
     */
    async listSessionTasks(requestParameters: ListSessionTasksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListSessionTasks200Response> {
        const response = await this.listSessionTasksRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listSubagents without sending the request
     */
    async listSubagentsRequestOpts(requestParameters: ListSubagentsRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling listSubagents().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['running'] != null) {
            queryParameters['running'] = requestParameters['running'];
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

        let urlPath = `/v1/sessions/{sessionId}/subagents`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A sub-agent is the harness delegating to another inside the same sandbox and the same transcript — Claude Code\'s `Agent` tool. Its events are the session\'s, each marked with the sub-agent\'s id as `parentToolId`. A sub-agent may start sub-agents. For another session in a sandbox of its own, the harness starts a session. 
     * The sub-agents the session\'s harness started, running first
     */
    async listSubagentsRaw(requestParameters: ListSubagentsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ListSubagents200Response>> {
        const requestOptions = await this.listSubagentsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ListSubagents200ResponseFromJSON(jsonValue));
    }

    /**
     * A sub-agent is the harness delegating to another inside the same sandbox and the same transcript — Claude Code\'s `Agent` tool. Its events are the session\'s, each marked with the sub-agent\'s id as `parentToolId`. A sub-agent may start sub-agents. For another session in a sandbox of its own, the harness starts a session. 
     * The sub-agents the session\'s harness started, running first
     */
    async listSubagents(requestParameters: ListSubagentsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ListSubagents200Response> {
        const response = await this.listSubagentsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listTasks without sending the request
     */
    async listTasksRequestOpts(requestParameters: ListTasksRequest): Promise<runtime.RequestOpts> {
        const queryParameters: any = {};

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['cursor'] != null) {
            queryParameters['cursor'] = requestParameters['cursor'];
        }

        if (requestParameters['status'] != null) {
            queryParameters['status'] = requestParameters['status']!.join(runtime.COLLECTION_FORMATS["csv"]);
        }

        if (requestParameters['rootId'] != null) {
            queryParameters['rootId'] = requestParameters['rootId'];
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

        let urlPath = `/v1/tasks`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Each with its session. Archived sessions\' are left out.
     * The tasks of every session, for one board
     */
    async listTasksRaw(requestParameters: ListTasksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TaskPage>> {
        const requestOptions = await this.listTasksRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TaskPageFromJSON(jsonValue));
    }

    /**
     * Each with its session. Archived sessions\' are left out.
     * The tasks of every session, for one board
     */
    async listTasks(requestParameters: ListTasksRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TaskPage> {
        const response = await this.listTasksRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readSessionSkill without sending the request
     */
    async readSessionSkillRequestOpts(requestParameters: ReadSessionSkillRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling readSessionSkill().'
            );
        }

        if (requestParameters['skillName'] == null) {
            throw new runtime.RequiredError(
                'skillName',
                'Required parameter "skillName" was null or undefined when calling readSessionSkill().'
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

        let urlPath = `/v1/sessions/{sessionId}/harness/skills/{skillName}`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));
        urlPath = urlPath.replace('{skillName}', encodeURIComponent(String(requestParameters['skillName'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Kept by the server, with every file of the skill\'s directory (`listSessionSkillFiles`), so read while the session sleeps, with no sandbox. A broker\'s and an MCP connector\'s are as the session was given them when it last started, and the repository\'s as its disk had them when it last started or ended a turn. One built into the harness is on no disk: it is kept once a session of the same harness version has loaded it, as the harness gave it to the session, and the files the harness put beside it from the end of that turn. Until then there is none, and the answer is 404. 
     * The SKILL.md of a skill the session has
     */
    async readSessionSkillRaw(requestParameters: ReadSessionSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const requestOptions = await this.readSessionSkillRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * Kept by the server, with every file of the skill\'s directory (`listSessionSkillFiles`), so read while the session sleeps, with no sandbox. A broker\'s and an MCP connector\'s are as the session was given them when it last started, and the repository\'s as its disk had them when it last started or ended a turn. One built into the harness is on no disk: it is kept once a session of the same harness version has loaded it, as the harness gave it to the session, and the files the harness put beside it from the end of that turn. Until then there is none, and the answer is 404. 
     * The SKILL.md of a skill the session has
     */
    async readSessionSkill(requestParameters: ReadSessionSkillRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.readSessionSkillRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readSessionSkillFile without sending the request
     */
    async readSessionSkillFileRequestOpts(requestParameters: ReadSessionSkillFileRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling readSessionSkillFile().'
            );
        }

        if (requestParameters['skillName'] == null) {
            throw new runtime.RequiredError(
                'skillName',
                'Required parameter "skillName" was null or undefined when calling readSessionSkillFile().'
            );
        }

        if (requestParameters['path'] == null) {
            throw new runtime.RequiredError(
                'path',
                'Required parameter "path" was null or undefined when calling readSessionSkillFile().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['path'] != null) {
            queryParameters['path'] = requestParameters['path'];
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

        let urlPath = `/v1/sessions/{sessionId}/harness/skills/{skillName}/file`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));
        urlPath = urlPath.replace('{skillName}', encodeURIComponent(String(requestParameters['skillName'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * As `listSessionSkillFiles` lists it. Served as bytes to save, never as a page: it may be anything. 
     * One file of a skill the session has
     */
    async readSessionSkillFileRaw(requestParameters: ReadSessionSkillFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<runtime.HttpFile>> {
        const requestOptions = await this.readSessionSkillFileRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.BlobApiResponse(response);
    }

    /**
     * As `listSessionSkillFiles` lists it. Served as bytes to save, never as a page: it may be anything. 
     * One file of a skill the session has
     */
    async readSessionSkillFile(requestParameters: ReadSessionSkillFileRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.HttpFile> {
        const response = await this.readSessionSkillFileRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for stopBackgroundTask without sending the request
     */
    async stopBackgroundTaskRequestOpts(requestParameters: StopBackgroundTaskRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['sessionId'] == null) {
            throw new runtime.RequiredError(
                'sessionId',
                'Required parameter "sessionId" was null or undefined when calling stopBackgroundTask().'
            );
        }

        if (requestParameters['taskId'] == null) {
            throw new runtime.RequiredError(
                'taskId',
                'Required parameter "taskId" was null or undefined when calling stopBackgroundTask().'
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

        let urlPath = `/v1/sessions/{sessionId}/background-tasks/{taskId}/stop`;
        urlPath = urlPath.replace('{sessionId}', encodeURIComponent(String(requestParameters['sessionId'])));
        urlPath = urlPath.replace('{taskId}', encodeURIComponent(String(requestParameters['taskId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * The session is told to stop it, in a turn of the server\'s (`source: system`): the process is the session\'s, and so is knowing what stopping it leaves behind. 
     * Stop a background task
     */
    async stopBackgroundTaskRaw(requestParameters: StopBackgroundTaskRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.stopBackgroundTaskRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * The session is told to stop it, in a turn of the server\'s (`source: system`): the process is the session\'s, and so is knowing what stopping it leaves behind. 
     * Stop a background task
     */
    async stopBackgroundTask(requestParameters: StopBackgroundTaskRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.stopBackgroundTaskRaw(requestParameters, initOverrides);
    }

}
