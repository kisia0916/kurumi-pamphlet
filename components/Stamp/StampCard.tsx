import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Gift, Info } from 'lucide-react'
import { StampData, UserStampData } from '@/app/stamp/page'

type Props = {
  stampedIds?: number[]
}

function StampCard(props:{stamp_data:StampData[],user_stamp_data:UserStampData[]}) {
  const [display_stamp,set_display_stamp] = useState<{stamp:StampData,stamped:boolean}[]>([])
  useEffect(()=>{
    const new_display_data:{stamp:StampData,stamped:boolean}[] = props.stamp_data.map((s:StampData)=>{
        if (props.user_stamp_data.find(us=>us.stampPlaceId === s.id)){
            return {stamp:s, stamped:true}
        }else{
            return {stamp:s, stamped:false}
        }
    })
    console.log(props.user_stamp_data)
    const sorted_display = [...new_display_data].sort((a,b)=> a.stamp.index - b.stamp.index)
    set_display_stamp(sorted_display)
  },[props.stamp_data, props.user_stamp_data])
  return (
          <Card className='w-[97%] min-h-[262px] bg-yellow-200 relative overflow-hidden border-[1px] border-gray-200'>
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
              {/* ローディング表示 or スタンプリスト */}
              {display_stamp.length === 0 ? (
                <div className="w-full h-[180px] flex items-center justify-center">
                  <span className="text-gray-500">読み込み中…</span>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-y-3 w-full">
                  {display_stamp.map((s, idx) => (
                    <div key={idx} className="w-1/3 flex justify-center">
                      <button
                          type="button"

                          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-200 select-none border-2 ${
                            s.stamped ? 'border-amber-400 bg-amber-50' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {!s.stamped?
                              <span className={`text-2xl ${s.stamped ? 'text-amber-700' : 'text-gray-400'}`}>{s.stamp.index}</span>:<></>
                          }
                          {s.stamped && (
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="text-amber-700 font-bold text-xl rotate-12  tracking-widest">済</span>
                            </span>
                          )}
                        </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 更新注意メッセージ */}
              <div className="w-full flex justify-center mt-3">
                <div className="flex items-start gap-1 text-[11px] text-gray-500 leading-snug">
                  <Info className="w-3.5 h-3.5 mt-[2px] flex-shrink-0 text-gray-400" />
                  <p className="main-font-thin">
                    スタンプが反映されない場合は、ページを再読み込みすると更新される場合があります。
                  </p>
                </div>
              </div>

            </CardContent>
                <div className='w-full flex relative z-20 mb-6 px-4'>
                  <div className='mx-auto max-w-[92%] bg-white rounded-full border border-gray-200  px-4 py-2 flex items-center gap-2'>
                    <Gift className='w-4 h-4 text-amber-500 flex-shrink-0' />
                    <div className='flex-1 text-center leading-tight'>
                      <p className='main-font-thin text-[13px] text-gray-800'>すべて集めて景品と交換</p>
                      <p className='main-font-thin text-[10px] text-gray-500'>（景品には限りがあります）</p>
                    </div>
                  </div>
                </div>
          </Card>
          
    )
}

export default StampCard