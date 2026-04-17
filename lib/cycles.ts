import { ProgramCycle, CycleWorkout } from './types'

export function startCycle(
  programId: string,
  programName: string,
  options: { targetWeeks?: number; targetWorkoutsPerWeek?: number } = {}
): ProgramCycle {
  return {
    id: crypto.randomUUID(),
    programId,
    programName,
    startDate: new Date().toISOString().slice(0, 10),
    targetWeeks: options.targetWeeks ?? 8,
    targetWorkoutsPerWeek: options.targetWorkoutsPerWeek ?? 2,
    completedWorkouts: [],
    status: 'active',
  }
}

// Returns the calendar week number (1-based) a date falls in, relative to cycle start
function calendarWeekOf(startDate: string, date: string): number {
  const start = new Date(startDate).getTime()
  const d = new Date(date).getTime()
  return Math.floor((d - start) / (7 * 86400000)) + 1
}

// Returns all calendar weeks that were under-target (incomplete)
function incompletePriorWeeks(cycle: ProgramCycle, beforeCalWeek: number): number {
  let count = 0
  for (let w = 1; w < beforeCalWeek; w++) {
    const wCount = cycle.completedWorkouts.filter(cw => cw.weekNumber === w).length
    if (wCount < cycle.targetWorkoutsPerWeek) count++
  }
  return count
}

// Effective (adjusted) week number — calendar week minus weeks that were skipped/incomplete
export function getEffectiveWeek(cycle: ProgramCycle, date?: string): number {
  const d = date ?? new Date().toISOString().slice(0, 10)
  const calWeek = Math.max(1, calendarWeekOf(cycle.startDate, d))
  const missed = incompletePriorWeeks(cycle, calWeek)
  return Math.max(1, calWeek - missed)
}

export function isWeekComplete(cycle: ProgramCycle, calWeekNumber: number): boolean {
  return cycle.completedWorkouts.filter(cw => cw.weekNumber === calWeekNumber).length >= cycle.targetWorkoutsPerWeek
}

export function isCycleComplete(cycle: ProgramCycle): boolean {
  let completedEffectiveWeeks = 0
  const maxCalWeek = Math.max(0, ...cycle.completedWorkouts.map(cw => cw.weekNumber))
  for (let w = 1; w <= maxCalWeek; w++) {
    if (isWeekComplete(cycle, w)) completedEffectiveWeeks++
  }
  return completedEffectiveWeeks >= cycle.targetWeeks
}

export function recordWorkoutInCycle(
  cycle: ProgramCycle,
  workoutRecordId: string,
  date: string
): ProgramCycle {
  const calWeek = Math.max(1, calendarWeekOf(cycle.startDate, date))
  const entry: CycleWorkout = { workoutRecordId, date, weekNumber: calWeek }
  const updated: ProgramCycle = {
    ...cycle,
    completedWorkouts: [...cycle.completedWorkouts, entry],
  }
  if (isCycleComplete(updated)) {
    return { ...updated, status: 'completed', completedDate: date }
  }
  return updated
}

export interface CycleProgress {
  currentWeek: number      // effective week (adjusted)
  totalWeeks: number
  workoutsThisCalWeek: number
  targetPerWeek: number
  isExtended: boolean      // true if any prior calendar week was incomplete
  totalCompleted: number
}

export function getCycleProgress(cycle: ProgramCycle): CycleProgress {
  const today = new Date().toISOString().slice(0, 10)
  const calWeek = Math.max(1, calendarWeekOf(cycle.startDate, today))
  const missed = incompletePriorWeeks(cycle, calWeek)
  const currentWeek = Math.max(1, calWeek - missed)
  const workoutsThisCalWeek = cycle.completedWorkouts.filter(cw => cw.weekNumber === calWeek).length

  return {
    currentWeek,
    totalWeeks: cycle.targetWeeks,
    workoutsThisCalWeek,
    targetPerWeek: cycle.targetWorkoutsPerWeek,
    isExtended: missed > 0,
    totalCompleted: cycle.completedWorkouts.length,
  }
}
