import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { CaseStudyHero } from '../components/case-study/CaseStudyHero'
import { CaseStudyPageNav } from '../components/case-study/CaseStudyPageNav'
import { SectionBlock } from '../components/case-study/SectionBlock'
import { Container } from '../components/ui/Container'
import { projects } from '../data/projects'

const caseStudySections = [
  { id: 'context', label: 'Problem' },
  { id: 'role', label: 'Ownership' },
  { id: 'approach', label: 'Constraints and decisions' },
  { id: 'solution', label: 'Implementation' },
  { id: 'tradeoffs', label: 'Tradeoffs' },
  { id: 'impact', label: 'Outcome' },
  { id: 'next-improvements', label: 'What I would improve' },
]

const approachCardClassName =
  'flex h-full flex-col rounded-3xl border border-border/80 bg-surface px-6 py-6'
const approachCardHeadingClassName = 'text-lg font-semibold text-foreground'
const approachBulletListClassName = 'mt-4 max-w-[58ch] space-y-3.5 text-sm leading-7 text-muted-foreground'
const approachBulletItemClassName = 'flex gap-3'
const approachBulletDotClassName = 'mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/65'
const approachSupportingTextClassName =
  'mt-4 max-w-[58ch] space-y-3 text-sm leading-7 text-muted-foreground/90'
const impactCardClassName =
  'rounded-3xl border border-[color:color-mix(in_srgb,var(--border)_62%,var(--primary)_38%)] bg-[color:color-mix(in_srgb,var(--surface)_90%,var(--primary)_10%)] px-6 py-6 sm:px-7 sm:py-7'

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li key={item} className={approachBulletItemClassName}>
          <span className={approachBulletDotClassName} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function ProjectDetailPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)
  const [activeSectionId, setActiveSectionId] = useState(caseStudySections[0].id)

  useEffect(() => {
    const sectionElements = caseStudySections
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
          setActiveSectionId(visibleEntries[0].target.id)
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
  }, [project?.slug])

  if (!project) {
    return (
      <section className="py-16 sm:py-20">
        <Container>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Projects
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Project not found
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            This route is wired up correctly, but the current slug does not match the project data.
          </p>
          <Link
            className="utilityLink mt-6 items-center text-sm font-semibold"
            to="/projects"
          >
            Return to projects
          </Link>
        </Container>
      </section>
    )
  }

  return (
    <section className="pt-6 pb-12 sm:pt-8 sm:pb-16 lg:pt-10">
      <Container className="max-w-6xl">
        <CaseStudyHero project={project} />
        <CaseStudyPageNav
          activeSectionId={activeSectionId}
          className="mt-8 lg:hidden"
          sections={caseStudySections}
          variant="mobile"
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12">
          <div className="max-w-4xl space-y-10 sm:space-y-12">
            <SectionBlock id="context" title="Problem and product context">
              {project.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </SectionBlock>

            <SectionBlock id="role" title="Ownership and scope">
              {project.role.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </SectionBlock>

            <SectionBlock
              contentClassName="grid items-stretch gap-6 md:grid-cols-2"
              id="approach"
              title="Constraints and implementation decisions"
            >
              <article className={approachCardClassName}>
                <h3 className={approachCardHeadingClassName}>Constraints</h3>
                <div className={approachBulletListClassName}>
                  <BulletList items={project.challenges} />
                </div>
              </article>
              <article className={approachCardClassName}>
                <h3 className={approachCardHeadingClassName}>Key engineering decisions</h3>
                <div className={approachBulletListClassName}>
                  <BulletList items={project.decisions} />
                </div>
                {project.decisionDetails?.length ? (
                  <div className={approachSupportingTextClassName}>
                    {project.decisionDetails.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}
              </article>
            </SectionBlock>

            <SectionBlock contentClassName="max-w-3xl" id="solution" title="Implementation details">
              {project.solution.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </SectionBlock>

            <SectionBlock contentClassName="max-w-3xl" id="tradeoffs" title="Tradeoffs and risk management">
              <BulletList items={project.tradeoffs} />
            </SectionBlock>

            <SectionBlock title="Outcome and impact">
              <div id="impact" className={impactCardClassName}>
                <div className="space-y-4">
                  {project.impact.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </SectionBlock>

            <SectionBlock
              contentClassName="space-y-5"
              id="next-improvements"
              title="What I would improve next"
            >
              <div className="max-w-3xl">
                <BulletList items={project.nextImprovements} />
              </div>
              <div className="space-y-4">
                {project.reflection.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </SectionBlock>
          </div>

          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <CaseStudyPageNav
              activeSectionId={activeSectionId}
              sections={caseStudySections}
              variant="desktop"
            />
          </aside>
        </div>
      </Container>
    </section>
  )
}
