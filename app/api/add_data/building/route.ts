import { NextRequest, NextResponse } from 'next/server'
import { insertBuildingsFromJson } from '@/lib/dataset/building/dbset'
import { insertBuildingStatusFromJson } from '@/lib/dataset/status/setStatus'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Starting data insertion via API...')
    
    // URLパラメータから実行する処理を取得
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'status') {
      // ステータスデータの挿入
      console.log('📊 Inserting building status data...')
      const result = await insertBuildingStatusFromJson()
      
      return NextResponse.json({
        success: result.success,
        message: result.message,
        insertedCount: result.insertedCount,
        timestamp: new Date().toISOString()
      }, { status: result.success ? 200 : 500 })
      
    } else {
      // デフォルト: 建物データの挿入
      console.log('🏢 Inserting building data...')
      await insertBuildingsFromJson()
      
      return NextResponse.json({
        success: true,
        message: 'Building data insertion completed successfully!',
        timestamp: new Date().toISOString()
      }, { status: 200 })
    }
    
  } catch (error) {
    console.error('❌ Error during API data insertion:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to insert data',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}