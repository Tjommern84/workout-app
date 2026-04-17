export const STORAGE_SCHEMA_VERSION = 2

export type FocusMode = 'strength' | 'hypertrophy' | 'shred'

export type UserLevel = 'guide' | 'structure' | 'data'
export type UserGoal = 'lose_fat' | 'build_muscle' | 'get_stronger' | 'improve_fitness' | 'general_health'
export type Equipment = 'barbell' | 'dumbbell' | 'machine' | 'bodyweight' | 'cable' | 'kettlebell'
export type SetFeedback = 'too_easy' | 'just_right' | 'too_hard'
export type Gender = 'male' | 'female' | 'other'

export interface UserProfile {
  level: UserLevel
  goal: UserGoal
  gender: Gender
  age: number
  daysPerWeek: number
  equipment: Equipment[]
  onboardingComplete: boolean
  createdAt: string
}

export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core'

export const ALL_MUSCLE_GROUPS: MuscleGroup[] = [
  'chest', 'back', 'legs', 'shoulders', 'arms', 'core',
]

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: 'Bryst',
  back: 'Rygg',
  legs: 'Ben',
  shoulders: 'Skuldre',
  arms: 'Armer',
  core: 'Core',
}

// --- Spesifikke muskler (anatomisk presisjon) ---
export type Muscle =
  // Bryst
  | 'pec_major_upper'       // Øvre pectoralis major
  | 'pec_major_lower'       // Nedre pectoralis major
  | 'pec_minor'             // Pectoralis minor
  | 'serratus_anterior'     // Serratus anterior
  // Rygg – bredde
  | 'lat'                   // Latissimus dorsi
  | 'teres_major'           // Teres major
  // Rygg – tykkelse/midtre
  | 'rhomboids'             // Rhomboideus major/minor
  | 'trap_upper'            // Øvre trapezius
  | 'trap_middle'           // Midtre trapezius
  | 'trap_lower'            // Nedre trapezius
  // Rygg – bakre kjede
  | 'erector_spinae'        // Ryggradsstrekkere (spinalis, longissimus, iliocostalis)
  | 'multifidus'            // Multifidus
  // Skulder
  | 'delt_anterior'         // Fremre deltoid
  | 'delt_lateral'          // Midtre deltoid
  | 'delt_posterior'        // Bakre deltoid
  | 'infraspinatus'         // Infraspinatus (rotator cuff)
  | 'teres_minor'           // Teres minor (rotator cuff)
  | 'supraspinatus'         // Supraspinatus (rotator cuff)
  // Biceps / overarm foran
  | 'biceps_brachii'        // Biceps brachii
  | 'brachialis'            // Brachialis
  | 'brachioradialis'       // Brachioradialis
  // Triceps / overarm bak
  | 'triceps_long'          // Triceps – langt hode
  | 'triceps_lateral'       // Triceps – lateralt hode
  | 'triceps_medial'        // Triceps – medialt hode
  // Core
  | 'rectus_abdominis'      // Rectus abdominis
  | 'oblique_internal'      // Indre skrå magemuskel
  | 'oblique_external'      // Ytre skrå magemuskel
  | 'transverse_abdominis'  // Transversus abdominis
  | 'psoas'                 // Psoas major / Iliacus
  | 'quadratus_lumborum'    // Quadratus lumborum
  // Ben – foran (quads/hofte)
  | 'rectus_femoris'        // Rectus femoris
  | 'vastus_lateralis'      // Vastus lateralis
  | 'vastus_medialis'       // Vastus medialis
  | 'vastus_intermedius'    // Vastus intermedius
  | 'hip_flexors'           // Hoftebøyere (iliacus + psoas)
  // Ben – bak (hamstrings)
  | 'biceps_femoris'        // Biceps femoris
  | 'semitendinosus'        // Semitendinosus
  | 'semimembranosus'       // Semimembranosus
  // Seter
  | 'glute_max'             // Gluteus maximus
  | 'glute_med'             // Gluteus medius
  | 'glute_min'             // Gluteus minimus
  // Lyske / hofte
  | 'adductors'             // Adduktorer (longus, brevis, magnus)
  | 'tensor_fasciae_latae'  // Tensor fasciae latae
  // Legg
  | 'gastrocnemius'         // Gastrocnemius
  | 'soleus'                // Soleus

