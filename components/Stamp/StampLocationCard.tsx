"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { MapPin, Map, Play, HelpCircle, Camera, QrCode } from 'lucide-react'
import Image from 'next/image'
import { Card, CardContent } from '../ui/card'
import { useRouter } from 'next/navigation'

interface StampLocationCardProps {
  stampNumber: number
  locationName: string
  photoPath: string
  acquisitionMethod: string
  mapPath?: string
}

const StampLocationCard: React.FC<StampLocationCardProps> = ({
  stampNumber,
  locationName,
  photoPath,
  acquisitionMethod,
  mapPath
}) => {
  const router = useRouter();
  const getAcquisitionMethodIcon = () => {
    switch (acquisitionMethod) {
      case 'quiz':
        return <HelpCircle className="w-4 h-4" />
      case 'video':
        return <Play className="w-4 h-4" />
      case 'qr':
        return <QrCode className="w-4 h-4" />
      case 'photo':
        return <Camera className="w-4 h-4" />
    }
  }

  const getAcquisitionMethodText = () => {
    switch (acquisitionMethod) {
      case 'quiz':
        return 'クイズに答える'
      case 'video':
        return '映像を見る'
      case 'qr':
        return 'QRコードを読み取る'
      case 'photo':
        return '写真を撮る'
    }
  }

  const getAcquisitionMethodColor = () => {
    switch (acquisitionMethod) {
      case 'quiz':
        return 'bg-green-400 hover:bg-green-600'
      case 'video':
        return 'bg-purple-400 hover:bg-purple-600'
      case 'qr':
        return 'bg-orange-400 hover:bg-orange-600'
      case 'photo':
        return 'bg-pink-400 hover:bg-pink-600'
    }
  }

  const getBadgeColor = () => {
    switch (acquisitionMethod) {
      case 'quiz':
        return 'bg-green-400'
      case 'video':
        return 'bg-purple-400'
      case 'qr':
        return 'bg-orange-400'
      case 'photo':
        return 'bg-pink-400'
    }
  }

  return (
    <Card className='border-[1px] border-gray-200 h-full flex flex-col'>
        <CardContent className='p-0 h-full flex flex-col'>
        <div className="w-full h-25 relative flex items-center justify-center">
          <Image
            src={photoPath}
            alt={locationName}
            width={100}
            height={100}
            className="object-cover rounded-t-md"
            sizes="100vw"
          />
          <div className="absolute top-0 left-0 bg-amber-300 rounded-tl-md rounded-br-[5px] px-3 py-1 text-xs font-bold text-gray-700 shadow">
            {stampNumber}
          </div>
        </div>
        
        {/* 情報部分 */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="text-sm font-semibold text-gray-800 mb-0.5 main-font-thin">
            {locationName}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            {getAcquisitionMethodIcon()}
            <span className="text-xs text-gray-600">{getAcquisitionMethodText()}</span>
          </div>
          <div className='mt-auto'>
            <button
              className={`w-full rounded-[10px] h-8 active:scale-[0.98] transition ${mapPath ? 'bg-blue-300' : 'bg-gray-300 cursor-not-allowed'}`}
                    aria-live="polite"
                    disabled={!mapPath}
                    onClick={() => { if (mapPath) router.push(mapPath); }}
            >
              <span className='main-font-thin text-xs'>マップを見る</span>
            </button>
          </div>
        </div>
        </CardContent>
    </Card>
  )
}

export default StampLocationCard
