"use client"
import BuildingFloorDetailInfo from '@/components/Map/MapCards/BuildingFloorDetailInfo'
import { useTitle } from '@/contexts/TitleContext'
import React, { useEffect } from 'react'

function page() {
  const { setTitle, setShowBackButton, setHeight,setMapZoom } = useTitle()

  useEffect(() => {
    // パラメータに基づいてタイトルを設定
    setHeight("calc(100dvh - 60px - 80px - 200px)")
    setShowBackButton(true)
      setMapZoom(1.2)
 
  }, [ setTitle, setShowBackButton,setMapZoom])
  return (
    <div className='w-full'>
        <BuildingFloorDetailInfo/>
    </div>
  )
}

export default page