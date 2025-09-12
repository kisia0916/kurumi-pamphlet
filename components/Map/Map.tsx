import React, { useEffect, useRef } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import { Button } from '../ui/button';
import { Minus, Plus } from 'lucide-react';
import MapPin from './MapPin';
import { MapPinData } from '@/contexts/TitleContext';



function Map(props:{map_img:string,map_pins:MapPinData[],map_zoom:number}) {
  const zoomRef = useRef<ReactZoomPanPinchRef | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  // 親からの map_zoom 変更を中央基準で反映
  useEffect(() => {
    if (!zoomRef.current || !imgRef.current) return
    try {
      zoomRef.current.zoomToElement(imgRef.current, props.map_zoom || 1)
    } catch (err) {
      console.error("zoomToElement エラー:", err)
    }
  }, [props.map_zoom])


  return (
    <div className='w-full z-10'>
      <div className="z-5 flex flex-col absolute mt-[220px] right-5">
        <Button
          variant="outline"
          size="icon"
          className="bg-white shadow-md rounded-b-none"
          onClick={() => zoomRef.current?.zoomIn?.(0.3)}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white shadow-md rounded-t-none border-t-0"
          onClick={() => zoomRef.current?.zoomOut?.(0.3)}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      <TransformWrapper
        ref={zoomRef}
        initialScale={props.map_zoom || 1}
        centerOnInit
        velocityAnimation={{ disabled: false }}
      >
        <TransformComponent>
          <div className="w-full h-[300px] flex items-center justify-center">
            <div className="relative w-[100%] max-w-[100%] ">
              <img
                ref={imgRef}
                src={props.map_img}
                alt="School Map"
                className="w-full h-full object-contain"
                draggable={false}
              />

              {/* ピン */}
              {props.map_pins.length === 0 ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                  ピンデータがありません
                </div>
                ) : (
                props.map_pins.map((pin: MapPinData, i: number) => {
                  if (pin.type === 'Building') {
                  return (
                    <MapPin
                    key={i}
                    pin={pin}
                    size='l'
                    pic_url={pin.building?.picture}
                    pin_title={pin.building?.name}
                    />
                  )
                  }else if (pin.type === 'Room') {
                  return (
                    <MapPin
                    key={i}
                    pin={pin}
                    size='s'
                    room_name={pin.project?.room_name}
                    // 必要に応じて表示したい情報へ変更してください
                    pic_url={pin.project?.picture}
                    pin_title={pin.project?.name}
                    />
                  )
                  }})
              )}
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default Map
