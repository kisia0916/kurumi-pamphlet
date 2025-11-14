"use client"
import React from 'react'
import MenuButton from '../Menu/MenuButton'
import { Footprints, MessageCircleQuestionMark } from 'lucide-react'

type Props = {
  setHeight?: (px: number) => void
  targetHeightPx?: number
  setAiNowPage?: (page: 'top' | 'question') => void
}

function KurumiAITop({ setAiNowPage }: Props) {
  const handleAskClick = () => {
    setAiNowPage?.('question')
  }
  return (
    <>
      <div className='w-full flex mt-1 mb-1'>
        <div className='w-[80%] m-auto mt-0 flex justify-around'>
          <MenuButton title='プラン作成' icon={<Footprints className='text-gray-800'/>}/>
          <MenuButton title='AI質問所' icon={<MessageCircleQuestionMark className='text-gray-800'/>} onClick={handleAskClick}/>
        </div>
      </div>
      <div className='h-3'></div>
    </>
  )
}

export default KurumiAITop
