export const CATEGORIES = {
  learn: { label: 'Learn', color: '#2f5fd0' },
  build: { label: 'Build', color: '#d6402a' },
  devlog: { label: 'Devlog', color: '#e3b021' },
} as const

export type Category = keyof typeof CATEGORIES

const WORDS_PER_MINUTE = 220

export function readingMinutes(markdown = ''): number {
  const words = markdown.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}
