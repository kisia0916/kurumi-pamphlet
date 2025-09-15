import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cacheSuccessHeaders } from '../../_utils/cacheHeaders';

export async function GET(  request: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
    try{
        const { id } = await params
        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Missing floor ID',
                timestamp: new Date().toISOString()
            }, { status: 400 })
        }

    const project_data = await prisma.projects.findFirst({
            where: {
                id:id
            },
            include:{
                building: true,
                floor: true
            }
        })
        return NextResponse.json({
            success: true,
            data: project_data?project_data:undefined,
    }, { status: 200, headers: cacheSuccessHeaders })
    }catch(error){
        console.log(error)
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch building data',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}