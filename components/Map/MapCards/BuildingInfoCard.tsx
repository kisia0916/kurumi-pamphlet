import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Calendar, Users } from 'lucide-react'
import React, { use, useEffect, useState } from 'react'
import BuildingFloorInfo from './BuildingFloorInfo'
import { useParams } from 'next/navigation'
import { useTitle } from '@/contexts/TitleContext'

// Prismaスキーマに基づく型定義
type BuildingStatusType = 'hard' | 'middle' | 'empty'| 'unknown'

interface Floor {
  id: string
  createdAt: Date
  building_id: string
  floor_num: number,
  floor_map_img: string
  toilets: string
}

interface Project {
  id: string
  createdAt: Date
  name: string
  tag: string[]
  picture: string
  floor_id: string
  building_id: string
  floor: Floor
}

interface MapPin {
  id: string
  createdAt: Date
  type: 'Building' | 'Room'
  x: number
  y: number
  building_id: string | null
  project_id: string | null
}

interface BuildingStatus {
  id: string
  createdAt: Date
  status: BuildingStatusType
  building_id: string
}

interface BuildingData {
  id: string
  createdAt: Date
  index: number
  name: string
  picture: string
  floors: Floor[]
  projects: Project[]
  mapPins: MapPin[]
  statusHistory: BuildingStatus[]
  _count: {
    floors: number
    projects: number
  }
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

interface StatusApiResponse {
  success: boolean
  message: string
  data: BuildingStatus[]
  count: number
  buildingId: string
  timestamp: string
}

function BuildingInfoCard() {
    const buildingId = useParams().id
    const {setTitle} = useTitle()
    const [buildingData, setBuildingData] = useState<BuildingData | null>(null)
    const [statusData, setStatusData] = useState<BuildingStatus[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [floor_list,set_floor_list] = useState<{floor:number,id:string,map_img:string,toilets:string}[]>([])

  useEffect(()=>{
    const fetchData = async () => {
        try{ 
          setLoading(true)
          console.log(buildingId)
          const buildingResponse = await  fetch(`/api/get_building/${buildingId}`)
        if (!buildingResponse.ok) {
          throw new Error('建物データの取得に失敗しました');
        }
        const buildingResult: ApiResponse<BuildingData> = await buildingResponse.json()

        setBuildingData(buildingResult.data)
        set_floor_list(buildingResult.data.floors.map((floor)=>({floor:floor.floor_num,id:floor.id,map_img:floor.floor_map_img,toilets:floor.toilets})).sort((a,b)=>a.floor-b.floor))

        if (buildingResult.data) {
          setTitle(buildingResult.data.name)
        }
        setLoading(false)

        const statusResponse = await fetch(`/api/get_status/get_one_status/${buildingId}`)
        if (!statusResponse.ok) {
          throw new Error('ステータスデータの取得に失敗しました');
        }
        const statusResult: StatusApiResponse = await statusResponse.json()
        setStatusData(statusResult.data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'データの取得に失敗しました')
      } 
    }
    fetchData();
  }, [buildingId, setTitle])

  // 最新のステータスを取得
  const getLatestStatus = (): BuildingStatusType => {
    if (statusData.length > 0) {
      const latest = statusData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]
      return latest.status
    }
    return 'unknown'
  }

  // ステータスに基づくバッジ情報
  const getStatusBadge = (status: BuildingStatusType) => {
    switch (status) {
      case 'hard':
        return { text: '混雑', className: 'bg-red-500 text-white' }
      case 'middle':
        return { text: '中程度', className: 'bg-yellow-500 text-white' }
      case 'empty':
        return { text: '空いている', className: 'bg-green-500 text-white' }
      default:
        return { text: '不明', className: 'bg-gray-500 text-white' }
    }
  }

  if (loading) {
    return (
      <div className='w-full flex justify-center items-center p-8'>
        <div>読み込み中...</div>
      </div>
    )
  }

  if (error || !buildingData) {
    return (
      <div className='w-full flex justify-center items-center p-8'>
        <div className='text-red-500'>{error || '建物データが見つかりません'}</div>
      </div>
    )
  }

  const currentStatus = getLatestStatus()
  const statusBadge = getStatusBadge(currentStatus)
  return (
    <div className='w-full flex'>
      <div className='w-[96%] m-auto'>
         <div className='w-full flex'>
          <img 
            src={buildingData.picture ? `${buildingData.picture}` : "/photos/P1030548.JPG"} 
            className='w-[98%] h-50 rounded-2xl m-auto bg-amber-200 object-cover'
            alt={buildingData.name}
          />
        </div>
        <div className="w-full mt-4 flex">
            <div className="w-full border-1 border-gray-300 rounded-2xl flex">
              {/* Floor Count */}
              <div className='w-full flex justify-around mt-4 mb-4'>
                <div className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">階層数</p>
                      <p className="text-lg font-bold text-gray-900">{buildingData._count.floors}階</p>
                    </div>
                  </div>
                </div>

                {/* Project Count */}
                <div className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">企画数</p>
                      <p className="text-lg font-bold text-gray-900">{buildingData._count.projects}件</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">混雑度合</p>
                      <Badge
                        className={`${statusBadge.className} text-xs px-2 py-1 rounded-full`}
                      >
                        {statusBadge.text}
                      </Badge>
                    </div>
                  </div>
                </div>
            </div>
          </div>       
      </div>
      <div className='w-full mt-3'>
        <BuildingFloorInfo floor_list={floor_list}/>
      </div>
      </div>
    </div>
  )
}

export default BuildingInfoCard