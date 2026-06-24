import { NextRequest, NextResponse } from 'next/server'
import { analyzeImageWithGemini } from '@/lib/gemini'
import { applyRule } from '@/lib/rules'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { imageUrl, base64, mimeType } = body as {
      imageUrl: string
      base64: string
      mimeType: string
    }

    if (!base64 || !mimeType) {
      return NextResponse.json(
        { error: 'base64 and mimeType are required' },
        { status: 400 }
      )
    }

    // Run Gemini Vision analysis
    let analysis
    try {
      analysis = await analyzeImageWithGemini(base64, mimeType)
    } catch (geminiError) {
      const msg = geminiError instanceof Error ? geminiError.message : 'Gemini API error'
      // Return a specific status for API key issues vs other errors
      const isKeyError = msg.includes('GEMINI_API_KEY') || msg.includes('API key not valid') || msg.includes('API_KEY_INVALID')
      return NextResponse.json(
        { error: isKeyError ? `AI service unavailable: ${msg}` : msg },
        { status: isKeyError ? 503 : 502 }
      )
    }

    // Apply rule engine
    const ruleResult = applyRule(analysis.type, analysis.condition)

    // Override action to manual_review if hazardous or low confidence
    let finalAction = ruleResult.action
    let finalRecommendation = ruleResult.recommendation

    if (analysis.hazard) {
      finalAction = 'manual_review'
      finalRecommendation =
        'This item has been flagged as potentially hazardous. Do not reuse without professional inspection.'
    } else if (analysis.confidence < 40) {
      finalAction = 'manual_review'
      finalRecommendation =
        `AI confidence is low (${analysis.confidence}%). Human review is required before any action.`
    }

    // Persist to database
    const prediction = await prisma.prediction.create({
      data: {
        imageUrl: imageUrl ?? '',
        itemType: analysis.type,
        condition: analysis.condition,
        confidence: analysis.confidence,
        hazard: analysis.hazard,
        action: finalAction,
        recommendation: finalRecommendation,
      },
    })

    return NextResponse.json({
      id: prediction.id,
      imageUrl: prediction.imageUrl,
      itemType: prediction.itemType,
      condition: prediction.condition,
      confidence: prediction.confidence,
      hazard: prediction.hazard,
      action: prediction.action,
      recommendation: prediction.recommendation,
      createdAt: prediction.createdAt.toISOString(),
    })
  } catch (error) {
    console.error('Analyze error:', error)
    const message =
      error instanceof Error ? error.message : 'Analysis failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
