import type { Project } from '../../data/projects'
import { TagList } from '../case-study/TagList'
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
      <ProjectCardTitle
        as="h2"
        title={project.title}
        weight={featured ? 'bold' : 'semibold'}
      />
      <p className="text-sm leading-7 text-muted-foreground sm:text-base">
        {project.summary}
      </p>
      <TagList items={project.stack} />
    </BaseProjectCard>
  )
}
