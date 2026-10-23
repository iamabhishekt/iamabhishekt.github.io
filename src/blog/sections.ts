export type Section = 'head' | 'html' | 'css' | 'js'

const DIVIDER = /^---(html|css|js)\s*$/

/** Splits a block body on `---html`, `---css` and `---js` lines. Text before the first divider goes to `first`. */
export function splitSections(source: string, first: Section): Partial<Record<Section, string>> {
  const sections: Partial<Record<Section, string>> = {}
  let name = first
  let lines: string[] = []
  for (const line of source.split('\n')) {
    const divider = line.match(DIVIDER)
    if (!divider) {
      lines.push(line)
      continue
    }
    sections[name] = lines.join('\n').trim()
    name = divider[1] as Section
    lines = []
  }
  sections[name] = lines.join('\n').trim()
  return sections
}

/** Shows why a block could not be built, next to its source, like a broken diagram. */
export function markBroken(pre: HTMLElement, message: string) {
  pre.classList.add('diagram-error')
  pre.dataset.error = message
}
