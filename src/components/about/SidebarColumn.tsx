import type { ReactNode } from 'react'

type SidebarColumnProps = {
  alt: string
  children: ReactNode
  className?: string
  imageClassName?: string
  imageSrc: string
}

export function SidebarColumn({
  alt,
  children,
  className = '',
  imageClassName = '',
  imageSrc,
}: SidebarColumnProps) {
  return (
    <aside className={['flex flex-col gap-4 lg:self-start', className].join(' ').trim()}>
      <img
        src={imageSrc}
        alt={alt}
        className={[
          'w-full max-w-[300px] rounded-[20px] object-cover shadow-[0_20px_40px_-32px_rgba(15,23,42,0.24)] sm:max-w-[320px]',
          imageClassName,
        ]
          .join(' ')
          .trim()}
      />
      {children}
    </aside>
  )
}
