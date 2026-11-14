// A server on a port of this machine that answers as a test says, for the
// errors and streams tests: what the SDK reads is then what a real fetch
// reads off a real socket.

import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { TestContext } from 'node:test';

/** An exchange the stub was asked: the request, and the answer to write. */
export interface Exchange {
  req: IncomingMessage;
  res: ServerResponse;
  /** Settles once the connection is gone: the answer ended, or the client hung up. */
  closed: Promise<void>;
}

/** A promise and what settles it, for a test to wait on what happens. */
export interface Deferred<T> {
  promise: Promise<T>;
  resolve(value: T): void;
}

export function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

/**
 * Starts a server, closed when the test ends, that hands each request to
 * handle. It answers whatever handle does not end with nothing more, so a
 * test that stops reading is what ends a followed stream, as it is in use.
 */
export async function serve(
  t: TestContext,
  handle: (exchange: Exchange) => void,
): Promise<{ url: string; exchanges: Exchange[] }> {
  const exchanges: Exchange[] = [];
  const server = createServer((req, res) => {
    const closed = deferred<void>();
    res.on('close', () => closed.resolve());
    const exchange = { req, res, closed: closed.promise };
    exchanges.push(exchange);
    handle(exchange);
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
  const { port } = server.address() as AddressInfo;
  return { url: `http://127.0.0.1:${port}`, exchanges };
}

/**
 * A server whose every request is handed to the test, to answer as it goes:
 * next() is the next request, waited for.
 */
export async function serveByHand(t: TestContext): Promise<{ url: string; next(): Promise<Exchange> }> {
  const waiting: Deferred<Exchange>[] = [];
  const arrived: Exchange[] = [];
  const { url } = await serve(t, (exchange) => {
    const waiter = waiting.shift();
    if (waiter === undefined) {
      arrived.push(exchange);
    } else {
      waiter.resolve(exchange);
    }
  });
  return {
    url,
    next() {
      const exchange = arrived.shift();
      if (exchange !== undefined) {
        return Promise.resolve(exchange);
      }
      const waiter = deferred<Exchange>();
      waiting.push(waiter);
      return waiter.promise;
    },
  };
}

/** Writes a JSON body with status. */
export function answer(res: ServerResponse, status: number, body: string, type = 'application/json'): void {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

/** Starts a stream's answer: 200, NDJSON, chunked, nothing written yet. */
export function startStream(res: ServerResponse): void {
  res.writeHead(200, { 'Content-Type': 'application/x-ndjson' });
  res.flushHeaders();
}
