import {
  ActiveWorkout,
  Equipment,
  Exercise,
  FocusMode,
  Muscle,
  MuscleGroup,
  WorkoutRecord,
  WorkoutExercise,
  ProgramDay,
  ALL_MUSCLE_GROUPS,
} from './types'
import { MUSCLE_INFO } from './anatomy'
import { getByMuscleGroup, getByIds } from './exercises'

const FULL_BODY_THRESHOLD_DAYS = 4

/**
 * Minimum restitusjon (dager) per fokus-modus før muskelgruppe bør trenes igjen.
 * Basert på: Helland et al. 2020 (PeerJ), Yang et al. 2018 (Frontiers in Physiology)
 *
 * Styrke (>80% 1RM, 5 sett):       48–72 timer → 2–3 dager
 * Hypertrofi (70–80% 1RM, 4 sett): 24–48 timer → 1–2 dager
 * Shred (lett-moderat, 3 sett):     24–48 timer → 1–2 dager
 */
export const RECOVERY_DAYS: Record<FocusMode, { min: number; optimal: number }> = {
  strength:    { min: 2, optimal: 3 },
  hypertrophy: { min: 1, optimal: 2 },
  shred:       { min: 1, optimal: 2 },
}

/**
 * Overkroppsmuskelgrupper restituerer raskere og responderer bedre på høy frekvens
 * enn underkropp i styrke-modus.
 * Kilde: Ralston et al. 2018 (Sports Medicine – Open), Grgic et al. 2018 (Sports Medicine)
 */
const UPPER_BODY_GROUPS = new Set<MuscleGroup>(['chest', 'back', 'shoulders', 'arms'])

/**
 * Returnerer minimumrestitusjon (dager) for en muskelgruppe gitt fokus-modus.
 * Overkropp kan trenes oftere enn underkropp i styrke-modus.
 */
export function recoveryDaysForGroup(group: MuscleGroup, focusMode: FocusMode): number {
  const base = RECOVERY_DAYS[focusMode].min
  if (focusMode === 'strength' && UPPER_BODY_GROUPS.has(group)) {
    return Math.max(1, base - 1) // Overkropp: 1 dag kortere restitusjon i styrke-modus
  }
  return base
}

// Antall øvelser per muskelgruppe i smart-genererte økter
const EXERCISES_PER_GROUP: Record<MuscleGroup, number> = {
  chest:     2,
  back:      3,
  legs:      3,
  shoulders: 2,
  arms:      2,
  core:      2,
}

// ─── Focus mode templates ───────────────────────────────────────────────────

export interface FocusModeTemplate {
  sets: number
  reps: number
  repsLabel: string
  label: string
  description: string
}

export const FOCUS_MODE_TEMPLATES: Record<FocusMode, FocusModeTemplate> = {
  strength: {
    sets: 5,
    reps: 5,
    repsLabel: '5',
    label: 'Styrke',
    description: 'Tung vekt, lave reps. Bygg maksimal kraft.',
  },
  hypertrophy: {
    sets: 4,
    reps: 10,
    repsLabel: '8-12',
    label: 'Muskelvekst',
    description: 'Moderat vekt, middels reps. Optimalt for muskelvekst.',
  },
  shred: {
    sets: 3,
    reps: 15,
    repsLabel: '15-20',
    label: 'Utholdenhet',
    description: 'Lett vekt, høye reps. Muskelutholdenhet og forbrenning.',
  },
}

// ─── Anatomi-hjelp ──────────────────────────────────────────────────────────

/** Konverterer én spesifikk muskel til sin MuscleGroup via MUSCLE_INFO */
function muscleToGroup(muscle: Muscle): MuscleGroup {
  return MUSCLE_INFO[muscle].muscleGroup
}

/**
 * Alle MuscleGroup-er en øvelse direkte belaster (via primaryMuscles).
 * Brukes til å sette muscleGroups på WorkoutRecord.
 */
function primaryGroups(exercise: Exercise): MuscleGroup[] {
  const seen = new Set<MuscleGroup>()
  for (const m of exercise.primaryMuscles) seen.add(muscleToGroup(m))
  return [...seen]
}

