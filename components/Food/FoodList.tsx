
import React, { useEffect } from 'react';
import FoodCard from './FoodCard/FoodCard';
import FoodPlace from './FoodPlace/FoodPlace';
import { FoodCardInterface } from '@/app/food/page';

function FoodList(props:{foods:FoodCardInterface[]}) {

  return (
    <div className='w-full main-font-thin'>
      <div className='w-full flex '>
        <div className='w-[94%] h-12 rounded-[10px] mt-4 m-auto flex justify-between items-center border-blue-300 border-2 bg-blue-200'>
          <p className='m-auto text-[15px]'>最終更新 12:30</p>
        </div>
      </div>
      {props.foods.length>0?props.foods.map((food_place) => (
        <FoodPlace key={food_place.id} data={food_place}/>)):<></>}

      {/* <div className='m-auto w-[94%] mt-5 grid grid-cols-2 gap-3 pb-8'>

        {props.foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div> */}
    </div>
  );
}

export default FoodList