import { NextRequest, NextResponse } from 'next/server'
import { insertBuildingStatusFromJson } from '@/lib/dataset/status/setStatus'

export async function GET(request: NextRequest) {
  try {
    console.log('🏢 Starting building status data insertion via API...')
    
    // setStatus関数を実行
    const result = await insertBuildingStatusFromJson()
    
    if (result.success) {
      console.log('✅ Building status data insertion completed successfully!')
      return NextResponse.json({
        success: true,
        message: result.message,
        insertedCount: result.insertedCount,
        timestamp: new Date().toISOString()
      }, { status: 200 })
    } else {
      console.error('❌ Building status data insertion failed')
      return NextResponse.json({
        success: false,
        message: result.message,
        insertedCount: result.insertedCount,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Error during API building status data insertion:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to insert building status data',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}