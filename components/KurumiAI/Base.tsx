"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Card } from '../ui/card-ai'
import BackButton from './BackButton'
import KurumiAIQuestion from './Question/KurumiAIQuestion'

function Base(props:{wight:number,height:number}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [heightPx, setHeightPx] = useState<number>(140)
  const [widthPx, setWidthPx] = useState<number>(240)
  const [visible, setVisible] = useState(false)
  // 初回アニメーション完了後は高さ/幅のトランジションを解除してモバイルキーボードによる再レイアウト時の点滅を防ぐ
  const [animatedOnce, setAnimatedOnce] = useState(false)
  // const [ai_now_page_title,set_ai_now_page_title] = useState<string>("")
  const [ai_now_page,set_ai_now_page] = useState<"top"|"question">("top")
  useEffect(() => {
    if (!wrapperRef.current) return
    requestAnimationFrame(() => {
        setHeightPx(props.height)
        setWidthPx(props.wight)
      setVisible(true)
      // アニメーション時間終了後にフラグを立ててトランジション解除
      const timeout = setTimeout(() => setAnimatedOnce(true), 450)
      return () => clearTimeout(timeout)
    })
  }, [])

  return (
    <div
      ref={wrapperRef}
      className={`rounded-[15px] overflow-hidden ${visible ? 'opacity-100' : 'opacity-0'} ${animatedOnce ? 'transition-opacity duration-200 ease-linear' : 'transition-all duration-400 ease-out'}`}
      style={{
        height: `${heightPx}px`,
        width: `${widthPx}px`,
        // レイアウトのジャンプを減らすため
        willChange: animatedOnce ? 'opacity' : 'height,width,opacity',
      }}
    >
  <Card className='w-full h-full rounded-[15px] flex flex-col border-[1px] border-gray-200'>
        <div className='w-full flex h-12 shrink-0 border-b border-gray-100'>
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
        <div className='flex-1 overflow-hidden'>
          <KurumiAIQuestion setHeightPx={setHeightPx} setWidthPx={setWidthPx}/>
        </div>
    </Card>
    </div>
  )
}

export default Base