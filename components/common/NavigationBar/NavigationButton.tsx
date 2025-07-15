import React from 'react'

function NavigationButton(props:{
  now_page: "map" | "food" | "stamp" | "timetable",
  set_now_page: (page: "map" | "food" | "stamp" | "timetable") => void,
  page: "map" | "food" | "stamp" | "timetable",
  icon: string,
  title: string
}) {
  return (
    <button className='w-12 h-full ' onClick={() => props.set_now_page(props.page)}>
      <div
        className={`w-full flex relative transition-transform duration-200 ${props.now_page === props.page ? "scale-110" : "scale-100"}`}
      >
        {props.now_page === props.page ? (
          <div
            className='absolute left-1/2 top-1/2 w-4 h-4 rounded-[50px] bg-amber-300 -z-10'
            style={{ transform: 'translate(-50%, -50%)' }}
          ></div>
        ) : null}
        <img src={props.icon} alt={props.title} className='w-6 h-6 m-auto' />
      </div>
      <div className='w-full flex mt-[2px] justify-center'>
        <span className='text-xs main-font-thin text-[11px] text-center whitespace-nowrap'>{props.title}</span>
      </div>
    </button>
  )
}

export default NavigationButton