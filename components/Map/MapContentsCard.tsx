import { ChevronRight } from 'lucide-react'
import React from 'react'

function MapContentsCard(props:{name:string,content_num:number,flower:number}) {
  return (
    <div className='flex w-full h-25 mt-2 justify-between'>
      <div className='flex'>
        <div className='w-40 h-22 bg-amber-300 rounded-[10px]'></div>
        <div className='h-full ml-4'>
          <span className='main-font-thin text-[23px] flex mt-3'>{props.name}</span>
          <div className='flex mt-1'>
            <span className='main-font-thin text-[16px] text-gray-500'>企画数:{props.content_num}</span>
            <div className='w-[1px] h-4 bg-gray-500 m-auto ml-1 mr-1'></div>
            <span className='main-font-thin text-[16px] text-gray-500'>階数:{props.flower}</span>
          </div>
      </div>
      </div>
      <div className='flex h-full'>
        <ChevronRight className='m-auto mt-7'/>
      </div>
    </div>
  )
}

export default MapContentsCard