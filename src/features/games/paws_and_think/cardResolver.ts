import type { BasePaletteName } from './palettes'

export type ObjectName = 'cat' | 'pillow' | 'mouse' | 'cheese' | 'ball'
export type PaletteName = BasePaletteName
export type IllustrationName =
  | 'cat-ball'
  | 'cat-cheese'
  | 'cat-mouse'
  | 'cat-pillow'
  | 'ball-cheese'
  | 'ball-mouse'
  | 'ball-pillow'
  | 'cheese-mouse'
  | 'cheese-pillow'
  | 'mouse-pillow'
export type TargetAnswer = ObjectName

export type MainColorPair = {
  colorA: PaletteName
  colorB: PaletteName
}

export type ManualColorInput = MainColorPair

export type ResolveCardParams = {
  illustration?: IllustrationName
  manual?: ManualColorInput
  targetAnswer?: TargetAnswer
}

export type ResolvedCard = {
  illustration: IllustrationName
  objectA: ObjectName
  objectB: ObjectName
  colorA: PaletteName
  colorB: PaletteName
  targetAnswer?: TargetAnswer
  source: 'manual' | 'target-answer' | 'random-fallback'
}

const OBJECT_NAMES: ObjectName[] = ['cat', 'pillow', 'mouse', 'cheese', 'ball']

const PALETTE_NAMES: PaletteName[] = ['red', 'orange', 'yellow', 'blue', 'grey']

const ILLUSTRATION_NAMES: IllustrationName[] = [
  'cat-ball',
  'cat-cheese',
  'cat-mouse',
  'cat-pillow',
  'ball-cheese',
  'ball-mouse',
  'ball-pillow',
  'cheese-mouse',
  'cheese-pillow',
  'mouse-pillow',
]

export const ORIGINAL_COLOR_BY_OBJECT: Record<ObjectName, PaletteName> = {
  cat: 'orange',
  pillow: 'red',
  mouse: 'grey',
  cheese: 'yellow',
  ball: 'blue',
}

export const OBJECTS_BY_ILLUSTRATION: Record<IllustrationName, readonly [ObjectName, ObjectName]> = {
  'cat-ball': ['cat', 'ball'],
  'cat-cheese': ['cat', 'cheese'],
  'cat-mouse': ['cat', 'mouse'],
  'cat-pillow': ['cat', 'pillow'],
  'ball-cheese': ['ball', 'cheese'],
  'ball-mouse': ['ball', 'mouse'],
  'ball-pillow': ['ball', 'pillow'],
  'cheese-mouse': ['cheese', 'mouse'],
  'cheese-pillow': ['cheese', 'pillow'],
  'mouse-pillow': ['mouse', 'pillow'],
}

function getRandomItem<T>(items: T[]): T {
  const index = Math.floor(Math.random() * items.length)
  return items[index]
}

function getObjectsForIllustration(illustration: IllustrationName): [ObjectName, ObjectName] {
  const [objectA, objectB] = OBJECTS_BY_ILLUSTRATION[illustration]
  return [objectA, objectB]
}

function toResolvedCard(
  illustration: IllustrationName,
  colorA: PaletteName,
  colorB: PaletteName,
  source: ResolvedCard['source'],
  targetAnswer?: TargetAnswer,
): ResolvedCard {
  const [objectA, objectB] = getObjectsForIllustration(illustration)

  return {
    illustration,
    objectA,
    objectB,
    colorA,
    colorB,
    targetAnswer,
    source,
  }
}

export function isValidMainColorPair(
  illustration: IllustrationName,
  colorA: PaletteName,
  colorB: PaletteName,
): boolean {
  if (colorA === colorB) {
    return false
  }

  const [objectA, objectB] = getObjectsForIllustration(illustration)
  const originalA = ORIGINAL_COLOR_BY_OBJECT[objectA]
  const originalB = ORIGINAL_COLOR_BY_OBJECT[objectB]

  if (colorA === originalA && colorB === originalB) {
    return false
  }

  if (colorA === originalB && colorB === originalA) {
    return false
  }

  return true
}

export function assertValidMainColorPair(
  illustration: IllustrationName,
  colorA: PaletteName,
  colorB: PaletteName,
): void {
  if (isValidMainColorPair(illustration, colorA, colorB)) {
    return
  }

  const [objectA, objectB] = getObjectsForIllustration(illustration)
  throw new Error(
    `Invalid main color pair for ${illustration}: ${objectA}=${colorA}, ${objectB}=${colorB}.`,
  )
}

