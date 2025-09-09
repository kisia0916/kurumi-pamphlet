"use client"
import BuildingInfoCard from '@/components/Map/MapCards/BuildingInfoCard'
import { useTitle } from '@/contexts/TitleContext'
import React, { useEffect } from 'react'

function page() {
  const { setTitle, setShowBackButton, setHeight,height } = useTitle()
  useEffect(() => {
    setHeight("calc(100dvh - 60px - 80px)")
    setShowBackButton(true)


  }, [ setTitle, setShowBackButton])

  return (
    <div className={`w-full h-full`} >
        <div className='w-[90%] h-full m-auto py-4'>
            <BuildingInfoCard/>
        </div>
    </div>
  )
}

export default page