import type { CSSProperties } from 'react'

import rawSvg from '../../features/games/cat-cheese/assets/mouse_ball.svg?raw'
import type { MouseBallIllustrationTokens } from '../palettes'
import { extractSvgBody } from './extractSvgBody'

type MouseBallIllustrationProps = {
  tokens: MouseBallIllustrationTokens
  className?: string
}

type SvgVariables = CSSProperties & {
  '--outline': string
  '--black': string
  '--white': string
  '--ball-light': string
  '--ball-shade': string
  '--mouse-light': string
  '--mouse-shade': string
  '--accent-light': string
  '--accent-shade': string
}

const markup = extractSvgBody(rawSvg)

export function MouseBallIllustration({ tokens, className }: MouseBallIllustrationProps) {
  const style: SvgVariables = {
    '--outline': tokens.outline,
    '--black': tokens.black,
    '--white': tokens.white,
    '--ball-light': tokens.ball.light,
    '--ball-shade': tokens.ball.shade,
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
      aria-label="Mouse and ball illustration"
      role="img"
    >
      <defs>
        <style>
          {`
            .fill-none { fill: none; }
            .fill-white { fill: var(--white); }
            .fill-black { fill: var(--black); }
            .fill-ball-light { fill: var(--ball-light); }
            .fill-ball-shade { fill: var(--ball-shade); }
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
