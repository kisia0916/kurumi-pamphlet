"use client"
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card-food'
import { AlertCircle, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type FoodItem = {
  id: string; // PrismaのUUIDに合わせてString型に変更
  name: string;
  category: string;
  sales_status: "在庫あり" | "残りわずか" | "売り切れ"; // Prismaのsales_statusに合わせて変更
  allergens: string[];
  photo: string; // Prismaのphotoに合わせて変更
  amount: number; // Prismaのamountに合わせて変更
};


function FoodCard({ food }: { food: FoodItem }) {
  // ステータスに応じたアイコンを取得する関数
  const getStatusIcon = () => {
    switch (food.sales_status) {
      case "在庫あり":
        return <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
      case "残りわずか":
        return <AlertTriangle className="h-4 w-4 mr-1" />
      case "売り切れ":
        return <XCircle className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  return (
    <Card className="w-full overflow-hidden flex flex-col m-auto">
      <div className="relative h-30 w-[92%] m-auto">
        <Image
          src={"/photos/food1.jpg"}
          alt={food.name}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="pt-0 flex-grow">
        <h3 className="text-base font-semibold mb-0">{food.name}</h3>
        <p className="text-base font-bold text-primary mb-1">
          ¥{food.amount ? food.amount.toLocaleString() : "N/A"}
        </p>
        <p className="text-sm text-muted-foreground mb-2">カテゴリー: {food.category}</p>

        <div className="flex items-start gap-1 mb-3">
          <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-xs font-medium">アレルゲン:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {food.allergens.map((allergen) => (
                <Badge key={allergen} variant="outline" className="text-xs">
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div
          className={`w-full bg-${food.sales_status === "在庫あり" ? "green-100" : food.sales_status === "残りわずか" ? "amber-100" : "red-100"}`}
        >
          <Badge
            variant={food.sales_status === "残りわずか" ? "secondary" : food.sales_status === "在庫あり" ? "default" : "destructive"}
            className="text-sm px-2 py-2 font-bold flex items-center w-full h-9 justify-center border-2 border-green-500 bg-white"
          >
            {getStatusIcon()}
            <span className="text-green-500">{food.sales_status}</span>
          </Badge>
        </div>
      </CardFooter>
    </Card>
  )
}

export default FoodCard