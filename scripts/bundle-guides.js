// scripts/bundle-guides.js
// Run: node scripts/bundle-guides.js

const fs = require('fs')
const path = require('path')

const guideDir = path.join(__dirname, '../../guider')

const files = [
  { slug: '8-ukers-shred',        file: '01_8-ukers-shred.md',                   emoji: '🔥', title: '8-ukers Shred',                    level: 'Nybegynner–middels',    focus: 'Fettforbrenning + definisjon',    source: "Gold's Gym" },
  { slug: 'generell-styrke',       file: '02_generell-styrke.md',                  emoji: '💪', title: 'Generell styrke',                   level: 'Alle nivåer',            focus: 'Styrke + hypertrofi',             source: 'NSCA' },
  { slug: 'naval-special-warfare', file: '03_naval-special-warfare.md',            emoji: '⚓', title: 'Naval Special Warfare',              level: 'Middels–avansert',       focus: 'Total kapasitet',                 source: 'U.S. Navy SEALs' },
  { slug: 'kondisjon-hiit',        file: '04_generell-kondisjon-hiit.md',          emoji: '🫀', title: 'Kondisjon og HIIT',                  level: 'Alle nivåer',            focus: 'Kardio + fettforbrenning',        source: 'NSCA / ACSM' },
  { slug: 'halvmaraton',           file: '05_halvmarathon.md',                     emoji: '🏃', title: 'Halvmaraton (14 uker)',              level: 'Nybegynner løper',       focus: 'Løping + utholdenhet',            source: 'Nike Run Club' },
  { slug: 'stretch-og-mobilitet',  file: '06_stretch-og-mobilitet.md',             emoji: '🧘', title: 'Stretch og mobilitet',               level: 'Alle',                   focus: 'ROM + tøyning + mobilitet',       source: 'Olympiatoppen' },
  { slug: 'bevegelseshandicap',    file: '07_trening-med-bevegelseshandicap.md',   emoji: '♿', title: 'Trening ved bevegelseshandicap',     level: 'Alle',                   focus: 'Tilpasset trening + rehab',       source: 'ACSM / NSCA' },
]

const entries = files.map(f => {
  const raw = fs.readFileSync(path.join(guideDir, f.file), 'utf8')
  const escaped = raw
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
  return `  {
    slug: ${JSON.stringify(f.slug)},
    title: ${JSON.stringify(f.title)},
    emoji: ${JSON.stringify(f.emoji)},
    level: ${JSON.stringify(f.level)},
    focus: ${JSON.stringify(f.focus)},
    source: ${JSON.stringify(f.source)},
    content: \`${escaped}\`,
  }`
})

const output = `// Auto-generert – kjør: node scripts/bundle-guides.js

export interface Guide {
  slug: string
  title: string
  emoji: string
  level: string
  focus: string
  source: string
  content: string
}

export const GUIDES: Guide[] = [
${entries.join(',\n')}
]

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find(g => g.slug === slug)
}
`

const outPath = path.join(__dirname, '../lib/guides.ts')
fs.writeFileSync(outPath, output, 'utf8')
console.log('lib/guides.ts generated, size:', output.length, 'bytes')
