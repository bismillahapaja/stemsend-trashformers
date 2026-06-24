'use client'

import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { DashboardStats } from '@/types'
import Link from 'next/link'

const ACTION_COLORS: Record<string, string> = {
  Reuse: '#22c55e',
  Repair: '#f59e0b',
  Donate: '#3b82f6',
  Dismantle: '#8b5cf6',
  Dispose: '#ef4444',
  'Manual Review': '#64748b',
}

const TYPE_COLORS = [
  '#22c55e', '#16a34a', '#4ade80', '#86efac', '#f59e0b', '#3b82f6', '#8b5cf6',
]

function StatCard({
  label,
  value,
  icon,
  color,
  unit = '',
}: {
  label: string
  value: number | string
  icon: string
  color: string
  unit?: string
}) {
  return (
    <div className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-200">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-green-700/60 font-medium">{label}</p>
        <p className="text-2xl font-bold" style={{ color }}>
          {value}
          {unit && <span className="text-sm font-medium text-green-700/50 ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  )
}

export default function DashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dashboard')
      const data = await res.json()
      setStats(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  const handleSeed = async () => {
    setSeeding(true)
    await fetch('/api/seed', { method: 'POST' })
    await fetchStats()
    setSeeding(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        <p className="text-green-700 font-medium">Loading dashboard...</p>
      </div>
    )
  }

  if (!stats) return null

  const isEmpty = stats.totalItems === 0

  return (
    <div className="space-y-6">
      {/* Seed button for empty state */}
      {isEmpty && (
        <div className="glass-card rounded-2xl p-8 text-center space-y-4">
          <div className="text-5xl animate-float">🌱</div>
          <h3 className="text-xl font-bold text-green-800">No data yet</h3>
          <p className="text-green-600/70 text-sm">
            Upload items to start tracking, or load sample data to explore the dashboard
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="gradient-green text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm"
            >
              📷 Upload Item
            </Link>
            <button
              id="seed-btn"
              onClick={handleSeed}
              disabled={seeding}
              className="bg-white text-green-700 font-semibold px-5 py-2.5 rounded-xl border border-green-200 hover:bg-green-50 transition-all text-sm disabled:opacity-60"
            >
              {seeding ? '⏳ Loading...' : '🌿 Load Sample Data'}
            </button>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Reuse" value={stats.reuseCount} icon="♻️" color="#22c55e" />
        <StatCard label="Repair" value={stats.repairCount} icon="🔧" color="#f59e0b" />
        <StatCard label="Donate" value={stats.donateCount} icon="🎁" color="#3b82f6" />
        <StatCard label="Dispose" value={stats.disposeCount} icon="🗑️" color="#ef4444" />
      </div>

      {/* Environmental impact */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🌍</span>
            <div>
              <p className="text-sm text-green-700/60 font-medium">Estimated Waste Saved</p>
              <p className="text-3xl font-bold text-green-700">
                {stats.estimatedWasteKg} <span className="text-base font-medium text-green-600/60">kg</span>
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">💨</span>
            <div>
              <p className="text-sm text-green-700/60 font-medium">Estimated CO₂ Reduction</p>
              <p className="text-3xl font-bold text-emerald-700">
                {stats.estimatedCO2Kg} <span className="text-base font-medium text-emerald-600/60">kg CO₂</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {!isEmpty && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie chart - by action */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-bold text-green-800 mb-4">Actions Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={stats.byAction}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {stats.byAction.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={ACTION_COLORS[entry.name] ?? TYPE_COLORS[index % TYPE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #bbf7d0',
                    fontSize: '13px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart - by item type */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-bold text-green-800 mb-4">Items by Type</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.byType} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#15803d' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#15803d' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #bbf7d0',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
                  {stats.byType.map((_, index) => (
                    <Cell key={`bar-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent activity */}
      {stats.recent.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-green-50 flex items-center justify-between">
            <h3 className="font-bold text-green-800">Recent Activity</h3>
            <Link href="/history" className="text-sm text-green-600 hover:text-green-700 font-medium">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-green-50">
            {stats.recent.map((item) => (
              <div key={item.id} className="px-5 py-3 flex items-center gap-4 hover:bg-green-50/50 transition-colors">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: ACTION_COLORS[item.action.charAt(0).toUpperCase() + item.action.slice(1).replace('_', ' ')] ?? '#64748b' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-800 truncate">
                    {item.itemType.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    {' — '}
                    <span className="text-green-600/70">{item.condition}</span>
                  </p>
                </div>
                <span className="text-xs font-medium text-green-600/60 flex-shrink-0">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
