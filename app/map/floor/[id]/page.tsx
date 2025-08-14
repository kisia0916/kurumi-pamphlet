"use client"
import BuildingFloorDetailInfo from '@/components/Map/MapCards/BuildingFloorDetailInfo'
import { useTitle } from '@/contexts/TitleContext'
import React, { useEffect } from 'react'

function page() {
  const { setTitle, setShowBackButton, setHeight } = useTitle()

  useEffect(() => {
    // パラメータに基づいてタイトルを設定
    setHeight("calc(100dvh - 60px - 80px - 120px)")
    
    // 一つ前のパスが/map以下のものかチェック
    const referrer = document.referrer
    const isFromMapRoute = referrer && new URL(referrer).pathname.startsWith('/map')
    
    if (isFromMapRoute) {
      setShowBackButton(true)
    } else {
      setShowBackButton(false)
    }
  }, [ setTitle, setShowBackButton])
  return (
    <div className='w-full'>
        <BuildingFloorDetailInfo/>
    </div>
  )
}

export default page