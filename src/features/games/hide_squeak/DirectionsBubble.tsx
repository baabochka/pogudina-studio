import type { ComponentType, ReactNode, SVGProps } from "react";

import BubbleSpeechTailSvg from "./assets/bubble_speech_tail.svg?react";

export function DirectionsBubble({
  children,
  MouseSvg,
  showTail = true,
  showMouse = true,
  isMobileLayout = false,
  rootClassName = "",
  bubbleWrapperClassName = "",
  bubbleClassName = "",
  mouseClassName = "",
  tailClassName = "",
}: {
  children: ReactNode;
  MouseSvg: ComponentType<SVGProps<SVGSVGElement>>;
  showTail?: boolean;
  showMouse?: boolean;
  isMobileLayout?: boolean;
  rootClassName?: string;
  bubbleWrapperClassName?: string;
  bubbleClassName?: string;
  mouseClassName?: string;
  tailClassName?: string;
}) {
  return (
    <div
      className={[
        "relative flex h-full w-full min-w-0 max-w-full",
        isMobileLayout ? "items-start overflow-hidden" : "items-end",
        rootClassName,
      ].join(" ")}
    >
      <div
        className={[
          "SpeechBubble mb-[80px] ml-auto mr-4.5 min-w-0",
          bubbleWrapperClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={[
            "relative min-h-[170px] min-w-[180px] max-w-full w-fit rounded-[20px] bg-hs-panel px-4 pb-6 pt-5 shadow-hs-panel",
            bubbleClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
          {showTail ? (
            <BubbleSpeechTailSvg
              aria-hidden="true"
              focusable="false"
              className={[
                "pointer-events-none absolute bottom-[-40px] right-[60px] z-[1] h-[44px] w-[45px] text-hs-panel",
                tailClassName,
              ]
                .filter(Boolean)
                .join(" ")}
            />
          ) : null}
        </div>
      </div>

      {showMouse ? (
        <MouseSvg
          aria-hidden="true"
          focusable="false"
          className={[
            "hsCharacterMouseSvg pointer-events-none absolute bottom-0 right-0 z-[2] h-[100px] w-[100px]",
            mouseClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        />
      ) : null}
    </div>
  );
}
