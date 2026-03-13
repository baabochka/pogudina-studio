export function HintPawStep({
  fill,
  stroke,
  className = 'h-9 w-9',
}: {
  fill: string
  stroke: string
  className?: string
}) {
  return (
    <svg viewBox="0 0 90 90" className={`${className} overflow-visible`} aria-hidden="true">
      <g transform="translate(45 45) scale(0.98) translate(-45 -45)">
        <path
          d="m45.22,15.81c5.69,2.07,14.56,7.05,10.58,14.76-2.29,4.4-8.47,12.81-13.03,10.56-8.44-5.3-18.55-14.82-6.73-22.78,2.56-1.73,6.03-3.11,9.18-2.54Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="m48.07,87.66c-10.5-.67-24.87-2.58-23.57-15.54.78-11.12,6.8-22.47,18.55-25.01,13.09-2.53,22.36,9.39,27.52,19.66,7.15,14.51-11.89,20.23-22.5,20.89Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="m13.52,55.28c-17.33,1.25-12.87-28.66,6.68-23.36,5.16,1.08,5.72,5.68,6.3,9.79,1.67,11.72.07,13.31-12.98,13.57Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="m76.06,25.23c7.13-.07,12.51,5.87,12.45,13.77-.04,5.18-9.41,11.39-17.22,11.45-2.73,0-7.82-10.33-7.87-15.98-.05-5.41,5.08-9.14,12.64-9.23Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  )
}
