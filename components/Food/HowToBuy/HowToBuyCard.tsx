import React from 'react'

function HowToBuyCard(props:{color:"blue"|"yellow"|"pink",number:number}) {
    const borderClass = props.color === "blue" ? "border-blue-400" : props.color === "yellow" ? "border-yellow-400" : "border-pink-400";
    const bgClass = props.color === "blue" ? "bg-blue-400" : props.color === "yellow" ? "bg-yellow-400" : "bg-pink-400";
  return (
    <div className='flex mt-5'>
        <div className='w-full m-auto'>
            <div className={`w-15 h-15 absolute rounded-[50px] flex ${bgClass}`}>
                <p className='m-auto text-white text-2xl'>{props.number}</p>
            </div>
            <div className={`w-[94%] rounded-2xl border-2 mt-7 ml-5 ${borderClass} flex`} >
                <div className='flex mt-8 mb-3 w-[95%] m-auto'>
                    <p>テストテストテストテストテストテストテストテストテストテストテストテストテスト</p>
                </div>
            </div>


        </div>
    </div>
  )
}

export default HowToBuyCard