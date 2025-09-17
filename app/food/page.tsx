"use client"

import FoodList from '@/components/Food/FoodList';
import FoodListSkeleton from '@/components/Food/FoodListSkeleton';
import HowToBuy from '@/components/Food/HowToBuy/HowToBuy';
import { useTitle } from '@/contexts/TitleContext';
import { FoodData } from '@prisma/client';
import React, { useEffect, useState } from 'react';

// PrismaのFoodData型をフロント用に定義
export interface FoodCardInterface {
  id: string;
  createdAt: string;
  place: string;
  project: {
    id: string;
    room_name: string;
    building: { id: string; name: string; index: number };
    floor: { id: string; floor_num: number };
  };
  foods: FoodData[];
}

// UIで扱う販売状況（フロント側の拡張）
export type FoodStatusLike = 'AVAILABLE' | 'FEW' | 'SOLDOUT' | 'LOADING' | 'UNKNOWN';

// ステータスAPIのレスポンス型
type FoodStatusResponse = {
  data: Array<{
    id: string;
    createdAt: string;
    foods: Array<{ id: string; status: 'AVAILABLE' | 'FEW' | 'SOLDOUT' }>;
  }>;
};

function Page() {
  const [now_page, set_now_page] = useState<"menu" | "how_to_buy">("menu");
  const [foods, setFoods] = useState<FoodCardInterface[]>([]);
  const [loading, setLoading] = useState(true);
  // food.id -> status のマップ。初期は LOADING、取得後に上書き
  const [statuses, setStatuses] = useState<Record<string, FoodStatusLike>>({});
  const { is_display_navigation } = useTitle();
  useEffect(() => {
    fetch("/api/get_food/get_food_data")
      .then((res) => res.json())
      .then((data: { data: FoodCardInterface[] }) => {
        const list = data.data ?? [];
        setFoods(list);
        // 初期状態: 取得した全フードを LOADING に設定
        const initial: Record<string, FoodStatusLike> = {};
        for (const place of list) {
          for (const f of place.foods) {
            initial[f.id] = 'LOADING';
          }
        }
        setStatuses(initial);
        setLoading(false); // リストは表示し、ステータスはLOADINGで見せる

        // ステータスの追加取得（非同期で上書き）
        fetch('/api/get_food/get_food_status')
          .then((r) => r.json())
          .then((statusData: FoodStatusResponse) => {
            const map: Record<string, FoodStatusLike> = { ...initial };
            for (const place of statusData.data ?? []) {
              for (const f of place.foods ?? []) {
                map[f.id] = f.status;
              }
            }
            setStatuses(map);
          })
          .catch(() => {
            // エラー時は UNKNOWN にしておく
            const unknownMap: Record<string, FoodStatusLike> = {};
            for (const k of Object.keys(initial)) unknownMap[k] = 'UNKNOWN';
            setStatuses(unknownMap);
          });
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div className="w-full h-17 flex">
        <p className="main-font-thin text-2xl m-auto ml-5">食べ物</p>
      </div>

      {/* タブ切り替え部分 */}
      <div className="w-full h-10 flex justify-around">
        <button
          className={`w-[50%] flex h-full ${
            now_page === "menu"
              ? "border-b-2 border-amber-300"
              : "border-b border-gray-300"
          }`}
          onClick={() => set_now_page("menu")}
        >
          <span className="m-auto">メニュー</span>
        </button>
        <button
          className={`w-[50%] flex h-full ${
            now_page === "how_to_buy"
              ? "border-b-2 border-amber-300"
              : "border-b border-gray-300"
          }`}
          onClick={() => set_now_page("how_to_buy")}
        >
          <span className="m-auto">食品の買い方</span>
        </button>
      </div>

      {/* コンテンツ部分 */}
      <div
        className="w-full flex overflow-y-scroll"
        style={{ height: is_display_navigation?"calc(100dvh - 170px)":"calc(100dvh - 110px)" }}
      >
        {now_page === "menu" ? (
          loading ? (
            <FoodListSkeleton />
          ) : (
            <FoodList foods={foods} statuses={statuses} />
          )
        ) : (
          <HowToBuy />
        )}
      </div>
    </div>
  );
}

export default Page;