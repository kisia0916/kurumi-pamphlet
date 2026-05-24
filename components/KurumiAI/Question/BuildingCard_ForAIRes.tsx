"use client"
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'
import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type BuildingMini = {
  id: string
  name: string
  picture: string
  _count?: {
    projects?: number
  }
}

type BuildingCongestion = 'hard' | 'middle' | 'empty' | 'unknown'

type BuildingStatusRow = {
  status?: BuildingCongestion
}

function getStatusInfo(status: BuildingCongestion) {
  switch (status) {
    case 'hard':
      return { color: 'bg-red-400', text: '混' }
    case 'middle':
      return { color: 'bg-yellow-400', text: '中' }
    case 'empty':
      return { color: 'bg-green-400', text: '空' }
    default:
      return { color: 'bg-gray-400', text: '不明' }
  }
}

function BuildingCard_ForAIRes(props: { building_id: string }) {
  const { building_id } = props
  const [building, setBuilding] = React.useState<BuildingMini | null>(null)
  const [status, setStatus] = React.useState<BuildingCongestion>('unknown')

  useEffect(() => {
    let aborted = false
    const run = async () => {
      try {
        if (!building_id) return

        const [buildingRes, statusRes] = await Promise.all([
          fetch(`/api/get_building/${encodeURIComponent(building_id)}`, { cache: 'no-store' }),
          fetch(`/api/get_status/get_one_status/${encodeURIComponent(building_id)}`, { cache: 'no-store' }),
        ])

        if (buildingRes.ok) {
          const buildingJson = await buildingRes.json()
          if (!aborted && buildingJson?.success && buildingJson?.data) {
            setBuilding(buildingJson.data as BuildingMini)
          }
        }

        if (statusRes.ok) {
          const statusJson = await statusRes.json()
          const latestStatus = (statusJson?.data?.[0] as BuildingStatusRow | undefined)?.status
          if (!aborted && latestStatus) {
            setStatus(latestStatus)
          }
        }
      } catch (e) {
        console.error('building card fetch error:', e)
      }
    }

    run()
    return () => {
      aborted = true
    }
  }, [building_id])

  if (!building) {
    return null
  }

  const handleClick = () => {
    try {
      window.dispatchEvent(new Event('kurumi-ai-close'))
    } catch {}
  }

  const statusInfo = getStatusInfo(status)

  return (
    <Link
      href={`/map/building/${building.id}`}
      onClick={handleClick}
      className='w-full flex mt-1 mb-1 main-font-thin justify-between shadow-sm rounded-2xl'
    >
      <div className='flex mt-2 mb-2 ml-2'>
        <div className='w-full flex'>
          <Image
            src={building.picture?.trim()}
            alt={building.name}
            width={76}
            height={76}
            className='w-12 h-12 rounded-[10px] object-cover flex-shrink-0 mt-[1px]'
          />
          <div className='h-full flex grow' style={{ width: 'calc(100% - 80px)' }}>
            <div className='ml-3 mr-0 grow'>
              <p className='text-[16px] line-clamp-1'>{building.name}</p>
              <div className='text-gray-500 text-[14px] mt-1 flex items-center gap-2'>
                <span>企画数 {building._count?.projects ?? 0}件</span>
                <Badge className={statusInfo.color}>
                  <span>{statusInfo.text}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex h-full'>
        <ChevronRight className='m-auto mt-5 mr-1 text-gray-700 transition-colors w-5' />
      </div>
    </Link>
  )
}

export default BuildingCard_ForAIRes
