import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id, reqType } = await req.json();
    let result = null;

    if (!id || !reqType) {
      return NextResponse.json({ error: "idとreqTypeは必須です" }, { status: 400 });
    }

    switch (reqType) {
      case "Building":
        result = await prisma.buildings.findUnique({
          where: { id: id },
          include: {
            floors: true,
            projects: true,
          },
        });
        break;
      case "Floor":
        result = await prisma.floor.findUnique({
          where: { id:id },
          include: {
            building: true,
            projects: true,
          },
        });
        break;
      case "Project":
        result = await prisma.projects.findUnique({
          where: { id: id },
          include: {
            building: true,
            floor: true,
          },
        });
        break;
      default:
        return NextResponse.json({ error: "reqTypeはBuilding, Floor, Projectのいずれかです" }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json({ error: "該当データが見つかりません" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("要素取得APIエラー:", error);
    return NextResponse.json({ error: "データ取得に失敗しました" }, { status: 500 });
  }
}
