import { Badge } from '@/components/ui/badge'
import { ChevronRight, MapPin, Pin, UsersRound } from 'lucide-react'
import React from 'react'

function ProjectCardMini() {
  return (
    <div className='w-full h-17 flex mt-4 main-font-thin'>
        <img src="/photos/food1.jpg" className='w-17 h-17 rounded-[10px] object-cover'/>
        <div className='h-full flex' style={{width: 'calc(100% - 80px)'}}>
            <div className='m-auto ml-0 mr-0'>
                <span className='text-[20px] ml-3'>けんじゃぶ</span>
                <div className='flex mt-2'>
                    <Badge className='flex ml-3 bg-gray-800'>
                        <MapPin />
                        <span>704</span>
                    </Badge>
                    <Badge className='flex ml-1 bg-gray-800'>
                        <UsersRound />
                        <span>テニス部</span>
                    </Badge>
                </div>
            </div>
        </div>
        <div className='flex h-full'>
        <ChevronRight className='m-auto mt-7'/>
      </div>
    </div>
  )
}

export default ProjectCardMini