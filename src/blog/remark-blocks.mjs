// Writing shortcuts that survive the Pages CMS editor, which saves plain Markdown:
//   ==text==               highlighter stroke (<mark>)
//   ++text++               underline (what the editor writes for its U button)
//   {term: word | meaning} word with a hover / tap definition
//   > [!NOTE] ...          callout box (NOTE, TIP, IMPORTANT, WARNING, CAUTION)

const INLINE = /(==|\+\+)(?=\S)(.+?)(?<=\S)\1|\{term:\s*([^|{}]+?)\s*\|\s*([^{}]+?)\s*\}/g
const MARK_TAGS = { '==': 'mark', '++': 'u' }

const element = (tag, properties, children) => ({
  type: tag,
  data: { hName: tag === 'term' || tag === 'termDef' ? 'span' : tag, hProperties: properties },
  children,
})
const text = (value) => ({ type: 'text', value })

function inlineNode([, marker, marked, word, meaning]) {
  if (marker) return element(MARK_TAGS[marker], {}, [text(marked)])
  return element('term', { className: ['term'], tabIndex: 0 }, [
    text(word),
    element('termDef', { className: ['term-def'], role: 'tooltip' }, [text(meaning)]),
  ])
}

function splitInline(node) {
  const parts = []
  let last = 0
  for (const match of node.value.matchAll(INLINE)) {
    if (match.index > last) parts.push(text(node.value.slice(last, match.index)))
    parts.push(inlineNode(match))
    last = match.index + match[0].length
  }
  if (!parts.length) return [node]
  if (last < node.value.length) parts.push(text(node.value.slice(last)))
  return parts
}

export function remarkInline() {
  const walk = (node) => {
    if (!node.children) return
    node.children = node.children.flatMap((child) => {
      if (child.type === 'text') return splitInline(child)
      walk(child)
      return [child]
    })
  }
  return walk
}

const CALLOUTS = { NOTE: 'Note', TIP: 'Tip', IMPORTANT: 'Important', WARNING: 'Warning', CAUTION: 'Caution' }
const CALLOUT_MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*\n?/

function toCallout(quote) {
  const first = quote.children[0]
  const lead = first?.type === 'paragraph' ? first.children[0] : undefined
  const match = lead?.type === 'text' && lead.value.match(CALLOUT_MARKER)
  if (!match) return
  lead.value = lead.value.slice(match[0].length)
  if (!lead.value) first.children.shift()
  if (!first.children.length) quote.children.shift()
  const kind = match[1].toLowerCase()
  quote.data = { hName: 'aside', hProperties: { className: ['callout', `callout-${kind}`] } }
  quote.children.unshift({
    type: 'paragraph',
    data: { hProperties: { className: ['callout-label'] } },
    children: [text(CALLOUTS[match[1]])],
  })
}

export function remarkCallouts() {
  const walk = (node) => {
    if (node.type === 'blockquote') toCallout(node)
    node.children?.forEach(walk)
  }
  return walk
}
