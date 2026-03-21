import {
  ILLUSTRATION_NAMES,
  OBJECT_NAMES,
  getIllustrationsForTarget,
  resolveCard,
  type IllustrationName,
  type ObjectName,
  type ResolvedCard,
} from './cardResolver'
import type { GameMode } from './gameMode'

export const ROUND_DURATION_SECONDS = 60
export const CORRECT_VALIDATION_MS = 900
export const WRONG_VALIDATION_MS = 2300
export const CARD_TRANSITION_PHASE_MS = 600
export const CARD_TRANSITION_TOTAL_MS = CARD_TRANSITION_PHASE_MS * 2
export const RECENT_ILLUSTRATION_LIMIT = 3
export const BEST_TOTAL_STORAGE_KEY = 'paws-and-think-best-total'

export function getRecentIllustrationsWithNext(
  recentIllustrations: IllustrationName[],
  currentIllustrations: IllustrationName | IllustrationName[],
) {
  const nextIllustrations = Array.isArray(currentIllustrations)
    ? currentIllustrations
    : [currentIllustrations]

  return [...nextIllustrations, ...recentIllustrations].slice(0, RECENT_ILLUSTRATION_LIMIT)
}

function getRandomItem<T>(items: readonly T[]): T {
  const index = Math.floor(Math.random() * items.length)
  return items[index]
}

function getShuffledItems<T>(items: readonly T[]): T[] {
  const nextItems = [...items]

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const currentItem = nextItems[index]

    nextItems[index] = nextItems[swapIndex]
    nextItems[swapIndex] = currentItem
  }

  return nextItems
}

function resolveSingleCardRound(recentIllustrations: IllustrationName[]) {
  const disallowed = new Set(recentIllustrations)
  const allowedIllustrations = ILLUSTRATION_NAMES.filter((illustration) => !disallowed.has(illustration))

  if (allowedIllustrations.length === 0) {
    const card = resolveCard({})
    return {
      cards: [card],
      correctAnswer: card.targetAnswer ?? OBJECT_NAMES[0],
    }
  }

  const illustration = getRandomItem(allowedIllustrations)
  const card = resolveCard({ illustration })

  return {
    cards: [card],
    correctAnswer: card.targetAnswer ?? OBJECT_NAMES[0],
  }
}

function resolveFiveCardRound(recentIllustrations: IllustrationName[]) {
  const repeatedAnswer = getRandomItem(OBJECT_NAMES)
  const uniqueWrongAnswers = getShuffledItems(
    OBJECT_NAMES.filter((objectName) => objectName !== repeatedAnswer),
  ).slice(0, 3)
  const roundAnswers = getShuffledItems([
    repeatedAnswer,
    repeatedAnswer,
    ...uniqueWrongAnswers,
  ])

  const disallowed = new Set(recentIllustrations)
  const usedIllustrations = new Set<IllustrationName>()
  const cards: ResolvedCard[] = []

  const MAX_ATTEMPTS = 50

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    usedIllustrations.clear()
    cards.length = 0

    const shuffledAnswers = getShuffledItems(roundAnswers)
    let canResolveAllCards = true

    for (const answer of shuffledAnswers) {
      const availableIllustrations = getShuffledItems(
        getIllustrationsForTarget(answer).filter(
          (illustration) =>
            !usedIllustrations.has(illustration) && !disallowed.has(illustration),
        ),
      )

      const fallbackIllustrations = getShuffledItems(
        getIllustrationsForTarget(answer).filter(
          (illustration) => !usedIllustrations.has(illustration),
        ),
      )

      const illustration = availableIllustrations[0] ?? fallbackIllustrations[0]

      if (!illustration) {
        canResolveAllCards = false
        break
      }

      usedIllustrations.add(illustration)
      cards.push(resolveCard({ illustration, targetAnswer: answer }))
    }

    if (canResolveAllCards && cards.length === roundAnswers.length) {
      return {
        cards,
        correctAnswer: repeatedAnswer,
      }
    }
  }

  return {
    cards: roundAnswers.map((answer, index) =>
      resolveCard({
        illustration: getIllustrationsForTarget(answer)[index % getIllustrationsForTarget(answer).length],
        targetAnswer: answer,
      }),
    ),
    correctAnswer: repeatedAnswer,
  }
}

export function resolveSessionRound(
  mode: GameMode,
  recentIllustrations: IllustrationName[],
): { cards: ResolvedCard[]; correctAnswer: ObjectName } {
  return mode === 'five-card'
    ? resolveFiveCardRound(recentIllustrations)
    : resolveSingleCardRound(recentIllustrations)
}

export function resolveSessionCard(recentIllustrations: IllustrationName[]): ResolvedCard {
  return resolveSingleCardRound(recentIllustrations).cards[0]
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
