import type { HTMLAttributes, ReactNode } from 'react'

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function Container({ children, className = '', ...props }: ContainerProps) {
  return (
    <div
      className={[
        'mx-auto w-full max-w-6xl px-[var(--space-container-inline)] sm:px-[var(--space-container-inline-md)] lg:px-[var(--space-container-inline-lg)]',
        className,
      ]
        .join(' ')
        .trim()}
      {...props}
    >
      {children}
    </div>
  )
}
