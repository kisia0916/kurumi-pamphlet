import React from 'react'
import HowToBuyCard from './HowToBuyCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card-food'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard, Hamburger, Ticket } from 'lucide-react'

function HowToBuy() {
  return (
    <div className='w-full flex'>
        <div className='w-[93%] m-auto mt-0'>
            

                <Card className="relative z-10 h-full hover:shadow-lg transition-shadow main-font-thin mt-5">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-amber-300 rounded-full flex items-center justify-center mt-1 ">
                      <Check  className="w-8 h-8 text-primary"/>
                    </div>
                    <Badge variant="outline" className="w-fit mx-auto mb-2 border-1 border-amber-300">
                      ステップ {1}
                    </Badge>
                    <CardTitle className="text-xl">販売状況の確認</CardTitle>
                    <CardDescription className="text-base">メニュータブから購入したい商品の販売状況を確認しましょう</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="relative z-10 h-full hover:shadow-lg transition-shadow main-font-thin mt-5">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-amber-300 rounded-full flex items-center justify-center mt-1">
                      <Ticket className="w-8 h-8 text-primary"/>
                    </div>
                    <Badge variant="outline" className="w-fit mx-auto mb-2 border-1 border-amber-300">
                      ステップ {2}
                    </Badge>
                    <CardTitle className="text-xl">食券の購入</CardTitle>
                    <CardDescription className="text-base">各購入口にて食券を購入してください</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="relative z-10 h-full hover:shadow-lg transition-shadow main-font-thin mt-5 ">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-amber-300 rounded-full flex items-center justify-center mt-1 ">
                      <Hamburger className="w-8 h-8 text-primary" />
                    </div>
                    <Badge variant="outline" className="w-fit mx-auto mb-2 border-1 border-amber-300">
                      ステップ {3}
                    </Badge>
                    <CardTitle className="text-xl">商品受け取り</CardTitle>
                    <CardDescription className="text-base">受け取り口に食券を提示して商品を受け取ってください</CardDescription>
                  </CardHeader>
                </Card>
                <div className='h-10'></div>
        </div>
    </div>
  )
}

export default HowToBuy