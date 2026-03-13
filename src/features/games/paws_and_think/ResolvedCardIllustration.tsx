import {
  createCatBallTokens,
  createCatCheeseTokens,
  createCatMouseTokens,
  createCatPillowTokens,
  createCheeseBallTokens,
  createMouseBallTokens,
  createMouseCheeseTokens,
  createPillowBallTokens,
  createPillowCheeseTokens,
  createPillowMouseTokens,
} from './colorRules'
import type { ResolvedCard } from './cardResolver'
import { CatBallIllustration } from './illustrations/CatBallIllustration'
import { CatCheeseIllustration } from './illustrations/CatCheeseIllustration'
import { CatMouseIllustration } from './illustrations/CatMouseIllustration'
import { CatPillowIllustration } from './illustrations/CatPillowIllustration'
import { CheeseBallIllustration } from './illustrations/CheeseBallIllustration'
import { MouseBallIllustration } from './illustrations/MouseBallIllustration'
import { MouseCheeseIllustration } from './illustrations/MouseCheeseIllustration'
import { PillowBallIllustration } from './illustrations/PillowBallIllustration'
import { PillowCheeseIllustration } from './illustrations/PillowCheeseIllustration'
import { PillowMouseIllustration } from './illustrations/PillowMouseIllustration'

export function ResolvedCardIllustration({ card }: { card: ResolvedCard }) {
  const className = 'block h-full w-auto max-w-none'

  switch (card.illustration) {
    case 'cat-ball':
      return <CatBallIllustration tokens={createCatBallTokens(card.colorA, card.colorB)} className={className} />
    case 'cat-cheese':
      return <CatCheeseIllustration tokens={createCatCheeseTokens(card.colorA, card.colorB)} className={className} />
    case 'cat-mouse':
      return <CatMouseIllustration tokens={createCatMouseTokens(card.colorA, card.colorB)} className={className} />
    case 'cat-pillow':
      return <CatPillowIllustration tokens={createCatPillowTokens(card.colorA, card.colorB)} className={className} />
    case 'ball-cheese':
      return <CheeseBallIllustration tokens={createCheeseBallTokens(card.colorB, card.colorA)} className={className} />
    case 'ball-mouse':
      return <MouseBallIllustration tokens={createMouseBallTokens(card.colorB, card.colorA)} className={className} />
    case 'ball-pillow':
      return <PillowBallIllustration tokens={createPillowBallTokens(card.colorB, card.colorA)} className={className} />
    case 'cheese-mouse':
      return <MouseCheeseIllustration tokens={createMouseCheeseTokens(card.colorB, card.colorA)} className={className} />
    case 'cheese-pillow':
      return <PillowCheeseIllustration tokens={createPillowCheeseTokens(card.colorB, card.colorA)} className={className} />
    case 'mouse-pillow':
      return <PillowMouseIllustration tokens={createPillowMouseTokens(card.colorB, card.colorA)} className={className} />
  }
}
