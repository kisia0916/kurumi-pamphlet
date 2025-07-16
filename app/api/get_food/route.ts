

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FoodData } from '@prisma/client';

export async function GET(): Promise<NextResponse<FoodData[] | { error: string }>> {
  try {
    const foods: FoodData[] = await prisma.foodData.findMany();
    return NextResponse.json(foods);
  } catch (error) {
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  }
}
