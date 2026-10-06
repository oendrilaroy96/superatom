import type { ReactNode } from "react";

type GlowCardProps = {
  children: ReactNode;
  /** Sizing/positioning utilities for the card's own box (e.g. width in a flex-wrap row). */
  className?: string;
  /** Padding and internal layout (e.g. flex row for an icon + label) for the content itself. */
  contentClassName?: string;
};

/**
 * White bordered card whose border lights up with a brand-gradient glow
 * that follows the cursor on hover, confined to a 1px ring (not a fill)
 * via the padding + mask-composite:exclude trick. Shared by every card
 * grid using this card shape so the effect and its tuning (radius, fade,
 * colors) stay in one place.
 */
export default function GlowCard({
  children,
  className = "",
  contentClassName = "p-6",
}: GlowCardProps) {
  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
      }}
      className={`group relative rounded-lg border border-secondary-100 bg-white ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px z-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          padding: 1,
          background:
            "radial-gradient(110px circle at var(--x, 50%) var(--y, 50%), #7fd5d6 0%, #91a9fe 18%, #9889fe 36%, #b78bff 54%, #ffb2d0 72%, #ffad66 86%, transparent 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </div>
  );
}
