import { WorkoutRecord, LoggedSet, SetFeedback, FocusMode, ExerciseTier } from './types'
import { findSimilarExercises, getById } from './exercises'

/**
 * Estimert 1RM med formel valgt basert på rep-antall:
 * - ≤ 15 reps: Epley   — weight × (1 + reps / 30)
 * - > 15 reps: Brzycki — weight × 36 / (37 − reps)
 *
 * Brzycki er mer nøyaktig ved høye reps; Epley ved lave-middels reps.
 * Brzycki er udefinert ved reps ≥ 37 — returnerer 0.
 */
export function calcE1rm(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0
  if (reps === 1) return weight
  if (reps > 15) {
    if (reps >= 37) return 0
    return Math.round(weight * 36 / (37 - reps))
  }
  return Math.round(weight * (1 + reps / 30))
}

/** Best e1RM across all completed sets for an exercise in a workout */
export function bestE1rmForExercise(
  history: WorkoutRecord[],
  exerciseId: string
): { e1rm: number; date: string }[] {
  return history
    .map((rec) => {
      const ex = rec.exercises.find((e) => e.exerciseId === exerciseId)
      if (!ex) return null
      const best = ex.sets
        .filter((s) => s.completed && s.weight > 0)
        .reduce((max, s) => {
          const e = calcE1rm(s.weight, s.reps)
          return e > max ? e : max
        }, 0)
      return best > 0 ? { e1rm: best, date: rec.date } : null
    })
    .filter(Boolean) as { e1rm: number; date: string }[]
}

/** Total weekly volume (sets × reps × weight) for the current week */
export function weeklyVolume(history: WorkoutRecord[]): number {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  return history
    .filter((r) => new Date(r.date) >= startOfWeek)
    .flatMap((r) => r.exercises)
    .flatMap((e) => e.sets)
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + s.reps * s.weight, 0)
}

/** Weekly set count per muscle group for volume bar */
export function weeklySetsByMuscle(
  history: WorkoutRecord[],
  exerciseIdToMuscle: Record<string, string>
): Record<string, number> {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const counts: Record<string, number> = {}
  history
    .filter((r) => new Date(r.date) >= startOfWeek)
    .forEach((r) => {
      r.exercises.forEach((ex) => {
        const muscle = exerciseIdToMuscle[ex.exerciseId]
        if (!muscle) return
        const completed = ex.sets.filter((s) => s.completed).length
        counts[muscle] = (counts[muscle] ?? 0) + completed
      })
    })
  return counts
}

/**
 * Detect stagnation: returns true if last N e1RM values are flat.
 * Uses relative threshold (fraction of mean) instead of absolute kg,
 * so detection works correctly across all weight ranges.
 * Kilde: Hopkins 2000 — smallest worthwhile change (SWC) ≈ 0.5% per session.
 */
export function isStagnating(
  dataPoints: { e1rm: number; date: string }[],
  windowSize = 6,
  relativeThreshold = 0.003  // 0.3% av gjennomsnittlig e1RM per økt
): boolean {
  if (dataPoints.length < windowSize) return false
  const recent = dataPoints.slice(-windowSize).map((d) => d.e1rm)
  const n = recent.length
  const mean = recent.reduce((a, b) => a + b, 0) / n
  const slope =
    recent.reduce((sum, val, i) => sum + (i - (n - 1) / 2) * (val - mean), 0) /
    recent.reduce((sum, _, i) => sum + Math.pow(i - (n - 1) / 2, 2), 0)
  return Math.abs(slope) < mean * relativeThreshold
}

/** Suggest weight adjustment based on set feedback history */
export function suggestWeightAdjustment(
  lastSets: LoggedSet[]
): { delta: number; label: string } {
  const completed = lastSets.filter((s) => s.completed && s.feedback)
  if (completed.length === 0) return { delta: 0, label: '' }

  const counts = completed.reduce(
    (acc, s) => {
      acc[s.feedback!] = (acc[s.feedback!] ?? 0) + 1
      return acc
    },
    {} as Record<SetFeedback, number>
  )

  const total = completed.length
  const easyRatio = (counts.too_easy ?? 0) / total
  const hardRatio = (counts.too_hard ?? 0) / total

  if (easyRatio > 0.6) return { delta: 2.5, label: 'Øk vekt med 2,5 kg neste gang' }
  if (hardRatio > 0.6) return { delta: -2.5, label: 'Reduser vekt med 2,5 kg neste gang' }
  return { delta: 0, label: 'Passer bra – hold vekten' }
}

/**
 * Vektanbefaling basert på e1RM fra denne eller lignende øvelser.
 *
 * Steg:
 *  1. Finn beste e1RM fra brukerens egen historikk for øvelsen
 *  2. Hvis ingen historikk: finn lignende øvelser (samme movementPattern + muskler)
 *     og bruk beste e1RM derfra, justert for tier-forskjell
 *  3. Gang e1RM med intensitetsfaktor for fokus-modus → anbefalt treningsvekt
 *
 * Tier-faktor (relativ styrke per tier):
 *   compound_primary   1.00  (tyngst — knebøy, benkpress, markløft)
 *   compound_secondary 0.85  (lettere flerledds — lunges, dips, kabelroing)
 *   isolation          0.65  (isolasjon — curl, fly, extension)
 *
 * Intensitetsfaktor per fokus-modus (andel av 1RM):
 *   strength    0.85  (85% av 1RM — tung, 3–6 reps)
 *   hypertrophy 0.70  (70% av 1RM — moderat, 8–12 reps)
 *   shred       0.60  (60% av 1RM — lett, 15–20 reps)
 */

