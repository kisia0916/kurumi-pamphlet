import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function BuildingInfoCardSkeleton() {
  return (
    <div className='flex w-full h-17 mt-2 mb-4 justify-between'>
      <div className='flex'>
        {/* 画像部分のスケルトン */}
        <div className='w-18 h-17 rounded-[10px]'>
          <Skeleton className='w-full h-full rounded-[10px]' />
        </div>
        <div className='h-full ml-4 flex'>
          <div className='m-auto'>
            {/* 建物名のスケルトン */}
            <Skeleton className='h-6 w-40 mb-2' />
            <div className='flex mt-1'>
              {/* バッジのスケルトン */}
              <Skeleton className='h-6 w-14 mr-2 rounded-full' />
              {/* テキスト部分のスケルトン */}
              <div className='flex space-x-2'>
                <Skeleton className='h-4 w-20' />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 矢印アイコンのスケルトン */}
    </div>
  );
}

export default BuildingInfoCardSkeleton;
