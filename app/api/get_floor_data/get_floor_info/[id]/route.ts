import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(  request: NextRequest,{ params }: { params: { id: string } }) {
    try{
        const { id } = params
        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Missing floor ID',
                timestamp: new Date().toISOString()
            }, { status: 400 })
        }

        const floor_data = await prisma.floor.findFirst({
            where: {
                id
            },
            include:{
                building:true,
            }
        })
        return NextResponse.json({
            success: true,
            message: `Successfully fetched floor data for ID: ${id}`,
            data: floor_data?floor_data:null,
            timestamp: new Date().toISOString()
        }, { status: 200 })
    }catch(error){
        console.log(error)
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch building data',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}