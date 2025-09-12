import { prisma } from "@/lib/prisma";
import { Projects } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(  request: NextRequest,{ params }: { params: { id: string } }) {
    try{
        const { id } = params
        if (id) {
            const projects:Projects[] = await prisma.projects.findMany({
                where:{
                    floor_id: id
                },
                include:{
                    building: true,
                    floor: true
                }
            })
            return NextResponse.json({
                success: true,
                message: `Successfully fetched building data for ID: ${id}`,
                data: projects,
                timestamp: new Date().toISOString()
            }, { status: 200 })
        }else{
            return NextResponse.json({
                success: false,
                message: `No building found with ID: ${id}`,
                timestamp: new Date().toISOString()
            }, { status: 404 })
        }
    }catch(error){
        console.log(error)
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch building data',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}