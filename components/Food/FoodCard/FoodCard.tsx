"use client"
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card-food'
import type { FoodData, FoodPlace } from '@prisma/client'
import { AlertCircle, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { FoodStatusLike } from '@/app/food/page'


function FoodCard(props:{food:FoodData; statusOverride?: FoodStatusLike}) {
  // ステータスに応じたアイコンを取得する関数
  const currentStatus: FoodStatusLike = props.statusOverride ?? (props.food.status as FoodStatusLike)
  const StatusText = currentStatus === "AVAILABLE" ? "在庫あり" :
    currentStatus === "FEW" ? "残りわずか" :
    currentStatus === "SOLDOUT" ? "売り切れ" :
    currentStatus === 'LOADING' ? '読み込み中…' : '不明'
  const getStatusIcon = () => {
    switch (currentStatus) {
      case "AVAILABLE":
        return <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
      case "FEW":
        return <AlertTriangle className="h-4 w-4 mr-1" />
      case "SOLDOUT":
        return <XCircle className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }
  useEffect(() => {
    console.log(props.food)
  },[])
  return (
    <Card className="w-full overflow-hidden flex flex-col m-auto border-[1px] border-gray-200">
      <div className="relative h-30 w-[92%] m-auto">
        <Image
          src={props.food.photo}
          alt={props.food.name}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="pt-0 flex-grow">
        <h3 className="text-base font-semibold mb-0 truncate whitespace-nowrap overflow-hidden">{props.food.name}</h3>
        <p className="text-base font-bold text-primary mb-1">
          ¥{props.food.price ? props.food.price.toLocaleString() : "N/A"}
        </p>

        <div className="items-start gap-1 mb-3">
          <div className='flex'>
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
            <p className="text-xs font-medium">アレルゲン</p>
          </div>
          <div className='mt-2'>
            {/* 高さ上限 + はみ出し時スクロール */}
            <div className="h-10 max-h-10 overflow-y-auto pr-1">
              <div className="flex flex-wrap gap-1 mt-1">
                {props.food.allergens.length>0?props.food.allergens.map((allergen) => (
                  <Badge key={allergen} variant="outline" className="text-xs">
                    {allergen}
                  </Badge>
                )):                
                <Badge key={0} variant="outline" className="text-xs">
                    <span>なし</span>
                  </Badge>}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div
          className={`w-full ${
            currentStatus === 'AVAILABLE'
              ? 'bg-green-100'
              : currentStatus === 'FEW'
              ? 'bg-amber-100'
              : currentStatus === 'SOLDOUT'
              ? 'bg-red-100'
              : 'bg-gray-100'
          }`}
        >
          <Badge
            variant="outline"
            className={`text-sm px-2 py-2 font-bold flex items-center w-full h-9 justify-center border-2
              ${
                currentStatus === "AVAILABLE"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : currentStatus === "FEW"
                  ? "border-amber-500 bg-amber-50 text-amber-700"
                  : currentStatus === 'SOLDOUT'
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-400 bg-gray-50 text-gray-700"
              }`}
          >
            {getStatusIcon()}
            <span>
              {StatusText}
            </span>
          </Badge>
        </div>
      </CardFooter>
    </Card>
  )
}

export default FoodCard