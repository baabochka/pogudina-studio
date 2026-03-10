import { Link, useParams } from 'react-router-dom'

import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'
import { projects } from '../data/projects'

export function ProjectDetailPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return (
      <Section
        eyebrow="Projects"
        title="Project not found"
        description="This route is wired up correctly, but the current slug does not match the sample data."
      >
        <Link className="text-sm font-semibold text-primary underline-offset-4 hover:underline" to="/projects">
          Return to projects
        </Link>
      </Section>
    )
  }

  return (
    <Section eyebrow="Case Study" title={project.title} description={project.description}>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <h3 className="text-xl font-semibold text-foreground">Overview</h3>
            <div className="mt-4 space-y-4 text-muted-foreground">
              {project.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-foreground">My role</h3>
            <div className="mt-4 space-y-4 text-muted-foreground">
              {project.role.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-foreground">Technical challenges</h3>
            <div className="mt-4 space-y-4 text-muted-foreground">
              {project.challenges.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-foreground">Solutions and decisions</h3>
            <div className="mt-4 space-y-4 text-muted-foreground">
              {project.decisions.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-xl font-semibold text-foreground">Tech stack</h3>
            <ul className="mt-4 space-y-3">
              {project.stack.map((item) => (
                <li key={item} className="rounded-2xl bg-surface-muted px-4 py-3 text-sm text-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-foreground">Case study focus</h3>
            <p className="mt-4 text-muted-foreground">
              This write-up emphasizes UI ownership, architecture decisions, accessibility, and
              cross-team delivery. It keeps the scope on front-end engineering work rather than
              inventing metrics or outcomes that are not documented here.
            </p>
            <Link
              to="/projects"
              className="mt-6 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Back to all projects
            </Link>
          </Card>
        </div>
      </div>
    </Section>
  )
}
