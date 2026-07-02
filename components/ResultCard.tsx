'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { AnalysisResult, Action } from '@/types'
import { formatAction, formatCondition, formatItemType, getActionColor } from '@/lib/rules'
import ReuseScoreGauge from './ReuseScoreGauge'
import FeedbackPanel from './FeedbackPanel'
import {
  Search, BrainCircuit, Lightbulb, Recycle, AlertTriangle, Info,
  CheckCircle, Camera, FileText, Clock, ImageOff, Ban,
} from 'lucide-react'

// SVG circular confidence arc
function CircularConfidence({ value }: { value: number }) {
  const size = 120
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = ((100 - value) / 100) * circumference
  const color = value >= 75 ? '#2D6A4F' : value >= 50 ? '#d97706' : '#ef4444'
  const level = value >= 75 ? 'High' : value >= 50 ? 'Medium' : 'Low'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="var(--slate-100)" strokeWidth={stroke}
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
    <div
      className="flex items-start justify-between py-3"
      style={{ borderBottom: '1px solid var(--slate-100)' }}
    >
      <span className="text-sm font-medium" style={{ color: 'var(--slate-500)' }}>{label}</span>
      <span
        className="text-sm font-semibold text-right max-w-[60%]"
        style={accent ? { color: accent } : { color: 'var(--forest-800)' }}
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
      <div className="text-center py-20 space-y-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto animate-float"
          style={{ background: 'var(--slate-100)' }}
        >
          <Search className="w-8 h-8" style={{ color: 'var(--slate-400)' }} />
        </div>
        <p className="font-bold text-lg" style={{ color: 'var(--slate-800)', fontFamily: 'var(--font-jakarta)' }}>
          No analysis result yet
        </p>
        <p className="text-sm" style={{ color: 'var(--slate-500)' }}>
          Upload an image on the home page to get started
        </p>
        <Link
          href="/"
          id="go-upload-btn"
          className="btn-primary inline-flex"
          style={{ borderRadius: '0.5rem' }}
        >
          <Camera className="w-4 h-4" />
          Upload an Image
        </Link>
      </div>
    )
  }

  // Guard: non-waste items are handled in UploadZone itself (inline),
  // but if one somehow ends up in sessionStorage, show a clear message here too.
  if (result.isWaste === false) {
    return (
      <div className="text-center py-20 space-y-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: '#FED7AA' }}
        >
          <Ban className="w-8 h-8" style={{ color: '#9A3412' }} />
        </div>
        <p className="font-bold text-xl" style={{ color: '#9A3412', fontFamily: 'var(--font-jakarta)' }}>
          Bukan Item Sampah
        </p>
        <p className="text-sm max-w-md mx-auto" style={{ color: '#C2410C' }}>
          {result.notWasteReason ?? 'Gambar yang diupload tidak terdeteksi sebagai sampah.'}
        </p>
        <Link
          href="/"
          className="btn-primary inline-flex"
          style={{ borderRadius: '0.5rem', background: '#C2410C' }}
        >
          <Camera className="w-4 h-4" />
          Upload Foto Sampah
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
        <div className="card-premium overflow-hidden" style={{ borderRadius: '1rem' }}>
          <div className="relative aspect-video" style={{ background: 'var(--slate-50)' }}>
            {result.imageUrl ? (
              <Image
                src={result.imageUrl}
                alt={formatItemType(result.itemType)}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageOff className="w-12 h-12" style={{ color: 'var(--slate-300)' }} />
              </div>
            )}
          </div>
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderTop: '1px solid var(--slate-100)' }}
          >
            <span className="text-sm font-medium" style={{ color: 'var(--slate-500)' }}>Hazard Status</span>
            <span
              id="hazard-badge"
              className="badge font-semibold"
              style={
                result.hazard
                  ? { background: '#FEE2E2', color: '#B91C1C' }
                  : { background: 'var(--emerald-50)', color: 'var(--emerald-700)' }
              }
            >
              {result.hazard
                ? <><AlertTriangle className="w-3 h-3" /> Hazardous</>
                : <><CheckCircle className="w-3 h-3" /> No Hazard</>
              }
            </span>
          </div>
        </div>

        {/* Details card */}
        <div className="card-premium p-5 space-y-4" style={{ borderRadius: '1rem' }}>
          {/* Action banner */}
          <div
            className="rounded-xl p-4 text-white text-center"
            style={{ background: `linear-gradient(135deg, ${actionColor}dd, ${actionColor})` }}
          >
            <p className="text-xs font-medium opacity-80 uppercase tracking-wide mb-1">
              Recommended Action
            </p>
            <p id="action-label" className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jakarta)' }}>
              {formatAction(result.action)}
            </p>
          </div>

          {/* Info rows */}
          <div>
            <InfoRow label="Item Type" value={formatItemType(result.itemType)} />
            <InfoRow label="Condition" value={formatCondition(result.condition)} />
            <InfoRow
              label="AI Confidence"
              value={`${result.confidence >= 75 ? 'High' : result.confidence >= 50 ? 'Medium' : 'Low'}`}
              accent={result.confidence >= 75 ? '#2D6A4F' : result.confidence >= 50 ? '#d97706' : '#dc2626'}
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
        <div className="card-premium p-6 flex flex-col items-center gap-3" style={{ borderRadius: '1rem' }}>
          <div className="flex items-center gap-2 self-start">
            <Recycle className="w-4 h-4" style={{ color: 'var(--emerald-700)' }} />
            <h3 className="font-bold text-base" style={{ color: 'var(--slate-900)', fontFamily: 'var(--font-jakarta)' }}>
              Reuse Score
            </h3>
          </div>
          <ReuseScoreGauge score={result.reuseScore ?? 0} size={160} />
          <p className="text-xs text-center max-w-[220px]" style={{ color: 'var(--slate-500)' }}>
            Score reflects item type, condition, confidence level, and safety status.
          </p>
        </div>

        {/* AI Explanation */}
        <div className="card-premium p-6 space-y-3" style={{ borderRadius: '1rem' }}>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" style={{ color: 'var(--emerald-700)' }} />
            <h3 className="font-bold text-base" style={{ color: 'var(--slate-900)', fontFamily: 'var(--font-jakarta)' }}>
              AI Explanation
            </h3>
          </div>
          <p id="recommendation-text" className="leading-relaxed text-sm" style={{ color: 'var(--slate-700)' }}>
            {explanation}
          </p>
          {result.confidence < 60 && (
            <div
              className="rounded-xl px-4 py-3 text-sm flex items-start gap-2"
              style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E' }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                AI confidence is below 60%. A <strong>human review</strong> is recommended before any action.
              </span>
            </div>
          )}
          <div
            className="rounded-xl px-4 py-3 text-xs flex items-start gap-2"
            style={{ background: 'var(--emerald-50)', border: '1px solid var(--emerald-100)', color: 'var(--emerald-700)' }}
          >
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>
              This is an AI-generated recommendation. Humans are responsible for final decisions.
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Recommendation */}
      <div className="card-premium p-6 mt-6 space-y-2" style={{ borderRadius: '1rem' }}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5" style={{ color: 'var(--emerald-700)' }} />
          <h3 className="font-bold text-lg" style={{ color: 'var(--slate-900)', fontFamily: 'var(--font-jakarta)' }}>
            Recommendation
          </h3>
        </div>
        <p className="leading-relaxed" style={{ color: 'var(--slate-700)' }}>{result.recommendation}</p>
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
          className="btn-primary"
          style={{ borderRadius: '0.5rem' }}
        >
          <Camera className="w-4 h-4" />
          Analyze Another Item
        </Link>
        <Link
          href={`/passport/${result.id}`}
          id="view-passport-btn"
          className="btn-ghost"
          style={{ borderRadius: '0.5rem' }}
        >
          <FileText className="w-4 h-4" />
          View Passport
        </Link>
        <Link
          href="/history"
          id="view-history-btn"
          className="btn-ghost"
          style={{ borderRadius: '0.5rem' }}
        >
          <Clock className="w-4 h-4" />
          View History
        </Link>
      </div>
    </div>
  )
}
