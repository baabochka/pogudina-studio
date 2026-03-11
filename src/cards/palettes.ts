export type BasePaletteName = 'red' | 'orange' | 'yellow' | 'blue' | 'grey'

export type TwoTonePalette = {
  light: string
  shade: string
}

export type SharedIllustrationTokens = {
  outline: string
  black: string
  white: string
  nose: string
  accent: TwoTonePalette
  cat: TwoTonePalette
}

export type CatCheeseIllustrationTokens = SharedIllustrationTokens & {
  cheese: TwoTonePalette
}

export type CatBallIllustrationTokens = SharedIllustrationTokens & {
  ball: TwoTonePalette
}

export const basePalettes: Record<BasePaletteName, TwoTonePalette> = {
  red: { light: '#D7172F', shade: '#9E0918' },
  orange: { light: '#F7941D', shade: '#DE761C' },
  yellow: { light: '#FFDF5D', shade: '#E9C31E' },
  blue: { light: '#005BAA', shade: '#023F88' },
  grey: { light: '#808384', shade: '#5C5857' },
}

export const neutrals = {
  white: '#FFFFFF',
  black: '#000000',
} as const

export const fixedDetails = {
  nose: '#692A00',
  accent: { light: '#39B54A', shade: '#006734' },
} as const
