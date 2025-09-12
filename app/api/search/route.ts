import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// /api/search?q=word1,word2,... 複数語 OR 検索
// 対象: Projects.name / Projects.room_name / Projects.project_genre / Buildings.name / Buildings.index
export async function GET(request: NextRequest) {
    const max_phrases = 10; // 最大検索語数
    try {
        const searchParams = request.nextUrl.searchParams;
        const qRaw = searchParams.get("q") || "";
        // カンマ区切り → trim → 空除去 → 重複削除 → 上限 10
        const phrases = [...new Set(qRaw.split(",").map(s => s.trim()).filter(Boolean))].slice(0, max_phrases);

        const cacheHeaders = {
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=59",
        };

        if (phrases.length === 0) {
            return NextResponse.json({ query: qRaw, phrases: [], buildings: [], projects: [] }, { status: 200, headers: cacheHeaders });
        }

        const projectOr: any[] = [];
            for (const p of phrases) {
                projectOr.push({ name: { contains: p, mode: "insensitive" } });
                projectOr.push({ room_name: { contains: p, mode: "insensitive" } });
                projectOr.push({ project_genre: { contains: p, mode: "insensitive" } });
            }

        // Buildings 用 OR 条件生成
        const buildingOr: any[] = [];
        for (const p of phrases) {
            buildingOr.push({ name: { contains: p, mode: "insensitive" } });
            const n = Number(p);
            if (!Number.isNaN(n)) {
                buildingOr.push({ index: n });
            }
        }

        const [projects, buildings] = await Promise.all([
            prisma.projects.findMany({
                where: { OR: projectOr },
                select: {
                    id: true,
                    name: true,
                    picture: true,
                    room_name: true,
                    project_genre: true,
                    team_name: true,
                    building: { select: { id: true, name: true, index: true } },
                    floor: { select: { id: true, floor_num: true } }
                }
            }),
            prisma.buildings.findMany({
                where: { OR: buildingOr },
                select: { id: true, name: true, index: true, picture: true }
            })
        ]);

    return NextResponse.json({ query: qRaw, phrases, projects, buildings }, { status: 200, headers: cacheHeaders });
    } catch (e) {
        console.error("/api/search error", e);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}