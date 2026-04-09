import type { HideSqueakItemAssetRenderProps } from '../types'

export function createStaticAssetSvg({
  src,
  viewBox,
  imageBox,
}: {
  src: string
  viewBox: string
  imageBox?: {
    x: string
    y: string
    width: string
    height: string
  }
}) {
  return function StaticAssetSvg({
    title,
    className,
    tokens,
    detailVariant,
    ...svgProps
  }: HideSqueakItemAssetRenderProps) {
    void tokens
    void detailVariant

    return (
      <svg
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        role={title ? 'img' : 'presentation'}
        aria-label={title}
        className={className}
        preserveAspectRatio="xMidYMid meet"
        {...svgProps}
      >
        {title ? <title>{title}</title> : null}
        <image
          href={src}
          x={imageBox?.x ?? '0%'}
          y={imageBox?.y ?? '0%'}
          width={imageBox?.width ?? '100%'}
          height={imageBox?.height ?? '100%'}
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    )
  }
}
