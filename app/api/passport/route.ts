import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function formatPassportId(id: number): string {
  return `GL-${String(id).padStart(4, '0')}`
}

// GET /api/passport?id=X
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = request.nextUrl
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const prediction = await prisma.prediction.findUnique({
      where: { id: parseInt(id) },
    })

    if (!prediction) {
      return NextResponse.json({ error: 'Prediction not found' }, { status: 404 })
    }

    return NextResponse.json({
      passportId: formatPassportId(prediction.id),
      id: prediction.id,
      imageUrl: prediction.imageUrl,
      itemType: prediction.itemType,
      condition: prediction.condition,
      action: prediction.action,
      reuseScore: prediction.reuseScore,
      confidence: prediction.confidence,
      hazard: prediction.hazard,
      recommendation: prediction.recommendation,
      createdAt: prediction.createdAt.toISOString(),
      location: 'School Lab — Stemsend',
    })
  } catch (error) {
    console.error('Passport error:', error)
    return NextResponse.json({ error: 'Failed to fetch passport' }, { status: 500 })
  }
}
