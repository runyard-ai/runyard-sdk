// The API's two streams of JSON lines — a session's transcript and the
// changes to the account's sessions — read as the server writes them. The
// generated streamEvents and streamChanges read the whole body as one JSON
// value, which a followed stream never finishes and which is not one value
// anyway; their *Raw twins hand back the Response unread, and this reads it.

import { EventsApi } from './apis/index.js';
import type { StreamChangesRequest, StreamEventsRequest } from './apis/index.js';
import type { ApiResponse, Configuration, InitOverrideFunction } from './runtime.js';
import { ChangeFromJSON, EventsLineFromJSON } from './models/index.js';
import type { Change, EventsLine } from './models/index.js';
import { APIError, apiError } from './errors.js';

/**
 * A line of a stream that is not what the stream carries: not JSON, not an
 * object, or an events line of no kind this SDK knows. The stream is closed
 * by it.
 */
export class LineError extends Error {
  override name = 'LineError';
  /** The line, as it was read. */
  readonly line: string;

  constructor(line: string, message: string, options?: { cause?: unknown }) {
    super(`runyard-agents: a line of the stream: ${message}`, options);
    this.line = line;
  }
}

/**
 * One of the API's streams of JSON lines, as an async iterator: each line as
 * it arrives, decoded. Followed, it stays open until it is closed, its
 * request's signal is aborted or the server ends it. Blank lines, which the
 * server writes to keep a quiet stream open through proxies, are skipped.
 *
 * Breaking out of a `for await` loop over it closes it. A line it cannot
 * decode rejects next() with a LineError and closes it, since a loop that
 * threw does not.
 */
export class Stream<T> implements AsyncIterableIterator<T, undefined, undefined> {
  /** The answer the stream is the body of; its body is the stream's to read. */
  readonly response: Response;

  private readonly reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  private readonly decoder = new TextDecoder();
  private buffer = '';
  private start = 0;
  private ended = false;
  private closed = false;
  // next() is called again before its last call has settled by anyone who
  // does not await it, and two reads at once would take each other's bytes.
  private queue: Promise<unknown> = Promise.resolve();

  constructor(response: Response, private readonly decode: (json: Record<string, unknown>) => T) {
    this.response = response;
    this.reader = response.body?.getReader();
    if (this.reader === undefined) {
      this.ended = true;
    }
  }

  [Symbol.asyncIterator](): this {
    return this;
  }

  /** The next line, waited for; done at the stream's end. */
  next(): Promise<IteratorResult<T, undefined>> {
    const result = this.queue.then(() => this.read());
    this.queue = result.catch(() => undefined);
    return result;
  }

  /** Closes the stream: what `for await` calls when the loop is left early. */
  async return(): Promise<IteratorResult<T, undefined>> {
    await this.close();
    return { done: true, value: undefined };
  }

  /** Ends the stream, cancelling its body. Closing it again does nothing. */
  async close(): Promise<void> {
    if (this.closed) {
      return;
    }
    this.closed = true;
    this.buffer = '';
    this.start = 0;
    // A body that already failed rejects its cancel with that failure, which
    // whoever read it was told already.
    await this.reader?.cancel().catch(() => undefined);
  }

  private async read(): Promise<IteratorResult<T, undefined>> {
    for (;;) {
      if (this.closed) {
        return { done: true, value: undefined };
      }
      const newline = this.buffer.indexOf('\n', this.start);
      if (newline >= 0) {
        const line = this.buffer.slice(this.start, newline).trim();
        this.start = newline + 1;
        if (line !== '') {
          return { done: false, value: await this.line(line) };
        }
        continue;
      }
      if (this.ended) {
        const line = this.buffer.slice(this.start).trim();
        this.buffer = '';
        this.start = 0;
        if (line !== '') {
          return { done: false, value: await this.line(line) };
        }
        await this.close();
        return { done: true, value: undefined };
      }
      // A body of none is ended from the start, so there is a reader here.
      const reader = this.reader as ReadableStreamDefaultReader<Uint8Array>;
      let chunk: ReadableStreamReadResult<Uint8Array>;
      try {
        chunk = await reader.read();
      } catch (err) {
        await this.close();
        throw err;
      }
      // The rest of the buffer is kept and what was taken of it dropped, so
      // a body of many lines in one chunk is not copied once per line.
      this.buffer = this.buffer.slice(this.start);
      this.start = 0;
      if (chunk.done) {
        this.buffer += this.decoder.decode();
        this.ended = true;
      } else {
        // stream: true holds back the first bytes of a character a chunk
        // ends inside of, for the next chunk to finish.
        this.buffer += this.decoder.decode(chunk.value, { stream: true });
      }
    }
  }

