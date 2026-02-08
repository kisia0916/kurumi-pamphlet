"use client"

import { useRouter } from "next/navigation"
import { useTitle } from '@/contexts/TitleContext'
import { useEffect } from "react"

function MapPin(props:{pin:any,pin_title?:string,pic_url?:string,size:"s"|"l"|"ss",room_name?:string,is_set_floor_id:boolean
}) {
  const router = useRouter()
  const isLarge = props.size === 'l'
  const isSmall = props.size === 's'
  const isMicro = props.size === 'ss'
  const { mapPins, setMapPins } = useTitle()
  useEffect(()=>{
    console.log(mapPins)
  },[mapPins])
  return (
<button
    key={props.pin.id}
    type="button"
    className="absolute z-10 cursor-pointer focus:outline-none"
    style={{
        top: `${props.pin.y}%`,
        left: `${props.pin.x}%`,
        transform: 'translate(-50%, -100%)',
    }}

    onClick={() => {
      const newPins = mapPins.pin.map((p)=>{
        if (p.id === props.pin.id) {
          return { ...p, is_selected: true };

        }else{
          return { ...p, is_selected: false };
        }
      })
      if(props.is_set_floor_id){
        setMapPins({id:props.pin.floor_id,pin:newPins})
      }
      if (props.pin.type === 'Building' && props.pin.building_id) {
        router.push(`/map/building/${props.pin.building_id}`)
      } else if (props.pin.type === 'Room' && props.pin.project_id) {
        router.push(`/map/project/${props.pin.project_id}?floor=${props.pin.floor_id}`)
      }
    }}
    aria-label={props.pin.label}
>
  
    {/* 外側の青い円 + 中の黄色い円 */}
    <div className={`w-15 ${isSmall ? 'scale-65 origin-bottom' : ''} ${isMicro?'scale-50 origin-bottom' : ''} transition-transform`}>
      <div className={`w-15 h-15 ${Boolean(props.pin?.is_selected) ? 'bg-amber-400' : 'bg-blue-400'} rounded-full relative shadow-lg flex items-center justify-center m-auto`}>
          <div className='w-14 h-14 rounded-full relative z-10'>
            <img src={`${props.pic_url}`} className='object-cover w-full h-full rounded-full'/>
          </div>
          {/*ピンの根本 - 角丸逆三角形 */}
          <div className={`absolute -bottom-[5.5px] left-1/2 -translate-x-1/2 w-5 h-5 ${Boolean(props.pin?.is_selected) ? 'bg-amber-400' : 'bg-blue-400'} rotate-45 rounded-br-[3px]`} />
      </div>
      <div className='w-full flex'>
        <span className={`m-auto mt-[8px] main-font-thin ${isSmall ? 'text-[12px] text-white' : ''} ${isMicro ? 'text-[10px] text-black' : ''} ${isLarge ? 'text-[14px] text-white' : ''} `}>{props.pin.type === "Room"?props.room_name:props.pin_title}</span>
      </div>
    </div>
</button>
  )
}

export default MapPin