"use client"

import React, { useEffect, useState } from 'react'
import { useTitle } from '@/contexts/TitleContext'
import BuildingInfoCard from '@/components/Map/MapCards/BuildingInfoCardMini'

// Building型の定義 - MapContentsListと互換性を持たせる
type Building = {
  id: number;
  index: number;
  name: string;
  status: 'hard' | 'middle' | 'empty';
  picture: string;
  _count: {
    projects: number;
    floors: number;
  };
  // API応答に含まれる追加フィールド（MapContentsListでは使用しない）
  floors?: any[];
  projects?: any[];

};

// BuildingStatus型の定義
type BuildingStatus = {
  id: string;
  createdAt: string;
  status: 'hard' | 'middle' | 'empty';
  building_id: string;
};



function page() {
  const { setTitle, setShowBackButton,setHeight,setMapImg,setMapZoom,setMapPins } = useTitle()
  
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [buildingStatuses, setBuildingStatuses] = useState<BuildingStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle("校舎一覧");
    setMapImg("https://xrsvucyppaxvudgfnmdx.supabase.co/storage/v1/object/public/mappic/map1.png");
    setMapZoom(1)
    setHeight("calc(100dvh - 80px - 300px)");
    const fetchElementData = async () => {
      try {
        setLoading(true);
        
        // 建物データとステータスデータを並行して取得
        const [buildingsResponse, statusResponse,mapPinResponse] = await Promise.all([
          fetch('/api/get_buildings'),
          fetch('/api/get_status/get_all_status'),
          fetch('/api/get_map_pin/get_building_pin')
        ]);
        console.log(buildingsResponse);
        console.log(statusResponse);
        if (!buildingsResponse.ok) {
          throw new Error('建物データの取得に失敗しました');
        }

        if (!statusResponse.ok) {
          throw new Error('ステータスデータの取得に失敗しました');
        }
        if (!mapPinResponse.ok) {
          throw new Error('ピンデータの取得に失敗しました');
        }
        const buildingsData = (await buildingsResponse.json()).reverse();
        const statusData = await statusResponse.json();
        const mapPinData = await mapPinResponse.json();
        // buildingsDataをindexでソート（降順）
        console.log(mapPinData);
        const sortedBuildings = buildingsData.sort((a: Building, b: Building) => a.index- b.index);

        setBuildings(sortedBuildings);
        setBuildingStatuses(statusData.data || []);
        setMapPins({id:"",pin:mapPinData.data});
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError('データを読み込めませんでした');
      } finally {
        setLoading(false);
      }
    };
    
    fetchElementData();
  }, []);
  

  // タイトルをContextに設定
  useEffect(() => {    
    // id_typeがHの場合は戻るボタンを非表示、それ以外は表示
    setShowBackButton(false);
  }, [loading, error, buildings, setTitle, setShowBackButton]);

  // building_idに基づいて最新のステータスを取得する関数
  const getLatestStatus = (buildingId: number): 'hard' | 'middle' | 'empty' => {
    // 該当する建物のステータスを取得（building_idは文字列なので変換）
    const buildingStatusList = buildingStatuses.filter(
      status => status.building_id === buildingId.toString()
    );
    
    // 最新のステータス（createdAtが最新）を取得
    if (buildingStatusList.length > 0) {
      const latestStatus = buildingStatusList.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      return latestStatus.status;
    }
    
    // ステータスが見つからない場合はデフォルトの'empty'を返す
    return 'empty';
  };

  return (
    <div className='w-full flex'>
        <div className='w-[91%] h-full m-auto'>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div>読み込み中...</div>
              </div>
            ) : buildings.length === 0 ? (
              <div>表示する建物情報がありません</div>
            ) : (
              buildings.map(building => (
                <BuildingInfoCard
                  key={building.id}
                  id={building.id}
                  name={building.name}
                  congestion={getLatestStatus(building.id)}
                  pic_url={building.picture}
                  flower={building._count.floors}
                  content_num={building._count.projects}
                />
              ))
            )}
        </div>
    </div>
  )
}

export default page