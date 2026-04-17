'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useWorkout } from '@/context/WorkoutContext'
import { getById, formatEquipment } from '@/lib/exercises'
import { FOCUS_MODE_TEMPLATES } from '@/lib/generator'
import { MUSCLE_GROUP_LABELS } from '@/lib/types'
import PostWorkoutInsight from '@/components/level2/PostWorkoutInsight'

export default function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { state, deleteWorkout } = useWorkout()
  const router = useRouter()

  const record = state.history.find(r => r.id === id)

  if (!state.hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!record) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-12 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <h2 className="text-xl font-bold mb-2">Økt ikke funnet</h2>
        <Link href="/history" className="text-green-400 hover:underline">← Tilbake til historikk</Link>
      </div>
    )
  }

  const totalVolume = record.exercises.reduce(
    (acc, ex) => acc + ex.sets.reduce((s, set) => s + (set.completed ? set.reps * set.weight : 0), 0), 0
  )
  const completedSets = record.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0
  )
  const totalSets = record.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/history" className="text-gray-500 hover:text-white p-2 -ml-2 transition-colors">
          ←
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{record.name}</h1>
          <p className="text-gray-400 text-sm">
            {new Date(record.date).toLocaleDateString('nb-NO', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[#1a1a1a] rounded-2xl p-3 text-center border border-white/5">
          <p className="text-lg font-bold text-green-400">{record.durationMinutes}</p>
          <p className="text-xs text-gray-500">min</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl p-3 text-center border border-white/5">
          <p className="text-lg font-bold text-green-400">{completedSets}/{totalSets}</p>
          <p className="text-xs text-gray-500">sett</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl p-3 text-center border border-white/5">
          <p className="text-lg font-bold text-green-400">{totalVolume > 0 ? (totalVolume / 1000).toFixed(1) + 't' : '–'}</p>
          <p className="text-xs text-gray-500">volum</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
          {FOCUS_MODE_TEMPLATES[record.focusMode].label}
        </span>
        {record.muscleGroups.map(g => (
          <span key={g} className="text-xs bg-white/10 text-gray-400 px-3 py-1 rounded-full">
            {MUSCLE_GROUP_LABELS[g]}
          </span>
        ))}
      </div>

      {/* Note */}
      {record.note && (
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl px-4 py-3 mb-4">
          <p className="text-xs text-gray-500 mb-1">Notat</p>
          <p className="text-sm text-gray-300 leading-relaxed">{record.note}</p>
        </div>
      )}

      {/* Insight */}
      <div className="mb-4">
        <PostWorkoutInsight record={record} history={state.history} />
      </div>

      {/* Exercises */}
      {record.exercises.map((exercise, i) => {
        const info = getById(exercise.exerciseId)
        if (!info) return null
        const completedSetsEx = exercise.sets.filter(s => s.completed).length

        return (
          <div key={i} className="bg-[#1a1a1a] rounded-2xl border border-white/5 mb-3 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold">{info.name}</p>
                <p className="text-xs text-gray-500">{formatEquipment(info.equipmentTypes)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-white/10 text-gray-400 px-2.5 py-1 rounded-full">
                  {completedSetsEx}/{exercise.sets.length} sett
                </span>
                <Link href={`/progress/${exercise.exerciseId}`} className="text-xs text-green-400 hover:text-green-300 transition-colors">
                  Fremgang →
                </Link>
              </div>
            </div>

            {/* Set table */}
            <div className="px-4 pb-4">
              <div className="flex gap-2 text-xs text-gray-600 mb-1 px-1">
                <span className="w-6 text-center">#</span>
                <span className="w-14 text-center">Reps</span>
                <span className="w-16 text-center">Vekt</span>
                <span className="flex-1 text-center">RPE / Feeling</span>
                <span className="w-6 text-center">✓</span>
              </div>
              {exercise.sets.map((set, si) => {
                const feedbackEmoji = set.feedback === 'too_easy' ? '😴' : set.feedback === 'just_right' ? '😤' : set.feedback === 'too_hard' ? '😰' : null
                return (
                  <div
                    key={si}
                    className={`flex gap-2 items-center px-1 py-1.5 rounded-lg text-sm ${set.completed ? 'text-green-300' : 'text-gray-500'}`}
                  >
                    <span className="w-6 text-center font-mono text-xs text-gray-600">{si + 1}</span>
                    <span className="w-14 text-center font-mono">{set.reps}</span>
                    <span className="w-16 text-center font-mono">{set.weight > 0 ? `${set.weight} ${state.settings.weightUnit}` : '–'}</span>
                    <span className="flex-1 text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                      {set.rpe && <span className="bg-purple-500/15 text-purple-300 px-1.5 py-0.5 rounded-full">RPE {set.rpe}</span>}
                      {feedbackEmoji && <span>{feedbackEmoji}</span>}
                    </span>
                    <span className="w-6 text-center">{set.completed ? '✓' : '○'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Delete */}
      <button
        onClick={() => {
          if (confirm('Slette denne treningsøkten?')) {
            deleteWorkout(record.id)
            router.push('/history')
          }
        }}
        className="w-full text-red-400 bg-red-500/10 hover:bg-red-500/20 py-3 rounded-xl text-sm font-semibold transition-colors mt-2"
      >
        Slett økt
      </button>
    </div>
  )
}
