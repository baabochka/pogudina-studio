import { Link } from 'react-router-dom'

import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'
import { projects } from '../data/projects'

export function ProjectsPage() {
  return (
    <Section
      eyebrow="Projects"
      title="A starter project index with room to grow into full case studies."
      description="Start with concise summaries. When a project deserves more depth, move that detail into the dynamic route."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project.slug}>
            <Card className="flex h-full flex-col">
              <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
              <p className="mt-3 text-muted-foreground">{project.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to={`/projects/${project.slug}`}
                className="mt-6 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Open case study
              </Link>
            </Card>
          </article>
        ))}
      </div>
    </Section>
  )
}
