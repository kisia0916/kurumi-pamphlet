"use client"
import ProjectDetailInfo from '@/components/Map/MapCards/ProjectDetailInfo';
import { useTitle } from '@/contexts/TitleContext';
import { MapPin, Projects } from '@prisma/client';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { ProjectCardMiniProps } from '../../layout';

function page() {
  const {id} = useParams<{id:string}>();
  const searchParams = useSearchParams();
  const project_id = id;
  const floor_id = searchParams.get('floor') ?? '';

  console.log(searchParams)
  const {setTitle,setMapZoom,setHeight,setMapImg,setShowBackButton,setMapPins,mapPins,set_back_button_path} = useTitle()
  const [project_data,set_project_data] = React.useState<ProjectCardMiniProps|null>(null)
  const [is_get_data,set_is_get_data] = useState(false)
  // クエリから is_get_data を取得（?is_get_data=true|1 で true）

  useEffect(()=>{
    const get_project_data = async()=>{
      try{ 
        if (floor_id !== mapPins.id){
          setMapPins({id:floor_id,pin:[]})
          set_is_get_data(false)
        }
        setTitle("読み込み中...")
        set_back_button_path(`/map/floor/${floor_id}`)
        setShowBackButton(true)
        setHeight("calc(100dvh - 60px - 80px - 200px)")
        const [get_data, pin_data] =await  Promise.all([
           fetch(`/api/get_project_data/${project_id}`),
           fetch(`/api/get_map_pin/get_floor_project_pin/${floor_id}`),
        ])
        console.log(project_id)
        console.log(floor_id)
        if (!get_data.ok) throw new Error('プロジェクト取得失敗')
        const data_json = await get_data.json()
        const project:ProjectCardMiniProps = data_json.data

        if (!pin_data.ok) throw new Error('フロアマップピン取得失敗')
        const pin_json = await pin_data.json()
        const pinsWithSelection = (pin_json.data || []).map((p:MapPin)=> {
          if(p.project_id === project_id){
            return {...p, is_selected: true }
          }
            return {...p, is_selected: false }
        })
        // if(mapPins.id !== floor_id){
        setMapPins({id:project.floor_id,pin:pinsWithSelection})
        // }
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