const TIER_FACTOR: Record<ExerciseTier, number> = {
  compound_primary:   1.00,
  compound_secondary: 0.85,
  isolation:          0.65,
}

const INTENSITY_FACTOR: Record<FocusMode, number> = {
  strength:    0.85,
  hypertrophy: 0.70,
  shred:       0.60,
}

export interface WeightSuggestion {
  weight: number          // Anbefalt vekt i kg, rundet til nærmeste 2,5
  e1rm: number            // e1RM som danner grunnlaget
  source: 'own' | 'similar'
  sourceExerciseName?: string  // Navn på kildeøvelsen hvis 'similar'
}

export function suggestWeightForExercise(
  exerciseId: string,
  history: WorkoutRecord[],
  focusMode: FocusMode,
): WeightSuggestion | null {
  const targetExercise = getById(exerciseId)
  if (!targetExercise) return null

  const intensityFactor = INTENSITY_FACTOR[focusMode]

  // 1. Prøv egen historikk
  const ownData = bestE1rmForExercise(history, exerciseId)
  if (ownData.length > 0) {
    const best = Math.max(...ownData.map(d => d.e1rm))
    const raw = best * intensityFactor
    return {
      weight: Math.round(raw / 2.5) * 2.5,
      e1rm: best,
      source: 'own',
    }
  }

  // 2. Finn lignende øvelser med historikk
  const similar = findSimilarExercises(exerciseId)
  for (const sim of similar) {
    const simData = bestE1rmForExercise(history, sim.id)
    if (simData.length === 0) continue

    const simBest = Math.max(...simData.map(d => d.e1rm))
    // Juster e1RM for tier-forskjell mellom kildeøvelse og måløvelse
    const adjustedE1rm = simBest * (TIER_FACTOR[targetExercise.tier] / TIER_FACTOR[sim.tier])
    const raw = adjustedE1rm * intensityFactor
    return {
      weight: Math.round(raw / 2.5) * 2.5,
      e1rm: Math.round(adjustedE1rm),
      source: 'similar',
      sourceExerciseName: sim.name,
    }
  }

  return null
}

/**
 * Returnerer antall dager igjen til ACWR-beregning blir tilgjengelig (krever 21 dager).
 * Returnerer null hvis nok data allerede finnes.
 */
export function acwrDaysRemaining(history: WorkoutRecord[]): number | null {
  if (history.length === 0) return 21
  const oldest = Math.min(...history.map(r => new Date(r.date).getTime()))
  const daysSince = (Date.now() - oldest) / 86400000
  return daysSince >= 21 ? null : Math.ceil(21 - daysSince)
}

/**
 * Acute:Chronic workload ratio (7-day vs 28-day rolling average of tonnage).
 * Returns null if the oldest record is less than 21 days ago — not enough
 * chronic data to produce a meaningful ratio.
 */
export function acuteChronicRatio(history: WorkoutRecord[]): number | null {
  const now = Date.now()
  const day = 86400000

  if (history.length === 0) return null
  const oldestDate = Math.min(...history.map((r) => new Date(r.date).getTime()))
  if (now - oldestDate < 21 * day) return null

  const tonnage = (days: number) => {
    const cutoff = new Date(now - days * day)
    return history
      .filter((r) => new Date(r.date) >= cutoff)
      .flatMap((r) => r.exercises)
      .flatMap((e) => e.sets)
      .filter((s) => s.completed)
      .reduce((sum, s) => sum + s.reps * s.weight, 0)
  }

  const acute = tonnage(7)
  const chronic = tonnage(28) / 4

  if (chronic === 0) return 0
  return acute / chronic
}

// ─── RPE-basert autoregulering ───────────────────────────────────────────────

export interface RpeSuggestion {
  direction: 'increase' | 'decrease' | 'maintain'
  label: string
  avgRpe: number
}

/**
 * Genererer vektanbefaling for neste økt basert på gjennomsnittlig RPE fra siste sett.
 * RPE 9.5+: vekten er for tung — reduser neste økt.
 * RPE 7.0–: vekten er for lett — øk neste økt.
 * RPE 7.0–9.4: passe intensitet — behold vekten.
 *
 * Kilde: Zourdos et al. 2016 (JSCR) — RPE-basert autoregulering i styrketrening.
 */
export function rpeBasedWeightSuggestion(lastSets: LoggedSet[]): RpeSuggestion | null {
  const withRpe = lastSets.filter(s => s.completed && s.rpe !== undefined)
  if (withRpe.length === 0) return null
  const avg = withRpe.reduce((sum, s) => sum + s.rpe!, 0) / withRpe.length
  if (avg >= 9.5) return { direction: 'decrease', label: `Snitt RPE ${avg.toFixed(1)} — reduser vekt neste økt`, avgRpe: avg }
  if (avg <= 7.0) return { direction: 'increase', label: `Snitt RPE ${avg.toFixed(1)} — øk vekt neste økt`, avgRpe: avg }
  return { direction: 'maintain', label: `Snitt RPE ${avg.toFixed(1)} — bra intensitet`, avgRpe: avg }
}
