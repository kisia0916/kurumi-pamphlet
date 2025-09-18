import { Badge } from '@/components/ui/badge'
import React, { useEffect, useState } from 'react'
import MiniMap from '../MiniMap'
import ProjectCardMini from './ProjectCardMini'
import {  ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTitle } from '@/contexts/TitleContext'
import { ProjectCardMiniProps } from '@/app/map/layout'

function BuildingFloorInfo(props:{floor_list:{floor:number,id:string,map_img:string,toilets:string}[]}) {
  const query = useSearchParams()
  const [selectedFloor, setSelectedFloor] = useState<{floor_text:string,id:string,map_img:string,toilets:string}>(() => {
    if (!props.floor_list || props.floor_list.length === 0) return { floor_text:'', id:'', map_img:'',toilets:'' }
    const parseTxt = (n:number)=> n < 0 ? `B${n}階` : `${n}階`
    const floorParam = query.get('floor')
    if (floorParam) {
      const floorNum = Number(floorParam)
      if (Number.isInteger(floorNum)) {
        const found = props.floor_list.find(f=>f.floor === floorNum)
        if (found) return { floor_text: parseTxt(found.floor), id: found.id, map_img: found.map_img,toilets: found.toilets }
      }
    }
    // デフォルト: 正の階の最小 or 全体の最小
    const positives = props.floor_list.filter(f=>f.floor>0)
    const target = (positives.length>0 ? positives : props.floor_list)
      .reduce((a,b)=> a.floor < b.floor ? a : b)
    return { floor_text: parseTxt(target.floor), id: target.id, map_img: target.map_img ,toilets: target.toilets}
  })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()
  const { title,setTitle } = useTitle();
  const [project_list,set_project_list] = useState<ProjectCardMiniProps[]>([])
  
  // 一覧用に変換
  const floor_transform = (props.floor_list||[]).map(f=> ({
    text: f.floor < 0 ? `B${f.floor}階` : `${f.floor}階`,
    id: f.id,
    map_img: f.map_img,
    toilet: f.toilets
  }))
  const floors = floor_transform.map(f=>f.text)



  // 詳細ボタンのクリックハンドラー
  const handleDetailClick = () => {
    setTitle(`${title} ${selectedFloor.floor_text}`)
    router.push(`/map/floor/${selectedFloor.id}`)
  }
  useEffect(()=>{

    console.log(selectedFloor)
    const get_floor_project_data = async()=>{
      try {
        const project_data = await fetch(`/api/get_floor_data/get_floor_project_list/${selectedFloor.id}`)
        const data_json = await project_data.json()
        const projects:ProjectCardMiniProps[] = data_json.data
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
                className="flex items-center gap-2 text-[16px] main-font-thin bg-gradient-to-r bg-blue-300 text-black px-3 rounded-full transition-all duration-200 cursor-pointer mt-[12px] h-8"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{selectedFloor.floor_text}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-24 overflow-hidden">
                  {floors.map((floor) => {
                    const found = floor_transform.find(f=>f.text===floor)
                    return (
                      <button
                        key={floor}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm main-font-thin transition-colors "
                        onClick={() => {
                          if (found) setSelectedFloor({ floor_text: found.text, id: found.id, map_img: found.map_img,toilets: found.toilet })
                          setIsDropdownOpen(false)
                        }}
                      >{floor}</button>
                    )
                  })}
                </div>
              )}
            </div>
            <div className='flex'>
                {selectedFloor.toilets === "BOTH"?<><Badge className='rounded-full h-8 m-auto mt-[12px]  bg-blue-400 ml-1'>
                    <img src="/kurumiIcon/rest_area_fill.svg" className='w-5'/>
                </Badge>
                <Badge className='rounded-full h-8 m-auto mt-[12px] ml-1 bg-pink-400'>
                    <img src="/kurumiIcon/rest_area_fill.svg" className='w-5'/>
                </Badge></>:<></>}
                {selectedFloor.toilets === "MAN"?<><Badge className='rounded-full h-8 m-auto mt-[12px]  bg-blue-400 ml-1'>
                    <img src="/kurumiIcon/rest_area_fill.svg" className='w-5'/>
                </Badge></>:<></>}
                {selectedFloor.toilets === "WOMAN"?<><Badge className='rounded-full h-8 m-auto mt-[12px] ml-1 bg-pink-400'>
                    <img src="/kurumiIcon/rest_area_fill.svg" className='w-5'/>
                </Badge></>:<></>}
                <Badge className='rounded-full h-8 m-auto mt-[12px] ml-1 mr-0 bg-gray-400'>
                    <span>企画数 {project_list.length}</span>
                </Badge>
            </div>
        </div>
    <div className='w-full'>
      <MiniMap map_img={selectedFloor.map_img} floor_id={selectedFloor.id}/>
    </div>
        <div className='w-full flex mt-3'>
            {/* <Button 
              className='w-full h-10 m-auto flex items-center justify-center gap-1 rounded-full bg-amber-400 text-[15px]'
              onClick={handleDetailClick}
            >
                <span className='main-font-thin'>詳細</span>
                <ChevronRight className='h-6 mt-[1px]'/>
            </Button> */}


          <button
              onClick={handleDetailClick}

              className='w-full rounded-full bg-blue-300 h-10 active:scale-[0.98] transition flex'
              aria-live="polite"
              aria-label="詳細"
          >
            <div className='m-auto flex'>
              <span className='main-font-thin text-xs'>詳細を見る</span>
              <ChevronRight className='h-3 mt-[3px]'/>
            </div>
          </button>


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