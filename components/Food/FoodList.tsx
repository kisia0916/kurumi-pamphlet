import React from 'react'
import FoodCard from './FoodCard/FoodCard'

function FoodList() {
  return (
        <div className='w-full '>
            <div className='w-full flex '>
                <div className='w-[94%] h-12 rounded-[10px] mt-4 m-auto flex justify-between items-center border-amber-300 border-2 bg-amber-200'>
                    <p className='m-auto'>最終更新 12:30</p>
                </div>
            </div>
            <div className='m-auto w-[94%] mt-5 grid grid-cols-2 gap-3 pb-8'>
            <FoodCard  food={{
                id:"123w1",
                name: "カレーライス",
                amount: 800,
                category: "主食",
                photo: "/images/curry.jpg",
                allergens: ["小麦", "乳"],
                sales_status: "在庫あり"
            }}/>
            <FoodCard  food={{
                id:"123w2",
                name: "ハンバーグ",
                amount: 900,
                category: "主食",
                photo: "/images/hamburg.jpg",
                allergens: ["小麦", "卵"],
                sales_status: "在庫あり"
            }}/>
            <FoodCard  food={{
                id:"123w1",
                name: "カレーライス",
                amount: 800,
                category: "主食",
                photo: "/images/curry.jpg",
                allergens: ["小麦", "乳"],
                sales_status: "在庫あり"
            }}/>
            <FoodCard  food={{
                id:"123w2",
                name: "ハンバーグ",
                amount: 900,
                category: "主食",
                photo: "/images/hamburg.jpg",
                allergens: ["小麦", "卵"],
                sales_status: "在庫あり"
            }}/>
            <FoodCard  food={{
                id:"123w1",
                name: "カレーライス",
                amount: 800,
                category: "主食",
                photo: "/images/curry.jpg",
                allergens: ["小麦", "乳"],
                sales_status: "在庫あり"
            }}/>
            <FoodCard  food={{
                id:"123w2",
                name: "ハンバーグ",
                amount: 900,
                category: "主食",
                photo: "/images/hamburg.jpg",
                allergens: ["小麦", "卵"],
                sales_status: "在庫あり"
            }}/>
            </div>
        </div>
  )
}

export default FoodList