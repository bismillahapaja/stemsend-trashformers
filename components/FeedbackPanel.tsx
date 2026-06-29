'use client'

import { useState } from 'react'
import type { Action } from '@/types'
import { formatAction, getActionColor } from '@/lib/rules'

const ACTIONS: Action[] = ['reuse', 'repair', 'donate', 'dismantle', 'dispose', 'manual_review']

interface FeedbackPanelProps {
  predictionId: number
  aiAction: Action
}

export default function FeedbackPanel({ predictionId, aiAction }: FeedbackPanelProps) {
  const [humanAction, setHumanAction] = useState<Action>(aiAction)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (humanAction === aiAction) {
      setError('Please select a different action to provide feedback.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictionId, aiAction, humanAction }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to submit feedback')
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5 space-y-2 text-center">
        <div className="text-3xl">🧠</div>
        <p className="font-bold text-green-800">AI Improved Through Human Feedback</p>
        <p className="text-sm text-green-600/70">
          Thank you! Your correction has been recorded. This helps improve future recommendations.
        </p>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: getActionColor(aiAction) }}
          />
          AI said: {formatAction(aiAction)}
          <span className="mx-1">→</span>
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: getActionColor(humanAction) }}
          />
          You changed to: {formatAction(humanAction)}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">✏️</span>
        <div>
          <p className="font-bold text-green-800 text-sm">Human Feedback</p>
          <p className="text-xs text-green-600/60">
            Disagree with the AI? Override the recommendation below.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-green-700/70">
          <span>AI recommended:</span>
          <span
            className="font-bold px-2.5 py-1 rounded-full text-white text-xs"
            style={{ background: getActionColor(aiAction) }}
          >
            {formatAction(aiAction)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-green-700/70 uppercase tracking-wide">
          Your Decision
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ACTIONS.map((action) => {
            const selected = humanAction === action
            const color = getActionColor(action)
            return (
              <button
                key={action}
                onClick={() => { setHumanAction(action); setError(null) }}
                className="py-2 px-3 rounded-xl text-xs font-semibold border-2 transition-all duration-150"
                style={
                  selected
                    ? { borderColor: color, background: color, color: '#fff' }
                    : { borderColor: '#e2e8f0', background: '#fff', color: '#374151' }
                }
              >
                {formatAction(action)}
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting || humanAction === aiAction}
        className="w-full gradient-green text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all shadow-md shadow-green-100"
      >
        {submitting ? '⏳ Submitting...' : '✅ Submit Feedback'}
      </button>
    </div>
  )
}
