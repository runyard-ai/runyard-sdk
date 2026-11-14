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
    type Deployment,
    DeploymentFromJSON,
    DeploymentToJSON,
} from '../models/Deployment.js';
import {
    type DeploymentApproval,
    DeploymentApprovalFromJSON,
    DeploymentApprovalToJSON,
} from '../models/DeploymentApproval.js';
import {
    type DeploymentApprovalList,
    DeploymentApprovalListFromJSON,
    DeploymentApprovalListToJSON,
} from '../models/DeploymentApprovalList.js';
import {
    type DeploymentCommand,
    DeploymentCommandFromJSON,
    DeploymentCommandToJSON,
} from '../models/DeploymentCommand.js';
import {
    type DeploymentCommandResult,
    DeploymentCommandResultFromJSON,
    DeploymentCommandResultToJSON,
} from '../models/DeploymentCommandResult.js';
import {
    type DeploymentLease,
    DeploymentLeaseFromJSON,
    DeploymentLeaseToJSON,
} from '../models/DeploymentLease.js';
import {
    type DeploymentList,
    DeploymentListFromJSON,
    DeploymentListToJSON,
} from '../models/DeploymentList.js';
import {
    type DeploymentRequest,
    DeploymentRequestFromJSON,
    DeploymentRequestToJSON,
} from '../models/DeploymentRequest.js';
import {
    type Tunnel,
    TunnelFromJSON,
    TunnelToJSON,
} from '../models/Tunnel.js';
import {
    type TunnelList,
    TunnelListFromJSON,
    TunnelListToJSON,
} from '../models/TunnelList.js';
import {
    type TunnelSpec,
    TunnelSpecFromJSON,
    TunnelSpecToJSON,
} from '../models/TunnelSpec.js';

export interface ApproveDeploymentRequest {
    /**
     * 
     */
    approvalId: string;
}

export interface CreateDeploymentRequest {
    /**
     * 
     */
    deploymentRequest: DeploymentRequest;
}

export interface DeleteDeploymentRequest {
    /**
     * 
     */
    deploymentId: string;
}

export interface DeleteDeploymentTunnelRequest {
    /**
     * 
     */
    deploymentId: string;
    /**
     * 
     */
    tunnelName: string;
}

export interface ExtendDeploymentRequest {
    /**
     * 
     */
    deploymentId: string;
    /**
     * 
     */
    deploymentLease: DeploymentLease;
}

export interface GetDeploymentRequest {
    /**
     * 
     */
    deploymentId: string;
}

export interface GetDeploymentApprovalRequest {
    /**
     * 
     */
    approvalId: string;
}

export interface ListDeploymentTunnelsRequest {
    /**
     * 
     */
    deploymentId: string;
}

export interface PutDeploymentTunnelRequest {
    /**
     * 
     */
    deploymentId: string;
    /**
     * 
     */
    tunnelName: string;
    /**
     * 
     */
    tunnelSpec: TunnelSpec;
}

export interface ReadDeploymentLogsRequest {
    /**
     * 
     */
    deploymentId: string;
    /**
     * 
     */
    stream?: ReadDeploymentLogsStreamEnum;
    /**
     * The first byte wanted.
     */
    from?: number;
    /**
     * Keep the body open and write what happens next.
     */
    follow?: boolean;
}

export interface RefuseDeploymentRequest {
    /**
     * 
     */
    approvalId: string;
}

export interface RequestDeploymentRequest {
    /**
     * 
     */
    deploymentRequest: DeploymentRequest;
}

export interface RunDeploymentCommandRequest {
    /**
     * 
     */
    deploymentId: string;
    /**
     * 
     */
    deploymentCommand: DeploymentCommand;
}

export interface SealDeploymentRequest {
    /**
     * 
     */
    deploymentId: string;
}

export interface StartDeploymentRequest {
    /**
     * 
     */
    deploymentId: string;
    /**
     * 
     */
    deploymentLease?: DeploymentLease;
}

export interface StopDeploymentRequest {
    /**
     * 
     */
    deploymentId: string;
}

export interface UnsealDeploymentRequest {
    /**
     * 
     */
    deploymentId: string;
}

/**
 * DeploymentsApi - interface
 * 
 * @export
 * @interface DeploymentsApiInterface
 */
