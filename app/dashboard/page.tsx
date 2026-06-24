import type { Metadata } from 'next'
import DashboardView from '@/components/DashboardView'

export const metadata: Metadata = {
  title: 'Dashboard — Waste Analytics',
  description: 'View circular economy statistics, item counts, environmental impact, and action distribution for your school.',
}

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full">
          📊 School Analytics
        </div>
        <h1 className="text-3xl font-bold text-green-900">Waste Management Dashboard</h1>
        <p className="text-green-700/60">
          Track your school&apos;s circular economy impact in real time.
        </p>
      </div>
      <DashboardView />
    </div>
  )
}
