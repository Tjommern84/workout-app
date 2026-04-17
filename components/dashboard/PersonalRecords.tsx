'use client'

import Link from 'next/link'
import { WorkoutRecord } from '@/lib/types'
import { EXERCISES } from '@/lib/exercises'
import { bestE1rmForExercise } from '@/lib/analytics'

interface PersonalRecordsProps {
  history: WorkoutRecord[]
}

export default function PersonalRecords({ history }: PersonalRecordsProps) {
  if (history.length === 0) return null

  // Find exercises trained in last 30 days
  const recentIds = new Set(
    history
      .filter(r => Date.now() - new Date(r.date).getTime() < 30 * 86400000)
      .flatMap(r => r.exercises.map(e => e.exerciseId))
  )

  // For each recently-trained exercise, find the PR
  const records = EXERCISES
    .filter(ex => recentIds.has(ex.id))
    .map(ex => {
      const data = bestE1rmForExercise(history, ex.id)
      if (data.length === 0) return null
      const allSets = history
        .flatMap(r => r.exercises.filter(e => e.exerciseId === ex.id).flatMap(e => e.sets))
        .filter(s => s.completed && s.weight > 0)
      const best = allSets.reduce<typeof allSets[0] | null>((b, s) => !b || s.weight > b.weight ? s : b, null)
      if (!best) return null
      const recent = data[data.length - 1]
      const prev = data.length >= 2 ? data[data.length - 2] : null
      const isNewPR = !prev || recent.e1rm > prev.e1rm
      return { exercise: ex, bestWeight: best.weight, bestReps: best.reps, e1rm: recent.e1rm, isNewPR }
    })
    .filter(Boolean)
    .sort((a, b) => b!.e1rm - a!.e1rm)
    .slice(0, 5)

  if (records.length === 0) return null

  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Personlige rekorder</p>
      <div className="space-y-2">
        {records.map(rec => {
          if (!rec) return null
          return (
            <Link key={rec.exercise.id} href={`/progress/${rec.exercise.id}`}>
              <div className="flex items-center justify-between bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  {rec.isNewPR && (
                    <span className="text-yellow-400 text-sm shrink-0" title="Ny rekord!">🏆</span>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{rec.exercise.name}</p>
                    <p className="text-xs text-gray-500">e1RM: {rec.e1rm} kg</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-green-400">{rec.bestWeight} kg</p>
                  <p className="text-xs text-gray-500">× {rec.bestReps} reps</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
