/**
 * Treningsbibliotek – WorkoutAI
 *
 * Kilde: Bret Contreras – Bodyweight Strength Training Anatomy (Human Kinetics, 2014)
 *        CrossFit Anatomy & Physiology Primer (Lon Kilgore, 2019)
 *        NSCA Basics of Strength and Conditioning
 *        L3 Personal Trainer Manual
 *
 * Struktur per øvelse:
 *   muscleGroup          – grovgruppe for UI og generatorlogikk
 *   primaryMuscles       – anatomisk presise primære muskler
 *   secondaryMusclesDetailed – synergister og stabilisatorer
 *   movementPattern      – bevegelsesmønster (push/pull/hinge/squat/…)
 *   tier                 – compound_primary / compound_secondary / isolation
 *   equipmentTypes       – typed array for filtering mot UserProfile.equipment
 *   equipment            – lesbar streng for UI
 *   difficulty           – beginner / intermediate / advanced
 *   cues                 – 2–3 korte teknikktips
 */

import { Exercise, Equipment, MuscleGroup } from './types'
export { getInstructions } from './exercise-instructions'

const EQUIPMENT_LABELS: Record<Equipment, string> = {
  barbell:    'Stang',
  dumbbell:   'Manualer',
  machine:    'Maskin',
  bodyweight: 'Kroppsvekt',
  cable:      'Kabel',
  kettlebell: 'Kettlebell',
}

/** Konverterer typed Equipment[] til lesbar norsk streng, f.eks. "Stang / Manualer" */
export function formatEquipment(types: Equipment[]): string {
  if (types.length === 0) return 'Kroppsvekt'
  return types.map(t => EQUIPMENT_LABELS[t]).join(' / ')
}

