"use client"
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card-food'
import type { FoodData, FoodPlace } from '@prisma/client'
import { AlertCircle, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect } from 'react'


function FoodCard(props:{food:FoodData}) {
  // ステータスに応じたアイコンを取得する関数
  const StatusText = props.food.status === "AVAILABLE" ? "在庫あり" :
    props.food.status === "FEW" ? "残りわずか" :
    props.food.status === "SOLDOUT" ? "売り切れ" : "不明"
  const getStatusIcon = () => {
    switch (props.food.status) {
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
    <Card className="w-full overflow-hidden flex flex-col m-auto">
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
        <h3 className="text-base font-semibold mb-0">{props.food.name}</h3>
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
          className={`w-full bg-${props.food.status === "AVAILABLE" ? "green-100" : props.food.status === "FEW" ? "amber-100" : "red-100"}`}
        >
          <Badge
            variant="outline"
            className={`text-sm px-2 py-2 font-bold flex items-center w-full h-9 justify-center border-2
              ${
                props.food.status === "AVAILABLE"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : props.food.status === "FEW"
                  ? "border-amber-500 bg-amber-50 text-amber-700"
                  : "border-red-500 bg-red-50 text-red-700"
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