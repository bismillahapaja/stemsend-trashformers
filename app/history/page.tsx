import type { Metadata } from 'next'
import HistoryView from '@/components/HistoryView'
import { Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Prediction History',
  description: 'Browse all past AI waste analyses performed by your school using Stemsend Trashformers.',
}

export default function HistoryPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 space-y-8">
      <div className="space-y-2">
        <div
          className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full"
          style={{ background: 'var(--emerald-50)', color: 'var(--forest-800)', border: '1px solid var(--emerald-100)' }}
        >
          <Clock className="w-3.5 h-3.5" />
          Prediction Log
        </div>
        <h1
          className="text-3xl font-bold"
          style={{ color: 'var(--slate-950)', fontFamily: 'var(--font-jakarta)' }}
        >
          Analysis History
        </h1>
        <p style={{ color: 'var(--slate-600)' }}>
          All past AI waste analyses stored in your school&apos;s database.
        </p>
      </div>
      <HistoryView />
    </div>
  )
}
