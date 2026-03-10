import { Link } from 'react-router-dom'

import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'
import { projects } from '../data/projects'

export function HomePage() {
  return (
    <>
      <Section
        eyebrow="Welcome"
        title="Front-end engineering with a strong foundation in accessibility, UI systems, and visual design."
        description="Valentina Pogudina is a Front-End Engineer with 5+ years of experience building scalable, polished web applications with React, JavaScript, and TypeScript."
        className="pt-16 sm:pt-20"
      >
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <Card className="bg-[linear-gradient(135deg,var(--surface),color-mix(in_srgb,var(--accent)_18%,var(--surface)))]">
            <h3 className="text-2xl font-semibold text-foreground">From enterprise UI architecture to refined visual execution</h3>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Her background combines front-end engineering, graphic design, and HCI. That mix shows
              up in accessible interfaces, careful interaction design, and systems that stay coherent
              as products grow across teams and use cases.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Browse Projects
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Read About
              </Link>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-foreground">Highlights</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>Front-End Engineer II at AWS from April 2021 to January 2026.</li>
              <li>Built WCAG-compliant React interfaces for Amazon Connect workflows.</li>
              <li>Background in computer science, mathematics, HCI, and digital arts.</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="Featured Work"
        title="Selected work across enterprise UI, accessibility, and theming"
        description="These projects reflect product ownership, cross-team delivery, and the ability to connect design intent with production-ready implementation."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.slug} className="flex h-full flex-col">
              <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
              <p className="mt-3 flex-1 text-muted-foreground">{project.summary}</p>
              <Link
                to={`/projects/${project.slug}`}
                className="mt-6 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                View project details
              </Link>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
