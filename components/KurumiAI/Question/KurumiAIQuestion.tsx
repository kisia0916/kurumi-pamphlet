"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ChatInput from './ChatInput'
import ChatMessageList, { ChatMessage, ChatRole } from './ChatMessageList'

function KurumiAIQuestion(props:{setHeightPx:any,setWidthPx:any}) {
  // OpenAI互換のメッセージモデル（system/user/assistant）
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: "121314", role: 'system', content: 'You are a helpful assistant for the school festival app.' },
    { id: "988900", role: 'assistant', content: 'こんにちは！AI 質問所です。文化祭に関する質問があれば入力してください。' },
  ])
  const [isLoading, setIsLoading] = useState(false)

  // OpenAI API へ送る際の変換（例）
  const openAIMessages = useMemo(() => (
    messages.map(m => ({ role: m.role as ChatRole, content: m.content }))
  ), [messages])

  useEffect(()=>{
    props.setHeightPx(520)
    props.setWidthPx(320)
  },[])

  const handleSend = useCallback(async (text: string) => {
    // ユーザーメッセージを追加
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
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

      // ストリーミングレスポンスを読み取る
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (!reader) {
        throw new Error('No response body')
      }

      // アシスタントメッセージを作成
      const assistantId = crypto.randomUUID()
      let assistantContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        assistantContent += chunk

        // メッセージをリアルタイム更新
        setMessages(prev => {
          const existing = prev.find(m => m.id === assistantId)
          if (existing) {
            return prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
          } else {
            return [...prev, { id: assistantId, role: 'assistant', content: assistantContent }]
          }
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // エラーメッセージを表示
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '申し訳ありません。エラーが発生しました。もう一度お試しください。'
      }])
    } finally {
      setIsLoading(false)
    }
  }, [openAIMessages])

  return (
    <div className='w-full h-full'>
      {/* メッセージエリア */}
      <ChatMessageList messages={messages} />
      {/* 入力エリア */}
      <div className='w-full pb-2'>
        <ChatInput
          onSend={handleSend}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}

export default KurumiAIQuestion
