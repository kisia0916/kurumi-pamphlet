import { Search } from 'lucide-react'
import React from 'react'

function SearchBox() {
  return (
    <div className="w-full flex justify-center mt-5 ">
      <div className="w-[94%] h-14 flex rounded-[50px] z-50"  style={{boxShadow: '0px 10px 53px 16px rgba(17,17,26,0.08)'}}>
        <div className="w-[70px] h-full flex items-center justify-center">
            <Search size={30} className="text-amber-400" />
        </div>
        <div className='w-[calc(100%-80px)] h-full flex items-center justify-center '>
            <input
                type="text"
                placeholder="企画、参加団体を検索"
                className="w-full h-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-[20px]"
            />
        </div>
      </div>
    </div>
  )
}

export default SearchBox