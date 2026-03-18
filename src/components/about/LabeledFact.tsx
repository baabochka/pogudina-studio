import type { ReactNode } from 'react'

type LabeledFactProps = {
  children: ReactNode
  label: string
}

export function LabeledFact({ children, label }: LabeledFactProps) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground/85">
        {label}
      </dt>
      <dd className="mt-1.5 leading-6 text-foreground/90">{children}</dd>
    </div>
  )
}