export interface DeploymentsApiInterface {
    /**
     * Creates request options for approveDeployment without sending the request
     * @param {string} approvalId 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    approveDeploymentRequestOpts(requestParameters: ApproveDeploymentRequest): Promise<runtime.RequestOpts>;

    /**
     * Its person\'s alone: a session is refused (`403`), and so is anybody else. The deployment is made now; one that cannot be — its image gone, a secret forgotten — is answered as `POST …/deployments` answers it, and the approval stays waiting. 
     * @summary Make the deployment a session asked for
     * @param {string} approvalId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    approveDeploymentRaw(requestParameters: ApproveDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeploymentApproval>>;

    /**
     * Its person\'s alone: a session is refused (`403`), and so is anybody else. The deployment is made now; one that cannot be — its image gone, a secret forgotten — is answered as `POST …/deployments` answers it, and the approval stays waiting. 
     * Make the deployment a session asked for
     */
    approveDeployment(requestParameters: ApproveDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeploymentApproval>;

    /**
     * Creates request options for createDeployment without sending the request
     * @param {DeploymentRequest} deploymentRequest 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    createDeploymentRequestOpts(requestParameters: CreateDeploymentRequest): Promise<runtime.RequestOpts>;

    /**
     * The sandbox runs the image\'s own `ENTRYPOINT`/`CMD` and nothing else: it is **sealed**, so the sandboxes daemon refuses every command, file write and terminal in it, to everyone, until it is unsealed — and the first after that makes it `tainted` for good. Its logs are read (`…/logs`) and its ports published (`…/tunnels`); it reaches nothing on the internet but the hosts it is made with (`allow`).  With `secrets`, a session is refused (`403`): it asks its person through `POST …/deployment-approvals`.  It is the caller\'s person\'s, and stays theirs when the session that made it is deleted. It is stopped once `expiresAt` passes — a day from now unless `ttlSeconds` says otherwise, a week at most — and `POST …/start` boots it again on the disk it had. 
     * @summary Boot a sealed sandbox from a built image
     * @param {DeploymentRequest} deploymentRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    createDeploymentRaw(requestParameters: CreateDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Deployment>>;

    /**
     * The sandbox runs the image\'s own `ENTRYPOINT`/`CMD` and nothing else: it is **sealed**, so the sandboxes daemon refuses every command, file write and terminal in it, to everyone, until it is unsealed — and the first after that makes it `tainted` for good. Its logs are read (`…/logs`) and its ports published (`…/tunnels`); it reaches nothing on the internet but the hosts it is made with (`allow`).  With `secrets`, a session is refused (`403`): it asks its person through `POST …/deployment-approvals`.  It is the caller\'s person\'s, and stays theirs when the session that made it is deleted. It is stopped once `expiresAt` passes — a day from now unless `ttlSeconds` says otherwise, a week at most — and `POST …/start` boots it again on the disk it had. 
     * Boot a sealed sandbox from a built image
     */
    createDeployment(requestParameters: CreateDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Deployment>;

    /**
     * Creates request options for deleteDeployment without sending the request
     * @param {string} deploymentId 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    deleteDeploymentRequestOpts(requestParameters: DeleteDeploymentRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary Delete a deployment, its sandbox, disk and tunnels
     * @param {string} deploymentId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    deleteDeploymentRaw(requestParameters: DeleteDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Delete a deployment, its sandbox, disk and tunnels
     */
    deleteDeployment(requestParameters: DeleteDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for deleteDeploymentTunnel without sending the request
     * @param {string} deploymentId 
     * @param {string} tunnelName 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    deleteDeploymentTunnelRequestOpts(requestParameters: DeleteDeploymentTunnelRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary Take a tunnel down
     * @param {string} deploymentId 
     * @param {string} tunnelName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    deleteDeploymentTunnelRaw(requestParameters: DeleteDeploymentTunnelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Take a tunnel down
     */
    deleteDeploymentTunnel(requestParameters: DeleteDeploymentTunnelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * Creates request options for extendDeployment without sending the request
     * @param {string} deploymentId 
     * @param {DeploymentLease} deploymentLease 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    extendDeploymentRequestOpts(requestParameters: ExtendDeploymentRequest): Promise<runtime.RequestOpts>;

    /**
     * A week from now at most. It does not boot one that is stopped.
     * @summary Move its expiry to ttlSeconds from now
     * @param {string} deploymentId 
     * @param {DeploymentLease} deploymentLease 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    extendDeploymentRaw(requestParameters: ExtendDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Deployment>>;

    /**
     * A week from now at most. It does not boot one that is stopped.
     * Move its expiry to ttlSeconds from now
     */
    extendDeployment(requestParameters: ExtendDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Deployment>;

    /**
     * Creates request options for getDeployment without sending the request
     * @param {string} deploymentId 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    getDeploymentRequestOpts(requestParameters: GetDeploymentRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary A deployment
     * @param {string} deploymentId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    getDeploymentRaw(requestParameters: GetDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Deployment>>;

    /**
     * A deployment
     */
    getDeployment(requestParameters: GetDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Deployment>;

    /**
     * Creates request options for getDeploymentApproval without sending the request
     * @param {string} approvalId 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    getDeploymentApprovalRequestOpts(requestParameters: GetDeploymentApprovalRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary A deployment asked for, and what was decided
     * @param {string} approvalId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    getDeploymentApprovalRaw(requestParameters: GetDeploymentApprovalRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeploymentApproval>>;

    /**
     * A deployment asked for, and what was decided
     */
    getDeploymentApproval(requestParameters: GetDeploymentApprovalRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeploymentApproval>;

    /**
     * Creates request options for listDeploymentApprovals without sending the request
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    listDeploymentApprovalsRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * A person\'s, newest first: those still waiting, and those decided in the last week. A session sees those it asked for. 
     * @summary Deployments the caller\'s sessions asked for, waiting or decided
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    listDeploymentApprovalsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeploymentApprovalList>>;

    /**
     * A person\'s, newest first: those still waiting, and those decided in the last week. A session sees those it asked for. 
     * Deployments the caller\'s sessions asked for, waiting or decided
     */
    listDeploymentApprovals(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeploymentApprovalList>;

    /**
     * Creates request options for listDeploymentTunnels without sending the request
     * @param {string} deploymentId 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    listDeploymentTunnelsRequestOpts(requestParameters: ListDeploymentTunnelsRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary Its tunnels
     * @param {string} deploymentId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    listDeploymentTunnelsRaw(requestParameters: ListDeploymentTunnelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TunnelList>>;

    /**
     * Its tunnels
     */
    listDeploymentTunnels(requestParameters: ListDeploymentTunnelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TunnelList>;

    /**
     * Creates request options for listDeployments without sending the request
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    listDeploymentsRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * A person\'s own, whichever of their sessions made them, and every one for an admin. Newest first. 
     * @summary The caller\'s deployments
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    listDeploymentsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeploymentList>>;

    /**
     * A person\'s own, whichever of their sessions made them, and every one for an admin. Newest first. 
     * The caller\'s deployments
     */
    listDeployments(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeploymentList>;

    /**
     * Creates request options for listOwnTunnels without sending the request
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    listOwnTunnelsRequestOpts(): Promise<runtime.RequestOpts>;

    /**
     * A person\'s own — their deployments\' and their sessions\' sandboxes\' — and every one for an admin. 
     * @summary Every tunnel of the caller\'s deployments and sessions
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    listOwnTunnelsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TunnelList>>;

    /**
     * A person\'s own — their deployments\' and their sessions\' sandboxes\' — and every one for an admin. 
     * Every tunnel of the caller\'s deployments and sessions
     */
    listOwnTunnels(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TunnelList>;

    /**
     * Creates request options for putDeploymentTunnel without sending the request
     * @param {string} deploymentId 
     * @param {string} tunnelName 
     * @param {TunnelSpec} tunnelSpec 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    putDeploymentTunnelRequestOpts(requestParameters: PutDeploymentTunnelRequest): Promise<runtime.RequestOpts>;

    /**
     * Reached by the people `access` names, signing in at the tunnel gateway — the deployment\'s owner when it names nobody — and nobody else. 
     * @summary Publish one of its ports at an address
     * @param {string} deploymentId 
     * @param {string} tunnelName 
     * @param {TunnelSpec} tunnelSpec 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    putDeploymentTunnelRaw(requestParameters: PutDeploymentTunnelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Tunnel>>;

    /**
     * Reached by the people `access` names, signing in at the tunnel gateway — the deployment\'s owner when it names nobody — and nobody else. 
     * Publish one of its ports at an address
     */
    putDeploymentTunnel(requestParameters: PutDeploymentTunnelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Tunnel>;

    /**
     * Creates request options for readDeploymentLogs without sending the request
     * @param {string} deploymentId 
     * @param {'stdout' | 'stderr' | 'console'} [stream] 
     * @param {number} [from] The first byte wanted.
     * @param {boolean} [follow] Keep the body open and write what happens next.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    readDeploymentLogsRequestOpts(requestParameters: ReadDeploymentLogsRequest): Promise<runtime.RequestOpts>;

    /**
     * `stdout` and `stderr` are its entrypoint\'s, since it last booted; `console` is what its kernel and init wrote while it booted — what there is when it never came up. `from` is a byte offset, so a reader that dropped resumes where it stopped; with `follow` the body stays open while there is more to come. 
     * @summary What it printed, from a byte offset
     * @param {string} deploymentId 
     * @param {'stdout' | 'stderr' | 'console'} [stream] 
     * @param {number} [from] The first byte wanted.
     * @param {boolean} [follow] Keep the body open and write what happens next.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    readDeploymentLogsRaw(requestParameters: ReadDeploymentLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>>;

    /**
     * `stdout` and `stderr` are its entrypoint\'s, since it last booted; `console` is what its kernel and init wrote while it booted — what there is when it never came up. `from` is a byte offset, so a reader that dropped resumes where it stopped; with `follow` the body stays open while there is more to come. 
     * What it printed, from a byte offset
     */
    readDeploymentLogs(requestParameters: ReadDeploymentLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string>;

    /**
     * Creates request options for refuseDeployment without sending the request
     * @param {string} approvalId 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    refuseDeploymentRequestOpts(requestParameters: RefuseDeploymentRequest): Promise<runtime.RequestOpts>;

    /**
     * Its person\'s alone, as approving is.
     * @summary Refuse the deployment a session asked for
     * @param {string} approvalId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    refuseDeploymentRaw(requestParameters: RefuseDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeploymentApproval>>;

    /**
     * Its person\'s alone, as approving is.
     * Refuse the deployment a session asked for
     */
    refuseDeployment(requestParameters: RefuseDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeploymentApproval>;

    /**
     * Creates request options for requestDeployment without sending the request
     * @param {DeploymentRequest} deploymentRequest 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    requestDeploymentRequestOpts(requestParameters: RequestDeploymentRequest): Promise<runtime.RequestOpts>;

    /**
     * How a session gets a deployment that has its person\'s `secrets`: the image it built could send them to any host it reaches, so its person decides, seeing the image, the hosts and the secrets together. They are told in their notices. Nothing is made until they approve, and it is then made as if they had asked, with this session as the one that made it.  What is asked is checked now as `POST …/deployments` checks it, the image and the secrets included; and again when it is approved. 
     * @summary Ask the caller\'s person to make a deployment
     * @param {DeploymentRequest} deploymentRequest 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    requestDeploymentRaw(requestParameters: RequestDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeploymentApproval>>;

    /**
     * How a session gets a deployment that has its person\'s `secrets`: the image it built could send them to any host it reaches, so its person decides, seeing the image, the hosts and the secrets together. They are told in their notices. Nothing is made until they approve, and it is then made as if they had asked, with this session as the one that made it.  What is asked is checked now as `POST …/deployments` checks it, the image and the secrets included; and again when it is approved. 
     * Ask the caller\'s person to make a deployment
     */
    requestDeployment(requestParameters: RequestDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeploymentApproval>;

    /**
     * Creates request options for runDeploymentCommand without sending the request
     * @param {string} deploymentId 
     * @param {DeploymentCommand} deploymentCommand 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    runDeploymentCommandRequestOpts(requestParameters: RunDeploymentCommandRequest): Promise<runtime.RequestOpts>;

    /**
     * A sealed one is `409`: unseal it first. The first command taints it for good, and says who ran it. 
     * @summary Run a command in an unsealed deployment, and wait for it
     * @param {string} deploymentId 
     * @param {DeploymentCommand} deploymentCommand 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    runDeploymentCommandRaw(requestParameters: RunDeploymentCommandRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeploymentCommandResult>>;

    /**
     * A sealed one is `409`: unseal it first. The first command taints it for good, and says who ran it. 
     * Run a command in an unsealed deployment, and wait for it
     */
    runDeploymentCommand(requestParameters: RunDeploymentCommandRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeploymentCommandResult>;

    /**
     * Creates request options for sealDeployment without sending the request
     * @param {string} deploymentId 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    sealDeploymentRequestOpts(requestParameters: SealDeploymentRequest): Promise<runtime.RequestOpts>;

    /**
     * A terminal open on it is hung up. What runs in it goes on, and a taint stays. 
     * @summary Refuse commands and terminals in it from now on
     * @param {string} deploymentId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    sealDeploymentRaw(requestParameters: SealDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Deployment>>;

    /**
     * A terminal open on it is hung up. What runs in it goes on, and a taint stays. 
     * Refuse commands and terminals in it from now on
     */
    sealDeployment(requestParameters: SealDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Deployment>;

    /**
     * Creates request options for startDeployment without sending the request
     * @param {string} deploymentId 
     * @param {DeploymentLease} [deploymentLease] 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    startDeploymentRequestOpts(requestParameters: StartDeploymentRequest): Promise<runtime.RequestOpts>;

    /**
     * On the disk it had, until `ttlSeconds` from now — a day unless it says otherwise. Starting one that runs only moves its expiry. 
     * @summary Boot a stopped or expired deployment again
     * @param {string} deploymentId 
     * @param {DeploymentLease} [deploymentLease] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    startDeploymentRaw(requestParameters: StartDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Deployment>>;

    /**
     * On the disk it had, until `ttlSeconds` from now — a day unless it says otherwise. Starting one that runs only moves its expiry. 
     * Boot a stopped or expired deployment again
     */
    startDeployment(requestParameters: StartDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Deployment>;

    /**
     * Creates request options for stopDeployment without sending the request
     * @param {string} deploymentId 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    stopDeploymentRequestOpts(requestParameters: StopDeploymentRequest): Promise<runtime.RequestOpts>;

    /**
     * 
     * @summary Switch it off, its disk kept
     * @param {string} deploymentId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    stopDeploymentRaw(requestParameters: StopDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Deployment>>;

    /**
     * Switch it off, its disk kept
     */
    stopDeployment(requestParameters: StopDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Deployment>;

    /**
     * Creates request options for unsealDeployment without sending the request
     * @param {string} deploymentId 
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    unsealDeploymentRequestOpts(requestParameters: UnsealDeploymentRequest): Promise<runtime.RequestOpts>;

    /**
     * For debugging one that does not do what its recipe says. Nothing has run yet: the first command or terminal after it makes the deployment `tainted` for good — whoever runs it, a session or a person — and sealing it again does not take that away. 
     * @summary Let commands and a terminal into it
     * @param {string} deploymentId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentsApiInterface
     */
    unsealDeploymentRaw(requestParameters: UnsealDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Deployment>>;

    /**
     * For debugging one that does not do what its recipe says. Nothing has run yet: the first command or terminal after it makes the deployment `tainted` for good — whoever runs it, a session or a person — and sealing it again does not take that away. 
     * Let commands and a terminal into it
     */
    unsealDeployment(requestParameters: UnsealDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Deployment>;

}

/**
 * 
 */
export class DeploymentsApi extends runtime.BaseAPI implements DeploymentsApiInterface {

    /**
     * Creates request options for approveDeployment without sending the request
     */
    async approveDeploymentRequestOpts(requestParameters: ApproveDeploymentRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['approvalId'] == null) {
            throw new runtime.RequiredError(
                'approvalId',
                'Required parameter "approvalId" was null or undefined when calling approveDeployment().'
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

        let urlPath = `/v1/deployment-approvals/{approvalId}/approve`;
        urlPath = urlPath.replace('{approvalId}', encodeURIComponent(String(requestParameters['approvalId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Its person\'s alone: a session is refused (`403`), and so is anybody else. The deployment is made now; one that cannot be — its image gone, a secret forgotten — is answered as `POST …/deployments` answers it, and the approval stays waiting. 
     * Make the deployment a session asked for
     */
    async approveDeploymentRaw(requestParameters: ApproveDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeploymentApproval>> {
        const requestOptions = await this.approveDeploymentRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeploymentApprovalFromJSON(jsonValue));
    }

    /**
     * Its person\'s alone: a session is refused (`403`), and so is anybody else. The deployment is made now; one that cannot be — its image gone, a secret forgotten — is answered as `POST …/deployments` answers it, and the approval stays waiting. 
     * Make the deployment a session asked for
     */
    async approveDeployment(requestParameters: ApproveDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeploymentApproval> {
        const response = await this.approveDeploymentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for createDeployment without sending the request
     */
    async createDeploymentRequestOpts(requestParameters: CreateDeploymentRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['deploymentRequest'] == null) {
            throw new runtime.RequiredError(
                'deploymentRequest',
                'Required parameter "deploymentRequest" was null or undefined when calling createDeployment().'
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

        let urlPath = `/v1/deployments`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DeploymentRequestToJSON(requestParameters['deploymentRequest']),
        };
    }

    /**
     * The sandbox runs the image\'s own `ENTRYPOINT`/`CMD` and nothing else: it is **sealed**, so the sandboxes daemon refuses every command, file write and terminal in it, to everyone, until it is unsealed — and the first after that makes it `tainted` for good. Its logs are read (`…/logs`) and its ports published (`…/tunnels`); it reaches nothing on the internet but the hosts it is made with (`allow`).  With `secrets`, a session is refused (`403`): it asks its person through `POST …/deployment-approvals`.  It is the caller\'s person\'s, and stays theirs when the session that made it is deleted. It is stopped once `expiresAt` passes — a day from now unless `ttlSeconds` says otherwise, a week at most — and `POST …/start` boots it again on the disk it had. 
     * Boot a sealed sandbox from a built image
     */
    async createDeploymentRaw(requestParameters: CreateDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Deployment>> {
        const requestOptions = await this.createDeploymentRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeploymentFromJSON(jsonValue));
    }

    /**
     * The sandbox runs the image\'s own `ENTRYPOINT`/`CMD` and nothing else: it is **sealed**, so the sandboxes daemon refuses every command, file write and terminal in it, to everyone, until it is unsealed — and the first after that makes it `tainted` for good. Its logs are read (`…/logs`) and its ports published (`…/tunnels`); it reaches nothing on the internet but the hosts it is made with (`allow`).  With `secrets`, a session is refused (`403`): it asks its person through `POST …/deployment-approvals`.  It is the caller\'s person\'s, and stays theirs when the session that made it is deleted. It is stopped once `expiresAt` passes — a day from now unless `ttlSeconds` says otherwise, a week at most — and `POST …/start` boots it again on the disk it had. 
     * Boot a sealed sandbox from a built image
     */
    async createDeployment(requestParameters: CreateDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Deployment> {
        const response = await this.createDeploymentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for deleteDeployment without sending the request
     */
    async deleteDeploymentRequestOpts(requestParameters: DeleteDeploymentRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['deploymentId'] == null) {
            throw new runtime.RequiredError(
                'deploymentId',
                'Required parameter "deploymentId" was null or undefined when calling deleteDeployment().'
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

        let urlPath = `/v1/deployments/{deploymentId}`;
        urlPath = urlPath.replace('{deploymentId}', encodeURIComponent(String(requestParameters['deploymentId'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Delete a deployment, its sandbox, disk and tunnels
     */
    async deleteDeploymentRaw(requestParameters: DeleteDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteDeploymentRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a deployment, its sandbox, disk and tunnels
     */
    async deleteDeployment(requestParameters: DeleteDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteDeploymentRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for deleteDeploymentTunnel without sending the request
     */
    async deleteDeploymentTunnelRequestOpts(requestParameters: DeleteDeploymentTunnelRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['deploymentId'] == null) {
            throw new runtime.RequiredError(
                'deploymentId',
                'Required parameter "deploymentId" was null or undefined when calling deleteDeploymentTunnel().'
            );
        }

        if (requestParameters['tunnelName'] == null) {
            throw new runtime.RequiredError(
                'tunnelName',
                'Required parameter "tunnelName" was null or undefined when calling deleteDeploymentTunnel().'
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

        let urlPath = `/v1/deployments/{deploymentId}/tunnels/{tunnelName}`;
        urlPath = urlPath.replace('{deploymentId}', encodeURIComponent(String(requestParameters['deploymentId'])));
        urlPath = urlPath.replace('{tunnelName}', encodeURIComponent(String(requestParameters['tunnelName'])));

        return {
            path: urlPath,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Take a tunnel down
     */
    async deleteDeploymentTunnelRaw(requestParameters: DeleteDeploymentTunnelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const requestOptions = await this.deleteDeploymentTunnelRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Take a tunnel down
     */
    async deleteDeploymentTunnel(requestParameters: DeleteDeploymentTunnelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteDeploymentTunnelRaw(requestParameters, initOverrides);
    }

    /**
     * Creates request options for extendDeployment without sending the request
     */
    async extendDeploymentRequestOpts(requestParameters: ExtendDeploymentRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['deploymentId'] == null) {
            throw new runtime.RequiredError(
                'deploymentId',
                'Required parameter "deploymentId" was null or undefined when calling extendDeployment().'
            );
        }

        if (requestParameters['deploymentLease'] == null) {
            throw new runtime.RequiredError(
                'deploymentLease',
                'Required parameter "deploymentLease" was null or undefined when calling extendDeployment().'
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

        let urlPath = `/v1/deployments/{deploymentId}/extend`;
        urlPath = urlPath.replace('{deploymentId}', encodeURIComponent(String(requestParameters['deploymentId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DeploymentLeaseToJSON(requestParameters['deploymentLease']),
        };
    }

    /**
     * A week from now at most. It does not boot one that is stopped.
     * Move its expiry to ttlSeconds from now
     */
    async extendDeploymentRaw(requestParameters: ExtendDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Deployment>> {
        const requestOptions = await this.extendDeploymentRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeploymentFromJSON(jsonValue));
    }

    /**
     * A week from now at most. It does not boot one that is stopped.
     * Move its expiry to ttlSeconds from now
     */
    async extendDeployment(requestParameters: ExtendDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Deployment> {
        const response = await this.extendDeploymentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getDeployment without sending the request
     */
    async getDeploymentRequestOpts(requestParameters: GetDeploymentRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['deploymentId'] == null) {
            throw new runtime.RequiredError(
                'deploymentId',
                'Required parameter "deploymentId" was null or undefined when calling getDeployment().'
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

        let urlPath = `/v1/deployments/{deploymentId}`;
        urlPath = urlPath.replace('{deploymentId}', encodeURIComponent(String(requestParameters['deploymentId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A deployment
     */
    async getDeploymentRaw(requestParameters: GetDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Deployment>> {
        const requestOptions = await this.getDeploymentRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeploymentFromJSON(jsonValue));
    }

    /**
     * A deployment
     */
    async getDeployment(requestParameters: GetDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Deployment> {
        const response = await this.getDeploymentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for getDeploymentApproval without sending the request
     */
    async getDeploymentApprovalRequestOpts(requestParameters: GetDeploymentApprovalRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['approvalId'] == null) {
            throw new runtime.RequiredError(
                'approvalId',
                'Required parameter "approvalId" was null or undefined when calling getDeploymentApproval().'
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

        let urlPath = `/v1/deployment-approvals/{approvalId}`;
        urlPath = urlPath.replace('{approvalId}', encodeURIComponent(String(requestParameters['approvalId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A deployment asked for, and what was decided
     */
    async getDeploymentApprovalRaw(requestParameters: GetDeploymentApprovalRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeploymentApproval>> {
        const requestOptions = await this.getDeploymentApprovalRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeploymentApprovalFromJSON(jsonValue));
    }

    /**
     * A deployment asked for, and what was decided
     */
    async getDeploymentApproval(requestParameters: GetDeploymentApprovalRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeploymentApproval> {
        const response = await this.getDeploymentApprovalRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listDeploymentApprovals without sending the request
     */
    async listDeploymentApprovalsRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/deployment-approvals`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A person\'s, newest first: those still waiting, and those decided in the last week. A session sees those it asked for. 
     * Deployments the caller\'s sessions asked for, waiting or decided
     */
    async listDeploymentApprovalsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeploymentApprovalList>> {
        const requestOptions = await this.listDeploymentApprovalsRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeploymentApprovalListFromJSON(jsonValue));
    }

    /**
     * A person\'s, newest first: those still waiting, and those decided in the last week. A session sees those it asked for. 
     * Deployments the caller\'s sessions asked for, waiting or decided
     */
    async listDeploymentApprovals(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeploymentApprovalList> {
        const response = await this.listDeploymentApprovalsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listDeploymentTunnels without sending the request
     */
    async listDeploymentTunnelsRequestOpts(requestParameters: ListDeploymentTunnelsRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['deploymentId'] == null) {
            throw new runtime.RequiredError(
                'deploymentId',
                'Required parameter "deploymentId" was null or undefined when calling listDeploymentTunnels().'
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

        let urlPath = `/v1/deployments/{deploymentId}/tunnels`;
        urlPath = urlPath.replace('{deploymentId}', encodeURIComponent(String(requestParameters['deploymentId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Its tunnels
     */
    async listDeploymentTunnelsRaw(requestParameters: ListDeploymentTunnelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TunnelList>> {
        const requestOptions = await this.listDeploymentTunnelsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TunnelListFromJSON(jsonValue));
    }

    /**
     * Its tunnels
     */
    async listDeploymentTunnels(requestParameters: ListDeploymentTunnelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TunnelList> {
        const response = await this.listDeploymentTunnelsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listDeployments without sending the request
     */
    async listDeploymentsRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/deployments`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A person\'s own, whichever of their sessions made them, and every one for an admin. Newest first. 
     * The caller\'s deployments
     */
    async listDeploymentsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeploymentList>> {
        const requestOptions = await this.listDeploymentsRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeploymentListFromJSON(jsonValue));
    }

    /**
     * A person\'s own, whichever of their sessions made them, and every one for an admin. Newest first. 
     * The caller\'s deployments
     */
    async listDeployments(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeploymentList> {
        const response = await this.listDeploymentsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for listOwnTunnels without sending the request
     */
    async listOwnTunnelsRequestOpts(): Promise<runtime.RequestOpts> {
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

        let urlPath = `/v1/tunnels`;

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A person\'s own — their deployments\' and their sessions\' sandboxes\' — and every one for an admin. 
     * Every tunnel of the caller\'s deployments and sessions
     */
    async listOwnTunnelsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TunnelList>> {
        const requestOptions = await this.listOwnTunnelsRequestOpts();
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TunnelListFromJSON(jsonValue));
    }

    /**
     * A person\'s own — their deployments\' and their sessions\' sandboxes\' — and every one for an admin. 
     * Every tunnel of the caller\'s deployments and sessions
     */
    async listOwnTunnels(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TunnelList> {
        const response = await this.listOwnTunnelsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for putDeploymentTunnel without sending the request
     */
    async putDeploymentTunnelRequestOpts(requestParameters: PutDeploymentTunnelRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['deploymentId'] == null) {
            throw new runtime.RequiredError(
                'deploymentId',
                'Required parameter "deploymentId" was null or undefined when calling putDeploymentTunnel().'
            );
        }

        if (requestParameters['tunnelName'] == null) {
            throw new runtime.RequiredError(
                'tunnelName',
                'Required parameter "tunnelName" was null or undefined when calling putDeploymentTunnel().'
            );
        }

        if (requestParameters['tunnelSpec'] == null) {
            throw new runtime.RequiredError(
                'tunnelSpec',
                'Required parameter "tunnelSpec" was null or undefined when calling putDeploymentTunnel().'
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

        let urlPath = `/v1/deployments/{deploymentId}/tunnels/{tunnelName}`;
        urlPath = urlPath.replace('{deploymentId}', encodeURIComponent(String(requestParameters['deploymentId'])));
        urlPath = urlPath.replace('{tunnelName}', encodeURIComponent(String(requestParameters['tunnelName'])));

        return {
            path: urlPath,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: TunnelSpecToJSON(requestParameters['tunnelSpec']),
        };
    }

    /**
     * Reached by the people `access` names, signing in at the tunnel gateway — the deployment\'s owner when it names nobody — and nobody else. 
     * Publish one of its ports at an address
     */
    async putDeploymentTunnelRaw(requestParameters: PutDeploymentTunnelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Tunnel>> {
        const requestOptions = await this.putDeploymentTunnelRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TunnelFromJSON(jsonValue));
    }

    /**
     * Reached by the people `access` names, signing in at the tunnel gateway — the deployment\'s owner when it names nobody — and nobody else. 
     * Publish one of its ports at an address
     */
    async putDeploymentTunnel(requestParameters: PutDeploymentTunnelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Tunnel> {
        const response = await this.putDeploymentTunnelRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for readDeploymentLogs without sending the request
     */
    async readDeploymentLogsRequestOpts(requestParameters: ReadDeploymentLogsRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['deploymentId'] == null) {
            throw new runtime.RequiredError(
                'deploymentId',
                'Required parameter "deploymentId" was null or undefined when calling readDeploymentLogs().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['stream'] != null) {
            queryParameters['stream'] = requestParameters['stream'];
        }

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

        let urlPath = `/v1/deployments/{deploymentId}/logs`;
        urlPath = urlPath.replace('{deploymentId}', encodeURIComponent(String(requestParameters['deploymentId'])));

        return {
            path: urlPath,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * `stdout` and `stderr` are its entrypoint\'s, since it last booted; `console` is what its kernel and init wrote while it booted — what there is when it never came up. `from` is a byte offset, so a reader that dropped resumes where it stopped; with `follow` the body stays open while there is more to come. 
     * What it printed, from a byte offset
     */
    async readDeploymentLogsRaw(requestParameters: ReadDeploymentLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const requestOptions = await this.readDeploymentLogsRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * `stdout` and `stderr` are its entrypoint\'s, since it last booted; `console` is what its kernel and init wrote while it booted — what there is when it never came up. `from` is a byte offset, so a reader that dropped resumes where it stopped; with `follow` the body stays open while there is more to come. 
     * What it printed, from a byte offset
     */
    async readDeploymentLogs(requestParameters: ReadDeploymentLogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.readDeploymentLogsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for refuseDeployment without sending the request
     */
    async refuseDeploymentRequestOpts(requestParameters: RefuseDeploymentRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['approvalId'] == null) {
            throw new runtime.RequiredError(
                'approvalId',
                'Required parameter "approvalId" was null or undefined when calling refuseDeployment().'
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

        let urlPath = `/v1/deployment-approvals/{approvalId}/refuse`;
        urlPath = urlPath.replace('{approvalId}', encodeURIComponent(String(requestParameters['approvalId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Its person\'s alone, as approving is.
     * Refuse the deployment a session asked for
     */
    async refuseDeploymentRaw(requestParameters: RefuseDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeploymentApproval>> {
        const requestOptions = await this.refuseDeploymentRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeploymentApprovalFromJSON(jsonValue));
    }

    /**
     * Its person\'s alone, as approving is.
     * Refuse the deployment a session asked for
     */
    async refuseDeployment(requestParameters: RefuseDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeploymentApproval> {
        const response = await this.refuseDeploymentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for requestDeployment without sending the request
     */
    async requestDeploymentRequestOpts(requestParameters: RequestDeploymentRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['deploymentRequest'] == null) {
            throw new runtime.RequiredError(
                'deploymentRequest',
                'Required parameter "deploymentRequest" was null or undefined when calling requestDeployment().'
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

        let urlPath = `/v1/deployment-approvals`;

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DeploymentRequestToJSON(requestParameters['deploymentRequest']),
        };
    }

    /**
     * How a session gets a deployment that has its person\'s `secrets`: the image it built could send them to any host it reaches, so its person decides, seeing the image, the hosts and the secrets together. They are told in their notices. Nothing is made until they approve, and it is then made as if they had asked, with this session as the one that made it.  What is asked is checked now as `POST …/deployments` checks it, the image and the secrets included; and again when it is approved. 
     * Ask the caller\'s person to make a deployment
     */
    async requestDeploymentRaw(requestParameters: RequestDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeploymentApproval>> {
        const requestOptions = await this.requestDeploymentRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeploymentApprovalFromJSON(jsonValue));
    }

    /**
     * How a session gets a deployment that has its person\'s `secrets`: the image it built could send them to any host it reaches, so its person decides, seeing the image, the hosts and the secrets together. They are told in their notices. Nothing is made until they approve, and it is then made as if they had asked, with this session as the one that made it.  What is asked is checked now as `POST …/deployments` checks it, the image and the secrets included; and again when it is approved. 
     * Ask the caller\'s person to make a deployment
     */
    async requestDeployment(requestParameters: RequestDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeploymentApproval> {
        const response = await this.requestDeploymentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for runDeploymentCommand without sending the request
     */
    async runDeploymentCommandRequestOpts(requestParameters: RunDeploymentCommandRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['deploymentId'] == null) {
            throw new runtime.RequiredError(
                'deploymentId',
                'Required parameter "deploymentId" was null or undefined when calling runDeploymentCommand().'
            );
        }

        if (requestParameters['deploymentCommand'] == null) {
            throw new runtime.RequiredError(
                'deploymentCommand',
                'Required parameter "deploymentCommand" was null or undefined when calling runDeploymentCommand().'
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

        let urlPath = `/v1/deployments/{deploymentId}/commands`;
        urlPath = urlPath.replace('{deploymentId}', encodeURIComponent(String(requestParameters['deploymentId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DeploymentCommandToJSON(requestParameters['deploymentCommand']),
        };
    }

    /**
     * A sealed one is `409`: unseal it first. The first command taints it for good, and says who ran it. 
     * Run a command in an unsealed deployment, and wait for it
     */
    async runDeploymentCommandRaw(requestParameters: RunDeploymentCommandRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DeploymentCommandResult>> {
        const requestOptions = await this.runDeploymentCommandRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeploymentCommandResultFromJSON(jsonValue));
    }

    /**
     * A sealed one is `409`: unseal it first. The first command taints it for good, and says who ran it. 
     * Run a command in an unsealed deployment, and wait for it
     */
    async runDeploymentCommand(requestParameters: RunDeploymentCommandRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DeploymentCommandResult> {
        const response = await this.runDeploymentCommandRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for sealDeployment without sending the request
     */
    async sealDeploymentRequestOpts(requestParameters: SealDeploymentRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['deploymentId'] == null) {
            throw new runtime.RequiredError(
                'deploymentId',
                'Required parameter "deploymentId" was null or undefined when calling sealDeployment().'
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

        let urlPath = `/v1/deployments/{deploymentId}/seal`;
        urlPath = urlPath.replace('{deploymentId}', encodeURIComponent(String(requestParameters['deploymentId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * A terminal open on it is hung up. What runs in it goes on, and a taint stays. 
     * Refuse commands and terminals in it from now on
     */
    async sealDeploymentRaw(requestParameters: SealDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Deployment>> {
        const requestOptions = await this.sealDeploymentRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeploymentFromJSON(jsonValue));
    }

    /**
     * A terminal open on it is hung up. What runs in it goes on, and a taint stays. 
     * Refuse commands and terminals in it from now on
     */
    async sealDeployment(requestParameters: SealDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Deployment> {
        const response = await this.sealDeploymentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for startDeployment without sending the request
     */
    async startDeploymentRequestOpts(requestParameters: StartDeploymentRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['deploymentId'] == null) {
            throw new runtime.RequiredError(
                'deploymentId',
                'Required parameter "deploymentId" was null or undefined when calling startDeployment().'
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

        let urlPath = `/v1/deployments/{deploymentId}/start`;
        urlPath = urlPath.replace('{deploymentId}', encodeURIComponent(String(requestParameters['deploymentId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DeploymentLeaseToJSON(requestParameters['deploymentLease']),
        };
    }

    /**
     * On the disk it had, until `ttlSeconds` from now — a day unless it says otherwise. Starting one that runs only moves its expiry. 
     * Boot a stopped or expired deployment again
     */
    async startDeploymentRaw(requestParameters: StartDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Deployment>> {
        const requestOptions = await this.startDeploymentRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeploymentFromJSON(jsonValue));
    }

    /**
     * On the disk it had, until `ttlSeconds` from now — a day unless it says otherwise. Starting one that runs only moves its expiry. 
     * Boot a stopped or expired deployment again
     */
    async startDeployment(requestParameters: StartDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Deployment> {
        const response = await this.startDeploymentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for stopDeployment without sending the request
     */
    async stopDeploymentRequestOpts(requestParameters: StopDeploymentRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['deploymentId'] == null) {
            throw new runtime.RequiredError(
                'deploymentId',
                'Required parameter "deploymentId" was null or undefined when calling stopDeployment().'
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

        let urlPath = `/v1/deployments/{deploymentId}/stop`;
        urlPath = urlPath.replace('{deploymentId}', encodeURIComponent(String(requestParameters['deploymentId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * Switch it off, its disk kept
     */
    async stopDeploymentRaw(requestParameters: StopDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Deployment>> {
        const requestOptions = await this.stopDeploymentRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeploymentFromJSON(jsonValue));
    }

    /**
     * Switch it off, its disk kept
     */
    async stopDeployment(requestParameters: StopDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Deployment> {
        const response = await this.stopDeploymentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Creates request options for unsealDeployment without sending the request
     */
    async unsealDeploymentRequestOpts(requestParameters: UnsealDeploymentRequest): Promise<runtime.RequestOpts> {
        if (requestParameters['deploymentId'] == null) {
            throw new runtime.RequiredError(
                'deploymentId',
                'Required parameter "deploymentId" was null or undefined when calling unsealDeployment().'
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

        let urlPath = `/v1/deployments/{deploymentId}/unseal`;
        urlPath = urlPath.replace('{deploymentId}', encodeURIComponent(String(requestParameters['deploymentId'])));

        return {
            path: urlPath,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        };
    }

    /**
     * For debugging one that does not do what its recipe says. Nothing has run yet: the first command or terminal after it makes the deployment `tainted` for good — whoever runs it, a session or a person — and sealing it again does not take that away. 
     * Let commands and a terminal into it
     */
    async unsealDeploymentRaw(requestParameters: UnsealDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Deployment>> {
        const requestOptions = await this.unsealDeploymentRequestOpts(requestParameters);
        const response = await this.request(requestOptions, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DeploymentFromJSON(jsonValue));
    }

    /**
     * For debugging one that does not do what its recipe says. Nothing has run yet: the first command or terminal after it makes the deployment `tainted` for good — whoever runs it, a session or a person — and sealing it again does not take that away. 
     * Let commands and a terminal into it
     */
    async unsealDeployment(requestParameters: UnsealDeploymentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Deployment> {
        const response = await this.unsealDeploymentRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const ReadDeploymentLogsStreamEnum = {
    Stdout: 'stdout',
    Stderr: 'stderr',
    Console: 'console',
} as const;
export type ReadDeploymentLogsStreamEnum = typeof ReadDeploymentLogsStreamEnum[keyof typeof ReadDeploymentLogsStreamEnum];
