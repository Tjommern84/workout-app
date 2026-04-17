# WorkoutAI

A progressive web app for strength training — built offline-first, without accounts or subscriptions. The app adapts its interface to three user levels: beginners get guided workouts with feedback prompts, intermediate users get structure and volume tracking, advanced users get e1RM trends, ACWR load monitoring and RPE-based autoregulation.

---

## Core features

**Adaptive UI by experience level**
- `guide` — Step-by-step guided sets, emoji feedback (too easy / just right / too hard), rest timer, weight suggestions
- `structure` — Standard set/rep logging, weekly volume bars, rest timer, consistency grid, program cycles
- `data` — e1RM trend chart, RPE logging with autoregulation suggestions, ACWR load ratio, stagnation detection

**Smart workout generation**
- Recovery-aware: tracks days since each muscle group was last trained
- Equipment-filtered: barbell, dumbbell, machine, cable, kettlebell, bodyweight
- Focus modes: Strength (heavy compound, long rest), Hypertrophy (moderate volume), Shred (higher reps, shorter rest)
- Default focus mode derived from user goal
- Age-graded rest times (gradual curve from 50+, not a hard cutoff)
- Youth volume reduction for users under 18

**Program cycles**
- Attach an 8-week (or custom-length) cycle to any training program
- Weeks that fall short of the target frequency don't count — the cycle auto-extends without flagging the user as having "failed"
- Progress widget shows current week, this-week completion, and "justert" label when extended

**Analytics**
- e1RM calculated per session (Epley/Brzycki)
- ACWR (7-day acute vs. 28-day chronic load ratio) with progressive disclosure during data accumulation period
- Relative stagnation detection via linear regression slope (threshold relative to mean e1RM, not absolute kg)
- RPE-based weight suggestion surfaced on next session

**Offline-first**
- No server, no account — all data in `localStorage`
- `StorageEnvelope<T>` pattern with schema versioning and automatic migration
- PWA-ready: manifest, icons, service worker compatible

---

## Tech stack

| | |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| State | React 19 `useReducer` + Context |
| Persistence | localStorage (no backend) |
| Runtime | Node 20+ |

---

## Project structure

```
app/                    Next.js App Router pages
components/
  adaptive/             Components that branch on user level
  dashboard/            Home screen widgets
  level1/               Guide-mode components
  level2/               Structure-mode components
  level3/               Data-mode components
  workout/              Active workout session components
  layout/               Nav, gates, banners
context/
  WorkoutContext.tsx    Global state (history, active workout, cycle)
lib/
  analytics.ts          e1RM, ACWR, stagnation, RPE analysis
  cycles.ts             Program cycle logic (week tracking, auto-extend)
  exercises.ts          Exercise database (~80 exercises)
  generator.ts          Workout generation with recovery + equipment logic
  programs.ts           Predefined training programs (PPL, Full Body, etc.)
  storage.ts            localStorage with schema versioning
  types.ts              All shared TypeScript types
  weight-ladder.ts      Equipment-specific starting weight suggestions
strategi/               Product vision, architecture notes, roadmap
ux-audit/               Persona-based UX analysis documents
guider/                 In-app training guides (markdown content)
```

---

## Getting started

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Complete the onboarding (level, goal, equipment) and generate your first workout.

---

## Design principles

- **No accounts, no cloud** — the user owns their data
- **Progressive disclosure** — complexity only appears when the user is ready for it
- **Never shame the user** — missed weeks extend the cycle silently, no "failed" states
- **Relative thresholds** — stagnation, load zones, and volume norms scale with the individual, not fixed absolute values
