"use client"
import FoodList from '@/components/Food/FoodList';
import HowToBuy from '@/components/Food/HowToBuy/HowToBuy';
import React, { useState } from 'react'

function page() {
  const [now_page,set_now_page] = useState<"menu" | "how_to_buy">("menu");
  return (
    <div className='w-full overflow-hidden'>
      <div className='w-full h-18 flex'>
          <p className='main-font-thin text-2xl m-auto ml-5'>食べ物</p>
      </div>
      <div className='w-full h-10 flex border-b border-gray-300 justify-around'>
        <button className={`w-[50%] flex h-full  ${now_page === "menu"?"border-amber-300 border-b-2":"border-b-1"}`} onClick={() => set_now_page("menu")}>
          <span className='m-auto'>メニュー</span>
        </button>
        <button className={`w-[50%] flex h-full  ${now_page === "how_to_buy"?"border-amber-300 border-b-2":"border-b-1"}`} onClick={() => set_now_page("how_to_buy")}>
          <span className='m-auto'>食券の買い方</span>
        </button>
      </div>
      <div className="w-full flex overflow-y-scroll" style={{ height: "calc(100dvh - 170px)" }}>
        {now_page === "menu"?<FoodList/>:<HowToBuy/>}
      </div>
    </div>
  )
}

export default page