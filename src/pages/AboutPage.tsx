import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'

export function AboutPage() {
  return (
    <Section
      eyebrow="About"
      title="Engineer, designer, and systems thinker."
      description="Valentina Pogudina is a Front-End Engineer with more than five years of experience building scalable, accessible, visually polished web applications."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="text-xl font-semibold text-foreground">Professional summary</h3>
          <p className="mt-4 text-muted-foreground">
            She combines technical depth in React, JavaScript, and TypeScript with a background in
            graphic design and human-computer interaction. That combination supports interfaces that
            are intuitive, accessible, and visually consistent without sacrificing engineering rigor.
          </p>
          <h3 className="mt-8 text-xl font-semibold text-foreground">Experience</h3>
          <p className="mt-4 text-muted-foreground">
            At AWS, she developed scalable front-end features for Amazon Connect, led cross-team
            feature delivery, wrote design documents, and focused heavily on WCAG-compliant
            accessibility, including keyboard navigation and screen reader support. Before that, she
            built Angular and TypeScript applications at Softheon for state and federal healthcare
            programs, with an emphasis on reliable, accessible provider workflows.
          </p>
          <h3 className="mt-8 text-xl font-semibold text-foreground">Design foundation</h3>
          <p className="mt-4 text-muted-foreground">
            Earlier work as a graphic designer at the Simons Center for Geometry and Physics shaped a
            strong eye for typography, layout, and visual consistency. That design background still
            informs how she approaches UI systems, product polish, and communication through
            interface design.
          </p>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-foreground">Quick facts</h3>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-foreground">Current focus</dt>
              <dd className="text-muted-foreground">React, TypeScript, accessibility, UI architecture.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Education</dt>
              <dd className="text-muted-foreground">B.S. Cum Laude in Computer Science and Mathematics from Stony Brook University, with HCI specialization and a minor in Digital Arts.</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Toolset</dt>
              <dd className="text-muted-foreground">React, Node.js, Jest, Cypress, DraftJS, Cloudscape, Angular, Express.js, Adobe Illustrator, InDesign, Photoshop, and LaTeX.</dd>
            </div>
          </dl>
        </Card>
      </div>
    </Section>
  )
}
