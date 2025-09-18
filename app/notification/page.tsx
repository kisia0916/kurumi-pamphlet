"use client"
import React, { useEffect, useState } from 'react'
import { useTitle } from '@/contexts/TitleContext'
import NotificationCard from '@/components/Notification/NotificationCard'
import type { notifications as Notification } from '@prisma/client'
import { Skeleton } from '@/components/ui/skeleton'

function Page() {
  const [tab, setTab] = useState<'all' | 'part'>('all')
  const { is_display_navigation } = useTitle()
  const [notices, setNotices] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(()=>{
    const get_notifications = async() =>{
      setLoading(true)
      try{
        if(tab=== "all"){
          const res = await fetch('/api/notification_data/get_all_notification')
          if (!res.ok) throw new Error('Failed to fetch notification data')
          const data = await res.json()
          setNotices(data.data)
        }else if (tab === "part"){
          const res = await fetch('/api/notification_data/get_part_notification')
          if (!res.ok) throw new Error('Failed to fetch notification data')
          const data = await res.json()
          setNotices(data.data)
        }
      }catch(err){
        setError('お知らせの取得に失敗しました。')
      }finally{
        setLoading(false)
      }
    }
    get_notifications()
  },[tab])
  return (
    <div className="w-full overflow-hidden ">
      <div className="w-full h-17 flex">
        <p className="main-font-thin text-2xl m-auto ml-5">お知らせ</p>
      </div>

      <div className="w-full h-10 flex justify-around">
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

      <div
        className="w-full flex overflow-y-scroll"
        style={{ height: is_display_navigation ? 'calc(100dvh - 170px)' : 'calc(100dvh - 110px)' }}
      >

          <div className="w-full px-4 pt-3 pb-3 space-y-4">
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            {loading ? (
              <div className="space-y-4">
                {/* Card skeleton 1 */}
                <div className="rounded-xl border bg-card/50 p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>

              </div>
            ) : notices.length === 0 ? (
            <div className="w-full rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 bg-gray-50">
              <p className='main-font-thin'>お知らせはありません</p>
            </div>
            ) : (
              notices.map((n) => (
                <NotificationCard
                  key={n.id}
                  title={n.title}
                  description={n.content}
                  tags={[n.status === 'ALL' ? '全体お知らせ' : '生徒用お知らせ']}
                  date={n.createdAt as unknown as string}
                  href={n.link ?? '#'}
                />
              ))
            )}
          </div>
      </div>
    </div>
  )
}

export default Page