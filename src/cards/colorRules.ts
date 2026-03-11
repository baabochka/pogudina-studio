import {
  basePalettes,
  fixedDetails,
  neutrals,
  type BasePaletteName,
  type CatBallIllustrationTokens,
  type CatCheeseIllustrationTokens,
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
