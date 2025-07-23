import React from 'react'

function MapPin(props:{key:number,pin:any,setSelected:any,pin_title:string,pic_url:string}) {
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
    onClick={() => props.setSelected(props.pin.label)}
    aria-label={props.pin.label}
>
    {/* 外側の青い円 + 中の黄色い円 */}
    <div className='w-15'>
      <div className='w-15 h-15 bg-blue-400 rounded-full relative shadow-lg flex items-center justify-center m-auto '>
          <div className='w-14 h-14 rounded-full '>
            <img src={`${props.pic_url}`} className='object-cover w-full h-full rounded-full'/>
          </div>
          <div className='w-3 h-3 bg-blue-400 rounded-full absolute mt-18 left-1/2 -translate-x-1/2 -translate-y-1/2' />
      </div>
      <div className='w-full flex'>
        <span className='m-auto mt-[7px] main-font-thin text-[14px] text-white'>{props.pin_title}</span>
      </div>
    </div>
</button>
  )
}

export default MapPin