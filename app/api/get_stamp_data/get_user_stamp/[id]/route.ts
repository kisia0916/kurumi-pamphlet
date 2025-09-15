import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(request: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const allStamps = await prisma.userStamps.findMany({
        where:{ userId:id },
    })
    return NextResponse.json({
      success: true,
      data: allStamps,
      timestamp: new Date().toISOString()
  }, { status: 200})

    
  } catch (error) {
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch building status data',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
