
import React from 'react';
import FoodCard from './FoodCard/FoodCard';
import { FoodData } from '@prisma/client';

type Props = {
  foods: FoodData[];
};

function FoodList({ foods }: Props) {
  return (
    <div className='w-full '>
      <div className='w-full flex '>
        <div className='w-[94%] h-12 rounded-[10px] mt-4 m-auto flex justify-between items-center border-blue-300 border-2 bg-blue-200'>
          <p className='m-auto'>最終更新 12:30</p>
        </div>
      </div>
      <div className='m-auto w-[94%] mt-5 grid grid-cols-2 gap-3 pb-8'>
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </div>
  );
}

export default FoodList