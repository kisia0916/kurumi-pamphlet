import { Badge } from '@/components/ui/badge'
import { Projects } from '@prisma/client'
import { ChevronRight, MapPin, Pin, UsersRound } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

function ProjectCardMini(props:{project:Projects}) {
  const { project } = props
  return (
    <Link 
      href={`/map/project/${project.id}`}
      className='w-full flex mt-4 main-font-thin'
    >
    <Image
      src={project.picture?.trim() || '/photos/P1030548.JPG'}
      alt={project.name}
      width={76}
      height={76}
      className='w-19 h-19 rounded-[10px] object-cover flex-shrink-0'

    />

      <div className='h-full flex grow' style={{width: 'calc(100% - 80px)'}}>
        <div className='ml-3 mr-0 grow'>
          <p className='text-[20px] line-clamp-1'>{project.name}</p>
          <p className='text-gray-500 text-[14px]'>1号館 2階 {project.room_name}教室</p>
          <div className='flex mt-1'>
            <Badge className='flex rounded-full bg-gray-800'>
              <MapPin className='w-4 h-4 mr-0'/>
              <span>{project.project_genre}</span>
            </Badge>
            <Badge className='flex ml-1 rounded-full bg-gray-800'>
              <UsersRound className='w-4 h-4 mr-1'/>
              <span></span>
            </Badge>
          </div>
        </div>
      </div>
      <div className='flex h-full'>
        <ChevronRight className='m-auto mt-7 mr-0 text-gray-700 transition-colors'/>
      </div>
    </Link>
  )
}

export default ProjectCardMini