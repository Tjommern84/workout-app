'use client'

import { WorkoutExercise, LoggedSet, UserLevel, WorkoutRecord } from '@/lib/types'
import { useWorkout } from '@/context/WorkoutContext'
import { getById, formatEquipment } from '@/lib/exercises'
import { loadProfile } from '@/lib/storage'
import { getLastTrainedDates } from '@/lib/generator'
import { useEffect, useState } from 'react'

// Level 1
import GuidedExerciseCard from '@/components/level1/GuidedExerciseCard'
import RestTimer from '@/components/level1/RestTimer'

// Hooks
import { useWeightUnit } from '@/hooks/useWeightUnit'

// Level 2 extras
import LastSessionBadge from '@/components/level2/LastSessionBadge'
import WhyThisExercise from '@/components/level2/WhyThisExercise'

// Level 3 extras
import RPESelector from '@/components/level3/RPESelector'
import E1rmTrendChart from '@/components/level3/E1rmTrendChart'

// Standard (baseline)
import SetRow from '@/components/workout/SetRow'
import SwapExerciseSheet from '@/components/workout/SwapExerciseSheet'

interface AdaptiveExerciseCardProps {
  exercise: WorkoutExercise
  exerciseIndex: number
  history: WorkoutRecord[]
}

export default function AdaptiveExerciseCard({
  exercise,
  exerciseIndex,
  history,
}: AdaptiveExerciseCardProps) {
  const { updateSet, addSet, state } = useWorkout()
  const [level, setLevel] = useState<UserLevel>('structure')
  const [showSwap, setShowSwap] = useState(false)
  const focusMode = state.activeWorkout?.focusMode

  useEffect(() => {
    const profile = loadProfile().data
    if (profile) setLevel(profile.level)
  }, [])

  const def = getById(exercise.exerciseId)
  if (!def) return null

  const lastTrainedDates = getLastTrainedDates(history)
  const lastTrainedDays = lastTrainedDates[def.muscleGroup as import('@/lib/types').MuscleGroup]

  // Guide mode: fully guided experience
  if (level === 'guide') {
    return (
      <GuidedExerciseCard
        exercise={exercise}
        exerciseIndex={exerciseIndex}
        onUpdateSet={(si, data) => updateSet(exerciseIndex, si, data)}
        onAddSet={() => addSet(exerciseIndex)}
      />
    )
  }

  // Structure mode: standard card + badges + why
  if (level === 'structure') {
    return (
      <>
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden mb-4">
          <div className="px-4 pt-4 pb-3 border-b border-white/5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-lg">{def.name}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{def.muscleGroup} · {formatEquipment(def.equipmentTypes)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSwap(true)}
                  className="text-xs text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg transition-colors"
                >
                  Bytt
                </button>
                <span className="text-xs bg-white/8 text-gray-400 px-2.5 py-1 rounded-full shrink-0">
                  {exercise.sets.filter((s) => s.completed).length}/{exercise.sets.length}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              <LastSessionBadge history={history} exerciseId={exercise.exerciseId} focusMode={focusMode} />
            </div>
            {exercise.equipmentMismatch && (
              <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2 mt-2">
                <span>⚠️</span>
                <span>Krever {formatEquipment(def.equipmentTypes)} — du har ikke valgt dette utstyret</span>
              </div>
            )}
            <div className="mt-2">
              <WhyThisExercise exercise={def} lastTrainedDays={lastTrainedDays} />
            </div>
          </div>

          <StandardSetTable exerciseIndex={exerciseIndex} exercise={exercise} />
        </div>
        {showSwap && (
          <SwapExerciseSheet
            exerciseIndex={exerciseIndex}
            currentExerciseId={exercise.exerciseId}
            muscleGroup={def.muscleGroup as import('@/lib/types').MuscleGroup}
            onClose={() => setShowSwap(false)}
          />
        )}
      </>
    )
  }

  // Data mode: full analytics
  return (
    <>
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden mb-4">
      <div className="px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg">{def.name}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{def.muscleGroup} · {formatEquipment(def.equipmentTypes)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSwap(true)}
              className="text-xs text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg transition-colors"
            >
              Bytt
            </button>
            <LastSessionBadge history={history} exerciseId={exercise.exerciseId} focusMode={focusMode} />
          </div>
        </div>
        {exercise.equipmentMismatch && (
          <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2 mt-2">
            <span>⚠️</span>
            <span>Krever {formatEquipment(def.equipmentTypes)} — du har ikke valgt dette utstyret</span>
          </div>
        )}
        <div className="mt-3">
          <E1rmTrendChart
            history={history}
            exerciseId={exercise.exerciseId}
            exerciseName={def.name}
          />
        </div>
      </div>

      {/* Sets with RPE */}
      <div className="divide-y divide-white/5">
        {exercise.sets.map((set, si) => (
          <DataModeSetRow
            key={si}
            set={set}
            setIndex={si}
            exerciseIndex={exerciseIndex}
            onUpdate={(data) => updateSet(exerciseIndex, si, data)}
          />
        ))}
      </div>

      <div className="px-4 py-3">
        <button
          onClick={() => addSet(exerciseIndex)}
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          + Legg til sett
        </button>
      </div>
    </div>
    {showSwap && (
      <SwapExerciseSheet
        exerciseIndex={exerciseIndex}
        currentExerciseId={exercise.exerciseId}
        muscleGroup={def.muscleGroup as import('@/lib/types').MuscleGroup}
        onClose={() => setShowSwap(false)}
      />
    )}
    </>
  )
}

