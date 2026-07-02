'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { PassportData } from '@/types'
import PassportCard from '@/components/PassportCard'
import { Loader2, Search, Camera, ChevronLeft, Leaf } from 'lucide-react'

export default function PassportPage() {
  const params = useParams()
  const id = params?.id as string
  const [passport, setPassport] = useState<PassportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/passport?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setPassport(data as PassportData)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 animate-spin-slow" style={{ color: 'var(--emerald-700)' }} />
        <p className="font-medium" style={{ color: 'var(--slate-600)' }}>
          Loading Stemsend Trashformers Passport...
        </p>
      </div>
    )
  }

  if (error || !passport) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center space-y-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto animate-float"
          style={{ background: 'var(--slate-100)' }}
        >
          <Search className="w-8 h-8" style={{ color: 'var(--slate-400)' }} />
        </div>
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--slate-900)', fontFamily: 'var(--font-jakarta)' }}
        >
          Passport Not Found
        </h1>
        <p style={{ color: 'var(--slate-500)' }}>{error ?? 'This passport does not exist.'}</p>
        <Link
          href="/"
          className="btn-primary inline-flex"
          style={{ borderRadius: '0.5rem' }}
        >
          <Camera className="w-4 h-4" />
          Analyze an Item
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1.5">
          <div
            className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full"
            style={{ background: 'var(--emerald-50)', color: 'var(--forest-800)', border: '1px solid var(--emerald-100)' }}
          >
            <Leaf className="w-3.5 h-3.5" />
            Stemsend Trashformers Passport
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--slate-950)', fontFamily: 'var(--font-jakarta)' }}
          >
            {passport.passportId}
          </h1>
        </div>
        <Link
          href="/history"
          className="text-sm font-medium flex items-center gap-1.5 transition-colors"
          style={{ color: 'var(--emerald-700)' }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to History
        </Link>
      </div>
      <PassportCard passport={passport} />
    </div>
  )
}
