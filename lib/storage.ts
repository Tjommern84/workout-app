import { WorkoutRecord, ActiveWorkout, UserSettings, UserProfile, STORAGE_SCHEMA_VERSION, MuscleGroup, ProgramCycle } from './types'
import { getById } from './exercises'
import { MUSCLE_INFO } from './anatomy'
import { validateRecord } from './validation'

const HISTORY_KEY = 'workout_history'
const ACTIVE_KEY = 'workout_active'
const SETTINGS_KEY = 'workout_settings'
const PROFILE_KEY = 'workout_profile'
const CYCLE_KEY = 'workout_cycle'

export type LoadResult<T> =
  | { ok: true; data: T }
  | { ok: false; data: T; key: string; error: string }

// ---------------------------------------------------------------------------
// Schema migration
// ---------------------------------------------------------------------------

interface StorageEnvelope<T> {
  schemaVersion: number
  data: T
}

function migrateHistory(raw: unknown, fromVersion: number): WorkoutRecord[] {
  if (fromVersion === 0) {
    // Legacy format: bare array without envelope
    if (!Array.isArray(raw)) return []
    const valid: WorkoutRecord[] = []
    let skipped = 0
    for (let i = 0; i < raw.length; i++) {
      const err = validateRecord(raw[i], i + 1)
      if (err) {
        console.warn(`[storage] Skipping corrupt record during migration: ${err}`)
        skipped++
      } else {
        valid.push(raw[i] as WorkoutRecord)
      }
    }
    if (skipped > 0) {
      console.warn(`[storage] Migration v0→v1: skipped ${skipped} corrupt records`)
    }
    return valid
  }
  if (fromVersion === 1) {
    // v1→v2: fjern ufullstendige sett og øvelser uten fullførte sett,
    // og utled muscleGroups fra faktiske øvelser
    if (!Array.isArray(raw)) return []
    return (raw as WorkoutRecord[]).map(record => {
      const cleanedExercises = record.exercises
        .map(ex => ({ ...ex, sets: ex.sets.filter(s => s.completed) }))
        .filter(ex => ex.sets.length > 0)

      const trainedGroups = new Set<MuscleGroup>()
      for (const ex of cleanedExercises) {
        const def = getById(ex.exerciseId)
        if (!def) continue
        for (const muscle of def.primaryMuscles) {
          trainedGroups.add(MUSCLE_INFO[muscle].muscleGroup)
        }
      }

      return {
        ...record,
        exercises: cleanedExercises,
        muscleGroups: trainedGroups.size > 0 ? [...trainedGroups] : record.muscleGroups,
      }
    }).filter(r => r.exercises.length > 0)
  }

  // Future versions: add cases here
  return Array.isArray(raw) ? (raw as WorkoutRecord[]) : []
}

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

export function loadHistory(): LoadResult<WorkoutRecord[]> {
  if (typeof window === 'undefined') return { ok: true, data: [] }
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return { ok: true, data: [] }

    const parsed = JSON.parse(raw)

    // Detect envelope format
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'schemaVersion' in parsed &&
      'data' in parsed
    ) {
      const envelope = parsed as StorageEnvelope<unknown>
      if (envelope.schemaVersion > STORAGE_SCHEMA_VERSION) {
        return {
          ok: false,
          data: [],
          key: HISTORY_KEY,
          error: `Lagret data har nyere skjema (v${envelope.schemaVersion}) enn appen (v${STORAGE_SCHEMA_VERSION}). Oppdater appen.`,
        }
      }
      if (envelope.schemaVersion < STORAGE_SCHEMA_VERSION) {
        // Eldre versjon — kjør migrering
        const migrated = migrateHistory(envelope.data, envelope.schemaVersion)
        saveHistory(migrated)
        return { ok: true, data: migrated }
      }
      return { ok: true, data: envelope.data as WorkoutRecord[] }
    }

    // Legacy bare-array format — migrate fra v0
    const migrated = migrateHistory(parsed, 0)
    saveHistory(migrated) // upgrade in place
    return { ok: true, data: migrated }
  } catch (e) {
    return { ok: false, data: [], key: HISTORY_KEY, error: String(e) }
  }
}

export function saveHistory(records: WorkoutRecord[]): void {
  if (typeof window === 'undefined') return
  const envelope: StorageEnvelope<WorkoutRecord[]> = {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    data: records,
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(envelope))
}

// ---------------------------------------------------------------------------
// Active workout (transient — no versioning needed)
// ---------------------------------------------------------------------------

export function loadActiveWorkout(): LoadResult<ActiveWorkout | null> {
  if (typeof window === 'undefined') return { ok: true, data: null }
  try {
    const raw = localStorage.getItem(ACTIVE_KEY)
    return { ok: true, data: raw ? JSON.parse(raw) : null }
  } catch (e) {
    return { ok: false, data: null, key: ACTIVE_KEY, error: String(e) }
  }
}

export function saveActiveWorkout(workout: ActiveWorkout | null): void {
  if (typeof window === 'undefined') return
  if (workout === null) {
    localStorage.removeItem(ACTIVE_KEY)
  } else {
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(workout))
  }
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export function loadSettings(): LoadResult<UserSettings> {
  const defaultSettings: UserSettings = { weightUnit: 'kg' }
  if (typeof window === 'undefined') return { ok: true, data: defaultSettings }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return { ok: true, data: raw ? JSON.parse(raw) : defaultSettings }
  } catch (e) {
    return { ok: false, data: defaultSettings, key: SETTINGS_KEY, error: String(e) }
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export function loadProfile(): LoadResult<UserProfile | null> {
  if (typeof window === 'undefined') return { ok: true, data: null }
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return { ok: true, data: raw ? JSON.parse(raw) : null }
  } catch (e) {
    return { ok: false, data: null, key: PROFILE_KEY, error: String(e) }
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

// ---------------------------------------------------------------------------
// Program cycle
// ---------------------------------------------------------------------------

export function loadCycle(): LoadResult<ProgramCycle | null> {
  if (typeof window === 'undefined') return { ok: true, data: null }
  try {
    const raw = localStorage.getItem(CYCLE_KEY)
    return { ok: true, data: raw ? JSON.parse(raw) : null }
  } catch (e) {
    return { ok: false, data: null, key: CYCLE_KEY, error: String(e) }
  }
}

export function saveCycle(cycle: ProgramCycle | null): void {
  if (typeof window === 'undefined') return
  if (cycle === null) {
    localStorage.removeItem(CYCLE_KEY)
  } else {
    localStorage.setItem(CYCLE_KEY, JSON.stringify(cycle))
  }
}
