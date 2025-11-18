"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ChatInput from './ChatInput'
import ChatMessageList, { ChatMessage, ChatRole } from './ChatMessageList'

function KurumiAIQuestion(props:{setHeightPx:any,setWidthPx:any}) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: "121314", role: 'system', content: 'You are a helpful assistant for the school festival app.' },
    { id: "988900", role: 'assistant', content: 'こんにちは！KurumiAIです。文化祭に関することならなんでもお答えします！' },
  ])
  const [messageJson,setMessageJson] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const openAIMessages = useMemo(() => (
    messageJson.map(m => ({ role: m.role as ChatRole, content: m.content }))
  ), [messages])

  useEffect(()=>{
    props.setHeightPx(520)
    props.setWidthPx(320)
  },[])


  const handleSend = useCallback(async (text: string) => {
    // ユーザーメッセージを追加
    const userMessage: ChatMessage = { id: `${Date.now()}-${Math.random()}`, role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setMessageJson(prev=>[...prev,userMessage])
    setIsLoading(true)

    try {
      // API にメッセージ配列を送信
      const response = await fetch('/api/kurumi_ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...openAIMessages, { role: 'user', content: text }]
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      // 非ストリーム: テキストとしてまとめて受信
      const textBody:any = await response.json();
      console.log("AI Response:",textBody);
      // 表示用アシスタントメッセージを合成
      const assistantId = `${Date.now()}-${Math.random()}`

      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: textBody.message,json_data:textBody.json }])
      setMessageJson(prev => [...prev, { id: assistantId, role: 'assistant', content: textBody.norm_text }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        id: `${Date.now()}-${Math.random()}`,
        role: 'assistant',
        content: '申し訳ありません。エラーが発生しました。もう一度お試しください。'
      }])
    } finally {
      setIsLoading(false)
    }
  }, [openAIMessages])

  return (
    <div className='w-full h-full flex flex-col'>
      {/* メッセージエリア */}
      <div className='flex-1 overflow-hidden'>
        <ChatMessageList messages={messages} isLoading={isLoading} />
      </div>
      {/* 入力エリア */}
      <div className='w-full pb-2 px-2 pt-1 border-t border-gray-100'>
        <ChatInput
          onSend={handleSend}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}

export default KurumiAIQuestion
