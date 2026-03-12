import {
  basePalettes,
  fixedDetails,
  neutrals,
  type BasePaletteName,
  type CatBallIllustrationTokens,
  type CatCheeseIllustrationTokens,
  type CatMouseIllustrationTokens,
  type CatPillowIllustrationTokens,
  type CheeseBallIllustrationTokens,
  type MouseCheeseIllustrationTokens,
  type MouseBallIllustrationTokens,
  type PillowBallIllustrationTokens,
  type PillowCheeseIllustrationTokens,
  type PillowMouseIllustrationTokens,
  type SharedIllustrationTokens,
  type TwoTonePalette,
} from './palettes'

const basePaletteNames = Object.keys(basePalettes) as BasePaletteName[]

function getRandomItem<T>(items: T[]): T {
  const index = Math.floor(Math.random() * items.length)
  return items[index]
}

export function pickRandomBasePaletteName(excluded: BasePaletteName[] = []): BasePaletteName {
  const availablePalettes = basePaletteNames.filter((name) => !excluded.includes(name))
  return getRandomItem(availablePalettes)
}

export function pickDistinctBasePalettePair(): [BasePaletteName, BasePaletteName] {
  const first = pickRandomBasePaletteName()
  const second = pickRandomBasePaletteName([first])

  return [first, second]
}

export function getBasePalette(name: BasePaletteName): TwoTonePalette {
  return basePalettes[name]
}

function createSharedTokens(catName: BasePaletteName): SharedIllustrationTokens {
  return {
    outline: neutrals.black,
    black: neutrals.black,
    white: neutrals.white,
    nose: fixedDetails.nose,
    accent: fixedDetails.accent,
    cat: getBasePalette(catName),
  }
}

export function createCatCheeseTokens(
  catName: BasePaletteName,
  cheeseName: BasePaletteName,
): CatCheeseIllustrationTokens {
  if (catName === cheeseName) {
    throw new Error('Cat and cheese cannot use the same base palette.')
  }

  return {
    ...createSharedTokens(catName),
    cheese: getBasePalette(cheeseName),
  }
}

export function createRandomCatCheeseTokens(): CatCheeseIllustrationTokens {
  const [catName, cheeseName] = pickDistinctBasePalettePair()

  return createCatCheeseTokens(catName, cheeseName)
}

export function createCatBallTokens(
  catName: BasePaletteName,
  ballName: BasePaletteName,
): CatBallIllustrationTokens {
  if (catName === ballName) {
    throw new Error('Cat and ball cannot use the same base palette.')
  }

  return {
    ...createSharedTokens(catName),
    ball: getBasePalette(ballName),
  }
}

export function createRandomCatBallTokens(): CatBallIllustrationTokens {
  const [catName, ballName] = pickDistinctBasePalettePair()

  return createCatBallTokens(catName, ballName)
}

export function createCatMouseTokens(
  catName: BasePaletteName,
  mouseName: BasePaletteName,
): CatMouseIllustrationTokens {
  if (catName === mouseName) {
    throw new Error('Cat and mouse cannot use the same base palette.')
  }

  return {
    ...createSharedTokens(catName),
    mouse: getBasePalette(mouseName),
  }
}

export function createRandomCatMouseTokens(): CatMouseIllustrationTokens {
  const [catName, mouseName] = pickDistinctBasePalettePair()

  return createCatMouseTokens(catName, mouseName)
}

export function createCatPillowTokens(
  catName: BasePaletteName,
  pillowName: BasePaletteName,
): CatPillowIllustrationTokens {
  if (catName === pillowName) {
    throw new Error('Cat and pillow cannot use the same base palette.')
  }

  return {
    ...createSharedTokens(catName),
    pillow: getBasePalette(pillowName),
  }
}

export function createRandomCatPillowTokens(): CatPillowIllustrationTokens {
  const [catName, pillowName] = pickDistinctBasePalettePair()

  return createCatPillowTokens(catName, pillowName)
}

