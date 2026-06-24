'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { AnalysisResult } from '@/types'
import { formatAction, formatCondition, formatItemType, getActionColor } from '@/lib/rules'

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 75 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-green-700/70">Confidence Score</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="h-2.5 bg-green-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${value}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  )
}

function InfoRow({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: string
}) {
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

export default function ResultCard() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('lastResult')
    if (raw) {
      setResult(JSON.parse(raw) as AnalysisResult)
      requestAnimationFrame(() => setVisible(true))
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
  const confidenceLevel =
    result.confidence >= 75 ? 'High' : result.confidence >= 50 ? 'Medium' : 'Low'

  return (
    <div
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image */}
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
              <div className="flex items-center justify-center h-full text-5xl text-green-200">
                🗃️
              </div>
            )}
          </div>
          {/* Hazard badge */}
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-green-700/60 font-medium">Hazard Status</span>
            <span
              id="hazard-badge"
              className={`badge font-semibold ${
                result.hazard
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {result.hazard ? '⚠️ Hazardous' : '✅ No Hazard'}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="glass-card rounded-2xl p-5 space-y-4">
          {/* Action header */}
          <div
            className="rounded-xl p-4 text-white text-center"
            style={{ background: `linear-gradient(135deg, ${actionColor}dd, ${actionColor})` }}
          >
            <p className="text-xs font-medium opacity-80 uppercase tracking-wide mb-1">
              Recommended Action
            </p>
            <p id="action-label" className="text-2xl font-bold">
              {formatAction(result.action)}
            </p>
          </div>

          {/* Info rows */}
          <div>
            <InfoRow label="Item Type" value={formatItemType(result.itemType)} />
            <InfoRow label="Condition" value={formatCondition(result.condition)} />
            <InfoRow
              label="AI Confidence"
              value={confidenceLevel}
              accent={result.confidence >= 75 ? '#16a34a' : result.confidence >= 50 ? '#d97706' : '#dc2626'}
            />
          </div>

          {/* Confidence bar */}
          <ConfidenceBar value={result.confidence} />
        </div>
      </div>

      {/* Recommendation */}
      <div className="glass-card rounded-2xl p-6 mt-6 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">💡</span>
          <h3 className="font-bold text-green-800 text-lg">Recommendation</h3>
        </div>
        <p id="recommendation-text" className="text-green-700 leading-relaxed">
          {result.recommendation}
        </p>
        {result.confidence < 60 && (
          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700 flex items-start gap-2">
            <span>⚠️</span>
            <span>
              AI confidence is below 60%. We recommend a <strong>human review</strong> before
              taking any action on this item.
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        <Link
          href="/"
          id="analyze-another-btn"
          className="gradient-green text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          📷 Analyze Another Item
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
