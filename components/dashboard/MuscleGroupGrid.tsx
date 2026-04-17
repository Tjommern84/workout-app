'use client'

import { useState } from 'react'
import { ALL_MUSCLE_GROUPS, MUSCLE_GROUP_LABELS, MuscleGroup, WorkoutRecord } from '@/lib/types'
import { getRecoveryStatus } from '@/lib/generator'
import { getById } from '@/lib/exercises'
import { MUSCLE_INFO } from '@/lib/anatomy'

interface Props {
  lastTrained: Record<MuscleGroup, number>
  history: WorkoutRecord[]
}

const muscleIcons: Record<MuscleGroup, string> = {
  chest: '💪',
  back: '🔙',
  legs: '🦵',
  shoulders: '🏋️',
  arms: '💪',
  core: '🎯',
}

export default function MuscleGroupGrid({ lastTrained, history }: Props) {
  const [selected, setSelected] = useState<MuscleGroup | null>(null)
  const isNewUser = history.length === 0

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {ALL_MUSCLE_GROUPS.map(group => {
          if (isNewUser) {
            return (
              <div
                key={group}
                className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{muscleIcons[group]}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                </div>
                <p className="font-semibold text-sm">{MUSCLE_GROUP_LABELS[group]}</p>
                <p className="text-xs mt-0.5 text-green-400">Klar!</p>
              </div>
            )
          }

          const days = lastTrained[group]
          const status = getRecoveryStatus(days)

          return (
            <button
              key={group}
              onClick={() => setSelected(group)}
              className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/5 text-left hover:border-white/15 active:scale-95 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{muscleIcons[group]}</span>
                <RecoveryDot days={days} />
              </div>
              <p className="font-semibold text-sm">{MUSCLE_GROUP_LABELS[group]}</p>
              <p className={`text-xs mt-0.5 ${status.textColor}`}>{status.label}</p>
            </button>
          )
        })}
      </div>

      {selected && (
        <MuscleDetailSheet
          group={selected}
          history={history}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}

function RecoveryDot({ days }: { days: number }) {
  if (days === Infinity) return <span className="w-2.5 h-2.5 rounded-full bg-gray-600 inline-block" />
  if (days < 1)  return <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
  if (days < 2)  return <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
  if (days < 3)  return <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
  if (days < 4)  return <span className="w-2.5 h-2.5 rounded-full bg-lime-500 inline-block" />
  return               <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
}

// ─── Detail sheet ─────────────────────────────────────────────────────────────

interface ExerciseEntry {
  date: string
  workoutName: string
  exerciseId: string
  exerciseName: string
  sets: { weight: number; reps: number; completed: boolean }[]
}

function MuscleDetailSheet({
  group,
  history,
  onClose,
}: {
  group: MuscleGroup
  history: WorkoutRecord[]
  onClose: () => void
}) {
  const DAYS = 7
  const cutoff = Date.now() - DAYS * 24 * 60 * 60 * 1000

  // Finn alle øvelser fra siste 7 dager som trente denne muskelgruppen
  const entries: ExerciseEntry[] = []

  for (const record of history) {
    if (new Date(record.date).getTime() < cutoff) continue

    for (const we of record.exercises) {
      const def = getById(we.exerciseId)
      if (!def) continue

      // Sjekk om øvelsen treffer denne muskelgruppen
      const primaryGroups = new Set(
        def.primaryMuscles.map(m => MUSCLE_INFO[m].muscleGroup)
      )
      if (!primaryGroups.has(group)) continue

      entries.push({
        date: record.date,
        workoutName: record.name,
        exerciseId: we.exerciseId,
        exerciseName: def.name,
        sets: we.sets.filter(s => s.completed).map(s => ({
          weight: s.weight,
          reps: s.reps,
          completed: s.completed,
        })),
      })
    }
  }

  const status = getRecoveryStatus(
    history.length > 0
      ? (Date.now() - Math.max(
          ...entries.map(e => new Date(e.date).getTime()),
          0
        )) / 86400000
      : Infinity
  )

  // Grupper per dato
  const byDate = new Map<string, ExerciseEntry[]>()
  for (const entry of entries) {
    const key = entry.date.slice(0, 10)
    if (!byDate.has(key)) byDate.set(key, [])
    byDate.get(key)!.push(entry)
  }
  const sortedDates = [...byDate.keys()].sort((a, b) => b.localeCompare(a))

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-[#1a1a1a] rounded-t-3xl border-t border-white/10 max-w-lg mx-auto max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle + header */}
        <div className="px-6 pt-5 pb-4 border-b border-white/8 flex-shrink-0">
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{muscleIcons[group]} {MUSCLE_GROUP_LABELS[group]}</h2>
              <p className="text-xs text-gray-500 mt-0.5">Siste {DAYS} dager</p>
            </div>
            <button onClick={onClose} className="text-gray-500 text-sm bg-white/5 px-3 py-1.5 rounded-full">
              Lukk
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {sortedDates.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">😴</p>
              <p className="text-gray-400 text-sm">Ingen {MUSCLE_GROUP_LABELS[group].toLowerCase()}-øvelser de siste {DAYS} dagene</p>
            </div>
          ) : (
            <div className="space-y-5">
              {sortedDates.map(dateKey => {
                const dayEntries = byDate.get(dateKey)!
                const date = new Date(dateKey)
                const daysAgo = Math.round((Date.now() - date.getTime()) / 86400000)
                const dateLabel = daysAgo === 0 ? 'I dag'
                  : daysAgo === 1 ? 'I går'
                  : date.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'short' })

                return (
                  <div key={dateKey}>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{dateLabel}</p>
                    <div className="space-y-2">
                      {dayEntries.map((entry, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-3">
                          <p className="font-semibold text-sm mb-1">{entry.exerciseName}</p>
                          {entry.sets.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {entry.sets.map((s, si) => (
                                <span key={si} className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-lg font-mono">
                                  {s.weight > 0 ? `${s.weight} kg × ${s.reps}` : `${s.reps} reps`}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-600">Ingen fullførte sett</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
