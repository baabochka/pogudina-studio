import type { ReactNode } from 'react'

type PageIntroProps = {
  className?: string
  description?: ReactNode
  eyebrow: string
  title: ReactNode
}

export function PageIntro({ className = '', description, eyebrow, title }: PageIntroProps) {
  return (
    <div className={['max-w-3xl', className].join(' ').trim()}>
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
