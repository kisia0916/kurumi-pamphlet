"use client"
import BuildingFloorDetailInfo from '@/components/Map/MapCards/BuildingFloorDetailInfo'
import { useTitle } from '@/contexts/TitleContext'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

function page() {
  const { setTitle, setShowBackButton, setHeight,setMapZoom,mapPins,setMapPins } = useTitle()
  const floor_Id = useParams().id

  useEffect(() => {
    // パラメータに基づいてタイトルを設定
    setHeight("calc(100dvh - 60px - 80px - 200px)")
    setShowBackButton(true)
    setMapZoom(1.2)
    setMapPins(mapPins.id === floor_Id ? mapPins : {id:"",pin:[]})
  }, [ setTitle, setShowBackButton,setMapZoom])
  return (
    <div className='w-full'>
        <BuildingFloorDetailInfo/>
    </div>
  )
}

export default page