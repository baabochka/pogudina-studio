import type { CSSProperties } from 'react'

import rawSvg from '../../features/games/cat-cheese/assets/cat_mouse_svg.svg?raw'
import type { CatMouseIllustrationTokens } from '../palettes'
import { extractSvgBody } from './extractSvgBody'

type CatMouseIllustrationProps = {
  tokens: CatMouseIllustrationTokens
  className?: string
}

type SvgVariables = CSSProperties & {
  '--outline': string
  '--black': string
  '--white': string
  '--cat-light': string
  '--cat-shade': string
  '--mouse-light': string
  '--mouse-shade': string
  '--accent-light': string
  '--accent-shade': string
  '--nose-fixed': string
  '--fish-fixed': string
}

const markup = extractSvgBody(rawSvg)

export function CatMouseIllustration({ tokens, className }: CatMouseIllustrationProps) {
  const style: SvgVariables = {
    '--outline': tokens.outline,
    '--black': tokens.black,
    '--white': tokens.white,
    '--cat-light': tokens.cat.light,
    '--cat-shade': tokens.cat.shade,
    '--mouse-light': tokens.mouse.light,
    '--mouse-shade': tokens.mouse.shade,
    '--accent-light': tokens.accent.light,
    '--accent-shade': tokens.accent.shade,
    '--nose-fixed': tokens.nose,
    '--fish-fixed': tokens.white,
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 288 431.15"
      className={className}
      style={style}
      aria-label="Cat and mouse illustration"
      role="img"
    >
      <defs>
        <style>
          {`
            .fill-none { fill: none; }
            .fill-white { fill: var(--white); }
            .fill-black { fill: var(--black); }
            .fill-cat-light { fill: var(--cat-light); }
            .fill-cat-shade { fill: var(--cat-shade); }
            .fill-mouse-light { fill: var(--mouse-light); }
            .fill-mouse-shade { fill: var(--mouse-shade); }
            .fill-accent-light { fill: var(--accent-light); }
            .fill-accent-shade { fill: var(--accent-shade); }
            .fill-nose-fixed { fill: var(--nose-fixed); }
            .fill-fish-fixed { fill: var(--fish-fixed); }
            .stroke-outline { stroke: var(--outline); }
            .round { stroke-linecap: round; stroke-linejoin: round; }
            .miter { stroke-miterlimit: 10; }
            .stroke-0 { stroke-width: 0px; }
            .stroke-1 { stroke-width: 1px; }
            .stroke-2 { stroke-width: 2px; }
            .stroke-3 { stroke-width: 3px; }
            .non-scaling-stroke { vector-effect: non-scaling-stroke; }
          `}
        </style>
      </defs>
      <g dangerouslySetInnerHTML={{ __html: markup }} />
    </svg>
  )
}
