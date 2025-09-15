import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cacheSuccessHeaders } from '@/app/api/_utils/cacheHeaders'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } =await  params
    // id での直接一致 or stampPlaceId での一致のどちらかを許容
    const quiz = await prisma.stampQuiz.findFirst({
      where: {
        OR: [
          { id },
          { random_key: id }
        ]
      },
      select: {
        id: true,
        quiz_data: true,
        stampPlaceId: true,
        createdAt: true,
      }
    })

    if (!quiz) {
      return NextResponse.json({
        success: false,
        message: 'Stamp quiz not found',
        timestamp: new Date().toISOString()
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: quiz,
      timestamp: new Date().toISOString()
    }, { status: 200 , headers: cacheSuccessHeaders})
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch stamp quiz',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
