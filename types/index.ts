export type ItemType =
  | 'cardboard'
  | 'plastic_bottle'
  | 'paper'
  | 'metal_can'
  | 'cable'
  | 'stationery'
  | 'food_container'

export type Condition =
  | 'intact'
  | 'dirty'
  | 'minor_damage'
  | 'usable'
  | 'manual_review'

export type Action =
  | 'reuse'
  | 'repair'
  | 'donate'
  | 'dismantle'
  | 'dispose'
  | 'manual_review'

export interface GeminiAnalysis {
  type: ItemType
  condition: Condition
  confidence: number
  hazard: boolean
}

export interface RuleResult {
  action: Action
  recommendation: string
}

export interface AnalysisResult {
  id: number
  imageUrl: string
  itemType: ItemType
  condition: Condition
  confidence: number
  hazard: boolean
  action: Action
  recommendation: string
  createdAt: string
}

export interface DashboardStats {
  reuseCount: number
  repairCount: number
  donateCount: number
  dismantleCount: number
  disposeCount: number
  manualReviewCount: number
  totalItems: number
  estimatedWasteKg: number
  estimatedCO2Kg: number
  byType: { name: string; value: number }[]
  byAction: { name: string; value: number }[]
  recent: AnalysisResult[]
}
