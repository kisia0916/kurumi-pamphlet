import { Badge } from '@/components/ui/badge'
import React, { useEffect, useState } from 'react'
import MiniMap from '../MiniMap'
import ProjectCardMini from './ProjectCardMini'
import {  ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTitle } from '@/contexts/TitleContext'
import { Projects } from '@prisma/client'

function BuildingFloorInfo(props:{floor_list:{floor:number,id:string}[]}) {
  const query = useSearchParams()
  const [selectedFloor, setSelectedFloor] = useState<{floor_text:string,id:string}>(() => {
    if (query.get("floor")){
      const floorParam = query.get("floor");
      const floorNum = Number(floorParam);
      if (Number.isInteger(floorNum)) {
        if (floorNum>=props.floor_list[0].floor && floorNum<=props.floor_list[props.floor_list.length-1].floor){
          const id = props.floor_list.find(f => f.floor === floorNum)?.id || '';
          return { floor_text: floorNum < 0 ? `B${floorNum}階` : `${floorNum}階`, id };
        }
      }
      
    }
    const nums = (props.floor_list ?? []).map(f => f.floor)
    if (nums.length === 0) return {floor_text: '',id:'' }
    const positives = nums.filter(n => n > 0)
    const target = positives.length > 0 ? Math.min(...positives) : Math.min(...nums)
    return {floor_text:target < 0 ? `B${target}階` : `${target}階`,id: props.floor_list.find(f=>f.floor===target)?.id || ''}
  })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()
  const { title,setTitle } = useTitle();
  const [project_list,set_project_list] = useState<Projects[]>([])
  
  let floor_transform:{text:string,id:string}[] = []
  const floors = props.floor_list.map((floor)=>{
    if (floor.floor < 0){
      floor_transform.push({text:`B${floor.floor}階`,id:floor.id})
      return `B${floor.floor}階`
    }else{
      floor_transform.push({text:`${floor.floor}階`,id:floor.id})
      return `${floor.floor}階`
    }
  })



  // 詳細ボタンのクリックハンドラー
  const handleDetailClick = () => {
    setTitle(`${title} ${selectedFloor.floor_text}`)
    router.push(`/map/floor/${selectedFloor.id}`)
  }
  useEffect(()=>{


    const get_floor_project_data = async()=>{
      try {
        const project_data = await fetch(`/api/get_floor_data/get_floor_project_list/${selectedFloor.id}`, {
          next: { revalidate: 10800 }, // 3時間 (10800秒) キャッシュ
          cache: 'force-cache'
        })
        const data_json = await project_data.json()
        const projects:Projects[] = data_json.data
        console.log(projects)
        set_project_list(Array.isArray(projects) ? projects : [])
      } catch (error) {
        set_project_list([])
      }
    }
    if (selectedFloor.id) {
      get_floor_project_data()
    }
  },[selectedFloor])

  return (
    <div className='w-full'>
        <div className='w-full flex h-12 justify-between items-center'>
            <div className="relative">
              <button 
                className="flex items-center gap-2 text-[16px] main-font-thin bg-gradient-to-r bg-gray-400 text-white px-3 rounded-full transition-all duration-200 cursor-pointer mt-[12px] h-8"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{selectedFloor.floor_text}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-24 overflow-hidden">
                  {floors.map((floor) => (
                    <button
                      key={floor}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm main-font-thin transition-colors"
                      onClick={() => {
                        setSelectedFloor({floor_text:floor,id:floor_transform.find(f=>f.text===floor)?.id || ''})
                        setIsDropdownOpen(false)
                      }}
                    >
                      {floor}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className='flex'>
                <Badge className='rounded-full h-8 m-auto mt-[12px]  bg-blue-400 ml-1'>
                    <img src="/kurumiIcon/rest_area_fill.svg" className='w-5'/>
                </Badge>
                <Badge className='rounded-full h-8 m-auto mt-[12px] ml-1 bg-pink-400'>
                    <img src="/kurumiIcon/rest_area_fill.svg" className='w-5'/>
                </Badge>
                <Badge className='rounded-full h-8 m-auto mt-[12px] ml-1 mr-0 bg-amber-400'>
                    <span>企画数 {project_list.length}</span>
                </Badge>
            </div>
        </div>
        <div className='w-full'>
            <MiniMap/>
        </div>
        <div className='w-full flex mt-3'>
            <Button 
              className='w-full h-10 m-auto flex items-center justify-center gap-1 rounded-full bg-amber-400 text-[15px]'
              onClick={handleDetailClick}
            >
                <span className='main-font-thin'>詳細</span>
                <ChevronRight className='h-6 mt-[1px]'/>
            </Button>
        </div>
        <div className='w-full mt-4 space-y-2'>
          {project_list.length === 0 ? (
            <div className="w-full rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 bg-gray-50">
              <p className='main-font-thin'>この階の登録された企画はまだありません。</p>
              <p className='mt-1'>別の階を選択するか、後でもう一度確認してください。</p>
            </div>
          ) : (
            project_list.map(project => (
              <ProjectCardMini key={project.id} project={project} />
            ))
          )}
          <div className='h-5' />
        </div>

    </div>
  )
}

export default BuildingFloorInfo