// What the generated client cannot say on its own: which of the server's
// errors an answer was. A generated call throws a ResponseError holding the
// Response with its body unread, so the code is a read away; apiError is
// that read.

import { ResponseError } from './runtime.js';
import type { ErrorCode } from './models/index.js';

/**
 * An answer other than a success: its status, its body, and the error the
 * server said, when the body is one of its errors (`{"error":{"code","message"}}`).
 * It is a ResponseError, so code written against the generated client's
 * errors catches it too.
 */
export class APIError extends ResponseError {
  /** The answer's HTTP status. */
  readonly status: number;
  /**
   * The error's code; undefined when the body is not one of the server's
   * errors, as a proxy's answer is not.
   */
  readonly code: ErrorCode | undefined;
  /** The error's message, for a person reading a log. */
  readonly errorMessage: string | undefined;
  /** The answer's body, as it was read. */
  readonly body: string;

  constructor(response: Response, body: string) {
    const parsed = parse(body);
    const status = `${response.status} ${response.statusText}`.trim();
    super(
      response,
      parsed === undefined
        ? `runyard-agents: ${status}`
        : `runyard-agents: ${response.status} ${parsed.code}${parsed.message === undefined ? '' : `: ${parsed.message}`}`,
    );
    this.status = response.status;
    this.code = parsed?.code;
    this.errorMessage = parsed?.message;
    this.body = body;
  }
}

function parse(body: string): { code: ErrorCode; message: string | undefined } | undefined {
  let json: unknown;
  try {
    json = JSON.parse(body);
  } catch {
    return undefined;
  }
  if (!isObject(json) || !isObject(json['error'])) {
    return undefined;
  }
  const { code, message } = json['error'];
  // An empty code is no code: it is what Go's SDK reads from `{}` too, and
  // a caller comparing codes must not match a body that named none.
  if (typeof code !== 'string' || code === '') {
    return undefined;
  }
  return { code: code as ErrorCode, message: typeof message === 'string' ? message : undefined };
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

// A Response's body can be read once, so the second look at the same error
// is the first one's answer rather than a TypeError.
const read = new WeakMap<ResponseError, Promise<APIError>>();

/**
 * The APIError that err is: err itself when it is one, the answer of a
 * ResponseError a generated call threw, read, and undefined for anything else
 * (a network failure, a missing parameter). A body something else already
 * read is not there to parse: the APIError then has its status and no code.
 */
export async function apiError(err: unknown): Promise<APIError | undefined> {
  if (err instanceof APIError) {
    return err;
  }
  if (!(err instanceof ResponseError)) {
    return undefined;
  }
  let pending = read.get(err);
  if (pending === undefined) {
    pending = readError(err.response);
    read.set(err, pending);
  }
  return pending;
}

/** The server's code for err, as apiError reads it: undefined when it said none. */
export async function errorCode(err: unknown): Promise<ErrorCode | undefined> {
  return (await apiError(err))?.code;
}

async function readError(response: Response): Promise<APIError> {
  const body = response.bodyUsed ? '' : await response.text();
  return new APIError(response, body);
}
