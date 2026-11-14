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

export const BASE_PATH: string = "http://127.0.0.1:8140".replace(/\/+$/, "");

export interface ConfigurationParameters {
    basePath?: string; // override base path
    fetchApi?: FetchAPI; // override for fetch implementation
    middleware?: Middleware[]; // middleware to apply before/after fetch requests
    queryParamsStringify?: (params: HTTPQuery) => string; // stringify function for query strings
    username?: string; // parameter for basic security
    password?: string; // parameter for basic security
    apiKey?: string | Promise<string> | ((name: string) => string | Promise<string>); // parameter for apiKey security
    accessToken?: string | Promise<string> | ((name?: string, scopes?: string[]) => string | Promise<string>); // parameter for oauth2 security
    headers?: HTTPHeaders; //header params we want to use on every request
    credentials?: RequestCredentials; //value for the credentials param we want to use on each request
}

export class Configuration {
    constructor(private configuration: ConfigurationParameters = {}) {}

    set config(configuration: Configuration) {
        this.configuration = configuration;
    }

    get basePath(): string {
        return this.configuration.basePath != null ? this.configuration.basePath : BASE_PATH;
    }

    get fetchApi(): FetchAPI | undefined {
        return this.configuration.fetchApi;
    }

    get middleware(): Middleware[] {
        return this.configuration.middleware || [];
    }

    get queryParamsStringify(): (params: HTTPQuery) => string {
        return this.configuration.queryParamsStringify || querystring;
    }

    get username(): string | undefined {
        return this.configuration.username;
    }

    get password(): string | undefined {
        return this.configuration.password;
    }

    get apiKey(): ((name: string) => string | Promise<string>) | undefined {
        const apiKey = this.configuration.apiKey;
        if (apiKey) {
            return typeof apiKey === 'function' ? apiKey : () => apiKey;
        }
        return undefined;
    }

    get accessToken(): ((name?: string, scopes?: string[]) => string | Promise<string>) | undefined {
        const accessToken = this.configuration.accessToken;
        if (accessToken) {
            return typeof accessToken === 'function' ? accessToken : async () => accessToken;
        }
        return undefined;
    }

    get headers(): HTTPHeaders | undefined {
        return this.configuration.headers;
    }

    get credentials(): RequestCredentials | undefined {
        return this.configuration.credentials;
    }
}

export const DefaultConfig: Configuration = new Configuration();

/**
 * This is the base class for all generated API classes.
 */
export class BaseAPI {

