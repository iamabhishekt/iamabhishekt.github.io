// Light / night paper. The system setting wins until the reader picks one.

export type Theme = 'light' | 'dark'

const systemDark = window.matchMedia('(prefers-color-scheme: dark)')

export function currentTheme(): Theme {
  const chosen = document.documentElement.dataset.theme
  if (chosen === 'light' || chosen === 'dark') return chosen
  return systemDark.matches ? 'dark' : 'light'
}

/** Runs `listener` whenever the page switches theme, from the toggle or the system. */
export function onThemeChange(listener: (theme: Theme) => void) {
  document.addEventListener('themechange', () => listener(currentTheme()))
}

function announce() {
  document.dispatchEvent(new Event('themechange'))
}

export function setupThemeToggle() {
  const button = document.querySelector<HTMLButtonElement>('.theme-toggle')
  if (!button) return
  const label = () => button.setAttribute('aria-label', currentTheme() === 'dark' ? 'Switch to light' : 'Switch to dark')
  label()
  button.addEventListener('click', () => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Private mode: the choice lasts for this page only.
    }
    label()
    announce()
  })
  systemDark.addEventListener('change', () => {
    label()
    announce()
  })
}
