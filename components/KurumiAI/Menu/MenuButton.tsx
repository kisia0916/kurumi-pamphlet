
import { Footprints } from 'lucide-react'
import React from 'react'

function MenuButton(props:{title:string, icon?: React.ReactNode, onClick?: () => void}) {
  return (
    <button className='w-22 h-22 rounded-[10px] border shadow-sm' onClick={props.onClick}>
      <div className='w-full flex'>
        <div className='m-auto mb-3'>
          {props.icon ?? <Footprints className='text-yellow-400' />}
        </div>
      </div>
      <div className='w-full flex'>
        <span className='main-font-thin m-auto text-[12px]'>{props.title}</span>
      </div>
    </button>
  )
}

export default MenuButton