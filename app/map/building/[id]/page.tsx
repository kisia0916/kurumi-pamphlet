"use client"
import BuildingInfoCard from '@/components/Map/MapCards/BuildingInfoCard'
import { useTitle } from '@/contexts/TitleContext'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function page() {
  const { setTitle, setShowBackButton, setHeight,height } = useTitle()
  const isFromMapRoute = usePathname().startsWith('/map')
  useEffect(() => {
    setHeight("calc(100dvh - 60px - 80px)")
    setShowBackButton(true)


  }, [ setTitle, setShowBackButton])
  return (
    <div className={`w-full overflow-y-scroll`} style={{ height: `calc(${height} - 64px - 60px)` }}>
        <div className='w-[90%] h-full m-auto py-4'>
            <BuildingInfoCard/>
        </div>
    </div>
  )
}

export default page