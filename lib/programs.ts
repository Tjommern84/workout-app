import { Program } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// 1 DAY – Full kropp (kompakt)
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAM_1: Program = {
  id: '1-day-fullbody',
  name: '1 dag – Full kropp',
  description: 'Én effektiv økt per uke. Alle store bevegelsesmønstre dekkes i en enkelt sesjon.',
  days: [
    {
      label: 'Full kropp',
      muscleGroups: ['legs', 'back', 'chest', 'shoulders', 'core'],
      exerciseIds: ['deadlift', 'goblet-squat', 'bench-press', 'bent-over-row', 'overhead-press', 'plank'],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 2 DAYS – Upper / Lower
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAM_2: Program = {
  id: '2-day-upper-lower',
  name: '2 dager – Upper / Lower',
  description: 'Overkropp og underkropp annenhver økt. Enkel og effektiv for to treningsdager.',
  days: [
    {
      label: 'Overkropp',
      muscleGroups: ['chest', 'back', 'shoulders', 'arms'],
      exerciseIds: ['bench-press', 'bent-over-row', 'overhead-press', 'pull-up', 'dumbbell-curl', 'triceps-pushdown'],
    },
    {
      label: 'Underkropp',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['back-squat', 'deadlift', 'lunge', 'hip-thrust', 'calf-raise', 'plank'],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 3 DAYS – Push / Pull / Legs
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAM_3: Program = {
  id: '3-day-ppl',
  name: '3 dager – Push / Pull / Legs',
  description: 'Klassisk treningssplitt. Push = press, Pull = trekk, Legs = ben og seter.',
  days: [
    {
      label: 'Push – Bryst, Skuldre, Triceps',
      labelFriendly: 'Pressedag – øvre kropp fremside',
      muscleGroups: ['chest', 'shoulders', 'arms'],
      exerciseIds: ['bench-press', 'overhead-press', 'incline-bench-press', 'lateral-raise', 'triceps-pushdown', 'skull-crushers'],
    },
    {
      label: 'Pull – Rygg, Biceps',
      labelFriendly: 'Trekkdag – øvre kropp bakside',
      muscleGroups: ['back', 'arms'],
      exerciseIds: ['deadlift', 'bent-over-row', 'lat-pulldown', 'face-pull', 'barbell-curl', 'hammer-curl'],
    },
    {
      label: 'Legs – Ben og Seter',
      labelFriendly: 'Bendag – underkropp og seter',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['back-squat', 'romanian-deadlift', 'bulgarian-split-squat', 'hip-thrust', 'leg-extension', 'calf-raise'],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 4 DAYS – Upper / Lower x2
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAM_4: Program = {
  id: '4-day-upper-lower',
  name: '4 dager – Upper / Lower x2',
  description: 'Overkropp og underkropp trenes to ganger per uke. God balanse mellom volum og hvile.',
  days: [
    {
      label: 'Overkropp A – Styrke',
      muscleGroups: ['chest', 'back', 'shoulders'],
      exerciseIds: ['bench-press', 'bent-over-row', 'overhead-press', 'pull-up', 'lateral-raise'],
    },
    {
      label: 'Underkropp A – Styrke',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['back-squat', 'deadlift', 'romanian-deadlift', 'calf-raise', 'plank'],
    },
    {
      label: 'Overkropp B – Volum',
      muscleGroups: ['chest', 'back', 'arms'],
      exerciseIds: ['incline-bench-press', 'cable-row', 'dumbbell-bench-press', 'dumbbell-curl', 'triceps-pushdown'],
    },
    {
      label: 'Underkropp B – Volum',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['bulgarian-split-squat', 'hip-thrust', 'leg-extension', 'lying-leg-curl', 'leg-raises'],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 5 DAYS – 5-delt splitt
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAM_5: Program = {
  id: '5-day-split',
  name: '5 dager – 5-delt splitt',
  description: 'Én muskelgruppe per dag. Høyt fokusert volum. Krev god søvn og ernæring.',
  days: [
    {
      label: 'Bryst',
      muscleGroups: ['chest'],
      exerciseIds: ['bench-press', 'incline-bench-press', 'dumbbell-bench-press', 'dumbbell-chest-fly', 'chest-dip'],
    },
    {
      label: 'Rygg',
      muscleGroups: ['back'],
      exerciseIds: ['deadlift', 'bent-over-row', 'lat-pulldown', 'cable-row', 'face-pull', 'pull-up'],
    },
    {
      label: 'Ben',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['back-squat', 'leg-press', 'romanian-deadlift', 'hip-thrust', 'leg-extension', 'lying-leg-curl', 'calf-raise'],
    },
    {
      label: 'Skuldre',
      muscleGroups: ['shoulders'],
      exerciseIds: ['overhead-press', 'lateral-raise', 'front-raise', 'rear-delt-fly', 'upright-row'],
    },
    {
      label: 'Armer',
      muscleGroups: ['arms', 'core'],
      exerciseIds: ['barbell-curl', 'hammer-curl', 'preacher-curl', 'triceps-pushdown', 'skull-crushers', 'overhead-triceps-extension'],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 6 DAYS – Push / Pull / Legs x2
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAM_6: Program = {
  id: '6-day-ppl',
  name: '6 dager – Push / Pull / Legs x2',
  description: 'PPL med to runder per uke. A-øktene fokuserer på styrke, B-øktene på volum.',
  days: [
    {
      label: 'Push A – Styrke',
      muscleGroups: ['chest', 'shoulders', 'arms'],
      exerciseIds: ['bench-press', 'overhead-press', 'incline-bench-press', 'lateral-raise', 'triceps-pushdown'],
    },
    {
      label: 'Pull A – Styrke',
      muscleGroups: ['back', 'arms'],
      exerciseIds: ['deadlift', 'bent-over-row', 'lat-pulldown', 'face-pull', 'barbell-curl'],
    },
    {
      label: 'Legs A – Styrke',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['back-squat', 'hip-thrust', 'romanian-deadlift', 'leg-extension', 'calf-raise'],
    },
    {
      label: 'Push B – Volum',
      muscleGroups: ['chest', 'shoulders', 'arms'],
      exerciseIds: ['dumbbell-bench-press', 'dumbbell-shoulder-press', 'cable-chest-fly', 'rear-delt-fly', 'skull-crushers'],
    },
    {
      label: 'Pull B – Volum',
      muscleGroups: ['back', 'arms'],
      exerciseIds: ['cable-row', 'chin-up', 'chest-supported-row', 'hammer-curl', 'straight-arm-pulldown'],
    },
    {
      label: 'Legs B – Volum',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['front-squat', 'bulgarian-split-squat', 'lying-leg-curl', 'hip-abduction', 'plank'],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 7 DAYS – Arnold-splitt + aktiv hvile
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAM_7: Program = {
  id: '7-day-arnold',
  name: '7 dager – Arnold-splitt',
  description: 'Bryst+Rygg, Skuldre+Armer og Ben trenes to ganger. Dag 7 er aktiv restitusjon.',
  days: [
    {
      label: 'Bryst + Rygg A',
      muscleGroups: ['chest', 'back'],
      exerciseIds: ['bench-press', 'bent-over-row', 'incline-bench-press', 'pull-up', 'dumbbell-chest-fly'],
    },
    {
      label: 'Skuldre + Armer A',
      muscleGroups: ['shoulders', 'arms'],
      exerciseIds: ['overhead-press', 'barbell-curl', 'lateral-raise', 'triceps-pushdown', 'hammer-curl'],
    },
    {
      label: 'Ben A',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['back-squat', 'romanian-deadlift', 'hip-thrust', 'leg-extension', 'calf-raise'],
    },
    {
      label: 'Bryst + Rygg B',
      muscleGroups: ['chest', 'back'],
      exerciseIds: ['dumbbell-bench-press', 'cable-row', 'cable-chest-fly', 'lat-pulldown', 'face-pull'],
    },
    {
      label: 'Skuldre + Armer B',
      muscleGroups: ['shoulders', 'arms'],
      exerciseIds: ['dumbbell-shoulder-press', 'preacher-curl', 'rear-delt-fly', 'skull-crushers', 'front-raise'],
    },
    {
      label: 'Ben B',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['front-squat', 'bulgarian-split-squat', 'lying-leg-curl', 'hip-abduction', 'leg-raises'],
    },
    {
      label: 'Aktiv restitusjon – Core',
      muscleGroups: ['core'],
      exerciseIds: ['plank', 'side-plank', 'dead-bug', 'russian-twist', 'ab-wheel', 'back-extension'],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 8 DAYS – 4-delt x2 (8-dagers syklus)
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAM_8: Program = {
  id: '8-day-split',
  name: '8-dagers syklus – 4-delt x2',
  description: 'Fire muskelgruppe-par trenes to ganger i en 8-dagers rullerende syklus.',
  days: [
    {
      label: 'Bryst + Triceps A',
      muscleGroups: ['chest', 'arms'],
      exerciseIds: ['bench-press', 'incline-bench-press', 'dumbbell-chest-fly', 'chest-dip', 'triceps-pushdown', 'skull-crushers'],
    },
    {
      label: 'Rygg + Biceps A',
      muscleGroups: ['back', 'arms'],
      exerciseIds: ['deadlift', 'bent-over-row', 'lat-pulldown', 'cable-row', 'barbell-curl', 'hammer-curl'],
    },
    {
      label: 'Ben A',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['back-squat', 'leg-press', 'romanian-deadlift', 'hip-thrust', 'leg-extension', 'lying-leg-curl', 'calf-raise'],
    },
    {
      label: 'Skuldre + Core A',
      muscleGroups: ['shoulders', 'core'],
      exerciseIds: ['overhead-press', 'lateral-raise', 'rear-delt-fly', 'face-pull', 'plank', 'leg-raises'],
    },
    {
      label: 'Bryst + Triceps B',
      muscleGroups: ['chest', 'arms'],
      exerciseIds: ['dumbbell-bench-press', 'cable-chest-fly', 'incline-bench-press', 'overhead-triceps-extension', 'triceps-dip'],
    },
    {
      label: 'Rygg + Biceps B',
      muscleGroups: ['back', 'arms'],
      exerciseIds: ['sumo-deadlift', 'dumbbell-row', 'pull-up', 'face-pull', 'preacher-curl', 'cable-curl'],
    },
    {
      label: 'Ben B',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['front-squat', 'bulgarian-split-squat', 'hip-abduction', 'lying-leg-curl', 'calf-raise', 'plank'],
    },
    {
      label: 'Skuldre + Core B',
      muscleGroups: ['shoulders', 'core'],
      exerciseIds: ['dumbbell-shoulder-press', 'upright-row', 'lateral-raise', 'cable-crunch', 'ab-wheel'],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 9 DAYS – Push / Pull / Legs x3 (9-dagers syklus)
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAM_9: Program = {
  id: '9-day-ppl3',
  name: '9-dagers syklus – Push / Pull / Legs x3',
  description: 'PPL tre ganger i en 9-dagers syklus. A, B og C-varianter for maksimal variasjon.',
  days: [
    {
      label: 'Push A',
      muscleGroups: ['chest', 'shoulders', 'arms'],
      exerciseIds: ['bench-press', 'overhead-press', 'incline-bench-press', 'lateral-raise', 'triceps-pushdown'],
    },
    {
      label: 'Pull A',
      muscleGroups: ['back', 'arms'],
      exerciseIds: ['deadlift', 'bent-over-row', 'lat-pulldown', 'face-pull', 'barbell-curl'],
    },
    {
      label: 'Legs A',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['back-squat', 'hip-thrust', 'romanian-deadlift', 'leg-extension', 'calf-raise'],
    },
    {
      label: 'Push B',
      muscleGroups: ['chest', 'shoulders', 'arms'],
      exerciseIds: ['dumbbell-bench-press', 'dumbbell-shoulder-press', 'dumbbell-chest-fly', 'rear-delt-fly', 'skull-crushers'],
    },
    {
      label: 'Pull B',
      muscleGroups: ['back', 'arms'],
      exerciseIds: ['cable-row', 'chin-up', 'chest-supported-row', 'hammer-curl', 'straight-arm-pulldown'],
    },
    {
      label: 'Legs B',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['front-squat', 'bulgarian-split-squat', 'lying-leg-curl', 'hip-abduction', 'plank'],
    },
    {
      label: 'Push C',
      muscleGroups: ['chest', 'shoulders', 'arms'],
      exerciseIds: ['chest-dip', 'arnold-press', 'cable-chest-fly', 'upright-row', 'overhead-triceps-extension'],
    },
    {
      label: 'Pull C',
      muscleGroups: ['back', 'arms'],
      exerciseIds: ['sumo-deadlift', 'dumbbell-row', 'narrow-lat-pulldown', 'face-pull', 'preacher-curl'],
    },
    {
      label: 'Legs C',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['lunge', 'single-leg-romanian-deadlift', 'hip-thrust', 'leg-extension', 'calf-raise'],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// 10 DAYS – 5-delt x2 (10-dagers syklus)
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAM_10: Program = {
  id: '10-day-split',
  name: '10-dagers syklus – 5-delt x2',
  description: 'Alle muskelgrupper trenes to ganger i en 10-dagers syklus. Maksimalt volum.',
  days: [
    {
      label: 'Bryst A',
      muscleGroups: ['chest'],
      exerciseIds: ['bench-press', 'incline-bench-press', 'dumbbell-bench-press', 'dumbbell-chest-fly', 'chest-dip'],
    },
    {
      label: 'Rygg A',
      muscleGroups: ['back'],
      exerciseIds: ['deadlift', 'bent-over-row', 'lat-pulldown', 'cable-row', 'pull-up', 'face-pull'],
    },
    {
      label: 'Ben A',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['back-squat', 'leg-press', 'romanian-deadlift', 'hip-thrust', 'leg-extension', 'lying-leg-curl', 'calf-raise'],
    },
    {
      label: 'Skuldre A',
      muscleGroups: ['shoulders'],
      exerciseIds: ['overhead-press', 'lateral-raise', 'front-raise', 'rear-delt-fly', 'face-pull'],
    },
    {
      label: 'Armer A',
      muscleGroups: ['arms', 'core'],
      exerciseIds: ['barbell-curl', 'hammer-curl', 'preacher-curl', 'triceps-pushdown', 'skull-crushers', 'overhead-triceps-extension'],
    },
    {
      label: 'Bryst B',
      muscleGroups: ['chest'],
      exerciseIds: ['dumbbell-bench-press', 'cable-chest-fly', 'incline-bench-press', 'chest-dip', 'push-ups'],
    },
    {
      label: 'Rygg B',
      muscleGroups: ['back'],
      exerciseIds: ['sumo-deadlift', 'dumbbell-row', 'chin-up', 'chest-supported-row', 'straight-arm-pulldown'],
    },
    {
      label: 'Ben B',
      muscleGroups: ['legs', 'core'],
      exerciseIds: ['front-squat', 'bulgarian-split-squat', 'hip-thrust', 'hip-abduction', 'lying-leg-curl', 'calf-raise'],
    },
    {
      label: 'Skuldre B',
      muscleGroups: ['shoulders'],
      exerciseIds: ['dumbbell-shoulder-press', 'arnold-press', 'upright-row', 'rear-delt-fly', 'lateral-raise'],
    },
    {
      label: 'Armer B',
      muscleGroups: ['arms', 'core'],
      exerciseIds: ['cable-curl', 'incline-dumbbell-curl', 'triceps-dip', 'overhead-triceps-extension', 'triceps-kickback'],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Lookup
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAMS_BY_DAYS: Record<number, Program> = {
  1: PROGRAM_1,
  2: PROGRAM_2,
  3: PROGRAM_3,
  4: PROGRAM_4,
  5: PROGRAM_5,
  6: PROGRAM_6,
  7: PROGRAM_7,
  8: PROGRAM_8,
  9: PROGRAM_9,
  10: PROGRAM_10,
}

export function getProgramForDays(days: number): Program {
  const clamped = Math.max(1, Math.min(10, days))
  return PROGRAMS_BY_DAYS[clamped]
}

// Legacy-eksport for bakoverkompatibilitet
export const PROGRAMS: Program[] = Object.values(PROGRAMS_BY_DAYS)
