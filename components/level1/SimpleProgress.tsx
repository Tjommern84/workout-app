'use client'

interface SimpleProgressProps {
  current: number
  total: number
  label?: string
}

export default function SimpleProgress({ current, total, label }: SimpleProgressProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">{label}</span>
          <span className="text-gray-400">{current}/{total}</span>
        </div>
      )}
      <div className="h-2 bg-white/8 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct === 100 && (
        <p className="text-green-400 text-xs text-center">Alle sett fullført! 🎉</p>
      )}
    </div>
  )
}
