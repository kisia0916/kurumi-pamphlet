"use client"

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {  Stamp } from 'lucide-react'
import StampLocationCard from '@/components/Stamp/StampLocationCard'
import { useTitle } from '@/contexts/TitleContext'
import { Projects } from '@prisma/client'
import StampCard from '@/components/Stamp/StampCard'
import { useRouter } from 'next/navigation'

export interface StampData {
  id:string,
  createdAt: string,
  index:number,
  title:string,
  photo:string,
  project_id:string,
  description:string,
  project:Projects
}
export interface UserStampData {
  id:string,
  createdAt: string,
  stampPlaceId:string,
  userId:string,
  stamp:StampData
}
function page() {
  const {is_display_navigation} = useTitle()
  const [error,set_error] = useState<string|null>(null)
  const [stamp_data,set_stamp_data] = useState<StampData[]>([])
  const [user_stamp_data,set_user_stamp_data] = useState<UserStampData[]>([])
  const router = useRouter()
  useEffect(()=>{
    const cookiesList = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=').map(c => c.trim());
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const get_stamp_data = async()=>{
      try{
        const [stamp_place_data,user_stamp_data] = await Promise.all([
          fetch('/api/get_stamp_data/get_all'),
          fetch(`/api/get_stamp_data/get_user_stamp/${cookiesList.stamp_user_id}`)
        ])
        if (!stamp_place_data.ok) throw new Error('スタンプデータの取得に失敗しました')
        if (!user_stamp_data.ok) throw new Error('ユーザースタンプデータの取得に失敗しました')
        const data_json:{data:StampData[]} = await stamp_place_data.json()
        const sorted = [...data_json.data].sort((a,b)=> a.index - b.index)
        set_stamp_data(sorted)
        const user_data_json:{data:UserStampData[]} = await user_stamp_data.json()
        set_user_stamp_data(user_data_json.data)
        }catch(error){
          set_error('スタンプデータの取得に失敗しました。時間をおいて再度お試しください。')
      }
    }
    get_stamp_data()
  },[])
  return (
    <div className='w-full overflow-hidden'>
      <div className='w-full h-17 flex'>
        <p className='main-font-thin text-2xl m-auto ml-5'>スタンプ</p>
      </div>
      <div className="w-full  overflow-y-scroll" style={{ height: is_display_navigation?"calc(100dvh - 130px)":"calc(100dvh - 70px)" }}>
        <div className='w-full flex flex-col items-center p-3'>
          <StampCard stamp_data={stamp_data} user_stamp_data={user_stamp_data}/>
          
          {/* スタンプ追加ボタン */}
          <Button 
            className='w-[97%] h-11 mt-4 bg-amber-400 hover:bg-amber-600 text-white rounded-full '
            onClick={() => {
              // スタンプ追加の処理をここに書く
              router.push('/stamp/scan')
            }}
          >
            <Stamp className="w-4 h-4 text-gray-700" />
            <span className='text-[13px] text-gray-700'>スタンプを読み込む</span>
          </Button>
        </div>
        <div className='w-full mb-3'>
          <span className='main-font-thin ml-6'>スタンプ一覧</span>
        </div>
        <div className='w-full grid  grid-cols-2 gap-4 p-4 pt-0'>
          {error && (
            <div className='col-span-2 text-center text-red-500 text-sm'>{error}</div>
          )}
          {!error && stamp_data.length === 0 && (
            <div className='col-span-2 text-center text-gray-500 text-sm'>スタンプがありません</div>
          )}
          {!error && stamp_data.map((s) => (
            <StampLocationCard
              key={s.id}
              stampNumber={s.index}
              locationName={s.title}
              photoPath={s.photo}
              acquisitionMethod={'quiz'}
              mapPath={`/map/project/${s.project_id}?floor=${s.project.floor_id}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default page

