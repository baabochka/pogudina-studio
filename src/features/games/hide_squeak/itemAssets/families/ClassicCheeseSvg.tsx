import type { HideSqueakItemAssetRenderProps } from '../types'

function renderClassicHoles(detailFill: string) {
  return (
    <>
      <circle
        cx="49"
        cy="39"
        r="6.25"
        fill={detailFill}
        opacity="0.9"
      />
      <circle
        cx="77"
        cy="57"
        r="4.75"
        fill={detailFill}
        opacity="0.78"
      />
      <circle
        cx="60"
        cy="74"
        r="5.25"
        fill={detailFill}
        opacity="0.72"
      />
    </>
  )
}

function renderDenseHoles(detailFill: string) {
  return (
    <>
      {renderClassicHoles(detailFill)}
      <circle
        cx="94"
        cy="44"
        r="3.5"
        fill={detailFill}
        opacity="0.7"
      />
      <circle
        cx="33"
        cy="69"
        r="3"
        fill={detailFill}
        opacity="0.68"
      />
    </>
  )
}

export function ClassicCheeseSvg({
  tokens,
  detailVariant,
  title,
  className,
  ...svgProps
}: HideSqueakItemAssetRenderProps) {
  const holeMarkup =
    detailVariant === 'dense-holes'
      ? renderDenseHoles(tokens.detailFill)
      : renderClassicHoles(tokens.detailFill)

  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      className={className}
      {...svgProps}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M20 26C20 18.268 26.268 12 34 12H88.442C91.409 12 94.269 13.12 96.45 15.136L111.008 28.592C113.864 31.232 115.489 34.949 115.489 38.838V83.384C115.489 89.554 111.142 94.87 105.087 96.093L39.597 109.325C37.366 109.775 35.053 109.68 32.866 109.048L27.278 107.434C22.979 106.191 20 102.258 20 97.783V26Z"
        fill={tokens.baseFill}
        stroke={tokens.outline}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M20 86.598L115.488 67.507V83.384C115.488 89.554 111.141 94.87 105.087 96.093L39.596 109.325C37.365 109.775 35.053 109.68 32.865 109.048L27.278 107.434C22.979 106.191 20 102.258 20 97.783V86.598Z"
        fill={tokens.baseShade}
      />
      <path
        d="M79.163 12L111.008 28.592C113.865 31.232 115.489 34.949 115.489 38.838V54.287L79.163 61.771V12Z"
        fill={tokens.accentFill ?? tokens.baseFill}
      />
      <path
        d="M79.163 61.771L115.489 54.287V67.507L79.163 74.773V61.771Z"
        fill={tokens.accentShade ?? tokens.baseShade}
      />
      <path
        d="M79.163 12V74.773"
        stroke={tokens.outline}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M20 86.598L115.488 67.507"
        stroke={tokens.outline}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {holeMarkup}
    </svg>
  )
}
