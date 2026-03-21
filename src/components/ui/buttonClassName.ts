export function getButtonClassName(variant: 'primary' | 'secondary' = 'primary') {
  const baseClasses =
    'inline-flex items-center justify-center rounded-[var(--radius-md)] px-[var(--space-button-inline)] py-[var(--space-button-block)] text-sm font-semibold shadow-[var(--shadow-button)] transition-[background-color,color,border-color,opacity,transform,box-shadow] duration-[var(--duration-interactive)] ease-[var(--easing-interactive)] hover:opacity-95 active:translate-y-[var(--translate-interactive-active)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:transform-none'

  const variantClasses =
    variant === 'primary'
      ? 'bg-primary text-primary-foreground'
      : 'border border-border bg-surface text-foreground shadow-none hover:bg-surface-muted'

  return [baseClasses, variantClasses].join(' ')
}
