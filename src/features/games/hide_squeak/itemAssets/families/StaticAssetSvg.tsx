import type { HideSqueakItemAssetRenderProps } from '../types'

export function createStaticAssetSvg({
  src,
  viewBox,
}: {
  src: string
  viewBox: string
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
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    )
  }
}
