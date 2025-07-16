import React from 'react'

function HowToBuyCard(props:{color:"blue"|"yellow"|"pink"}) {
    const borderClass = props.color === "blue" ? "border-blue-400" : props.color === "yellow" ? "border-yellow-400" : "border-pink-400";
    const bgClass = props.color === "blue" ? "bg-blue-400" : props.color === "yellow" ? "bg-yellow-400" : "bg-pink-400";
  return (
    <div>
        <div className='w-full m-auto relative mt-3'>
            <div className={`w-[94%] rounded-2xl border-2 absolute mt-7 right-0 ${borderClass} flex`} >
                <div className='flex mt-8 mb-3 w-[95%] m-auto'>
                    <p>テストテストテストテストテストテストテストテストテストテストテストテストテスト</p>
                </div>
            </div>
            <div className={`w-15 h-15 absolute rounded-[50px] flex ${bgClass}`}>
                <p className='m-auto text-white text-2xl'>1</p>
            </div>

        </div>
    </div>
  )
}

export default HowToBuyCard