function createNonCatSharedTokens() {
  return {
    outline: neutrals.black,
    black: neutrals.black,
    white: neutrals.white,
    accent: fixedDetails.accent,
  }
}

export function createCheeseBallTokens(
  cheeseName: BasePaletteName,
  ballName: BasePaletteName,
): CheeseBallIllustrationTokens {
  if (cheeseName === ballName) {
    throw new Error('Cheese and ball cannot use the same base palette.')
  }

  return {
    ...createNonCatSharedTokens(),
    cheese: getBasePalette(cheeseName),
    ball: getBasePalette(ballName),
  }
}

export function createRandomCheeseBallTokens(): CheeseBallIllustrationTokens {
  const [cheeseName, ballName] = pickDistinctBasePalettePair()

  return createCheeseBallTokens(cheeseName, ballName)
}

export function createMouseCheeseTokens(
  mouseName: BasePaletteName,
  cheeseName: BasePaletteName,
): MouseCheeseIllustrationTokens {
  if (mouseName === cheeseName) {
    throw new Error('Mouse and cheese cannot use the same base palette.')
  }

  return {
    ...createNonCatSharedTokens(),
    mouse: getBasePalette(mouseName),
    cheese: getBasePalette(cheeseName),
  }
}

export function createRandomMouseCheeseTokens(): MouseCheeseIllustrationTokens {
  const [mouseName, cheeseName] = pickDistinctBasePalettePair()

  return createMouseCheeseTokens(mouseName, cheeseName)
}

export function createMouseBallTokens(
  mouseName: BasePaletteName,
  ballName: BasePaletteName,
): MouseBallIllustrationTokens {
  if (mouseName === ballName) {
    throw new Error('Mouse and ball cannot use the same base palette.')
  }

  return {
    ...createNonCatSharedTokens(),
    mouse: getBasePalette(mouseName),
    ball: getBasePalette(ballName),
  }
}

export function createRandomMouseBallTokens(): MouseBallIllustrationTokens {
  const [mouseName, ballName] = pickDistinctBasePalettePair()

  return createMouseBallTokens(mouseName, ballName)
}

export function createPillowBallTokens(
  pillowName: BasePaletteName,
  ballName: BasePaletteName,
): PillowBallIllustrationTokens {
  if (pillowName === ballName) {
    throw new Error('Pillow and ball cannot use the same base palette.')
  }

  return {
    ...createNonCatSharedTokens(),
    pillow: getBasePalette(pillowName),
    ball: getBasePalette(ballName),
  }
}

export function createRandomPillowBallTokens(): PillowBallIllustrationTokens {
  const [pillowName, ballName] = pickDistinctBasePalettePair()

  return createPillowBallTokens(pillowName, ballName)
}

export function createPillowCheeseTokens(
  pillowName: BasePaletteName,
  cheeseName: BasePaletteName,
): PillowCheeseIllustrationTokens {
  if (pillowName === cheeseName) {
    throw new Error('Pillow and cheese cannot use the same base palette.')
  }

  return {
    ...createNonCatSharedTokens(),
    pillow: getBasePalette(pillowName),
    cheese: getBasePalette(cheeseName),
  }
}

export function createRandomPillowCheeseTokens(): PillowCheeseIllustrationTokens {
  const [pillowName, cheeseName] = pickDistinctBasePalettePair()

  return createPillowCheeseTokens(pillowName, cheeseName)
}

export function createPillowMouseTokens(
  pillowName: BasePaletteName,
  mouseName: BasePaletteName,
): PillowMouseIllustrationTokens {
  if (pillowName === mouseName) {
    throw new Error('Pillow and mouse cannot use the same base palette.')
  }

  return {
    ...createNonCatSharedTokens(),
    pillow: getBasePalette(pillowName),
    mouse: getBasePalette(mouseName),
  }
}

export function createRandomPillowMouseTokens(): PillowMouseIllustrationTokens {
  const [pillowName, mouseName] = pickDistinctBasePalettePair()

  return createPillowMouseTokens(pillowName, mouseName)
}

//TODO add a rule that both items cannot be the "correct" color - only one item at a time can have the original color
