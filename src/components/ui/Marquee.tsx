import { type ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  direction?: "left" | "right";
  durationSec?: number;
  className?: string;
};

export function Marquee({
  children,
  direction = "left",
  durationSec = 40,
  className = "",
}: MarqueeProps) {
  const anim =
    direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`flex w-max gap-4 ${anim}`}
        style={{ animationDuration: `${durationSec}s` }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
