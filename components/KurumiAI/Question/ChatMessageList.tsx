"use client"
import React, { useEffect, useRef } from "react"
import { Bot } from "lucide-react"

export type ChatRole = "system" | "user" | "assistant"
export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

function ChatMessageList(props: { messages: ChatMessage[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [props.messages])

  return (
    <div className="w-full overflow-y-auto px-3 py-2 space-y-2" style={{ height: 'calc(100% - 60px)' }}>
      {props.messages.filter(m => m.role !== 'system').map((m) => {
        if (m.role === 'assistant') {
          return (
            <div key={m.id} className='flex items-start gap-2'>
              <div className='size-6 rounded-full bg-amber-200 grid place-items-center shrink-0'>
                <Bot className='size-4 text-amber-500' />
              </div>
              <div className='main-font-thin  max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap break-words shadow-sm bg-gray-100 text-gray-800'>
                {m.content}
              </div>
            </div>
          )
        }
        // user
        return (
          <div key={m.id} className='flex justify-end'>
            <div className='main-font-thin max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap break-words shadow-sm bg-amber-100 text-gray-900'>
              {m.content}
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}

export default ChatMessageList
