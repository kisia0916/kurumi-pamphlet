import React, { useEffect, useState } from 'react';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import MapPinComponent from './MapPin';
import { Buildings, Floor,Projects } from '@prisma/client';

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


function MiniMap(props:{map_img:string,floor_id:string}) {
    const [miniMapPins, setMiniMapPins] = useState<MapPinData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    
    
  return (
    <div className='w-full z-10'>
        <div className='w-full h-[200px] bg-gray-50 rounded-2xl border-[1px] border-gray-200 mt-2'>
            <TransformWrapper
            initialScale={1.2}
            centerOnInit
            velocityAnimation={{ disabled: false }}
            >
            <TransformComponent>
                <div className="w-full h-[200px] flex items-center justify-center">
                <div className="relative w-[100%] max-w-[100%] ">
                    <img
                    src={props.map_img}
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