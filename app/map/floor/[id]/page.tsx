"use client"
import BuildingFloorDetailInfo from '@/components/Map/MapCards/BuildingFloorDetailInfo'
import { useTitle } from '@/contexts/TitleContext'
import React, { useEffect } from 'react'

function page() {
  const { setTitle, setShowBackButton, setHeight } = useTitle()

  useEffect(() => {
    // パラメータに基づいてタイトルを設定
    setHeight("calc(100dvh - 60px - 80px - 120px)")
    setShowBackButton(true)
 
  }, [ setTitle, setShowBackButton])
  return (
    <div className='w-full'>
        <BuildingFloorDetailInfo/>
    </div>
  )
}

export default page