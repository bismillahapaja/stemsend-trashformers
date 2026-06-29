'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { PassportData } from '@/types'
import PassportCard from '@/components/PassportCard'

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
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        <p className="text-green-700 font-medium">Loading GreenLoop Passport...</p>
      </div>
    )
  }

  if (error || !passport) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-6xl">🔍</div>
        <h1 className="text-2xl font-bold text-green-900">Passport Not Found</h1>
        <p className="text-green-700/60">{error ?? 'This passport does not exist.'}</p>
        <Link
          href="/"
          className="inline-block gradient-green text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
        >
          📷 Analyze an Item
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full">
            🌿 GreenLoop Passport
          </div>
          <h1 className="text-2xl font-bold text-green-900">
            {passport.passportId}
          </h1>
        </div>
        <Link
          href="/history"
          className="text-sm font-medium text-green-600 hover:text-green-700"
        >
          ← Back to History
        </Link>
      </div>
      <PassportCard passport={passport} />
    </div>
  )
}
