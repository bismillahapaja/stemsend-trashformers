'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { AnalysisResult, Action } from '@/types'
import { formatAction, formatCondition, formatItemType, getActionColor } from '@/lib/rules'
import ReuseScoreGauge from './ReuseScoreGauge'
import FeedbackPanel from './FeedbackPanel'

// SVG circular confidence arc
function CircularConfidence({ value }: { value: number }) {
  const size = 120
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = ((100 - value) / 100) * circumference
  const color = value >= 75 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444'
  const level = value >= 75 ? 'High' : value >= 50 ? 'Medium' : 'Low'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#dcfce7" strokeWidth={stroke}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            style={{ transition: 'stroke-dashoffset 1s ease-out', filter: `drop-shadow(0 0 4px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{value}%</span>
        </div>
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{level} Confidence</span>
    </div>
  )
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-green-50 last:border-0">
      <span className="text-sm text-green-700/60 font-medium">{label}</span>
      <span
        className="text-sm font-semibold text-right max-w-[60%]"
        style={accent ? { color: accent } : { color: '#166534' }}
      >
        {value}
      </span>
    </div>
  )
}

function generateExplanation(result: AnalysisResult): string {
  const type = formatItemType(result.itemType)
  const condition = formatCondition(result.condition)
  const action = formatAction(result.action)

  if (result.hazard) {
    return `This item was flagged as potentially hazardous. The AI detected characteristics of ${type.toLowerCase()} with a ${condition.toLowerCase()} condition that may pose safety risks. As a precaution, the system has escalated this to Manual Review — a qualified adult must inspect this item before any action is taken.`
  }
  if (result.confidence < 60) {
    return `The AI was unable to classify this item with high certainty (${result.confidence}% confidence). While it appears to be a ${type.toLowerCase()} in ${condition.toLowerCase()} condition, the low confidence means a human should verify this before acting on the recommendation.`
  }
  const actionDescriptions: Record<string, string> = {
    reuse: `the item appears to be in ${condition.toLowerCase()} condition and is suitable for direct reuse in a school setting`,
    repair: `the item has some damage but its core structure is intact, making it a good candidate for repair before reuse`,
    donate: `the item is in good condition and would benefit someone else — donating extends its useful life`,
    dismantle: `the item is too damaged to reuse as-is, but its components can be recovered through careful dismantling`,
    dispose: `the item is in a state that makes safe reuse impossible. Proper disposal through appropriate channels is recommended`,
    manual_review: `the AI was unable to make a confident recommendation — a human inspection is required`,
  }
  const desc = actionDescriptions[result.action] ?? 'further evaluation is needed'
  return `This recommendation was generated because ${desc}. The AI analyzed the ${type.toLowerCase()} with ${result.confidence}% confidence based on its visual appearance and condition assessment.`
}

export default function ResultCard() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('lastResult')
    if (raw) {
      setResult(JSON.parse(raw) as AnalysisResult)
      requestAnimationFrame(() => setTimeout(() => setVisible(true), 50))
    }
  }, [])

  if (!result) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-6xl animate-float">🔍</div>
        <p className="text-green-800 font-semibold text-lg">No analysis result yet</p>
        <p className="text-green-600/70 text-sm">Upload an image on the home page to get started</p>
        <Link
          href="/"
          id="go-upload-btn"
          className="inline-block gradient-green text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Upload an Image
        </Link>
      </div>
    )
  }

  const actionColor = getActionColor(result.action)
  const explanation = generateExplanation(result)

  return (
    <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      {/* Row 1: Image + Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image card */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="relative aspect-video bg-green-50">
            {result.imageUrl ? (
              <Image
                src={result.imageUrl}
                alt={formatItemType(result.itemType)}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-5xl text-green-200">🗃️</div>
            )}
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-green-700/60 font-medium">Hazard Status</span>
            <span
              id="hazard-badge"
              className={`badge font-semibold ${result.hazard ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
            >
              {result.hazard ? '⚠️ Hazardous' : '✅ No Hazard'}
            </span>
          </div>
        </div>

        {/* Details card */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          {/* Action banner */}
          <div
            className="rounded-xl p-4 text-white text-center"
            style={{ background: `linear-gradient(135deg, ${actionColor}dd, ${actionColor})` }}
          >
            <p className="text-xs font-medium opacity-80 uppercase tracking-wide mb-1">
              Recommended Action
            </p>
            <p id="action-label" className="text-2xl font-bold">{formatAction(result.action)}</p>
          </div>

          {/* Info rows */}
          <div>
            <InfoRow label="Item Type" value={formatItemType(result.itemType)} />
            <InfoRow label="Condition" value={formatCondition(result.condition)} />
            <InfoRow
              label="AI Confidence"
              value={`${result.confidence >= 75 ? 'High' : result.confidence >= 50 ? 'Medium' : 'Low'}`}
              accent={result.confidence >= 75 ? '#16a34a' : result.confidence >= 50 ? '#d97706' : '#dc2626'}
            />
          </div>

          {/* Circular confidence */}
          <div className="flex justify-center pt-1">
            <CircularConfidence value={result.confidence} />
          </div>
        </div>
      </div>

      {/* Row 2: Reuse Score + AI Explanation */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Reuse Score */}
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3">
          <h3 className="font-bold text-green-800 text-base self-start">♻️ Reuse Score</h3>
          <ReuseScoreGauge score={result.reuseScore ?? 0} size={160} />
          <p className="text-xs text-green-600/60 text-center max-w-[220px]">
            Score reflects item type, condition, confidence level, and safety status.
          </p>
        </div>

        {/* AI Explanation */}
        <div className="glass-card rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <h3 className="font-bold text-green-800 text-base">AI Explanation</h3>
          </div>
          <p id="recommendation-text" className="text-green-700 leading-relaxed text-sm">
            {explanation}
          </p>
          {result.confidence < 60 && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700 flex items-start gap-2">
              <span>⚠️</span>
              <span>
                AI confidence is below 60%. A <strong>human review</strong> is recommended before any action.
              </span>
            </div>
          )}
          <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-xs text-green-700 flex items-start gap-2">
            <span>ℹ️</span>
            <span>
              This is an AI-generated recommendation. Humans are responsible for final decisions.
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Recommendation */}
      <div className="glass-card rounded-2xl p-6 mt-6 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">💡</span>
          <h3 className="font-bold text-green-800 text-lg">Recommendation</h3>
        </div>
        <p className="text-green-700 leading-relaxed">{result.recommendation}</p>
      </div>

      {/* Row 4: Human Feedback */}
      <div className="mt-6">
        <FeedbackPanel predictionId={result.id} aiAction={result.action as Action} />
      </div>

      {/* Actions row */}
      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        <Link
          href="/"
          id="analyze-another-btn"
          className="gradient-green text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          📷 Analyze Another Item
        </Link>
        <Link
          href={`/passport/${result.id}`}
          id="view-passport-btn"
          className="bg-white text-green-700 font-semibold px-6 py-3 rounded-xl border border-green-200 hover:bg-green-50 transition-all"
        >
          🌿 View Passport
        </Link>
        <Link
          href="/history"
          id="view-history-btn"
          className="bg-white text-green-700 font-semibold px-6 py-3 rounded-xl border border-green-200 hover:bg-green-50 transition-all"
        >
          🗂️ View History
        </Link>
      </div>
    </div>
  )
}
