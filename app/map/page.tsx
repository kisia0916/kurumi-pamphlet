"use client"
import Map from '@/components/Map/Map';
import MapContentsList from '@/components/Map/MapContentsList';
import MapPin from '@/components/Map/MapPin';
import SearchBox from '@/components/Map/SearchBox';
import React, { useEffect, useRef, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';


function page() {
  return (
    <div className='w-full'>
      <MapContentsList content_id=''/>
    </div>
  )
}

export default page