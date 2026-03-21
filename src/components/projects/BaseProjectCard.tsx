import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import type { Project } from '../../data/projects'
import { Card } from '../ui/Card'

type BaseProjectCardProps = {
  project: Project
  className?: string
  contentClassName?: string
  footerClassName?: string
  ctaLabel: string
  children: ReactNode
}

export function BaseProjectCard({
  project,
  className = '',
  contentClassName = '',
  footerClassName = '',
  ctaLabel,
  children,
}: BaseProjectCardProps) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="cardLink group"
    >
      <Card
        className={[
          'flex h-full flex-col transition-[border-color,transform,box-shadow] duration-[var(--duration-interactive)] ease-[var(--easing-interactive)] group-hover:translate-y-[var(--translate-interactive-hover)] group-hover:border-[color:color-mix(in_srgb,var(--border)_60%,#9ca3af_40%)] group-hover:shadow-sm motion-reduce:transform-none motion-reduce:transition-none',
          className,
        ]
          .join(' ')
          .trim()}
      >
        <div className={contentClassName}>{children}</div>
        <div className={['mt-auto', footerClassName].join(' ').trim()}>
          <span className="inline-flex w-fit items-center rounded-[var(--radius-pill)] bg-[color:color-mix(in_srgb,var(--primary)_18%,white)] px-[var(--space-chip-inline)] py-[var(--space-chip-block)] text-sm font-semibold text-[color:color-mix(in_srgb,var(--primary)_78%,#14532d_22%)] transition-[background-color,color] duration-[var(--duration-interactive)] ease-[var(--easing-interactive)] group-hover:bg-[color:color-mix(in_srgb,var(--primary)_24%,white)] group-hover:text-[color:color-mix(in_srgb,var(--primary)_82%,#14532d_18%)] group-focus-visible:bg-[color:color-mix(in_srgb,var(--primary)_24%,white)] group-focus-visible:text-[color:color-mix(in_srgb,var(--primary)_82%,#14532d_18%)] motion-reduce:transition-none">
            {ctaLabel}
          </span>
        </div>
      </Card>
    </Link>
  )
}

export function ProjectCardTitle({
  as: Component = 'h3',
  title,
  weight = 'semibold',
}: {
  as?: 'h2' | 'h3'
  title: string
  weight?: 'semibold' | 'bold'
}) {
  return (
    <Component
      className={[
        'text-[length:var(--font-size-title-xs)] tracking-tight leading-[var(--line-height-tight)] text-foreground transition-colors duration-[var(--duration-interactive)] ease-[var(--easing-interactive)] group-hover:text-[color:color-mix(in_srgb,var(--foreground)_88%,#111827_12%)] group-focus-visible:text-[color:color-mix(in_srgb,var(--foreground)_88%,#111827_12%)]',
        weight === 'bold'
          ? 'font-[var(--font-weight-bold)]'
          : 'font-[var(--font-weight-semibold)]',
      ]
        .join(' ')
        .trim()}
    >
      {title}
    </Component>
  )
}
