import Link from 'next/link'
import { GUIDES } from '@/lib/guides'

export const metadata = { title: 'Treningsguider' }

const LEVEL_COLOR: Record<string, string> = {
  'Nybegynner–middels': 'text-green-400 bg-green-500/10',
  'Alle nivåer': 'text-blue-400 bg-blue-500/10',
  'Alle': 'text-blue-400 bg-blue-500/10',
  'Nybegynner løper': 'text-green-400 bg-green-500/10',
  'Middels–avansert': 'text-orange-400 bg-orange-500/10',
}

export default function GuidesPage() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Treningsguider 📚</h1>
        <p className="text-gray-400 text-sm mt-1">
          Evidensbaserte guider fra NSCA, ACSM, Olympiatoppen og anerkjente programmer.
        </p>
      </div>

      <div className="space-y-3">
        {GUIDES.map((guide) => {
          const levelColor = LEVEL_COLOR[guide.level] ?? 'text-gray-400 bg-white/8'
          return (
            <Link key={guide.slug} href={`/guider/${guide.slug}`}>
              <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors active:scale-[0.99]">
                <div className="flex items-start gap-3">
                  <span className="text-3xl mt-0.5">{guide.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold leading-snug">{guide.title}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{guide.focus}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${levelColor}`}>
                        {guide.level}
                      </span>
                      <span className="text-xs text-gray-600">Kilde: {guide.source}</span>
                    </div>
                  </div>
                  <span className="text-gray-600 text-sm mt-1">→</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-white/3 border border-white/8 rounded-2xl">
        <p className="text-xs text-gray-500 leading-relaxed">
          Alle guider er basert på faglig dokumentasjon. Se{' '}
          <Link href="/guider/bevegelseshandicap" className="text-green-400 hover:underline">
            tilpasset trening
          </Link>{' '}
          ved skader eller begrensninger.
        </p>
      </div>
    </div>
  )
}
