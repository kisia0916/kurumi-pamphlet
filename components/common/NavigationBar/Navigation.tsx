"use client"
import React, { useEffect, useState } from 'react'
import NavigationButton from './NavigationButton';
import { useTitle } from '@/contexts/TitleContext';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { max_width } from '@/lib/utils';

function Navigation() {
    const { now_page, set_now_page, setNavMode, is_display_navigation, set_is_display_navigation } = useTitle();
    const pathname = usePathname();
    const [viewportHeight, setViewportHeight] = useState(0);
    const [isFabExpanded, setIsFabExpanded] = useState<boolean>(false);
    useEffect(() => {
      const handleResize = () => {
        if (window.innerHeight < 700){
            set_is_display_navigation(false);
        }
        setViewportHeight(window.innerHeight);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      if (!pathname) return;
      if (pathname.startsWith('/map')) set_now_page('map');
      else if (pathname.startsWith('/food')) set_now_page('food');
      else if (pathname.startsWith('/stamp')) set_now_page('stamp');
      else if (pathname.startsWith('/event')) set_now_page('event');
    }, [pathname, set_now_page]);

    const isCompact = viewportHeight > 0 && viewportHeight < 700;

    useEffect(() => {
      setNavMode(isCompact ? 'compact' : 'full');
      if (!isCompact && isFabExpanded) {
        setIsFabExpanded(false);
      }
    }, [isCompact, setNavMode, isFabExpanded, setIsFabExpanded]);

    if (viewportHeight < 700) {
      return (
        <div 
          className={`fixed bottom-5 right-5 z-[1000]   transition-all duration-300 ease-in-out bg-white rounded-full shadow-lg `}
          style={{ width: '50px', height: isFabExpanded ? '320px' : '50px' }}
        >
          {isFabExpanded && (
          <div className='w-full h-full '>
            <NavigationButton now_page={now_page} set_now_page={set_now_page} page='map' icon='/kurumiIcon/map.svg' title='マップ' size='s'/>
            <NavigationButton now_page={now_page} set_now_page={set_now_page} page='food' icon='/kurumiIcon/food.svg' title='食べ物'  size='s'/>
            <NavigationButton now_page={now_page} set_now_page={set_now_page} page='stamp' icon='/kurumiIcon/stamp.svg' title='スタンプ'  size='s'/>
            <NavigationButton now_page={now_page} set_now_page={set_now_page} page='event' icon='/kurumiIcon/time_table.svg' title='イベント'  size='s'/>
        </div>)}
          <button 
            onClick={() => setIsFabExpanded(!isFabExpanded)} 
            className="absolute right-0 bottom-0 w-[50px] h-[50px] flex items-center justify-center bg-white text-white rounded-full focus:outline-none border-1 border-gray-700"
            aria-label={isFabExpanded ? 'Close menu' : 'Open menu'}
          >
            {isFabExpanded ? <X size={24} className='text-black'/> : <Menu size={24} className='text-black'/>}
          </button>
        </div>
      )
    }else{
      return (
        <nav style={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 0,
          width: '100%',
          // maxWidth: `${max_width}px`,
          background: '#fff',
          boxShadow: '0px 10px 53px 16px rgba(17,17,26,0.08)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '60px',
        }}>
            <div className='w-full h-full flex justify-around'>
                <NavigationButton now_page={now_page} set_now_page={set_now_page} page='map' icon='/kurumiIcon/map.svg' title='マップ' size='l'/>
                <NavigationButton now_page={now_page} set_now_page={set_now_page} page='food' icon='/kurumiIcon/food.svg' title='食べ物'  size='l'/>
                <NavigationButton now_page={now_page} set_now_page={set_now_page} page='stamp' icon='/kurumiIcon/stamp.svg' title='スタンプ'  size='l'/>
                <NavigationButton now_page={now_page} set_now_page={set_now_page} page='event' icon='/kurumiIcon/time_table.svg' title='イベント'  size='l'/>
            </div>
        </nav>
      )
    }


}

export default Navigation