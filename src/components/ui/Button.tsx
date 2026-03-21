import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { getButtonClassName } from './buttonClassName'

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
  return (
    <button
      type={type}
      className={[getButtonClassName(variant), className].join(' ').trim()}
      {...props}
    >
      {children}
    </button>
  )
}
