'use client'

import { WorkoutRecord } from '@/lib/types'
import { weeklyVolume } from '@/lib/analytics'

interface PostWorkoutInsightProps {
  record: WorkoutRecord
  history: WorkoutRecord[]
}

function formatTonnage(kg: number): string {
  return kg >= 1000 ? `${(kg / 1000).toFixed(1)}t` : `${kg}kg`
}

export default function PostWorkoutInsight({ record, history }: PostWorkoutInsightProps) {
  const totalSets = record.exercises.flatMap((e) => e.sets).filter((s) => s.completed).length
  const totalReps = record.exercises.flatMap((e) => e.sets).filter((s) => s.completed).reduce((sum, s) => sum + s.reps, 0)
  const tonnage = record.exercises.flatMap((e) => e.sets).filter((s) => s.completed).reduce((sum, s) => sum + s.reps * s.weight, 0)
  const weekVol = weeklyVolume(history)

  // Compare to previous same-named workout
  const prev = history.find((r) => r.id !== record.id && r.name === record.name)
  const prevTonnage = prev
    ? prev.exercises.flatMap((e) => e.sets).filter((s) => s.completed).reduce((sum, s) => sum + s.reps * s.weight, 0)
    : null

  const tonnageDiff = prevTonnage !== null ? tonnage - prevTonnage : null

  const insights: { emoji: string; text: string }[] = [
    { emoji: '🏋️', text: `${totalSets} sett · ${totalReps} repetisjoner` },
    { emoji: '⚖️', text: `${formatTonnage(tonnage)} total belastning (sett × reps × kg)` },
  ]

  if (tonnageDiff !== null && tonnageDiff !== 0) {
    insights.push({
      emoji: tonnageDiff > 0 ? '📈' : '📉',
      text: `${tonnageDiff > 0 ? '+' : ''}${formatTonnage(Math.abs(tonnageDiff))} vs forrige ${record.name}`,
    })
  }

  if (weekVol > 0) {
    insights.push({ emoji: '📅', text: `${formatTonnage(weekVol)} total ukevolum denne uken` })
  }

  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 space-y-3">
      <p className="text-xs text-gray-500 uppercase tracking-wider">Økt-innsikt</p>
      {insights.map((ins, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-lg">{ins.emoji}</span>
          <p className="text-sm text-gray-300">{ins.text}</p>
        </div>
      ))}
    </div>
  )
}
