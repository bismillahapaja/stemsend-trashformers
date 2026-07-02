import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { HISTORY_CAPACITY, trimHistoryToCapacity } from '@/lib/history'

// ── GET /api/history ──────────────────────────────────────────────────────────
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = request.nextUrl
    const page  = parseInt(searchParams.get('page')  ?? '1',  10)
    const limit = parseInt(searchParams.get('limit') ?? '12', 10)
    const skip  = (page - 1) * limit
    const filterType   = searchParams.get('type')   ?? ''
    const filterAction = searchParams.get('action') ?? ''

    const where = {
      ...(filterType   ? { itemType: filterType }   : {}),
      ...(filterAction ? { action:   filterAction } : {}),
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
      data: predictions.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      capacity: HISTORY_CAPACITY,
    })
  } catch (error) {
    console.error('History GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}

// ── DELETE /api/history ───────────────────────────────────────────────────────
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = request.nextUrl
    const id            = searchParams.get('id')
    const olderThanDays = searchParams.get('olderThanDays')
    const all           = searchParams.get('all')

    // ── Delete a single prediction ──────────────────────────────────────────
    if (id) {
      const parsedId = Number(id)
      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        return NextResponse.json({ error: 'id must be a positive integer' }, { status: 400 })
      }
      const result = await prisma.prediction.deleteMany({ where: { id: parsedId } })
      return NextResponse.json({ deletedCount: result.count, deletedId: parsedId })
    }

    // ── Delete ALL predictions ──────────────────────────────────────────────
    if (all === 'true') {
      const result = await prisma.prediction.deleteMany({})
      return NextResponse.json({ deletedCount: result.count })
    }

    // ── Delete predictions older than N days ────────────────────────────────
    if (olderThanDays) {
      const days = Number(olderThanDays)
      if (!Number.isInteger(days) || days <= 0) {
        return NextResponse.json({ error: 'olderThanDays must be a positive integer' }, { status: 400 })
      }
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      const result = await prisma.prediction.deleteMany({
        where: { createdAt: { lt: cutoffDate } },
      })
      return NextResponse.json({ deletedCount: result.count, cutoffDate: cutoffDate.toISOString() })
    }

    return NextResponse.json(
      { error: 'Provide id, all=true, or olderThanDays' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Delete history error:', error)
    return NextResponse.json({ error: 'Failed to delete history' }, { status: 500 })
  }
}
