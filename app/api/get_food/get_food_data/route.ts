

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cacheSuccessHeaders } from '../../_utils/cacheHeaders';
import build from 'next/dist/build';

export async function GET() {
  try {
    const foods = await prisma.foodPlace.findMany({
      select:{
        id:true,
        createdAt:true,
        place:true,
        project:{select:{
          id:true,
          room_name:true,
          building:{select:{id:true,name:true,index:true}},
          floor:{select:{id:true,floor_num:true}},
        }},
        foods:true,
      }
    })
  return NextResponse.json({data:foods.length>0?foods:[]}, { status: 200, headers: cacheSuccessHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  }
}
