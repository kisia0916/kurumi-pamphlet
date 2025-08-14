"use client"
import Map from '@/components/Map/Map'
import SearchBox from '@/components/Map/SearchBox'
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import React, { ReactNode, use, useEffect, useState } from 'react'
import { TitleProvider, useTitle } from '@/contexts/TitleContext'
import { useRouter } from 'next/navigation'

export default function MapLayout({ children }: { children: ReactNode }) {
  return (
    <TitleProvider>
      <MapLayoutContent>{children}</MapLayoutContent>
    </TitleProvider>
  )
}

function MapLayoutContent({ children }: { children: ReactNode }) {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const barRef = React.useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(true);
    const { title, height, setHeight, showBackButton, isExpanded, setIsExpanded, mapImg, mapPins } = useTitle();
    const router = useRouter();
    const change_size = () => {
      let newHeight = height;
      if (!isExpanded) {
        newHeight = "calc(100dvh - 60px - 80px)";
        setIsExpanded(true);
      } else {
        newHeight = "calc(100dvh - 80px - 300px)";
        setIsExpanded(false);
      }
      setHeight(newHeight);
    }
    useEffect(()=>{
      if (barRef.current){
          barRef.current.style.height = `calc(100dvh - 80px - 300px)`;
      }
    },[barRef])

    const handleChangeHeight = React.useCallback((clientY: number) => {
      if (clientY === 0 || barRef.current === null) return;
      const { bottom } = barRef.current.getBoundingClientRect();
      const diff = Math.round(clientY - bottom);
      barRef.current.style.height = `${diff*-1}px`;
    }, []);
  

  
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
      setIsDragging(false);
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        handleChangeHeight(touch.clientY);
      }
    };
    const handleTouchEnd = () => {
      setIsDragging(true);
    };
    el.addEventListener("touchmove", handleTouchMove, { passive: false });

    el.addEventListener("touchend", handleTouchEnd,{ passive: false });

    return () => {
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleChangeHeight]);

  // useEffect(()=>{
  //   if (now_height_type === 'high') {
  //     setHeight("100px");
  //   } else if (now_height_type === 'middle') {
  //     setHeight("calc(100dvh - 60px - 40px)");
  //   } else {
  //     setHeight("calc(100dvh - 80px - 300px)");
  //   }
  // },[now_height_type, setHeight])
  return (
    <div className='w-full overflow-y-scroll' style={{ height: "calc(100dvh - 60px)" }}>

      <SearchBox/>
      <div className='w-full z-10' >
        <Map map_img={mapImg} map_pins={mapPins}/>
      </div>
      <main>
        {/*メインメニュー*/}
        <div
          className='z-6 w-full bg-white rounded-t-3xl absolute bottom-0'
          ref={barRef}
          style={{
            height: height,
            maxHeight: "calc(100dvh - 60px - 80px)",
            minHeight: "calc(100dvh - 80px - 300px)",
            boxShadow: '0px 10px 53px 16px rgba(17,17,26,0.08)',
            transition: isDragging ? 'height 0.3s cubic-bezier(0.4,0,0.2,1)' : undefined,
          }}
        >
          <div
            className='w-full h-6 flex'
            draggable={true}
            onDrag={handleOnDrag}
            onDragEnd={() => {
              console.log("drag end");
            }}
            ref={targetRef}
          >
            <div className='h-1 w-25 m-auto bg-gray-400 rounded-2xl'></div>
          </div>
          <div className='w-full h-10 flex justify-between'>
            <div className='flex items-center ml-4'>
              {showBackButton && (
                <button
                  className='w-8 h-8 mr-2  flex items-center justify-center'
                  onClick={() => {
                    router.back()
                  }}
                >
                  <ArrowLeft className='w-6 h-6' />
                </button>
              )}
              <p className='main-font-thin text-[20px]'>{title}</p>
            </div>
            <button
              className='w-8 h-8 bg-gray-200 mr-4 rounded-[50px] flex m-auto'
              onClick={() => {
          change_size();
              }}
            >
              {isExpanded ? <ChevronDown className='m-auto' /> : <ChevronUp className='m-auto' />}
            </button>
          </div>
          {/*メインメニュー*/}
          <div className='w-full h-full flex'>
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
