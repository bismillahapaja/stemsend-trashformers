'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { AnalysisResult, ItemType } from '@/types'
import { formatAction, formatCondition, formatItemType, getActionColor, getReuseScoreLabel } from '@/lib/rules'
import {
  Inbox, Camera, SearchX, Search, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle, FileText,
} from 'lucide-react'

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
      <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ background: 'var(--slate-200)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold" style={{ color }}>{score}</span>
      <span className="text-xs hidden sm:inline" style={{ color: 'var(--slate-400)' }}>— {label}</span>
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
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div
          className="w-10 h-10 border-[3px] rounded-full animate-spin-slow"
          style={{ borderColor: 'var(--slate-200)', borderTopColor: 'var(--emerald-700)' }}
        />
        <p className="font-medium text-sm" style={{ color: 'var(--slate-600)' }}>Loading history...</p>
      </div>
    )
  }

  if (!loading && items.length === 0 && !filterType && !filterAction) {
    return (
      <div className="text-center py-20 space-y-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto animate-float"
          style={{ background: 'var(--slate-100)' }}
        >
          <Inbox className="w-8 h-8" style={{ color: 'var(--slate-400)' }} />
        </div>
        <h3 className="text-xl font-bold" style={{ color: 'var(--slate-800)', fontFamily: 'var(--font-jakarta)' }}>
          No predictions yet
        </h3>
        <p className="text-sm" style={{ color: 'var(--slate-500)' }}>
          Upload and analyze an item to see results here
        </p>
        <Link
          href="/"
          className="btn-primary inline-flex"
          style={{ borderRadius: '0.5rem' }}
        >
          <Camera className="w-4 h-4" />
          Upload an Image
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Search + Filter bar */}
      <div
        className="card-premium p-4 flex flex-col sm:flex-row gap-3"
        style={{ borderRadius: '1rem' }}
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--slate-400)' }}
          />
          <input
            id="history-search"
            type="text"
            placeholder="Search by type, condition, or recommendation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm placeholder-slate-400 outline-none transition-all"
            style={{
              border: '1px solid var(--slate-200)',
              color: 'var(--slate-800)',
              background: '#fff',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--emerald-700)'; e.target.style.boxShadow = '0 0 0 2px rgba(45,106,79,0.12)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--slate-200)'; e.target.style.boxShadow = 'none' }}
          />
        </div>
        <select
          id="filter-type"
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setPage(1) }}
          className="px-3 py-2.5 rounded-xl border text-sm outline-none transition-all"
          style={{
            border: '1px solid var(--slate-200)',
            color: 'var(--slate-700)',
            background: '#fff',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--emerald-700)'; e.target.style.boxShadow = '0 0 0 2px rgba(45,106,79,0.12)' }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--slate-200)'; e.target.style.boxShadow = 'none' }}
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
          className="px-3 py-2.5 rounded-xl border text-sm outline-none transition-all"
          style={{
            border: '1px solid var(--slate-200)',
            color: 'var(--slate-700)',
            background: '#fff',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--emerald-700)'; e.target.style.boxShadow = '0 0 0 2px rgba(45,106,79,0.12)' }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--slate-200)'; e.target.style.boxShadow = 'none' }}
        >
          <option value="">All Actions</option>
          {['reuse', 'repair', 'donate', 'dismantle', 'dispose', 'manual_review'].map((a) => (
            <option key={a} value={a}>{formatAction(a)}</option>
          ))}
        </select>
        {(filterType || filterAction || search) && (
          <button
            onClick={() => { setFilterType(''); setFilterAction(''); setSearch('') }}
            className="px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors"
            style={{ border: '1px solid #FECACA', color: '#B91C1C', background: '#FFF' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--slate-500)' }}>
          Showing <span className="font-semibold" style={{ color: 'var(--slate-800)' }}>{displayItems.length}</span> of{' '}
          <span className="font-semibold" style={{ color: 'var(--slate-800)' }}>{total}</span> predictions
        </p>
        <Link
          href="/"
          className="text-sm font-medium transition-colors flex items-center gap-1"
          style={{ color: 'var(--emerald-700)' }}
        >
          <Camera className="w-3.5 h-3.5" /> Analyze new item
        </Link>
      </div>

      {/* Cards grid */}
      {displayItems.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayItems.map((item, i) => (
            <div
              key={item.id}
              className="card-premium overflow-hidden animate-fadeInUp"
              style={{ animationDelay: `${i * 50}ms`, borderRadius: '1rem' }}
            >
              {/* Image */}
              <div className="relative aspect-video" style={{ background: 'var(--slate-50)' }}>
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
                  <div className="flex items-center justify-center h-full">
                    <FileText className="w-10 h-10" style={{ color: 'var(--slate-300)' }} />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <ActionBadge action={item.action} />
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h4
                    className="font-bold text-sm leading-tight"
                    style={{ color: 'var(--slate-900)', fontFamily: 'var(--font-jakarta)' }}
                  >
                    {formatItemType(item.itemType)}
                  </h4>
                  <span
                    className="badge text-xs flex-shrink-0"
                    style={
                      item.hazard
                        ? { background: '#FEE2E2', color: '#B91C1C' }
                        : { background: 'var(--emerald-50)', color: 'var(--emerald-700)' }
                    }
                  >
                    {item.hazard
                      ? <AlertTriangle className="w-3 h-3" />
                      : <CheckCircle className="w-3 h-3" />
                    }
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--slate-500)' }}>
                  <span>{formatCondition(item.condition)}</span>
                  <span>·</span>
                  <span>{item.confidence}% confidence</span>
                </div>

                {/* Reuse Score */}
                {typeof item.reuseScore === 'number' && (
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium" style={{ color: 'var(--slate-400)' }}>Reuse Score</p>
                    <ReuseScoreMini score={item.reuseScore} />
                  </div>
                )}

                <p className="text-xs line-clamp-2" style={{ color: 'var(--slate-500)' }}>{item.recommendation}</p>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs" style={{ color: 'var(--slate-400)' }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                  <Link
                    href={`/passport/${item.id}`}
                    className="text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded-lg transition-colors"
                    style={{ color: 'var(--emerald-700)', background: 'var(--emerald-50)' }}
                  >
                    <FileText className="w-3 h-3" />
                    Passport
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-14 space-y-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: 'var(--slate-100)' }}
          >
            <SearchX className="w-7 h-7" style={{ color: 'var(--slate-400)' }} />
          </div>
          <p className="font-medium" style={{ color: 'var(--slate-600)' }}>No results match your filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            id="prev-page-btn"
            onClick={() => fetchHistory(page - 1)}
            disabled={page <= 1 || loading}
            className="btn-ghost px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ borderRadius: '0.5rem' }}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-sm px-2" style={{ color: 'var(--slate-500)' }}>
            Page {page} of {totalPages}
          </span>
          <button
            id="next-page-btn"
            onClick={() => fetchHistory(page + 1)}
            disabled={page >= totalPages || loading}
            className="btn-ghost px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ borderRadius: '0.5rem' }}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