export function cardProducesTargetAnswer(
  illustration: IllustrationName,
  colorA: PaletteName,
  colorB: PaletteName,
  targetAnswer: TargetAnswer,
): boolean {
  const [objectA, objectB] = getObjectsForIllustration(illustration)
  const originalA = ORIGINAL_COLOR_BY_OBJECT[objectA]
  const originalB = ORIGINAL_COLOR_BY_OBJECT[objectB]
  const targetOriginalColor = ORIGINAL_COLOR_BY_OBJECT[targetAnswer]

  if (targetAnswer === objectA) {
    return colorA === originalA && colorB !== originalA && colorB !== originalB
  }

  if (targetAnswer === objectB) {
    return colorB === originalB && colorA !== originalA && colorA !== originalB
  }

  return (
    colorA !== originalA &&
    colorA !== originalB &&
    colorB !== originalB &&
    colorB !== originalA &&
    colorA !== targetOriginalColor &&
    colorB !== targetOriginalColor
  )
}

export function getValidMainColorPairs(illustration: IllustrationName): MainColorPair[] {
  const validPairs: MainColorPair[] = []

  for (const colorA of PALETTE_NAMES) {
    for (const colorB of PALETTE_NAMES) {
      if (!isValidMainColorPair(illustration, colorA, colorB)) {
        continue
      }

      validPairs.push({ colorA, colorB })
    }
  }

  return validPairs
}

export function getValidPairsForIllustrationAndTarget(
  illustration: IllustrationName,
  targetAnswer: TargetAnswer,
): MainColorPair[] {
  return getValidMainColorPairs(illustration).filter(({ colorA, colorB }) =>
    cardProducesTargetAnswer(illustration, colorA, colorB, targetAnswer),
  )
}

function getIllustrationsForTarget(targetAnswer: TargetAnswer): IllustrationName[] {
  return ILLUSTRATION_NAMES.filter((illustration) => {
    return getValidPairsForIllustrationAndTarget(illustration, targetAnswer).length > 0
  })
}

function getTargetsForIllustration(illustration: IllustrationName): TargetAnswer[] {
  return OBJECT_NAMES.filter((targetAnswer) => {
    return getValidPairsForIllustrationAndTarget(illustration, targetAnswer).length > 0
  })
}

function getRandomTargetPair(
  illustration: IllustrationName,
  targetAnswer: TargetAnswer,
): MainColorPair {
  const validPairs = getValidPairsForIllustrationAndTarget(illustration, targetAnswer)

  if (validPairs.length === 0) {
    throw new Error(`No valid pairs found for ${illustration} producing target answer "${targetAnswer}".`)
  }

  return getRandomItem(validPairs)
}

function resolveRandomCard(illustration?: IllustrationName): ResolvedCard {
  const resolvedIllustration = illustration ?? getRandomItem(ILLUSTRATION_NAMES)
  const targetAnswer = getRandomItem(getTargetsForIllustration(resolvedIllustration))
  const { colorA, colorB } = getRandomTargetPair(resolvedIllustration, targetAnswer)

  return toResolvedCard(resolvedIllustration, colorA, colorB, 'random-fallback', targetAnswer)
}

export function resolveCard({
  illustration,
  manual,
  targetAnswer,
}: ResolveCardParams): ResolvedCard {
  if (manual) {
    if (!illustration) {
      throw new Error('Manual color input requires a specific illustration.')
    }

    if (isValidMainColorPair(illustration, manual.colorA, manual.colorB)) {
      const manualTarget =
        targetAnswer && cardProducesTargetAnswer(illustration, manual.colorA, manual.colorB, targetAnswer)
          ? targetAnswer
          : undefined

      return toResolvedCard(illustration, manual.colorA, manual.colorB, 'manual', manualTarget)
    }

    if (import.meta.env.DEV) {
      assertValidMainColorPair(illustration, manual.colorA, manual.colorB)
    }

    // Placeholder fallback: later we may generate colors that specifically produce
    // targetAnswer according to the game mechanic instead of using a generic valid pair.
    return resolveRandomCard(illustration)
  }

  if (targetAnswer) {
    const resolvedIllustration = illustration ?? getRandomItem(getIllustrationsForTarget(targetAnswer))
    const { colorA, colorB } = getRandomTargetPair(resolvedIllustration, targetAnswer)

    return toResolvedCard(resolvedIllustration, colorA, colorB, 'target-answer', targetAnswer)
  }

  return resolveRandomCard(illustration)
}
