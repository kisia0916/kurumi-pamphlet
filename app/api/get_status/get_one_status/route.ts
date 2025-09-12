import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { cacheSuccessHeaders } from '../../_utils/cacheHeaders'


export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Fetching specific building status data...')
    
    // リクエストボディからIDを取得
    const body = await request.json()
    const { id } = body
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Building ID is required in request body',
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

    console.log(`✅ Successfully fetched ${statusData.length} status records for building ID: ${id}`)

    return NextResponse.json({
      success: true,
      message: `Successfully fetched ${statusData.length} status records for building ID: ${id}`,
      data: statusData,
      count: statusData.length,
      buildingId: id,
      timestamp: new Date().toISOString()
  }, { status: 200, headers: cacheSuccessHeaders })
    
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
