// Post page behaviour: reading mode, copy buttons, Mermaid diagrams, TOC.

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

function mermaidBlocks(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('.prose pre')].filter(
    (pre) => pre.dataset.language === 'mermaid' || pre.querySelector('code.language-mermaid'),
  )
}

async function renderMermaid(blocks: HTMLElement[]) {
  if (blocks.length === 0) return
  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      fontFamily: 'Geist Mono, ui-monospace, monospace',
      fontSize: '14px',
      primaryColor: '#fbf9f3',
      primaryBorderColor: '#1b1915',
      primaryTextColor: '#1b1915',
      lineColor: '#1b1915',
      secondaryColor: '#ffd43b',
      tertiaryColor: '#ece9e1',
    },
  })
  for (const [i, pre] of blocks.entries()) {
    const source = pre.textContent ?? ''
    const figure = document.createElement('figure')
    figure.className = 'diagram'
    try {
      const { svg } = await mermaid.render(`diagram-${i}`, source)
      figure.innerHTML = svg
      pre.replaceWith(figure)
    } catch (error) {
      // Leave the source visible and say why, so a typo is easy to spot.
      pre.classList.add('diagram-error')
      pre.dataset.error = error instanceof Error ? error.message.split('\n')[0] : 'Diagram error'
    }
  }
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
const diagrams = mermaidBlocks()
document
  .querySelectorAll<HTMLElement>('.prose pre')
  .forEach((pre) => diagrams.includes(pre) || addCopyButton(pre, 'Copy'))
document.querySelectorAll<HTMLElement>('.agent pre').forEach((pre) => addCopyButton(pre, 'Copy Markdown'))
renderMermaid(diagrams)
