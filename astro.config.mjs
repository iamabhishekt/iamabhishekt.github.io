import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { remarkCallouts, remarkInline } from './src/blog/remark-blocks.mjs'

export default defineConfig({
  site: 'https://iamabhishekt.github.io',
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkCallouts, remarkInline],
    // These blocks stay plain text; the post page turns them into diagrams and widgets.
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid', 'playground', 'demo'] },
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: 'light' },
  },
})
