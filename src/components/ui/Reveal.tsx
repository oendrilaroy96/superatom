import type { ComponentProps } from "react";
import { m } from "motion/react";
import { usePreloaderDone } from "../../lib/preloader";

const tags = { div: m.div, p: m.p, h1: m.h1, h2: m.h2, span: m.span } as const;

type RevealProps<T extends keyof typeof tags> = {
  /** Element to render. */
  as?: T;
  /** Seconds to wait before this piece starts, used to stagger a heading, its description and a button. */
  delay?: number;
  /** Renders the element as-is, with no animation. */
  disabled?: boolean;
} & Omit<
  ComponentProps<(typeof tags)[T]>,
  "initial" | "animate" | "transition"
>;

/**
 * Fades the content in while it rises a little, once, when it first appears.
 * Used on the text at the top of each page. Motion is switched off for
 * visitors whose system asks for reduced motion (see MotionConfig in App).
 */
export default function Reveal<T extends keyof typeof tags = "div">({
  as,
  delay = 0,
  disabled = false,
  ...props
}: RevealProps<T>) {
  const Tag = tags[as ?? "div"] as typeof m.div;
  // On the first page load, hold the text back until the preloader clears.
  const ready = usePreloaderDone();
  return (
    <Tag
      initial={disabled ? false : { opacity: 0, y: 24 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...(props as ComponentProps<typeof m.div>)}
    />
  );
}
