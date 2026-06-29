'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { AnalysisResult, ItemType } from '@/types'
import { formatAction, formatCondition, formatItemType, getActionColor, getReuseScoreLabel } from '@/lib/rules'

const ITEM_TYPES: ItemType[] = [
  'cardboard', 'plastic_bottle', 'paper', 'metal_can', 'cable', 'stationery', 'food_container',
]

function ActionBadge({ action }: { action: string }) {
  return (
    <span
      className="badge text-white font-semibold text-xs"
      style={{ background: getActionColor(action) }}
    >
      {formatAction(action)}
    </span>
  )
}

function ReuseScoreMini({ score }: { score: number }) {
  const { label, color } = getReuseScoreLabel(score)
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-16 bg-green-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold" style={{ color }}>{score}</span>
      <span className="text-xs text-green-600/50 hidden sm:inline">— {label}</span>
    </div>
  )
}

export default function HistoryView() {
  const [items, setItems] = useState<AnalysisResult[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('')
  const [filterAction, setFilterAction] = useState<string>('')

  const fetchHistory = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: '12' })
      if (filterType) params.set('type', filterType)
      if (filterAction) params.set('action', filterAction)
      const res = await fetch(`/api/history?${params.toString()}`)
      const data = await res.json()
      setItems(data.data ?? [])
      setTotal(data.total ?? 0)
      setTotalPages(data.totalPages ?? 1)
      setPage(p)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [filterType, filterAction])

  useEffect(() => { fetchHistory(1) }, [fetchHistory])

  // Client-side search filter (by item type label or recommendation)
  const displayItems = search.trim()
    ? items.filter((item) =>
        formatItemType(item.itemType).toLowerCase().includes(search.toLowerCase()) ||
        item.condition.toLowerCase().includes(search.toLowerCase()) ||
        item.recommendation?.toLowerCase().includes(search.toLowerCase())
      )
    : items

  if (loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        <p className="text-green-700 font-medium text-sm">Loading history...</p>
      </div>
    )
  }

  if (!loading && items.length === 0 && !filterType && !filterAction) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-6xl animate-float">📭</div>
        <h3 className="text-xl font-bold text-green-800">No predictions yet</h3>
        <p className="text-green-600/70 text-sm">Upload and analyze an item to see results here</p>
        <Link
          href="/"
          className="inline-block gradient-green text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
        >
          📷 Upload an Image
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Search + Filter bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 text-sm">🔍</span>
          <input
            id="history-search"
            type="text"
            placeholder="Search by type, condition, or recommendation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-green-200 text-sm text-green-800 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 bg-white"
          />
        </div>
        <select
          id="filter-type"
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setPage(1) }}
          className="px-3 py-2.5 rounded-xl border border-green-200 text-sm text-green-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30"
        >
          <option value="">All Types</option>
          {ITEM_TYPES.map((t) => (
            <option key={t} value={t}>{formatItemType(t)}</option>
          ))}
        </select>
        <select
          id="filter-action"
          value={filterAction}
          onChange={(e) => { setFilterAction(e.target.value); setPage(1) }}
          className="px-3 py-2.5 rounded-xl border border-green-200 text-sm text-green-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/30"
        >
          <option value="">All Actions</option>
          {['reuse', 'repair', 'donate', 'dismantle', 'dispose', 'manual_review'].map((a) => (
            <option key={a} value={a}>{formatAction(a)}</option>
          ))}
        </select>
        {(filterType || filterAction || search) && (
          <button
            onClick={() => { setFilterType(''); setFilterAction(''); setSearch('') }}
            className="px-3 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-green-700/60">
          Showing <span className="font-semibold text-green-700">{displayItems.length}</span> of{' '}
          <span className="font-semibold text-green-700">{total}</span> predictions
        </p>
        <Link href="/" className="text-sm font-medium text-green-600 hover:text-green-700">
          + Analyze new item
        </Link>
      </div>

      {/* Cards grid */}
      {displayItems.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayItems.map((item, i) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200 animate-fadeInUp"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-video bg-green-50">
                {item.imageUrl && item.imageUrl !== '' ? (
                  <Image
                    src={item.imageUrl}
                    alt={formatItemType(item.itemType)}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={() => {}}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl text-green-200">🗃️</div>
                )}
                <div className="absolute top-2 right-2">
                  <ActionBadge action={item.action} />
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-green-800 text-sm leading-tight">
                    {formatItemType(item.itemType)}
                  </h4>
                  <span
                    className={`badge text-xs flex-shrink-0 ${
                      item.hazard ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {item.hazard ? '⚠️' : '✅'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-green-600/70">
                  <span>{formatCondition(item.condition)}</span>
                  <span>·</span>
                  <span>{item.confidence}% confidence</span>
                </div>

                {/* Reuse Score */}
                {typeof item.reuseScore === 'number' && (
                  <div className="space-y-0.5">
                    <p className="text-xs text-green-600/50 font-medium">Reuse Score</p>
                    <ReuseScoreMini score={item.reuseScore} />
                  </div>
                )}

                <p className="text-xs text-green-700/60 line-clamp-2">{item.recommendation}</p>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-green-500/50">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                  <Link
                    href={`/passport/${item.id}`}
                    className="text-xs font-semibold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-2 py-1 rounded-lg transition-colors"
                  >
                    🌿 Passport
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-green-600/60">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium">No results match your filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            id="prev-page-btn"
            onClick={() => fetchHistory(page - 1)}
            disabled={page <= 1 || loading}
            className="px-4 py-2 rounded-xl border border-green-200 text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <span className="text-sm text-green-700/60">Page {page} of {totalPages}</span>
          <button
            id="next-page-btn"
            onClick={() => fetchHistory(page + 1)}
            disabled={page >= totalPages || loading}
            className="px-4 py-2 rounded-xl border border-green-200 text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
