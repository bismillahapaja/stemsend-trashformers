'use client'

import { useState } from 'react'
import type { Action } from '@/types'
import { formatAction, getActionColor } from '@/lib/rules'
import { BrainCircuit, PenLine, Loader2, CheckCircle2 } from 'lucide-react'

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
      <div
        className="rounded-2xl p-6 space-y-3 text-center"
        style={{ border: '1px solid var(--emerald-100)', background: 'linear-gradient(135deg, var(--emerald-50), #f0fdf4)' }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto"
          style={{ background: 'var(--emerald-100)' }}
        >
          <BrainCircuit className="w-6 h-6" style={{ color: 'var(--emerald-700)' }} />
        </div>
        <p className="font-bold" style={{ color: 'var(--forest-800)', fontFamily: 'var(--font-jakarta)' }}>
          AI Improved Through Human Feedback
        </p>
        <p className="text-sm" style={{ color: 'var(--slate-500)' }}>
          Thank you! Your correction has been recorded. This helps improve future recommendations.
        </p>
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: 'var(--emerald-100)', color: 'var(--forest-800)' }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: getActionColor(aiAction) }} />
          AI said: {formatAction(aiAction)}
          <span className="mx-1">→</span>
          <span className="w-2 h-2 rounded-full" style={{ background: getActionColor(humanAction) }} />
          You changed to: {formatAction(humanAction)}
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{ border: '1px solid var(--slate-200)', background: '#fff' }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--slate-100)' }}
        >
          <PenLine className="w-4 h-4" style={{ color: 'var(--slate-600)' }} />
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: 'var(--slate-900)', fontFamily: 'var(--font-jakarta)' }}>
            Human Feedback
          </p>
          <p className="text-xs" style={{ color: 'var(--slate-500)' }}>
            Disagree with the AI? Override the recommendation below.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--slate-600)' }}>
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
        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--slate-500)' }}>
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
                    : { borderColor: 'var(--slate-200)', background: '#fff', color: 'var(--slate-700)' }
                }
              >
                {formatAction(action)}
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <p
          className="text-xs px-3 py-2 rounded-lg"
          style={{ background: '#FEF2F2', color: '#B91C1C' }}
        >
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting || humanAction === aiAction}
        className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ borderRadius: '0.75rem' }}
      >
        {submitting
          ? <><Loader2 className="w-4 h-4 animate-spin-slow" /> Submitting...</>
          : <><CheckCircle2 className="w-4 h-4" /> Submit Feedback</>
        }
      </button>
    </div>
  )
}
