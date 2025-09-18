import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {cacheSuccessHeadersMini } from '../../_utils/cacheHeaders'


export async function GET(request: NextRequest) {
  try {
    const all_type_notification = await prisma.notifications.findMany({
        where:{
            status:'ALL'
        },
        orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({
      success: true,
      data: all_type_notification,
  }, { status: 200,headers: cacheSuccessHeadersMini})
    
  } catch (error) {
    
    return NextResponse.json({
      success: false,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
