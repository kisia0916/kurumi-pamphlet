"use client"
import MapContentsList from '@/components/Map/MapContentsList';
import SearchBox from '@/components/Map/SearchBox';
import React, { useEffect, useRef, useState } from 'react'
import Map from 'react-map-gl/mapbox'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

const MinHeight = 300;

function page() {
  const [selected, setSelected] = useState<string | null>(null);

  // ピンのデータ（絶対座標ではなく画像に対する相対位置）
  const pins = [
    { id: '1', label: '1F 教室A', x: 30, y: 40 }, // x: 30%, y: 40%
    { id: '2', label: '2F 音楽室', x: 60, y: 70 },
  ];



  return (
    <div className='w-full' style={{ height: "calc(100dvh - 60px)" }}>
        <SearchBox />

      <div className='w-full z-10' >
        <TransformWrapper
        initialScale={1.5}
        centerOnInit
        velocityAnimation={{ disabled: false }}
        >
        <TransformComponent>
            <div className="w-full h-[300px] flex items-center justify-center">
            <div className="relative w-[100%] max-w-[100%] ">
                <img
                src="/map_data/main2.png"
                alt="School Map"
                className="w-full h-full object-contain"
                draggable={false}
                />

                {/* ピン */}
                {pins.map((pin) => (
                <button
                    key={pin.id}
                    type="button"
                    className="absolute z-10 cursor-pointer focus:outline-none"
                    style={{
                    top: `${pin.y}%`,
                    left: `${pin.x}%`,
                    transform: 'translate(-50%, -100%)',
                    }}
                    onClick={() => setSelected(pin.label)}
                    aria-label={pin.label}
                >
                    <span className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg block" />
                </button>
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
      {/*以下詳細表示ゾーン */}
        <MapContentsList/>
    </div>
  )
}

export default page