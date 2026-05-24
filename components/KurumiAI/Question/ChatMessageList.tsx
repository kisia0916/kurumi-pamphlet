"use client"
import React, { useEffect, useRef } from "react"
import { Bot } from "lucide-react"
import ProjectCard_ForAIRes from "./ProjectCard_ForAIRes"
import BuildingCard_ForAIRes from "@/components/KurumiAI/Question/BuildingCard_ForAIRes"

export type ChatRole = "system" | "user" | "assistant"
export type ChatMessage = {
  id: string
  role: ChatRole
  content: string,
  json_data?: ({ type: 'project', project_id: string } | { type: 'building', building_id: string })[]
}

function ChatMessageList(props: { messages: ChatMessage[]; isLoading?: boolean }) {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior })
  }

  useEffect(() => {
    scrollToBottom("smooth")
  }, [props.messages])

  useEffect(() => {
    const target = listRef.current
    if (!target) return

    const observer = new MutationObserver(() => {
      scrollToBottom("smooth")
    })

    observer.observe(target, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={listRef} className="w-full h-full overflow-y-auto px-3 py-2 space-y-2">
      {props.messages.filter(m => m.role !== 'system').map((m) => {
        if (m.role === 'assistant') {
          return (
              <div key={m.id} className='flex items-start gap-2'>
                <div className='size-6 rounded-full bg-amber-200 grid place-items-center shrink-0'>
                  <Bot className='size-4 text-amber-500' />
                </div>
                <div>
                  <div className='main-font-thin  max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap break-words shadow-sm bg-gray-100 text-gray-800'>
                    {m.content.split('\\n').map((line, i, arr) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                  {m.json_data && m.json_data.length > 0 && (
                    <div className='mt-2 flex flex-col gap-2'>
                      {(() => {
                        const hasProjectCards = m.json_data.some((d) => d.type === 'project')
                        if (hasProjectCards) {
                          return m.json_data
                            .filter((d): d is { type: 'project', project_id: string } => d.type === 'project' && Boolean(d.project_id))
                            .map((data_item, idx) => (
                              <ProjectCard_ForAIRes project_id={data_item.project_id} key={data_item.project_id + '-' + idx} />
                            ))
                        }

                        return m.json_data
                          .filter((d): d is { type: 'building', building_id: string } => d.type === 'building' && Boolean(d.building_id))
                          .map((data_item, idx) => (
                            <BuildingCard_ForAIRes building_id={data_item.building_id} key={data_item.building_id + '-' + idx} />
                          ))
                      })()}
                    </div>
                  )}
                </div>
              </div>
          )
        }
        // user
        return (
          <div key={m.id} className='flex justify-end'>
            <div className='main-font-thin max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap break-words shadow-sm bg-amber-100 text-gray-900'>
              {m.content.split('\\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )
      })}
      {props.isLoading && (
        <div className='flex items-start gap-2'>
          <div className='size-6 rounded-full bg-amber-200 grid place-items-center shrink-0'>
            <Bot className='size-4 text-amber-500' />
          </div>
          <div className='main-font-thin max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed shadow-sm bg-gray-100 text-gray-600'>
            <div className='flex items-center gap-1'>
              <span className='flex gap-0.5'>
                <span className='w-1 h-1 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></span>
                <span className='w-1 h-1 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></span>
                <span className='w-1 h-1 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></span>
              </span>
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}

export default ChatMessageList
