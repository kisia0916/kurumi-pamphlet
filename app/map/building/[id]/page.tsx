"use client"
import BuildingInfoCard from '@/components/Map/MapCards/BuildingInfoCard'
import { useTitle } from '@/contexts/TitleContext'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

function page() {
  const { setTitle, setShowBackButton, setHeight } = useTitle()
  const content_id = useParams<{id:string}>()
  useEffect(() => {
    setHeight("calc(100dvh - 60px - 80px)")
    
    // 一つ前のパスが/map以下のものかチェック
    const referrer = document.referrer
    const isFromMapRoute = referrer && new URL(referrer).pathname.startsWith('/map')
    console.log(isFromMapRoute)
    if (isFromMapRoute) {
      setShowBackButton(true)
    } else {
      setShowBackButton(false)
    }

  }, [ setTitle, setShowBackButton])
  return (
    <div className='w-full h-full'>
        <div className='w-[90%] h-full m-auto py-4'>
            <BuildingInfoCard/>
        </div>
    </div>
  )
}

export default page