'use client'

import { LoggedSet } from '@/lib/types'
import { useWorkout } from '@/context/WorkoutContext'
import { useWeightUnit } from '@/hooks/useWeightUnit'

interface Props {
  set: LoggedSet
  setIndex: number
  exerciseIndex: number
}

export default function SetRow({ set, setIndex, exerciseIndex }: Props) {
  const { updateSet, removeSet } = useWorkout()
  const { unit, fromDisplay, toDisplay } = useWeightUnit()

  function handleReps(value: string) {
    const n = parseInt(value)
    if (!isNaN(n) && n >= 0) updateSet(exerciseIndex, setIndex, { reps: n })
  }

  function handleWeight(value: string) {
    const n = parseFloat(value)
    if (!isNaN(n) && n >= 0) updateSet(exerciseIndex, setIndex, { weight: fromDisplay(n) })
  }

  function toggleComplete() {
    updateSet(exerciseIndex, setIndex, { completed: !set.completed })
  }

  return (
    <div
      className={`flex items-center gap-2 px-1 py-1.5 rounded-xl transition-colors ${
        set.completed ? 'bg-green-500/10' : 'hover:bg-white/5'
      }`}
    >
      {/* Set number */}
      <span className="text-xs text-gray-500 w-8 text-center font-mono">{setIndex + 1}</span>

      {/* Reps input */}
      <input
        type="number"
        value={set.reps || ''}
        onChange={e => handleReps(e.target.value)}
        placeholder="–"
        className={`flex-1 text-center bg-white/5 border rounded-lg py-2.5 text-sm font-mono focus:outline-none focus:ring-1 ${
          set.completed
            ? 'border-green-500/30 text-green-300 focus:ring-green-500'
            : 'border-white/10 text-white focus:ring-white/30'
        }`}
        min={0}
      />

      {/* Weight input */}
      <input
        type="number"
        value={set.weight === 0 ? '' : toDisplay(set.weight)}
        onChange={e => handleWeight(e.target.value)}
        placeholder="0"
        step={unit === 'lbs' ? '5' : '2.5'}
        className={`flex-1 text-center bg-white/5 border rounded-lg py-2.5 text-sm font-mono focus:outline-none focus:ring-1 ${
          set.completed
            ? 'border-green-500/30 text-green-300 focus:ring-green-500'
            : 'border-white/10 text-white focus:ring-white/30'
        }`}
        min={0}
      />

      {/* Complete / Remove */}
      <div className="w-12 flex items-center justify-center gap-1">
        <button
          onClick={toggleComplete}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            set.completed
              ? 'bg-green-500 text-black'
              : 'bg-white/10 text-gray-400 hover:bg-white/20'
          }`}
        >
          {set.completed ? '✓' : '○'}
        </button>
      </div>
    </div>
  )
}
