'use client'

import { ProgramCycle } from '@/lib/types'
import { getCycleProgress } from '@/lib/cycles'

interface CycleProgressWidgetProps {
  cycle: ProgramCycle
  onAbandon?: () => void
}

export default function CycleProgressWidget({ cycle, onAbandon }: CycleProgressWidgetProps) {
  const p = getCycleProgress(cycle)
  const weekPct = Math.min(100, Math.round((p.workoutsThisCalWeek / p.targetPerWeek) * 100))
  const totalPct = Math.min(100, Math.round((p.currentWeek / p.totalWeeks) * 100))

  const statusLabel =
    cycle.status === 'completed' ? 'Fullført' :
    cycle.status === 'abandoned' ? 'Avbrutt' :
    p.isExtended ? `Uke ${p.currentWeek} av ${p.totalWeeks} (justert)` :
    `Uke ${p.currentWeek} av ${p.totalWeeks}`

  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Aktiv syklus</p>
          <p className="text-sm font-semibold text-white">{cycle.programName}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          cycle.status === 'completed' ? 'bg-green-500/20 text-green-400' :
          cycle.status === 'abandoned' ? 'bg-red-500/20 text-red-400' :
          p.isExtended ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-blue-500/20 text-blue-400'
        }`}>
          {statusLabel}
        </span>
      </div>

      {/* Total progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Syklusfremdrift</span>
          <span>{p.currentWeek}/{p.totalWeeks} uker</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${totalPct}%` }}
          />
        </div>
      </div>

      {/* This week */}
      {cycle.status === 'active' && (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Denne uken</span>
            <span>{p.workoutsThisCalWeek}/{p.targetPerWeek} økter</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                p.workoutsThisCalWeek >= p.targetPerWeek ? 'bg-green-500' : 'bg-blue-400/70'
              }`}
              style={{ width: `${weekPct}%` }}
            />
          </div>
        </div>
      )}

      {cycle.status === 'completed' && (
        <p className="text-xs text-green-400">
          Fullført {cycle.completedDate ?? ''} — {p.totalCompleted} økter logget
        </p>
      )}

      {cycle.status === 'active' && onAbandon && (
        <button
          onClick={onAbandon}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Avslutt syklus
        </button>
      )}
    </div>
  )
}
