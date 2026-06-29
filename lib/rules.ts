import rules from '@/data/rules.json'
import type { ItemType, Condition, Action, RuleResult } from '@/types'

type RulesMap = Record<string, Record<string, { action: string; recommendation: string }>>

const rulesMap = rules as RulesMap

// Weight in kg saved per item type (approximate averages)
const WEIGHT_MAP: Record<ItemType, number> = {
  cardboard: 0.4,
  plastic_bottle: 0.05,
  paper: 0.1,
  metal_can: 0.08,
  cable: 0.2,
  stationery: 0.03,
  food_container: 0.07,
}

// CO2 saved per kg diverted from landfill (kg CO2 / kg waste)
const CO2_PER_KG: Record<ItemType, number> = {
  cardboard: 1.1,
  plastic_bottle: 2.5,
  paper: 0.9,
  metal_can: 6.3,
  cable: 3.8,
  stationery: 1.2,
  food_container: 2.0,
}

// Base reuse scores per condition
const CONDITION_SCORE: Record<Condition, number> = {
  intact: 95,
  usable: 80,
  dirty: 72,
  minor_damage: 55,
  manual_review: 30,
}

// Multiplier per item type (cables are harder to reuse safely)
const TYPE_MULTIPLIER: Record<ItemType, number> = {
  cardboard: 1.0,
  plastic_bottle: 0.95,
  paper: 1.0,
  metal_can: 0.9,
  cable: 0.7,
  stationery: 1.0,
  food_container: 0.85,
}

export function applyRule(itemType: ItemType, condition: Condition): RuleResult {
  const typeRules = rulesMap[itemType]
  if (typeRules) {
    const conditionRule = typeRules[condition]
    if (conditionRule) {
      return {
        action: conditionRule.action as Action,
        recommendation: conditionRule.recommendation,
      }
    }
  }
  // Fallback
  return {
    action: 'manual_review',
    recommendation:
      'This item requires human inspection before a decision can be made.',
  }
}

export function calculateReuseScore(
  itemType: ItemType,
  condition: Condition,
  confidence: number,
  hazard: boolean
): number {
  if (hazard) return Math.min(20, Math.round(confidence * 0.15))

  const base = CONDITION_SCORE[condition] ?? 50
  const typeMult = TYPE_MULTIPLIER[itemType] ?? 1.0
  const confidenceBonus = (confidence - 50) * 0.1 // -5 to +5 range

  const raw = base * typeMult + confidenceBonus
  return Math.min(100, Math.max(0, Math.round(raw)))
}

export function estimateWasteSaved(itemType: ItemType): number {
  return WEIGHT_MAP[itemType] ?? 0.1
}

export function estimateCO2Saved(itemType: ItemType): number {
  const weight = WEIGHT_MAP[itemType] ?? 0.1
  const co2Factor = CO2_PER_KG[itemType] ?? 1.5
  return parseFloat((weight * co2Factor).toFixed(4))
}

export function formatItemType(type: string): string {
  const labels: Record<string, string> = {
    cardboard: 'Cardboard',
    plastic_bottle: 'Plastic Bottle',
    paper: 'Paper',
    metal_can: 'Metal Can',
    cable: 'Cable',
    stationery: 'Stationery',
    food_container: 'Food Container',
  }
  return labels[type] ?? type
}

export function formatCondition(condition: string): string {
  const labels: Record<string, string> = {
    intact: 'Intact',
    dirty: 'Dirty',
    minor_damage: 'Minor Damage',
    usable: 'Usable',
    manual_review: 'Manual Review',
  }
  return labels[condition] ?? condition
}

export function formatAction(action: string): string {
  const labels: Record<string, string> = {
    reuse: 'Reuse',
    repair: 'Repair',
    donate: 'Donate',
    dismantle: 'Dismantle',
    dispose: 'Dispose',
    manual_review: 'Manual Review',
  }
  return labels[action] ?? action
}

export function getActionColor(action: string): string {
  const colors: Record<string, string> = {
    reuse: '#22c55e',
    repair: '#f59e0b',
    donate: '#3b82f6',
    dismantle: '#8b5cf6',
    dispose: '#ef4444',
    manual_review: '#64748b',
  }
  return colors[action] ?? '#64748b'
}

export function getReuseScoreLabel(score: number): {
  label: string
  color: string
  bg: string
} {
  if (score >= 80) return { label: 'Excellent', color: '#15803d', bg: '#dcfce7' }
  if (score >= 65) return { label: 'Good', color: '#16a34a', bg: '#f0fdf4' }
  if (score >= 45) return { label: 'Fair', color: '#d97706', bg: '#fef3c7' }
  return { label: 'Poor', color: '#dc2626', bg: '#fee2e2' }
}
