// Post page behaviour: reading mode, copy buttons, Mermaid diagrams, TOC.

import { markBroken } from './sections'
import { onThemeChange } from './theme'

function setupModes() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-mode]')
  const views = document.querySelectorAll<HTMLElement>('[data-view]')
  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      const mode = button.dataset.mode
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)))
      views.forEach((view) => {
        view.hidden = view.dataset.view !== mode
      })
    }),
  )
}

function addCopyButton(pre: HTMLElement, label: string) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'copy'
  button.textContent = label
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.querySelector('code')?.textContent ?? pre.textContent ?? '')
      button.textContent = 'Copied'
    } catch {
      button.textContent = 'Press Ctrl+C'
    }
    setTimeout(() => (button.textContent = label), 1600)
  })
  pre.classList.add('has-copy')
  pre.append(button)
}

function blocksOf(language: string): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('.prose pre')].filter(
    (pre) => pre.dataset.language === language || pre.querySelector(`code.language-${language}`),
  )
}

// Diagrams take their colours from the page tokens, so they follow the theme.
function diagramColours() {
  const css = getComputedStyle(document.documentElement)
  const token = (name: string) => css.getPropertyValue(name).trim()
  return {
    fontFamily: 'Geist Mono, ui-monospace, monospace',
    fontSize: '14px',
    primaryColor: token('--sheet'),
    primaryBorderColor: token('--ink'),
    primaryTextColor: token('--ink'),
    lineColor: token('--ink'),
    secondaryColor: token('--highlight'),
    tertiaryColor: token('--paper'),
  }
}

async function renderMermaid(blocks: HTMLElement[]) {
  if (blocks.length === 0) return
  const { default: mermaid } = await import('mermaid')
  let drawn = 0
  let current = blocks
  const draw = async () => {
    mermaid.initialize({ startOnLoad: false, theme: 'base', themeVariables: diagramColours() })
    const next: HTMLElement[] = []
    for (const block of current) {
      const source = block.dataset.source ?? block.textContent ?? ''
      try {
        const { svg } = await mermaid.render(`diagram-${drawn++}`, source)
        const figure = document.createElement('figure')
        figure.className = 'diagram'
        figure.dataset.source = source
        figure.innerHTML = svg
        block.replaceWith(figure)
        next.push(figure)
      } catch (error) {
        // Leave the source visible and say why, so a typo is easy to spot.
        markBroken(block, `Diagram error: ${error instanceof Error ? error.message.split('\n')[0] : 'could not draw'}`)
        next.push(block)
      }
    }
    current = next
  }
  await draw()
  onThemeChange(draw)
}

function setupToc() {
  const links = new Map<string, HTMLAnchorElement>()
  document.querySelectorAll<HTMLAnchorElement>('.toc a').forEach((a) => links.set(a.hash.slice(1), a))
  if (links.size === 0) return
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        links.forEach((a) => a.removeAttribute('aria-current'))
        links.get(entry.target.id)?.setAttribute('aria-current', 'true')
      }
    },
    { rootMargin: '0px 0px -70% 0px' },
  )
  links.forEach((_, id) => {
    const heading = document.getElementById(id)
    if (heading) observer.observe(heading)
  })
}

setupModes()
setupToc()
const diagrams = blocksOf('mermaid')
const demos = blocksOf('demo')
const playgrounds = blocksOf('playground')
const widgets = [...diagrams, ...demos, ...playgrounds]
document
  .querySelectorAll<HTMLElement>('.prose pre')
  .forEach((pre) => widgets.includes(pre) || addCopyButton(pre, 'Copy'))
document.querySelectorAll<HTMLElement>('.agent pre').forEach((pre) => addCopyButton(pre, 'Copy Markdown'))
renderMermaid(diagrams)
// Each widget's code loads only on posts that use it.
if (demos.length) import('./demo').then(({ mountDemos }) => mountDemos(demos))
if (playgrounds.length) import('./playground').then(({ mountPlaygrounds }) => mountPlaygrounds(playgrounds))
