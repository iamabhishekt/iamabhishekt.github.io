import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

// ==text== becomes <mark>, ++text++ becomes <u>. This is the syntax the Pages CMS
// editor writes back when it saves, so highlights survive editing there.
const INLINE_MARKS = /(==|\+\+)(?=\S)(.+?)(?<=\S)\1/g
const MARK_TAGS = { '==': 'mark', '++': 'u' }

function splitMarks(text) {
  const parts = []
  let last = 0
  for (const m of text.value.matchAll(INLINE_MARKS)) {
    if (m.index > last) parts.push({ type: 'text', value: text.value.slice(last, m.index) })
    const tag = MARK_TAGS[m[1]]
    parts.push({ type: tag, data: { hName: tag }, children: [{ type: 'text', value: m[2] }] })
    last = m.index + m[0].length
  }
  if (!parts.length) return [text]
  if (last < text.value.length) parts.push({ type: 'text', value: text.value.slice(last) })
  return parts
}

function remarkMarks() {
  const walk = (node) => {
    if (!node.children) return
    node.children = node.children.flatMap((child) => {
      if (child.type === 'text') return splitMarks(child)
      walk(child)
      return [child]
    })
  }
  return walk
}

export default defineConfig({
  site: 'https://iamabhishekt.github.io',
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMarks],
    // Mermaid blocks stay plain text so the browser can draw them as diagrams.
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    shikiConfig: { theme: 'github-light' },
  },
})
