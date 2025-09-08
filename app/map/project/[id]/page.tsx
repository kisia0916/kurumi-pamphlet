"use client"
import ProjectDetailInfo from '@/components/Map/MapCards/ProjectDetailInfo';
import { useTitle } from '@/contexts/TitleContext';
import { Projects } from '@prisma/client';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'

function page() {
  const {id} = useParams();
  const {setTitle} = useTitle()
  const [project_data,set_project_data] = React.useState<Projects|null>(null)
  useEffect(()=>{
    const get_project_data = async()=>{
      try{
        setTitle("読み込み中...")
        const get_data = await fetch(`/api/get_project_data/${id}`,{
          next: { revalidate: 10800 }, // 3時間 (10800秒) キャッシュ
          cache: 'force-cache'
        })
        if (!get_data.ok) throw new Error('プロジェクト取得失敗')
        const data_json = await get_data.json()
        const project:Projects = data_json.data
        setTitle(project.name)
        console.log(project)
        set_project_data(project)
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