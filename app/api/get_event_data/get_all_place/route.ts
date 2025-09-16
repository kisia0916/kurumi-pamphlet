import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cacheSuccessHeaders } from "../../_utils/cacheHeaders";

export async function GET(  request: NextRequest) {
    try{
    const place_data = await prisma.event_space.findMany({})
    const date_data = await prisma.event_date.findMany({})
        return NextResponse.json({
            data: {place_data:place_data?place_data:[],date_data:date_data?date_data:[]},
        }, { status: 200, headers: cacheSuccessHeaders })
    }catch(error){
        console.log(error)
        return NextResponse.json({
            message: 'Failed to fetch building data',
        }, { status: 500 })
    }
}