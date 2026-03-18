import portraitImage from '../assets/headshot.jpg'
import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'

export function AboutPage() {
  return (
    <Section
      eyebrow="About"
      title="Engineer, designer, and systems thinker."
      description="I’m a Front-End Engineer with over five years of experience building scalable, accessible, and visually polished web applications."
    >
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 xl:gap-12">
        <div className="order-2 lg:order-1">
          <Card className="p-7 sm:p-8">
            <h3 className="text-xl font-semibold text-foreground">About</h3>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              I combine technical depth in React, JavaScript, and TypeScript with a background in
              graphic design and human-computer interaction. That combination helps me build
              interfaces that are intuitive, accessible, and visually consistent without sacrificing
              engineering rigor.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-foreground">Experience</h3>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              At AWS, I built scalable front-end features for Amazon Connect, partnered across teams
              to deliver complex functionality, wrote design documents, and focused heavily on
              WCAG-compliant accessibility, including keyboard navigation and screen reader support.
            </p>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Before that, I developed Angular and TypeScript applications at Softheon for state and
              federal healthcare programs, with an emphasis on reliable, accessible provider
              workflows.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-foreground">Design foundation</h3>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              My earlier work in graphic design shaped a strong eye for typography, layout, and
              visual consistency. That background still informs how I approach UI systems, product
              polish, and communication through interface design.
            </p>
          </Card>
        </div>

        <div className="order-1 flex flex-col gap-5 justify-self-center lg:order-2 lg:justify-self-start">
          <img
            src={portraitImage}
            alt="Portrait of Valentina Pogudina"
            className="-mt-0.5 w-full max-w-[300px] rounded-[20px] object-cover shadow-[0_20px_40px_-32px_rgba(15,23,42,0.24)] sm:max-w-[320px]"
          />

          <div className="rounded-3xl border border-border/80 bg-surface px-5 py-5 sm:px-6 sm:py-6">
            <h3 className="text-lg font-semibold text-foreground">Quick facts</h3>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-foreground">Focus</dt>
                <dd className="mt-1 leading-6 text-muted-foreground">
                  React, TypeScript, accessibility, UI architecture.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Education</dt>
                <dd className="mt-1 leading-6 text-muted-foreground">
                  B.S. Cum Laude in Computer Science and Mathematics from Stony Brook University,
                  with an HCI specialization and a minor in Digital Arts.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Toolset</dt>
                <dd className="mt-1 leading-6 text-muted-foreground">
                  React, TypeScript, Node.js, Jest, Cypress, DraftJS, Cloudscape, Angular,
                  Express.js, Adobe Illustrator, InDesign, Photoshop, and LaTeX.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Section>
  )
}
