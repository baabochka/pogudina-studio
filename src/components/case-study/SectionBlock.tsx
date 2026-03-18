import type { ReactNode } from 'react'

type SectionBlockProps = {
  title: string
  children: ReactNode
}

export function SectionBlock({ title, children }: SectionBlockProps) {
  return (
    <section className="border-t border-border/80 pt-10 first:border-t-0 first:pt-0 sm:pt-12">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-5 space-y-4 text-base leading-7 text-muted-foreground">{children}</div>
    </section>
  )
}
