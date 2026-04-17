'use client'

import { WorkoutRecord } from '@/lib/types'
import { bestE1rmForExercise } from '@/lib/analytics'

interface E1rmTrendChartProps {
  history: WorkoutRecord[]
  exerciseId: string
  exerciseName: string
  height?: number    // default 48
  maxPoints?: number // default 10
}

export default function E1rmTrendChart({
  history,
  exerciseId,
  exerciseName,
  height = 48,
  maxPoints = 10,
}: E1rmTrendChartProps) {
  const data = bestE1rmForExercise(history, exerciseId).slice(-maxPoints)

  if (data.length < 2) {
    return (
      <div className="text-xs text-gray-500 italic px-1">
        Trenger 2+ logger for e1RM-trend
      </div>
    )
  }

  const values = data.map((d) => d.e1rm)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const W = 200
  const H = height
  const pad = 4

  const points = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (W - pad * 2)
    const y = H - pad - ((v - min) / range) * (H - pad * 2)
    return `${x},${y}`
  })

  const polyline = points.join(' ')
  const lastVal = values[values.length - 1]
  const firstVal = values[0]
  const trend = lastVal - firstVal

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">e1RM – {exerciseName}</p>
        <span className={`text-xs font-bold ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '+' : ''}{trend}kg
        </span>
      </div>
      <div className="bg-white/3 rounded-xl p-2 overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((pct) => (
            <line
              key={pct}
              x1={0} y1={H * pct}
              x2={W} y2={H * pct}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          ))}
          {/* Trend line */}
          <polyline
            points={polyline}
            fill="none"
            stroke={trend >= 0 ? '#22c55e' : '#ef4444'}
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Dots */}
          {points.map((pt, i) => {
            const [x, y] = pt.split(',').map(Number)
            return (
              <circle
                key={i}
                cx={x} cy={y} r="2"
                fill={i === points.length - 1 ? (trend >= 0 ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.3)'}
              />
            )
          })}
        </svg>
        <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
          <span>{min}kg</span>
          <span className="font-bold text-white">{lastVal}kg</span>
          <span>{max}kg</span>
        </div>
      </div>
    </div>
  )
}