export const EXERCISES: Exercise[] = [

  // ─────────────────────────────────────────────────────────────────
  // HORISONTAL PRESS – brystdominant
  // ─────────────────────────────────────────────────────────────────

  {
    id: 'bench-press',
    name: 'Benkpress',
    muscleGroup: 'chest',
    primaryMuscles: ['pec_major_upper', 'pec_major_lower'],
    secondaryMusclesDetailed: ['triceps_long', 'triceps_lateral', 'triceps_medial', 'delt_anterior', 'serratus_anterior', 'trap_lower', 'pec_minor'],
    movementPattern: 'horizontal_push',
    tier: 'compound_primary',
    equipmentTypes: ['barbell'],
    equipment: 'Stang',
    difficulty: 'intermediate',
    cues: ['Trekk skuldrene ned og bakover mot benken', 'Senk stangen til nedre bryst i rett linje', 'Press opp og lett bakover – ikke rett vertikalt'],
    description: 'Grunnøvelsen for bryst. Krever benkpressbenk og stang. Gir høy overbelastning av bryst, fremre skulder og triceps.',
  },

  {
    id: 'incline-bench-press',
    name: 'Incline Benkpress',
    muscleGroup: 'chest',
    primaryMuscles: ['pec_major_upper'],
    secondaryMusclesDetailed: ['triceps_long', 'triceps_lateral', 'delt_anterior', 'serratus_anterior', 'trap_lower'],
    movementPattern: 'horizontal_push',
    tier: 'compound_secondary',
    equipmentTypes: ['barbell'],
    equipment: 'Stang / Skrå benk',
    difficulty: 'intermediate',
    cues: ['Sett benken til 30–45°', 'Hold skuldrene stabilt mot rygglenet', 'Senk stangen mot øvre bryst'],
    description: 'Treffer øvre bryst og fremre skulder sterkere enn flat benkpress.',
  },

  {
    id: 'decline-bench-press',
    name: 'Decline Benkpress',
    muscleGroup: 'chest',
    primaryMuscles: ['pec_major_lower'],
    secondaryMusclesDetailed: ['triceps_long', 'triceps_lateral', 'triceps_medial', 'delt_anterior', 'serratus_anterior'],
    movementPattern: 'horizontal_push',
    tier: 'compound_secondary',
    equipmentTypes: ['barbell'],
    equipment: 'Stang / Nedoverskrå benk',
    difficulty: 'intermediate',
    cues: ['Sikre at beina er låst godt fast', 'Fokus på nedre bryst', 'Kontrollert nedsenking'],
    description: 'Isolerer nedre del av brystet mer enn flat og incline.',
  },

  {
    id: 'dumbbell-bench-press',
    name: 'Manualbenkpress',
    muscleGroup: 'chest',
    primaryMuscles: ['pec_major_upper', 'pec_major_lower'],
    secondaryMusclesDetailed: ['triceps_long', 'triceps_lateral', 'delt_anterior', 'serratus_anterior', 'trap_lower'],
    movementPattern: 'horizontal_push',
    tier: 'compound_secondary',
    equipmentTypes: ['dumbbell'],
    equipment: 'Manualer',
    difficulty: 'intermediate',
    cues: ['Større bevegelsesutslag enn stang', 'La manualene nærme seg hverandre øverst', 'Kontroller ned til full strekk i brystet'],
    description: 'Gir større bevegelsesbane enn stangbenkpress og aktiverer stabilisatormusklene mer.',
  },

  {
    id: 'push-ups',
    name: 'Pushups',
    muscleGroup: 'chest',
    primaryMuscles: ['pec_major_upper', 'pec_major_lower'],
    secondaryMusclesDetailed: ['triceps_long', 'triceps_lateral', 'delt_anterior', 'serratus_anterior', 'rectus_abdominis', 'glute_max'],
    movementPattern: 'horizontal_push',
    tier: 'compound_secondary',
    equipmentTypes: ['bodyweight'],
    equipment: 'Kroppsvekt',
    difficulty: 'beginner',
    cues: ['Kroppen som en rett planke fra hode til hæl', 'Albuer 45° fra kroppen – ikke rett ut', 'Press brystet ned til nær gulvet'],
    description: 'Grunnleggende brystøvelse uten utstyr. Aktiverer i tillegg core og setemuskulatur som stabilisatorer.',
  },

  {
    id: 'knee-push-ups',
    name: 'Pushups fra kne',
    muscleGroup: 'chest',
    primaryMuscles: ['pec_major_upper', 'pec_major_lower'],
    secondaryMusclesDetailed: ['triceps_lateral', 'triceps_medial', 'delt_anterior', 'serratus_anterior'],
    movementPattern: 'horizontal_push',
    tier: 'compound_secondary',
    equipmentTypes: ['bodyweight'],
    equipment: 'Kroppsvekt',
    difficulty: 'beginner',
    cues: ['Kne i bakken, rett linje fra kne til hode', 'Press ned til brystet nær gulvet', 'Progresjon mot full pushup'],
    description: 'Enklere variant av pushup. Reduserer kroppsvektbelastningen med ca. 20 %.',
  },

  {
    id: 'chest-dip',
    name: 'Dips (brystfokus)',
    muscleGroup: 'chest',
    primaryMuscles: ['pec_major_lower'],
    secondaryMusclesDetailed: ['triceps_long', 'triceps_lateral', 'triceps_medial', 'delt_anterior', 'pec_minor', 'rhomboids'],
    movementPattern: 'horizontal_push',
    tier: 'compound_secondary',
    equipmentTypes: ['bodyweight'],
    equipment: 'Dipsstenger',
    difficulty: 'advanced',
    cues: ['Hel fremover for mer brystfokus', 'Kontroller ned til 90° i albuen', 'Press opp uten å helt låse albuene'],
    description: 'Svært effektiv nedre bryst- og tricepsøvelse. Kan benytte belte med vekt for ekstra motstand.',
  },

  {
    id: 'dumbbell-chest-fly',
    name: 'Bryst-fly',
    muscleGroup: 'chest',
    primaryMuscles: ['pec_major_upper', 'pec_major_lower'],
    secondaryMusclesDetailed: ['delt_anterior', 'serratus_anterior', 'biceps_brachii'],
    movementPattern: 'horizontal_push',
    tier: 'isolation',
    equipmentTypes: ['dumbbell'],
    equipment: 'Manualer',
    difficulty: 'beginner',
    cues: ['Liten bøy i albuene gjennom hele bevegelsen', 'Senk ut til brystet kjennes strekk', 'Samle med en bue – ikke press'],
    description: 'Isolasjonsøvelse for bryst med konstant strekk. Lett vekt, kontrollert tempo.',
  },

  {
    id: 'cable-chest-fly',
    name: 'Kabel-fly',
    muscleGroup: 'chest',
    primaryMuscles: ['pec_major_upper', 'pec_major_lower'],
    secondaryMusclesDetailed: ['delt_anterior', 'serratus_anterior'],
    movementPattern: 'horizontal_push',
    tier: 'isolation',
    equipmentTypes: ['cable'],
    equipment: 'Kabel',
    difficulty: 'beginner',
    cues: ['Konstant spenning gjennom hele bevegelsen', 'Kryss hendene på toppen for full kontraksjon', 'Høyde på kabel styrer hvilken del av brystet som treffer'],
    description: 'Gir konstant motstand i motsetning til manualer. Høy kabel treffer nedre bryst, lav kabel treffer øvre.',
  },

  // ─────────────────────────────────────────────────────────────────
  // VERTIKAL PRESS – skulderdominant
  // ─────────────────────────────────────────────────────────────────

  {
    id: 'overhead-press',
    name: 'Skulderpress (stang)',
    muscleGroup: 'shoulders',
    primaryMuscles: ['delt_anterior', 'delt_lateral'],
    secondaryMusclesDetailed: ['triceps_long', 'triceps_lateral', 'triceps_medial', 'pec_major_upper', 'trap_upper', 'serratus_anterior', 'rectus_abdominis'],
    movementPattern: 'vertical_push',
    tier: 'compound_primary',
    equipmentTypes: ['barbell'],
    equipment: 'Stang',
    difficulty: 'intermediate',
    cues: ['Aktiver core og seter under pressing', 'Press stangen rett opp – hode litt tilbake for å unngå ansiktet', 'Lås ut fullstendig øverst'],
    description: 'Kongeøvelsen for skuldre. Trener alle tre skulderhoder og gir god overbelastning på triceps.',
  },

  {
    id: 'dumbbell-shoulder-press',
    name: 'Manualpress',
    muscleGroup: 'shoulders',
    primaryMuscles: ['delt_anterior', 'delt_lateral'],
    secondaryMusclesDetailed: ['triceps_long', 'triceps_lateral', 'pec_major_upper', 'trap_upper', 'serratus_anterior'],
    movementPattern: 'vertical_push',
    tier: 'compound_secondary',
    equipmentTypes: ['dumbbell'],
    equipment: 'Manualer',
    difficulty: 'beginner',
    cues: ['Start med manualene i ørehøyde', 'Press opp og lett inn mot hverandre', 'Unngå å vippe ryggen bakover'],
    description: 'Samme bevegelse som stangskulderpress, men gir mer bevegelsesfrihet og aktiverer stabilisatorer mer.',
  },

  {
    id: 'arnold-press',
    name: 'Arnold Press',
    muscleGroup: 'shoulders',
    primaryMuscles: ['delt_anterior', 'delt_lateral', 'delt_posterior'],
    secondaryMusclesDetailed: ['triceps_long', 'triceps_lateral', 'pec_major_upper', 'trap_upper', 'serratus_anterior'],
    movementPattern: 'vertical_push',
    tier: 'compound_secondary',
    equipmentTypes: ['dumbbell'],
    equipment: 'Manualer',
    difficulty: 'intermediate',
    cues: ['Start med håndflatene mot deg i underpositionen', 'Roter utover mens du presser opp', 'Alle tre skulderhoder aktiveres gjennom rotasjonen'],
    description: 'Kombinerer rotasjon og skulderpress. Oppkalt etter Arnold Schwarzenegger. Aktiverer alle tre skulderhoder.',
  },

  {
    id: 'lateral-raise',
    name: 'Sideheving',
    muscleGroup: 'shoulders',
    primaryMuscles: ['delt_lateral', 'supraspinatus'],
    secondaryMusclesDetailed: ['delt_anterior', 'trap_upper'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['dumbbell', 'cable'],
    equipment: 'Manualer / Kabel',
    difficulty: 'beginner',
    cues: ['Løft til skulderhøyde – ikke høyere', 'Liten bøy i albuene', 'Ingen sving – kontrollert tempo'],
    description: 'Isolerer midtre skulderblad og gir skulderbredde. Kabel gir konstant spenning gjennom hele bevegelsen.',
  },

  {
    id: 'front-raise',
    name: 'Fremheving',
    muscleGroup: 'shoulders',
    primaryMuscles: ['delt_anterior'],
    secondaryMusclesDetailed: ['pec_major_upper', 'serratus_anterior'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['dumbbell'],
    equipment: 'Manualer',
    difficulty: 'beginner',
    cues: ['Løft rett fremover til skulderhøyde', 'Unngå sving – bruk kontrollert tempo', 'Kan gjøres med alternerende armer'],
    description: 'Isolerer fremre skulder. Unngå for høy frekvens da fremre skulder allerede belastes i de fleste pressøvelser.',
  },

  {
    id: 'rear-delt-fly',
    name: 'Bakre skulder-fly',
    muscleGroup: 'shoulders',
    primaryMuscles: ['delt_posterior'],
    secondaryMusclesDetailed: ['infraspinatus', 'teres_minor', 'rhomboids', 'trap_middle'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['dumbbell', 'machine'],
    equipment: 'Manualer / Maskin',
    difficulty: 'beginner',
    cues: ['Bøy fremover 45° eller sett deg fremover på benk', 'Løft armene til siden med liten bøy i albuen', 'Klem skulderbladen mot hverandre øverst'],
    description: 'Trener bakre skulder og rotator cuff. Viktig for skulderbalanse mot alle pressøvelsene.',
  },

  {
    id: 'upright-row',
    name: 'Oppreist roing',
    muscleGroup: 'shoulders',
    primaryMuscles: ['delt_lateral', 'trap_upper'],
    secondaryMusclesDetailed: ['delt_anterior', 'biceps_brachii', 'brachialis'],
    movementPattern: 'vertical_push',
    tier: 'compound_secondary',
    equipmentTypes: ['barbell', 'dumbbell'],
    equipment: 'Stang / Manualer',
    difficulty: 'intermediate',
    cues: ['Smalt grep reduserer belastning på rotator cuff', 'Løft albuene – ikke hendene', 'Stopp når albuene er i skulderhøyde'],
    description: 'Treffer midtre skulder og øvre trapezius. Bredt grep øker belastning på rotator cuff – vær forsiktig.',
  },

  {
    id: 'pike-push-up',
    name: 'Pike pushup',
    muscleGroup: 'shoulders',
    primaryMuscles: ['delt_anterior', 'delt_lateral', 'triceps_long', 'triceps_lateral'],
    secondaryMusclesDetailed: ['trap_upper', 'trap_lower', 'serratus_anterior'],
    movementPattern: 'vertical_push',
    tier: 'compound_secondary',
    equipmentTypes: ['bodyweight'],
    equipment: 'Kroppsvekt',
    difficulty: 'intermediate',
    cues: ['Hofte høyt opp i inverted V-form', 'Senk hodet ned mot gulvet mellom hendene', 'Skulder- ikke brystdominant bevegelse'],
    description: 'Kroppsvektvarianten av skulderpress. God progresjonsvei mot stående armhevinger.',
  },

  // ─────────────────────────────────────────────────────────────────
  // HORISONTAL TREKNING – mid-rygg-dominant
  // ─────────────────────────────────────────────────────────────────

  {
    id: 'bent-over-row',
    name: 'Foroverbøyd roing',
    muscleGroup: 'back',
    primaryMuscles: ['lat', 'rhomboids', 'trap_middle', 'trap_lower'],
    secondaryMusclesDetailed: ['delt_posterior', 'biceps_brachii', 'brachialis', 'erector_spinae'],
    movementPattern: 'horizontal_pull',
    tier: 'compound_primary',
    equipmentTypes: ['barbell'],
    equipment: 'Stang',
    difficulty: 'intermediate',
    cues: ['Hofte-hengsel – ikke knebøy fremover', 'Nøytral ryggrad gjennom hele løftet', 'Ro til navlen – ikke til brystet'],
    description: 'En av de beste flesleddsøvelsene for ryggtykkelse. Belaster også korsryggen som stabilisator.',
  },

  {
    id: 'dumbbell-row',
    name: 'Enarms roing',
    muscleGroup: 'back',
    primaryMuscles: ['lat', 'rhomboids', 'trap_middle'],
    secondaryMusclesDetailed: ['delt_posterior', 'biceps_brachii', 'brachialis', 'teres_major'],
    movementPattern: 'horizontal_pull',
    tier: 'compound_secondary',
    equipmentTypes: ['dumbbell'],
    equipment: 'Manualer',
    difficulty: 'beginner',
    cues: ['Støtt deg på benk med motstående hånd og kne', 'Ro manualen mot hoftebeinet – ikke skulderen', 'Hold ryggen parallell med gulvet'],
    description: 'God unilateral ryggøvelse. Gir mulighet for dypere bevegelsesutslag enn stangroing.',
  },

  {
    id: 'cable-row',
    name: 'Kabelroing (sittende)',
    muscleGroup: 'back',
    primaryMuscles: ['lat', 'rhomboids', 'trap_middle', 'trap_lower'],
    secondaryMusclesDetailed: ['delt_posterior', 'biceps_brachii', 'erector_spinae'],
    movementPattern: 'horizontal_pull',
    tier: 'compound_secondary',
    equipmentTypes: ['cable'],
    equipment: 'Kabel',
    difficulty: 'beginner',
    cues: ['Rett rygg – ikke len bakover for å trekke', 'Klem skulderbladen mot hverandre ved toppen', 'Rolig kontrollert eksentrisk fase'],
    description: 'Konstant kabelbelastning gjennom hele bevegelsesutslaget. Svært god for ryggtykkelse.',
  },

  {
    id: 'chest-supported-row',
    name: 'Brystunderstøttet roing',
    muscleGroup: 'back',
    primaryMuscles: ['rhomboids', 'trap_middle', 'trap_lower', 'delt_posterior'],
    secondaryMusclesDetailed: ['lat', 'biceps_brachii', 'brachialis'],
    movementPattern: 'horizontal_pull',
    tier: 'compound_secondary',
    equipmentTypes: ['dumbbell'],
    equipment: 'Manualer / Skrå benk',
    difficulty: 'beginner',
    cues: ['Brystet mot skråbenken fjerner korsryggbelastning', 'Ro albuene rett bakover og opp', 'Fokus på skulderbladtrekning'],
    description: 'Fjerner korsryggbelastningen fra foroverbøyd roing. Ypperlig for rene mellomryggsøkter.',
  },

  {
    id: 'inverted-row',
    name: 'Invertert roing',
    muscleGroup: 'back',
    primaryMuscles: ['lat', 'rhomboids', 'trap_middle'],
    secondaryMusclesDetailed: ['delt_posterior', 'biceps_brachii', 'rectus_abdominis'],
    movementPattern: 'horizontal_pull',
    tier: 'compound_secondary',
    equipmentTypes: ['bodyweight'],
    equipment: 'Strikk / Bord / Smithmaskin',
    difficulty: 'beginner',
    cues: ['Kroppen strak som en planke', 'Trekk brystet opp til stangen', 'Vanskelighetsgrad justeres med benvinkelen'],
    description: 'Kroppsvektversjon av horisontal roing. Lett å skalere opp eller ned ved å endre benvinkelen.',
  },

  {
    id: 'face-pull',
    name: 'Face pull',
    muscleGroup: 'shoulders',
    primaryMuscles: ['delt_posterior', 'infraspinatus', 'teres_minor'],
    secondaryMusclesDetailed: ['rhomboids', 'trap_middle', 'trap_lower'],
    movementPattern: 'horizontal_pull',
    tier: 'isolation',
    equipmentTypes: ['cable'],
    equipment: 'Kabel',
    difficulty: 'beginner',
    cues: ['Kabel i øyehøyde eller litt over', 'Trekk tauet mot ansiktet med albuene høyt', 'Ekstern rotasjon av skulderen – ikke bare bakover'],
    description: 'Viktig skader-forebyggende øvelse. Styrker bakre skulder og rotator cuff som motveier alle pressøvelser.',
  },

  // ─────────────────────────────────────────────────────────────────
  // VERTIKAL TREKNING – lat-dominant
  // ─────────────────────────────────────────────────────────────────

  {
    id: 'pull-up',
    name: 'Pull-up',
    muscleGroup: 'back',
    primaryMuscles: ['lat', 'teres_major', 'rhomboids'],
    secondaryMusclesDetailed: ['delt_posterior', 'biceps_brachii', 'brachialis', 'trap_lower', 'rectus_abdominis'],
    movementPattern: 'vertical_pull',
    tier: 'compound_primary',
    equipmentTypes: ['bodyweight'],
    equipment: 'Bom',
    difficulty: 'advanced',
    cues: ['Overgrep, skulderbreddes avstand', 'Trekk skulderbladen ned og inn FØR du trekker armene', 'Presse brystet mot bommen øverst'],
    description: 'En av de beste øvelsene for ryggbredde og kroppsstyrke. Stiger i vanskelighetsgrad med undergrep (chins) som lettere variant.',
  },

  {
    id: 'chin-up',
    name: 'Chins',
    muscleGroup: 'back',
    primaryMuscles: ['biceps_brachii', 'lat', 'teres_major'],
    secondaryMusclesDetailed: ['brachialis', 'rhomboids', 'trap_lower', 'rectus_abdominis'],
    movementPattern: 'vertical_pull',
    tier: 'compound_primary',
    equipmentTypes: ['bodyweight'],
    equipment: 'Bom',
    difficulty: 'intermediate',
    cues: ['Undergrep – håndflatene mot deg', 'Trekk albuene ned og bakover', 'Haken over stangen øverst'],
    description: 'Lettere enn pull-up fordi undergrep aktiverer biceps sterkere. Ypperlig progresjon mot pull-ups.',
  },

  {
    id: 'lat-pulldown',
    name: 'Lat pulldown',
    muscleGroup: 'back',
    primaryMuscles: ['lat', 'teres_major', 'rhomboids'],
    secondaryMusclesDetailed: ['delt_posterior', 'biceps_brachii', 'trap_lower'],
    movementPattern: 'vertical_pull',
    tier: 'compound_secondary',
    equipmentTypes: ['cable'],
    equipment: 'Kabel',
    difficulty: 'beginner',
    cues: ['Trekk stangen ned foran – ikke bak nakken', 'Lene litt bakover, brystet ut mot stangen', 'Klem latene nede – rolig opp'],
    description: 'God maskin-alternativ til pull-up. Perfekt for nybegynnere og for å trene lat-isolert.',
  },

  {
    id: 'narrow-lat-pulldown',
    name: 'Smal lat pulldown',
    muscleGroup: 'back',
    primaryMuscles: ['lat', 'teres_major'],
    secondaryMusclesDetailed: ['biceps_brachii', 'brachialis', 'rhomboids'],
    movementPattern: 'vertical_pull',
    tier: 'compound_secondary',
    equipmentTypes: ['cable'],
    equipment: 'Kabel',
    difficulty: 'beginner',
    cues: ['Smalt nøytralgrep-håndtak', 'Trekk ned mot brystet', 'Større bevegelsesutslag enn bredt grep'],
    description: 'Smalt grep gir lengre bevegelsesutslag og mer biceps-involvering enn bredt grep.',
  },

  {
    id: 'straight-arm-pulldown',
    name: 'Strake-arm pulldown',
    muscleGroup: 'back',
    primaryMuscles: ['lat', 'teres_major'],
    secondaryMusclesDetailed: ['triceps_long', 'serratus_anterior'],
    movementPattern: 'vertical_pull',
    tier: 'isolation',
    equipmentTypes: ['cable'],
    equipment: 'Kabel',
    difficulty: 'beginner',
    cues: ['Armene forblir strake gjennom hele bevegelsen', 'Trekk stangen ned foran til lårnivå', 'Aktiver latene – ikke biceps'],
    description: 'Isolerer latissimus uten biceps-involvering. God finisher for lat.',
  },

  // ─────────────────────────────────────────────────────────────────
  // HENGSEL – posterior kjede
  // ─────────────────────────────────────────────────────────────────

  {
    id: 'deadlift',
    name: 'Markløft',
    muscleGroup: 'legs',
    primaryMuscles: ['glute_max', 'biceps_femoris', 'semitendinosus', 'semimembranosus', 'erector_spinae'],
    secondaryMusclesDetailed: ['rectus_femoris', 'vastus_lateralis', 'adductors', 'trap_upper', 'lat'],
    movementPattern: 'hinge',
    tier: 'compound_primary',
    equipmentTypes: ['barbell'],
    equipment: 'Stang',
    difficulty: 'intermediate',
    cues: ['Hold ryggen nøytral – verken buet eller flatt', 'Press gulvet ned med føttene – løft ikke stangen opp', 'Hofte og skulder stiger med samme hastighet'],
    description: 'Kongeøvelsen for posterior kjede. Trener gluteus maximus, hamstrings og korsrygg med høy belastning.',
  },

  {
    id: 'sumo-deadlift',
    name: 'Sumo markløft',
    muscleGroup: 'legs',
    primaryMuscles: ['glute_max', 'adductors', 'biceps_femoris', 'semitendinosus'],
    secondaryMusclesDetailed: ['rectus_femoris', 'vastus_lateralis', 'erector_spinae', 'trap_upper'],
    movementPattern: 'hinge',
    tier: 'compound_primary',
    equipmentTypes: ['barbell'],
    equipment: 'Stang',
    difficulty: 'intermediate',
    cues: ['Bredt benstilling med tær ut 45°', 'Hendene innenfor beina', 'Kortere bevegelsesutslag, mer hoftebredde-avhengig'],
    description: 'Bredt grep-variant. Aktiverer adduktorer og seter mer, reduserer ryggens bevegelsesutslag.',
  },

  {
    id: 'romanian-deadlift',
    name: 'Rumensk markløft',
    muscleGroup: 'legs',
    primaryMuscles: ['biceps_femoris', 'semitendinosus', 'semimembranosus', 'glute_max'],
    secondaryMusclesDetailed: ['erector_spinae', 'adductors', 'lat'],
    movementPattern: 'hinge',
    tier: 'compound_secondary',
    equipmentTypes: ['barbell', 'dumbbell'],
    equipment: 'Stang / Manualer',
    difficulty: 'beginner',
    cues: ['Liten bøy i knærne gjennom hele bevegelsen', 'Send hoften bakover – ikke ned', 'Kjenn strekk i hamstrings som stoppunkt'],
    description: 'Fremragende hamstrings- og seteøvelse. Starter fra stående – stangen synker langs benet ned til leggmidt.',
  },

  {
    id: 'single-leg-romanian-deadlift',
    name: 'Ettbens rumensk markløft',
    muscleGroup: 'legs',
    primaryMuscles: ['biceps_femoris', 'semitendinosus', 'glute_max'],
    secondaryMusclesDetailed: ['glute_med', 'erector_spinae', 'transverse_abdominis'],
    movementPattern: 'hinge',
    tier: 'compound_secondary',
    equipmentTypes: ['dumbbell'],
    equipment: 'Manualer',
    difficulty: 'intermediate',
    cues: ['En hånd med vekt, motstående arm holdes fri', 'Kontrollér rotasjon i hoften', 'Blikk ned – ikke frem'],
    description: 'Unilateral variant. Utfordrer balanse og avdekker asymmetrier mellom sider.',
  },

  {
    id: 'hip-thrust',
    name: 'Hip thrust',
    muscleGroup: 'legs',
    primaryMuscles: ['glute_max'],
    secondaryMusclesDetailed: ['biceps_femoris', 'semitendinosus', 'erector_spinae', 'adductors'],
    movementPattern: 'hinge',
    tier: 'compound_secondary',
    equipmentTypes: ['barbell'],
    equipment: 'Stang / Benk',
    difficulty: 'intermediate',
    cues: ['Skuldrene hvilende på benk i ca. skulderblad-høyde', 'Hev hoften til kroppen er rett linje fra kne til skulder', 'Klem setemusklene hardt øverst'],
    description: 'Den mest effektive øvelsen for gluteus maximus isolert (Bret Contreras, 2014). Stangen legges over hoftebeinet med pute.',
  },

  {
    id: 'glute-bridge',
    name: 'Glute bridge',
    muscleGroup: 'legs',
    primaryMuscles: ['glute_max'],
    secondaryMusclesDetailed: ['biceps_femoris', 'semitendinosus', 'erector_spinae'],
    movementPattern: 'hinge',
    tier: 'compound_secondary',
    equipmentTypes: ['bodyweight'],
    equipment: 'Kroppsvekt',
    difficulty: 'beginner',
    cues: ['Ligg på ryggen, ben bøyd 90°', 'Hev hoften til kroppen er rett', 'Klem setemusklene øverst – hold 1–2 sek'],
    description: 'Kroppsvektvarianten av hip thrust. God aktiveringsøvelse og utgangspunkt for progresjon.',
  },

  {
    id: 'single-leg-glute-bridge',
    name: 'Ettbens glute bridge',
    muscleGroup: 'legs',
    primaryMuscles: ['glute_max'],
    secondaryMusclesDetailed: ['biceps_femoris', 'glute_med', 'erector_spinae'],
    movementPattern: 'hinge',
    tier: 'compound_secondary',
    equipmentTypes: ['bodyweight'],
    equipment: 'Kroppsvekt',
    difficulty: 'intermediate',
    cues: ['Ett ben strekkes rett opp', 'Press hoften til rett linje', 'Unngå hofterotasjon – hold stabilt'],
    description: 'Unilateral variant av glute bridge. Dobbel gluteus-aktivering per rep sammenlignet med bilateral.',
  },

  {
    id: 'good-morning',
    name: 'Good morning',
    muscleGroup: 'back',
    primaryMuscles: ['erector_spinae', 'biceps_femoris', 'semitendinosus', 'glute_max'],
    secondaryMusclesDetailed: ['multifidus', 'adductors'],
    movementPattern: 'hinge',
    tier: 'compound_secondary',
    equipmentTypes: ['barbell'],
    equipment: 'Stang',
    difficulty: 'intermediate',
    cues: ['Stang på øvre rygg som knebøy', 'Bøy i hoften og hold knærne lett bøyd', 'Nøytral ryggrad gjennom hele'],
    description: 'Styrker korsrygg og hamstrings i hengsel-bevegelse. Lett vekt og god teknikk er avgjørende.',
  },

  {
    id: 'kettlebell-swing',
    name: 'Kettlebell sving',
    muscleGroup: 'legs',
    primaryMuscles: ['glute_max', 'biceps_femoris', 'erector_spinae'],
    secondaryMusclesDetailed: ['trap_upper', 'delt_anterior', 'rectus_abdominis', 'transverse_abdominis'],
    movementPattern: 'hinge',
    tier: 'compound_secondary',
    equipmentTypes: ['kettlebell'],
    equipment: 'Kettlebell',
    difficulty: 'intermediate',
    cues: ['Eksplosiv hofteekstensjon er drivet – ikke armene', 'La klokken svinge som en pendel', 'Stram core og seter på toppen'],
    description: 'Kraftfullt posterior kjede-kardio. Kombinerer styrke og kondisjon. Ballistic hinge-bevegelse.',
  },

  // ─────────────────────────────────────────────────────────────────
  // KNEBØY – quad/setedominant
  // ─────────────────────────────────────────────────────────────────

  {
    id: 'back-squat',
    name: 'Knebøy',
    muscleGroup: 'legs',
    primaryMuscles: ['rectus_femoris', 'vastus_lateralis', 'vastus_medialis', 'vastus_intermedius', 'glute_max'],
    secondaryMusclesDetailed: ['glute_med', 'adductors', 'erector_spinae', 'biceps_femoris'],
    movementPattern: 'squat',
    tier: 'compound_primary',
    equipmentTypes: ['barbell'],
    equipment: 'Stang',
    difficulty: 'intermediate',
    cues: ['Bryst opp, blikk rett frem', 'Kne følger tærnes retning gjennom hele bevegelsen', 'Bunn under parallell hvis bevegeligheten tillater det'],
    description: 'Kongeøvelsen for bein. Aktiverer hele nedre kropp og korsryggen som stabilisator. Krever godt stabilverk.',
  },

  {
    id: 'front-squat',
    name: 'Front knebøy',
    muscleGroup: 'legs',
    primaryMuscles: ['rectus_femoris', 'vastus_lateralis', 'vastus_medialis', 'vastus_intermedius'],
    secondaryMusclesDetailed: ['glute_max', 'erector_spinae', 'adductors'],
    movementPattern: 'squat',
    tier: 'compound_primary',
    equipmentTypes: ['barbell'],
    equipment: 'Stang',
    difficulty: 'advanced',
    cues: ['Stangen hviler på fremre deltoid – ikke hendene', 'Albuene peker rett frem og høyt', 'Mer opprett overkropp enn bakknebøy'],
    description: 'Mer kvadriceps-dominant enn bakknebøy. Krever god bevegelighet i ankler og skuldre.',
  },

  {
    id: 'goblet-squat',
    name: 'Goblet knebøy',
    muscleGroup: 'legs',
    primaryMuscles: ['rectus_femoris', 'vastus_lateralis', 'vastus_medialis', 'glute_max'],
    secondaryMusclesDetailed: ['adductors', 'erector_spinae', 'glute_med'],
    movementPattern: 'squat',
    tier: 'compound_secondary',
    equipmentTypes: ['kettlebell', 'dumbbell'],
    equipment: 'Kettlebell / Manualer',
    difficulty: 'beginner',
    cues: ['Hold vekten ved brystet som en kopp', 'Dyp bøy – albuene innenfor knærne i bunn', 'Oppreist overkropp gjennom hele'],
    description: 'Utmerket innlæringsøvelse for knebøy-mønsteret. Vekten foran gir naturlig motvekt for dyp knebøy.',
  },

  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarske split knebøy',
    muscleGroup: 'legs',
    primaryMuscles: ['rectus_femoris', 'vastus_lateralis', 'glute_max'],
    secondaryMusclesDetailed: ['biceps_femoris', 'adductors', 'glute_med', 'glute_min'],
    movementPattern: 'squat',
    tier: 'compound_secondary',
    equipmentTypes: ['dumbbell', 'bodyweight'],
    equipment: 'Manualer / Benk',
    difficulty: 'intermediate',
    cues: ['Bakfot på benk ca. knehøyde', 'Fremre kne spores over tå – ikke innad', 'Senk hoften rett ned'],
    description: 'Den mest krevende unilaterale benøvelsen. Avdekker styrke-asymmetrier og krever balanse og hoftebevegelighet.',
  },

  {
    id: 'lunge',
    name: 'Utfall',
    muscleGroup: 'legs',
    primaryMuscles: ['rectus_femoris', 'vastus_lateralis', 'glute_max'],
    secondaryMusclesDetailed: ['biceps_femoris', 'adductors', 'glute_med'],
    movementPattern: 'squat',
    tier: 'compound_secondary',
    equipmentTypes: ['bodyweight', 'dumbbell'],
    equipment: 'Kroppsvekt / Manualer',
    difficulty: 'beginner',
    cues: ['Skritt fremover, senk bakkneet mot gulvet', 'Fremre kne over tå – ikke utenfor', 'Oppreist overkropp – ikke len fremover'],
    description: 'Funksjonell bevegelseøvelse for quad og sete. Fremover-utfall belaster kneet mer enn bakover-utfall.',
  },

  {
    id: 'reverse-lunge',
    name: 'Bakover utfall',
    muscleGroup: 'legs',
    primaryMuscles: ['rectus_femoris', 'vastus_lateralis', 'glute_max'],
    secondaryMusclesDetailed: ['biceps_femoris', 'adductors', 'glute_med'],
    movementPattern: 'squat',
    tier: 'compound_secondary',
    equipmentTypes: ['bodyweight', 'dumbbell'],
    equipment: 'Kroppsvekt / Manualer',
    difficulty: 'beginner',
    cues: ['Ta skritt bakover – ikke fremover', 'Mer kne-vennlig enn fremover-utfall', 'Senk kneet nær gulvet'],
    description: 'Mer kneskånsom enn fremover-utfall. Anbefalt for de med kneproblem.',
  },

  {
    id: 'walking-lunge',
    name: 'Gående utfall',
    muscleGroup: 'legs',
    primaryMuscles: ['rectus_femoris', 'vastus_lateralis', 'glute_max', 'biceps_femoris'],
    secondaryMusclesDetailed: ['adductors', 'glute_med', 'erector_spinae'],
    movementPattern: 'squat',
    tier: 'compound_secondary',
    equipmentTypes: ['dumbbell', 'bodyweight'],
    equipment: 'Manualer',
    difficulty: 'intermediate',
    cues: ['Kontinuerlig gående mønster', 'Balanse-krav er høyere enn statiske utfall', 'Holdes plass – krever lengde'],
    description: 'Dynamisk variant. Kombinerer balanse, koordinasjon og benstyrke. God kondisjonell komponent ved høyt volum.',
  },

  {
    id: 'leg-press',
    name: 'Benpress',
    muscleGroup: 'legs',
    primaryMuscles: ['rectus_femoris', 'vastus_lateralis', 'vastus_medialis', 'glute_max'],
    secondaryMusclesDetailed: ['biceps_femoris', 'adductors', 'gastrocnemius'],
    movementPattern: 'squat',
    tier: 'compound_secondary',
    equipmentTypes: ['machine'],
    equipment: 'Maskin',
    difficulty: 'beginner',
    cues: ['Kne sporer over tå gjennom hele bevegelsen', 'Ikke lås ut knærne på toppen', 'Fothøyde og -bredde styrer fokus'],
    description: 'Maskinøvelse for bein uten krav til balanse eller stabilitet. God for isolert belastning og høyt volum.',
  },

  {
    id: 'step-up',
    name: 'Step-up',
    muscleGroup: 'legs',
    primaryMuscles: ['rectus_femoris', 'vastus_lateralis', 'glute_max'],
    secondaryMusclesDetailed: ['glute_med', 'biceps_femoris', 'gastrocnemius'],
    movementPattern: 'squat',
    tier: 'compound_secondary',
    equipmentTypes: ['dumbbell', 'bodyweight'],
    equipment: 'Kasse / Benk',
    difficulty: 'beginner',
    cues: ['Trykk gjennom hele foten på kassen', 'Unngå å sparke opp fra bakbenet', 'Boksens høyde styrer intensiteten'],
    description: 'Funksjonell og kneskånsom enbeinsøvelse. God for hofteekstensjon og stabilitet.',
  },

  {
    id: 'pistol-squat',
    name: 'Pistolknebøy',
    muscleGroup: 'legs',
    primaryMuscles: ['rectus_femoris', 'vastus_lateralis', 'vastus_medialis', 'glute_max'],
    secondaryMusclesDetailed: ['glute_med', 'adductors', 'hip_flexors', 'transverse_abdominis'],
    movementPattern: 'squat',
    tier: 'compound_primary',
    equipmentTypes: ['bodyweight'],
    equipment: 'Kroppsvekt',
    difficulty: 'advanced',
    cues: ['Begynn med assistert variant (TRX / stol)', 'Fri fot holdes rett frem og opp', 'Sett til annkelen – ikke bare parallell'],
    description: 'Avansert unilateral knebøy. Krever ankelmobilitet, balanseevne og høy relative styrke.',
  },

  // ─────────────────────────────────────────────────────────────────
  // ISOLASJON – bein
  // ─────────────────────────────────────────────────────────────────

  {
    id: 'leg-extension',
    name: 'Leg extension',
    muscleGroup: 'legs',
    primaryMuscles: ['rectus_femoris', 'vastus_lateralis', 'vastus_medialis', 'vastus_intermedius'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['machine'],
    equipment: 'Maskin',
    difficulty: 'beginner',
    cues: ['Full strekk – men stopp rett før albuene låser', 'Kontrollert ned – ikke dropp vekten', 'Kan gjøres unilateralt for asymmetri-arbeid'],
    description: 'Quad-isolasjonsøvelse. Utsetter patella for belastning ved full ekstensjon – lettere vekt anbefales.',
  },

  {
    id: 'lying-leg-curl',
    name: 'Liggende leg curl',
    muscleGroup: 'legs',
    primaryMuscles: ['biceps_femoris', 'semitendinosus', 'semimembranosus'],
    secondaryMusclesDetailed: ['gastrocnemius'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['machine'],
    equipment: 'Maskin',
    difficulty: 'beginner',
    cues: ['Full curl til hælen nær setet', 'Langsom eksentrisk fase (3 sek ned)', 'Hoften holdes ned mot puten'],
    description: 'Hamstrings-isolasjonsøvelse. Eksentrisk styrke i hamstrings er skadesforebyggende for bakre korsbånd.',
  },

  {
    id: 'calf-raise',
    name: 'Tåhev',
    muscleGroup: 'legs',
    primaryMuscles: ['gastrocnemius', 'soleus'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['bodyweight', 'machine'],
    equipment: 'Kroppsvekt / Maskin',
    difficulty: 'beginner',
    cues: ['Full bevegelse: helt ned til strekk, opp til tå', 'Pause øverst for full kontraksjon', 'Bøyde kne → mer soleus; strakt kne → mer gastrocnemius'],
    description: 'Nødvendig supplement fordi leggmuskler sjelden trenes tilstrekkelig av sammensatte øvelser.',
  },

  {
    id: 'hip-abduction',
    name: 'Hofteabduksjon',
    muscleGroup: 'legs',
    primaryMuscles: ['glute_med', 'glute_min'],
    secondaryMusclesDetailed: ['tensor_fasciae_latae'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['machine', 'cable'],
    equipment: 'Maskin / Kabel',
    difficulty: 'beginner',
    cues: ['Kontrollert bevegelse – ikke sving', 'Kroppen forblir stabil under bevegelsen', 'Kan erstattes med sideband-gange'],
    description: 'Isolerer gluteus medius som stabiliserer kneet og hoften. Viktig for knetracking i knebøy og utfall.',
  },

  // ─────────────────────────────────────────────────────────────────
  // CORE
  // ─────────────────────────────────────────────────────────────────

  {
    id: 'plank',
    name: 'Planken',
    muscleGroup: 'core',
    primaryMuscles: ['rectus_abdominis', 'transverse_abdominis'],
    secondaryMusclesDetailed: ['oblique_internal', 'oblique_external', 'erector_spinae', 'glute_max'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['bodyweight'],
    equipment: 'Kroppsvekt',
    difficulty: 'beginner',
    cues: ['Kroppen som én rett planke fra hode til hæl', 'Klem setemusklene og trekk navlen inn', 'Sett tid fremfor reps – 20–60 sek'],
    description: 'Grunnleggende anti-ekstensjon core-øvelse. Aktiverer transversus abdominis og ryggsøylestabilisatorer.',
  },

  {
    id: 'side-plank',
    name: 'Sideplank',
    muscleGroup: 'core',
    primaryMuscles: ['oblique_external', 'oblique_internal', 'quadratus_lumborum'],
    secondaryMusclesDetailed: ['glute_med', 'transverse_abdominis'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['bodyweight'],
    equipment: 'Kroppsvekt',
    difficulty: 'beginner',
    cues: ['Hofte oppe – ikke synk ned', 'Kroppen i én rett linje sett fra siden', 'Progresjon: løft øvre ben for mer glute med'],
    description: 'Anti-lateral-fleksjon. Aktiverer quadratus lumborum og skrå magemuskulatur.',
  },

  {
    id: 'dead-bug',
    name: 'Dead bug',
    muscleGroup: 'core',
    primaryMuscles: ['rectus_abdominis', 'transverse_abdominis'],
    secondaryMusclesDetailed: ['psoas', 'oblique_internal', 'oblique_external'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['bodyweight'],
    equipment: 'Kroppsvekt',
    difficulty: 'beginner',
    cues: ['Korsryggen presset mot gulvet gjennom hele', 'Mottstående arm og ben strekkes langsomt ut', 'Pust ut i den eksentriske fasen'],
    description: 'Utmerket for å lære korsryggen å holde nøytral posisjon under ekstremitetsbevegelse. Anbefales for alle nivåer.',
  },

  {
    id: 'crunch',
    name: 'Crunch',
    muscleGroup: 'core',
    primaryMuscles: ['rectus_abdominis'],
    secondaryMusclesDetailed: ['oblique_external', 'oblique_internal'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['bodyweight'],
    equipment: 'Kroppsvekt',
    difficulty: 'beginner',
    cues: ['Kort bevegelse – bare skuldrene løftes', 'Ikke trekk i nakken', 'Kontrollert tempo – ingen sving'],
    description: 'Klassisk rectus abdominis-isolasjon. Begrenset bevegelsesutslag gjør den skånsom for korsryggen.',
  },

  {
    id: 'bicycle-crunch',
    name: 'Sykkelcrunch',
    muscleGroup: 'core',
    primaryMuscles: ['rectus_abdominis', 'oblique_external', 'oblique_internal'],
    secondaryMusclesDetailed: ['hip_flexors'],
    movementPattern: 'rotation',
    tier: 'isolation',
    equipmentTypes: ['bodyweight'],
    equipment: 'Kroppsvekt',
    difficulty: 'beginner',
    cues: ['Roter overkroppen – ikke bare albuene', 'Motstående albue møter motstående kne', 'Langsomt og kontrollert – ikke sykkel-hastighet'],
    description: 'Kombinerer rektus abdominis og skrå magemuskulatur. En av de høyest rangerte core-øvelsene i EMG-studier.',
  },

  {
    id: 'leg-raises',
    name: 'Beinhev',
    muscleGroup: 'core',
    primaryMuscles: ['rectus_abdominis'],
    secondaryMusclesDetailed: ['psoas', 'hip_flexors'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['bodyweight'],
    equipment: 'Kroppsvekt',
    difficulty: 'beginner',
    cues: ['Korsryggen mot gulvet gjennom hele bevegelsen', 'Strake eller lett bøyde kne', 'Stopp rett FØR bena synker til gulvet'],
    description: 'Aktiverer nedre del av rectus abdominis og hoftefleksorer. Korsrygg mot gulvet er avgjørende for sikkerhet.',
  },

  {
    id: 'hanging-leg-raises',
    name: 'Hengende beinhev',
    muscleGroup: 'core',
    primaryMuscles: ['rectus_abdominis'],
    secondaryMusclesDetailed: ['psoas', 'hip_flexors', 'oblique_internal', 'oblique_external'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['bodyweight'],
    equipment: 'Bom',
    difficulty: 'intermediate',
    cues: ['Heng i bom, skuldrene aktivt nede', 'Bøy beina i begynnelsen som progresjonssteg', 'Unngå sving – kontrollert ned'],
    description: 'Avansert core-øvelse som også krever gripestyrke og skulder-stabilitet.',
  },

  {
    id: 'russian-twist',
    name: 'Russian twist',
    muscleGroup: 'core',
    primaryMuscles: ['oblique_external', 'oblique_internal'],
    secondaryMusclesDetailed: ['rectus_abdominis', 'transverse_abdominis'],
    movementPattern: 'rotation',
    tier: 'isolation',
    equipmentTypes: ['bodyweight'],
    equipment: 'Kroppsvekt / Vektplate',
    difficulty: 'beginner',
    cues: ['Sett med lett bakover-vinkel på overkroppen', 'Roter overkroppen, ikke bare armene', 'Legg kan løftes for økt vanskelighetsgrad'],
    description: 'Rotasjons-core øvelse. Kan lastes med vektplate, medisinball eller kabel for mer motstand.',
  },

  {
    id: 'ab-wheel',
    name: 'Ab-hjul',
    muscleGroup: 'core',
    primaryMuscles: ['rectus_abdominis', 'transverse_abdominis'],
    secondaryMusclesDetailed: ['oblique_internal', 'oblique_external', 'lat', 'triceps_long'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['bodyweight'],
    equipment: 'Ab-hjul',
    difficulty: 'advanced',
    cues: ['Begynn med korte ruller, bygg ut gradvis', 'Korsryggen holdes nøytral – ikke la hoften synke', 'Langsom og kontrollert ut og inn'],
    description: 'En av de mest krevende anti-ekstensjonsøvelsene. Aktiverer hele anterior kjede fra lat til quad.',
  },

  {
    id: 'cable-crunch',
    name: 'Kabelcrunch',
    muscleGroup: 'core',
    primaryMuscles: ['rectus_abdominis'],
    secondaryMusclesDetailed: ['oblique_external', 'oblique_internal'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['cable'],
    equipment: 'Kabel',
    difficulty: 'beginner',
    cues: ['Kneling under høy kabel med taugrep', 'Kurl nedover ved å bøye i midjen – ikke bare hoften', 'Vekten gir progressiv overbelastning'],
    description: 'Den beste øvelsen for progressiv overbelastning av rectus abdominis. Kan økes i vekt som alle andre styrkeøvelser.',
  },

  {
    id: 'back-extension',
    name: 'Rygghev',
    muscleGroup: 'back',
    primaryMuscles: ['erector_spinae', 'multifidus'],
    secondaryMusclesDetailed: ['glute_max', 'biceps_femoris'],
    movementPattern: 'hinge',
    tier: 'isolation',
    equipmentTypes: ['machine', 'bodyweight'],
    equipment: 'Rygghevsmaskin',
    difficulty: 'beginner',
    cues: ['Hev overkroppen til parallell med gulvet – ikke overekstend', 'Klem setemusklene øverst', 'Kan holdes med vektplate på brystet'],
    description: 'Styrker korsryggen isolert. Viktig motveier mot alle flesleddsøvelser som belaster ryggen.',
  },

  // ─────────────────────────────────────────────────────────────────
  // BICEPS
  // ─────────────────────────────────────────────────────────────────

  {
    id: 'barbell-curl',
    name: 'Bicepscurl (stang)',
    muscleGroup: 'arms',
    primaryMuscles: ['biceps_brachii'],
    secondaryMusclesDetailed: ['brachialis', 'brachioradialis'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['barbell'],
    equipment: 'Stang / EZ-stang',
    difficulty: 'beginner',
    cues: ['Albuer stasjonære inntil kroppen', 'Supiner håndleddet øverst for full kontraksjon', 'Langsom eksentrisk – 2–3 sek ned'],
    description: 'Effektiv biceps-overbelastningsøvelse. EZ-stang er skånsom mot håndledd.',
  },

  {
    id: 'dumbbell-curl',
    name: 'Manualcurl',
    muscleGroup: 'arms',
    primaryMuscles: ['biceps_brachii'],
    secondaryMusclesDetailed: ['brachialis', 'brachioradialis'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['dumbbell'],
    equipment: 'Manualer',
    difficulty: 'beginner',
    cues: ['Kan alternere armer for mer fokus per side', 'Supiner håndleddet ved curling opp', 'Unngå sving – hjelp ikke med overkroppen'],
    description: 'Gir mer bevegelsesutslag enn stang og muligheten til å jobbe unilateralt.',
  },

  {
    id: 'hammer-curl',
    name: 'Hammercurl',
    muscleGroup: 'arms',
    primaryMuscles: ['brachialis', 'brachioradialis'],
    secondaryMusclesDetailed: ['biceps_brachii'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['dumbbell'],
    equipment: 'Manualer',
    difficulty: 'beginner',
    cues: ['Nøytralt grep – tommel peker opp', 'Albuer stasjonære ved siden av kroppen', 'Brachialis legger til armtykkelse mellom biceps og triceps'],
    description: 'Treffer brachialis og brachioradialis sterkere enn standard curl. Bidrar til armtykkelse.',
  },

  {
    id: 'cable-curl',
    name: 'Kabelcurl',
    muscleGroup: 'arms',
    primaryMuscles: ['biceps_brachii'],
    secondaryMusclesDetailed: ['brachialis', 'brachioradialis'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['cable'],
    equipment: 'Kabel',
    difficulty: 'beginner',
    cues: ['Konstant spenning i motsetning til manualer', 'Lav kabel gir full range inkludert bunn-posisjon', 'Kan gjøres unilateralt'],
    description: 'Konstant kabelbelastning gjennom hele bevegelsesutslaget. Kombinert med manualer for fullstendig bicepsarbeid.',
  },

  {
    id: 'preacher-curl',
    name: 'Predikantcurl',
    muscleGroup: 'arms',
    primaryMuscles: ['biceps_brachii'],
    secondaryMusclesDetailed: ['brachialis'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['machine', 'barbell'],
    equipment: 'Predikantbenk / EZ-stang',
    difficulty: 'beginner',
    cues: ['Armene på puten fjerner muligheten for sving', 'Full strekk ned, full kontraksjon opp', 'Ikke overekstend i bunn-posisjonen'],
    description: 'Fjerner muligheten for juks. Isolerer biceps fullstendig ved å låse overarmen mot puten.',
  },

  {
    id: 'incline-dumbbell-curl',
    name: 'Incline manualcurl',
    muscleGroup: 'arms',
    primaryMuscles: ['biceps_brachii'],
    secondaryMusclesDetailed: ['brachialis'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['dumbbell'],
    equipment: 'Manualer / Skrå benk',
    difficulty: 'intermediate',
    cues: ['Ligg på skrå benk ca. 45–60°', 'Armene henger vertikalt ned – gir maksimal strekk', 'Curl langsomt – kjenn strykk i bunn'],
    description: 'Gir lengre strekk i biceps enn vanlig curl. Aktiverer langt hode av biceps maksimalt.',
  },

  // ─────────────────────────────────────────────────────────────────
  // TRICEPS
  // ─────────────────────────────────────────────────────────────────

  {
    id: 'triceps-pushdown',
    name: 'Triceps pushdown',
    muscleGroup: 'arms',
    primaryMuscles: ['triceps_lateral', 'triceps_medial'],
    secondaryMusclesDetailed: ['triceps_long', 'brachioradialis'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['cable'],
    equipment: 'Kabel',
    difficulty: 'beginner',
    cues: ['Albuer inntil kroppen – beveger seg ikke', 'Fullt strekk i bunn – lås ut albuene', 'Taugrep gir ekstern rotasjon og mer aktivering'],
    description: 'Den vanligste triceps-isolasjonsøvelsen. Kabel gir konstant spenning gjennom hele bevegelsen.',
  },

  {
    id: 'skull-crushers',
    name: 'Skull crushers',
    muscleGroup: 'arms',
    primaryMuscles: ['triceps_long', 'triceps_lateral', 'triceps_medial'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['barbell'],
    equipment: 'Stang / EZ-stang',
    difficulty: 'intermediate',
    cues: ['Ligg på benk, stangen over brystet', 'Bøy bare i albuene – ikke skuldrene', 'Senk til panna – ikke bak hodet'],
    description: 'Høy overbelastning på alle tre tricepshoder. EZ-stang er mer skånsom for håndledd enn rett stang.',
  },

  {
    id: 'overhead-triceps-extension',
    name: 'Overhead tricepsextensjon',
    muscleGroup: 'arms',
    primaryMuscles: ['triceps_long', 'triceps_lateral'],
    secondaryMusclesDetailed: ['triceps_medial'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['dumbbell', 'cable'],
    equipment: 'Manual / Kabel',
    difficulty: 'beginner',
    cues: ['Armene overhead med albuene pekende opp', 'Senk vekten bak hodet – albuer beveger seg ikke', 'Overhead-posisjon strekker langt hode maksimalt'],
    description: 'Det lange triceps-hodet er strekkempfindelig i overhead-posisjon. Gir unik stimulering av caput longum.',
  },

  {
    id: 'triceps-dip',
    name: 'Triceps dips',
    muscleGroup: 'arms',
    primaryMuscles: ['triceps_long', 'triceps_lateral', 'triceps_medial'],
    secondaryMusclesDetailed: ['delt_anterior', 'pec_major_lower'],
    movementPattern: 'isolation',
    tier: 'compound_secondary',
    equipmentTypes: ['bodyweight'],
    equipment: 'Benk / Dipsstenger',
    difficulty: 'intermediate',
    cues: ['Oppreist overkropp gir mer tricepsfokus enn brystfokus', 'Albuer peker bakover – ikke ut til siden', 'Ikke synk dypere enn 90° i albuen'],
    description: 'Kroppsvektøvelse for triceps. Enkelt belastet variant med rygg mot benk er letteste progresjon.',
  },

  {
    id: 'triceps-kickback',
    name: 'Triceps kickback',
    muscleGroup: 'arms',
    primaryMuscles: ['triceps_lateral', 'triceps_medial'],
    secondaryMusclesDetailed: ['triceps_long'],
    movementPattern: 'isolation',
    tier: 'isolation',
    equipmentTypes: ['dumbbell'],
    equipment: 'Manualer',
    difficulty: 'beginner',
    cues: ['Overarmen låst parallelt med gulvet', 'Strekk albuene fullt ut bak', 'Lett vekt – styrken er lav i denne posisjonen'],
    description: 'Isolasjonsøvelse for lateralt og medialt tricepshode. Funksjonelt begrenset men god for pre-exhaust.',
  },

  // ─────────────────────────────────────────────────────────────────
  // TOTALØVELSER
  // ─────────────────────────────────────────────────────────────────

  {
    id: 'burpee',
    name: 'Burpee',
    muscleGroup: 'chest',
    primaryMuscles: ['pec_major_upper', 'pec_major_lower', 'delt_anterior', 'triceps_long', 'rectus_femoris', 'glute_max'],
    secondaryMusclesDetailed: ['rectus_abdominis', 'gastrocnemius', 'soleus'],
    movementPattern: 'full_body',
    tier: 'compound_primary',
    equipmentTypes: ['bodyweight'],
    equipment: 'Kroppsvekt',
    difficulty: 'intermediate',
    cues: ['Eksplosiv oppgang', 'Kontrollert ned i pushup-posisjon', 'Kombinerer styrke og kondisjon'],
    description: 'Total-kropp-øvelse med høy metabolisk kostnad. Pushup → hopp → stående i ett flyt.',
  },

  {
    id: 'farmers-carry',
    name: 'Farmers carry',
    muscleGroup: 'back',
    primaryMuscles: ['trap_upper', 'trap_middle'],
    secondaryMusclesDetailed: ['glute_max', 'glute_med', 'erector_spinae', 'transverse_abdominis', 'rectus_femoris'],
    movementPattern: 'carry',
    tier: 'compound_secondary',
    equipmentTypes: ['dumbbell', 'kettlebell'],
    equipment: 'Manualer / Kettlebell',
    difficulty: 'beginner',
    cues: ['Tung vekt, oppreist holdning', 'Skulderbladene nede og inn', 'Korte steg, stabil core gjennom hele'],
    description: 'Funksjonell totaløvelse. Trener grip-styrke, traps, core og ankkel-stabilitet.',
  },

  {
    id: 'turkish-get-up',
    name: 'Turkish get-up',
    muscleGroup: 'shoulders',
    primaryMuscles: ['delt_anterior', 'delt_lateral', 'glute_max'],
    secondaryMusclesDetailed: ['transverse_abdominis', 'oblique_internal', 'oblique_external', 'rectus_femoris', 'trap_lower'],
    movementPattern: 'full_body',
    tier: 'compound_primary',
    equipmentTypes: ['kettlebell'],
    equipment: 'Kettlebell',
    difficulty: 'advanced',
    cues: ['Øyet på klokken gjennom hele bevegelsen', 'Lær stegene separat', 'Veldig lett vekt til teknikken er låst'],
    description: 'Krevende helhets-bevegelse fra liggende til stående med klokke over hodet. Avdekker asymmetrier og stabilitetsmangel.',
  },

]

// ─────────────────────────────────────────────────────────────────
// Hjelpefunksjoner
// ─────────────────────────────────────────────────────────────────

export function getByMuscleGroup(group: MuscleGroup): Exercise[] {
  return EXERCISES.filter(e => e.muscleGroup === group)
}

export function getById(id: string): Exercise | undefined {
  return EXERCISES.find(e => e.id === id)
}

export function getByIds(ids: string[]): Exercise[] {
  return ids.flatMap(id => {
    const e = EXERCISES.find(ex => ex.id === id)
    return e ? [e] : []
  })
}

export function getByMovementPattern(pattern: import('./types').MovementPattern): Exercise[] {
  return EXERCISES.filter(e => e.movementPattern === pattern)
}

export function getByEquipment(available: import('./types').Equipment[]): Exercise[] {
  return EXERCISES.filter(e =>
    e.equipmentTypes.some(eq => available.includes(eq))
  )
}

export function getByDifficulty(difficulty: import('./types').Difficulty): Exercise[] {
  return EXERCISES.filter(e => e.difficulty === difficulty)
}

export function getCompoundExercises(): Exercise[] {
  return EXERCISES.filter(e =>
    e.tier === 'compound_primary' || e.tier === 'compound_secondary'
  )
}

/**
 * Finner øvelser som er "like" en gitt øvelse, rangert etter likhet.
 *
 * Likhetskriterier (begge må oppfylles):
 *   1. Samme movementPattern  — øvelsen krever samme bevegelsesmønster
 *   2. Minst én felles primaryMuscle — treffer de samme primærmusklene
 *
 * Sorteringsrekkefølge:
 *   1. Samme tier (mest sammenlignbar vektmessig)
 *   2. Flest felles primaryMuscles
 */
export function findSimilarExercises(exerciseId: string): Exercise[] {
  const source = EXERCISES.find(e => e.id === exerciseId)
  if (!source) return []

  const sourceMuscleset = new Set(source.primaryMuscles)

  return EXERCISES
    .filter(e => {
      if (e.id === exerciseId) return false
      if (e.movementPattern !== source.movementPattern) return false
      return e.primaryMuscles.some(m => sourceMuscleset.has(m))
    })
    .sort((a, b) => {
      // Prioriter samme tier
      const aTierMatch = a.tier === source.tier ? 1 : 0
      const bTierMatch = b.tier === source.tier ? 1 : 0
      if (bTierMatch !== aTierMatch) return bTierMatch - aTierMatch
      // Deretter flest felles muskler
      const aOverlap = a.primaryMuscles.filter(m => sourceMuscleset.has(m)).length
      const bOverlap = b.primaryMuscles.filter(m => sourceMuscleset.has(m)).length
      return bOverlap - aOverlap
    })
}
