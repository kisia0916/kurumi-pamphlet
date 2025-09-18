"use client"
import React, { useState } from 'react'
import { useTitle } from '@/contexts/TitleContext'
import NotificationCard from '@/components/Notification/NotificationCard'

function Page() {
  const [tab, setTab] = useState<'all' | 'part'>('all')
  const { is_display_navigation } = useTitle()

  return (
    <div className="w-full overflow-hidden ">
      {/* ヘッダ */}
      <div className="w-full h-17 flex">
        <p className="main-font-thin text-2xl m-auto ml-5">準備中</p>
      </div>

      {/* タブ（Foodページと同じ見た目） */}
      {/* <div className="w-full h-10 flex justify-around">
        <button
          className={`w-[50%] flex h-full ${
            tab === 'all' ? 'border-b-2 border-amber-300' : 'border-b border-gray-300'
          }`}
          onClick={() => setTab('all')}
        >
          <span className="m-auto">全体お知らせ</span>
        </button>
        <button
          className={`w-[50%] flex h-full ${
            tab === 'part' ? 'border-b-2 border-amber-300' : 'border-b border-gray-300'
          }`}
          onClick={() => setTab('part')}
        >
          <span className="m-auto">生徒用お知らせ</span>
        </button>
      </div>

      {/* コンテンツ */}
      {/* <div
        className="w-full flex overflow-y-scroll"
        style={{ height: is_display_navigation ? 'calc(100dvh - 170px)' : 'calc(100dvh - 110px)' }}
      >
        {tab === 'all' ? (
          <div className="w-full px-4 py-3">
          </div>
        ) : (
          <div className="w-full px-4 py-3">
            <p className="text-sm text-gray-600">生徒向けのお知らせをここに表示します。</p>
          </div>
        )}
      </div> */}
    </div>
  )
}

export default Page