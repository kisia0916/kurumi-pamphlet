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
		<div className='flex gap-2 items-center w-full'>
		<div className='relative w-full flex'>
            <div className='w-[93%] flex m-auto'>
                <Input
                    className='rounded-full h-12 text-sm pr-12'
                    placeholder='質問を入力...'
                                        value={text}
                                        onChange={(e)=>setText(e.target.value)}
                />
                <Button
                    type='button'
                    size='icon'
                    className='absolute right-[18px] top-1/2 -translate-y-1/2 rounded-full shadow-sm bg-amber-300 flex'
                    aria-label='送信'
                                        onClick={handleSend}
                                        disabled={disabled || text.trim().length === 0}
                >
                    <Send className='size-4 text-gray-700 m-auto' />
                </Button>
            </div>
		</div>
		</div>
	)
}

export default ChatInput
