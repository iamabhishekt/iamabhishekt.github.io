// ```playground blocks: HTML first, then optional ---css and ---js. Readers edit the
// code and the result updates live (Sandpack, CodeSandbox's in-browser runner).

import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
  type SandpackTheme,
} from '@codesandbox/sandpack-react'
import { splitSections } from './sections'
import { currentTheme, onThemeChange, type Theme } from './theme'

const FONT = { body: 'Geist Mono, ui-monospace, monospace', mono: 'Geist Mono, ui-monospace, monospace', size: '14px', lineHeight: '1.6' }

const THEMES: Record<Theme, SandpackTheme> = {
  light: {
    colors: {
      surface1: '#fbf9f3',
      surface2: '#d8d1c0',
      surface3: '#ece9e1',
      clickable: '#5d574b',
      base: '#1b1915',
      disabled: '#a59e8f',
      hover: '#1b1915',
      accent: '#2f5fd0',
      error: '#d6402a',
      errorSurface: '#fbe3dd',
    },
    syntax: {
      plain: '#1b1915',
      comment: { color: '#8a8272', fontStyle: 'italic' },
      keyword: '#d6402a',
      tag: '#2f5fd0',
      punctuation: '#5d574b',
      definition: '#1b1915',
      property: '#2f5fd0',
      static: '#a8560f',
      string: '#2f8f5b',
    },
    font: FONT,
  },
  dark: {
    colors: {
      surface1: '#282520',
      surface2: '#3b372f',
      surface3: '#1d1b18',
      clickable: '#a59e8f',
      base: '#ece6d8',
      disabled: '#5d574b',
      hover: '#ece6d8',
      accent: '#ffd43b',
      error: '#ff8a73',
      errorSurface: '#3a211b',
    },
    syntax: {
      plain: '#ece6d8',
      comment: { color: '#8a8272', fontStyle: 'italic' },
      keyword: '#ff8a73',
      tag: '#8fb0ff',
      punctuation: '#a59e8f',
      definition: '#ece6d8',
      property: '#8fb0ff',
      static: '#ffd43b',
      string: '#8fd6a8',
    },
    font: FONT,
  },
}

function ResetButton() {
  const { sandpack } = useSandpack()
  return (
    <button type="button" className="playground-reset" onClick={() => sandpack.resetAllFiles()}>
      Reset code
    </button>
  )
}

function Playground({ source }: { source: string }) {
  const [theme, setTheme] = useState(currentTheme)
  useEffect(() => onThemeChange(setTheme), [])

  const { html = '', css, js } = splitSections(source, 'html')
  const page = ['<!DOCTYPE html>', css !== undefined && '<link rel="stylesheet" href="/styles.css" />', '', html]
  if (js !== undefined) page.push('', '<script src="/index.js"></script>')
  const files: Record<string, string> = { '/index.html': page.filter((line) => line !== false).join('\n') }
  if (css !== undefined) files['/styles.css'] = css
  if (js !== undefined) files['/index.js'] = js

  return (
    <SandpackProvider
      template="static"
      files={files}
      theme={THEMES[theme]}
      options={{ visibleFiles: Object.keys(files), activeFile: css !== undefined ? '/styles.css' : '/index.html' }}
    >
      <SandpackLayout>
        <SandpackCodeEditor showTabs wrapContent />
        <SandpackPreview showOpenInCodeSandbox={false} actionsChildren={<ResetButton />} />
      </SandpackLayout>
    </SandpackProvider>
  )
}

export function mountPlaygrounds(blocks: HTMLElement[]) {
  for (const pre of blocks) {
    const host = document.createElement('figure')
    host.className = 'playground'
    pre.replaceWith(host)
    createRoot(host).render(<Playground source={pre.textContent ?? ''} />)
  }
}
