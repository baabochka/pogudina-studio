import { Suspense, lazy, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { CaseStudyPageNav } from '../components/case-study/CaseStudyPageNav'
import { SectionBlock } from '../components/case-study/SectionBlock'
import { Container } from '../components/ui/Container'
import { getGameBySlug } from '../data/games'
const GameBoardRound = lazy(() =>
  import('../features/games/paws_and_think/GameBoardRound').then((module) => ({
    default: module.GameBoardRound,
  })),
)

const gameSections = [
  { id: 'play', label: 'Game' },
  { id: 'context', label: 'Problem' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'approach', label: 'Approach' },
  { id: 'engineering-notes', label: 'Engineering notes' },
  { id: 'design-decisions', label: 'Design tradeoffs' },
  { id: 'impact', label: 'Outcome' },
  { id: 'next-steps', label: 'Next steps' },
] as const

const pawsAndThinkDetails = {
  context: [
    'Paws and Think started as a physical educational game built to help children practice color recognition, object matching, and logical elimination through tactile play.',
    'The web version emerged during remote learning, when the game needed to work without printed materials or in-person facilitation while keeping the rules easy to understand.',
    'The current direction is focused on performance and scalability so the system can support more cards, more modes, and more interaction depth without turning into a maintenance-heavy asset library.',
  ],
  challenges: [
    'Managing 50+ static card variations made the original implementation difficult to maintain and extend.',
    'The game assets created a large bundle footprint of about 9.6 MB, which was too heavy for a lightweight browser experience.',
    'The system needed to become scalable enough to support future cards, levels, and interaction states without multiplying asset complexity.',
    'Usability still had to stay approachable for young users, which meant preserving visual clarity and simple feedback.',
  ],
  approach: [
    'Switched to SVG-based rendering instead of relying on a large library of static assets.',
    'Built reusable illustration components so new combinations could be assembled through code rather than duplicated files.',
    'Introduced dynamic theming to keep artwork, controls, and overlays visually consistent across the game.',
    'Simplified the UI so the board, card area, and answer tokens stayed easy to read on both desktop and mobile.',
  ],
  engineeringNotes: {
    svgSystem: [
      'The board and card visuals are composed from reusable SVG illustration components instead of exported image variants.',
      'Keeping structure in code makes combinations easier to generate, update, and validate as the game grows.',
    ],
    reuseAndTheming: [
      'Shared palette tokens let the same illustration logic drive artwork, answer states, and overlays without duplicating visual assets.',
      'That reuse makes future card sets and modes easier to extend while preserving a consistent visual language.',
    ],
    performance: [
      'Moving from static assets to composable SVG dramatically reduced asset weight and removed the need to manage dozens of individual files.',
      'The lighter bundle improves load time on lower-bandwidth devices while also lowering maintenance overhead.',
    ],
  },
  designDecisions: {
    svg: [
      'Replaced 50+ PNG/JPG card variations with a small set of reusable SVG illustrations.',
      'By separating structure (shapes) from appearance (color + composition), the system can generate many card combinations without storing each variation.',
    ],
    scalability: [
      'Instead of hardcoding card combinations, I built a composable system that allows new cards and variations to be created programmatically.',
      'This makes it easy to expand the game with additional levels and mechanics without increasing maintenance overhead.',
    ],
    simplicity: [
      'The interface is reduced to one board, one card area, and minimal controls.',
      'This keeps the focus on logic and pattern recognition, which is especially important for younger users.',
    ],
    responsive: [
      'The layout adapts across desktop, tablet, and mobile while preserving the same rules and interaction model.',
      'No alternate UI modes are introduced — only layout adjustments.',
    ],
  },
  impact: [
    '9.6 MB → 356 KB (~96% reduction) in asset size',
    'Reduced asset count from 50+ static images to ~10 reusable SVG components',
    'Faster load times and improved performance on low-bandwidth devices',
    'Significantly lower maintenance cost, with no need to manage individual card assets',
    'Enabled rapid expansion with new game variations and future complexity levels',
  ],
  nextSteps: [
    'Introduce additional levels and more complex deduction patterns once the current core loop is fully tuned.',
    'Expand the system with new card sets, rules, and difficulty adjustments while keeping the same visual language.',
    'Continue reducing bundle cost and improving component reuse as the game library grows.',
  ],
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/65" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function GameBoardFallback() {
  return (
    <div
      className="absolute inset-0 rounded-[var(--radius-xl)] border border-border/70 bg-[color:color-mix(in_srgb,var(--surface)_94%,white)]"
      aria-hidden="true"
    />
  )
}

export function GameDetailPage() {
  const { slug } = useParams()
  const game = getGameBySlug(slug)
  const [activeSectionId, setActiveSectionId] = useState<
    (typeof gameSections)[number]['id']
  >(gameSections[0].id)

  useEffect(() => {
    const sectionElements = gameSections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element))

    if (sectionElements.length === 0) {
      return
    }

    const updateActiveSection = () => {
      const activationOffset = 140
      let nextActiveSectionId = sectionElements[0].id

      for (const element of sectionElements) {
        const elementTop = element.getBoundingClientRect().top

        if (elementTop - activationOffset <= 0) {
          nextActiveSectionId = element.id
        } else {
          break
        }
      }

      setActiveSectionId(
        nextActiveSectionId as (typeof gameSections)[number]['id'],
      )
    }

    updateActiveSection()

    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [game?.slug])

  if (!game) {
    return (
      <section className="pt-8 pb-12 sm:pt-10 sm:pb-16">
        <Container>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Games
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Game not found
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            This route is set up correctly, but the current game slug does not match the data.
          </p>
          <Link
            className="utilityLink mt-6 items-center text-sm font-semibold"
            to="/games"
          >
            ← Back to games
          </Link>
        </Container>
      </section>
    )
  }

  return (
    <section className="pt-8 pb-12 sm:pt-10 sm:pb-16">
      <Container className="max-w-6xl">
        <Link
          to="/games"
          className="utilityLink mb-4 items-center text-sm font-semibold"
        >
          ← Back to games
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-10">
          <div className="max-w-4xl">
            <header>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Games
              </p>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {game.title}
              </h1>
              <p className="max-w-[68ch] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {game.summary} {game.description}
              </p>
            </header>

            <div className="mt-8 space-y-10">
              <section id="play">
                <div className="mb-10 sm:mb-12">
                  <Suspense fallback={<GameBoardFallback />}>
                    <GameBoardRound />
                  </Suspense>
                </div>
              </section>

              <CaseStudyPageNav
                activeSectionId={activeSectionId}
                className="w-full max-w-3xl lg:hidden"
                sections={gameSections.map((section) => ({ ...section }))}
                variant="mobile"
              />

              <SectionBlock id="context" title="Problem and product context">
                <div className="max-w-[68ch] space-y-4">
                  {pawsAndThinkDetails.context.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </SectionBlock>

              <SectionBlock id="challenges" title="Challenges">
                <div className="max-w-[68ch]">
                  <BulletList items={pawsAndThinkDetails.challenges} />
                </div>
              </SectionBlock>

              <SectionBlock id="approach" title="Approach">
                <div className="max-w-[68ch]">
                  <BulletList items={pawsAndThinkDetails.approach} />
                </div>
              </SectionBlock>

              <SectionBlock id="engineering-notes" title="Engineering notes">
                <div className="max-w-[68ch] space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      SVG composition instead of static assets
                    </h3>
                    <div className="mt-4">
                      <BulletList items={pawsAndThinkDetails.engineeringNotes.svgSystem} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Reuse and theming benefits
                    </h3>
                    <div className="mt-4">
                      <BulletList items={pawsAndThinkDetails.engineeringNotes.reuseAndTheming} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Asset and performance advantages
                    </h3>
                    <div className="mt-4">
                      <BulletList items={pawsAndThinkDetails.engineeringNotes.performance} />
                    </div>
                  </div>
                </div>
              </SectionBlock>

              <SectionBlock id="design-decisions" title="Design and implementation tradeoffs">
                <div className="max-w-[68ch] space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      SVG-based rendering instead of static assets
                    </h3>
                    <div className="mt-4">
                      <BulletList items={pawsAndThinkDetails.designDecisions.svg} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Designing for scalability, not just completion
                    </h3>
                    <div className="mt-4">
                      <BulletList items={pawsAndThinkDetails.designDecisions.scalability} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Intentional UI simplicity
                    </h3>
                    <div className="mt-4">
                      <BulletList items={pawsAndThinkDetails.designDecisions.simplicity} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Consistent responsive behavior
                    </h3>
                    <div className="mt-4">
                      <BulletList items={pawsAndThinkDetails.designDecisions.responsive} />
                    </div>
                  </div>
                </div>
              </SectionBlock>

              <SectionBlock id="impact" title="Outcome and impact">
                <div className="max-w-[68ch]">
                  <BulletList items={pawsAndThinkDetails.impact} />
                </div>
              </SectionBlock>

              <SectionBlock id="next-steps" title="Next steps">
                <div className="max-w-[68ch]">
                  <BulletList items={pawsAndThinkDetails.nextSteps} />
                </div>
              </SectionBlock>
            </div>
          </div>

          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <div className="w-full max-w-[260px]">
              <CaseStudyPageNav
                activeSectionId={activeSectionId}
                sections={gameSections.map((section) => ({ ...section }))}
                variant="desktop"
              />
            </div>
          </aside>
        </div>
      </Container>
    </section>
  )
}
