# Examples: a chat in your web app

A web page with a chat box, served by your backend. The same page is served by
a Node backend or a Go backend; pick one.

![The example's chat page](screenshot.png)

```
web/    the page: React, with @runyard-ai/runyard-react's Conversation
node/   the backend in Node: POST /chat, and the page (server.js)
go/     the backend in Go: POST /chat, and the page (main.go)
```

The backend holds your application's runyard key. When the page asks for its
chat (`POST /chat`), the backend finds the signed-in user's session — or
starts one for them — and mints a **session token** for it. The page then
talks to runyard directly with that token: it reaches that one session, sends
its turns for that user, and nothing else. The key never leaves the backend.

## Run it

You need a runyard server and a key of your application's with
`sessions.read` and `sessions.write`: an admin makes one for it
(`POST /v1/keys` with its `app`, or in the console), or it is given one when
it connects.

```sh
# 1. Build the page.
cd web && npm install && npm run build && cd ..

# 2. Run a backend.
export RUNYARD_URL=https://agents.example.com
export RUNYARD_KEY=ryak_…
export RUNYARD_USER=u123            # stands in for your sign-in: your own id for the user

cd node && npm install && npm start     # Node
cd go && go run .                       # or Go
```

Open http://localhost:3000. `RUNYARD_PROFILE`, when set, is the profile
sessions are started from; the workspace's default otherwise.

To work on the page, keep a backend running and run `npm run dev` in `web/`:
Vite serves the page and sends `/chat` to the backend.

## What to read

- [`node/server.js`](node/server.js) or [`go/main.go`](go/main.go): `POST
  /chat`, your integration. Replace the fixed `RUNYARD_USER` with your own
  sign-in; give the user's `email` too, if a session should open tunnels to
  them.
- [`web/src/App.tsx`](web/src/App.tsx): the chat. It asks the backend for its
  session and token, renews the token before it ends, and draws the session
  with `<TranscriptProvider options={{ apiBase, token }}>` and
  `<Conversation>`, which has its composer.

## What a token holds to

- **One session:** it reads that session — its transcript, files and
  sub-agents — sends and steers its turns, and uploads what they attach.
  Anything else is refused.
- **One user:** its turns are sent for the end user it was minted for.
- **A while:** an hour unless the backend says otherwise, a day at most.

The relay these examples used before (`go/relay`,
`@runyard-ai/runyard-sdk/relay`) is deprecated, and is being removed.
