'use client'

import { WorkoutRecord, FocusMode } from '@/lib/types'
import { suggestWeightForExercise, rpeBasedWeightSuggestion } from '@/lib/analytics'

interface LastSessionBadgeProps {
  history: WorkoutRecord[]
  exerciseId: string
  focusMode?: FocusMode
}

export default function LastSessionBadge({ history, exerciseId, focusMode }: LastSessionBadgeProps) {
  // Finn siste direkte historikk for øvelsen
  const last = history.find((r) => r.exercises.some((e) => e.exerciseId === exerciseId))

  if (last) {
    const ex = last.exercises.find((e) => e.exerciseId === exerciseId)!
    const completedSets = ex.sets.filter((s) => s.completed)
    if (completedSets.length === 0) return null

    const best = completedSets.reduce((top, s) => (s.weight > top.weight ? s : top), completedSets[0])
    const daysAgo = Math.round((Date.now() - new Date(last.date).getTime()) / 86400000)
    const rpeSuggestion = rpeBasedWeightSuggestion(completedSets)

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full self-start">
          <span>Forrige:</span>
          <span className="text-white font-semibold">{best.weight} kg × {best.reps}</span>
          <span className="text-gray-500">({daysAgo === 0 ? 'i dag' : daysAgo === 1 ? 'i går' : `${daysAgo}d`})</span>
        </div>
        {rpeSuggestion && rpeSuggestion.direction !== 'maintain' && (
          <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full self-start ${
            rpeSuggestion.direction === 'decrease'
              ? 'text-orange-400 bg-orange-500/10'
              : 'text-blue-400 bg-blue-500/10'
          }`}>
            <span>{rpeSuggestion.direction === 'decrease' ? '↓' : '↑'}</span>
            <span>{rpeSuggestion.label}</span>
          </div>
        )}
      </div>
    )
  }

  // Ingen direkte historikk — vis anbefaling basert på lignende øvelse
  if (!focusMode) return null
  const suggestion = suggestWeightForExercise(exerciseId, history, focusMode)
  if (!suggestion) return null

  return (
    <div className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-500/8 px-2.5 py-1 rounded-full">
      <span>Forslag:</span>
      <span className="text-white font-semibold">{suggestion.weight} kg</span>
      <span className="text-blue-400/70">
        via {suggestion.sourceExerciseName} (e1RM {suggestion.e1rm} kg)
      </span>
    </div>
  )
}
