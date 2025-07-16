import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function FoodListSkeleton() {
  return (
      <div className='w-full'>
        <div className="overflow-hidden flex flex-col m-auto">
            <div className="m-auto w-[94%] mt-5 grid grid-cols-2 gap-3 pb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2 rounded-xl p-3">
                <Skeleton className="h-[125px] w-full" />
                <div className="space-y-2 mt-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
        </div>
        </div>
    </div>
  );
}
