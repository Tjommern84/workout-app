interface Props {
  content: string
}

// Minimal markdown → React renderer. Støtter: headings, bold, italic,
// blockquote, code blocks, tables, horizontal rule, unordered/ordered lists.
export default function MarkdownRenderer({ content }: Props) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0
  let key = 0

  function nextKey() { return key++ }

  // Inline styles: **bold**, *italic*, `code`, [text](url)
  function inline(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = []
    let remaining = text
    let idx = 0

    const patterns: [RegExp, (m: RegExpMatchArray) => React.ReactNode][] = [
      [/\*\*(.+?)\*\*/,   (m) => <strong key={idx++} className="text-white font-semibold">{m[1]}</strong>],
      [/\*(.+?)\*/,        (m) => <em key={idx++} className="italic text-gray-300">{m[1]}</em>],
      [/`(.+?)`/,          (m) => <code key={idx++} className="bg-white/8 text-green-300 px-1.5 py-0.5 rounded text-xs font-mono">{m[1]}</code>],
      [/\[(.+?)\]\((.+?)\)/, (m) => <a key={idx++} href={m[2]} className="text-green-400 underline underline-offset-2">{m[1]}</a>],
    ]

    while (remaining.length > 0) {
      let earliest: { index: number; match: RegExpMatchArray; render: (m: RegExpMatchArray) => React.ReactNode } | null = null

      for (const [pattern, render] of patterns) {
        const m = remaining.match(pattern)
        if (m && m.index !== undefined) {
          if (!earliest || m.index < earliest.index) {
            earliest = { index: m.index, match: m, render }
          }
        }
      }

      if (!earliest) {
        parts.push(remaining)
        break
      }

      if (earliest.index > 0) parts.push(remaining.slice(0, earliest.index))
      parts.push(earliest.render(earliest.match))
      remaining = remaining.slice(earliest.index + earliest.match[0].length)
    }

    return parts
  }

  while (i < lines.length) {
    const line = lines[i]

    // Code block
    if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre key={nextKey()} className="bg-[#111] border border-white/8 rounded-xl p-4 overflow-x-auto my-4 text-xs font-mono text-gray-300 leading-relaxed">
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      i++
      continue
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={nextKey()} className="border-white/8 my-5" />)
      i++
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <blockquote key={nextKey()} className="border-l-2 border-green-500/50 pl-4 my-4 text-gray-400 text-sm italic">
          {quoteLines.map((l, qi) => <p key={qi} className={qi > 0 ? 'mt-1' : ''}>{inline(l)}</p>)}
        </blockquote>
      )
      continue
    }

    // Table
    if (line.includes('|') && i + 1 < lines.length && lines[i + 1].includes('---')) {
      const headers = line.split('|').map(c => c.trim()).filter(Boolean)
      i += 2 // skip separator
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes('|')) {
        rows.push(lines[i].split('|').map(c => c.trim()).filter(Boolean))
        i++
      }
      elements.push(
        <div key={nextKey()} className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                {headers.map((h, hi) => (
                  <th key={hi} className="text-left text-gray-400 font-medium py-2 pr-4 text-xs uppercase tracking-wide">
                    {inline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-white/5 hover:bg-white/2">
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-2 pr-4 text-gray-300 align-top">
                      {inline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // Headings
    const h1 = line.match(/^# (.+)/)
    if (h1) {
      elements.push(<h1 key={nextKey()} className="text-2xl font-bold mt-6 mb-2 text-white">{inline(h1[1])}</h1>)
      i++; continue
    }
    const h2 = line.match(/^## (.+)/)
    if (h2) {
      elements.push(<h2 key={nextKey()} className="text-xl font-bold mt-6 mb-2 text-white">{inline(h2[1])}</h2>)
      i++; continue
    }
    const h3 = line.match(/^### (.+)/)
    if (h3) {
      elements.push(<h3 key={nextKey()} className="text-base font-bold mt-4 mb-1.5 text-gray-200">{inline(h3[1])}</h3>)
      i++; continue
    }
    const h4 = line.match(/^#### (.+)/)
    if (h4) {
      elements.push(<h4 key={nextKey()} className="text-sm font-semibold mt-3 mb-1 text-gray-300 uppercase tracking-wide">{inline(h4[1])}</h4>)
      i++; continue
    }

    // Unordered list
    if (/^[-*] /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*] /, ''))
        i++
      }
      elements.push(
        <ul key={nextKey()} className="my-3 space-y-1.5 ml-2">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-gray-300 text-sm">
              <span className="text-green-500 mt-0.5 shrink-0">·</span>
              <span>{inline(item)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = []
      let n = 1
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(
        <ol key={nextKey()} className="my-3 space-y-1.5 ml-2">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2.5 text-gray-300 text-sm">
              <span className="text-green-400 font-bold tabular-nums shrink-0 w-5 text-right">{ii + 1}.</span>
              <span>{inline(item)}</span>
            </li>
          ))}
        </ol>
      )
      continue
    }

    // Checkbox list (- [ ] or - [x])
    if (/^- \[[ x]\]/.test(line)) {
      const items: { checked: boolean; text: string }[] = []
      while (i < lines.length && /^- \[[ x]\]/.test(lines[i])) {
        items.push({ checked: lines[i].startsWith('- [x]'), text: lines[i].replace(/^- \[[ x]\] /, '') })
        i++
      }
      elements.push(
        <ul key={nextKey()} className="my-3 space-y-1.5">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-sm">
              <span className={`mt-0.5 shrink-0 ${item.checked ? 'text-green-400' : 'text-gray-600'}`}>
                {item.checked ? '☑' : '☐'}
              </span>
              <span className={item.checked ? 'text-gray-400 line-through' : 'text-gray-300'}>
                {inline(item.text)}
              </span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Empty line
    if (line.trim() === '') {
      i++
      continue
    }

    // Paragraph
    elements.push(
      <p key={nextKey()} className="text-gray-300 text-sm leading-relaxed my-2">
        {inline(line)}
      </p>
    )
    i++
  }

  return <div className="prose-custom">{elements}</div>
}
