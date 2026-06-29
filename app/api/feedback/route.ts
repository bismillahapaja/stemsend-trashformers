import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Action } from '@/types'

// POST /api/feedback — submit human feedback on AI recommendation
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { predictionId, aiAction, humanAction } = body as {
      predictionId: number
      aiAction: Action
      humanAction: Action
    }

    if (!predictionId || !aiAction || !humanAction) {
      return NextResponse.json(
        { error: 'predictionId, aiAction, and humanAction are required' },
        { status: 400 }
      )
    }

    // Verify prediction exists
    const prediction = await prisma.prediction.findUnique({
      where: { id: predictionId },
    })
    if (!prediction) {
      return NextResponse.json({ error: 'Prediction not found' }, { status: 404 })
    }

    const feedback = await prisma.feedback.create({
      data: {
        predictionId,
        aiAction,
        humanAction,
      },
    })

    return NextResponse.json({
      id: feedback.id,
      predictionId: feedback.predictionId,
      aiAction: feedback.aiAction,
      humanAction: feedback.humanAction,
      createdAt: feedback.createdAt.toISOString(),
    })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}

// GET /api/feedback?predictionId=X — get feedback for a prediction
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = request.nextUrl
    const predictionId = searchParams.get('predictionId')

    const feedbacks = await prisma.feedback.findMany({
      where: predictionId ? { predictionId: parseInt(predictionId) } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(
      feedbacks.map((f) => ({
        ...f,
        createdAt: f.createdAt.toISOString(),
      }))
    )
  } catch (error) {
    console.error('Feedback GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
  }
}
