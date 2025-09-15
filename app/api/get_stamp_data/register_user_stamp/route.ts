import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// /api/search?q=word1,word2,... 複数語 OR 検索
// 対象: Projects.name / Projects.room_name / Projects.project_genre / Buildings.name / Buildings.index
export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => null)
        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
        }

        const user_id = typeof (body as any).user_id === 'string' ? (body as any).user_id : undefined
        const stamp_place_id = typeof (body as any).stamp_place_id === 'string' ? (body as any).stamp_place_id : undefined

        if (!user_id || !stamp_place_id) {
            console.log(1,user_id)
            console.log(2,stamp_place_id)
            return NextResponse.json({ error: 'missing_fields', required: ['user_id', 'stamp_place_id'] }, { status: 400 })
        }


        const existing = await prisma.userStamps.findFirst({
            where: { userId: user_id, stampPlaceId: stamp_place_id },
            select: { id: true, createdAt: true }
        })
        if (existing) {
            // 冪等に成功扱いにする（重複登録しない）
            return NextResponse.json({ success: true, duplicated: true, user_stamp_id: existing.id }, { status: 200 })
        }

        // 3) 作成
        const created = await prisma.userStamps.create({
            data: {
                userId: user_id,
                stampPlaceId: stamp_place_id
            },
            select: { id: true, userId: true, stampPlaceId: true, createdAt: true }
        })

        return NextResponse.json({ success: true, user_stamp: created }, { status: 201 })
    } catch (e) {
        console.error('register_user_stamp POST error', e)
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}