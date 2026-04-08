const GAME_PREVIEW_VARIANT_STYLES = {
  landscape: {
    frame: 'aspect-[4/3] p-0',
    image: 'h-full w-full rounded-[16px] object-cover object-center',
  },
  portrait: {
    frame: 'aspect-[798/1203] p-0',
    image: 'h-full w-full rounded-[16px] object-cover object-center',
  },
  square: {
    frame: 'aspect-square p-3',
    image: 'max-h-full max-w-full object-contain object-center',
  },
} as const

type GamePreviewProps = {
  alt: string
  className?: string
  src: string
  variant: keyof typeof GAME_PREVIEW_VARIANT_STYLES
}

export function GamePreview({ alt, className = '', src, variant }: GamePreviewProps) {
  const variantStyles = GAME_PREVIEW_VARIANT_STYLES[variant]

  return (
    <div
      className={[
        'flex items-center justify-center overflow-hidden rounded-[20px] border border-border/70 bg-[color:color-mix(in_srgb,var(--surface)_90%,white)]',
        variantStyles.frame,
        className,
      ]
        .join(' ')
        .trim()}
    >
      <img
        src={src}
        alt={alt}
        className={variantStyles.image}
      />
    </div>
  )
}
