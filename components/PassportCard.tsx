'use client'

import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import type { PassportData } from '@/types'
import { formatItemType, formatCondition, formatAction, getActionColor, getReuseScoreLabel } from '@/lib/rules'
import ReuseScoreGauge from './ReuseScoreGauge'
import { Leaf, ImageOff, AlertTriangle, ShieldCheck } from 'lucide-react'

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
    <div
      className="card-premium overflow-hidden shadow-xl"
      style={{ borderRadius: '1.5rem', boxShadow: '0 20px 60px rgba(26,54,46,0.12)' }}
    >
      {/* Passport Header */}
      <div
        className="px-6 py-5 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, var(--forest-800) 0%, var(--emerald-700) 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">
              Stemsend Trashformers Passport
            </p>
            <p className="text-white text-2xl font-bold leading-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>
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
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden" style={{ background: 'var(--slate-50)' }}>
              <Image
                src={passport.imageUrl}
                alt={formatItemType(passport.itemType)}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, 400px"
              />
            </div>
          ) : (
            <div
              className="w-full aspect-video rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--slate-50)' }}
            >
              <ImageOff className="w-12 h-12" style={{ color: 'var(--slate-300)' }} />
            </div>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Item Type', value: formatItemType(passport.itemType) },
              { label: 'Condition', value: formatCondition(passport.condition) },
              {
                label: 'Decision',
                value: formatAction(passport.action),
                style: { color: actionColor, fontWeight: '700' },
              },
              {
                label: 'Date',
                value: new Date(passport.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                }),
              },
            ].map(({ label, value, style }) => (
              <div
                key={label}
                className="rounded-xl px-4 py-3"
                style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-100)' }}
              >
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--slate-500)' }}>{label}</p>
                <p
                  className="font-bold"
                  style={style ?? { color: 'var(--slate-900)' }}
                >
                  {value}
                </p>
              </div>
            ))}
            <div
              className="col-span-2 rounded-xl px-4 py-3"
              style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-100)' }}
            >
              <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--slate-500)' }}>Location</p>
              <p className="font-bold" style={{ color: 'var(--slate-900)' }}>{passport.location}</p>
            </div>
          </div>

          {/* Hazard */}
          <div className="flex items-center gap-2">
            <span
              className="badge text-xs font-semibold"
              style={
                passport.hazard
                  ? { background: '#FEE2E2', color: '#B91C1C' }
                  : { background: 'var(--emerald-50)', color: 'var(--emerald-700)' }
              }
            >
              {passport.hazard
                ? <><AlertTriangle className="w-3 h-3" /> Hazardous Item</>
                : <><ShieldCheck className="w-3 h-3" /> No Hazard Detected</>
              }
            </span>
            <span className="text-xs" style={{ color: 'var(--slate-500)' }}>
              AI Confidence: {passport.confidence}%
            </span>
          </div>
        </div>

        {/* Right: score + QR */}
        <div
          className="flex flex-col items-center gap-6 sm:border-l sm:pl-6"
          style={{ borderColor: 'var(--slate-100)' }}
        >
          {/* Reuse Score */}
          <div className="text-center space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--slate-500)' }}>
              Reuse Score
            </p>
            <ReuseScoreGauge score={passport.reuseScore} size={140} />
          </div>

          {/* QR Code */}
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--slate-500)' }}>
              Scan to Verify
            </p>
            <div
              className="p-3 rounded-2xl inline-block"
              style={{ background: '#fff', border: '1px solid var(--slate-200)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <QRCodeSVG
                value={passportUrl}
                size={110}
                fgColor="var(--forest-800)"
                bgColor="#ffffff"
                level="M"
              />
            </div>
            <p className="text-xs max-w-[140px] text-center" style={{ color: 'var(--slate-400)' }}>
              {passport.passportId}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-6 py-4 flex items-center justify-between flex-wrap gap-2"
        style={{ borderTop: '1px solid var(--slate-100)', background: 'var(--slate-50)' }}
      >
        <p className="text-xs" style={{ color: 'var(--slate-500)' }}>
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
