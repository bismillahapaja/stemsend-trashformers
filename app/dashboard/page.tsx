import type { Metadata } from 'next'
import DashboardView from '@/components/DashboardView'
import { BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard — Waste Analytics',
  description: 'View circular economy statistics, item counts, environmental impact, and action distribution for your school.',
}

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 space-y-8">
      <div className="space-y-2">
        <div
          className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full"
          style={{ background: 'var(--emerald-50)', color: 'var(--forest-800)', border: '1px solid var(--emerald-100)' }}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          School Analytics
        </div>
        <h1
          className="text-3xl font-bold"
          style={{ color: 'var(--slate-950)', fontFamily: 'var(--font-jakarta)' }}
        >
          Waste Management Dashboard
        </h1>
        <p style={{ color: 'var(--slate-600)' }}>
          Track your school&apos;s circular economy impact in real time.
        </p>
      </div>
      <DashboardView />
    </div>
  )
}
