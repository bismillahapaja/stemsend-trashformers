import type { Metadata } from 'next'
import ResultCard from '@/components/ResultCard'
import Link from 'next/link'
import { BrainCircuit, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Analysis Result',
  description: 'View the AI circular economy analysis result for your uploaded waste item.',
}

export default function ResultPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <div
            className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full"
            style={{ background: 'var(--emerald-50)', color: 'var(--forest-800)', border: '1px solid var(--emerald-100)' }}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            AI Analysis Complete
          </div>
          <h1
            className="text-3xl font-bold"
            style={{ color: 'var(--slate-950)', fontFamily: 'var(--font-jakarta)' }}
          >
            Analysis Result
          </h1>
          <p style={{ color: 'var(--slate-600)' }}>
            Here is what our AI found and recommends for your item.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-medium flex items-center gap-1.5 mt-2 transition-colors"
          style={{ color: 'var(--emerald-700)' }}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          View Dashboard
        </Link>
      </div>

      <ResultCard />
    </div>
  )
}
