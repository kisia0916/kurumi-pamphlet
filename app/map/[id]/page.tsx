"use client"

import MapContentsList from '@/components/Map/MapContentsList'
import { useParams } from 'next/navigation'
import React from 'react'

function page() {
  const content_id = useParams<{id:string}>()
  return (
    <div className='w-full'>
      <MapContentsList content_id={content_id.id}/>
    </div>
  )
}

export default page