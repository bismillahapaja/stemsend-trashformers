'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { AnalysisResult } from '@/types'
import { formatAction, formatCondition, formatItemType, getActionColor } from '@/lib/rules'

function ActionBadge({ action }: { action: string }) {
  const color = getActionColor(action)
  return (
    <span
      className="badge text-white font-semibold"
      style={{ background: color }}
    >
      {formatAction(action)}
    </span>
  )
}

export default function HistoryView() {
  const [items, setItems] = useState<AnalysisResult[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchHistory = async (p: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/history?page=${p}&limit=10`)
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
  }

  useEffect(() => { fetchHistory(1) }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        <p className="text-green-700 font-medium text-sm">Loading history...</p>
      </div>
    )
  }

  if (items.length === 0) {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-green-700/60">
          Showing <span className="font-semibold text-green-700">{items.length}</span> of{' '}
          <span className="font-semibold text-green-700">{total}</span> predictions
        </p>
        <Link href="/" className="text-sm font-medium text-green-600 hover:text-green-700">
          + Analyze new item
        </Link>
      </div>

      {/* Grid of history cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="glass-card rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200 animate-fadeInUp"
            style={{ animationDelay: `${i * 60}ms` }}
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
                <div className="flex items-center justify-center h-full text-4xl text-green-200">
                  🗃️
                </div>
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

              {/* Confidence bar */}
              <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.confidence}%`,
                    background: item.confidence >= 75 ? '#22c55e' : item.confidence >= 50 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>

              <p className="text-xs text-green-700/60 line-clamp-2">{item.recommendation}</p>

              <p className="text-xs text-green-500/50 pt-1">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

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
          <span className="text-sm text-green-700/60">
            Page {page} of {totalPages}
          </span>
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
