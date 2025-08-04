import { ChevronDown, ChevronUp, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import MapContentsCardList from './MapContentsCardList';
import { useTitle } from '@/contexts/TitleContext';

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

interface MapContentsListProps {
  content_id: string;
  title: string;
  buildings: Building[];
  loading: boolean;
  error: string | null;
  content_type: "Home" | "Building" | "Floor" | "Project";
}

function MapContentsList({ content_id,  title, buildings, loading, error, content_type }: MapContentsListProps) {
  const { setTitle, setHeight,setIsExpanded } = useTitle();

  // コンポーネントがマウントされた際にタイトルと高さを更新
  useEffect(() => {
    setTitle(title);
    
    // content_typeに応じて初期高さを設定
    if (content_type === "Building") {
      setHeight("calc(100dvh - 40px)");
      setIsExpanded(true);
    } else {
      setHeight("calc(100dvh - 80px - 300px)");
    }
  }, [title, content_type, setTitle, setHeight]);

  return (
      <div className='w-full flex overflow-scroll' style={{height:"calc(100% - 125px)"}}>
        <MapContentsCardList content_type={content_type} buildings={buildings} loading={loading} error={error} />
      </div>
  )
}

export default MapContentsList