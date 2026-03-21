import type { HTMLAttributes, ReactNode } from 'react'

import { Container } from './Container'
import {
  bodyTextClassName,
  eyebrowTextClassName,
  sectionTitleClassName,
} from './contentStyles'

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  titleAs?: 'h1' | 'h2'
}

export function Section({
  children,
  className = '',
  description,
  eyebrow,
  title,
  titleAs: Title = 'h2',
  ...props
}: SectionProps) {
  return (
    <section
      className={[
        'pt-[var(--space-section-block-start)] pb-[var(--space-section-block-end)] sm:pt-[var(--space-section-block-start-md)] sm:pb-[var(--space-section-block-end-md)]',
        className,
      ]
        .join(' ')
        .trim()}
      {...props}
    >
      <Container>
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className={eyebrowTextClassName}>{eyebrow}</p>
          ) : null}
          <Title className={sectionTitleClassName}>
            {title}
          </Title>
          {description ? (
            <p className={['mt-[var(--space-heading-content)]', bodyTextClassName].join(' ')}>
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-[var(--space-section-gap)]">{children}</div>
      </Container>
    </section>
  )
}
