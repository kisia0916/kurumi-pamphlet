"use client"

import FoodList from '@/components/Food/FoodList';
import FoodListSkeleton from '@/components/Food/FoodListSkeleton';
import HowToBuy from '@/components/Food/HowToBuy/HowToBuy';
import { FoodData, FoodPlace, Projects } from '@prisma/client';
import React, { useEffect, useState } from 'react';

// PrismaのFoodData型をフロント用に定義
export interface FoodCardProps {
      id:string,
      createdAt: string,
      place:string,
      project:{
        id:string
        room_name:string,
        building:{id:string,name:string,index:number},
        floor:{id:string,floor_num:number}
      },
      foods:FoodData[],
}

function page() {
  const [now_page, set_now_page] = useState<"menu" | "how_to_buy">("menu");
  const [foods, setFoods] = useState<FoodCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/get_food")
      .then((res) => res.json())
      .then((data: {data:FoodCardProps[]}) => {
        console.log(data);
        setFoods(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className='w-full overflow-hidden'>

      <div className='w-full h-17 flex'>
        <p className='main-font-thin text-2xl m-auto ml-5'>食べ物</p>
      </div>
      <div className='w-full h-10 flex border-b border-gray-300 justify-around'>
        <button className={`w-[50%] flex h-full  ${now_page === "menu" ? "border-amber-300 border-b-2" : "border-b-1"}`} onClick={() => set_now_page("menu")}> 
          <span className='m-auto'>メニュー</span>
        </button>
        <button className={`w-[50%] flex h-full  ${now_page === "how_to_buy" ? "border-amber-300 border-b-2" : "border-b-1"}`} onClick={() => set_now_page("how_to_buy")}> 
          <span className='m-auto'>食品の買い方</span>
        </button>
      </div>
      <div className="w-full flex overflow-y-scroll" style={{ height: "calc(100dvh - 170px)" }}>
        {now_page === "menu"
          ? loading
            ? <FoodListSkeleton />
            : <FoodList foods={foods} />
          : <HowToBuy />}
      </div>
    </div>
  );
}

export default page