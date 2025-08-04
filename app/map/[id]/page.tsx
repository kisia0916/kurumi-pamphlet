"use client"

import Map from '@/components/Map/Map';
import MapContentsList from '@/components/Map/MapContentsList'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useTitle } from '@/contexts/TitleContext'

// Building型の定義 - MapContentsListと互換性を持たせる
type Building = {
  id: number;
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

// Floor型の定義
type Floor = {
  id: number;
  floor_num: number;
  building: Building;
  projects: any[];
};

// Project型の定義
type Project = {
  id: number;
  name: string;
  picture: string;
  tag: string[];
  floor: Floor;
  building: Building;
};

// id_typeから適切なreqTypeに変換する関数
const getReqTypeFromIdType = (idType: string): string => {
  switch (idType) {
    case 'H':
      return 'Home'
    case 'B':
      return 'Building';
    case 'F':
      return 'Floor';
    case 'P':
      return 'Project';
    default:
      return 'Building';
  }
};

function page() {
  const content_id = useParams<{id:string}>()
  const id_type = content_id.id[0]
  const element_id = content_id.id.slice(1)
  const { setTitle, setShowBackButton } = useTitle()
  
  const [elementData, setElementData] = useState<Building | Floor | Project | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchElementData = async () => {
      try {
        setLoading(true);
        const reqType = getReqTypeFromIdType(id_type);
        if (reqType === 'Home') {
          const response = await fetch('/api/get_buildings', {
            cache: 'force-cache',
            headers: {
              'Cache-Control': 'max-age=259200', // 3日 = 259200秒
            },
          });
          if (!response.ok) {
            throw new Error('データの取得に失敗しました');
          }
          const data = (await response.json()).reverse();

          setBuildings(data);
        }else{
          const response = await fetch('/api/get_element_by_id', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: element_id,
              reqType: reqType
            })
          });
          
          if (!response.ok) {
            throw new Error('データの取得に失敗しました');
          }
          
          const data = await response.json();
          setElementData(data);
          
          // reqTypeに応じて表示用のbuildingsデータを設定
          if (reqType === 'Building') {
            console.log('Building data:', data);
            // Building型に合わせて_countプロパティを確実に含める
            const buildingData = {
              ...data,
              _count: data._count || { projects: data.projects?.length || 0, floors: data.floors?.length || 0 }
            };
            setBuildings([buildingData]);
          } else if (reqType === 'Floor') {
            // 建物情報を取得し、Building型の形式に変換
            const buildingData = {
              ...data.building,
              _count: data.building._count || { 
                projects: data.building.projects?.length || 0, 
                floors: data.building.floors?.length || 0 
              }
            };
            setBuildings([buildingData]);
          } else if (reqType === 'Project') {
            // 建物情報を取得し、Building型の形式に変換
            const buildingData = {
              ...data.building,
              _count: data.building._count || { 
                projects: data.building.projects?.length || 0, 
                floors: data.building.floors?.length || 0 
              }
            };
            setBuildings([buildingData]);
          }
        }
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError('データを読み込めませんでした');
      } finally {
        setLoading(false);
      }
    };
    
    fetchElementData();
  }, [id_type, element_id]);
  
  // 表示用のタイトルを要素のタイプに基づいて生成
  const getTitle = () => {
    if (loading) return '読み込み中...';
    if (error) return 'エラー';
    if (buildings.length === 0) return '情報なし';
    
    // id_typeに基づいてタイトルを設定
    switch (id_type) {
      case 'B':
        return buildings[0]?.name || '建物情報';
      case 'F':
        return `${buildings[0]?.name || '建物'} ${elementData ? `- ${(elementData as Floor).floor_num}階` : ''}`;
      case 'P':
        return (elementData as Project)?.name || 'プロジェクト情報';
      case 'H':
        return '校舎一覧';
      default:
        return '詳細情報';
    }
  };

  // タイトルをContextに設定
  useEffect(() => {
    const title = getTitle();
    setTitle(title);
    
    // id_typeがHの場合は戻るボタンを非表示、それ以外は表示
    setShowBackButton(id_type !== 'H');
  }, [loading, error, buildings, elementData, id_type, setTitle, setShowBackButton]);

  return (
    <div className='w-full'>
      <MapContentsList
        content_id={content_id.id}
        content_type={getReqTypeFromIdType(id_type) as "Home" | "Building" | "Floor" | "Project"}
        title={getTitle()}
        buildings={buildings}
        loading={loading}
        error={error}
      />
    </div>
  )
}

export default page