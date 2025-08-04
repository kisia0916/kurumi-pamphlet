import { Badge } from '@/components/ui/badge'
import React from 'react'
import MiniMap from '../MiniMap'
import ProjectCardMini from './ProjectCardMini'
import { ArrowBigLeft, ChevronRight } from 'lucide-react'

function BuildingFloorInfo() {
  return (
    <div className='w-full'>
        <div className='w-full flex h-12 justify-between'>
            <span className='main-font-thin text-[25px] m-auto mr-0 ml-1 '>1階</span>
            <div className='flex'>
                <Badge className='rounded-full h-7 m-auto mt-[12px]  bg-blue-400 ml-1'>
                    <img src="/kurumiIcon/rest_area_fill.svg" className='w-5'/>
                </Badge>
                <Badge className='rounded-full h-7 m-auto mt-[12px] ml-1 bg-pink-400'>
                    <img src="/kurumiIcon/rest_area_fill.svg" className='w-5'/>
                </Badge>
                <Badge className='rounded-full h-7 m-auto mt-[12px] ml-1 mr-0 bg-amber-400'>
                    <span>企画数 12</span>
                </Badge>
            </div>
        </div>
        <div className='w-full'>
            <MiniMap/>
        </div>
        <div className='w-full flex mt-3'>
            <button className='w-[99%] h-11 rounded-full bg-blue-200 m-auto flex border-[1px] border-blue-400'>
                <div className='m-auto flex'>
                    <span className='main-font-thin text-blue-800'>詳細</span>
                    <ChevronRight className='m-auto mt-[1px] text-blue-800'/>
                </div>
            </button>
        </div>
        <div className='w-full h-20 '>
            <ProjectCardMini/>
            <ProjectCardMini/>
            <ProjectCardMini/>

        </div>
    </div>
  )
}

export default BuildingFloorInfo