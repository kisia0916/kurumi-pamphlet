"use client"
import ProjectDetailInfo from '@/components/Map/MapCards/ProjectDetailInfo';
import { useTitle } from '@/contexts/TitleContext';
import { Projects } from '@prisma/client';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { ProjectCardMiniProps } from '../../layout';

function page() {
  const {id} = useParams();
  const {setTitle,setMapZoom,setHeight,setMapImg,setShowBackButton} = useTitle()
  const [project_data,set_project_data] = React.useState<ProjectCardMiniProps|null>(null)
  useEffect(()=>{
    const get_project_data = async()=>{
      try{
        setTitle("読み込み中...")
        setShowBackButton(true)
        setHeight("calc(100dvh - 60px - 80px - 200px)")
        const get_data = await fetch(`/api/get_project_data/${id}`)
        if (!get_data.ok) throw new Error('プロジェクト取得失敗')
        const data_json = await get_data.json()
        const project:ProjectCardMiniProps = data_json.data
        setTitle(project.name)
        set_project_data(project)
        setMapImg(project.floor.floor_map_img)
        setMapZoom(1.2)
      }catch{

      }
    }
    get_project_data()
  },[])
  return (
    <div className='w-full flex'>
      {project_data?
        <ProjectDetailInfo project={project_data}/>
        :<div className='w-full text-center main-font-thin py-10'>読み込み中...</div>
      }
    </div>
  )
}

export default page