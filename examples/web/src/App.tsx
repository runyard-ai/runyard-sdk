import '@runyard-ai/runyard-react/styles.css'
import { Composer, Conversation, TranscriptProvider, laneClass, sessions } from '@runyard-ai/runyard-react'
import { useState } from 'react'

// The backend serves the relay at /agents. The browser never sees the
// runyard key: it only talks to the backend.
const api = { apiBase: '/agents/v1', fetch: (request: Request) => fetch(request) }

export function App() {
  // The open chat, remembered across reloads.
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('sessionId') ?? undefined)

  function open(id: string | undefined) {
    if (id) localStorage.setItem('sessionId', id)
    else localStorage.removeItem('sessionId')
    setSessionId(id)
  }

  // The first message starts a session; the conversation takes it from there.
  async function start({ text }: { text: string }) {
    const { data, failure } = await sessions.start(api, { autoTitle: true, firstTurn: { text } })
    if (data) open(data.id)
    return failure
  }

  return (
    <TranscriptProvider options={{ apiBase: api.apiBase }}>
      <div className="app">
        <header>
          <strong>Acme Chat</strong>
          <button onClick={() => open(undefined)}>New chat</button>
        </header>
        <main>
          {sessionId ? (
            <Conversation sessionId={sessionId} />
          ) : (
            <div className={laneClass}>
              <Composer onSend={start} placeholder="Ask anything" />
            </div>
          )}
        </main>
      </div>
    </TranscriptProvider>
  )
}
