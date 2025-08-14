import { Badge } from '@/components/ui/badge'
import React, { useEffect } from 'react'
import ProjectCardMini from './ProjectCardMini'
import { useTitle } from '@/contexts/TitleContext'

function BuildingFloorDetailInfo() {

  return (
    <div className='w-[90%] m-auto'>
        <div className='w-full flex main-font-thin mt-1 '>
            <Badge className='w-20 h-8 rounded-full bg-gray-400 text-black '>
              <span className='text-white'>企画数 12</span>
            </Badge>
            <Badge className='rounded-full h-8 bg-blue-400 ml-2'>
                <img src="/kurumiIcon/rest_area_fill.svg" className='w-5'/>
            </Badge>
            <Badge className='rounded-full h-8 ml-1 bg-pink-400'>
                <img src="/kurumiIcon/rest_area_fill.svg" className='w-5'/>
            </Badge>
        </div>
        <div className='w-full'>
            <ProjectCardMini />
            <ProjectCardMini />
            <ProjectCardMini />
            <ProjectCardMini />
            <ProjectCardMini />
            <ProjectCardMini />
        </div>
    </div>
  )
}

export default BuildingFloorDetailInfo