// Standard set table used by structure mode
function StandardSetTable({
  exerciseIndex,
  exercise,
}: {
  exerciseIndex: number
  exercise: WorkoutExercise
}) {
  const { addSet, updateSet } = useWorkout()
  const [showRest, setShowRest] = useState(false)

  function handleComplete(si: number) {
    const wasCompleted = exercise.sets[si].completed
    updateSet(exerciseIndex, si, { completed: !wasCompleted })
    if (!wasCompleted) setShowRest(true)
  }

  return (
    <>
      <div className="px-4 pb-1 flex items-center gap-2 pt-3">
        <span className="text-xs text-gray-600 w-8 text-center">Sett</span>
        <span className="text-xs text-gray-600 flex-1 text-center">Reps</span>
        <span className="text-xs text-gray-600 flex-1 text-center">Vekt (kg)</span>
        <span className="text-xs text-gray-600 w-12 text-center">✓</span>
      </div>
      <div className="px-3 pb-1 space-y-1">
        {exercise.sets.map((set, si) => (
          <StructureSetRow
            key={si}
            set={set}
            setIndex={si}
            exerciseIndex={exerciseIndex}
            onComplete={() => handleComplete(si)}
          />
        ))}
      </div>
      {showRest && (
        <div className="border-t border-white/5 px-4 py-3">
          <RestTimer
            seconds={exercise.recommendedRestSec ?? 90}
            onDone={() => setShowRest(false)}
            autoStart
          />
        </div>
      )}
      <div className="px-4 pb-4 pt-2">
        <button
          onClick={() => addSet(exerciseIndex)}
          className="w-full text-sm text-gray-500 bg-white/5 hover:bg-white/10 py-2.5 rounded-xl transition-colors"
        >
          + Legg til sett
        </button>
      </div>
    </>
  )
}

// Structure mode set row — controlled complete toggle
function StructureSetRow({
  set,
  setIndex,
  exerciseIndex,
  onComplete,
}: {
  set: LoggedSet
  setIndex: number
  exerciseIndex: number
  onComplete: () => void
}) {
  const { updateSet } = useWorkout()
  const { toDisplay, fromDisplay, unit } = useWeightUnit()

  return (
    <div className={`flex items-center gap-2 px-1 py-1.5 rounded-xl transition-colors ${set.completed ? 'bg-green-500/10' : 'hover:bg-white/5'}`}>
      <span className="text-xs text-gray-500 w-8 text-center font-mono">{setIndex + 1}</span>
      <input
        type="number"
        value={set.reps || ''}
        onChange={e => updateSet(exerciseIndex, setIndex, { reps: parseInt(e.target.value) || 0 })}
        placeholder="–"
        className={`flex-1 text-center bg-white/5 border rounded-lg py-2.5 text-sm font-mono focus:outline-none focus:ring-1 ${set.completed ? 'border-green-500/30 text-green-300 focus:ring-green-500' : 'border-white/10 text-white focus:ring-white/30'}`}
        min={0}
      />
      <input
        type="number"
        value={set.weight === 0 ? '' : toDisplay(set.weight)}
        onChange={e => updateSet(exerciseIndex, setIndex, { weight: fromDisplay(parseFloat(e.target.value) || 0) })}
        placeholder="0"
        step={unit === 'lbs' ? '5' : '2.5'}
        className={`flex-1 text-center bg-white/5 border rounded-lg py-2.5 text-sm font-mono focus:outline-none focus:ring-1 ${set.completed ? 'border-green-500/30 text-green-300 focus:ring-green-500' : 'border-white/10 text-white focus:ring-white/30'}`}
        min={0}
      />
      <div className="w-12 flex items-center justify-center">
        <button
          onClick={onComplete}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${set.completed ? 'bg-green-500 text-black' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
        >
          {set.completed ? '✓' : '○'}
        </button>
      </div>
    </div>
  )
}

// Data mode set row with RPE
function DataModeSetRow({
  set,
  setIndex,
  exerciseIndex,
  onUpdate,
}: {
  set: LoggedSet
  setIndex: number
  exerciseIndex: number
  onUpdate: (data: Partial<LoggedSet>) => void
}) {
  const [showRpe, setShowRpe] = useState(false)

  return (
    <div className={`px-4 py-2.5 transition-colors ${set.completed ? 'bg-green-500/5' : ''}`}>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 w-6 tabular-nums">{setIndex + 1}</span>
        <input
          type="number"
          value={set.weight || ''}
          onChange={(e) => onUpdate({ weight: parseFloat(e.target.value) || 0 })}
          placeholder="0"
          className="w-16 bg-white/5 rounded-lg px-2 py-1.5 text-center text-sm font-mono focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <span className="text-gray-600 text-xs">×</span>
        <input
          type="number"
          value={set.reps || ''}
          onChange={(e) => onUpdate({ reps: parseInt(e.target.value) || 0 })}
          placeholder="0"
          className="w-14 bg-white/5 rounded-lg px-2 py-1.5 text-center text-sm font-mono focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        {set.rpe !== undefined && (
          <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
            RPE {set.rpe}
          </span>
        )}
        <div className="flex-1" />
        <button
          onClick={() => setShowRpe((x) => !x)}
          className="text-xs text-gray-600 hover:text-gray-300 transition-colors"
        >
          RPE
        </button>
        <button
          onClick={() => onUpdate({ completed: !set.completed })}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            set.completed ? 'bg-green-500 text-black' : 'bg-white/10 text-gray-400 hover:bg-white/20'
          }`}
        >
          {set.completed ? '✓' : '○'}
        </button>
      </div>
      {showRpe && (
        <div className="mt-2 pl-8">
          <RPESelector
            value={set.rpe}
            onChange={(rpe) => { onUpdate({ rpe }); setShowRpe(false) }}
          />
        </div>
      )}
    </div>
  )
}
