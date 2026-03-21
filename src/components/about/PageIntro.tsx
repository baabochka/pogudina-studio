import type { ReactNode } from 'react'

import {
  bodyTextClassName,
  eyebrowTextClassName,
  sectionTitleClassName,
} from '../ui/contentStyles'

type PageIntroProps = {
  className?: string
  description?: ReactNode
  eyebrow: ReactNode
  title: ReactNode
}

export function PageIntro({ className = '', description, eyebrow, title }: PageIntroProps) {
  return (
    <header className={['max-w-3xl', className].join(' ').trim()}>
      <p className={eyebrowTextClassName}>{eyebrow}</p>
      <h1 className={sectionTitleClassName}>
        {title}
      </h1>
      {description ? (
        <p
          className={[
            'mt-[var(--space-heading-content)] max-w-2xl',
            bodyTextClassName,
          ]
            .join(' ')
            .trim()}
        >
          {description}
        </p>
      ) : null}
    </header>
  )
}
