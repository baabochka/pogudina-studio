import { useState } from 'react'

import { Button } from '../../components/ui/Button'
import { GameCard } from '../GameCard'
import {
  createCatBallTokens,
  createCatCheeseTokens,
  createRandomCatBallTokens,
  createRandomCatCheeseTokens,
} from '../colorRules'
import { CatBallIllustration } from '../illustrations/CatBallIllustration'
import { CatCheeseIllustration } from '../illustrations/CatCheeseIllustration'
import type { CatBallIllustrationTokens, CatCheeseIllustrationTokens } from '../palettes'

type DemoCards = {
  catCheese: CatCheeseIllustrationTokens
  catBall: CatBallIllustrationTokens
}

function createInitialCards(): DemoCards {
  return {
    catCheese: createCatCheeseTokens('grey', 'yellow'),
    catBall: createCatBallTokens('grey', 'blue'),
  }
}

function createRandomCards(): DemoCards {
  return {
    catCheese: createRandomCatCheeseTokens(),
    catBall: createRandomCatBallTokens(),
  }
}

export function CardDemo() {
  const [cards, setCards] = useState<DemoCards>(createInitialCards)

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <GameCard
          title="Cat + cheese"
          description="Shared semantic tokens drive the cat, cheese, outlines, neutrals, and accent eye colors."
        >
          <CatCheeseIllustration tokens={cards.catCheese} className="mx-auto w-full max-w-[320px]" />
        </GameCard>

        <GameCard
          title="Cat + ball"
          description="The ball uses a different base palette from the cat, while the green accent is reserved for eyes and stripe details."
        >
          <CatBallIllustration tokens={cards.catBall} className="mx-auto w-full max-w-[280px]" />
        </GameCard>
      </div>

      <div className="flex justify-center">
        <Button onClick={() => setCards(createRandomCards())}>Randomize card colors</Button>
      </div>
    </div>
  )
}
