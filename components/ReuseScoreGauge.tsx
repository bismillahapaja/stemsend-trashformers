'use client'

import { getReuseScoreLabel } from '@/lib/rules'

interface ReuseScoreGaugeProps {
  score: number
  size?: number
  strokeWidth?: number
}

export default function ReuseScoreGauge({
  score,
  size = 160,
  strokeWidth = 14,
}: ReuseScoreGaugeProps) {
  const { label, color, bg } = getReuseScoreLabel(score)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  // Gauge covers 270 degrees (from 135° to 405°, i.e. bottom-left to bottom-right)
  const arcLength = circumference * 0.75
  const offset = arcLength - (score / 100) * arcLength
  const center = size / 2

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-[135deg]"
        >
          {/* Track arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#dcfce7"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
          />
          {/* Value arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1.2s ease-out',
              filter: `drop-shadow(0 0 6px ${color}80)`,
            }}
          />
        </svg>

        {/* Center display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold leading-none"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-xs font-semibold text-green-600/60 mt-0.5">/ 100</span>
        </div>
      </div>

      {/* Label badge */}
      <span
        className="text-sm font-bold px-3 py-1 rounded-full"
        style={{ color, background: bg }}
      >
        {label}
      </span>
    </div>
  )
}
