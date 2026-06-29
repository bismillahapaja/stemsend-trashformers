import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = request.nextUrl
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = parseInt(searchParams.get('limit') ?? '12', 10)
    const skip = (page - 1) * limit
    const filterType = searchParams.get('type') ?? ''
    const filterAction = searchParams.get('action') ?? ''

    const where = {
      ...(filterType ? { itemType: filterType } : {}),
      ...(filterAction ? { action: filterAction } : {}),
    }

    const [predictions, total] = await Promise.all([
      prisma.prediction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.prediction.count({ where }),
    ])

    return NextResponse.json({
      data: predictions.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('History error:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
