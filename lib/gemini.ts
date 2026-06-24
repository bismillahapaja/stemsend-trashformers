import { GoogleGenAI } from '@google/genai'
import type { GeminiAnalysis, ItemType, Condition } from '@/types'

const VALID_TYPES: ItemType[] = [
  'cardboard',
  'plastic_bottle',
  'paper',
  'metal_can',
  'cable',
  'stationery',
  'food_container',
]

const VALID_CONDITIONS: Condition[] = [
  'intact',
  'dirty',
  'minor_damage',
  'usable',
  'manual_review',
]

function sanitizeAnalysis(raw: Partial<GeminiAnalysis>): GeminiAnalysis {
  const type: ItemType = VALID_TYPES.includes(raw.type as ItemType)
    ? (raw.type as ItemType)
    : 'cardboard'
  const condition: Condition = VALID_CONDITIONS.includes(
    raw.condition as Condition
  )
    ? (raw.condition as Condition)
    : 'manual_review'
  const confidence = Math.min(
    100,
    Math.max(0, typeof raw.confidence === 'number' ? raw.confidence : 50)
  )
  const hazard = typeof raw.hazard === 'boolean' ? raw.hazard : false
  return { type, condition, confidence, hazard }
}

export async function analyzeImageWithGemini(
  base64Image: string,
  mimeType: string
): Promise<GeminiAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your-gemini-api-key-here') {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add your API key to the .env file. ' +
      'Get one free at https://aistudio.google.com/app/apikey'
    )
  }

  const ai = new GoogleGenAI({ apiKey })

  const prompt = `You are an expert in circular economy and waste management for schools.
Analyze this image of a waste item carefully.
Return ONLY valid JSON — no markdown, no explanation, no code fences.

{
  "type": "<one of: cardboard | plastic_bottle | paper | metal_can | cable | stationery | food_container>",
  "condition": "<one of: intact | dirty | minor_damage | usable | manual_review>",
  "confidence": <integer 0-100>,
  "hazard": <true | false>
}

Rules:
- type must be the single best match from the allowed list
- condition describes the physical state of the item
- confidence is your certainty percentage (0-100)
- hazard is true if the item contains chemicals, sharp edges, or electrical risk`

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Image,
              mimeType,
            },
          },
        ],
      },
    ],
  })

  const text = (response.text ?? '').trim()

  // Strip any accidental markdown code fences
  const jsonText = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  const parsed = JSON.parse(jsonText) as Partial<GeminiAnalysis>
  return sanitizeAnalysis(parsed)
}
