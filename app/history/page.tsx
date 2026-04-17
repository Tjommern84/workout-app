'use client'

import Link from 'next/link'
import { useWorkout } from '@/context/WorkoutContext'
import { WorkoutRecord } from '@/lib/types'
import { FOCUS_MODE_TEMPLATES } from '@/lib/generator'
import { MUSCLE_GROUP_LABELS } from '@/lib/types'
import { getById } from '@/lib/exercises'

export default function HistoryPage() {
  const { state, lastPRs } = useWorkout()

  if (!state.hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalVolume = state.history.reduce((acc, r) =>
    acc + r.exercises.reduce((a, ex) =>
      a + ex.sets.reduce((s, set) => s + (set.completed ? set.reps * set.weight : 0), 0), 0), 0)

  const totalWorkouts = state.history.length
  const totalMinutes = state.history.reduce((acc, r) => acc + r.durationMinutes, 0)

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="text-2xl font-bold mb-2">Treningslogg 📊</h1>

      {/* PR banner */}
      {lastPRs.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-4">
          <p className="font-bold text-yellow-400 mb-1">🏆 Ny personlig rekord!</p>
          <div className="space-y-0.5">
            {lastPRs.map(id => {
              const ex = getById(id)
              return ex ? (
                <p key={id} className="text-sm text-gray-300">• {ex.name}</p>
              ) : null
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      {totalWorkouts > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Økter" value={String(totalWorkouts)} />
          <StatCard label="Timer" value={Math.round(totalMinutes / 60).toFixed(1)} />
          <StatCard label="Tonn løftet" value={(totalVolume / 1000).toFixed(1) + 't'} />
        </div>
      )}

      {state.history.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">🏋️</p>
          <h2 className="text-xl font-bold mb-2">Ingen logg ennå</h2>
          <p className="text-gray-400 mb-6">Start din første treningsøkt for å se historikken her.</p>
          <Link href="/" className="bg-green-500 text-black font-bold px-6 py-3 rounded-xl inline-block">
            Gå til forsiden
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {state.history.map(record => (
            <WorkoutSummaryCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-3 text-center border border-white/5">
      <p className="text-xl font-bold text-green-400">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

function WorkoutSummaryCard({ record }: { record: WorkoutRecord }) {
  const completedSets = record.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0
  )
  const totalSets = record.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)
  const totalVolume = record.exercises.reduce(
    (acc, ex) => acc + ex.sets.reduce((s, set) => s + (set.completed ? set.reps * set.weight : 0), 0), 0
  )

  return (
    <Link href={`/history/${record.id}`}>
      <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="font-bold">{record.name}</p>
            <p className="text-gray-400 text-sm mt-0.5">
              {new Date(record.date).toLocaleDateString('nb-NO', {
                weekday: 'long', day: 'numeric', month: 'long',
              })}
            </p>
          </div>
          <span className="text-xs bg-white/10 text-gray-400 px-2.5 py-1 rounded-full ml-2">
            {record.durationMinutes} min
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {record.muscleGroups.map(g => (
            <span key={g} className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">
              {MUSCLE_GROUP_LABELS[g]}
            </span>
          ))}
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
            {FOCUS_MODE_TEMPLATES[record.focusMode].label}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{record.exercises.length} øvelser</span>
          <span>{completedSets}/{totalSets} sett</span>
          {totalVolume > 0 && <span>{totalVolume.toLocaleString('nb-NO')} kg totalt</span>}
        </div>
      </div>
    </Link>
  )
}
