import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { applyRule, calculateReuseScore } from '@/lib/rules'
import type { ItemType, Condition } from '@/types'

const dummyData: Array<{
  imageUrl: string
  itemType: ItemType
  condition: Condition
  confidence: number
  hazard: boolean
}> = [
  { imageUrl: '/uploads/sample1.jpg',  itemType: 'cardboard',      condition: 'intact',       confidence: 92, hazard: false },
  { imageUrl: '/uploads/sample2.jpg',  itemType: 'plastic_bottle', condition: 'dirty',        confidence: 88, hazard: false },
  { imageUrl: '/uploads/sample3.jpg',  itemType: 'paper',          condition: 'usable',       confidence: 95, hazard: false },
  { imageUrl: '/uploads/sample4.jpg',  itemType: 'metal_can',      condition: 'intact',       confidence: 90, hazard: false },
  { imageUrl: '/uploads/sample5.jpg',  itemType: 'cable',          condition: 'minor_damage', confidence: 75, hazard: true  },
  { imageUrl: '/uploads/sample6.jpg',  itemType: 'stationery',     condition: 'intact',       confidence: 93, hazard: false },
  { imageUrl: '/uploads/sample7.jpg',  itemType: 'food_container', condition: 'dirty',        confidence: 85, hazard: false },
  { imageUrl: '/uploads/sample8.jpg',  itemType: 'cardboard',      condition: 'minor_damage', confidence: 80, hazard: false },
  { imageUrl: '/uploads/sample9.jpg',  itemType: 'plastic_bottle', condition: 'intact',       confidence: 97, hazard: false },
  { imageUrl: '/uploads/sample10.jpg', itemType: 'paper',          condition: 'dirty',        confidence: 89, hazard: false },
  { imageUrl: '/uploads/sample11.jpg', itemType: 'metal_can',      condition: 'minor_damage', confidence: 72, hazard: false },
  { imageUrl: '/uploads/sample12.jpg', itemType: 'stationery',     condition: 'usable',       confidence: 91, hazard: false },
  { imageUrl: '/uploads/sample13.jpg', itemType: 'food_container', condition: 'intact',       confidence: 94, hazard: false },
  { imageUrl: '/uploads/sample14.jpg', itemType: 'cable',          condition: 'intact',       confidence: 86, hazard: false },
  { imageUrl: '/uploads/sample15.jpg', itemType: 'cardboard',      condition: 'usable',       confidence: 88, hazard: false },
]

export async function POST(_request: NextRequest): Promise<NextResponse> {
  try {
    await prisma.feedback.deleteMany()
    await prisma.prediction.deleteMany()

    for (const d of dummyData) {
      const rule = applyRule(d.itemType, d.condition)
      let action = rule.action
      let recommendation = rule.recommendation
      if (d.hazard || d.confidence < 40) {
        action = 'manual_review'
        recommendation = 'AI confidence is low or hazard detected. Human review required.'
      }
      const reuseScore = calculateReuseScore(d.itemType, d.condition, d.confidence, d.hazard)
      await prisma.prediction.create({
        data: {
          imageUrl: d.imageUrl,
          itemType: d.itemType,
          condition: d.condition,
          confidence: d.confidence,
          hazard: d.hazard,
          action,
          recommendation,
          reuseScore,
        },
      })
    }

    return NextResponse.json({ seeded: dummyData.length })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 })
  }
}
