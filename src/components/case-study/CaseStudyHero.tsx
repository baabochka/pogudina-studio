import { Link } from 'react-router-dom'

import type { Project } from '../../data/projects'
import { Card } from '../ui/Card'
import { TagList } from './TagList'

type CaseStudyHeroProps = {
  project: Project
}

export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  return (
    <header>
      <Link
        to="/projects"
        className="utilityLink mb-4 items-center text-sm font-semibold"
      >
        ← Back to projects
      </Link>

      <div className="max-w-4xl">
        <p className="mb-[var(--space-2)] text-[length:var(--font-size-label)] font-[var(--font-weight-semibold)] uppercase tracking-[var(--tracking-eyebrow)] leading-[var(--line-height-label)] text-primary">
          Case study
        </p>
        <h1 className="mb-[var(--space-6)] max-w-[16ch] text-balance text-[length:var(--font-size-title-md)] font-[var(--font-weight-bold)] tracking-tight leading-[var(--line-height-tight)] text-foreground sm:text-[length:var(--font-size-title-xl)]">
          {project.title}
        </h1>
        <div className="mb-[var(--space-8)] max-w-3xl space-y-[var(--space-3)]">
          <p className="text-[length:var(--font-size-title-xs)] font-[var(--font-weight-semibold)] leading-[1.6] text-foreground">
            {project.summary}
          </p>
          <p className="text-[length:var(--font-size-body)] leading-[var(--line-height-body)] text-muted-foreground sm:text-[length:var(--font-size-body-lg)] sm:leading-[var(--line-height-body-lg)]">
            {project.description}
          </p>
        </div>
      </div>

      <div className="md:hidden">
        <Card className="p-[var(--space-4)]">
          <dl className="space-y-[var(--space-4)]">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Role
              </dt>
              <dd className="mt-1.5 text-sm leading-6 text-foreground">{project.roleLabel}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Team
              </dt>
              <dd className="mt-1.5 text-sm leading-6 text-foreground">{project.team}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Timeline
              </dt>
              <dd className="mt-1.5 text-sm leading-6 text-foreground">{project.timeline}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Tools
              </dt>
              <dd className="mt-1.5 text-sm leading-6 text-foreground">
                {project.stack.join(' · ')}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-[var(--space-5)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Role
          </p>
          <p className="mt-[var(--space-3)] text-sm leading-6 text-foreground">{project.roleLabel}</p>
        </Card>
        <Card className="p-[var(--space-5)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Team
          </p>
          <p className="mt-[var(--space-3)] text-sm leading-6 text-foreground">{project.team}</p>
        </Card>
        <Card className="p-[var(--space-5)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Timeline
          </p>
          <p className="mt-[var(--space-3)] text-sm leading-6 text-foreground">{project.timeline}</p>
        </Card>
        <Card className="p-[var(--space-5)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Tools
          </p>
          <div className="mt-[var(--space-3)]">
            <TagList items={project.stack} />
          </div>
        </Card>
      </div>
    </header>
  )
}
