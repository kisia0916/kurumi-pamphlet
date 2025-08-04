"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Plus, Stamp } from 'lucide-react'
import StampLocationCard from '@/components/Stamp/StampLocationCard'

function page() {
  return (
    <div className='w-full overflow-hidden'>
      <div className='w-full h-17 flex'>
        <p className='main-font-thin text-2xl m-auto ml-5'>スタンプ</p>
      </div>
      <div className="w-full  overflow-y-scroll" style={{ height: "calc(100dvh - 130px)" }}>
        <div className='w-full flex flex-col items-center p-3'>
          <Card className='w-[97%] bg-yellow-200 relative overflow-hidden'>
            {/* 斜めストライプの背景 */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  white 0px,
                  white 5px,
                  transparent 2px,
                  transparent 12px
                )`
              }}
            />
            <CardContent className='p-6 relative z-10 pb-0'>
              {/* スタンプグリッド */}
              <div className="grid grid-cols-4 gap-4 w-full">
                {/* 1 */}
                <div className="w-18 h-18 border-2 border-gray-300 rounded-full bg-white flex items-center justify-center mx-auto">
                  <span className="text-2xl text-gray-400">1</span>
                </div>
                {/* 2 */}
                <div className="w-18 h-18 border-2 border-gray-300 rounded-full bg-white flex items-center justify-center mx-auto">
                  <span className="text-2xl text-gray-400">2</span>
                </div>
                {/* 4 */}
                <div className="w-18 h-18 border-2 border-gray-300 rounded-full bg-white flex items-center justify-center mx-auto">
                  <span className="text-2xl text-gray-400">4</span>
                </div>
                {/* Gift */}
                <div className="w-18 h-18 border-2 border-gray-300 rounded-full bg-white flex items-center justify-center mx-auto">
                  <span className="text-2xl text-gray-400">5</span>
                </div>
                <div className="w-18 h-18 border-2 border-gray-300 rounded-full bg-white flex items-center justify-center mx-auto">
                  <span className="text-2xl text-gray-400">6</span>
                </div>
                <div className="w-18 h-18 border-2 border-gray-300 rounded-full bg-white flex items-center justify-center mx-auto">
                  <span className="text-2xl text-gray-400">7</span>
                </div>
                <div className="w-18 h-18 border-2 border-amber-300 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
                  <Gift className="w-8 h-8 text-amber-600" />
                </div>
              </div>

            </CardContent>
                <div className='w-full flex relative z-20 mb-6'>
                <div className='w-[60%] bg-white m-auto rounded-full flex'>
                  <span className='main-font-thin m-auto text-[12px] text-gray-600 '>番号をタップして詳細を確認</span>
                </div>
                </div>
          </Card>
          
          {/* スタンプ追加ボタン */}
          <Button 
            className='w-[97%] h-12 mt-4 bg-amber-400 hover:bg-amber-600 text-white rounded-full '
            onClick={() => {
              // スタンプ追加の処理をここに書く
              console.log('スタンプを追加');
            }}
          >
            <Stamp className="w-5 h-5" />
            スタンプを押す
          </Button>
        </div>
        <div className='w-full mb-3'>
          <span className='main-font-thin ml-6'>スタンプ一覧</span>
        </div>
        <div className='w-full grid  grid-cols-2 gap-4 p-4 pt-0'>
          <StampLocationCard
            stampNumber={1}
            locationName="メインエントランス"
            photoPath="/photos/P1030545.JPG"
            acquisitionMethod="quiz"
            onOpenMap={() => {
              console.log('マップを開く - エントランス');
            }}
          />
          <StampLocationCard
            stampNumber={2}
            locationName="学生ホール"
            photoPath="/photos/P1030550.JPG"
            acquisitionMethod="video"
            onOpenMap={() => {
              console.log('マップを開く - 学生ホール');
            }}
          />
          <StampLocationCard
            stampNumber={3}
            locationName="図書館"
            photoPath="/photos/P1030547.JPG"
            acquisitionMethod="qr"
            onOpenMap={() => {
              console.log('マップを開く - 図書館');
            }}
          />
          <StampLocationCard
            stampNumber={4}
            locationName="体育館"
            photoPath="/photos/P1030548.JPG"
            acquisitionMethod="photo"
            onOpenMap={() => {
              console.log('マップを開く - 体育館');
            }}
          />
          <StampLocationCard
            stampNumber={4}
            locationName="体育館"
            photoPath="/photos/P1030548.JPG"
            acquisitionMethod="photo"
            onOpenMap={() => {
              console.log('マップを開く - 体育館');
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default page

