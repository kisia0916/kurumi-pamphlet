import React from 'react'
import HowToBuyCard from './HowToBuyCard'

function HowToBuy() {
  return (
    <div className='w-full flex'>
        <div className='w-[93%] m-auto mt-0'>
            <HowToBuyCard color={"yellow"} number={1}/>
            <HowToBuyCard color={"blue"} number={2}/>
            <HowToBuyCard color={"pink"} number={3}/>


        </div>
    </div>
  )
}

export default HowToBuy