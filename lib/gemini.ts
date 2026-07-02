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

function sanitizeAnalysis(raw: Partial<GeminiAnalysis & { isWaste?: boolean; notWasteReason?: string }>): GeminiAnalysis {
  // If the model explicitly says it's not waste, short-circuit immediately
  const isWaste = typeof raw.isWaste === 'boolean' ? raw.isWaste : true
  if (!isWaste) {
    return {
      isWaste: false,
      notWasteReason: typeof raw.notWasteReason === 'string' && raw.notWasteReason.trim()
        ? raw.notWasteReason.trim()
        : 'The uploaded image does not appear to contain a waste or trash item.',
      // These are required by the interface but meaningless for non-waste
      type: 'cardboard',
      condition: 'manual_review',
      confidence: 0,
      hazard: false,
    }
  }

  const type: ItemType = VALID_TYPES.includes(raw.type as ItemType)
    ? (raw.type as ItemType)
    : 'cardboard'
  const condition: Condition = VALID_CONDITIONS.includes(raw.condition as Condition)
    ? (raw.condition as Condition)
    : 'manual_review'
  const confidence = Math.min(
    100,
    Math.max(0, typeof raw.confidence === 'number' ? raw.confidence : 50)
  )
  const hazard = typeof raw.hazard === 'boolean' ? raw.hazard : false

  return { isWaste: true, type, condition, confidence, hazard }
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

FIRST, determine whether the image shows a waste or trash item (e.g. cardboard, plastic bottle, paper, metal can, cable, stationery, food container, or any discarded/used object).

If the image does NOT contain a waste item (e.g. it shows a person, animal, food being eaten, scenery, text/document, or any non-trash subject), respond with:
{
  "isWaste": false,
  "notWasteReason": "<brief Indonesian or English description of what the image actually shows and why it is not waste>"
}

If the image DOES contain a waste item, respond with:
{
  "isWaste": true,
  "type": "<one of: cardboard | plastic_bottle | paper | metal_can | cable | stationery | food_container>",
  "condition": "<one of: intact | dirty | minor_damage | usable | manual_review>",
  "confidence": <integer 0-100>,
  "hazard": <true | false>
}

Return ONLY valid JSON — no markdown, no explanation, no code fences.

Rules for waste analysis (only when isWaste is true):
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
