import { Badge } from '@/components/ui/badge'
import { ChevronRight, MapPin, Pin, UsersRound } from 'lucide-react'
import React from 'react'

function ProjectCardMini() {
  return (
    <div className='w-full flex mt-4 main-font-thin'>
        <img src="/photos/35.jpeg" className='w-19 h-19 rounded-[10px] object-cover'/>
        <div className='h-full flex' style={{width: 'calc(100% - 80px)'}}>
            <div className='ml-3 mr-0'>
                <p className='text-[20px]'>けんじゃぶ</p>
                <p className='text-gray-500 text-[14px]'>1号館 2階 704教室</p>
                <div className='flex mt-1'>
                    <Badge className='flex rounded-full bg-gray-800'>
                        <MapPin />
                        <span>704</span>
                    </Badge>
                    <Badge className='flex ml-1 rounded-full bg-gray-800'>
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