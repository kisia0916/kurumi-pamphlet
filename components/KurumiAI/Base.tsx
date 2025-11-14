"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Card } from '../ui/card-ai'
import KurumiAITop from './Top/KurumiAITop'
import BackButton from './BackButton'
import AIquestionPage from './AIQuestion.tsx/AIquestionPage'
import KurumiAIQuestion from './Question/KurumiAIQuestion'

function Base() {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [heightPx, setHeightPx] = useState<number | null>(null)
  const [widthPx, setWidthPx] = useState<number | null>(null)
  const [ai_now_page_title,set_ai_now_page_title] = useState<string>("")
  const [ai_now_page,set_ai_now_page] = useState<"top"|"question">("top")
  useEffect(() => {
    if (!wrapperRef.current) return
    const h = wrapperRef.current.offsetHeight
    setHeightPx(h)
  }, [])

  return (
    // ラッパーで高さをトランジション
    <div
      ref={wrapperRef}
      className='w-60 rounded-[15px] overflow-hidden transition-[height] duration-300 ease-in-out'
      style={{
        ...(heightPx != null ? { height: `${heightPx}px` } : {}),
        ...(widthPx != null ? { width: `${widthPx}px` } : {}),
      }}
    >
  <Card className='w-full h-full rounded-[15px]'>
        <div className='w-full flex h-12'>
            {ai_now_page === 'top' && (
              <span className='main-font text-[18px] bg-gradient-to-r from-pink-400 to-amber-400 bg-clip-text text-transparent select-none m-auto'>Kurumi AI</span>
            )}
            {ai_now_page === 'question' && (
              <div className='w-[90%] flex m-auto'>
                <BackButton/>
                <span className='main-font-thin text-[15px] m-auto ml-2'>AI 質問所</span>
              </div>
            )}
        </div>
        {ai_now_page === 'top' && (
          <KurumiAITop setAiNowPage={set_ai_now_page} />
        )}
        {ai_now_page === 'question' && (
          <KurumiAIQuestion setHeightPx={setHeightPx} setWidthPx={setWidthPx}/>
        )}
    </Card>
    </div>
  )
}

export default Base