    private static readonly jsonRegex = /^(:?application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(:?;.*)?$/i;
    private middleware: Middleware[];

    constructor(protected configuration: Configuration = DefaultConfig) {
        this.middleware = configuration.middleware;
    }

    withMiddleware<T extends BaseAPI>(this: T, ...middlewares: Middleware[]): T {
        const next = this.clone<T>();
        next.middleware = next.middleware.concat(...middlewares);
        return next;
    }

    withPreMiddleware<T extends BaseAPI>(this: T, ...preMiddlewares: Array<Middleware['pre']>): T {
        const middlewares = preMiddlewares.map((pre) => ({ pre }));
        return this.withMiddleware<T>(...middlewares);
    }

    withPostMiddleware<T extends BaseAPI>(this: T, ...postMiddlewares: Array<Middleware['post']>): T {
        const middlewares = postMiddlewares.map((post) => ({ post }));
        return this.withMiddleware<T>(...middlewares);
    }

    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param mime - MIME (Multipurpose Internet Mail Extensions)
     * @return True if the given MIME is JSON, false otherwise.
     */
    protected isJsonMime(mime: string | null | undefined): boolean {
        if (!mime) {
            return false;
        }
        return BaseAPI.jsonRegex.test(mime);
    }

    protected async request(context: RequestOpts, initOverrides?: RequestInit | InitOverrideFunction): Promise<Response> {
        const { url, init } = await this.createFetchParams(context, initOverrides);
        const response = await this.fetchApi(url, init);
        if (response && (response.status >= 200 && response.status < 300)) {
            return response;
        }
        throw new ResponseError(response, 'Response returned an error code');
    }

    private async createFetchParams(context: RequestOpts, initOverrides?: RequestInit | InitOverrideFunction) {
        let url = this.configuration.basePath + context.path;
        if (context.query !== undefined && Object.keys(context.query).length !== 0) {
            // only add the querystring to the URL if there are query parameters.
            // this is done to avoid urls ending with a "?" character which buggy webservers
            // do not handle correctly sometimes.
            url += '?' + this.configuration.queryParamsStringify(context.query);
        }

        const headers = Object.assign({}, this.configuration.headers, context.headers);
        Object.keys(headers).forEach(key => headers[key] === undefined ? delete headers[key] : {});

        const initOverrideFn =
            typeof initOverrides === "function"
                ? initOverrides
                : async () => initOverrides;

        const initParams = {
            method: context.method,
            headers,
            body: context.body,
            credentials: this.configuration.credentials,
        };

        const overriddenInit: RequestInit = {
            ...initParams,
            ...(await initOverrideFn({
                init: initParams,
                context,
            }))
        };

        let body: any;
        if (isFormData(overriddenInit.body)
            || (overriddenInit.body instanceof URLSearchParams)
            || isBlob(overriddenInit.body)) {
          body = overriddenInit.body;
        } else if (this.isJsonMime(headers['Content-Type'])) {
          body = JSON.stringify(overriddenInit.body);
        } else {
          body = overriddenInit.body;
        }

        const init: RequestInit = {
            ...overriddenInit,
            body
        };

        return { url, init };
    }

    private fetchApi = async (url: string, init: RequestInit) => {
        let fetchParams = { url, init };
        for (const middleware of this.middleware) {
            if (middleware.pre) {
                fetchParams = await middleware.pre({
                    fetch: this.fetchApi,
                    ...fetchParams,
                }) || fetchParams;
            }
        }
        let response: Response | undefined = undefined;
        try {
            response = await (this.configuration.fetchApi || fetch)(fetchParams.url, fetchParams.init);
        } catch (e) {
            for (const middleware of this.middleware) {
                if (middleware.onError) {
                    response = await middleware.onError({
                        fetch: this.fetchApi,
                        url: fetchParams.url,
                        init: fetchParams.init,
                        error: e,
                        response: response ? response.clone() : undefined,
                    }) || response;
                }
            }
            if (response === undefined) {
              if (e instanceof Error) {
                throw new FetchError(e, 'The request failed and the interceptors did not return an alternative response');
              } else {
                throw e;
              }
            }
        }
        for (const middleware of this.middleware) {
            if (middleware.post) {
                response = await middleware.post({
                    fetch: this.fetchApi,
                    url: fetchParams.url,
                    init: fetchParams.init,
                    response: response.clone(),
                }) || response;
            }
        }
        return response;
    }

    /**
     * Create a shallow clone of `this` by constructing a new instance
     * and then shallow cloning data members.
     */
    private clone<T extends BaseAPI>(this: T): T {
        const constructor = this.constructor as any;
        const next = new constructor(this.configuration);
        next.middleware = this.middleware.slice();
        return next;
    }
};

function isBlob(value: any): value is Blob {
    return typeof Blob !== 'undefined' && value instanceof Blob;
}

function isFormData(value: any): value is FormData {
    return typeof FormData !== "undefined" && value instanceof FormData;
}

export class ResponseError extends Error {
    override name: "ResponseError" = "ResponseError";
    constructor(public response: Response, msg?: string) {
        super(msg);

        // restore prototype chain
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        }
    }
}

export class FetchError extends Error {
    override name: "FetchError" = "FetchError";
    constructor(public cause: Error, msg?: string) {
        super(msg);

        // restore prototype chain
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        }
    }
}

export class RequiredError extends Error {
    override name: "RequiredError" = "RequiredError";
    constructor(public field: string, msg?: string) {
        super(msg);

        // restore prototype chain
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        }
    }
}

export const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};

export type FetchAPI = WindowOrWorkerGlobalScope['fetch'];

export type Json = any;
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
export type HTTPHeaders = { [key: string]: string };
export type HTTPQuery = { [key: string]: string | number | null | boolean | Array<string | number | null | boolean> | Set<string | number | null | boolean> | HTTPQuery };
export type HTTPBody = Json | FormData | URLSearchParams;
export type HTTPRequestInit = { headers?: HTTPHeaders; method: HTTPMethod; credentials?: RequestCredentials; body?: HTTPBody };
export type ModelPropertyNaming = 'camelCase' | 'snake_case' | 'PascalCase' | 'original';

