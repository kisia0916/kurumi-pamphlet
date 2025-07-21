import React from 'react'

function MapPin(props:{key:number,pin:any,setSelected:any}) {
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
      <div className='w-10 h-10 bg-blue-400 rounded-full relative shadow-lg flex items-center justify-center m-auto '>
          <div className='w-9 h-9 bg-amber-300 rounded-full'></div>

          {/* 小さい円を中央に重ねる */}
          <div className='w-3 h-3 bg-blue-400 rounded-full absolute mt-13 left-1/2 -translate-x-1/2 -translate-y-1/2' />
      </div>
      <div className='w-full flex'>
        <span className='m-auto mt-1 main-font-thin text-[12px] text-white'>1号館</span>
      </div>
    </div>
</button>
  )
}

export default MapPin