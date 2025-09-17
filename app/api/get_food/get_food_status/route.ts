

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import build from 'next/dist/build';
import { cacheSuccessHeadersMini } from '../../_utils/cacheHeaders';

export async function GET() {
  try {
    const foods = await prisma.foodPlace.findMany({
      select:{
        id:true,
        createdAt:true,
        foods:{select:{id:true,status:true}},
      }
    })
  return NextResponse.json({data:foods.length>0?foods:[]}, { status: 200, headers: cacheSuccessHeadersMini });
  } catch (error) {
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  }
}
