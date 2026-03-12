import { useState } from 'react'

import { Button } from '../ui/Button'
import { GameCard } from '../GameCard'
import {
  createCatBallTokens,
  createCatCheeseTokens,
  createCatMouseTokens,
  createCatPillowTokens,
  createCheeseBallTokens,
  createMouseCheeseTokens,
  createMouseBallTokens,
  createPillowBallTokens,
  createPillowCheeseTokens,
  createPillowMouseTokens,
  createRandomCatBallTokens,
  createRandomCatCheeseTokens,
  createRandomCatMouseTokens,
  createRandomCatPillowTokens,
  createRandomCheeseBallTokens,
  createRandomMouseCheeseTokens,
  createRandomMouseBallTokens,
  createRandomPillowBallTokens,
  createRandomPillowCheeseTokens,
  createRandomPillowMouseTokens,
} from '../colorRules'
import { CatBallIllustration } from '../illustrations/CatBallIllustration'
import { CatCheeseIllustration } from '../illustrations/CatCheeseIllustration'
import { CatMouseIllustration } from '../illustrations/CatMouseIllustration'
import { CatPillowIllustration } from '../illustrations/CatPillowIllustration'
import { CheeseBallIllustration } from '../illustrations/CheeseBallIllustration'
import { MouseBallIllustration } from '../illustrations/MouseBallIllustration'
import { MouseCheeseIllustration } from '../illustrations/MouseCheeseIllustration'
import { PillowBallIllustration } from '../illustrations/PillowBallIllustration'
import { PillowCheeseIllustration } from '../illustrations/PillowCheeseIllustration'
import { PillowMouseIllustration } from '../illustrations/PillowMouseIllustration'
import type {
  CatBallIllustrationTokens,
  CatCheeseIllustrationTokens,
  CatMouseIllustrationTokens,
  CatPillowIllustrationTokens,
  CheeseBallIllustrationTokens,
  MouseCheeseIllustrationTokens,
  MouseBallIllustrationTokens,
  PillowBallIllustrationTokens,
  PillowCheeseIllustrationTokens,
  PillowMouseIllustrationTokens,
} from '../palettes'

type DemoCards = {
  catCheese: CatCheeseIllustrationTokens
  catBall: CatBallIllustrationTokens
  catMouse: CatMouseIllustrationTokens
  catPillow: CatPillowIllustrationTokens
  cheeseBall: CheeseBallIllustrationTokens
  mouseCheese: MouseCheeseIllustrationTokens
  mouseBall: MouseBallIllustrationTokens
  pillowBall: PillowBallIllustrationTokens
  pillowCheese: PillowCheeseIllustrationTokens
  pillowMouse: PillowMouseIllustrationTokens
}

function createInitialCards(): DemoCards {
  return {
    catCheese: createCatCheeseTokens('grey', 'yellow'),
    catBall: createCatBallTokens('grey', 'blue'),
    catMouse: createCatMouseTokens('grey', 'blue'),
    catPillow: createCatPillowTokens('grey', 'red'),
    cheeseBall: createCheeseBallTokens('yellow', 'blue'),
    mouseCheese: createMouseCheeseTokens('blue', 'yellow'),
    mouseBall: createMouseBallTokens('yellow', 'blue'),
    pillowBall: createPillowBallTokens('red', 'blue'),
    pillowCheese: createPillowCheeseTokens('red', 'yellow'),
    pillowMouse: createPillowMouseTokens('red', 'blue'),
  }
}

function createRandomCards(): DemoCards {
  return {
    catCheese: createRandomCatCheeseTokens(),
    catBall: createRandomCatBallTokens(),
    catMouse: createRandomCatMouseTokens(),
    catPillow: createRandomCatPillowTokens(),
    cheeseBall: createRandomCheeseBallTokens(),
    mouseCheese: createRandomMouseCheeseTokens(),
    mouseBall: createRandomMouseBallTokens(),
    pillowBall: createRandomPillowBallTokens(),
    pillowCheese: createRandomPillowCheeseTokens(),
    pillowMouse: createRandomPillowMouseTokens(),
  }
}

export function CardDemo() {
  const [cards, setCards] = useState<DemoCards>(createInitialCards)

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-3">
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

        <GameCard
          title="Cat + mouse"
          description="The mouse uses its own base palette, while the bow and cat eyes stay on the fixed green accent tokens."
        >
          <CatMouseIllustration tokens={cards.catMouse} className="mx-auto w-full max-w-[320px]" />
        </GameCard>

        <GameCard
          title="Cat + pillow"
          description="The pillow picks its own base palette while the cat, collar tag, and eye accents stay consistent."
        >
          <CatPillowIllustration tokens={cards.catPillow} className="mx-auto w-full max-w-[320px]" />
        </GameCard>

        <GameCard
          title="Cheese + ball"
          description="This non-cat card uses two distinct base palettes with the green accent reserved for the stripe only."
        >
          <CheeseBallIllustration tokens={cards.cheeseBall} className="mx-auto w-full max-w-[300px]" />
        </GameCard>

        <GameCard
          title="Mouse + ball"
          description="The mouse and ball randomize independently, while the bow stays on the fixed green accent color."
        >
          <MouseBallIllustration tokens={cards.mouseBall} className="mx-auto w-full max-w-[300px]" />
        </GameCard>

        <GameCard
          title="Mouse + cheese"
          description="Mouse and cheese use separate base palettes while the mouse bow remains on the fixed accent green."
        >
          <MouseCheeseIllustration tokens={cards.mouseCheese} className="mx-auto w-full max-w-[300px]" />
        </GameCard>

        <GameCard
          title="Pillow + ball"
          description="The pillow and ball randomize independently, with the green accent reserved for the stripe only."
        >
          <PillowBallIllustration tokens={cards.pillowBall} className="mx-auto w-full max-w-[300px]" />
        </GameCard>

        <GameCard
          title="Pillow + cheese"
          description="The pillow and cheese swap through the base palette set while preserving the cleaned asset styling."
        >
          <PillowCheeseIllustration tokens={cards.pillowCheese} className="mx-auto w-full max-w-[300px]" />
        </GameCard>

        <GameCard
          title="Pillow + mouse"
          description="The pillow and mouse recolor independently, while the mouse bow keeps the fixed accent green."
        >
          <PillowMouseIllustration tokens={cards.pillowMouse} className="mx-auto w-full max-w-[300px]" />
        </GameCard>
      </div>

      <div className="flex justify-center">
        <Button onClick={() => setCards(createRandomCards())}>Randomize card colors</Button>
      </div>
    </div>
  )
}
