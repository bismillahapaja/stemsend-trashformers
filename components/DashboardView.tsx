'use client'

import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import type { DashboardStats } from '@/types'
import Link from 'next/link'
import {
  Recycle, Wrench, Heart, Trash2, Package, Eye, BrainCircuit, Leaf,
  Sprout, Camera, Database, RefreshCw, ExternalLink,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ACTION_COLORS: Record<string, string> = {
  Reuse: '#2D6A4F',
  Repair: '#d97706',
  Donate: '#3b82f6',
  Dismantle: '#8b5cf6',
  Dispose: '#ef4444',
  'Manual Review': '#64748b',
}

const TYPE_COLORS = [
  '#2D6A4F', '#1A362E', '#4CAF82', '#6ECFA0', '#d97706', '#3b82f6', '#8b5cf6',
]

function StatCard({
  label, value, Icon, color, unit = '', pulse = false,
}: {
  label: string; value: number | string; Icon: LucideIcon; color: string; unit?: string; pulse?: boolean
}) {
  return (
    <div
      className="card-premium p-5 flex items-center gap-4"
      style={{ borderRadius: '1rem' }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 relative"
        style={{ background: `${color}14` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
        {pulse && (
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse-dot"
            style={{ background: color }}
          />
        )}
      </div>
      <div>
        <p className="text-xs font-medium" style={{ color: 'var(--slate-500)' }}>{label}</p>
        <p className="text-2xl font-bold mt-0.5" style={{ color }}>
          {value}
          {unit && <span className="text-sm font-medium ml-1" style={{ color: 'var(--slate-400)' }}>{unit}</span>}
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
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div
          className="w-10 h-10 border-[3px] rounded-full animate-spin-slow"
          style={{ borderColor: 'var(--emerald-100)', borderTopColor: 'var(--emerald-700)' }}
        />
        <p className="font-medium text-sm" style={{ color: 'var(--emerald-700)' }}>Loading dashboard...</p>
      </div>
    )
  }

  if (!stats) return null

  const isEmpty = stats.totalItems === 0

  return (
    <div className="space-y-6">
      {/* Empty state */}
      {isEmpty && (
        <div className="card-premium p-10 text-center space-y-5" style={{ borderRadius: '1rem' }}>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto animate-float"
            style={{ background: 'var(--emerald-50)' }}
          >
            <Sprout className="w-8 h-8" style={{ color: 'var(--emerald-700)' }} />
          </div>
          <h3 className="text-xl font-bold" style={{ color: 'var(--slate-900)', fontFamily: 'var(--font-jakarta)' }}>
            No data yet
          </h3>
          <p className="text-sm" style={{ color: 'var(--slate-500)' }}>
            Upload items to start tracking, or load sample data to explore the dashboard
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="btn-primary"
              style={{ borderRadius: '0.5rem' }}
            >
              <Camera className="w-4 h-4" />
              Upload Item
            </Link>
            <button
              id="seed-btn"
              onClick={handleSeed}
              disabled={seeding}
              className="btn-ghost disabled:opacity-60"
              style={{ borderRadius: '0.5rem' }}
            >
              {seeding
                ? <><RefreshCw className="w-4 h-4 animate-spin-slow" /> Loading...</>
                : <><Database className="w-4 h-4" /> Load Sample Data</>
              }
            </button>
          </div>
        </div>
      )}

      {/* AI Feedback Banner */}
      {stats.feedbackCount > 0 && (
        <div
          className="rounded-2xl p-4 flex items-center gap-4 shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--forest-800) 0%, var(--emerald-700) 100%)', boxShadow: '0 8px 24px rgba(26,54,46,0.2)' }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">AI Improved Through Human Feedback</p>
            <p className="text-white/70 text-xs mt-0.5">
              {stats.feedbackCount} teacher correction{stats.feedbackCount !== 1 ? 's' : ''} recorded — the system learns from your expertise.
            </p>
          </div>
          <div className="text-white/90 text-2xl font-bold flex-shrink-0" style={{ fontFamily: 'var(--font-jakarta)' }}>
            {stats.feedbackCount}
            <span className="text-sm font-normal text-white/60 ml-1">corrections</span>
          </div>
        </div>
      )}

      {/* Action stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Reuse"   value={stats.reuseCount}   Icon={Recycle} color="#2D6A4F" />
        <StatCard label="Repair"  value={stats.repairCount}  Icon={Wrench}  color="#d97706" />
        <StatCard label="Donate"  value={stats.donateCount}  Icon={Heart}   color="#3b82f6" />
        <StatCard label="Dispose" value={stats.disposeCount} Icon={Trash2}  color="#ef4444" />
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Items"    value={stats.totalItems}       Icon={Package}      color="var(--forest-800)" />
        <StatCard label="Manual Review"  value={stats.manualReviewCount} Icon={Eye}          color="#64748b" />
        <StatCard label="Feedback Given" value={stats.feedbackCount}    Icon={BrainCircuit} color="#8b5cf6" pulse={stats.feedbackCount > 0} />
        <StatCard
          label="Items Saved"
          value={stats.reuseCount + stats.repairCount + stats.donateCount}
          Icon={Leaf}
          color="var(--emerald-700)"
        />
      </div>

      {/* Environmental impact */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card-premium p-5" style={{ borderRadius: '1rem' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--emerald-50)' }}
            >
              <Leaf className="w-5 h-5" style={{ color: 'var(--emerald-700)' }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--slate-500)' }}>Estimated Waste Saved</p>
              <p className="text-3xl font-bold mt-0.5" style={{ color: 'var(--forest-800)', fontFamily: 'var(--font-jakarta)' }}>
                {stats.estimatedWasteKg} <span className="text-base font-medium" style={{ color: 'var(--slate-400)' }}>kg</span>
              </p>
            </div>
          </div>
        </div>
        <div className="card-premium p-5" style={{ borderRadius: '1rem' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#e0f2fe' }}
            >
              <Recycle className="w-5 h-5" style={{ color: '#0284c7' }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--slate-500)' }}>Estimated CO₂ Reduction</p>
              <p className="text-3xl font-bold mt-0.5" style={{ color: 'var(--forest-800)', fontFamily: 'var(--font-jakarta)' }}>
                {stats.estimatedCO2Kg} <span className="text-base font-medium" style={{ color: 'var(--slate-400)' }}>kg CO₂</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {!isEmpty && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie chart */}
          <div className="card-premium p-5" style={{ borderRadius: '1rem' }}>
            <h3 className="font-bold mb-4" style={{ color: 'var(--slate-900)', fontFamily: 'var(--font-jakarta)' }}>
              Actions Distribution
            </h3>
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                  contentStyle={{ borderRadius: '10px', border: '1px solid var(--slate-200)', fontSize: '13px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart */}
          <div className="card-premium p-5" style={{ borderRadius: '1rem' }}>
            <h3 className="font-bold mb-4" style={{ color: 'var(--slate-900)', fontFamily: 'var(--font-jakarta)' }}>
              Items by Type
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.byType} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--slate-100)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--slate-500)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--slate-500)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--slate-200)', fontSize: '13px' }} />
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
        <div className="card-premium overflow-hidden" style={{ borderRadius: '1rem' }}>
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid var(--slate-100)' }}
          >
            <h3 className="font-bold" style={{ color: 'var(--slate-900)', fontFamily: 'var(--font-jakarta)' }}>
              Recent Activity
            </h3>
            <Link
              href="/history"
              className="text-sm font-medium flex items-center gap-1 transition-colors"
              style={{ color: 'var(--emerald-700)' }}
            >
              View all <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div style={{ borderTop: 'none' }}>
            {stats.recent.map((item) => {
              const actionLabel = item.action.charAt(0).toUpperCase() + item.action.slice(1).replace('_', ' ')
              const dotColor = ACTION_COLORS[actionLabel] ?? '#64748b'
              return (
                <div
                  key={item.id}
                  className="px-5 py-3 flex items-center gap-4 transition-colors hover:bg-slate-50"
                  style={{ borderBottom: '1px solid var(--slate-50)' }}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--slate-800)' }}>
                      {item.itemType.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      {' — '}
                      <span style={{ color: 'var(--slate-500)' }}>{item.condition}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {typeof item.reuseScore === 'number' && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--emerald-50)', color: 'var(--emerald-700)' }}
                      >
                        {item.reuseScore}pts
                      </span>
                    )}
                    <span className="text-xs" style={{ color: 'var(--slate-400)' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/passport/${item.id}`}
                      className="text-xs font-medium flex items-center gap-1 transition-colors"
                      style={{ color: 'var(--emerald-700)' }}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Refresh */}
      {!isEmpty && (
        <div className="text-center">
          <button
            onClick={fetchStats}
            className="btn-ghost text-sm"
            style={{ borderRadius: '0.5rem' }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Data
          </button>
        </div>
      )}
    </div>
  )
}
