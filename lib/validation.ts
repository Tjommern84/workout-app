import type { WorkoutRecord, UserSettings, UserProfile, FocusMode, MuscleGroup, Equipment, UserGoal, UserLevel } from './types'

const FOCUS_MODES: FocusMode[] = ['strength', 'hypertrophy', 'shred']
const MUSCLE_GROUPS: MuscleGroup[] = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core']
const FEEDBACK_VALUES = ['too_easy', 'just_right', 'too_hard']
const EQUIPMENT_VALUES: Equipment[] = ['barbell', 'dumbbell', 'machine', 'bodyweight', 'cable', 'kettlebell']
const GOAL_VALUES: UserGoal[] = ['lose_fat', 'build_muscle', 'get_stronger', 'improve_fitness', 'general_health']
const LEVEL_VALUES: UserLevel[] = ['guide', 'structure', 'data']

function isValidDate(s: unknown): boolean {
  if (typeof s !== 'string' || s.length === 0) return false
  const d = new Date(s)
  return !isNaN(d.getTime())
}

function isFiniteNonNegative(n: unknown): boolean {
  return typeof n === 'number' && isFinite(n) && n >= 0
}

export function validateRecord(r: unknown, index: number): string | null {
  if (typeof r !== 'object' || r === null) return `Record ${index}: ikke et objekt`

  const rec = r as Record<string, unknown>

  if (typeof rec.id !== 'string' || rec.id.length === 0)
    return `Record ${index}: mangler id`
  if (!isValidDate(rec.date))
    return `Record ${index}: ugyldig dato "${rec.date}"`
  if (typeof rec.name !== 'string' || rec.name.length === 0)
    return `Record ${index}: mangler navn`
  if (!FOCUS_MODES.includes(rec.focusMode as FocusMode))
    return `Record ${index}: ugyldig focusMode "${rec.focusMode}"`
  if (!Array.isArray(rec.muscleGroups) || rec.muscleGroups.length === 0)
    return `Record ${index}: muscleGroups mangler`
  if (!Array.isArray(rec.exercises))
    return `Record ${index}: exercises er ikke en liste`
  if (!isFiniteNonNegative(rec.durationMinutes))
    return `Record ${index}: ugyldig durationMinutes`

  for (let ei = 0; ei < (rec.exercises as unknown[]).length; ei++) {
    const ex = (rec.exercises as unknown[])[ei]
    if (typeof ex !== 'object' || ex === null)
      return `Record ${index}, øvelse ${ei}: ikke et objekt`
    const exObj = ex as Record<string, unknown>
    if (typeof exObj.exerciseId !== 'string' || exObj.exerciseId.length === 0)
      return `Record ${index}, øvelse ${ei}: mangler exerciseId`
    if (!Array.isArray(exObj.sets))
      return `Record ${index}, øvelse ${ei}: sets er ikke en liste`

    for (let si = 0; si < (exObj.sets as unknown[]).length; si++) {
      const set = (exObj.sets as unknown[])[si]
      if (typeof set !== 'object' || set === null)
        return `Record ${index}, øvelse ${ei}, sett ${si}: ikke et objekt`
      const s = set as Record<string, unknown>
      if (!isFiniteNonNegative(s.reps))
        return `Record ${index}, øvelse ${ei}, sett ${si}: ugyldig reps`
      if (!isFiniteNonNegative(s.weight))
        return `Record ${index}, øvelse ${ei}, sett ${si}: ugyldig vekt`
      if (typeof s.completed !== 'boolean')
        return `Record ${index}, øvelse ${ei}, sett ${si}: completed mangler`
      if (s.feedback !== undefined && !FEEDBACK_VALUES.includes(s.feedback as string))
        return `Record ${index}, øvelse ${ei}, sett ${si}: ugyldig feedback`
    }
  }

  return null
}

export interface ImportValidationResult {
  valid: boolean
  error?: string
  history?: WorkoutRecord[]
  settings?: UserSettings
  profile?: UserProfile
}

export function validateImportPayload(data: unknown): ImportValidationResult {
  if (typeof data !== 'object' || data === null)
    return { valid: false, error: 'Filen er ikke gyldig JSON.' }

  const d = data as Record<string, unknown>

  if (d.version !== 1)
    return { valid: false, error: `Ukjent backup-versjon: ${d.version}. Forventet versjon 1.` }

  if (!Array.isArray(d.history))
    return { valid: false, error: 'history mangler eller er ikke en liste.' }

  for (let i = 0; i < d.history.length; i++) {
    const err = validateRecord(d.history[i], i + 1)
    if (err) return { valid: false, error: err }
  }

  let settings: UserSettings | undefined
  if (d.settings !== undefined) {
    const s = d.settings as Record<string, unknown>
    if (s.weightUnit !== 'kg' && s.weightUnit !== 'lbs')
      return { valid: false, error: `Ugyldig weightUnit: "${s.weightUnit}"` }
    settings = { weightUnit: s.weightUnit as 'kg' | 'lbs' }
  }

  let profile: UserProfile | undefined
  if (d.profile !== null && d.profile !== undefined) {
    const p = d.profile as Record<string, unknown>
    if (!LEVEL_VALUES.includes(p.level as UserLevel))
      return { valid: false, error: `Ugyldig bruker-nivå: "${p.level}"` }
    if (!GOAL_VALUES.includes(p.goal as UserGoal))
      return { valid: false, error: `Ugyldig mål: "${p.goal}"` }
    if (![3, 4, 5, 6].includes(p.daysPerWeek as number))
      return { valid: false, error: `Ugyldig daysPerWeek: "${p.daysPerWeek}"` }
    if (!Array.isArray(p.equipment) || !(p.equipment as unknown[]).every(e => EQUIPMENT_VALUES.includes(e as Equipment)))
      return { valid: false, error: 'Ugyldig utstyrsliste i profil.' }
    profile = d.profile as UserProfile
  }

  return { valid: true, history: d.history as WorkoutRecord[], settings, profile }
}
