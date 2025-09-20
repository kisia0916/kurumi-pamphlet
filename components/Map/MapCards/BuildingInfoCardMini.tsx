import { Badge } from '@/components/ui/badge'
import { useTitle } from '@/contexts/TitleContext';
import { ChevronRight } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Congestion = "hard" | "middle" | "empty"|"unknown"|"loading";

function BuildingInfoCard(props: {
  id: string;
  name: string;
  content_num: number;
  pic_url: string;
  flower: number;
  congestion: string;
  get_status:boolean
}) {
  const {setTitle} = useTitle();
  const [building_status,set_building_status] = useState<string>("loading");
  const [error,set_error] = useState<string|null>(null);
  const getStatusInfo = (congestion: string) => {
    switch (congestion) {
      case 'hard':
        return { color: 'bg-red-400', text: '混雑' };
      case 'middle':
        return { color: 'bg-yellow-400', text: 'やや混雑' };
      case 'empty':
        return { color: 'bg-green-400', text: '空いている' };
      case 'loading':
        return { color: 'bg-gray-400', text: '読み込み中' };
      default:
        return { color: 'bg-gray-400', text: '不明' };
    }
  };

  const statusInfo = getStatusInfo(props.congestion);
  useEffect(()=>{
    const get_status = async()=>{
      try{
        const data = await fetch(`/api/get_status/get_one_status/${props.id}`);
        if (!data.ok) throw new Error('ステータスの取得に失敗しました');
        const json = await data.json();
        console.log(json)
        set_building_status(json.data[0].status)
      }catch{
        set_building_status('unknown');
      }
    }
    if (props.get_status){
      get_status()
    }
  },[building_status])
  return (
    <Link onClick={()=>{
      setTitle(props.name);
    }} href={`/map/building/${props.id}`} className='flex w-full h-17 mt-2 mb-4 justify-between no-underline'>
      <div className='flex'>
      <div className='w-18 h-17 bg-amber-300 rounded-[10px] relative'>
        <Image src={`${props.pic_url}`} className='w-full h-full object-cover rounded-[10px]' alt={props.name} fill style={{ objectFit: 'cover' }}/>
      </div>
      <div className='h-full ml-4 flex'>
        <div className='m-auto'>
        <span className='main-font-thin text-[20px] flex '>{props.name}</span>
        <div className='flex mt-1'>
          <Badge className={`mr-2 ${props.get_status?getStatusInfo(building_status).color:statusInfo.color}`}>
          <span>{props.get_status?getStatusInfo(building_status).text:statusInfo.text}</span>
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