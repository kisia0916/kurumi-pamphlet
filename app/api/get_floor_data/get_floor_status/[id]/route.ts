import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cacheSuccessHeadersMini } from '../../../_utils/cacheHeaders';

export async function GET(  request: NextRequest,{ params }: { params:  Promise<{ id: string }> }) {
    try{
        const { id } =await  params
        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Missing floor ID',
                timestamp: new Date().toISOString()
            }, { status: 400 })
        }

        const floor_status_data = await prisma.floor.findFirst({
            where: {
                id
            },
            select:{
                status:true,
            }
        })
        return NextResponse.json({
            success: true,
            message: `Successfully fetched floor data for ID: ${id}`,
            data: floor_status_data?floor_status_data:null,
            timestamp: new Date().toISOString()
    }, { status: 200, headers: cacheSuccessHeadersMini })
    }catch(error){
        console.log(error)
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch building data',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}