import portraitImage from '../assets/headshot.jpg'
import { ContentSectionCard } from '../components/about/ContentSectionCard'
import { LabeledFact } from '../components/about/LabeledFact'
import { PageIntro } from '../components/about/PageIntro'
import { SidebarCard } from '../components/about/SidebarCard'
import { SidebarColumn } from '../components/about/SidebarColumn'
import { Container } from '../components/ui/Container'

const resumeHref = `${import.meta.env.BASE_URL}resume.pdf`

const aboutSections = [
  {
    title: 'About',
    paragraphs: [
      'I combine technical depth in React, JavaScript, and TypeScript with a background in graphic design and human-computer interaction. That combination helps me build interfaces that are intuitive, accessible, and visually consistent without sacrificing engineering rigor.',
    ],
  },
  {
    title: 'Experience',
    paragraphs: [
      'At AWS, I built scalable front-end features for Amazon Connect, partnered across teams to deliver complex functionality, wrote design documents, and focused heavily on WCAG-compliant accessibility, including keyboard navigation and screen reader support.',
      'Before that, I developed Angular and TypeScript applications at Softheon for state and federal healthcare programs, with an emphasis on reliable, accessible provider workflows.',
    ],
  },
  {
    title: 'Design foundation',
    paragraphs: [
      'My earlier work in graphic design shaped a strong eye for typography, layout, and visual consistency. That background still informs how I approach UI systems, product polish, and communication through interface design.',
    ],
  },
]

export function AboutPage() {
  return (
    <section className="pt-8 pb-12 sm:pt-10 sm:pb-16">
      <Container>
        <PageIntro
          eyebrow="About"
          title="Engineer, designer, and systems thinker."
          description="I’m a Front-End Engineer with over five years of experience building scalable, accessible, and visually polished web applications."
        />

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          <div className="order-2 max-w-4xl space-y-5 lg:order-1">
            {aboutSections.map((section) => (
              <ContentSectionCard
                key={section.title}
                className={section.title === 'About' ? 'sm:p-8' : ''}
                title={section.title}
              >
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="max-w-[62ch] text-base leading-7 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </ContentSectionCard>
            ))}

            <div className="mt-6 ml-6 max-w-[62ch] sm:ml-7">
              <p className="text-base leading-7 text-muted-foreground">
                If you’d like a structured overview of my experience, you can download
                my resume.
              </p>
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_30px_-18px_color-mix(in_srgb,var(--primary)_65%,transparent)] transition duration-180 hover:opacity-95 active:translate-y-px"
              >
                Download Resume
              </a>
            </div>
          </div>

          <SidebarColumn
            alt="Portrait of Valentina Pogudina"
            className="order-1 justify-self-start lg:order-2"
            imageClassName="-mt-0.5"
            imageSrc={portraitImage}
          >
            <SidebarCard title="Quick facts">
              <dl className="space-y-3.5 text-sm">
                <LabeledFact label="Focus">
                  React, TypeScript, accessibility, UI architecture.
                </LabeledFact>
                <LabeledFact label="Education">
                  B.S. Cum Laude in Computer Science and Mathematics from Stony Brook University,
                  with an HCI specialization and a minor in Digital Arts.
                </LabeledFact>
                <LabeledFact label="Toolset">
                  React, TypeScript, Node.js, Jest, Cypress, DraftJS, Cloudscape, Angular,
                  Express.js, Adobe Illustrator, InDesign, Photoshop, and LaTeX.
                </LabeledFact>
              </dl>
            </SidebarCard>
          </SidebarColumn>
        </div>
      </Container>
    </section>
  )
}
