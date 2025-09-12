import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🏢 Fetching specific building data...')
    
    // URLパラメータからIDを取得
    const { id } = params

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Building ID is required in URL parameter',
        timestamp: new Date().toISOString()
      }, { status: 400 })
    }

    // 指定されたIDの建物データを取得（関連データも含める）
    const buildingData = await prisma.buildings.findUnique({
      where: {
        id: id
      },
      include: {
        floors: {
          orderBy: {
            floor_num: 'asc'
          }
        },
        projects: {
          include: {
            floor: true
          }
        },
        mapPins: true,
        _count: {
          select: {
            floors: true,
            projects: true
          }
        }
      }
    })

    if (!buildingData) {
      return NextResponse.json({
        success: false,
        message: `No building found with ID: ${id}`,
        timestamp: new Date().toISOString()
      }, { status: 404 })
    }

    console.log(`✅ Successfully fetched building data for ID: ${id}`)

    return NextResponse.json({
      success: true,
      message: `Successfully fetched building data for ID: ${id}`,
      data: buildingData,
      timestamp: new Date().toISOString()
    }, { status: 200 })
    
  } catch (error) {
    console.error('❌ Error fetching building data:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch building data',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}