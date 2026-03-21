import { ProjectCard } from '../components/projects/ProjectCard'
import { Section } from '../components/ui/Section'
import { projects } from '../data/projects'

const featuredProjectSlugs = new Set([
  'real-time-call-monitoring-intervention',
  'agent-response-templates-shortcuts',
])

export function ProjectsPage() {
  return (
    <Section
      eyebrow="Projects"
      title="Selected frontend work"
      titleAs="h1"
      description="Selected front-end work across enterprise UI, accessibility, design systems, and interactive experiences."
    >
      <ul className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-6">
        {projects.map((project) => (
          <li
            key={project.slug}
            className={
              featuredProjectSlugs.has(project.slug)
                ? 'h-full md:col-span-2 xl:col-span-3'
                : 'h-full xl:col-span-2'
            }
          >
            <ProjectCard
              project={project}
              featured={featuredProjectSlugs.has(project.slug)}
            />
          </li>
        ))}
      </ul>
    </Section>
  )
}
