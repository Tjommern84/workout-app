'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react'
import { WorkoutRecord, ActiveWorkout, LoggedSet, UserSettings, MuscleGroup, ProgramCycle } from '@/lib/types'
import { getById } from '@/lib/exercises'
import { MUSCLE_INFO } from '@/lib/anatomy'
import {
  loadHistory, saveHistory,
  loadActiveWorkout, saveActiveWorkout,
  loadSettings, saveSettings,
  loadCycle, saveCycle,
} from '@/lib/storage'
import { recordWorkoutInCycle } from '@/lib/cycles'

// State
interface WorkoutState {
  history: WorkoutRecord[]
  activeWorkout: ActiveWorkout | null
  settings: UserSettings
  activeCycle: ProgramCycle | null
  hydrated: boolean
  storageErrors: string[]
}

// Actions
type Action =
  | { type: 'HYDRATE'; history: WorkoutRecord[]; active: ActiveWorkout | null; settings: UserSettings; cycle: ProgramCycle | null; storageErrors: string[] }
  | { type: 'START_WORKOUT'; payload: ActiveWorkout }
  | { type: 'UPDATE_SET'; exerciseIndex: number; setIndex: number; data: Partial<LoggedSet> }
  | { type: 'ADD_SET'; exerciseIndex: number }
  | { type: 'REMOVE_SET'; exerciseIndex: number; setIndex: number }
  | { type: 'FINISH_WORKOUT'; durationMinutes: number; recordId: string; recordDate: string }
  | { type: 'DISCARD_WORKOUT' }
  | { type: 'DELETE_WORKOUT'; id: string }
  | { type: 'UPDATE_SETTINGS'; settings: UserSettings }
  | { type: 'UPDATE_NOTE'; note: string }
  | { type: 'SWAP_EXERCISE'; exerciseIndex: number; newExerciseId: string }
  | { type: 'START_CYCLE'; cycle: ProgramCycle }
  | { type: 'ABANDON_CYCLE' }

function sanitizeSetData(data: Partial<LoggedSet>): Partial<LoggedSet> {
  const result: Partial<LoggedSet> = { ...data }
  if ('weight' in data) {
    const w = Number(data.weight)
    result.weight = isFinite(w) ? Math.min(1000, Math.max(0, w)) : 0
  }
  if ('reps' in data) {
    const r = Math.floor(Number(data.reps))
    result.reps = isFinite(r) ? Math.min(999, Math.max(0, r)) : 0
  }
  if ('rpe' in data && data.rpe !== undefined) {
    const rpe = Number(data.rpe)
    result.rpe = isFinite(rpe) ? Math.min(10, Math.max(1, rpe)) : undefined
  }
  if ('feedback' in data && data.feedback !== undefined) {
    const valid: LoggedSet['feedback'][] = ['too_easy', 'just_right', 'too_hard']
    if (!valid.includes(data.feedback)) result.feedback = undefined
  }
  return result
}

