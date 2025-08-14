import { Badge } from '@/components/ui/badge'
import React, { useState } from 'react'
import MiniMap from '../MiniMap'
import ProjectCardMini from './ProjectCardMini'
import {  ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useTitle } from '@/contexts/TitleContext'

function BuildingFloorInfo() {
  const [selectedFloor, setSelectedFloor] = useState('1階')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()
  const { title,setTitle } = useTitle();
  
  const floors = ['1階', '2階', '3階', '4階', '5階']

  // 階層番号を抽出する関数
  const getFloorNumber = (floorText: string) => {
    return floorText.replace('階', '')
  }

  // 詳細ボタンのクリックハンドラー
  const handleDetailClick = () => {
    const floorId = getFloorNumber(selectedFloor)
    setTitle(`${title} ${floorId}`)
    router.push(`/map/floor/${floorId}階`)
  }

  return (
    <div className='w-full'>
        <div className='w-full flex h-12 justify-between items-center'>
            <div className="relative">
              <button 
                className="flex items-center gap-2 text-[16px] main-font-thin bg-gradient-to-r bg-blue-400 text-white px-3 rounded-full transition-all duration-200 cursor-pointer mt-[12px] h-8"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{selectedFloor}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-24 overflow-hidden">
                  {floors.map((floor) => (
                    <button
                      key={floor}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm main-font-thin transition-colors"
                      onClick={() => {
                        setSelectedFloor(floor)
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
                <Badge className='rounded-full h-8 m-auto mt-[12px] ml-1 mr-0 bg-gray-400'>
                    <span>企画数 12</span>
                </Badge>
            </div>
        </div>
        <div className='w-full'>
            <MiniMap/>
        </div>
        <div className='w-full flex mt-3'>
            <Button 
              className='w-full h-10 m-auto flex items-center justify-center gap-1 rounded-full bg-blue-400 text-[15px]'
              onClick={handleDetailClick}
            >
                <span className='main-font-thin'>詳細</span>
                <ChevronRight className='h-6 mt-[1px]'/>
            </Button>
        </div>
        <div className='w-full h-20 '>
            <ProjectCardMini/>
            <ProjectCardMini/>
            <ProjectCardMini/>

        </div>
    </div>
  )
}

export default BuildingFloorInfo