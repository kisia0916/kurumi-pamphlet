import React, { useEffect, useRef, useState } from 'react';

import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import MapPinComponent from './MapPin';
import { Buildings, Floor,Projects } from '@prisma/client';
import { Badge } from '@/components/ui/badge';

export interface MapPinData {
  id: string;
  createdAt: string;
  type: 'Building' | 'Room';
  x: number;
  y: number;
  building_id?: string
  project_id?: string
  floor_id?: string
  building?: Buildings
  floor?:Floor
  project?:Projects
}


function MiniMap(props:{map_img:string,floor_id:string,status:"hard"|"empty"|"middle"|"unknown"}) {
    const [miniMapPins, setMiniMapPins] = useState<MapPinData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const zoomRef = useRef<ReactZoomPanPinchRef | null>(null)
    const imgRef = useRef<HTMLImageElement | null>(null)

    useEffect(() => {
      // APIからBuildingタイプのピンデータを取得
      const fetchBuildingPins = async () => {
        try {
            const response = await fetch(`/api/get_map_pin/get_floor_project_pin/${props.floor_id}`);
          if (!response.ok) {
            throw new Error('ピンデータの取得に失敗しました');
          }
          const data: {data:MapPinData[]} = await response.json();
          console.log(data.data[0].project?.room_name)
          setMiniMapPins(data.data)
        } catch (err) {
          console.error('建物ピン取得エラー:', err);
          setError('ピンデータの読み込みに失敗しました');
        } finally {
          setLoading(false);
        }
      };
      
      fetchBuildingPins();
    }, [props.floor_id]);
    
    useEffect(()=>{
    if (!zoomRef.current || !imgRef.current) return
    try {
      zoomRef.current.zoomToElement(imgRef.current, 1.2)
    } catch (err) {
      console.error("zoomToElement エラー:", err)
    }
    },[])

    const statusLabel =
      props.status === 'hard' ? '混雑' :
      props.status === 'middle' ? 'やや混雑' :
      props.status === 'empty' ? '空き' : '不明';

    // ステータスに応じて色を切替
    const statusClass =
      props.status === 'hard' ? 'bg-red-400 text-white' :
      props.status === 'middle' ? 'bg-amber-400 text-white' :
      props.status === 'empty' ? 'bg-green-400 text-white' :
      'bg-gray-400 text-white';
  return (
    <div className='w-full z-10'>
        <div className='w-full h-[200px] bg-gray-50 rounded-2xl border-[1px] border-gray-200 mt-2 overflow-hidden relative'>
            {/* 右上ステータス（パン/ズーム操作に干渉しないよう pointer-events-none） */}
            <div className="absolute top-2 left-2 z-20 pointer-events-none">
              <Badge className={`h-7 pointer-events-none ${statusClass} rounded-full`}>{statusLabel}</Badge>
            </div>
            <TransformWrapper
            ref={zoomRef}
            initialScale={1}
            centerOnInit
            velocityAnimation={{ disabled: false }}
            >
            <TransformComponent>
                <div className="w-full h-[200px] flex items-center justify-center">
                <div className="relative w-[100%] max-w-[100%] ">
                    <img
                    src={props.map_img}
                    ref={imgRef}
                    alt="School Map"
                    className="w-full h-full object-contain"
                    draggable={false}
                    />

                    {/* ピン */}
                    {loading ? (
                    // ローディング中表示
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                    </div>
                    ) : error ? (
                    // エラー表示
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500">
                        {error}
                    </div>
                    ) : miniMapPins.length === 0 ? (
                    // ピンがない場合
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                        ピンデータがありません
                    </div>
                    ) : (
                    // ピンの表示
                    miniMapPins.map((pin:MapPinData, i: number) => (
                        <MapPinComponent key={i} pin={pin}  pic_url={pin.project?.picture} pin_title={pin.project?.room_name} room_name={pin.project?.room_name} size="ss" is_set_floor_id={false}/>
                    ))
                    )}
                </div>
                </div>
            </TransformComponent>
            </TransformWrapper>
        </div>



    </div>
  )
}
export default MiniMap