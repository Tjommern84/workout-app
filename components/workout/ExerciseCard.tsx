'use client'

import { WorkoutExercise, LoggedSet } from '@/lib/types'
import { getById, formatEquipment } from '@/lib/exercises'
import { useWorkout } from '@/context/WorkoutContext'
import SetRow from './SetRow'

interface Props {
  exercise: WorkoutExercise
  exerciseIndex: number
}

export default function ExerciseCard({ exercise, exerciseIndex }: Props) {
  const { addSet } = useWorkout()
  const info = getById(exercise.exerciseId)

  if (!info) return null

  const completedSets = exercise.sets.filter(s => s.completed).length

  return (
    <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 mb-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg">{info.name}</h3>
            {info.description && (
              <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{info.description}</p>
            )}
          </div>
          <span className="text-xs bg-white/10 text-gray-400 px-2.5 py-1 rounded-full ml-2 flex-shrink-0">
            {completedSets}/{exercise.sets.length} sett
          </span>
        </div>
        <span className="inline-block text-xs text-green-400/70 bg-green-500/10 px-2 py-0.5 rounded-full mt-2">
          {formatEquipment(info.equipmentTypes)}
        </span>
      </div>

      {/* Set header */}
      <div className="px-4 pb-1 flex items-center gap-2">
        <span className="text-xs text-gray-600 w-8 text-center">Sett</span>
        <span className="text-xs text-gray-600 flex-1 text-center">Reps</span>
        <span className="text-xs text-gray-600 flex-1 text-center">Vekt (kg)</span>
        <span className="text-xs text-gray-600 w-12 text-center">✓</span>
      </div>

      {/* Sets */}
      <div className="px-3 pb-3 space-y-1">
        {exercise.sets.map((set, setIndex) => (
          <SetRow
            key={setIndex}
            set={set}
            setIndex={setIndex}
            exerciseIndex={exerciseIndex}
          />
        ))}
      </div>

      {/* Add set */}
      <div className="px-4 pb-4">
        <button
          onClick={() => addSet(exerciseIndex)}
          className="w-full text-sm text-gray-500 bg-white/5 hover:bg-white/10 py-2.5 rounded-xl transition-colors"
        >
          + Legg til sett
        </button>
      </div>
    </div>
  )
}
