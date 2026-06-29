import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { estimateWasteSaved, estimateCO2Saved } from '@/lib/rules'
import type { ItemType } from '@/types'

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const [predictions, feedbackCount] = await Promise.all([
      prisma.prediction.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.feedback.count(),
    ])

    const actionCounts = {
      reuse: 0,
      repair: 0,
      donate: 0,
      dismantle: 0,
      dispose: 0,
      manual_review: 0,
    }

    const typeCounts: Record<string, number> = {}

    let estimatedWasteKg = 0
    let estimatedCO2Kg = 0

    for (const p of predictions) {
      const action = p.action as keyof typeof actionCounts
      if (action in actionCounts) {
        actionCounts[action]++
      }

      typeCounts[p.itemType] = (typeCounts[p.itemType] ?? 0) + 1

      // Only count diverted waste (not disposed)
      if (p.action !== 'dispose' && p.action !== 'manual_review') {
        estimatedWasteKg += estimateWasteSaved(p.itemType as ItemType)
        estimatedCO2Kg += estimateCO2Saved(p.itemType as ItemType)
      }
    }

    const byType = Object.entries(typeCounts).map(([name, value]) => ({
      name: name
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      value,
    }))

    const byAction = Object.entries(actionCounts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({
        name: name
          .split('_')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
        value,
      }))

    const recent = predictions.slice(0, 5).map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    }))

    return NextResponse.json({
      reuseCount: actionCounts.reuse,
      repairCount: actionCounts.repair,
      donateCount: actionCounts.donate,
      dismantleCount: actionCounts.dismantle,
      disposeCount: actionCounts.dispose,
      manualReviewCount: actionCounts.manual_review,
      totalItems: predictions.length,
      feedbackCount,
      estimatedWasteKg: parseFloat(estimatedWasteKg.toFixed(2)),
      estimatedCO2Kg: parseFloat(estimatedCO2Kg.toFixed(2)),
      byType,
      byAction,
      recent,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