function reducer(state: WorkoutState, action: Action): WorkoutState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, history: action.history, activeWorkout: action.active, settings: action.settings, activeCycle: action.cycle, hydrated: true, storageErrors: action.storageErrors }

    case 'START_WORKOUT':
      return { ...state, activeWorkout: action.payload }

    case 'UPDATE_SET': {
      if (!state.activeWorkout) return state
      const exercises = state.activeWorkout.exercises.map((ex, ei) => {
        if (ei !== action.exerciseIndex) return ex
        return {
          ...ex,
          sets: ex.sets.map((s, si) =>
            si === action.setIndex ? { ...s, ...sanitizeSetData(action.data) } : s
          ),
        }
      })
      return { ...state, activeWorkout: { ...state.activeWorkout, exercises } }
    }

    case 'ADD_SET': {
      if (!state.activeWorkout) return state
      const template = state.activeWorkout.exercises[action.exerciseIndex]?.sets[0]
      const safeTemplate = template ? sanitizeSetData({ reps: template.reps, weight: template.weight }) : {}
      const newSet: LoggedSet = { reps: (safeTemplate.reps ?? 10) || 10, weight: safeTemplate.weight ?? 0, completed: false }
      const exercises = state.activeWorkout.exercises.map((ex, ei) => {
        if (ei !== action.exerciseIndex) return ex
        return { ...ex, sets: [...ex.sets, newSet] }
      })
      return { ...state, activeWorkout: { ...state.activeWorkout, exercises } }
    }

    case 'REMOVE_SET': {
      if (!state.activeWorkout) return state
      const exercises = state.activeWorkout.exercises.map((ex, ei) => {
        if (ei !== action.exerciseIndex) return ex
        if (ex.sets.length <= 1) return ex
        return { ...ex, sets: ex.sets.filter((_, si) => si !== action.setIndex) }
      })
      return { ...state, activeWorkout: { ...state.activeWorkout, exercises } }
    }

    case 'FINISH_WORKOUT': {
      if (!state.activeWorkout) return state

      const cleanedExercises = state.activeWorkout.exercises
        .map(ex => ({
          ...ex,
          sets: ex.sets.filter(s => s.completed),
        }))
        .filter(ex => ex.sets.length > 0)

      const trainedGroups = new Set<MuscleGroup>()
      for (const ex of cleanedExercises) {
        const def = getById(ex.exerciseId)
        if (!def) continue
        for (const muscle of def.primaryMuscles) {
          trainedGroups.add(MUSCLE_INFO[muscle].muscleGroup)
        }
      }

      const record: WorkoutRecord = {
        id: action.recordId,
        date: action.recordDate,
        name: state.activeWorkout.name,
        focusMode: state.activeWorkout.focusMode,
        muscleGroups: [...trainedGroups],
        exercises: cleanedExercises,
        durationMinutes: action.durationMinutes,
        note: state.activeWorkout.note,
      }

      const updatedCycle = state.activeCycle && state.activeCycle.status === 'active'
        ? recordWorkoutInCycle(state.activeCycle, record.id, record.date.slice(0, 10))
        : state.activeCycle

      return {
        ...state,
        activeWorkout: null,
        history: [record, ...state.history],
        activeCycle: updatedCycle,
      }
    }

    case 'DISCARD_WORKOUT':
      return { ...state, activeWorkout: null }

    case 'DELETE_WORKOUT':
      return { ...state, history: state.history.filter(r => r.id !== action.id) }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: action.settings }

    case 'UPDATE_NOTE':
      if (!state.activeWorkout) return state
      return { ...state, activeWorkout: { ...state.activeWorkout, note: action.note } }

    case 'SWAP_EXERCISE': {
      if (!state.activeWorkout) return state
      const exercises = state.activeWorkout.exercises.map((ex, ei) => {
        if (ei !== action.exerciseIndex) return ex
        return { ...ex, exerciseId: action.newExerciseId }
      })
      return { ...state, activeWorkout: { ...state.activeWorkout, exercises } }
    }

    case 'START_CYCLE':
      return { ...state, activeCycle: action.cycle }

    case 'ABANDON_CYCLE':
      if (!state.activeCycle) return state
      return { ...state, activeCycle: { ...state.activeCycle, status: 'abandoned' } }

    default:
      return state
  }
}

