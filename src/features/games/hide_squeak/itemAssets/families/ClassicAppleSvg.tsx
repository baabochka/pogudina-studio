import type { HideSqueakItemAssetRenderProps } from '../types'

function getAppleVariantTransforms(colorVariant: string | null | undefined) {
  switch (colorVariant) {
    case 'golden':
      return {
        fruitRotation: '-4 33 30',
        leafRotation: '-10 15 8',
        scale: 0.98,
      }
    case 'jade':
      return {
        fruitRotation: '5 31 29',
        leafRotation: '12 15 8',
        scale: 0.97,
      }
    case 'bright-red':
    case 'default':
    default:
      return {
        fruitRotation: '2 31 29',
        leafRotation: '6 15 8',
        scale: 1,
      }
  }
}

export function ClassicAppleSvg({
  tokens,
  colorVariant,
  title,
  className,
  ...svgProps
}: HideSqueakItemAssetRenderProps) {
  const transforms = getAppleVariantTransforms(colorVariant)
  const fruitTransform =
    transforms.scale === 1
      ? `rotate(${transforms.fruitRotation})`
      : `translate(${(1 - transforms.scale) * 28.15} ${(1 - transforms.scale) * 25.865}) scale(${transforms.scale}) rotate(${transforms.fruitRotation})`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56.3 51.73"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      className={className}
      {...svgProps}
    >
      {title ? <title>{title}</title> : null}

      <g transform={fruitTransform}>
        <path
          fill={tokens.baseFill}
          stroke={tokens.outline}
          strokeMiterlimit="10"
          strokeWidth="2"
          d="m54.45,18.88c-1.61-5.53-3.31-10.25-10.59-13.06-4.63-1.66-26.37-1.67-31.84,4.09-10.66,11.34-4.19,27.67,7.19,37.78,6.77,3.56,15.1,3.99,21.9,1.28,8.93-3.55,16.84-20.39,13.33-30.09Z"
        />
        <path
          fill={`color-mix(in srgb, ${tokens.baseFill} 16%, white)`}
          strokeWidth="0"
          d="m23.07,12.88c-.1,1.38.79,1.72,2.04,1.37,2.75-.76,5.4-1.86,8.2-2.34,2.25-.38,4.67-.07,7,0,.25,0,.69.48.68.71-.02.24-.45.56-.77.66-.69.21-1.44.28-2.15.46-3.44.87-6.87,1.75-10.3,2.63-.82.14-1.64.27-2.46.41-.36-.12-.72-.25-1.08-.37-.57-.19-1.13-.44-1.72-.56-1.36-.28-2.8-.35-4.08-.79-2.76-.95-2.9-1.59-1.06-3.46.22-.02.45-.03.67-.05,1.66.43,3.32.87,4.98,1.3l.05.02Z"
        />
      </g>

      <g transform={`rotate(${transforms.leafRotation})`}>
        <path
          fill="#69853a"
          stroke={tokens.outline}
          strokeMiterlimit="10"
          d="m1.27,4.03c7.44-6.68,16.64-2.62,23.97,1.88.63.77,1.94,3.47,2.57,4.25-.53.67-5.07.12-7.45.07C14.67,6.84,6.89,7.32.93,4.29c0,0,0,0,0,0,.11-.09.23-.18.34-.26Z"
        />
        <path
          fill="#004e26"
          strokeWidth="0"
          d="m16.73,4.02c-4.83-.41-10.83-.36-15.6.24,0,0,0,0,0,0,6.05,2.79,13.72,2.4,19.41,5.84.75-.05,7,.34,7.5-.24l-2.05-.2c-1.12-2.73-5.77-4.22-9.26-5.65Z"
        />
        <path
          fill="#3c2415"
          stroke={tokens.outline}
          strokeMiterlimit="10"
          d="m29.65,5.75v4.36c-.2.02-1.06.55-2.22.24.53-.89-.07-5,.05-6.08.53-1.74,1.15-1.82,2.59-.32-.14.6-.28,1.2-.42,1.8Z"
        />
      </g>
    </svg>
  )
}
