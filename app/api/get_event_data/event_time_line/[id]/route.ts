import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cacheSuccessHeaders } from '../../../_utils/cacheHeaders';

export async function GET(  request: NextRequest,{ params }: { params:  Promise<{ id: string }> }) {
    try{
        const { id } =await  params
        // クエリパラメータから index を取得（例: /api/get_event_data/event_time_line/:id?index=1）
        const data_id = request.nextUrl.searchParams.get('data_id')
        if (!id || !data_id) {
            return NextResponse.json({
                success: false,
            }, { status: 400 })
        }

        const time_line_data = await prisma.event_time.findMany({
            where: {
                event_space_id:id,
                event_date_id:data_id?data_id:undefined
            },
            include:{
                project:true,
            }
        })
        return NextResponse.json({
            success: true,
            data: time_line_data?time_line_data:null,
            timestamp: new Date().toISOString()
    }, { status: 200, headers: cacheSuccessHeaders })
    }catch(error){
        console.log(error)
        return NextResponse.json({
            success: false,
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}