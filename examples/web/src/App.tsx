import '@runyard-ai/runyard-react/styles.css'
import { Conversation, TranscriptProvider } from '@runyard-ai/runyard-react'
import { useEffect, useState } from 'react'

// What the backend answers POST /chat with: the signed-in user's session,
// and a token the browser talks to runyard with, directly. The browser
// never sees the runyard key.
interface Chat {
  sessionId: string
  token: string
  expiresAt: string
  apiBase: string
}

export function App() {
  const [chat, setChat] = useState<Chat>()
  const [failed, setFailed] = useState<string>()

  // The chat, and a new token for it a minute before the last one ends.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let live = true
    async function load() {
      const res = await fetch('/chat', { method: 'POST' })
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
      const next = (await res.json()) as Chat
      if (!live) return
      setChat(next)
      const renew = Math.max(new Date(next.expiresAt).getTime() - Date.now() - 60_000, 10_000)
      timer = setTimeout(() => void load().catch(fail), renew)
    }
    function fail(err: unknown) {
      if (live) setFailed(String(err))
    }
    load().catch(fail)
    return () => {
      live = false
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="app">
      <header>
        <strong>Acme Chat</strong>
      </header>
      <main>
        {chat ? (
          <TranscriptProvider options={{ apiBase: chat.apiBase, token: chat.token }}>
            <Conversation sessionId={chat.sessionId} />
          </TranscriptProvider>
        ) : (
          <p>{failed ?? 'Loading…'}</p>
        )}
      </main>
    </div>
  )
}
