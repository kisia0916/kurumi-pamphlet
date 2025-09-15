import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cacheSuccessHeaders } from '../../_utils/cacheHeaders'


export async function GET(request: NextRequest) {
  try {
    const allStamps = await prisma.stampPlace.findMany({
        include:{ project:true }
    })
    return NextResponse.json({
      success: true,
      data: allStamps,
      timestamp: new Date().toISOString()
  }, { status: 200, headers: cacheSuccessHeaders })

    
  } catch (error) {
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch building status data',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
