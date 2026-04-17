'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useWorkout } from '@/context/WorkoutContext'
import { getById, formatEquipment } from '@/lib/exercises'
import { bestE1rmForExercise, isStagnating, suggestWeightAdjustment } from '@/lib/analytics'
import { MUSCLE_GROUP_LABELS } from '@/lib/types'

export default function ProgressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { state } = useWorkout()
  const [showAll, setShowAll] = useState(false)

  const exercise = getById(id)
  if (!exercise) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-12 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <h2 className="text-xl font-bold mb-2">Øvelse ikke funnet</h2>
        <Link href="/" className="text-green-400">← Tilbake</Link>
      </div>
    )
  }

  const e1rmData = bestE1rmForExercise(state.history, id)
  const allSessions = state.history.filter(r => r.exercises.some(e => e.exerciseId === id))

  // Collect all sets for this exercise across history
  const allSets = allSessions.flatMap(r => {
    const ex = r.exercises.find(e => e.exerciseId === id)!
    return ex.sets.filter(s => s.completed).map(s => ({ ...s, date: r.date }))
  })

  const bestSet = allSets.reduce<typeof allSets[0] | null>((best, s) => {
    if (!best) return s
    return s.weight > best.weight ? s : best
  }, null)

  const bestReps = allSets.reduce<typeof allSets[0] | null>((best, s) => {
    if (!best) return s
    return s.reps > best.reps ? s : best
  }, null)

  const stagnating = isStagnating(e1rmData)
  const lastSessionSets = allSessions[0]?.exercises.find(e => e.exerciseId === id)?.sets.filter(s => s.completed) ?? []
  const suggestion = suggestWeightAdjustment(lastSessionSets)

  // Chart data
  const chartData = e1rmData.slice(-12)
  const chartValues = chartData.map(d => d.e1rm)
  const chartMin = Math.min(...chartValues, 0)
  const chartMax = Math.max(...chartValues, 1)
  const chartRange = chartMax - chartMin || 1

  const W = 320
  const H = 120
  const pad = { t: 8, r: 8, b: 24, l: 40 }

  const points = chartValues.map((v, i) => {
    const x = pad.l + (i / Math.max(chartValues.length - 1, 1)) * (W - pad.l - pad.r)
    const y = pad.t + (1 - (v - chartMin) / chartRange) * (H - pad.t - pad.b)
    return { x, y, v, date: chartData[i].date }
  })

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ')
  const trend = chartValues.length >= 2 ? chartValues[chartValues.length - 1] - chartValues[0] : 0
  const trendColor = trend >= 0 ? '#22c55e' : '#ef4444'

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-gray-500 hover:text-white p-2 -ml-2">←</Link>
        <div>
          <h1 className="text-xl font-bold">{exercise.name}</h1>
          <p className="text-gray-400 text-sm">{MUSCLE_GROUP_LABELS[exercise.muscleGroup]} · {formatEquipment(exercise.equipmentTypes)}</p>
        </div>
      </div>

      {allSessions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📈</p>
          <p className="text-gray-400">Ingen logger for denne øvelsen ennå.</p>
          <p className="text-gray-500 text-sm mt-1">Start en økt for å se fremgangen din her.</p>
        </div>
      ) : (
        <>
          {/* e1RM Chart */}
          {chartValues.length >= 2 && (
            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider">e1RM utvikling</p>
                <span className="text-sm font-bold" style={{ color: trendColor }}>
                  {trend >= 0 ? '+' : ''}{trend} kg
                </span>
              </div>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
                {/* Y-axis grid + labels */}
                {[0, 0.5, 1].map(pct => {
                  const y = pad.t + (1 - pct) * (H - pad.t - pad.b)
                  const val = Math.round(chartMin + pct * chartRange)
                  return (
                    <g key={pct}>
                      <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="rgba(255,255,255,0.05)" />
                      <text x={pad.l - 4} y={y + 4} fill="#6b7280" fontSize="9" textAnchor="end">{val}</text>
                    </g>
                  )
                })}
                {/* Trend line */}
                <polyline points={polyline} fill="none" stroke={trendColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                {/* Dots */}
                {points.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 4 : 2.5}
                    fill={i === points.length - 1 ? trendColor : 'rgba(255,255,255,0.3)'} />
                ))}
                {/* X-axis labels (first and last) */}
                {points.length > 0 && (
                  <>
                    <text x={points[0].x} y={H - 2} fill="#6b7280" fontSize="8" textAnchor="middle">
                      {new Date(points[0].date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}
                    </text>
                    <text x={points[points.length - 1].x} y={H - 2} fill="#6b7280" fontSize="8" textAnchor="middle">
                      {new Date(points[points.length - 1].date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}
                    </text>
                  </>
                )}
              </svg>
            </div>
          )}

          {/* Personal bests */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {bestSet && (
              <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4">
                <p className="text-xs text-gray-500 mb-1">Tyngste sett</p>
                <p className="text-2xl font-bold text-green-400">{bestSet.weight} kg</p>
                <p className="text-xs text-gray-500 mt-0.5">× {bestSet.reps} reps</p>
              </div>
            )}
            {e1rmData.length > 0 && (
              <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4">
                <p className="text-xs text-gray-500 mb-1">Beste e1RM</p>
                <p className="text-2xl font-bold text-green-400">{Math.max(...e1rmData.map(d => d.e1rm))} kg</p>
                <p className="text-xs text-gray-500 mt-0.5">Epley-formel</p>
              </div>
            )}
          </div>

          {/* Stagnation / suggestion */}
          {stagnating && (
            <div className="bg-yellow-500/8 border border-yellow-500/25 rounded-2xl p-4 mb-4 flex gap-3">
              <span className="text-xl">📉</span>
              <div>
                <p className="text-yellow-300 font-semibold text-sm">Stagnasjon detektert</p>
                <p className="text-yellow-300/70 text-xs mt-0.5">e1RM har vært flat de siste {Math.min(e1rmData.length, 4)} øktene. Prøv ny reprekkevidde eller en deload-uke.</p>
              </div>
            </div>
          )}

          {suggestion.label && (
            <div className="bg-blue-500/8 border border-blue-500/25 rounded-2xl p-4 mb-4 flex gap-3">
              <span className="text-xl">💡</span>
              <p className="text-blue-300 text-sm">{suggestion.label}</p>
            </div>
          )}

          {/* Session history */}
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Økt-historikk ({allSessions.length})</p>
          <div className="space-y-2">
            {(showAll ? allSessions : allSessions.slice(0, 8)).map((rec) => {
              const ex = rec.exercises.find(e => e.exerciseId === id)!
              const completed = ex.sets.filter(s => s.completed)
              const best = completed.reduce<(typeof completed)[0] | null>((b, s) => !b || s.weight > b.weight ? s : b, null)
              const sessionE1rm = e1rmData.find(d => d.date === rec.date)
              return (
                <Link key={rec.id} href={`/history/${rec.id}`}>
                  <div className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 hover:border-white/10 transition-colors flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{new Date(rec.date).toLocaleDateString('nb-NO', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {completed.length} sett · {best ? `Topp: ${best.weight}kg × ${best.reps}` : '–'}
                      </p>
                    </div>
                    {sessionE1rm && (
                      <span className="text-sm font-bold text-green-400">{sessionE1rm.e1rm} kg</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
          {allSessions.length > 8 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full mt-3 text-sm text-gray-400 hover:text-white transition-colors py-2 border border-white/10 rounded-xl"
            >
              Vis alle {allSessions.length} logger →
            </button>
          )}
        </>
      )}
    </div>
  )
}
