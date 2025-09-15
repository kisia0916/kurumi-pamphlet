import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { cacheSuccessHeadersMini } from '../../../_utils/cacheHeaders'


export async function GET(
  request: NextRequest,
  { params }: { params:  Promise<{ id: string }>}
) {
  try {
    
    // URLパラメータからIDを取得
    const { id } = await  params

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Building ID is required in URL parameter',
        timestamp: new Date().toISOString()
      }, { status: 400 })
    }

    // 指定されたbuilding_idのstatusデータを取得
    const statusData = await prisma.buildingStatus.findMany({
      where: {
        building_id: id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (statusData.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No status data found for building ID: ${id}`,
        data: [],
        count: 0,
        timestamp: new Date().toISOString()
      }, { status: 404 })
    }


    return NextResponse.json({
      data: statusData,
      buildingId: id,
      timestamp: new Date().toISOString()
    }, { status: 200  , headers: cacheSuccessHeadersMini})
    
  } catch (error) {
    console.error('❌ Error fetching building status data:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch building status data',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
