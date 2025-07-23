"use client"
import Map from '@/components/Map/Map';
import MapContentsList from '@/components/Map/MapContentsList';
import MapPin from '@/components/Map/MapPin';
import SearchBox from '@/components/Map/SearchBox';
import React, { useEffect, useRef, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

// APIから取得する建物データの型
type Building = {
  id: number;
  name: string;
  status: 'hard' | 'middle' | 'empty';
  picture: string;
  _count: {
    projects: number;
    floors: number;
  };
};

function page() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // APIからデータ取得
    const fetchBuildings = async () => {
      try {
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
      } catch (err) {
        console.error('建物データ取得エラー:', err);
        setError('建物データを読み込めませんでした');
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  return (
    <div className='w-full'>
      <div className='w-full z-10' >
        <Map/>
      </div>
      <MapContentsList content_id='' title='校舎一覧' buildings={buildings} loading={loading} error={error} />
    </div>
  )
}

export default page