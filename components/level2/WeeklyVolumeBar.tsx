'use client'

import { WorkoutRecord, MuscleGroup, MUSCLE_GROUP_LABELS, UserGoal, UserProfile } from '@/lib/types'
import { weeklySetsByMuscle } from '@/lib/analytics'
import { EXERCISES } from '@/lib/exercises'

// Anbefalte sett per uke per muskelgruppe, tilpasset brukermål
// Kilde: NSCA / Krieger 2010 meta-analyse (hypertrofi), Rhea et al. 2003 (styrke)
const RECOMMENDED_BY_GOAL: Record<UserGoal, Record<MuscleGroup, number>> = {
  build_muscle:    { chest: 12, back: 14, legs: 16, shoulders: 12, arms: 10, core: 10 },
  get_stronger:    { chest:  8, back: 10, legs: 10, shoulders:  6, arms:  6, core:  8 },
  lose_fat:        { chest:  8, back: 10, legs: 12, shoulders:  8, arms:  6, core: 10 },
  improve_fitness: { chest:  8, back: 10, legs: 12, shoulders:  8, arms:  6, core: 10 },
  general_health:  { chest:  6, back:  8, legs:  8, shoulders:  6, arms:  4, core:  8 },
}

// Fallback normer (bygg muskler) dersom ingen profil er tilgjengelig
const RECOMMENDED_DEFAULT = RECOMMENDED_BY_GOAL.build_muscle

interface WeeklyVolumeBarProps {
  history: WorkoutRecord[]
  profile?: UserProfile | null
}

export default function WeeklyVolumeBar({ history, profile }: WeeklyVolumeBarProps) {
  const idToMuscle = Object.fromEntries(EXERCISES.map((e) => [e.id, e.muscleGroup]))
  const counts = weeklySetsByMuscle(history, idToMuscle)

  const recommended = profile?.goal
    ? RECOMMENDED_BY_GOAL[profile.goal]
    : RECOMMENDED_DEFAULT

  const muscles: MuscleGroup[] = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core']

  return (
    <div className="space-y-2.5">
      <p className="text-xs text-gray-500 uppercase tracking-wider">Ukentlig volum</p>
      {muscles.map((mg) => {
        const done = counts[mg] ?? 0
        const rec = recommended[mg]
        const pct = Math.min((done / rec) * 100, 100)
        const color = pct >= 90 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-gray-600'

        return (
          <div key={mg} className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-16 shrink-0">{MUSCLE_GROUP_LABELS[mg]}</span>
            <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 tabular-nums w-12 text-right">
              {done}/{rec}s
            </span>
          </div>
        )
      })}
    </div>
  )
}
