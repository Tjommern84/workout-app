'use client'

import { useState } from 'react'
import { MuscleGroup } from '@/lib/types'
import { EXERCISES, formatEquipment } from '@/lib/exercises'
import { loadProfile } from '@/lib/storage'
import { useWorkout } from '@/context/WorkoutContext'

interface SwapExerciseSheetProps {
  exerciseIndex: number
  currentExerciseId: string
  muscleGroup: MuscleGroup
  onClose: () => void
}

export default function SwapExerciseSheet({
  exerciseIndex,
  currentExerciseId,
  muscleGroup,
  onClose,
}: SwapExerciseSheetProps) {
  const { swapExercise } = useWorkout()
  const [query, setQuery] = useState('')

  const profileResult = loadProfile()
  const userEquipment = profileResult.ok && profileResult.data
    ? profileResult.data.equipment
    : []

  // Filter: same muscle group, not the current exercise
  const candidates = EXERCISES.filter(ex =>
    ex.muscleGroup === muscleGroup &&
    ex.id !== currentExerciseId &&
    (userEquipment.length === 0 || ex.equipmentTypes.some(eq => userEquipment.includes(eq)))
  )

  const filtered = query.trim()
    ? candidates.filter(ex => ex.name.toLowerCase().includes(query.toLowerCase()))
    : candidates

  function handleSwap(newId: string) {
    swapExercise(exerciseIndex, newId)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-[#1a1a1a] rounded-t-3xl border-t border-white/10 max-w-lg mx-auto max-h-[75vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle + header */}
        <div className="px-6 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-3">Bytt øvelse</h2>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Søk etter øvelse..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            autoFocus
          />
        </div>

        {/* Exercise list */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-8">Ingen øvelser funnet</p>
          ) : (
            filtered.map(ex => (
              <button
                key={ex.id}
                onClick={() => handleSwap(ex.id)}
                className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl px-4 py-3 transition-colors"
              >
                <p className="font-medium text-sm">{ex.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{formatEquipment(ex.equipmentTypes)} · {ex.tier.replace('_', ' ')}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
