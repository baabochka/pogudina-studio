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
  { id: 'constraints', label: 'Constraints' },
  { id: 'implementation', label: 'Implementation' },
  { id: 'tradeoffs', label: 'Tradeoffs' },
  { id: 'impact', label: 'Outcome' },
  { id: 'next-steps', label: 'Next steps' },
] as const

const pawsAndThinkDetails = {
  context: {
    anchor:
      'This project shifted from “make the game work in the browser” to “build a board system that can absorb iteration without collapsing under its own UI.”',
    bullets: [
      'The original implementation solved the core interaction, but too much board structure lived inside nested SVG composition and one-off layout decisions.',
      'As the game expanded from a single-card flow into multi-card modes, each new state added DOM depth, positioning exceptions, and harder-to-reason-about behavior.',
      'The problem shifted from asset conversion to UI architecture: I needed a board that could support mode changes, overlays, review states, and future rule variants without reworking the rendering tree each time.',
    ],
  },
  constraints: {
    anchor:
      'The main constraint was not visual fidelity, but preserving interaction correctness while restructuring a board that mixed layout, decoration, and hit areas.',
    bullets: [
      'I split the board into a layered system so each responsibility had a stable home: base structure, card content, decoration, and interaction targets.',
      'I separated the outer shell from the inner board coordinate system so mode changes could resize the footprint without forcing every child to recalculate from a different model.',
      'I moved toward a panel-based board structure, with the teal shell and white content area rendered as layout primitives instead of relying on pixel-perfect SVG alignment for the full frame.',
      'I kept the visual language where it mattered, but reduced how much UI logic lived inside decorative assets so future changes could happen in React rather than exported art files.',
    ],
  },
  implementation: {
    anchor:
      'The implementation work was mostly about replacing implicit layout behavior with explicit systems.',
    bullets: [
      'I refactored the board into a clear layer model, removing unnecessary wrappers and making ownership of structure, visuals, and event handling explicit.',
      'I simplified slot rendering into a predictable layer-and-slot model so cards could be swapped, reviewed, and transitioned without special-case markup for each mode.',
      'I stabilized the board shell for single-card and multi-card modes by making the frame stretch through defined sides and insets rather than repositioning independent pieces.',
      'I tightened the answer-token and overlay positioning logic so the board uses consistent coordinate rules instead of mixing percentage placement, SVG offsets, and ad hoc pixel corrections.',
    ],
  },
  tradeoffs: {
    anchor:
      'Most of the tradeoffs were about choosing system clarity over short-term convenience.',
    bullets: [
      'I kept fixed pixel positioning where the artwork required precision, but constrained it to defined board regions instead of letting it leak across the full layout.',
      'I used explicit layering and pointer-events rules for interaction targeting instead of click-through hacks, because decorative overlays and interactive controls were already beginning to conflict.',
      'I accepted some duplication between single-card and multi-card rendering where it preserved clearer behavior and simpler transitions, rather than forcing one abstraction to handle every visual case.',
      'I favored a hard separation between structure and decoration, even though the earlier SVG-first approach was faster to assemble, because maintainability had become the larger risk.',
    ],
  },
  impact: {
    anchor:
      'The outcome is a board that is easier to extend, debug, and reason about under state changes.',
    bullets: [
      'The rendering tree is flatter and responsibilities are clearer, which makes iterative UI work more stable.',
      'Mode switching, rules overlays, review states, and quick-start behavior now sit on a more stable board shell instead of fighting the same nested structure.',
      'Interaction targeting is more predictable because decorative layers no longer participate in pointer handling.',
      'Animation quality improved as corner anchoring and frame stretching became consistent, removing visual seams and motion mismatches during board transitions.',
      'Replacing static image assets with a reusable SVG system reduced bundle size from ~9.6 MB to ~356 KB (~96% reduction) and cut asset count from 50+ images to ~10 reusable components.',
      'The board is now closer to a reusable UI system than a one-off game screen, which is the right foundation for adding more content and rule complexity later.',
    ],
  },
  nextSteps: {
    anchor:
      'The next step is to keep pushing the board toward a cleaner system boundary rather than adding features on top of accidental complexity.',
    bullets: [
      'I would extract the remaining board measurements into a more explicit layout contract so slot placement, overlays, and controls all derive from the same source of truth.',
      'I would continue reducing the places where visual state is encoded through naming leftovers or historical structure, especially around board-mode terminology and asset organization.',
      'I would make transitions more declarative so animation timing and staging are easier to reuse across single-card, multi-card, and review flows.',
      'I would formalize more of the board states through tests, especially around mode switching, overlay behavior, and restored session snapshots.',
    ],
  },
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
                <div className="max-w-[68ch] space-y-5">
                  <p>{pawsAndThinkDetails.context.anchor}</p>
                  <BulletList items={pawsAndThinkDetails.context.bullets} />
                </div>
              </SectionBlock>

              <SectionBlock
                id="constraints"
                title="Constraints and implementation decisions"
              >
                <div className="max-w-[68ch] space-y-5">
                  <p>{pawsAndThinkDetails.constraints.anchor}</p>
                  <BulletList items={pawsAndThinkDetails.constraints.bullets} />
                </div>
              </SectionBlock>

              <SectionBlock id="implementation" title="Implementation details">
                <div className="max-w-[68ch] space-y-5">
                  <p>{pawsAndThinkDetails.implementation.anchor}</p>
                  <BulletList items={pawsAndThinkDetails.implementation.bullets} />
                </div>
              </SectionBlock>

              <SectionBlock id="tradeoffs" title="Tradeoffs and risk management">
                <div className="max-w-[68ch] space-y-5">
                  <p>{pawsAndThinkDetails.tradeoffs.anchor}</p>
                  <BulletList items={pawsAndThinkDetails.tradeoffs.bullets} />
                </div>
              </SectionBlock>

              <SectionBlock id="impact" title="Outcome and impact">
                <div className="max-w-[68ch] space-y-5">
                  <p>{pawsAndThinkDetails.impact.anchor}</p>
                  <BulletList items={pawsAndThinkDetails.impact.bullets} />
                </div>
              </SectionBlock>

              <SectionBlock id="next-steps" title="What I would improve next">
                <div className="max-w-[68ch] space-y-5">
                  <p>{pawsAndThinkDetails.nextSteps.anchor}</p>
                  <BulletList items={pawsAndThinkDetails.nextSteps.bullets} />
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
