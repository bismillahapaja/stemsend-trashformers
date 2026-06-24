import type { Metadata } from 'next'
import ResultCard from '@/components/ResultCard'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Analysis Result',
  description: 'View the AI circular economy analysis result for your uploaded waste item.',
}

export default function ResultPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full">
            🤖 AI Analysis Complete
          </div>
          <h1 className="text-3xl font-bold text-green-900">Analysis Result</h1>
          <p className="text-green-700/60">
            Here is what our AI found and recommends for your item.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1 mt-2"
        >
          📊 View Dashboard →
        </Link>
      </div>

      <ResultCard />
    </div>
  )
}
