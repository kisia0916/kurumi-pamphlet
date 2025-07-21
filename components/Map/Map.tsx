import React, { useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import MapPin from './MapPin';
import { Button } from '../ui/button';
import { Minus, Plus } from 'lucide-react';

function Map() {
    const [selected, setSelected] = useState<string | null>(null);

    // ピンのデータ（絶対座標ではなく画像に対する相対位置）
    const pins = [
    { id: '1', label: '1F 教室A', x: 38, y: 38 }, // x: 30%, y: 40%
    { id: '2', label: '2F 音楽室', x: 66, y: 60 },
    { id: '3', label: '2F 音楽室', x: 44, y: 54 },
    { id: '3', label: '2F 音楽室', x: 63, y: 36 },
    ];
    
    
  return (
    <div className='w-full z-10'>
        <div className="z-5 flex flex-col absolute mt-[220px] right-5">
          <Button variant="outline" size="icon" className="bg-white shadow-md rounded-b-none">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white shadow-md rounded-t-none border-t-0">
            <Minus className="h-4 w-4" />
          </Button>
        </div>
        <TransformWrapper
        initialScale={1}
        centerOnInit
        velocityAnimation={{ disabled: false }}
        >
        <TransformComponent>
            <div className="w-full h-[300px] flex items-center justify-center">
            <div className="relative w-[100%] max-w-[100%] ">
                <img
                src="/map_data/map3.png"
                alt="School Map"
                className="w-full h-full object-contain"
                draggable={false}
                />

                {/* ピン */}
                {pins.map((pin,i) => (
                    <MapPin key={i} pin={pin} setSelected={setSelected}/>
                ))}
            </div>
            </div>
        </TransformComponent>
        </TransformWrapper>

        {selected && (
            <div className="fixed bottom-10 left-10 bg-white p-4 shadow-md rounded z-50">
            <p>{selected}</p>
            <button onClick={() => setSelected(null)} className="mt-2 px-3 py-1 bg-gray-200 rounded">閉じる</button>
            </div>
        )}

    </div>
  )
}

export default Map