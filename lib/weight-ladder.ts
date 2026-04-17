/**
 * Vekttrinn per utstyrstype — definerer hvilke vekter som faktisk finnes i en standard norsk treningssenter.
 *
 * Logikk:
 *  - Manualer:    Fast stige med varierende intervaller (tettere i lavt område, større høyt)
 *  - Vektstang:   Minste økning er 2,5 kg (ett 1,25 kg-vektskive på hver side)
 *  - Kabel:       Vektstakk typisk i 2,5 kg steg (noen maskiner 5 kg)
 *  - Maskin:      Vektstakk i 5 kg steg
 *  - Kettlebell:  Fast stige — kompetisjonsstandarder (4 kg intervaller)
 *  - Kroppsvekt:  Ingen vektjustering — bruk vanskelighetsgrad-progresjon
 */

import { Equipment } from './types'

// ─── Faste stiger ────────────────────────────────────────────────────────────

/**
 * Manualstigen – faktiske vekter tilgjengelig i norske treningssentre.
 * Kilde: Brukerens spesifikasjon + standard norsk treningssenter-utstyr
 */
const DUMBBELL_LADDER: number[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  12, 14, 16, 18, 20,
  22.5, 25, 27.5, 30,
  32.5, 35, 37.5, 40,
  42.5, 45, 47.5, 50,
  55, 60, 65, 70,
]

/**
 * Kettlebell-stigen – kompetisjonsstandarder (IUKL/WKC).
 * 4 kg intervaller fra 8 til 48 kg, deretter 8 kg (de fleste gymmer slutter på 48).
 */
const KETTLEBELL_LADDER: number[] = [
  8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48,
]

// ─── Hjelpe-funksjoner ───────────────────────────────────────────────────────

/** Finner nærmeste verdi i en stige til et gitt tall */
function closestInLadder(ladder: number[], value: number): number {
  return ladder.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  )
}

/**
 * Neste steg oppover i en fast stige.
 * Dersom current er over stigens siste verdi, legges siste intervall til.
 */
function stepUp(ladder: number[], current: number): number {
  const closest = closestInLadder(ladder, current)
  const idx = ladder.indexOf(closest)
  if (idx === -1 || idx >= ladder.length - 1) {
    // Over stigen — bruk siste intervall som steg
    const lastInterval = ladder[ladder.length - 1] - ladder[ladder.length - 2]
    return current + lastInterval
  }
  // Hvis current er mellom to steg, gå til neste over current
  if (current < ladder[idx]) return ladder[idx]
  return ladder[idx + 1]
}

/**
 * Neste steg nedover i en fast stige.
 * Dersom current er under stigens første verdi, returneres første verdi.
 */
function stepDown(ladder: number[], current: number): number {
  const closest = closestInLadder(ladder, current)
  const idx = ladder.indexOf(closest)
  if (idx <= 0) return ladder[0]
  // Hvis current er mellom to steg, gå til nærmeste under current
  if (current > ladder[idx]) return ladder[idx]
  return ladder[idx - 1]
}

/**
 * Steg med fast increment — for vektstang og kabel.
 * Runder av til nærmeste multiplum av increment.
 *
 * Gulvet (min) brukes kun når current allerede er >= min.
 * Hvis brukeren er på 15 kg med en lettere stang, skal 17,5 være gyldig
 * selv om standard stangvekt er 20 kg.
 */
function stepFixed(current: number, increment: number, direction: 'up' | 'down', min = 0): number {
  const stepped = direction === 'up'
    ? current + increment
    : current - increment
  const rounded = Math.round(stepped / increment) * increment
  // Bare bruk gulvet hvis vi starter fra et sted >= gulvet
  const floor = current >= min ? min : 0
  return Math.max(floor, rounded)
}

// ─── Offentlig API ───────────────────────────────────────────────────────────

export type WeightDirection = 'up' | 'down'

export interface WeightStep {
  weight: number
  delta: number           // Faktisk endring fra current
  impossible: boolean     // true hvis ikke mulig å justere (kroppsvekt)
}

/**
 * Beregner neste anbefalt vekt basert på utstyrstype og tilbakemelding.
 *
 * @param current     Nåværende vekt i kg
 * @param equipment   Utstyrstype fra Exercise.equipmentTypes[0]
 * @param direction   'up' = for lett, 'down' = for tung
 */
export function nextWeight(
  current: number,
  equipment: Equipment,
  direction: WeightDirection,
): WeightStep {
  let weight: number

  switch (equipment) {
    case 'dumbbell':
      weight = direction === 'up'
        ? stepUp(DUMBBELL_LADDER, current)
        : stepDown(DUMBBELL_LADDER, current)
      break

    case 'barbell':
      // Minste skive er 1,25 kg × 2 = 2,5 kg økning. Stangvekt: 20 kg minimum.
      weight = stepFixed(current, 2.5, direction, 20)
      break

    case 'cable':
      // Vektstakk typisk 2,5 kg steg (noen er 5 kg — 2,5 er sikreste antagelse)
      weight = stepFixed(current, 2.5, direction, 2.5)
      break

    case 'machine':
      // Maskinvektstakk typisk 5 kg steg
      weight = stepFixed(current, 5, direction, 5)
      break

    case 'kettlebell':
      weight = direction === 'up'
        ? stepUp(KETTLEBELL_LADDER, current)
        : stepDown(KETTLEBELL_LADDER, current)
      break

    case 'bodyweight':
      // Ingen vektjustering — treneren må bytte til hardere/lettere variasjon
      return { weight: current, delta: 0, impossible: true }

    default:
      weight = stepFixed(current, 2.5, direction, 0)
  }

  return {
    weight,
    delta: weight - current,
    impossible: false,
  }
}

/**
 * Henter primærutstyr fra en øvelses utstyrsliste.
 * Prioriterer barbell > dumbbell > machine > cable > kettlebell > bodyweight.
 */
export function primaryEquipment(equipmentTypes: Equipment[]): Equipment {
  const priority: Equipment[] = ['barbell', 'dumbbell', 'machine', 'cable', 'kettlebell', 'bodyweight']
  for (const eq of priority) {
    if (equipmentTypes.includes(eq)) return eq
  }
  return equipmentTypes[0] ?? 'bodyweight'
}

/** Formatert delta-streng for UI, f.eks. "+2,5 kg" eller "−5 kg" */
export function formatDelta(delta: number): string {
  if (delta === 0) return '±0'
  const sign = delta > 0 ? '+' : '−'
  return `${sign}${Math.abs(delta)} kg`
}
