import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { CaseStudyPageNav } from '../components/case-study/CaseStudyPageNav'
import { SectionBlock } from '../components/case-study/SectionBlock'
import { GamePreview } from '../components/games/GamePreview'
import { Container } from '../components/ui/Container'
import { GameBoardRound } from '../features/games/paws_and_think/GameBoardRound'
import { getGameBySlug } from '../data/games'

const gameSections = [
  { id: 'context', label: 'Context' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'approach', label: 'Approach' },
  { id: 'design-decisions', label: 'Design decisions' },
  { id: 'impact', label: 'Impact' },
  { id: 'next-steps', label: 'Next steps' },
  { id: 'play', label: 'Play the game' },
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
  gameplay: [
    'The timer and score system turn the puzzle into a replayable challenge instead of a one-off exercise.',
    'Correct and incorrect answers get immediate feedback through paw markers, color changes, and hint animation.',
    'Wrong answers trigger a curved paw trail that reveals the correct token instead of leaving the player stuck.',
    'Previous-answer review and explanations reinforce the deduction pattern rather than treating the game as guesswork.',
  ],
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
  metadata: [
    { label: 'Type', value: 'Puzzle / Logic' },
    { label: 'Platform', value: 'Web / Mobile' },
    { label: 'Built with', value: 'React, SVG' },
    { label: 'Focus', value: 'UI responsiveness / visual reasoning' },
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

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleEntries.length > 0) {
          setActiveSectionId(
            visibleEntries[0].target.id as (typeof gameSections)[number]['id'],
          )
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    )

    sectionElements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
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

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          <div className="max-w-4xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Games
            </p>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {game.title}
            </h1>
            <p className="max-w-[68ch] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {game.summary} {game.description}
            </p>

            <div className="mt-8 w-full max-w-3xl rounded-2xl border border-border/80 bg-surface p-4 md:p-5">
              <dl className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                {pawsAndThinkDetails.metadata.map((item) => (
                  <div key={item.label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd className="mt-2 text-sm leading-6 text-foreground">{item.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 lg:hidden">
                <a
                  href="#play"
                  className="inline-flex min-h-11 w-fit items-center justify-center self-start rounded-full bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-[0_12px_30px_-18px_color-mix(in_srgb,var(--primary)_65%,transparent)] transition duration-180 hover:opacity-95 active:translate-y-px"
                >
                  Try it
                </a>
              </div>
            </div>
          </div>

          <div className="hidden w-full flex-col items-end lg:flex lg:self-start">
            <div className="w-full max-w-[260px]">
              <GamePreview
                src={game.previewImage}
                alt={game.previewAlt}
                variant={game.previewVariant}
                className="border-border/60 bg-[color:color-mix(in_srgb,var(--surface)_88%,white)]"
              />
              <a
                href="#play"
                className="mt-6 inline-flex min-h-11 w-fit items-center justify-center self-start rounded-full bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-[0_12px_30px_-18px_color-mix(in_srgb,var(--primary)_65%,transparent)] transition duration-180 hover:opacity-95 active:translate-y-px"
              >
                Try it
              </a>
            </div>
          </div>
        </div>

        <CaseStudyPageNav
          activeSectionId={activeSectionId}
          className="mt-10 w-full max-w-3xl lg:hidden"
          sections={gameSections.map((section) => ({ ...section }))}
          variant="mobile"
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-10">
          <div className="max-w-4xl space-y-10">
            <SectionBlock title="From physical game to scalable web system">
              <div id="context" className="max-w-[68ch] space-y-4">
                {pawsAndThinkDetails.context.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </SectionBlock>

            <SectionBlock title="Challenges">
              <div id="challenges" className="max-w-[68ch]">
                <BulletList items={pawsAndThinkDetails.challenges} />
              </div>
            </SectionBlock>

            <SectionBlock title="Approach">
              <div id="approach" className="max-w-[68ch]">
                <BulletList items={pawsAndThinkDetails.approach} />
              </div>
            </SectionBlock>

            <SectionBlock title="Design decisions">
              <div id="design-decisions" className="max-w-[68ch] space-y-8">
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

            <SectionBlock title="Impact">
              <div id="impact" className="max-w-[68ch]">
                <BulletList items={pawsAndThinkDetails.impact} />
              </div>
            </SectionBlock>

            <SectionBlock title="Next steps">
              <div id="next-steps" className="max-w-[68ch]">
                <BulletList items={pawsAndThinkDetails.nextSteps} />
              </div>
            </SectionBlock>

            <SectionBlock title="Gameplay">
              <div id="gameplay" className="max-w-[68ch]">
                <BulletList items={pawsAndThinkDetails.gameplay} />
              </div>
            </SectionBlock>

            <section id="play" className="border-t border-border/80 pt-10 sm:pt-12">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Play the game
              </h2>
              <div className="mt-8 mx-auto mb-10 w-full max-w-[24rem] px-2 sm:mb-12 lg:mx-0 lg:ml-2 lg:max-w-[400px] lg:px-0">
                <GameBoardRound boardHeightClassName="h-[560px] sm:h-[600px]" />
              </div>
            </section>
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
