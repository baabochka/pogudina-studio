import type { ComponentType, CSSProperties, SVGProps } from "react";

import "./styles/card-svg.css";

export function BoardSvgAsset({
  Svg,
  className,
  style,
}: {
  Svg: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Svg
      aria-hidden="true"
      className={["card-svg", className].filter(Boolean).join(" ")}
      style={style}
    />
  );
}
