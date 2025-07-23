import { ChevronDown, ChevronUp, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import MapContentsCardList from './MapContentsCardList';

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
}

function MapContentsList({ content_id, title, buildings, loading, error }: MapContentsListProps) {
  const targetRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null)
  const hiddenRef = React.useRef<HTMLImageElement>(null);
  const [now_size_status,set_now_size_status] = useState<boolean>(false)
  const change_size = () => {
    if (barRef.current) {
      barRef.current.style.transition = 'height 0.3s cubic-bezier(0.4,0,0.2,1)';
      if (!now_size_status) {
        barRef.current.style.height = "calc(100dvh - 60px - 80px)";
        set_now_size_status(true);
      } else {
        barRef.current.style.height = "calc(100dvh - 80px - 300px)";
        set_now_size_status(false);
      }
      // Remove transition after animation completes to avoid affecting other height changes
      setTimeout(() => {
        if (barRef.current) {
          barRef.current.style.transition = '';
        }
      }, 300);
    }
  }
  useEffect(()=>{
    if (barRef.current){
        barRef.current.style.height = `calc(100dvh - 80px - 300px)`
    }
  },[barRef])

  const handleChangeHeight = React.useCallback((clientY: number) => {

    if (clientY === 0 || barRef.current === null) return;
    const { bottom } = barRef.current.getBoundingClientRect();
    const diff = Math.round(clientY - bottom);
    barRef.current.style.height = `${diff*-1}px`;
  }, []);

  const handleOnDragStart = React.useCallback(
    ({ dataTransfer }: React.DragEvent<HTMLDivElement>) => {
      if (hiddenRef.current !== null) {
        // ドラッグ時の半透明の表示をなくすため
        dataTransfer.setDragImage(hiddenRef.current, 0, 0);
      }
    },
    []
  );

  const handleOnDrag = React.useCallback(
    ({ clientY }: React.DragEvent) => {

      handleChangeHeight(clientY);
    },
    [handleChangeHeight]
  );
  useEffect(() => {
  const el = targetRef.current;
  if (!el) return;

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      handleChangeHeight(touch.clientY);
    }
  };

  el.addEventListener("touchmove", handleTouchMove, { passive: false });

  return () => {
    el.removeEventListener("touchmove", handleTouchMove);
  };
}, [handleChangeHeight]);

  return (
      <div className='z-6 w-full bg-white rounded-t-3xl absolute bottom-0' ref={barRef}  style={{maxHeight:"calc(100dvh - 60px - 80px)",minHeight:"calc(100dvh - 80px - 300px)",boxShadow: '0px 10px 53px 16px rgba(17,17,26,0.08)'}} >
        <div className='w-full h-6 flex'
            draggable={true}
            onDrag={handleOnDrag}
            onDragStart={handleOnDragStart}
            ref={targetRef}
        >
          <div className='h-1 w-25 m-auto bg-gray-400 rounded-2xl'></div>
        </div>
        <div className='w-full h-10 flex justify-between'>
            <p className='main-font-thin text-[20px] m-auto ml-6'>{title}</p>
            <button className='w-8 h-8 bg-gray-200 mr-4 rounded-[50px] flex m-auto' onClick={()=>{
              change_size()
            }}>{now_size_status?<ChevronDown className='m-auto' />:<ChevronUp className='m-auto'/>}</button>
        </div>
        <div className='w-full flex overflow-scroll' style={{height:"calc(100% - 125px)"}}>
          <MapContentsCardList buildings={buildings} loading={loading} error={error} />
        </div>
      </div>
  )
}

export default MapContentsList