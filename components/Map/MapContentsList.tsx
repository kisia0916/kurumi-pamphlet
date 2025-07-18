import { X } from 'lucide-react';
import React, { useEffect } from 'react'

function MapContentsList() {
  const targetRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null)
  const hiddenRef = React.useRef<HTMLImageElement>(null);
  useEffect(()=>{
    if (barRef.current){
        barRef.current.style.height = "300px"
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
      <div className='w-full bg-white rounded-t-3xl absolute bottom-0' ref={barRef}  style={{maxHeight:"calc(100dvh - 60px - 80px)",boxShadow: '0px 10px 53px 16px rgba(17,17,26,0.08)'}} >
        <div className='w-full h-8 flex'
            draggable={true}
            onDrag={handleOnDrag}
            onDragStart={handleOnDragStart}
            ref={targetRef}
        >
            <div className='h-1 w-30 m-auto bg-gray-400 rounded-2xl'></div>
        </div>
        <div className='w-full h-10 flex justify-between'>
            <p className='main-font-thin text-2xl m-auto ml-5'>マップ</p>
            <div className='w-8 h-8 bg-gray-200 mr-4 rounded-[50px] flex m-auto'><X className='m-auto'/></div>
        </div>
      </div>
  )
}

export default MapContentsList