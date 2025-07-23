"use client"
import Map from '@/components/Map/Map'
import SearchBox from '@/components/Map/SearchBox'
import React, { ReactNode } from 'react'

export default function MapLayout({ children }: { children: ReactNode }) {
  return (
    <div className='w-full' style={{ height: "calc(100dvh - 60px)" }}>
        <SearchBox/>
      <main>
        {children}
      </main>
    </div>
  )
}
