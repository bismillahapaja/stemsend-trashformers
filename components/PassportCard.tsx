'use client'

import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import type { PassportData } from '@/types'
import { formatItemType, formatCondition, formatAction, getActionColor, getReuseScoreLabel } from '@/lib/rules'
import ReuseScoreGauge from './ReuseScoreGauge'

interface PassportCardProps {
  passport: PassportData
}

export default function PassportCard({ passport }: PassportCardProps) {
  const actionColor = getActionColor(passport.action)
  const { label: reuseLabel, color: reuseColor } = getReuseScoreLabel(passport.reuseScore)
  const passportUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/passport/${passport.id}`
      : `/passport/${passport.id}`

  return (
    <div className="glass-card rounded-3xl overflow-hidden shadow-xl shadow-green-100/50">
      {/* Passport Header */}
      <div className="gradient-green px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌿</span>
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">
              GreenLoop Passport
            </p>
            <p className="text-white text-2xl font-bold leading-tight">
              {passport.passportId}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-xs">Issued by</p>
          <p className="text-white font-bold text-sm">Stemsend Trashformers</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 grid sm:grid-cols-[1fr_auto] gap-6">
        {/* Left: image + details */}
        <div className="space-y-5">
          {/* Image */}
          {passport.imageUrl && passport.imageUrl !== '' ? (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-green-50">
              <Image
                src={passport.imageUrl}
                alt={formatItemType(passport.itemType)}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, 400px"
              />
            </div>
          ) : (
            <div className="w-full aspect-video rounded-2xl bg-green-50 flex items-center justify-center text-5xl text-green-200">
              🗃️
            </div>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-green-50 rounded-xl px-4 py-3">
              <p className="text-green-600/60 text-xs font-medium mb-0.5">Item Type</p>
              <p className="font-bold text-green-800">{formatItemType(passport.itemType)}</p>
            </div>
            <div className="bg-green-50 rounded-xl px-4 py-3">
              <p className="text-green-600/60 text-xs font-medium mb-0.5">Condition</p>
              <p className="font-bold text-green-800">{formatCondition(passport.condition)}</p>
            </div>
            <div className="bg-green-50 rounded-xl px-4 py-3">
              <p className="text-green-600/60 text-xs font-medium mb-0.5">Decision</p>
              <p className="font-bold" style={{ color: actionColor }}>
                {formatAction(passport.action)}
              </p>
            </div>
            <div className="bg-green-50 rounded-xl px-4 py-3">
              <p className="text-green-600/60 text-xs font-medium mb-0.5">Date</p>
              <p className="font-bold text-green-800">
                {new Date(passport.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="col-span-2 bg-green-50 rounded-xl px-4 py-3">
              <p className="text-green-600/60 text-xs font-medium mb-0.5">Location</p>
              <p className="font-bold text-green-800">{passport.location}</p>
            </div>
          </div>

          {/* Hazard */}
          <div className="flex items-center gap-2">
            <span
              className={`badge text-xs font-semibold ${
                passport.hazard
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {passport.hazard ? '⚠️ Hazardous Item' : '✅ No Hazard Detected'}
            </span>
            <span className="text-xs text-green-600/60">
              AI Confidence: {passport.confidence}%
            </span>
          </div>
        </div>

        {/* Right: score + QR */}
        <div className="flex flex-col items-center gap-6 sm:border-l sm:border-green-100 sm:pl-6">
          {/* Reuse Score */}
          <div className="text-center space-y-1">
            <p className="text-xs font-semibold text-green-600/60 uppercase tracking-wide">
              Reuse Score
            </p>
            <ReuseScoreGauge score={passport.reuseScore} size={140} />
          </div>

          {/* QR Code */}
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold text-green-600/60 uppercase tracking-wide">
              Scan to Verify
            </p>
            <div className="p-3 bg-white rounded-2xl border border-green-100 shadow-sm inline-block">
              <QRCodeSVG
                value={passportUrl}
                size={110}
                fgColor="#15803d"
                bgColor="#ffffff"
                level="M"
              />
            </div>
            <p className="text-xs text-green-600/50 max-w-[140px] text-center">
              {passport.passportId}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-green-100 bg-green-50/50 flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-green-600/60">
          This passport certifies the item has been analyzed by AI and reviewed per circular economy guidelines.
        </p>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ color: reuseColor, background: `${reuseColor}18` }}
        >
          {reuseLabel} Reusability
        </span>
      </div>
    </div>
  )
}
