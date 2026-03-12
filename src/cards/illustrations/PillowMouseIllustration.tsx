import type { CSSProperties } from 'react'

import rawSvg from '../../features/games/cat-cheese/assets/pillow_mouse.svg?raw'
import type { PillowMouseIllustrationTokens } from '../palettes'
import { extractSvgBody } from './extractSvgBody'

type PillowMouseIllustrationProps = {
  tokens: PillowMouseIllustrationTokens
  className?: string
}

type SvgVariables = CSSProperties & {
  '--outline': string
  '--black': string
  '--white': string
  '--pillow-light': string
  '--pillow-shade': string
  '--mouse-light': string
  '--mouse-shade': string
  '--accent-light': string
  '--accent-shade': string
}

const markup = extractSvgBody(rawSvg)

export function PillowMouseIllustration({ tokens, className }: PillowMouseIllustrationProps) {
  const style: SvgVariables = {
    '--outline': tokens.outline,
    '--black': tokens.black,
    '--white': tokens.white,
    '--pillow-light': tokens.pillow.light,
    '--pillow-shade': tokens.pillow.shade,
    '--mouse-light': tokens.mouse.light,
    '--mouse-shade': tokens.mouse.shade,
    '--accent-light': tokens.accent.light,
    '--accent-shade': tokens.accent.shade,
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 288 431.15"
      className={className}
      style={style}
      aria-label="Pillow and mouse illustration"
      role="img"
    >
      <defs>
        <style>
          {`
            .fill-none { fill: none; }
            .fill-white { fill: var(--white); }
            .fill-black { fill: var(--black); }
            .fill-pillow-light { fill: var(--pillow-light); }
            .fill-pillow-shade { fill: var(--pillow-shade); }
            .fill-mouse-light { fill: var(--mouse-light); }
            .fill-mouse-shade { fill: var(--mouse-shade); }
            .fill-accent-light { fill: var(--accent-light); }
            .fill-accent-shade { fill: var(--accent-shade); }
            .stroke-outline { stroke: var(--outline); }
            .round { stroke-linecap: round; stroke-linejoin: round; }
            .miter { stroke-miterlimit: 10; }
            .stroke-0 { stroke-width: 0px; }
            .stroke-1 { stroke-width: 1px; }
            .stroke-2 { stroke-width: 2px; }
            .stroke-3 { stroke-width: 3px; }
          `}
        </style>
      </defs>
      <g dangerouslySetInnerHTML={{ __html: markup }} />
    </svg>
  )
}