export type InitOverrideFunction = (requestContext: { init: HTTPRequestInit, context: RequestOpts }) => Promise<RequestInit>

export interface FetchParams {
    url: string;
    init: RequestInit;
}

export interface RequestOpts {
    path: string;
    method: HTTPMethod;
    headers: HTTPHeaders;
    query?: HTTPQuery;
    body?: HTTPBody;
}

export function querystring(params: HTTPQuery, prefix: string = ''): string {
    return Object.keys(params)
        .map(key => querystringSingleKey(key, params[key], prefix))
        .filter(part => part.length > 0)
        .join('&');
}

function querystringSingleKey(key: string, value: string | number | null | undefined | boolean | Array<string | number | null | boolean> | Set<string | number | null | boolean> | HTTPQuery, keyPrefix: string = ''): string {
    const fullKey = keyPrefix + (keyPrefix.length ? `[${key}]` : key);
    if (value instanceof Array) {
        const multiValue = value.map(singleValue => encodeURIComponent(String(singleValue)))
            .join(`&${encodeURIComponent(fullKey)}=`);
        return `${encodeURIComponent(fullKey)}=${multiValue}`;
    }
    if (value instanceof Set) {
        const valueAsArray = Array.from(value);
        return querystringSingleKey(key, valueAsArray, keyPrefix);
    }
    if (value instanceof Date) {
        return `${encodeURIComponent(fullKey)}=${encodeURIComponent(serializeDateTime(value))}`;
    }
    if (value instanceof Object) {
        return querystring(value as HTTPQuery, fullKey);
    }
    return `${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`;
}

export function exists(json: any, key: string): boolean {
    const value = json[key];
    return value !== null && value !== undefined;
}

/**
 * Every generated date call site routes through these.
 *
 * `format: date` is a calendar date, with no time and no offset, so it is converted
 * against the local calendar on both ends: they have to agree or the date shifts by
 * a day. `format: date-time` is an instant and uses UTC.
 */
export function serializeDateTime(value: Date): string {
    return value.toISOString();
}

export function serializeDate(value: Date): string {
    if (isNaN(value.getTime())) {
        throw new RangeError('Invalid time value');
    }
    const year = ('000' + value.getFullYear()).slice(-4);
    const month = ('0' + (value.getMonth() + 1)).slice(-2);
    const day = ('0' + value.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}


export function parseDate(value: Date | string): Date {
    if (value instanceof Date) {
        return value;
    }
    // `new Date("2026-08-05")` would parse as UTC midnight: a different day west of UTC.
    // Local midnight is the stated day everywhere. setFullYear avoids the 1900 offset the
    // multi-argument constructor applies to years 0-99.
    const fullDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
    if (fullDate) {
        const year = Number(fullDate[1]);
        const month = Number(fullDate[2]) - 1;
        const day = Number(fullDate[3]);
        const date = new Date(0);
        date.setFullYear(year, month, day);
        date.setHours(0, 0, 0, 0);
        // Out-of-range components (or a day the local zone skipped) silently roll over,
        // which would hand back a date the server never sent.
        if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
            return new Date(NaN);
        }
        return date;
    }
    return new Date(value);
}

export function parseDateTime(value: any): Date {
    return new Date(value);
}

export function mapValues(data: any, fn: (item: any) => any): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    for (const key of Object.keys(data)) {
        result[key] = fn(data[key]);
    }
    return result;
}

// Pass-through serializer for `any`-typed properties in form data. See #1877.
export function anyToJSON(value: any): any {
    return value;
}

export function canConsumeForm(consumes: Consume[]): boolean {
    for (const consume of consumes) {
        if (consume.contentType?.startsWith('multipart/form-data') == true) {
            return true;
        }
    }
    return false;
}

export interface Consume {
    contentType: string;
}

export interface RequestContext {
    fetch: FetchAPI;
    url: string;
    init: RequestInit;
}

export interface ResponseContext {
    fetch: FetchAPI;
    url: string;
    init: RequestInit;
    response: Response;
}

