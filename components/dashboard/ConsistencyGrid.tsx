'use client'

import { WorkoutRecord } from '@/lib/types'

interface ConsistencyGridProps {
  history: WorkoutRecord[]
}

const DAY_LABELS = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø']

export default function ConsistencyGrid({ history }: ConsistencyGridProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Build 28-day grid (4 weeks × 7 days)
  const days = Array.from({ length: 28 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (27 - i))
    const dateStr = date.toISOString().slice(0, 10)
    const trained = history.some(r => r.date.slice(0, 10) === dateStr)
    const isToday = i === 27
    return { date, dateStr, trained, isToday }
  })

  const totalTrained = days.filter(d => d.trained).length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Konsistens – 4 uker</p>
        <p className="text-xs text-gray-400">{totalTrained}/28 dager</p>
      </div>

      {/* Column headers (day of week for first row) */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map(label => (
          <p key={label} className="text-center text-xs text-gray-600">{label}</p>
        ))}
      </div>

      {/* 4-week grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div
            key={i}
            title={day.dateStr}
            className={`aspect-square rounded-md transition-colors ${
              day.isToday
                ? day.trained
                  ? 'bg-green-400 ring-2 ring-green-300'
                  : 'bg-white/10 ring-2 ring-white/30'
                : day.trained
                  ? 'bg-green-500'
                  : 'bg-white/8'
            }`}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
          <span className="text-xs text-gray-500">Trent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-white/8" />
          <span className="text-xs text-gray-500">Hviledag</span>
        </div>
      </div>
    </div>
  )
}
