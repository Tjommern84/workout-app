import { notFound } from 'next/navigation'
import { use } from 'react'
import Link from 'next/link'
import { GUIDES, getGuide } from '@/lib/guides'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'

export function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return { title: 'Guide ikke funnet' }
  return { title: guide.title }
}

export default function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const guide = getGuide(slug)
  if (!guide) notFound()

  const currentIndex = GUIDES.findIndex(g => g.slug === slug)
  const prev = currentIndex > 0 ? GUIDES[currentIndex - 1] : null
  const next = currentIndex < GUIDES.length - 1 ? GUIDES[currentIndex + 1] : null

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link
          href="/guider"
          className="text-gray-500 hover:text-white transition-colors p-2 -ml-2"
        >
          ←
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{guide.emoji}</span>
            <h1 className="text-lg font-bold leading-tight">{guide.title}</h1>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-gray-500">{guide.level}</span>
            <span className="text-gray-700">·</span>
            <span className="text-xs text-gray-500">Kilde: {guide.source}</span>
          </div>
        </div>
      </div>

      {/* Focus tag */}
      <div className="bg-green-500/8 border border-green-500/20 rounded-xl px-3 py-2 mb-6">
        <p className="text-green-300 text-xs">
          <span className="font-semibold">Fokus:</span> {guide.focus}
        </p>
      </div>

      {/* Content */}
      <MarkdownRenderer content={guide.content} />

      {/* Prev / Next navigation */}
      <div className="flex gap-3 mt-10 pt-6 border-t border-white/8">
        {prev ? (
          <Link
            href={`/guider/${prev.slug}`}
            className="flex-1 bg-[#1a1a1a] border border-white/8 rounded-xl p-3 hover:border-white/15 transition-colors"
          >
            <p className="text-xs text-gray-500 mb-0.5">← Forrige</p>
            <p className="text-sm font-medium">{prev.emoji} {prev.title}</p>
          </Link>
        ) : <div className="flex-1" />}

        {next ? (
          <Link
            href={`/guider/${next.slug}`}
            className="flex-1 bg-[#1a1a1a] border border-white/8 rounded-xl p-3 hover:border-white/15 transition-colors text-right"
          >
            <p className="text-xs text-gray-500 mb-0.5">Neste →</p>
            <p className="text-sm font-medium">{next.emoji} {next.title}</p>
          </Link>
        ) : <div className="flex-1" />}
      </div>
    </div>
  )
}
