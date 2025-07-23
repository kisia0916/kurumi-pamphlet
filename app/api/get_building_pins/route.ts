import { NextResponse } from "next/server";
import { MapPin, PinType, Buildings, BuildingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// APIレスポンスの型定義
type BuildingPinResponse = MapPin & {
  building: {
    id: number;
    name: string;
    picture: string;
    status: BuildingStatus;
    _count: {
      projects: number;
      floors: number;
    };
  } | null;
};

export async function GET() {
  try {
    // BuildingタイプのMapPinを全て取得
    const buildingPins = await prisma.mapPin.findMany({
      where: {
        type: PinType.Building
      },
      include: {
        // 関連する建物情報も取得
        building: {
          select: {
            id: true,
            name: true,
            picture: true,
            status: true,
            _count: {
              select: {
                projects: true,
                floors: true
              }
            }
          }
        }
      }
    });

    // 有効なピンのみを返す（building_idが設定されていて、関連建物が存在するもの）
    const validPins = buildingPins.filter(pin => pin.building !== null);

    return NextResponse.json(validPins);
  } catch (error) {
    console.error("建物ピン取得エラー:", error);
    return NextResponse.json(
      { error: "建物ピンデータの取得に失敗しました" },
      { status: 500 }
    );
  }
}
