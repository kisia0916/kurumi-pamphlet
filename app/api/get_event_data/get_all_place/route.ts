import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cacheSuccessHeaders } from "../../_utils/cacheHeaders";

export async function GET(  request: NextRequest) {
    try{
    const place_data = await prisma.event_space.findMany({})
    // index の小さい順にソート（index が無い場合は元順をおおむね維持）
    const sorted_places = [...place_data].sort((a, b) => {
        const ai = (a as any).index ?? Number.MAX_SAFE_INTEGER
        const bi = (b as any).index ?? Number.MAX_SAFE_INTEGER
        return ai - bi
    })
    const date_data = await prisma.event_date.findMany({
        orderBy: { index: 'asc' }
    })
        return NextResponse.json({
            data: {place_data: sorted_places ?? [], date_data: date_data ?? []},
        }, { status: 200, headers: cacheSuccessHeaders })
    }catch(error){
        console.log(error)
        return NextResponse.json({
            message: 'Failed to fetch building data',
        }, { status: 500 })
    }
}