const GAME_PREVIEW_VARIANT_STYLES = {
  landscape: {
    frame: 'aspect-[4/3] p-0',
    stackedFrame: 'aspect-[4/6.25] p-0',
    image: 'h-full w-full rounded-[16px] object-cover',
    stackFrame: 'grid h-full w-full grid-rows-[minmax(0,1.5fr)_minmax(0,1.5fr)] gap-1 p-1',
    stackImage: 'h-full w-full rounded-[14px] object-cover',
  },
  portrait: {
    frame: 'aspect-[798/1203] p-0',
    stackedFrame: '',
    image: 'h-full w-full rounded-[16px] object-cover',
    stackFrame: '',
    stackImage: '',
  },
  square: {
    frame: 'aspect-square p-3',
    stackedFrame: '',
    image: 'max-h-full max-w-full object-contain',
    stackFrame: '',
    stackImage: '',
  },
} as const

type GamePreviewProps = {
  alt: string
  className?: string
  imageFit?: 'contain' | 'cover'
  imagePosition?: string
  secondaryAlt?: string
  secondaryImageFit?: 'contain' | 'cover'
  secondaryImagePosition?: string
  secondarySrc?: string
  src: string
  variant: keyof typeof GAME_PREVIEW_VARIANT_STYLES
}

export function GamePreview({
  alt,
  className = '',
  imageFit = 'cover',
  imagePosition,
  secondaryAlt,
  secondaryImageFit = 'cover',
  secondaryImagePosition,
  secondarySrc,
  src,
  variant,
}: GamePreviewProps) {
  const variantStyles = GAME_PREVIEW_VARIANT_STYLES[variant]
  const shouldStackPreviews =
    variant === 'landscape' && Boolean(secondarySrc && secondaryAlt)

  return (
    <div
      className={[
        'flex items-center justify-center overflow-hidden rounded-[20px] border border-border/70 bg-[color:color-mix(in_srgb,var(--surface)_90%,white)]',
        shouldStackPreviews ? variantStyles.stackedFrame : variantStyles.frame,
        className,
      ]
        .join(' ')
        .trim()}
    >
      {shouldStackPreviews ? (
        <div className={variantStyles.stackFrame}>
          <img
            src={src}
            alt={alt}
            className={[
              variantStyles.stackImage,
              imageFit === 'contain' ? 'bg-[color:color-mix(in_srgb,var(--surface)_94%,white)]' : '',
            ]
              .join(' ')
              .trim()}
            style={{
              objectFit: imageFit,
              objectPosition: imagePosition ?? 'center',
            }}
          />
          <img
            src={secondarySrc}
            alt={secondaryAlt}
            className={[
              variantStyles.stackImage,
              secondaryImageFit === 'contain'
                ? 'bg-[color:color-mix(in_srgb,var(--surface)_94%,white)]'
                : '',
            ]
              .join(' ')
              .trim()}
            style={{
              objectFit: secondaryImageFit,
              objectPosition: secondaryImagePosition ?? 'center',
            }}
          />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={[
            variantStyles.image,
            imageFit === 'contain' ? 'bg-[color:color-mix(in_srgb,var(--surface)_94%,white)]' : '',
          ]
            .join(' ')
            .trim()}
          style={{
            objectFit: imageFit,
            objectPosition: imagePosition ?? 'center',
          }}
        />
      )}
    </div>
  )
}