/**
 * Alle MuscleGroup-er en øvelse berører (primary + secondary).
 * Brukes til å unngå sekundær-muskel-overlapp ved valg.
 */
function allAffectedGroups(exercise: Exercise): MuscleGroup[] {
  const seen = new Set<MuscleGroup>()
  for (const m of exercise.primaryMuscles) seen.add(muscleToGroup(m))
  for (const m of (exercise.secondaryMusclesDetailed ?? [])) seen.add(muscleToGroup(m))
  return [...seen]
}

// ─── Restitusjon ────────────────────────────────────────────────────────────

function daysSince(date: string): number {
  return (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
}

export function getLastTrainedDates(history: WorkoutRecord[]): Record<MuscleGroup, number> {
  const result: Record<MuscleGroup, number> = {
    chest: Infinity, back: Infinity, legs: Infinity,
    shoulders: Infinity, arms: Infinity, core: Infinity,
  }
  for (const record of history) {
    const days = daysSince(record.date)
    for (const group of record.muscleGroups) {
      if (days < result[group]) result[group] = days
    }
  }
  return result
}

// ─── Øvelsesutvalg ──────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

/**
 * Velger øvelser per muskelgruppe med:
 * 1. Utstyrsfiltrering mot det brukeren har tilgjengelig
 * 2. Compound (primary) alltid før compound (secondary) før isolation
 * 3. Sekundær-muskel-overlapp minimeres (clean picks prioriteres)
 */
interface PickedExercise {
  id: string
  equipmentMismatch: boolean
}

function pickExercises(
  muscleGroups: MuscleGroup[],
  count: (g: MuscleGroup) => number,
  availableEquipment?: Equipment[],
): PickedExercise[] {
  const picked: PickedExercise[] = []
  const sessionGroups = new Set<MuscleGroup>(muscleGroups)

  for (const group of muscleGroups) {
    let pool = getByMuscleGroup(group)
    let usingFallback = false

    // 1. Filtrer på utstyr (kun hvis bruker har satt preferanser)
    if (availableEquipment && availableEquipment.length > 0) {
      const filtered = pool.filter(e =>
        e.equipmentTypes.some(eq => availableEquipment.includes(eq))
      )
      if (filtered.length > 0) {
        pool = filtered
      } else {
        // Fallback: behold originalt utvalg om filtrering fjernet alt
        usingFallback = true
      }
    }

    // 2. Del opp i tier-grupper og stokk innad i hver tier
    const byTier = {
      compound_primary:   shuffle(pool.filter(e => e.tier === 'compound_primary')),
      compound_secondary: shuffle(pool.filter(e => e.tier === 'compound_secondary')),
      isolation:          shuffle(pool.filter(e => e.tier === 'isolation')),
    }

    // 3. Innad i hver tier: prioriter øvelser uten sekundær-muskel-overlapp
    function preferClean(exercises: Exercise[]): Exercise[] {
      const clean   = exercises.filter(e => !allAffectedGroups(e).some(g => g !== group && sessionGroups.has(g)))
      const overlap = exercises.filter(e =>  allAffectedGroups(e).some(g => g !== group && sessionGroups.has(g)))
      return [...clean, ...overlap]
    }

    const ordered = [
      ...preferClean(byTier.compound_primary),
      ...preferClean(byTier.compound_secondary),
      ...preferClean(byTier.isolation),
    ]

    const selected = ordered.slice(0, count(group))
    for (const ex of selected) {
      const hasEquipmentMatch = !availableEquipment || availableEquipment.length === 0
        || ex.equipmentTypes.some(eq => availableEquipment.includes(eq))
      picked.push({ id: ex.id, equipmentMismatch: !hasEquipmentMatch || usingFallback })
    }
  }

  return picked
}

// ─── Hviletid mellom sett ────────────────────────────────────────────────────

/**
 * Anbefalt hviletid (sekunder) mellom sett basert på fokus-modus og alder.
 * Kilde: De Salles et al. 2009 (Sports Medicine) — systematisk gjennomgang av 35 studier.
 *
 * Styrke (50–90% 1RM):        3–5 min → median 4 min (240 sek)
 *   – Nødvendig for å opprettholde reps og intensitet over multiple sett
 *
 * Hypertrofi (moderat int.):  30–60 sek → median 45 sek
 *   – Kort pause gir høyere akutt GH-respons og stimulerer hypertrofi-signalveier
 *
 * Shred / muskelutholdenhet:  20 sek–1 min → median 40 sek
 *   – Korte pauser gir høyere oksygenforbruk og bedre utholdenhetsadaptasjon
 *
 * Alder (50+):                gradert +5 sek per år over 50, maks +60 sek
 *   – Eldre trenger lengre restitusjon mellom sett (De Salles et al. 2009, avsnitt 4)
 *   – Gradert kurve fra 50 år (ikke hard cutoff ved 60)
 */
export function restTimeForFocusMode(focusMode: FocusMode, age?: number): number {
  const base: Record<FocusMode, number> = {
    strength:    240, // 4 min — median av 3–5 min
    hypertrophy:  45, // 45 sek — median av 30–60 sek
    shred:        40, // 40 sek — median av 20–60 sek
  }
  const rest = base[focusMode]
  if (!age) return rest
  // Gradert: +5 sek per år over 50, maks +60 sek totalt
  const extraPerYear = Math.max(0, age - 50) * 5
  return rest + Math.min(60, extraPerYear)
}

// ─── Standard fokusmodus fra brukermål ──────────────────────────────────────

/**
 * Returnerer anbefalt fokusmodus basert på brukerens valgte mål.
 * Brukes for å forhåndsvelge riktig modus i fokusvelger-sheets.
 */
export function defaultFocusMode(goal: import('./types').UserGoal): FocusMode {
  const map: Record<import('./types').UserGoal, FocusMode> = {
    get_stronger:    'strength',
    build_muscle:    'hypertrophy',
    lose_fat:        'shred',
    improve_fitness: 'shred',
    general_health:  'shred',
  }
  return map[goal] ?? 'hypertrophy'
}

// ─── Bygg WorkoutExercise-liste ─────────────────────────────────────────────

function buildWorkoutExercises(
  exercises: PickedExercise[] | string[],
  focusMode: FocusMode,
  age?: number,
): WorkoutExercise[] {
  const template = FOCUS_MODE_TEMPLATES[focusMode]
  const recommendedRestSec = restTimeForFocusMode(focusMode, age)
  const normalized: PickedExercise[] = exercises.map(e =>
    typeof e === 'string' ? { id: e, equipmentMismatch: false } : e
  )
  // Ungdom under 18: reduser sett med 25% for å unngå for høyt volum
  const isYouth = age !== undefined && age < 18
  const setsCount = isYouth ? Math.max(2, Math.floor(template.sets * 0.75)) : template.sets

  return normalized.map(({ id, equipmentMismatch }) => ({
    exerciseId: id,
    recommendedRestSec,
    equipmentMismatch: equipmentMismatch || undefined,
    sets: Array.from({ length: setsCount }, () => ({
      reps: template.reps,
      weight: 0,
      completed: false,
    })),
  }))
}

// ─── Navn på økt ────────────────────────────────────────────────────────────

function formatWorkoutName(muscleGroups: MuscleGroup[], focusMode: FocusMode): string {
  const modeLabel = FOCUS_MODE_TEMPLATES[focusMode].label
  if (muscleGroups.length >= 5) return `Totaltrening – ${modeLabel}`

  const labels: Record<MuscleGroup, string> = {
    chest: 'Bryst', back: 'Rygg', legs: 'Ben',
    shoulders: 'Skuldre', arms: 'Armer', core: 'Core',
  }

  return muscleGroups.slice(0, 3).map(g => labels[g]).join(' + ') + ` – ${modeLabel}`
}

// ─── Offentlige funksjoner ───────────────────────────────────────────────────

/**
 * Genererer en smart økt basert på:
 * - Restitusjonsstatus per muskelgruppe (hvem som trenger trening mest)
 * - Tilgjengelig utstyr (UserProfile.equipment)
 * - Compound-før-isolation-prinsippet
 * - Sekundær-muskel-overlapp minimering
 */
export function generateSmartWorkout(
  history: WorkoutRecord[],
  focusMode: FocusMode,
  availableEquipment?: Equipment[],
  age?: number,
): ActiveWorkout {
  const lastTrained = getLastTrainedDates(history)

  // >4 dager siden siste trening → full kropp
  const minDaysSinceAny = Math.min(...Object.values(lastTrained))
  const isFullyRested = minDaysSinceAny > FULL_BODY_THRESHOLD_DAYS

  let muscleGroups: MuscleGroup[]

  if (isFullyRested || history.length === 0) {
    muscleGroups = ALL_MUSCLE_GROUPS
  } else {
    // Filtrer muskelgrupper som har restituert nok for dette fokuset.
    // Overkropp restituerer raskere enn underkropp i styrke-modus (Ralston 2018).
    const readyGroups = ALL_MUSCLE_GROUPS.filter(
      g => lastTrained[g] >= recoveryDaysForGroup(g, focusMode)
    )

    if (readyGroups.length < 2) {
      // Ikke nok restituerte grupper — velg de som har hvilt lengst
      const sorted = [...ALL_MUSCLE_GROUPS].sort((a, b) => lastTrained[b] - lastTrained[a])
      muscleGroups = sorted.slice(0, 3)
    } else {
      // Prioriter de restituerte gruppene som har hvilt lengst
      const sorted = readyGroups.sort((a, b) => lastTrained[b] - lastTrained[a])
      muscleGroups = sorted.slice(0, 4)
    }
  }

  const pickedExercises = pickExercises(
    muscleGroups,
    g => EXERCISES_PER_GROUP[g],
    availableEquipment,
  )
  const exercises = buildWorkoutExercises(pickedExercises, focusMode, age)

  return {
    name: formatWorkoutName(muscleGroups, focusMode),
    focusMode,
    muscleGroups,
    exercises,
    startedAt: new Date().toISOString(),
  }
}

/**
 * Genererer en økt fra et ferdig program.
 * Bruker programmets faste øvelseliste, men tilpasser sett/reps til focusMode.
 */
export function generateProgramWorkout(
  programDay: ProgramDay,
  focusMode: FocusMode,
  age?: number,
): ActiveWorkout {
  const exercises = buildWorkoutExercises(programDay.exerciseIds, focusMode, age)

  return {
    name: `${programDay.label} – ${FOCUS_MODE_TEMPLATES[focusMode].label}`,
    focusMode,
    muscleGroups: programDay.muscleGroups,
    exercises,
    startedAt: new Date().toISOString(),
  }
}

// ─── Restitusjonsstatus for UI ────────────────────────────────────────────────

export function getRecoveryStatus(
  days: number,
  focusMode?: FocusMode,
  group?: MuscleGroup,
): {
  label: string
  color: string
  bgColor: string
  textColor: string
  isReady: boolean
} {
  const minRecovery = focusMode && group
    ? recoveryDaysForGroup(group, focusMode)
    : focusMode ? RECOVERY_DAYS[focusMode].min : 1
  const optimalRecovery = focusMode ? RECOVERY_DAYS[focusMode].optimal : 2

  if (days === Infinity) return { label: 'Ikke trent',    color: 'gray',   bgColor: 'bg-gray-100',   textColor: 'text-gray-500',   isReady: true  }
  if (days < 1)          return { label: 'Trent i dag',   color: 'red',    bgColor: 'bg-red-100',    textColor: 'text-red-600',    isReady: false }
  if (days < minRecovery)    return { label: `${Math.floor(days * 24)}t siden`,           color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-600', isReady: false }
  if (days < optimalRecovery) return { label: `${Math.floor(days)} dag${Math.floor(days) > 1 ? 'er' : ''} siden`, color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-600', isReady: true  }
  if (days < 4)          return { label: `${Math.floor(days)} dager siden`, color: 'lime',   bgColor: 'bg-lime-100',   textColor: 'text-lime-600',   isReady: true  }
  return                        { label: `${Math.floor(days)} dager siden`, color: 'green',  bgColor: 'bg-green-100',  textColor: 'text-green-600',  isReady: true  }
}
