/**
 * Steg-for-steg instruksjoner for alle øvelser – norsk
 *
 * Hvert array-element er ett steg som vises sekvensielt i UI-et.
 * Kilde: NSCA Basics of Strength and Conditioning,
 *        Bret Contreras – Bodyweight Strength Training Anatomy,
 *        ExRx.net Movement Library
 */

export const EXERCISE_INSTRUCTIONS: Record<string, string[]> = {

  // ───────────────────────────────────────────────
  // BRYST
  // ───────────────────────────────────────────────

  'bench-press': [
    'Legg deg på benken med øynene rett under stangen.',
    'Grep litt bredere enn skulderbredde med overgrep.',
    'Trekk skuldrene ned og bakover mot benken – hold dem der gjennom hele løftet.',
    'Senk stangen kontrollert til nedre bryst med ca. 45° albuevinkel mot kroppen.',
    'Press opp og lett bakover til armene er strake – ikke rett vertikalt.',
    'Hold kontakten mellom fot, rygg og benk gjennom hele.',
  ],

  'incline-bench-press': [
    'Juster benken til 30–45° vinkel.',
    'Legg deg med skuldrene tett mot rygglenet, grep litt bredere enn skulderbredde.',
    'Trekk skuldrene ned og bakover – hold dem stabilt mot rygglenet.',
    'Senk stangen mot øvre bryst med albuer ca. 45° ut fra kroppen.',
    'Press opp til armene er strake.',
  ],

  'decline-bench-press': [
    'Lås beina fast i benkens fotfeste.',
    'Legg deg ned på nedoverskrå benken.',
    'Grep litt bredere enn skulderbredde med overgrep.',
    'Senk stangen kontrollert mot nedre bryst.',
    'Press opp til full armstrekk.',
  ],

  'dumbbell-bench-press': [
    'Sett deg på kanten av benken med manualene på lårene.',
    'Legg deg bakover og press manualene opp med lårene som hjelp til startposisjon.',
    'Hold manualene med håndflaten fremover, litt bredere enn skulderbredde.',
    'Senk kontrollert ned til full strekk i brystet – større bane enn stang.',
    'Press opp og la manualene nærme seg hverandre øverst uten å slå dem mot hverandre.',
  ],

  'push-ups': [
    'Plasser hendene litt bredere enn skulderbredde på gulvet.',
    'Strekk kroppen til en rett planke fra hode til hæl – klem setemusklene.',
    'Albuer peker ca. 45° ut fra kroppen – ikke rett til siden.',
    'Senk brystet ned til nær gulvet i kontrollert tempo.',
    'Press opp til armene nesten er strake.',
  ],

  'knee-push-ups': [
    'Kneel ned og plasser hendene litt bredere enn skulderbredde.',
    'Hold rett linje fra kne til hode – ikke la hoften henge ned.',
    'Albuer peker ca. 45° ut fra kroppen.',
    'Senk brystet ned til nær gulvet.',
    'Press opp til armene nesten er strake.',
  ],

  'chest-dip': [
    'Grip dipsstengene og press kroppen opp til full armstrekk.',
    'Hel fremover med overkroppen for brystfokus – ikke stå rett opp.',
    'Senk deg kontrollert ned til ca. 90° vinkel i albuene.',
    'Press opp uten å låse albuene helt ut.',
    'Hold albuer ca. 45° ut fra kroppen gjennom hele.',
  ],

  'dumbbell-chest-fly': [
    'Ligg på flat benk med en manual i hver hånd direkte over brystet.',
    'Ha en liten bøy i albuene – hold den gjennom hele bevegelsen.',
    'Senk armene ut til siden i en bue til du kjenner godt strekk i brystet.',
    'Bring armene tilbake i samme bue – tenk «klem et tre».',
    'Ikke press som i benkpress – albuer forblir litt bøyde.',
  ],

  'cable-chest-fly': [
    'Still kabelmaskinen slik at kablene er i ønsket høyde (høy = nedre bryst, lav = øvre bryst).',
    'Stå midt mellom stativene og ta ett skritt frem for stabilitet.',
    'Grip håndtakene og hel lett fremover med liten bøy i albuene.',
    'Bring armene forover og inn i en bue – kryss hendene i midten for full kontraksjon.',
    'Slipp kontrollert tilbake til startposisjon.',
  ],

  // ───────────────────────────────────────────────
  // SKULDRE
  // ───────────────────────────────────────────────

  'overhead-press': [
    'Plasser stangen i rack i skulderhøyde og grep litt bredere enn skulderbredde.',
    'Stå med føttene skulderbredde og aktiver core og seter.',
    'Løft stangen av rack og hold den mot øvre bryst.',
    'Press stangen rett opp – hode lett bakover for å unngå ansiktet.',
    'Lås ut armene øverst slik at stangen er over hodets midte.',
    'Senk kontrollert tilbake til øvre bryst.',
  ],

  'dumbbell-shoulder-press': [
    'Sett deg på en stol med ryggstøtte eller stå med føttene skulderbredde.',
    'Start med manualene i ørehøyde, håndflaten fremover.',
    'Press opp og lett inn mot hverandre.',
    'Unngå å vippe ryggen bakover – hold core aktivt.',
    'Senk kontrollert tilbake til ørehøyde.',
  ],

  'arnold-press': [
    'Sett deg med ryggstøtte og hold manualene foran ansiktet med håndflatene mot deg.',
    'Press opp mens du roterer håndflaten gradvis utover.',
    'Øverst peker håndflatene fremover og armene er strake.',
    'Roter tilbake til håndflatene mot deg mens du senker.',
    'Bevegelsen er en kombinasjon av rotasjon og press – ikke separate faser.',
  ],

  'lateral-raise': [
    'Stå oppreist med en manual i hver hånd ved siden av kroppen.',
    'Ha en liten bøy i albuene – hold den gjennom hele bevegelsen.',
    'Løft armene til siden til skulderhøyde – ikke høyere.',
    'Pause 1 sekund øverst for full aktivering av midtre skulder.',
    'Senk kontrollert over 2–3 sekunder – ingen sving fra overkroppen.',
  ],

  'front-raise': [
    'Stå oppreist med manualene foran lårene, håndflaten ned.',
    'Hold en liten bøy i albuene.',
    'Løft en arm (eller begge) rett fremover til skulderhøyde.',
    'Pause 1 sekund øverst.',
    'Senk kontrollert tilbake og alternér armer.',
  ],

  'rear-delt-fly': [
    'Hel fremover 45–90° fra hoften, eller sett deg med brystet mot et fremoverhelt kne.',
    'Hold manualene med en liten bøy i albuene.',
    'Løft armene ut til siden til de er parallelle med gulvet.',
    'Klem skulderbladen mot hverandre øverst.',
    'Senk kontrollert tilbake.',
  ],

  'upright-row': [
    'Stå oppreist med stangen foran lårene, smalt grep (ca. 20 cm mellom hendene).',
    'Løft stangen langs kroppen med albuene ledende.',
    'Stopp når albuene er i skulderhøyde – ikke høyere.',
    'Hold 1 sekund øverst.',
    'Senk kontrollert langs kroppen.',
  ],

  'pike-push-up': [
    'Start i en vanlig pushup-posisjon.',
    'Gå hendene bakover og løft hoften opp til en invertert V-form.',
    'Hold hoften høy gjennom hele – dette er et skulderpress, ikke brystpress.',
    'Bøy albuene og senk hodet ned mot gulvet mellom hendene.',
    'Press opp til armene er strake.',
  ],

  'face-pull': [
    'Still kabelen i øyehøyde eller litt over med tau-håndtak.',
    'Grip tauet med begge hender og ta ett skritt bakover for spenning.',
    'Trekk tauet mot ansiktet med albuene høye og brede.',
    'I sluttposisjon: roter skuldrene utover slik at hendene er ved ørene.',
    'Hold 1 sekund øverst, slipp kontrollert tilbake.',
  ],

  // ───────────────────────────────────────────────
  // RYGG – HORISONTAL PULL
  // ───────────────────────────────────────────────

  'bent-over-row': [
    'Stå med føttene skulderbredde, stangen foran deg.',
    'Hengsel i hoften til overkroppen er ca. 45° – ryggen nøytral, ikke flektert.',
    'Grip stangen litt bredere enn skulderbredde med overgrep.',
    'Ro stangen til navlen – albuer trekkes rett bakover.',
    'Klem skulderbladen i toppen, senk kontrollert til full armstrekk.',
  ],

  'dumbbell-row': [
    'Plasser motstående kne og hånd på benken for støtte.',
    'Hold ryggen parallell med gulvet.',
    'La manualen henge ned med full armstrekk som startposisjon.',
    'Ro manualen opp mot hoftebeinet – ikke skulderen.',
    'Senk kontrollert tilbake til full armstrekk.',
  ],

  'cable-row': [
    'Sett deg ved kabelroing-maskinen med litt bøy i knærne og rett rygg.',
    'Grip håndtaket og len deg ikke bakover for å trekke – hold overkroppen stabil.',
    'Ro håndtaket til nedre mage, hold ryggen stabil.',
    'Klem skulderbladen mot hverandre i kontraksjonen.',
    'Slipp langsomt fremover med full kontroll.',
  ],

  'chest-supported-row': [
    'Juster skråbenken til ca. 30–45° og legg deg med brystet mot puten.',
    'La manualene henge ned med full armstrekk.',
    'Ro albuene rett bakover og opp mot hoften.',
    'Klem skulderbladen mot hverandre øverst.',
    'Senk kontrollert tilbake til full strekk.',
  ],

  'inverted-row': [
    'Plasser deg under en stang (rack, Smith-maskin eller bord) i hoftebredde høyde.',
    'Grip stangen med overgrep, skulderbreddes avstand.',
    'Hold kroppen strak som en planke fra hode til hæl.',
    'Trekk brystet opp til stangen.',
    'Senk kontrollert tilbake til full armstrekk.',
    'Gjør øvelsen vanskeligere ved å strekke bena lengre fremover.',
  ],

  // ───────────────────────────────────────────────
  // RYGG – VERTIKAL PULL
  // ───────────────────────────────────────────────

  'pull-up': [
    'Grip bommen med overgrep, skulderbreddes avstand.',
    'Heng i full armstrekk med aktive skuldre – ikke passivt hengende.',
    'Trekk skulderbladen ned og inn FØR du bøyer albuene.',
    'Trekk til haken er over bommen.',
    'Senk langsomt og kontrollert tilbake til full armstrekk.',
  ],

  'chin-up': [
    'Grip bommen med undergrep (håndflatene mot deg), skulderbreddes avstand.',
    'Heng i full armstrekk med aktive skuldre.',
    'Trekk albuene ned og bakover.',
    'Trekk til haken er over bommen.',
    'Senk langsomt og kontrollert tilbake til full armstrekk.',
  ],

  'lat-pulldown': [
    'Sett deg i maskinen med lårene under puten.',
    'Grep stangen bredere enn skulderbredde med overgrep.',
    'Hel litt bakover og hold brystet opp mot stangen.',
    'Trekk stangen ned foran til øvre bryst – ikke bak nakken.',
    'Klem latene i bunn – hold 1 sekund.',
    'Slipp langsomt opp til full armstrekk.',
  ],

  'narrow-lat-pulldown': [
    'Fest smalt nøytralgrep-håndtak i maskinen.',
    'Sett deg med rett rygg og brystet opp.',
    'Trekk ned mot øvre bryst / haka med albuene langs kroppen.',
    'Klem latene og skulderbladen i bunn – hold 1 sekund.',
    'Slipp langsomt opp til full armstrekk.',
  ],

  'straight-arm-pulldown': [
    'Stå foran høy kabel med rett stang-håndtak.',
    'Hold armene nesten strake gjennom hele bevegelsen – dette er ikke en curl.',
    'Trekk stangen ned foran kroppen til lårnivå i en bue.',
    'Fokus på å aktivere latene – not biceps.',
    'La stangen stige kontrollert tilbake til skulderhøyde.',
  ],

  // ───────────────────────────────────────────────
  // POSTERIOR KJEDE – HENGSEL
  // ───────────────────────────────────────────────

  'deadlift': [
    'Stå med føttene hoftebredde og stangen over fotbuen.',
    'Bøy ned og grip stangen like utenfor bena med overgrep eller blandet grep.',
    'Nøytral rygg: korsryggen lett buet, brystet opp, skuldrene rett over stangen.',
    'Aktiver latene (tenk «beskytt armhulene») og trekk stangen tett mot kroppen.',
    'Press gulvet ned med føttene – hofte og skulder stiger med samme hastighet.',
    'Hofte til full strekk øverst – ikke overekstend korsryggen.',
  ],

  'sumo-deadlift': [
    'Stå med bredt benstilling og tær pekende 30–45° utover.',
    'Bøy ned med hendene innenfor bena, smalt overgrep.',
    'Hold brystet opp og ryggen nøytral.',
    'Press gulvet ned og ut med føttene.',
    'Hofte og skulder stiger jevnt – hofte til full strekk øverst.',
  ],

  'romanian-deadlift': [
    'Stå oppreist med stangen foran lårene.',
    'Liten bøy i knærne – hold den gjennom hele bevegelsen.',
    'Send hoften bakover og hel fremover med rett rygg.',
    'Stangen sklir langs bena ned mot midten av leggene.',
    'Stopp når du kjenner godt strekk i hamstrings – ikke forbi.',
    'Press hoften fremover tilbake til startposisjon og klem setemusklene.',
  ],

  'single-leg-romanian-deadlift': [
    'Stå på ett ben med en manual i motstående hånd.',
    'Send hoften bakover mens du heller fremover og løfter bakbenet.',
    'Hold ryggen nøytral og hoften parallell med gulvet – ikke roter.',
    'Senk manualen langs støttebeinet til du kjenner strekk.',
    'Press hoften fremover tilbake til startposisjon.',
  ],

  'hip-thrust': [
    'Plasser skuldrene mot langsiden av en benk i ca. skulderblad-høyde.',
    'Legg stangen over hoftebeinet med en pute for komfort.',
    'Føttene skulderbredde, kne rett over anklene.',
    'Press hoften opp til kroppen er en rett linje fra kne til skulder.',
    'Klem setemusklene hardt øverst – hold 1 sekund.',
    'Senk kontrollert tilbake – hoften rører nesten gulvet, ikke helt.',
  ],

  'glute-bridge': [
    'Ligg på ryggen med knærne bøyd 90° og føttene flate på gulvet.',
    'Armer langs siden med håndflatene ned for støtte.',
    'Press hoften opp til kroppen er en rett linje fra kne til skulder.',
    'Klem setemusklene hardt øverst – hold 1–2 sekunder.',
    'Senk kontrollert tilbake.',
  ],

  'single-leg-glute-bridge': [
    'Ligg på ryggen, ett kne bøyd med foten flat på gulvet.',
    'Strekk det andre benet rett opp.',
    'Press hoften opp med støttebeinet til kroppen er rett.',
    'Hold hoften parallell – ikke la den vipp til siden.',
    'Klem setemusklene øverst, senk kontrollert.',
  ],

  'good-morning': [
    'Legg stangen på øvre rygg som ved knebøy, men bruk lett vekt.',
    'Stå med føttene skulderbredde og liten bøy i knærne.',
    'Hengsel i hoften og hel fremover med nøytral rygg.',
    'Stopp når overkroppen er ca. parallell med gulvet – ikke forbi.',
    'Press hoften fremover og reis deg til startposisjon.',
  ],

  'kettlebell-swing': [
    'Stå med klokken foran deg, føttene litt bredere enn skulderbredde.',
    'Hengsel i hoften, grip klokken og swing den bakover mellom beina.',
    'Eksplosiv hofteekstensjon driver klokken fremover og opp – armene er passive.',
    'La klokken stige til ca. skulderhøyde av momentum alene.',
    'La den swing tilbake og gjenta i ett flytende mønster.',
  ],

  // ───────────────────────────────────────────────
  // KNEBØY
  // ───────────────────────────────────────────────

  'back-squat': [
    'Plasser stangen på øvre trapezius (high-bar) eller nedre (low-bar).',
    'Stå med føttene skulderbredde og tær 15–30° utover.',
    'Ta ett skritt bakover fra rackposisjon og stabiliser.',
    'Bøy i hofte og kne samtidig – kne sporer over tærne.',
    'Bøy til parallell eller dypere der bevegeligheten tillater det.',
    'Press opp gjennom hælene til full hofteekstensjon.',
  ],

  'front-squat': [
    'Stangen hviler på fremre deltoid – ikke i hendene.',
    'Albuene peker rett frem og høyt – hold dem der gjennom hele.',
    'Stå med føttene skulderbredde og tær lett utover.',
    'Bøy ned med oppreist overkropp – mer oppreist enn bakknebøy.',
    'Bøy til parallell eller dypere.',
    'Press opp med albuene ledende – de skal ikke synke.',
  ],

  'goblet-squat': [
    'Hold en kettlebell eller manual vertikalt ved brystet med begge hender.',
    'Stå med føttene litt bredere enn skulderbredde og tær ut.',
    'Bøy dypt ned med oppreist overkropp – vekten foran gir naturlig motvekt.',
    'Albuene innenfor knærne i bunnen.',
    'Press opp til startposisjon.',
  ],

  'bulgarian-split-squat': [
    'Plasser bakfoten på en benk i ca. knehøyde.',
    'Fremre fot langt nok frem for at kneet holder seg over tærne.',
    'Hold manualene ved siden av kroppen.',
    'Senk hoften rett ned til fremre lår er parallelt med gulvet.',
    'Press opp gjennom fremre hæl til startposisjon.',
  ],

  'lunge': [
    'Stå oppreist med manualene ved siden (eller bare kroppsvekt).',
    'Ta et skritt fremover og senk bakkneet mot – men ikke på – gulvet.',
    'Fremre kne sporer over tå – ikke kollaps innad.',
    'Press opp gjennom fremre hæl og bring foten tilbake til startposisjon.',
    'Alternér bein eller gjør alle reps på ett bein.',
  ],

  'reverse-lunge': [
    'Stå oppreist med manualene ved siden.',
    'Ta et skritt bakover og senk bakkneet mot gulvet.',
    'Fremre kne sporer over tå.',
    'Press opp gjennom fremre hæl og bring bakfoten fremover til startposisjon.',
    'Alternér bein.',
  ],

  'walking-lunge': [
    'Stå oppreist med manualene ved siden.',
    'Ta et langt skritt fremover og senk bakkneet mot gulvet.',
    'Press opp gjennom fremre hæl og bring bakfoten frem i neste steg.',
    'Fortsett fremover i et kontinuerlig gående mønster.',
    'Hold oppreist overkropp gjennom hele.',
  ],

  'leg-press': [
    'Sett deg i maskinen med ryggen flat mot rygglenet.',
    'Plasser føttene skulderbredde på plattformen.',
    'Slipp sikringene og bøy knærne kontrollert ned – kne sporer over tær.',
    'Stopp ved ca. 90° i knærne – ikke dypere enn hoften tillater.',
    'Press plattformen fra deg til knærne nesten er strake – ikke lås ut.',
  ],

  'step-up': [
    'Stå foran en kasse eller benk med manualene ved siden.',
    'Plasser ett ben opp på kassen med hele foten flatt.',
    'Press gjennom hælen på opp-benet og reis deg.',
    'Bring det andre benet opp til hoften er i strekk.',
    'Senk kontrollert tilbake – trykk ikke fra bakbenet.',
  ],

  'pistol-squat': [
    'Stå på ett ben, fri fot holdes rett frem.',
    'Hold armene fremover for balanse.',
    'Bøy støttekneet og senk hoften ned mot ankelen.',
    'Hold ryggen nøytral – ikke len fremover mer enn nødvendig.',
    'Press opp til stående posisjon.',
    'Begynn med assistert variant (TRX, stol) om nødvendig.',
  ],

  // ───────────────────────────────────────────────
  // ISOLASJON – BEIN
  // ───────────────────────────────────────────────

  'leg-extension': [
    'Sett deg i maskinen med kneet i linje med maskinens drejepunkt.',
    'Plasser anklene bak putene.',
    'Strekk knærne til full ekstensjon uten å låse hardt.',
    'Hold 1 sekund øverst for full quadriceps-kontraksjon.',
    'Senk kontrollert over 2–3 sekunder.',
  ],

  'lying-leg-curl': [
    'Ligg på magen i maskinen med anklene under putene.',
    'Hold hoften ned mot puten gjennom hele bevegelsen.',
    'Curl hælene mot setet i kontrollert bevegelse.',
    'Stopp når hælene er nær setet.',
    'Senk langsomt – 3 sekunder eksentrisk fase.',
  ],

  'calf-raise': [
    'Stå med forhulene på en trapp eller heve-plattform, hælene i luften.',
    'Senk hælene helt ned til du kjenner godt strekk i leggene.',
    'Press opp på tå til full kontraksjon.',
    'Hold 1 sekund øverst.',
    'Senk langsomt tilbake til full strekk.',
  ],

  'hip-abduction': [
    'Sett deg i maskinen med rygg mot rygglenet.',
    'Puter mot innsiden av lårene.',
    'Press bena ut fra hverandre i kontrollert bevegelse.',
    'Hold 1 sekund i ytterstilling.',
    'Bring bena kontrollert tilbake.',
  ],

  // ───────────────────────────────────────────────
  // CORE
  // ───────────────────────────────────────────────

  'plank': [
    'Støtt på underarmene med albuene rett under skuldrene.',
    'Strekk kroppen til en rett linje fra hode til hæl.',
    'Klem setemusklene og trekk navlen inn mot ryggraden.',
    'Pust normalt og hold posisjonen i ønsket tid.',
    'Unngå å la hoften synke ned eller løfte seg for høyt.',
  ],

  'side-plank': [
    'Støtt på underarmen med albuen rett under skulderen.',
    'Stable kroppen i en rett linje fra hode til hæl sett fra siden.',
    'Hofte hevet – ikke la den synke mot gulvet.',
    'Pust normalt og hold posisjonen.',
    'Progresjon: løft øvre ben for økt krav til gluteus medius.',
  ],

  'dead-bug': [
    'Ligg på ryggen med armene pekende rett opp og knærne bøyd 90° i luften.',
    'Press korsryggen aktivt mot gulvet – hold den der gjennom hele.',
    'Strekk langsomt motstående arm og ben mot gulvet.',
    'Stopp rett FØR korsryggen løfter seg.',
    'Bring tilbake til startposisjon og bytt side.',
  ],

  'crunch': [
    'Ligg på ryggen med knærne bøyd og hendene bak hodet.',
    'Ikke trekk i nakken – bare hold lett kontakt.',
    'Curl skuldrene opp fra gulvet – dette er en kort bevegelse.',
    'Pust ut på vei opp, inn på vei ned.',
    'Senk kontrollert uten å hvile hodet helt på gulvet mellom reps.',
  ],

  'bicycle-crunch': [
    'Ligg på ryggen med hendene bak hodet og bena løftet fra gulvet.',
    'Roter overkroppen og bring en albue mot motstående kne.',
    'Det andre benet strekkes ut i lavt plan.',
    'Bytt side i langsomt, kontrollert tempo.',
    'Roter fra overkroppen – ikke bare albuene.',
  ],

  'leg-raises': [
    'Ligg på ryggen med hendene under setet for støtte.',
    'Hold bena nesten strake (lett bøy i knærne er OK).',
    'Løft bena til ca. 90° mens korsryggen presses mot gulvet.',
    'Senk bena kontrollert mot gulvet.',
    'Stopp rett FØR de berører – hold spenningen.',
  ],

  'hanging-leg-raises': [
    'Heng i en bom med overgrep, skulderbreddes avstand.',
    'Aktiver skuldrene – ikke passivt hengende.',
    'Bøy knærne og løft dem til brystet (nybegynner), eller strekk bena rett opp.',
    'Pust ut på vei opp.',
    'Senk kontrollert uten å miste momentet i sving.',
  ],

  'russian-twist': [
    'Sett deg på gulvet med knærne bøyd og hælene lett fra gulvet.',
    'Hel litt bakover – ca. 45° vinkel på overkroppen.',
    'Hold en vektplate, medisinball eller hender samlet.',
    'Roter overkroppen fra side til side.',
    'Rotasjonen kommer fra magen – ikke bare armene.',
  ],

  'ab-wheel': [
    'Kneel med ab-hjulet foran deg på gulvet.',
    'Hold korsryggen nøytral – aktiver core.',
    'Rull langsomt fremover med strake armer til hoften nesten rører gulvet.',
    'Stopp rett FØR du mister ryggens nøytrale posisjon.',
    'Rull kontrollert tilbake.',
  ],

  'cable-crunch': [
    'Kneel under en høy kabel med tau-håndtak ved ansiktet.',
    'Hold tauet ved pannen gjennom hele bevegelsen.',
    'Kurl overkroppen ned mot knærne ved å bøye i midjen – ikke hoften.',
    'Klem magemusklene hardt i bunn.',
    'Kontrollert opp til startposisjon.',
  ],

  'back-extension': [
    'Plasser deg i rygghevsmaskin med hoftene på puten og bena låst.',
    'Kryss armene på brystet eller hold en vektplate for ekstra motstand.',
    'Overkroppen henger ned – nøytral rygg som startposisjon.',
    'Hev overkroppen til parallell med gulvet.',
    'Klem setemusklene øverst og hold 1 sekund.',
  ],

  // ───────────────────────────────────────────────
  // BICEPS
  // ───────────────────────────────────────────────

  'barbell-curl': [
    'Stå oppreist med stangen i undergrep, skulderbreddes avstand.',
    'Albuer inntil kroppen – hold dem stasjonære gjennom hele.',
    'Curl stangen opp mot skuldrene i en bue.',
    'Supiner håndleddet litt øverst for full biceps-kontraksjon.',
    'Senk langsomt over 2–3 sekunder.',
  ],

  'dumbbell-curl': [
    'Stå oppreist med manualer i undergrep ved siden av kroppen.',
    'Curl en eller begge armer opp mot skuldrene.',
    'Supiner håndflaten ved curling opp.',
    'Hold albuer stasjonære – unngå å hjelpe med overkroppen.',
    'Senk kontrollert tilbake til full strekk.',
  ],

  'hammer-curl': [
    'Stå oppreist med manualer i nøytralt grep (tommel opp).',
    'Hold albuer inntil kroppen gjennom hele.',
    'Curl opp med nøytralt grep – ikke supiner.',
    'Hold 1 sekund øverst for full kontraksjon.',
    'Senk kontrollert.',
  ],

  'cable-curl': [
    'Stå foran lav kabel med stang- eller taugrep.',
    'Hold albuer inntil kroppen.',
    'Curl opp mot skuldrene.',
    'Hold 1 sekund øverst – kabelen gir spenning i bunn som manualer ikke gjør.',
    'Senk kontrollert tilbake.',
  ],

  'preacher-curl': [
    'Sett deg ved predikantbenken med overarmene flate mot puten.',
    'Grip stangen eller EZ-stangen i undergrep.',
    'Curl opp til full kontraksjon.',
    'Ikke hyperekstend i bunn – stopp ved lett bøy i albuen.',
    'Senk kontrollert til full armstrekk.',
  ],

  'incline-dumbbell-curl': [
    'Still benken til 45–60° og ligg tilbake med armene hengende vertikalt ned.',
    'La manualene henge med full armstrekk – her kjenner du strekk i biceps.',
    'Curl opp til full kontraksjon.',
    'Hold 1 sekund øverst.',
    'Senk langsomt tilbake til full strekk.',
  ],

  // ───────────────────────────────────────────────
  // TRICEPS
  // ───────────────────────────────────────────────

  'triceps-pushdown': [
    'Stå foran høy kabel med stang eller tau.',
    'Albuer inntil kroppen – de beveger seg ikke.',
    'Press ned til full armstrekk.',
    'Hold 1 sekund i bunn for maksimal kontraksjon.',
    'Slipp opp til 90° i albuen – ikke høyere.',
  ],

  'skull-crushers': [
    'Ligg på benk med stangen i full armstrekk over brystet.',
    'Hold albuer parallelle og pekende opp.',
    'Bøy kun i albuene og senk stangen mot panna.',
    'Skuldrene beveger seg ikke – bevegelsen er bare i albuene.',
    'Press tilbake til full armstrekk.',
  ],

  'overhead-triceps-extension': [
    'Stå eller sett deg med en manual holdt med begge hender over hodet.',
    'Albuer peker rett opp, tett til ørene.',
    'Bøy kun i albuene og senk vekten bak hodet.',
    'Skuldrene beveger seg ikke – albuer forblir oppe.',
    'Press opp til full armstrekk.',
  ],

  'triceps-dip': [
    'Plasser hendene på en benk bak deg med fingrene fremover.',
    'Hold overkroppen oppreist – ikke hel fremover.',
    'Bøy albuene og senk hoften mot gulvet.',
    'Stopp ved ca. 90° i albuen – ikke dypere.',
    'Press opp til nesten full armstrekk.',
  ],

  'triceps-kickback': [
    'Støtt deg på en benk med motstående hånd og kne.',
    'Hold overarmen parallelt med gulvet.',
    'Strekk albuene fullt ut bak med manualen.',
    'Hold 1 sekund i full strekk.',
    'Bøy tilbake til 90° og gjenta.',
  ],

  // ───────────────────────────────────────────────
  // TOTALØVELSER
  // ───────────────────────────────────────────────

  'burpee': [
    'Stå oppreist.',
    'Bøy ned og plasser hendene på gulvet, skulderbreddes avstand.',
    'Hopp eller gå bena bakover til pushup-posisjon.',
    'Gjør en pushup (valgfritt).',
    'Hopp bena frem mot hendene.',
    'Reis deg eksplosivt opp – hopp med armene over hodet.',
  ],

  'farmers-carry': [
    'Plasser tunge manualer eller kettlebells ved siden av føttene.',
    'Løft med nøytral rygg – som å utføre et lite markløft.',
    'Stå oppreist med skulderbladene nede og inn.',
    'Gå i korte, kontrollerte skritt med stabil core.',
    'Hold distansen du har bestemt og sett ned kontrollert.',
  ],

  'turkish-get-up': [
    'Ligg på ryggen, hold klokken med én arm rett opp. Bøy tilsvarende kne.',
    'Rull opp på motstående albue mens øyet holder klokken.',
    'Press opp til håndstøtte og løft hoften opp.',
    'Sett bakfoten under kroppen (som i en liggende utfall-posisjon).',
    'Reis deg til stående posisjon mens klokken alltid er rett opp.',
    'Reverser alle steg kontrollert tilbake til liggende startposisjon.',
  ],
}

/** Hent instruksjoner for en øvelse, eller tom liste om ingen finnes. */
export function getInstructions(exerciseId: string): string[] {
  return EXERCISE_INSTRUCTIONS[exerciseId] ?? []
}
