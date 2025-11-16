"use client"
import { Badge } from '@/components/ui/badge'
import { ChevronRight, MapPin, Pin, Tag, UsersRound } from 'lucide-react'
import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ProjectCardMiniProps } from '@/app/map/layout'

function ProjectCard_ForAIRes(props:{project_id:string}) {
  const { project_id } = props
  const [project, setProject] = React.useState<ProjectCardMiniProps|null>(null);
  useEffect(()=>{
    let aborted = false
    const run = async () => {
      try {
        if (!project_id) return
        const res = await fetch(`/api/get_project_data/${encodeURIComponent(project_id)}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch project')
        const json = await res.json()
        if (!aborted && json?.success && json?.data) {
          setProject(json.data as ProjectCardMiniProps)
        }
      } catch (e) {
        console.error('get_project_data error:', e)
      }
    }
    run()
    return () => { aborted = true }
  },[project_id])
  const onGenreClick: React.MouseEventHandler<HTMLSpanElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!project?.project_genre) return
    try {
      const ev = new CustomEvent('search:addTag', { detail: project.project_genre })
      window.dispatchEvent(ev)
    } catch {}
  }

  if (!project) {
    return null
  }
  const handleClick = () => {
    try {
      // AI パネルを閉じるためのカスタムイベント
      window.dispatchEvent(new Event('kurumi-ai-close'))
    } catch {}
  }
  return (
    <Link 
      href={`/map/project/${project.id}?floor=${project.floor_id}`}
      onClick={handleClick}
      className='w-full flex mt-1 mb-1 main-font-thin justify-between shadow-sm rounded-2xl'
    >
    <div className='flex mt-2 mb-2 ml-2'>
        <div className='w-full flex'>
            <Image
            src={project.picture?.trim() || 'https://xrsvucyppaxvudgfnmdx.supabase.co/storage/v1/object/public/projectpic/soccor.jpg'}
            alt={project.name}
            width={76}
            height={76}
            className='w-12 h-12 rounded-[10px] object-cover flex-shrink-0 mt-[1px]'

            />
            <div className='h-full flex grow' style={{width: 'calc(100% - 80px)'}}>
                <div className='ml-3 mr-0 grow'>
                <p className='text-[16px] line-clamp-1'>{project.name}</p>
                <p className='text-gray-500 text-[14px] mt-1'>{project.building.name} {project.floor.floor_num<0?"B"+Math.abs(project.floor.floor_num):project.floor.floor_num}階 {project.room_name}</p>

                </div>
            </div>
        </div>
    </div>
      <div className='flex h-full'>
        <ChevronRight className='m-auto mt-5 mr-1 text-gray-700 transition-colors w-5'/>
      </div>
    </Link>
  )
}

export default ProjectCard_ForAIRes