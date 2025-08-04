"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { MapPin, Map, Play, HelpCircle, Camera, QrCode } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'

interface StampLocationCardProps {
  stampNumber: number
  locationName: string
  photoPath: string
  acquisitionMethod: 'quiz' | 'video' | 'qr' | 'photo'
  onOpenMap?: () => void
}

const StampLocationCard: React.FC<StampLocationCardProps> = ({
  stampNumber,
  locationName,
  photoPath,
  acquisitionMethod,
  onOpenMap
}) => {
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
    <Card>
        <CardContent className='p-0'>
        <div className="w-full h-25 relative">
          <Image
            src={photoPath}
            alt={locationName}
            fill
            className="object-cover rounded-t-md"
            sizes="100vw"
          />
          <div className={`absolute ${getBadgeColor()} rounded-tl-md rounded-br-[5px] px-3 py-1 text-xs font-bold text-white shadow`}>
            {stampNumber}
          </div>
        </div>
        
        {/* 情報部分 */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-0.5 main-font-thin">
            {locationName}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            {getAcquisitionMethodIcon()}
            <span className="text-xs text-gray-600">{getAcquisitionMethodText()}</span>
          </div>
          <Button 
            size="sm"
            className="w-full h-8 bg-blue-500 hover:bg-blue-600 text-white text-xs flex items-center justify-center gap-1"
            onClick={onOpenMap}
          >
            <Map className="w-3 h-3" />
            マップで確認
          </Button>
        </div>
        </CardContent>
    </Card>
  )
}

export default StampLocationCard
