import { Badge } from '@/components/ui/badge'
import { FoodData, Projects } from '@prisma/client'
import React from 'react'
import FoodCard from '../FoodCard/FoodCard'
import Link from 'next/link'
import { FoodCardInterface, FoodStatusLike } from '@/app/food/page'

function FoodPlace(props:{data:FoodCardInterface; statuses?: Record<string, FoodStatusLike>}) {
  props.data.foods.sort((a, b) => {
    const ai = a.food_index ?? 0
    const bi = b.food_index ?? 0
    return ai - bi
  })
  return (
    <div className='w-full'>
      <div className='w-full flex px-3 mt-4 justify-between'>
          <div className='w-full ml-1'>
            <p className='ml-1 text-[20px]'>{props.data.place}</p>
            <p className='text-[15px] text-gray-500'>{props.data.project.building.name}{props.data.project.floor.floor_num}階 {props.data.project.room_name}</p>
          </div>
          <Link href={`/map/project/${props.data.project.id}?floor=${props.data.project.floor.id}`} className='m-auto mt-0 ml-1'>
            <Badge className='h-7 rounded-full bg-yellow-400'>
                <span className='text-black main-font-thin'>マップを見る</span>
            </Badge>
          </Link>

      </div>
    <div className='m-auto w-[94%] mt-5 grid grid-cols-2 gap-3 pb-8'>
      {props.data.foods.map((food) => (
      <FoodCard key={food.id} food={food} statusOverride={props.statuses?.[food.id]} />
    ))}
    </div>
    </div>
  )
}

export default FoodPlace