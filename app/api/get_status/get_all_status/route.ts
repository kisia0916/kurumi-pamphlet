import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching all building status data...')
    
    // すべてのbuilding statusデータを取得（建物情報も含める）
    const allStatus = await prisma.buildingStatus.findMany({})


    return NextResponse.json({
      success: true,
      message: `Successfully fetched ${allStatus.length} building status records`,
      data: allStatus,
      count: allStatus.length,
      timestamp: new Date().toISOString()
    }, { status: 200 })
    
  } catch (error) {
    console.error('❌ Error fetching all building status data')
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch building status data',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
