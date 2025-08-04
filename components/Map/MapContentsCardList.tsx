import React from 'react'
import BuildingInfoCardSkeleton from './MapCards/BuildingInfoCardSkeleton'
import BuildingInfoCardMini from './MapCards/BuildingInfoCardMini';
import BuildingInfoCard from './MapCards/BuildingInfoCard';

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
  content_type: "Home" | "Building" | "Floor" | "Project";
}

function BuildinginfoList({ buildings, loading, error, content_type }: BuildingInfoListProps) {

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
      {content_type === "Home" ? (
        buildings.length === 0 ? (
          <div>表示する建物情報がありません</div>
        ) : (
          buildings.map(building => (
            <BuildingInfoCardMini
              key={building.id}
              id={building.id}
              name={building.name} 
              content_num={building._count.projects} 
              pic_url={building.picture} 
              flower={building._count.floors} 
              congestion={statusToCongestion(building.status)} 
            />
          ))
        )
      ) : content_type === "Building" ? (
        <BuildingInfoCard/>
      ) : content_type === "Floor" ? (
        <span>hello Floor</span>
      ) : content_type === "Project" ? (
        <span>hello Project</span>
      ) : null}
    </div>
  );
}

export default BuildinginfoList