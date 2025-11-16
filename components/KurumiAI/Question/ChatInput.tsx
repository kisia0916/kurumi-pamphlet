"use client"
import React, { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

type Props = {
    onSend?: (text: string) => void
    disabled?: boolean
}

function ChatInput({ onSend, disabled }: Props) {
    const [text, setText] = useState("")

    const handleSend = useCallback(() => {
        const v = text.trim()
        if (!v || disabled) return
        onSend?.(v)
        setText("")
    }, [text, disabled, onSend])

	return (
		<div className='relative w-full'>
            <Input
                className='rounded-full h-10 text-sm pr-12 w-full'
                placeholder='質問を入力...'
                value={text}
                onChange={(e)=>setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                    }
                }}
            />
            <Button
                type='button'
                size='icon'
                className='absolute right-1 top-1/2 -translate-y-1/2 rounded-full shadow-sm bg-amber-300 hover:bg-amber-400 flex h-8 w-8'
                aria-label='送信'
                onClick={handleSend}
                disabled={disabled || text.trim().length === 0}
            >
                <Send className='size-4 text-gray-700 m-auto' />
            </Button>
		</div>
	)
}

export default ChatInput
