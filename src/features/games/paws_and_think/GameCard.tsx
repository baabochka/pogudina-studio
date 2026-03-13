import type { ReactNode } from "react";

import cardFrame from "./assets/card_frame.png";
import { Card } from "./ui/Card";

type GameCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  showFrame?: boolean;
};

export function GameCard({
  title,
  description,
  children,
  showFrame = true,
}: GameCardProps) {
  return (
    <Card className="h-full bg-[linear-gradient(180deg,var(--surface),color-mix(in_srgb,var(--accent)_12%,var(--surface)))]">
      <div className="flex h-full flex-col gap-5">
        <div className="mx-auto w-full max-w-85">
          {showFrame ? (
            <div className="relative">
              <img
                src={cardFrame}
                alt=""
                aria-hidden="true"
                className="pointer-events-none block h-auto w-full select-none"
              />

              <div className="absolute inset-[7.5%] flex items-center justify-center overflow-hidden rounded-4xl">
                {children}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">{children}</div>
          )}
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
