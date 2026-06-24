import type { Metadata } from 'next'
import HistoryView from '@/components/HistoryView'

export const metadata: Metadata = {
  title: 'Prediction History',
  description: 'Browse all past AI waste analyses performed by your school using Stemsend Trashformers.',
}

export default function HistoryPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full">
          🗂️ Prediction Log
        </div>
        <h1 className="text-3xl font-bold text-green-900">Analysis History</h1>
        <p className="text-green-700/60">
          All past AI waste analyses stored in your school&apos;s database.
        </p>
      </div>
      <HistoryView />
    </div>
  )
}