export type MovementPattern =
  | 'horizontal_push'   // Horisontal press – brystdominant
  | 'vertical_push'     // Vertikal press – skulder-dominant
  | 'horizontal_pull'   // Horisontal trekning – mid-rygg-dominant
  | 'vertical_pull'     // Vertikal trekning – lat-dominant
  | 'hinge'             // Hengsel – posterior kjede
  | 'squat'             // Knebøy-mønster – quad/setedominant
  | 'carry'             // Bæring – core/traps
  | 'rotation'          // Rotasjon / anti-rotasjon
  | 'isolation'         // Isolasjon – enkeltledd
  | 'full_body'         // Totaløvelse

export type ExerciseTier =
  | 'compound_primary'    // Tung flesleddsøvelse (knebøy, markløft, benkpress)
  | 'compound_secondary'  // Lettere flesleddsøvelse (utfall, roing, dips)
  | 'isolation'           // Isolasjon (curl, extension, sideheving)

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type FunctionalChain = 'anterior' | 'posterior' | 'lateral' | 'core'

export interface MuscleInfo {
  name: string              // Norsk navn
  anatomical: string        // Anatomisk/latinsk navn
  muscleGroup: MuscleGroup  // Tilhørende grovgruppe
  chain: FunctionalChain    // Funksjonell kjede
}

export interface Exercise {
  id: string
  name: string
  // Grovgruppe – beholdes for UI og generatorlogikk
  muscleGroup: MuscleGroup
  // Anatomisk presisjon
  primaryMuscles: Muscle[]
  secondaryMusclesDetailed?: Muscle[]
  // Bevegelsesklassifisering
  movementPattern: MovementPattern
  tier: ExerciseTier
  // Utstyr
  equipmentTypes: Equipment[]   // Typed – brukes til filtrering
  equipment?: string            // Display – valgfri lesbar streng
  // Brukerinfo
  difficulty: Difficulty
  cues?: string[]               // 2–3 korte teknikktips
  description?: string
  instructions?: string[]       // Steg-for-steg utførelse
}

export interface LoggedSet {
  reps: number
  weight: number
  completed: boolean
  rpe?: number          // 1–10, for level 3
  feedback?: SetFeedback // for level 1–2
}

export interface WorkoutExercise {
  exerciseId: string
  sets: LoggedSet[]
  recommendedRestSec?: number
  equipmentMismatch?: boolean  // true = valgt pga. fallback, ikke utstyrsmatch
}

export interface WorkoutRecord {
  id: string
  date: string
  name: string
  focusMode: FocusMode
  muscleGroups: MuscleGroup[]
  exercises: WorkoutExercise[]
  durationMinutes: number
  note?: string
}

export interface ActiveWorkout {
  name: string
  focusMode: FocusMode
  muscleGroups: MuscleGroup[]
  exercises: WorkoutExercise[]
  startedAt: string
  note?: string
}

export interface ProgramDay {
  label: string
  labelFriendly?: string  // Folkespråklig forklaring for nybegynnere
  muscleGroups: MuscleGroup[]
  exerciseIds: string[]
}

export interface Program {
  id: string
  name: string
  description: string
  days: ProgramDay[]
}

export interface UserSettings {
  weightUnit: 'kg' | 'lbs'
}

// ─── Programsyklus ───────────────────────────────────────────────────────────

export interface CycleWorkout {
  workoutRecordId: string
  date: string           // ISO dato
  weekNumber: number     // 1-basert
}

export interface ProgramCycle {
  id: string
  programId: string
  programName: string
  startDate: string            // ISO dato
  targetWeeks: number          // standard: 8
  targetWorkoutsPerWeek: number // minimum for å telle en uke ferdig: 2
  completedWorkouts: CycleWorkout[]
  status: 'active' | 'completed' | 'abandoned'
  completedDate?: string
}