interface WorkoutContextValue {
  state: WorkoutState
  startWorkout: (workout: ActiveWorkout) => void
  updateSet: (exerciseIndex: number, setIndex: number, data: Partial<LoggedSet>) => void
  addSet: (exerciseIndex: number) => void
  removeSet: (exerciseIndex: number, setIndex: number) => void
  finishWorkout: (durationMinutes: number) => void
  discardWorkout: () => void
  deleteWorkout: (id: string) => void
  updateSettings: (settings: UserSettings) => void
  updateNote: (note: string) => void
  swapExercise: (exerciseIndex: number, newExerciseId: string) => void
  startCycle: (cycle: ProgramCycle) => void
  abandonCycle: () => void
  lastPRs: string[]  // exercise IDs that hit new PRs in the last finished workout
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null)

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    history: [],
    activeWorkout: null,
    settings: { weightUnit: 'kg' },
    activeCycle: null,
    hydrated: false,
    storageErrors: [],
  })

  // Hydrate from localStorage on mount
  useEffect(() => {
    const historyResult = loadHistory()
    const activeResult = loadActiveWorkout()
    const settingsResult = loadSettings()
    const cycleResult = loadCycle()

    const errors: string[] = []
    if (!historyResult.ok) errors.push('treningshistorikk')
    if (!activeResult.ok) errors.push('aktiv økt')
    if (!settingsResult.ok) errors.push('innstillinger')

    dispatch({
      type: 'HYDRATE',
      history: historyResult.data,
      active: activeResult.data,
      settings: settingsResult.data,
      cycle: cycleResult.data,
      storageErrors: errors,
    })
  }, [])

  // Persist history when it changes
  useEffect(() => {
    if (state.hydrated) saveHistory(state.history)
  }, [state.history, state.hydrated])

  // Persist active workout when it changes
  useEffect(() => {
    if (state.hydrated) saveActiveWorkout(state.activeWorkout)
  }, [state.activeWorkout, state.hydrated])

  // Persist settings when they change
  useEffect(() => {
    if (state.hydrated) saveSettings(state.settings)
  }, [state.settings, state.hydrated])

  // Persist active cycle when it changes
  useEffect(() => {
    if (state.hydrated) saveCycle(state.activeCycle)
  }, [state.activeCycle, state.hydrated])

  const startWorkout = useCallback((workout: ActiveWorkout) => dispatch({ type: 'START_WORKOUT', payload: workout }), [])
  const updateSet = useCallback((exerciseIndex: number, setIndex: number, data: Partial<LoggedSet>) =>
    dispatch({ type: 'UPDATE_SET', exerciseIndex, setIndex, data }), [])
  const addSet = useCallback((exerciseIndex: number) => dispatch({ type: 'ADD_SET', exerciseIndex }), [])
  const removeSet = useCallback((exerciseIndex: number, setIndex: number) =>
    dispatch({ type: 'REMOVE_SET', exerciseIndex, setIndex }), [])
  const discardWorkout = useCallback(() => dispatch({ type: 'DISCARD_WORKOUT' }), [])
  const deleteWorkout = useCallback((id: string) => dispatch({ type: 'DELETE_WORKOUT', id }), [])
  const updateSettings = useCallback((settings: UserSettings) => dispatch({ type: 'UPDATE_SETTINGS', settings }), [])
  const updateNote = useCallback((note: string) => dispatch({ type: 'UPDATE_NOTE', note }), [])
  const swapExercise = useCallback((exerciseIndex: number, newExerciseId: string) =>
    dispatch({ type: 'SWAP_EXERCISE', exerciseIndex, newExerciseId }), [])

  // Track PRs from last finished workout
  const lastPRsRef = useRef<string[]>([])
  const finishWorkoutWithPR = useCallback((durationMinutes: number) => {
    if (!state.activeWorkout) return
    const newPRs: string[] = []
    for (const ex of state.activeWorkout.exercises) {
      const completedSets = ex.sets.filter(s => s.completed)
      if (completedSets.length === 0) continue
      const newBest = Math.max(...completedSets.map(s => s.weight))
      if (newBest === 0) continue
      const prevBest = Math.max(
        0,
        ...state.history
          .flatMap(r => r.exercises.filter(e => e.exerciseId === ex.exerciseId))
          .flatMap(e => e.sets.filter(s => s.completed).map(s => s.weight))
      )
      if (newBest > prevBest) newPRs.push(ex.exerciseId)
    }
    lastPRsRef.current = newPRs
    const recordId = crypto.randomUUID()
    const recordDate = state.activeWorkout.startedAt
    dispatch({ type: 'FINISH_WORKOUT', durationMinutes, recordId, recordDate })
  }, [state.activeWorkout, state.history])

  const startCycle = useCallback((cycle: ProgramCycle) => dispatch({ type: 'START_CYCLE', cycle }), [])
  const abandonCycle = useCallback(() => dispatch({ type: 'ABANDON_CYCLE' }), [])

  return (
    <WorkoutContext.Provider value={{
      state, startWorkout, updateSet, addSet, removeSet,
      finishWorkout: finishWorkoutWithPR, discardWorkout, deleteWorkout, updateSettings, updateNote, swapExercise,
      startCycle, abandonCycle,
      lastPRs: lastPRsRef.current,
    }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext)
  if (!ctx) throw new Error('useWorkout must be used within WorkoutProvider')
  return ctx
}
