import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Buildings } from '@prisma/client';

// APIレスポンス型 - Prismaの型を直接利用
// Prisma.BuildingsGetPayload<{include: {_count: {select: {floors: true, projects: true}}}}>の簡易版
type BuildingsWithCount = Buildings & {
  _count: {
    floors: number;
    projects: number;
  }
};

// JSON化するとDateはstringになるため、その部分だけ型調整
type SerializedBuilding = Omit<BuildingsWithCount, 'createdAt'> & {
  createdAt: string;
};

type GetBuildingsResponse = SerializedBuilding[] | { error: string };

export async function GET(): Promise<NextResponse<GetBuildingsResponse>> {
  try {
    // BuildingsテーブルからすべてのデータをIDの降順で取得
    const buildings = await prisma.buildings.findMany({
      orderBy: {
        id: 'desc',
      },
      // フロアとプロジェクトの数をカウントするために_count含む
      include: {
        _count: {
          select: {
            floors: true,
            projects: true,
          },
        },
      },
    });

    // Date型はJSON化すると文字列になるため型を合わせる
    const serializedBuildings: SerializedBuilding[] = buildings.map((building) => ({
      ...building,
      createdAt: building.createdAt.toISOString()
    }));

    return NextResponse.json(serializedBuildings);
  } catch (error) {
    console.error('建物データ取得エラー:', error);
    return NextResponse.json({ error: '建物データの取得に失敗しました' }, { status: 500 });
  }
}
