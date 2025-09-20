import { Badge } from '@/components/ui/badge'
import React, { useEffect, useState } from 'react'
import ProjectCardMini from './ProjectCardMini'
import { Floor } from '@prisma/client'
import { useParams } from 'next/navigation'
import { useTitle } from '@/contexts/TitleContext'
import { ProjectCardMiniProps } from '@/app/map/layout'

interface Floor_include_Building extends Floor {
  building: {
    id: string
    createdAt: string    
    index: number
    name: string
    picture: string
  }
}

function BuildingFloorDetailInfo() {
  const [project_list,set_project_list] = React.useState<ProjectCardMiniProps[]>([])
  const [floorInfo,setFloorInfo] = useState<Floor | null>(null)
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState<string | null>(null)
  const [floor_status,set_floor_status] = useState<"hard"|"empty"|"middle"|"unknown">("unknown")
  const { setTitle,setMapImg,setMapPins,setShowBackButton,set_back_button_path } = useTitle()
  const params = useParams()
  const floor_Id = Array.isArray(params.id) ? params.id[0] : params.id
  useEffect(()=>{
    const fetchAll = async () => {
      try {

        setLoading(true)
        const [projectsRes, floorInfoRes,floorMapPins,floor_status_data] = await Promise.all([
          fetch(`/api/get_floor_data/get_floor_project_list/${floor_Id}`, {
            method: 'GET',
          }),
          fetch(`/api/get_floor_data/get_floor_info/${floor_Id}`, {
            method: 'GET',
          }),
          fetch(`/api/get_map_pin/get_floor_project_pin/${floor_Id}` ),
          fetch(`/api/get_floor_data/get_floor_status/${floor_Id}` ),
        ])

        if (!projectsRes.ok) throw new Error('プロジェクト取得失敗')
        if (!floorInfoRes.ok) throw new Error('階情報取得失敗')
        if (!floorMapPins.ok) throw new Error('フロアマップピン取得失敗')

        const projectsJson = await projectsRes.json()
        const floorInfoJson = await floorInfoRes.json()
        const floor_status_json = await floor_status_data.json()
        const floorData:Floor_include_Building = floorInfoJson.data
        const projectData:ProjectCardMiniProps[] = projectsJson.data
        const floorMapPinsData = await floorMapPins.json()
        set_project_list(projectData || [])
        set_floor_status(floor_status_json.data.status || "unknown")
        setMapImg(floorData.floor_map_img)
        if (typeof floor_Id === 'string') {
          const pinsWithSelection = (floorMapPinsData.data || []).map((p:any)=> ({...p, is_selected: Boolean(p.is_selected) }))
          setMapPins({ id: `${floor_Id}`, pin: pinsWithSelection })
        }
        set_back_button_path(`/map/building/${floorData.building_id}`)
        setFloorInfo(floorData)
        setShowBackButton(true)
        setTitle(floorData.building.name+" "+""+(floorData.floor_num < 0 ? `B${floorData.floor_num}階` : `${floorData.floor_num}階`))
        setTitle(floorData.building.name+" "+""+(floorData.floor_num < 0 ? `B${floorData.floor_num}階` : `${floorData.floor_num}階`))
      } catch (e:any) {
        setError(e.message || '取得に失敗しました')
        set_project_list([])
        setFloorInfo(null)
      } finally {
        setLoading(false)
      }
    }

    if (floor_Id) fetchAll()
  },[floor_Id])

  if (loading) {
    return (
      <div className='w-[90%] m-auto'>
        <div className='animate-pulse space-y-4 mt-4'>
          <div className='h-8 w-40 bg-gray-200 rounded-full' />
          <div className='h-24 w-full bg-gray-200 rounded-xl' />
          <div className='h-24 w-full bg-gray-200 rounded-xl' />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='w-[90%] m-auto text-sm text-red-500'>エラー: {error}</div>
    )
  }
  return (
    <div className='w-[90%] m-auto'>
        <div className='w-full flex main-font-thin mt-1 '>
                      {(() => {
              const label =
                floor_status === 'empty' ? '空き' :
                floor_status === 'middle' ? 'やや混雑' :
                floor_status === 'hard' ? '混雑' : '不明'
              const colorClass =
                floor_status === 'empty' ? 'bg-green-400' :
                floor_status === 'middle' ? 'bg-amber-400' :
                floor_status === 'hard' ? 'bg-red-400' : 'bg-gray-400'
              return (
                <Badge className={`w-fit px-4 h-8 rounded-full mr-2 ${colorClass} text-black`}>
                  <span className='text-black'>{label}</span>
                </Badge>
              )
            })()}
            <Badge className='w-fit px-4 h-8 rounded-full bg-gray-400 text-black '>
              <span className='text-white'>企画数 {project_list.length}</span>
            </Badge>

            {floorInfo?.toilets === "BOTH"?<>
            <Badge className='rounded-full h-8 bg-blue-400 ml-2'>
                <img src="/kurumiIcon/rest_area_fill.svg" className='w-5'/>
            </Badge>
            <Badge className='rounded-full h-8 ml-1 bg-pink-400'>
                <img src="/kurumiIcon/rest_area_fill.svg" className='w-5'/>
            </Badge></>:<></>}
              {floorInfo?.toilets === "MAN"?<>
            <Badge className='rounded-full h-8 bg-blue-400 ml-2'>
                <img src="/kurumiIcon/rest_area_fill.svg" className='w-5'/>
            </Badge></>:<></>}
              {floorInfo?.toilets === "WOMAN"?<>
            <Badge className='rounded-full h-8 ml-1 bg-pink-400'>
                <img src="/kurumiIcon/rest_area_fill.svg" className='w-5'/>
            </Badge></>:<></>}
        </div>
        <div className='w-full'>
          {project_list.length === 0 ? (
            <div className="w-full rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 bg-gray-50 mt-5">
              <p className='main-font-thin'>この階の登録された企画はまだありません。</p>
              <p className='mt-1'>別の階を選択するか、後でもう一度確認してください。</p>
            </div>
          ) : (
            project_list.map(project => (
              <ProjectCardMini key={project.id} project={project} />
            ))
          )}
          <div className='h-4'></div>
        </div>
    </div>
  )
}

export default BuildingFloorDetailInfo