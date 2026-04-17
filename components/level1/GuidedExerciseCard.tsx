'use client'

import { useState } from 'react'
import { WorkoutExercise, LoggedSet, SetFeedback as FeedbackType } from '@/lib/types'
import { getById, formatEquipment } from '@/lib/exercises'
import { nextWeight, primaryEquipment, formatDelta } from '@/lib/weight-ladder'
import SetFeedbackWidget from './SetFeedback'
import RestTimer from './RestTimer'

interface GuidedExerciseCardProps {
  exercise: WorkoutExercise
  exerciseIndex: number
  onUpdateSet: (setIndex: number, data: Partial<LoggedSet>) => void
  onAddSet: () => void
  onAdjustNextSets?: (fromIndex: number, newWeight: number) => void
}

export default function GuidedExerciseCard({
  exercise,
  exerciseIndex,
  onUpdateSet,
  onAddSet,
  onAdjustNextSets,
}: GuidedExerciseCardProps) {
  const def = getById(exercise.exerciseId)
  const [showRest, setShowRest] = useState(false)
  const [expandTip, setExpandTip] = useState(false)

  if (!def) return null

  const equipment = primaryEquipment(def.equipmentTypes)

  function handleFeedback(setIndex: number, feedback: FeedbackType) {
    onUpdateSet(setIndex, { feedback })

    if (feedback === 'just_right') return

    const currentWeight = exercise.sets[setIndex].weight
    if (currentWeight <= 0) return

    const direction = feedback === 'too_easy' ? 'up' : 'down'
    const step = nextWeight(currentWeight, equipment, direction)
    if (step.impossible || step.delta === 0) return

    // Oppdater alle gjenværende ukomplette sett
    exercise.sets.forEach((s, i) => {
      if (i > setIndex && !s.completed) {
        onUpdateSet(i, { weight: step.weight })
      }
    })
    onAdjustNextSets?.(setIndex, step.weight)
  }

  const completedCount = exercise.sets.filter((s) => s.completed).length
  const total = exercise.sets.length
  const allDone = completedCount === total

  function completeSet(si: number) {
    const set = exercise.sets[si]
    onUpdateSet(si, { completed: !set.completed })
    if (!set.completed) setShowRest(true)
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className={`p-4 ${allDone ? 'border-b border-green-500/20' : 'border-b border-white/5'}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              {allDone && <span className="text-green-400 text-sm">✓</span>}
              <h3 className={`font-bold text-lg leading-tight ${allDone ? 'text-green-400' : ''}`}>
                {def.name}
              </h3>
            </div>
            <p className="text-gray-400 text-xs">{def.muscleGroup} · {formatEquipment(def.equipmentTypes)}</p>
          </div>
          <button
            onClick={() => setExpandTip((x) => !x)}
            className="text-gray-500 text-xs bg-white/5 px-2 py-1 rounded-full"
          >
            {expandTip ? 'Skjul tips' : 'Tips 💡'}
          </button>
        </div>

        {expandTip && def.description && (
          <div className="mt-3 p-3 bg-blue-500/8 border border-blue-500/20 rounded-xl">
            <p className="text-blue-300 text-sm leading-relaxed">{def.description}</p>
          </div>
        )}

        {/* Simple progress */}
        <div className="mt-3 flex items-center gap-2">
          {exercise.sets.map((s, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s.completed ? 'bg-green-500' : 'bg-white/10'
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1 tabular-nums">
            {completedCount}/{total}
          </span>
        </div>
      </div>

      {/* Sets */}
      <div className="divide-y divide-white/5">
        {exercise.sets.map((set, si) => (
          <GuidedSetRow
            key={si}
            setIndex={si}
            set={set}
            equipment={equipment}
            onUpdate={(data) => onUpdateSet(si, data)}
            onComplete={() => completeSet(si)}
            onFeedback={(fb) => handleFeedback(si, fb)}
          />
        ))}
      </div>

      {/* Add set */}
      <div className="px-4 py-3 flex items-center gap-3">
        <button
          onClick={onAddSet}
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          + Legg til sett
        </button>
      </div>

      {/* Rest timer */}
      {showRest && (
        <div className="border-t border-white/5 bg-blue-500/5">
          <RestTimer
            seconds={exercise.recommendedRestSec ?? 90}
            onDone={() => setShowRest(false)}
            autoStart
          />
        </div>
      )}
    </div>
  )
}

interface GuidedSetRowProps {
  setIndex: number
  set: LoggedSet
  equipment: import('@/lib/types').Equipment
  onUpdate: (data: Partial<LoggedSet>) => void
  onComplete: () => void
  onFeedback: (fb: FeedbackType) => void
}

function GuidedSetRow({ setIndex, set, equipment, onUpdate, onComplete, onFeedback }: GuidedSetRowProps) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [adjustHint, setAdjustHint] = useState<string | null>(null)

  function handleComplete() {
    onComplete()
    if (!set.completed) setShowFeedback(true)
    else setShowFeedback(false)
  }

  function handleFeedback(fb: FeedbackType) {
    // Vis hint om vektjustering til brukeren
    if (fb !== 'just_right' && set.weight > 0) {
      const direction = fb === 'too_easy' ? 'up' : 'down'
      const step = nextWeight(set.weight, equipment, direction)
      if (!step.impossible && step.delta !== 0) {
        setAdjustHint(`Neste sett: ${step.weight} kg (${formatDelta(step.delta)})`)
      } else if (step.impossible) {
        setAdjustHint('Prøv en vanskeligere/lettere variasjon')
      }
    }
    onFeedback(fb)
    setShowFeedback(false)
  }

  return (
    <div className={`px-4 py-3 transition-colors ${set.completed ? 'bg-green-500/5' : ''}`}>
      <div className="flex items-center gap-3">
        <span className="text-gray-500 text-sm w-4 text-center tabular-nums">{setIndex + 1}</span>
        <div className="flex items-center gap-2 flex-1">
          <div className="flex flex-col items-center gap-0.5">
            <input
              type="number"
              value={set.weight || ''}
              onChange={(e) => onUpdate({ weight: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              className="w-16 bg-white/5 rounded-lg px-2 py-1.5 text-center text-sm font-bold focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <span className="text-gray-500 text-xs">{set.weight === 0 ? 'Start lett' : 'kg'}</span>
          </div>
          <span className="text-gray-600">×</span>
          <div className="flex flex-col items-center gap-0.5">
            <input
              type="number"
              value={set.reps || ''}
              onChange={(e) => onUpdate({ reps: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="w-16 bg-white/5 rounded-lg px-2 py-1.5 text-center text-sm font-bold focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <span className="text-gray-500 text-xs">reps</span>
          </div>
        </div>
        <button
          onClick={handleComplete}
          className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all ${
            set.completed
              ? 'bg-green-500 border-green-500 text-black'
              : 'border-white/20 text-gray-500 hover:border-green-500'
          }`}
        >
          {set.completed ? '✓' : '○'}
        </button>
      </div>

      {set.completed && showFeedback && (
        <div className="mt-3">
          <p className="text-xs text-gray-400 text-center mb-2">Hvordan var det?</p>
          <SetFeedbackWidget value={set.feedback} onChange={handleFeedback} />
        </div>
      )}

      {set.completed && adjustHint && (
        <p className="mt-2 text-xs text-center text-blue-400">{adjustHint}</p>
      )}
    </div>
  )
}
