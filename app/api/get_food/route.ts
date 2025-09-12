

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FoodData } from '@prisma/client';
import { cacheSuccessHeaders } from '../_utils/cacheHeaders';

export async function GET() {
  try {
    const foods: FoodData[] = await prisma.foodData.findMany();
  return NextResponse.json({data:foods}, { status: 200, headers: cacheSuccessHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  }
}
