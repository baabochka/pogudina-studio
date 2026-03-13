import { ILLUSTRATION_NAMES, resolveCard, type IllustrationName, type ResolvedCard } from './cardResolver'

export const ROUND_DURATION_SECONDS = 60
export const CORRECT_VALIDATION_MS = 900
export const WRONG_VALIDATION_MS = 2300
export const CARD_TRANSITION_PHASE_MS = 600
export const CARD_TRANSITION_TOTAL_MS = CARD_TRANSITION_PHASE_MS * 2
export const RECENT_ILLUSTRATION_LIMIT = 3
export const BEST_TOTAL_STORAGE_KEY = 'paws-and-think-best-total'

export function getRecentIllustrationsWithNext(
  recentIllustrations: IllustrationName[],
  currentIllustration: IllustrationName,
) {
  return [currentIllustration, ...recentIllustrations].slice(0, RECENT_ILLUSTRATION_LIMIT)
}

export function resolveSessionCard(recentIllustrations: IllustrationName[]): ResolvedCard {
  const disallowed = new Set(recentIllustrations)
  const allowedIllustrations = ILLUSTRATION_NAMES.filter((illustration) => !disallowed.has(illustration))

  if (allowedIllustrations.length === 0) {
    return resolveCard({})
  }

  const illustration = allowedIllustrations[Math.floor(Math.random() * allowedIllustrations.length)]
  return resolveCard({ illustration })
}

export function loadBestTotal() {
  if (typeof window === 'undefined') {
    return 0
  }

  const rawValue = window.localStorage.getItem(BEST_TOTAL_STORAGE_KEY)
  const parsedValue = Number(rawValue)

  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0
}

export function saveBestTotal(bestTotal: number) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(BEST_TOTAL_STORAGE_KEY, String(bestTotal))
}
