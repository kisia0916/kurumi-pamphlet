import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Calendar, Users } from 'lucide-react'
import React from 'react'
import BuildingFloorInfo from './BuildingFloorInfo'

function BuildingInfoCard() {
  return (
    <div className='w-full flex'>
      <div className='w-[96%] m-auto'>
         <div className='w-full flex'>
          <img src="/photos/P1030548.JPG" className='w-[98%] h-50 rounded-2xl mt-3 m-auto bg-amber-200 object-cover'/>
        </div>
        <div className="w-full mt-4 flex">
            <div className="w-full border-1 border-gray-300 rounded-2xl flex">
              {/* Floor Count */}
              <div className='w-full flex justify-around mt-4 mb-4'>
                <div className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">階層数</p>
                      <p className="text-lg font-bold text-gray-900">{7}階</p>
                    </div>
                  </div>
                </div>

                {/* Project Count */}
                <div className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">企画数</p>
                      <p className="text-lg font-bold text-gray-900">{41}件</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">混雑度合</p>
                      <Badge
                        className={`bg-yellow-500 text-white text-xs px-2 py-1 rounded-full`}
                      >
                        {"中程度"}
                      </Badge>
                    </div>
                  </div>
                </div>
            </div>
          </div>       
      </div>
      <div className='w-full mt-3'>
        <BuildingFloorInfo/>
      </div>
      </div>
    </div>
  )
}

export default BuildingInfoCard