import React, { useState, useEffect } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import MapPin from './MapPin';
import { Button } from '../ui/button';
import { Minus, Plus } from 'lucide-react';

// APIからのレスポンス型定義
type BuildingPinResponse = {
  id: number;
  createdAt: string;
  type: 'Building';
  x: number;
  y: number;
  building_id: number | null;
  project_id: number | null;
  building: {
    id: number;
    name: string;
    picture: string;
    status: 'hard' | 'middle' | 'empty';
    _count: {
      projects: number;
      floors: number;
    };
  } | null;
};

// Mapコンポーネント用のピン型
type MapPinData = {
  id: string;
  label: string;
  pic_url: string;
  x: number;
  y: number;
};

function Map() {
    const [selected, setSelected] = useState<string | null>(null);
    const [buildingPins, setBuildingPins] = useState<MapPinData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      // APIからBuildingタイプのピンデータを取得
      const fetchBuildingPins = async () => {
        try {
            const response = await fetch('/api/get_building_pins', {
            headers: {
              'Cache-Control': 'max-age=259200', // 3日(秒)
            },
            });
          if (!response.ok) {
            throw new Error('ピンデータの取得に失敗しました');
          }
          const data: BuildingPinResponse[] = await response.json();
          
          // APIレスポンスをMapPinData形式に変換
          const pins: MapPinData[] = data.map(pin => ({
            id: pin.id.toString(),
            label: pin.building?.name || '不明な建物',
            pic_url: pin.building?.picture || 'test.jpg',
            x: pin.x,
            y: pin.y,
          }));
          
          setBuildingPins(pins);
        } catch (err) {
          console.error('建物ピン取得エラー:', err);
          setError('ピンデータの読み込みに失敗しました');
        } finally {
          setLoading(false);
        }
      };
      
      fetchBuildingPins();
    }, []);
    
    
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
                {loading ? (
                  // ローディング中表示
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                  </div>
                ) : error ? (
                  // エラー表示
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500">
                    {error}
                  </div>
                ) : buildingPins.length === 0 ? (
                  // ピンがない場合
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                    ピンデータがありません
                  </div>
                ) : (
                  // ピンの表示
                  buildingPins.map((pin: MapPinData, i: number) => (
                    <MapPin key={i} pin={pin} setSelected={setSelected} pic_url={pin.pic_url} pin_title={pin.label}/>
                  ))
                )}
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