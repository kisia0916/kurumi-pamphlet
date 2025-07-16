import React from 'react'
import HowToBuyCard from './HowToBuyCard'

function HowToBuy() {
  return (
    <div className='w-full flex'>
        <div className='w-[93%] m-auto mt-0'>
            <HowToBuyCard color={"yellow"}/>
            <HowToBuyCard color={"blue"}/>

        </div>
    </div>
  )
}

export default HowToBuy