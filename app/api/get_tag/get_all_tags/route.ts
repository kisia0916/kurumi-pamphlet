import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cacheSuccessHeaders } from "../../_utils/cacheHeaders";

// /api/search?q=word1,word2,... 複数語 OR 検索
// 対象: Projects.name / Projects.room_name / Projects.project_genre / Buildings.name / Buildings.index
export async function GET(request: NextRequest) {
    try {
    const data = await prisma.project_tag.findMany();
    return NextResponse.json({ tags: data }, { status: 200, headers: cacheSuccessHeaders });
    } catch (e) {
        console.error("/api/get_tag/get_all_tags error", e);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}