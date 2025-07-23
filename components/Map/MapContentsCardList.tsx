import React from 'react'
import BuildingInfoCard from './MapCards/BuildingInfoCard'
import BuildingInfoCardSkeleton from './MapCards/BuildingInfoCardSkeleton'

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

// ステータスをCongestion型にマッピング
const statusToCongestion = (status: 'hard' | 'middle' | 'empty'): '混雑' | 'やや混雑' | '空いている' => {
  switch(status) {
    case 'hard': return '混雑';
    case 'middle': return 'やや混雑';
    case 'empty': return '空いている';
  }
};

interface BuildingInfoListProps {
  buildings: Building[];
  loading: boolean;
  error: string | null;
}

function BuildinginfoList({ buildings, loading, error }: BuildingInfoListProps) {

  if (loading) {
    return (
      <div className='w-[90%] h-full m-auto'>
        {/* 複数のスケルトンを表示 */}
        <BuildingInfoCardSkeleton />
        <BuildingInfoCardSkeleton />
        <BuildingInfoCardSkeleton />
        <BuildingInfoCardSkeleton />
      </div>
    );
  }

  if (error) {
    return <div className='w-[90%] h-full m-auto'>エラー: {error}</div>;
  }

  return (
    <div className='w-[90%] h-full m-auto'>
      {buildings.length === 0 ? (
        <div>表示する建物情報がありません</div>
      ) : (
        buildings.map(building => (
          <BuildingInfoCard 
            key={building.id}
            id={building.id}
            name={building.name} 
            content_num={building._count.projects} 
            pic_url={building.picture} 
            flower={building._count.floors} 
            congestion={statusToCongestion(building.status)} 
          />
        ))
      )}
    </div>
  );
}

export default BuildinginfoList