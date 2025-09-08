import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Projects } from '@prisma/client'
import { MapPin, Tag, Users } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

function ProjectDetailInfo(props:{project:Projects}) {
  return (
    <div className='w-full flex'>
      <div className='w-[90%] m-auto mt-0'>
        <div className='w-full flex'>
            <Image src={props.project.picture} alt="Project detail image" width={76} height={76} className='rounded-[10px] h-22 w-22 object-cover mt-3'/>
            <div className='w-[calc(100%-80px)] ml-3'>
                <div className='w-full flex mt-2'>
                    <MapPin className='w-5 h-5 mr-2 mt-1 text-gray-800'/>
                    <Badge className='flex rounded-full bg-gray-800 mt-1'>
                    <span>一号館 2階</span>
                    </Badge>
                    <span className='main-font-thin ml-2 text-[15px] mt-1'>{props.project.room_name}教室</span>
                </div>
                <div className='w-full flex mt-2 ml-[1px]'>
                    <Tag className='w-5 h-5 mr-2 mt-1 text-gray-800'/>
                    <Badge className='flex rounded-full bg-gray-800 mt-1'>
                    <span>アトラクション</span>
                    </Badge>
                </div>
                <div className='w-full flex mt-2'>
                    <Users className='w-5 h-5 mr-[6px] mt-1 text-gray-800'/>
                    <span className='main-font-thin mt-[2px] ml-2'>57R有志</span>
                </div>
            </div>
        </div>

        <div className='w-full mt-2'>
            <span className='text-[15px] main-font-thin'>説明</span>
            <div className='w-full flex border-1 border-gray-300 rounded-[10px] p-3 mt-1'>
                <span className='main-font-thin'>まるで遊園地に居るかのように思わせます。ぜひ来てください</span>
            </div>
        </div>
        <div className='w-full mt-4 flex'>
          <button
            onClick={() => {
                 console.log("test")
              }
            }
            className='w-full rounded-full bg-blue-300 h-10 active:scale-[0.98] transition'
          >
            <span className='main-font-thin text-xs'>共有リンクをコピー</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailInfo