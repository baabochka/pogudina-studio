import type { Project } from '../../data/projects'
import { BaseProjectCard, ProjectCardTitle } from './BaseProjectCard'

type ProjectCardProps = {
  project: Project
  featured?: boolean
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <BaseProjectCard
      project={project}
      ctaLabel="Open case study"
      className={
        featured ? 'border-[color:color-mix(in_srgb,var(--border)_65%,#d1d5db_35%)]' : ''
      }
      contentClassName="space-y-4"
      footerClassName="pt-8"
    >
      <ProjectCardTitle title={project.title} weight={featured ? 'bold' : 'semibold'} />
      <p className="text-sm leading-7 text-muted-foreground sm:text-base">
        {project.summary}
      </p>
      <ul className="flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <li
            key={item}
            className="rounded-full border border-[color:color-mix(in_srgb,var(--border)_82%,white)] bg-[color:color-mix(in_srgb,var(--surface-muted)_82%,white)] px-3 py-1 text-xs font-medium text-[color:color-mix(in_srgb,var(--foreground)_78%,#374151_22%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
          >
            {item}
          </li>
        ))}
      </ul>
    </BaseProjectCard>
  )
}
