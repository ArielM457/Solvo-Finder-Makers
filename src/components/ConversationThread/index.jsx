import { useEffect, useRef } from 'react'
import { formatTime } from '../../utils/formatters'

export default function ConversationThread({ messages }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!messages?.length) {
    return (
      <div className="flex h-full min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 p-6 text-center text-sm text-zinc-500">
        No messages yet. Once the AI agent starts the conversation, the full thread
        will appear here.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4 md:p-6">
      {messages.map((message) => {
        const isAgent = message.role === 'agent'

        return (
          <div
            key={message.id}
            className={`flex max-w-[88%] flex-col gap-1 ${
              isAgent ? 'items-start' : 'ml-auto items-end'
            }`}
          >
            <div
              className={`flex items-center gap-2 px-1 text-[11px] uppercase tracking-[0.18em] ${
                isAgent ? 'text-primary' : 'text-zinc-400'
              }`}
            >
              <span>{isAgent ? 'ZolvoAgent' : 'Lead'}</span>
              <span className="font-data-mono text-[10px] normal-case tracking-normal text-zinc-500">
                {formatTime(message.timestamp)}
              </span>
            </div>

            <div
              className={`rounded-2xl px-4 py-3 text-sm leading-6 text-muted ${
                isAgent
                  ? 'rounded-tl-none border border-primary/20 bg-dark'
                  : 'rounded-tr-none border border-primary bg-border'
              }`}
            >
              {message.content}
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
