import { Link } from 'react-router-dom'

import type { Project } from '../../data/projects'
import { Card } from '../ui/Card'
import { TagList } from './TagList'

type CaseStudyHeroProps = {
  project: Project
}

export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  return (
    <section>
      <Link
        to="/projects"
        className="utilityLink mb-4 items-center text-sm font-semibold focus-visible:outline-none"
      >
        ← Back to projects
      </Link>

      <div className="max-w-4xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Case study
        </p>
        <h1 className="mb-6 max-w-[16ch] text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
          {project.title}
        </h1>
        <div className="mb-8 max-w-3xl space-y-3">
          <p className="text-xl font-semibold leading-8 text-foreground">
            {project.summary}
          </p>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {project.description}
          </p>
        </div>
      </div>

      <div className="md:hidden">
        <Card className="p-4">
          <dl className="space-y-4">
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
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Role
          </p>
          <p className="mt-3 text-sm leading-6 text-foreground">{project.roleLabel}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Team
          </p>
          <p className="mt-3 text-sm leading-6 text-foreground">{project.team}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Timeline
          </p>
          <p className="mt-3 text-sm leading-6 text-foreground">{project.timeline}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Tools
          </p>
          <div className="mt-3">
            <TagList items={project.stack} />
          </div>
        </Card>
      </div>
    </section>
  )
}
