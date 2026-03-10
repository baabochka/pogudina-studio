import type { HTMLAttributes, ReactNode } from 'react'

import { Container } from './Container'

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  eyebrow?: string
  title: string
  description?: string
}

export function Section({
  children,
  className = '',
  description,
  eyebrow,
  title,
  ...props
}: SectionProps) {
  return (
    <section className={['py-12 sm:py-16', className].join(' ').trim()} {...props}>
      <Container>
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <div className="mt-8">{children}</div>
      </Container>
    </section>
  )
}
