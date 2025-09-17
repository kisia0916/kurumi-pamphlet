
import React, { useEffect } from 'react';
import FoodCard from './FoodCard/FoodCard';
import FoodPlace from './FoodPlace/FoodPlace';
import { FoodCardInterface, FoodStatusLike } from '@/app/food/page';

function FoodList(props:{foods:FoodCardInterface[]; statuses?: Record<string, FoodStatusLike>}) {

  return (
    <div className='w-full main-font-thin'>

      {props.foods.length>0?props.foods.map((food_place) => (
        <FoodPlace key={food_place.id} data={food_place} statuses={props.statuses}/>)):<></>}

      {/* <div className='m-auto w-[94%] mt-5 grid grid-cols-2 gap-3 pb-8'>

        {props.foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div> */}
    </div>
  );
}

export default FoodList