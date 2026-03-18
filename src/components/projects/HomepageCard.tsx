import type { Project } from '../../data/projects'
import { BaseProjectCard, ProjectCardTitle } from './BaseProjectCard'

type HomepageCardProps = {
  project: Project
}

export function HomepageCard({ project }: HomepageCardProps) {
  return (
    <BaseProjectCard
      project={project}
      ctaLabel="View project details"
      contentClassName="space-y-3"
      footerClassName="pt-7"
    >
      <ProjectCardTitle title={project.title} />
      <p className="max-w-[48ch] text-sm leading-7 text-muted-foreground sm:text-base">
        {project.summary}
      </p>
    </BaseProjectCard>
  )
}
