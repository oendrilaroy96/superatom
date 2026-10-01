import type { ReactNode } from "react";

type EyebrowColor = "primary" | "accent";
type HeadingSize = "default" | "lg";
type Theme = "light" | "dark";

type SectionHeadingProps = {
  eyebrow: ReactNode;
  heading: ReactNode;
  description?: ReactNode;
  eyebrowColor?: EyebrowColor;
  size?: HeadingSize;
  align?: "left" | "center";
  /** "dark" for sections on a dark (e.g. secondary-500) background: swaps heading/description/eyebrow to light-on-dark colors. */
  theme?: Theme;
  className?: string;
  descriptionClassName?: string;
};

const eyebrowColors: Record<Theme, Record<EyebrowColor, string>> = {
  light: { primary: "text-primary-500", accent: "text-accent-500" },
  dark: { primary: "text-primary-300", accent: "text-accent-400" },
};

const headingSizes: Record<HeadingSize, string> = {
  default: "mt-3 text-[58px] leading-[1.15]",
  lg: "mt-4 text-[58px] leading-[1.15]",
};

const headingColors: Record<Theme, string> = {
  light: "text-heading",
  dark: "text-white",
};

const descriptionColors: Record<Theme, string> = {
  light: "text-body",
  dark: "text-white/65",
};

/**
 * Eyebrow + heading + description, used at the top of a page section.
 * Font family, size and weight are fixed (matching How It Works's heading)
 * so every section's heading reads consistently; only color varies, via
 * `theme`, for sections on a dark background.
 */
export default function SectionHeading({
  eyebrow,
  heading,
  description,
  eyebrowColor = "primary",
  size = "default",
  align = "left",
  theme = "light",
  className = "",
  descriptionClassName = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`${align === "center" ? "mx-auto text-center" : ""} ${className}`}
    >
      <p
        className={`text-h5 font-semibold uppercase tracking-[0.5px] transition-colors duration-700 ${eyebrowColors[theme][eyebrowColor]}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-display font-semibold transition-colors duration-700 ${headingColors[theme]} ${headingSizes[size]}`}
      >
        {heading}
      </h2>
      {description && (
        <p
          className={`text-p mt-4 transition-colors duration-700 ${descriptionColors[theme]} ${descriptionClassName}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
