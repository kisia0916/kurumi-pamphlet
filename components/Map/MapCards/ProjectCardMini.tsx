"use client"
import { Badge } from '@/components/ui/badge'
import { ChevronRight, MapPin, Pin, Tag, UsersRound } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ProjectCardMiniProps } from '@/app/map/layout'

function ProjectCardMini(props:{project:ProjectCardMiniProps}) {
  const { project } = props
  console.log(project)
  const onGenreClick: React.MouseEventHandler<HTMLSpanElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!project.project_genre) return
    try {
      const ev = new CustomEvent('search:addTag', { detail: project.project_genre })
      window.dispatchEvent(ev)
    } catch {}
  }
  return (
    <Link 
      href={`/map/project/${project.id}?floor=${project.floor_id}`}
      className='w-full flex mt-4 main-font-thin'
    >
    <Image
      src={project.picture?.trim() || 'https://xrsvucyppaxvudgfnmdx.supabase.co/storage/v1/object/public/projectpic/soccor.jpg'}
      alt={project.name}
      width={76}
      height={76}
      className='w-19 h-19 rounded-[10px] object-cover flex-shrink-0'

    />

      <div className='h-full flex grow' style={{width: 'calc(100% - 80px)'}}>
        <div className='ml-3 mr-0 grow'>
          <p className='text-[20px] line-clamp-1'>{project.name}</p>
          <p className='text-gray-500 text-[14px]'>{project.building.name} {project.floor.floor_num}階 {project.room_name}教室</p>
          <div className='flex mt-1'>
            <Badge className='flex rounded-full bg-gray-800'>
              <Tag className='w-4 h-4 mr-0'/>
              <span onClick={onGenreClick} title='このジャンルで検索'>{project.project_genre}</span>
            </Badge>
              <UsersRound className='w-4 h-4 mr-1 ml-2 mt-1'/>
                <span className='main-font-thin text-[14px] max-w-[140px] truncate block mt-[1px]'>{project.team_name}</span>
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