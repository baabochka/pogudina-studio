import type { CSSProperties } from 'react'

export type SharedSvgVariables = CSSProperties & {
  '--outline': string
  '--black': string
  '--white': string
  '--accent-light'?: string
  '--accent-shade'?: string
  '--nose-color'?: string
  '--tag-color'?: string
}

export type RoleColorVars<Role extends string> = {
  [K in `--${Role}-${'light' | 'shade'}`]: string
}

export type CatBallSvgVariables = SharedSvgVariables & RoleColorVars<'cat'> & RoleColorVars<'ball'>
export type CatCheeseSvgVariables = SharedSvgVariables & RoleColorVars<'cat'> & RoleColorVars<'cheese'>
export type CatMouseSvgVariables = SharedSvgVariables & RoleColorVars<'cat'> & RoleColorVars<'mouse'>
export type CatPillowSvgVariables = SharedSvgVariables & RoleColorVars<'cat'> & RoleColorVars<'pillow'>
export type CheeseBallSvgVariables = SharedSvgVariables & RoleColorVars<'cheese'> & RoleColorVars<'ball'>
export type MouseBallSvgVariables = SharedSvgVariables & RoleColorVars<'mouse'> & RoleColorVars<'ball'>
export type MouseCheeseSvgVariables = SharedSvgVariables & RoleColorVars<'mouse'> & RoleColorVars<'cheese'>
export type PillowBallSvgVariables = SharedSvgVariables & RoleColorVars<'pillow'> & RoleColorVars<'ball'>
export type PillowCheeseSvgVariables = SharedSvgVariables & RoleColorVars<'pillow'> & RoleColorVars<'cheese'>
export type PillowMouseSvgVariables = SharedSvgVariables & RoleColorVars<'pillow'> & RoleColorVars<'mouse'>