  private async line(line: string): Promise<T> {
    try {
      let json: unknown;
      try {
        json = JSON.parse(line);
      } catch (err) {
        throw new LineError(line, err instanceof Error ? err.message : String(err), { cause: err });
      }
      if (!isObject(json)) {
        throw new LineError(line, 'not a JSON object');
      }
      return this.decode(json);
    } catch (err) {
      await this.close();
      if (err instanceof LineError) {
        throw err;
      }
      throw new LineError(line, err instanceof Error ? err.message : String(err), { cause: err });
    }
  }
}

type Kind = EventsLine['line'];

// What each kind's line must hold for its FromJSON to make one of it: the
// generated decoders check nothing, and would make a line that says it is an
// event, and has no seq, an event with none.
const shapes: Record<Kind, (json: Record<string, unknown>) => boolean> = {
  event: (json) =>
    isInteger(json['seq']) &&
    typeof json['at'] === 'string' &&
    !Number.isNaN(Date.parse(json['at'])) &&
    isObject(json['event']),
  partial: (json) => {
    const p = json['partial'];
    return (
      isObject(p) &&
      isInteger(p['seq']) &&
      isInteger(p['offset']) &&
      typeof p['kind'] === 'string' &&
      typeof p['text'] === 'string'
    );
  },
  caughtUp: (json) => isObject(json['caughtUp']) && isInteger(json['caughtUp']['seq']),
};

function isKind(v: unknown): v is Kind {
  return typeof v === 'string' && Object.prototype.hasOwnProperty.call(shapes, v);
}

/**
 * A line of a session's events stream as the kind its `line` says it is: a
 * SessionEvent (`event`), a PartialLine (`partial`) or a CaughtUpLine
 * (`caughtUp`), decoded by the generated EventsLineFromJSON. A line of a
 * kind this SDK does not know, or not in its kind's shape, is a LineError:
 * the generated decoder hands an unknown kind back as it was.
 */
export function eventsLineValue(json: unknown): EventsLine {
  if (!isObject(json)) {
    throw new LineError(JSON.stringify(json) ?? String(json), 'not a JSON object');
  }
  let kind: unknown = json['line'];
  if (!Object.prototype.hasOwnProperty.call(json, 'line')) {
    // A server of v0.37.0 or earlier writes no `line`: its lines are told
    // apart by the field only their kind has, partial first, so a field the
    // API adds to one later does not make it another.
    kind = ['partial', 'caughtUp', 'event'].find((k) => Object.prototype.hasOwnProperty.call(json, k));
    json = { ...json, line: kind };
  }
  const line = json as Record<string, unknown>;
  if (!isKind(kind)) {
    throw new LineError(JSON.stringify(line), 'an events line of no kind this SDK knows');
  }
  if (!shapes[kind](line)) {
    throw new LineError(JSON.stringify(line), `an events line not in the shape of its kind, ${kind}`);
  }
  return EventsLineFromJSON(line);
}

/**
 * A session's transcript as a stream (streamEvents): its events from
 * `request.from` on and, with `request.follow`, every new one as it happens,
 * with the partials and the one CaughtUpLine following brings. It is
 * requested with configuration as every generated call is — its base path,
 * fetch, middleware and key — and `init` is the generated calls' too: its
 * `signal` aborts the stream. An answer other than a 200 is an APIError; a
 * 409 `gapped` says what was asked for is no longer kept.
 */
export function readEvents(
  configuration: Configuration,
  request: StreamEventsRequest,
  init?: RequestInit | InitOverrideFunction,
): Promise<Stream<EventsLine>> {
  return open(new EventsApi(configuration).streamEventsRaw(request, init), eventsLineValue);
}

/**
 * Every change to the account's sessions as a stream (streamChanges), from
 * `request.from` on and, with `request.follow`, as they happen. As
 * readEvents, of configuration and init.
 */
export function readChanges(
  configuration: Configuration,
  request: StreamChangesRequest = {},
  init?: RequestInit | InitOverrideFunction,
): Promise<Stream<Change>> {
  return open(new EventsApi(configuration).streamChangesRaw(request, init), ChangeFromJSON);
}

async function open<T>(
  answer: Promise<ApiResponse<unknown>>,
  decode: (json: Record<string, unknown>) => T,
): Promise<Stream<T>> {
  let response: Response;
  try {
    response = (await answer).raw;
  } catch (err) {
    throw (await apiError(err)) ?? err;
  }
  // A 2xx other than 200 is a success to the generated client, and not a
  // stream: the server answers a stream with 200 and nothing else.
  if (response.status !== 200) {
    throw new APIError(response, await response.text());
  }
  return new Stream(response, decode);
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isInteger(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v);
}
