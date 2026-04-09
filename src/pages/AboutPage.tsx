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
      'I’m a senior front-end engineer who combines deep React and TypeScript experience with a background in graphic design and human-computer interaction. That combination helps me build interfaces that are intuitive, accessible, visually consistent, and backed by solid engineering decisions.',
    ],
  },
  {
    title: 'Experience',
    paragraphs: [
      'At AWS, I built scalable front-end features for Amazon Connect, partnered across teams to deliver complex functionality, wrote design documents, and focused heavily on WCAG-compliant accessibility, including keyboard navigation and screen reader support.',
      'My work has consistently been at the intersection of product thinking and UI systems: translating ambiguous product needs into maintainable React architecture, accessible interaction models, and polished user-facing experiences.',
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
          title="Senior Front-End Engineer, designer, and systems thinker."
          description="I build scalable, accessible, and visually polished web applications, with a focus on turning complex product requirements into clear, resilient front-end systems."
        />

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          <div className="order-2 max-w-4xl space-y-6 lg:order-1">
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

            <p className="mt-6 ml-6 max-w-[62ch] text-base leading-7 text-muted-foreground">
              If you’d like a structured overview of my experience,{' '}
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Resume (opens in a new tab)"
                className="inlineLink font-medium"
              >
                View Resume
              </a>
              .
            </p>
          </div>

          <SidebarColumn
            alt="Portrait of Valentina Pogudina"
            className="order-1 justify-self-start lg:order-2"
            imageClassName="-mt-0.5"
            imageSrc={portraitImage}
          >
            <SidebarCard title="Quick facts">
              <dl className="space-y-4 text-sm">
                <LabeledFact label="Focus">
                  Senior frontend engineering, React, TypeScript, accessibility, UI architecture.
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
