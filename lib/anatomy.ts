import { Muscle, MuscleInfo } from './types'

/**
 * Komplett muskelatlas.
 * Kilde: Bret Contreras – Bodyweight Strength Training Anatomy (Human Kinetics, 2014)
 *        CrossFit Anatomy & Physiology Primer (Lon Kilgore, 2019)
 */
export const MUSCLE_INFO: Record<Muscle, MuscleInfo> = {
  // --- Bryst ---
  pec_major_upper:      { name: 'Øvre bryst',          anatomical: 'Pectoralis major – pars clavicularis', muscleGroup: 'chest',     chain: 'anterior'  },
  pec_major_lower:      { name: 'Nedre bryst',          anatomical: 'Pectoralis major – pars sternocostalis', muscleGroup: 'chest',  chain: 'anterior'  },
  pec_minor:            { name: 'Pectoralis minor',     anatomical: 'Pectoralis minor',                     muscleGroup: 'chest',     chain: 'anterior'  },
  serratus_anterior:    { name: 'Serratus anterior',    anatomical: 'Serratus anterior',                    muscleGroup: 'chest',     chain: 'anterior'  },

  // --- Rygg – bredde ---
  lat:                  { name: 'Latissimus',           anatomical: 'Latissimus dorsi',                     muscleGroup: 'back',      chain: 'posterior' },
  teres_major:          { name: 'Teres major',          anatomical: 'Teres major',                          muscleGroup: 'back',      chain: 'posterior' },

  // --- Rygg – tykkelse ---
  rhomboids:            { name: 'Rhomboider',           anatomical: 'Rhomboideus major & minor',            muscleGroup: 'back',      chain: 'posterior' },
  trap_upper:           { name: 'Øvre trapezius',       anatomical: 'Trapezius – pars descendens',          muscleGroup: 'back',      chain: 'posterior' },
  trap_middle:          { name: 'Midtre trapezius',     anatomical: 'Trapezius – pars transversa',          muscleGroup: 'back',      chain: 'posterior' },
  trap_lower:           { name: 'Nedre trapezius',      anatomical: 'Trapezius – pars ascendens',           muscleGroup: 'back',      chain: 'posterior' },

  // --- Rygg – bakre kjede ---
  erector_spinae:       { name: 'Ryggradsstrekkere',    anatomical: 'Erector spinae (spinalis, longissimus, iliocostalis)', muscleGroup: 'back', chain: 'posterior' },
  multifidus:           { name: 'Multifidus',           anatomical: 'Multifidus',                           muscleGroup: 'back',      chain: 'posterior' },

  // --- Skulder ---
  delt_anterior:        { name: 'Fremre skulder',       anatomical: 'Deltoideus – pars clavicularis',       muscleGroup: 'shoulders', chain: 'anterior'  },
  delt_lateral:         { name: 'Midtre skulder',       anatomical: 'Deltoideus – pars acromialis',         muscleGroup: 'shoulders', chain: 'lateral'   },
  delt_posterior:       { name: 'Bakre skulder',        anatomical: 'Deltoideus – pars spinalis',           muscleGroup: 'shoulders', chain: 'posterior' },
  infraspinatus:        { name: 'Infraspinatus',        anatomical: 'Infraspinatus',                        muscleGroup: 'shoulders', chain: 'posterior' },
  teres_minor:          { name: 'Teres minor',          anatomical: 'Teres minor',                          muscleGroup: 'shoulders', chain: 'posterior' },
  supraspinatus:        { name: 'Supraspinatus',        anatomical: 'Supraspinatus',                        muscleGroup: 'shoulders', chain: 'lateral'   },

  // --- Biceps ---
  biceps_brachii:       { name: 'Biceps',               anatomical: 'Biceps brachii',                       muscleGroup: 'arms',      chain: 'anterior'  },
  brachialis:           { name: 'Brachialis',           anatomical: 'Brachialis',                           muscleGroup: 'arms',      chain: 'anterior'  },
  brachioradialis:      { name: 'Brachioradialis',      anatomical: 'Brachioradialis',                      muscleGroup: 'arms',      chain: 'anterior'  },

  // --- Triceps ---
  triceps_long:         { name: 'Triceps – langt hode', anatomical: 'Triceps brachii – caput longum',       muscleGroup: 'arms',      chain: 'posterior' },
  triceps_lateral:      { name: 'Triceps – lateralt',   anatomical: 'Triceps brachii – caput laterale',     muscleGroup: 'arms',      chain: 'posterior' },
  triceps_medial:       { name: 'Triceps – medialt',    anatomical: 'Triceps brachii – caput mediale',      muscleGroup: 'arms',      chain: 'posterior' },

  // --- Core ---
  rectus_abdominis:     { name: 'Magemuskel',           anatomical: 'Rectus abdominis',                     muscleGroup: 'core',      chain: 'anterior'  },
  oblique_internal:     { name: 'Indre skrå mage',      anatomical: 'Obliquus internus abdominis',          muscleGroup: 'core',      chain: 'core'      },
  oblique_external:     { name: 'Ytre skrå mage',       anatomical: 'Obliquus externus abdominis',          muscleGroup: 'core',      chain: 'core'      },
  transverse_abdominis: { name: 'Transversus',          anatomical: 'Transversus abdominis',                muscleGroup: 'core',      chain: 'core'      },
  psoas:                { name: 'Hoftefleksorer',       anatomical: 'Psoas major / Iliacus',                muscleGroup: 'core',      chain: 'anterior'  },
  quadratus_lumborum:   { name: 'Quadratus lumborum',   anatomical: 'Quadratus lumborum',                   muscleGroup: 'core',      chain: 'core'      },

  // --- Ben – foran ---
  rectus_femoris:       { name: 'Rectus femoris',       anatomical: 'Rectus femoris',                       muscleGroup: 'legs',      chain: 'anterior'  },
  vastus_lateralis:     { name: 'Ytre kvads',           anatomical: 'Vastus lateralis',                     muscleGroup: 'legs',      chain: 'anterior'  },
  vastus_medialis:      { name: 'Indre kvads (VMO)',     anatomical: 'Vastus medialis',                      muscleGroup: 'legs',      chain: 'anterior'  },
  vastus_intermedius:   { name: 'Midtre kvads',         anatomical: 'Vastus intermedius',                   muscleGroup: 'legs',      chain: 'anterior'  },
  hip_flexors:          { name: 'Hoftebøyere',          anatomical: 'Iliopsoas',                            muscleGroup: 'legs',      chain: 'anterior'  },

  // --- Ben – bak ---
  biceps_femoris:       { name: 'Biceps femoris',       anatomical: 'Biceps femoris',                       muscleGroup: 'legs',      chain: 'posterior' },
  semitendinosus:       { name: 'Semitendinosus',       anatomical: 'Semitendinosus',                       muscleGroup: 'legs',      chain: 'posterior' },
  semimembranosus:      { name: 'Semimembranosus',      anatomical: 'Semimembranosus',                      muscleGroup: 'legs',      chain: 'posterior' },

  // --- Seter ---
  glute_max:            { name: 'Gluteus maximus',      anatomical: 'Gluteus maximus',                      muscleGroup: 'legs',      chain: 'posterior' },
  glute_med:            { name: 'Gluteus medius',       anatomical: 'Gluteus medius',                       muscleGroup: 'legs',      chain: 'lateral'   },
  glute_min:            { name: 'Gluteus minimus',      anatomical: 'Gluteus minimus',                      muscleGroup: 'legs',      chain: 'lateral'   },

  // --- Lyske / hofte ---
  adductors:            { name: 'Adduktorer',           anatomical: 'Adductores (longus, brevis, magnus)',  muscleGroup: 'legs',      chain: 'lateral'   },
  tensor_fasciae_latae: { name: 'TFL',                  anatomical: 'Tensor fasciae latae',                 muscleGroup: 'legs',      chain: 'lateral'   },

  // --- Legg ---
  gastrocnemius:        { name: 'Leggmuskel (ytre)',    anatomical: 'Gastrocnemius',                        muscleGroup: 'legs',      chain: 'posterior' },
  soleus:               { name: 'Leggmuskel (indre)',   anatomical: 'Soleus',                               muscleGroup: 'legs',      chain: 'posterior' },
}

/** Returnerer MuscleInfo for én muskel */
export function getMuscleInfo(muscle: Muscle): MuscleInfo {
  return MUSCLE_INFO[muscle]
}

/** Returnerer alle muskler tilhørende en funksjonell kjede */
export function getMusclesByChain(chain: import('./types').FunctionalChain): Muscle[] {
  return (Object.entries(MUSCLE_INFO) as [Muscle, MuscleInfo][])
    .filter(([, info]) => info.chain === chain)
    .map(([muscle]) => muscle)
}

/** Slår opp norske navn for en liste muskler */
export function muscleNames(muscles: Muscle[]): string[] {
  return muscles.map(m => MUSCLE_INFO[m].name)
}
