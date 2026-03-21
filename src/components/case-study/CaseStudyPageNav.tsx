import { type MouseEvent, useId, useState } from 'react'

type CaseStudyPageNavProps = {
  activeSectionId: string
  className?: string
  sections: Array<{
    id: string
    label: string
  }>
  variant: 'mobile' | 'desktop'
}

const SECTION_SCROLL_OFFSET: Record<string, number> = {
  play: 80,
}

function getNavItemClassName(isActive: boolean) {
  return [
    'block rounded-lg px-2 py-1.5 transition-colors',
    isActive
      ? 'bg-[color:color-mix(in_srgb,var(--primary)_10%,white)] font-medium text-foreground'
      : 'text-muted-foreground hover:bg-[color:color-mix(in_srgb,var(--primary)_6%,white)] hover:text-foreground focus-visible:bg-[color:color-mix(in_srgb,var(--primary)_6%,white)] focus-visible:text-foreground',
  ]
    .join(' ')
    .trim()
}

function CaseStudyPageNavLinks({
  activeSectionId,
  onNavigate,
  sections,
}: {
  activeSectionId: string
  onNavigate?: () => void
  sections: CaseStudyPageNavProps['sections']
}) {
  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    const target = document.getElementById(sectionId)

    if (!target) {
      return
    }

    event.preventDefault()

    const scrollTarget = target.closest('section') ?? target
    const headerOffset = SECTION_SCROLL_OFFSET[sectionId] ?? 24
    const top = scrollTarget.getBoundingClientRect().top + window.scrollY - headerOffset

    window.history.pushState(null, '', `#${sectionId}`)
    window.scrollTo({ top, behavior: 'smooth' })
    onNavigate?.()
  }

  return (
    <ul className="space-y-2 text-sm">
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            aria-current={activeSectionId === section.id ? 'location' : undefined}
            className={getNavItemClassName(activeSectionId === section.id)}
            onClick={(event) => handleNavigate(event, section.id)}
          >
            {section.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

export function CaseStudyPageNav({
  activeSectionId,
  className = '',
  sections,
  variant,
}: CaseStudyPageNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const navRegionId = useId()
  const navLabelId = useId()
  const activeSectionLabel =
    sections.find((section) => section.id === activeSectionId)?.label ?? sections[0]?.label

  if (variant === 'mobile') {
    return (
      <div
        className={[
          'rounded-2xl border border-border/70 bg-[color:color-mix(in_srgb,var(--surface)_92%,white)] px-4 py-3',
          className,
        ]
          .join(' ')
          .trim()}
      >
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 text-left"
          aria-controls={navRegionId}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <div className="min-w-0">
            <p id={navLabelId} className="text-sm font-semibold text-foreground">
              On this page
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{activeSectionLabel}</p>
          </div>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={[
              'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none',
              isOpen ? 'rotate-180' : '',
            ]
              .join(' ')
              .trim()}
          >
            <path
              d="M5.5 7.5 10 12l4.5-4.5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.75"
            />
          </svg>
        </button>

        <div id={navRegionId} className={isOpen ? 'mt-3' : 'hidden'}>
          <nav aria-labelledby={navLabelId}>
            <CaseStudyPageNavLinks
              activeSectionId={activeSectionId}
              onNavigate={() => setIsOpen(false)}
              sections={sections}
            />
          </nav>
        </div>
      </div>
    )
  }

  return (
    <div
      className={[
        'rounded-3xl border border-border/70 bg-[color:color-mix(in_srgb,var(--surface)_92%,white)] px-4 py-3.5',
        className,
      ]
        .join(' ')
        .trim()}
    >
      <p id={navLabelId} className="text-base font-semibold text-foreground">
        On this page
      </p>
      <div className="mt-2.5">
        <nav aria-labelledby={navLabelId}>
          <CaseStudyPageNavLinks activeSectionId={activeSectionId} sections={sections} />
        </nav>
      </div>
    </div>
  )
}
