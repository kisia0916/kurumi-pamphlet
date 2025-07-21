import React from 'react'
import MapContentsCard from './MapContentsCard'

function MapContentsCardList() {
  return (
    <div className='w-[90%] h-full m-auto'>
        <MapContentsCard name='1号館' content_num={30} flower={7}/>
        <MapContentsCard name='2号館' content_num={30} flower={7}/>
        <MapContentsCard name='校庭' content_num={30} flower={7}/>
        <MapContentsCard name='4号館' content_num={30} flower={7}/>


    </div>
  )
}

export default MapContentsCardList