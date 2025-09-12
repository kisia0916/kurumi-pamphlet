import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cacheSuccessHeaders } from "../../_utils/cacheHeaders";

export async function GET(  request: NextRequest) {
    try{

    const building_pin_data = await prisma.mapPin.findMany({
            where: {
                type: "Building"
            },
            include:{
                building: true,
            }
        })
        return NextResponse.json({
            data: building_pin_data?building_pin_data:[]
        }, { status: 200, headers: cacheSuccessHeaders })
    }catch(error){
        console.log(error)
        return NextResponse.json({
            message: 'Failed to fetch building data',
        }, { status: 500 })
    }
}