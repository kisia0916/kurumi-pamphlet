import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Congestion = '空いている' | 'やや混雑' | '混雑';

function BuildingInfoCard(props: {
  id: number;
  name: string;
  content_num: number;
  pic_url: string;
  flower: number;
  congestion: Congestion;
}) {
  const badgeColor =
    props.congestion === '混雑'
      ? 'bg-red-400'
      : props.congestion === 'やや混雑'
      ? 'bg-yellow-400'
      : 'bg-green-400';

  return (
    <Link href={`/map/B${props.id}`} className='flex w-full h-17 mt-2 mb-4 justify-between no-underline'>
      <div className='flex'>
      <div className='w-18 h-17 bg-amber-300 rounded-[10px]'>
        <img src={`${props.pic_url}`} className='w-full h-full object-cover rounded-[10px]' />
      </div>
      <div className='h-full ml-4 flex'>
        <div className='m-auto'>
        <span className='main-font-thin text-[20px] flex '>{props.name}</span>
        <div className='flex mt-1'>
          <Badge className={`mr-2 ${badgeColor}`}>
          <span>{props.congestion}</span>
          </Badge>
          <span className='main-font-thin text-[14px] text-gray-500'>企画数:{props.content_num}</span>
          <div className='w-[1px] h-4 bg-gray-500 m-auto ml-1 mr-1'></div>
          <span className='main-font-thin text-[14px] text-gray-500'>階数:{props.flower}</span>
        </div>
        </div>
      </div>
      </div>
      <div className='flex h-full'>
        <ChevronRight className='m-auto mt-7'/>
      </div>
    </Link>
  );
}

export default BuildingInfoCard