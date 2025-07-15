"use client"
import React, { useState } from 'react'
import NavigationButton from './NavigationButton';

function Navigation() {
    const [now_page,set_now_page] = useState<"map" | "food" | "stamp" | "timetable">("map");
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