import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}

export function Button({
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60'

  const variantClasses =
    variant === 'primary'
      ? 'bg-primary text-primary-foreground hover:opacity-90'
      : 'border border-border bg-surface text-foreground hover:bg-surface-muted'

  return (
    <button
      type={type}
      className={[baseClasses, variantClasses, className].join(' ').trim()}
      {...props}
    >
      {children}
    </button>
  )
}
