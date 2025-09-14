"use client"
import React, { useEffect } from 'react'
import NavigationButton from './NavigationButton';
import { useTitle } from '@/contexts/TitleContext';
import { usePathname } from 'next/navigation';

function Navigation() {
  const { now_page, set_now_page } = useTitle();
    const pathname = usePathname();

    useEffect(() => {
      if (!pathname) return;
      if (pathname.startsWith('/map')) set_now_page('map');
      else if (pathname.startsWith('/food')) set_now_page('food');
      else if (pathname.startsWith('/stamp')) set_now_page('stamp');
      else if (pathname.startsWith('/timetable')) set_now_page('timetable');
    }, [pathname, set_now_page]);
  return (
    <nav style={{
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100%',
      background: '#fff',
      boxShadow: '0px 10px 53px 16px rgba(17,17,26,0.08)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '60px',
    }}>
        <div className='w-full h-full flex justify-around'>
            <NavigationButton now_page={now_page} set_now_page={set_now_page} page='map' icon='/kurumiIcon/map.svg' title='マップ'/>
            <NavigationButton now_page={now_page} set_now_page={set_now_page} page='food' icon='/kurumiIcon/food.svg' title='食べ物'/>
            <NavigationButton now_page={now_page} set_now_page={set_now_page} page='stamp' icon='/kurumiIcon/stamp.svg' title='スタンプ'/>
            <NavigationButton now_page={now_page} set_now_page={set_now_page} page='timetable' icon='/kurumiIcon/time_table.svg' title='タイムテーブル'/>
        </div>
    </nav>
  )
}

export default Navigation