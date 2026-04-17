'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useWorkout } from '@/context/WorkoutContext'
import AdaptiveExerciseCard from '@/components/adaptive/AdaptiveExerciseCard'
import { FOCUS_MODE_TEMPLATES } from '@/lib/generator'
import { MUSCLE_GROUP_LABELS } from '@/lib/types'

const SWIPE_THRESHOLD = 50 // px

export default function WorkoutPage() {
  const { state, finishWorkout, discardWorkout, updateNote } = useWorkout()
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFinishConfirm, setShowFinishConfirm] = useState(false)
  const startTimeRef = useRef<number>(Date.now())
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const [showExitSheet, setShowExitSheet] = useState(false)
  const workout = state.activeWorkout

  useEffect(() => {
    if (workout) {
      startTimeRef.current = new Date(workout.startedAt).getTime()
    }
  }, [workout?.startedAt])

  if (!state.hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-12 text-center">
        <p className="text-6xl mb-4">🏋️</p>
        <h2 className="text-xl font-bold mb-2">Ingen aktiv økt</h2>
        <p className="text-gray-400 mb-6">Gå til forsiden for å generere en ny treningsøkt.</p>
        <Link href="/" className="bg-green-500 text-black font-bold px-6 py-3 rounded-xl inline-block">
          Gå til forsiden
        </Link>
      </div>
    )
  }

  const exercises = workout.exercises
  const total = exercises.length
  const safeIndex = Math.min(currentIndex, total - 1)

  const completedSets = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0
  )
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0)
  const progress = totalSets > 0 ? completedSets / totalSets : 0
  const focusTemplate = FOCUS_MODE_TEMPLATES[workout.focusMode]

  function goTo(index: number) {
    setCurrentIndex(Math.max(0, Math.min(total - 1, index)))
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    // Only trigger on horizontal swipe (not vertical scroll)
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) goTo(safeIndex + 1) // swipe left → next
      else goTo(safeIndex - 1)        // swipe right → prev
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  function handleFinish() {
    const durationMs = Date.now() - startTimeRef.current
    const durationMinutes = Math.max(1, Math.round(durationMs / 60000))
    finishWorkout(durationMinutes)
    router.push('/history')
  }

  const isLast = safeIndex === total - 1

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowExitSheet(true)}
          className="text-gray-500 hover:text-white p-2 -ml-2 transition-colors"
        >
          ← Avslutt
        </button>
        <WorkoutTimer startedAt={workout.startedAt} />
      </div>

      {/* Workout info */}
      <div className="mb-3">
        <h1 className="text-xl font-bold">{workout.name}</h1>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
            {focusTemplate.label} · {focusTemplate.sets}×{focusTemplate.repsLabel}
          </span>
          {workout.muscleGroups.map(g => (
            <span key={g} className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">
              {MUSCLE_GROUP_LABELS[g]}
            </span>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span>{completedSets} av {totalSets} sett fullført</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Exercise dots */}
      <div className="flex items-center justify-center gap-1.5 mb-4">
        {exercises.map((ex, i) => {
          const allDone = ex.sets.length > 0 && ex.sets.every(s => s.completed)
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-200 ${
                i === safeIndex
                  ? 'w-5 h-2 bg-white'
                  : allDone
                  ? 'w-2 h-2 bg-green-500'
                  : 'w-2 h-2 bg-white/25'
              }`}
            />
          )
        })}
      </div>

      {/* Swipeable exercise area */}
      <div
        className="flex-1"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Exercise counter */}
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs text-gray-500">
            Øvelse {safeIndex + 1} av {total}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => goTo(safeIndex - 1)}
              disabled={safeIndex === 0}
              className="text-xs text-gray-500 hover:text-white disabled:opacity-25 transition-colors px-2 py-1"
            >
              ← Forrige
            </button>
            <button
              onClick={() => goTo(safeIndex + 1)}
              disabled={isLast}
              className="text-xs text-gray-500 hover:text-white disabled:opacity-25 transition-colors px-2 py-1"
            >
              Neste →
            </button>
          </div>
        </div>

        <AdaptiveExerciseCard
          key={exercises[safeIndex].exerciseId}
          exercise={exercises[safeIndex]}
          exerciseIndex={safeIndex}
          history={state.history}
        />
      </div>

      {/* Workout note (last exercise) + finish */}
      {isLast && (
        <div className="mb-4">
          <textarea
            value={workout.note ?? ''}
            onChange={e => updateNote(e.target.value)}
            placeholder="Legg til notat for denne økten... (valgfritt)"
            rows={2}
            className="w-full bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-3 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
      )}

      <div className="sticky bottom-20 pb-4 pt-2 bg-gradient-to-t from-[#0f0f0f] to-transparent">
        {isLast ? (
          <button
            onClick={() => setShowFinishConfirm(true)}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl text-lg transition-colors"
          >
            Fullfør økt 🎉
          </button>
        ) : (
          <button
            onClick={() => goTo(safeIndex + 1)}
            className="w-full bg-white/8 hover:bg-white/15 text-white font-semibold py-4 rounded-2xl text-base transition-colors"
          >
            Neste øvelse →
          </button>
        )}
      </div>

      {/* Exit sheet — lagre eller forkast */}
      {showExitSheet && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={() => setShowExitSheet(false)}>
          <div
            className="w-full bg-[#1a1a1a] rounded-t-3xl p-6 pb-10 border-t border-white/10 max-w-lg mx-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

            <h3 className="font-bold text-lg mb-1">Avslutt økt</h3>
            <p className="text-gray-400 text-sm mb-6">
              {completedSets} av {totalSets} sett fullført
              {workout.muscleGroups.length > 0 && (
                <> · {workout.muscleGroups.map(g => MUSCLE_GROUP_LABELS[g]).join(', ')}</>
              )}
            </p>

            {/* Lagre og avslutt */}
            <button
              onClick={handleFinish}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-2xl text-base transition-colors mb-3"
            >
              Lagre og avslutt
            </button>

            {/* Fortsett */}
            <button
              onClick={() => setShowExitSheet(false)}
              className="w-full bg-white/8 hover:bg-white/15 text-white font-semibold py-4 rounded-2xl text-base transition-colors mb-3"
            >
              Fortsett trening
            </button>

            {/* Forkast */}
            <button
              onClick={() => { discardWorkout(); router.push('/') }}
              className="w-full text-red-400 hover:text-red-300 py-3 text-sm font-medium transition-colors"
            >
              Forkast økt uten å lagre
            </button>
          </div>
        </div>
      )}

      {/* Finish confirmation (fra siste øvelse) */}
      {showFinishConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-sm border border-white/10">
            <h3 className="font-bold text-lg mb-2">Fullføre økt? 🎉</h3>
            <p className="text-gray-400 text-sm mb-2">
              {completedSets} av {totalSets} sett er fullført.
            </p>
            {completedSets < totalSets && (
              <p className="text-yellow-400 text-xs mb-4">
                Du har {totalSets - completedSets} ufullstendige sett. Du kan fortsatt lagre.
              </p>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowFinishConfirm(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-semibold transition-colors"
              >
                Fortsett
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 bg-green-500 hover:bg-green-400 text-black py-3 rounded-xl font-bold transition-colors"
              >
                Lagre og avslutt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function WorkoutTimer({ startedAt }: { startedAt: string }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const start = new Date(startedAt).getTime()
    const update = () => setElapsed(Math.floor((Date.now() - start) / 1000))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [startedAt])

  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60

  return (
    <span className="text-sm font-mono text-gray-400 bg-white/5 px-3 py-1.5 rounded-full">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  )
}
