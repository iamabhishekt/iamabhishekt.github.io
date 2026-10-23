import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://iamabhishekt.github.io',
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    // Mermaid blocks stay plain text so the browser can draw them as diagrams.
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    shikiConfig: { theme: 'github-light' },
  },
})