export interface ErrorContext {
    fetch: FetchAPI;
    url: string;
    init: RequestInit;
    error: unknown;
    response?: Response;
}

export interface Middleware {
    pre?(context: RequestContext): Promise<FetchParams | void>;
    post?(context: ResponseContext): Promise<Response | void>;
    onError?(context: ErrorContext): Promise<Response | void>;
}

export interface ApiResponse<T> {
    raw: Response;
    value(): Promise<T>;
}

export interface ResponseTransformer<T> {
    (json: any): T;
}

export class JSONApiResponse<T> {
    constructor(public raw: Response, private transformer: ResponseTransformer<T> = (jsonValue: any) => jsonValue) {}

    async value(): Promise<T> {
        return this.transformer(await this.raw.json());
    }
}

export class VoidApiResponse {
    constructor(public raw: Response) {}

    async value(): Promise<void> {
        return undefined;
    }
}

/**
 * A Blob carrying the file name the server advertised, empty when it did not send one. It is a File
 * wherever one can be built, and the bare Blob given a name otherwise. Same name and shape as the
 * `typescript` generator's browser HttpFile.
 */
export type HttpFile = Blob & { readonly name: string };

export class BlobApiResponse {
    constructor(public raw: Response) {}

    /**
     * The body named after the Content-Disposition header, so that a download keeps the name the
     * server gave it. A File is built from a native Blob; the Blob itself is named where there is no
     * global File (Node.js before 20), where File cannot be constructed, or where the Blob is not the
     * native one, as returned by an injected fetch implementation such as node-fetch, which a File
     * would stringify instead of wrapping.
     */
    async value(): Promise<HttpFile> {
        const blob = await this.raw.blob();
        const name = parseContentDispositionFilename(this.raw.headers) ?? '';
        if (typeof File !== 'undefined' && blob instanceof Blob) {
            try {
                return new File([blob], name, { type: blob.type });
            } catch {
                // File cannot be constructed: name the Blob itself
            }
        }
        return Object.assign(blob, { name });
    };
}

/**
 * The file name advertised by a Content-Disposition header (RFC 6266): the RFC 5987 encoded
 * `filename*` parameter first, falling back to the plain `filename` when it is malformed, not UTF-8
 * or has no usable name. Any directory part is dropped; undefined when no usable name is advertised.
 */
export function parseContentDispositionFilename(headers: Headers): string | undefined {
    const params = parseHeaderParameters(headers.get('Content-Disposition') ?? '');
    return basename(decodeExtValue(params.get('filename*'))) ?? basename(params.get('filename'));
}

/** The decoded RFC 5987 ext-value, or undefined when it is not UTF-8 or its percent-encoding is malformed. */
function decodeExtValue(value: string | undefined): string | undefined {
    const match = value === undefined ? null : /^utf-8'[^']*'(.*)$/i.exec(value);
    try {
        return match ? decodeURIComponent(match[1]) : undefined;
    } catch {
        return undefined;
    }
}

/**
 * The `name=value` parameters of a header value, consumed one at a time so that a quoted-string is
 * taken whole, `;` included. Names are lower-cased, quoted-string values are unquoted with their
 * backslash escapes resolved, and the first occurrence of a name wins.
 */
function parseHeaderParameters(value: string): Map<string, string> {
    const params = new Map<string, string>();
    const parameter = /(?:^|;)\s*([^=;]+?)\s*=\s*(?:"((?:[^"\\]|\\.)*)"?|([^;]*))/g;
    let match: RegExpExecArray | null;
    while ((match = parameter.exec(value)) !== null) {
        const name = match[1].toLowerCase();
        if (!params.has(name)) {
            params.set(name, match[2] !== undefined ? match[2].replace(/\\(.)/g, '$1') : match[3].trim());
        }
    }
    return params;
}

/** The last `/` or `\` separated segment of a file name, or undefined when it is not a file name. */
function basename(name: string | undefined): string | undefined {
    const base = name?.split(/[\\/]/).pop();
    return !base || base === '.' || base === '..' ? undefined : base;
}

export class TextApiResponse {
    constructor(public raw: Response) {}

    async value(): Promise<string> {
        return await this.raw.text();
    };
}
