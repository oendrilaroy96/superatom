import type { ReactNode } from "react";

type EyebrowColor = "primary" | "accent";
type HeadingSize = "default" | "lg";

type SectionHeadingProps = {
  eyebrow: ReactNode;
  heading: ReactNode;
  description?: ReactNode;
  eyebrowColor?: EyebrowColor;
  size?: HeadingSize;
  align?: "left" | "center";
  className?: string;
  descriptionClassName?: string;
};

const eyebrowColors: Record<EyebrowColor, string> = {
  primary: "text-primary-500",
  accent: "text-accent-500",
};

const headingSizes: Record<HeadingSize, string> = {
  default: "mt-3 text-[58px] leading-[1.15]",
  lg: "mt-4 text-[58px] leading-[1.15]",
};

/** Eyebrow + heading + description, used at the top of a page section. */
export default function SectionHeading({
  eyebrow,
  heading,
  description,
  eyebrowColor = "primary",
  size = "default",
  align = "left",
  className = "",
  descriptionClassName = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`${align === "center" ? "mx-auto text-center" : ""} ${className}`}
    >
      <p
        className={`text-h5 font-semibold uppercase tracking-[0.5px] ${eyebrowColors[eyebrowColor]}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-display font-semibold text-heading ${headingSizes[size]}`}
      >
        {heading}
      </h2>
      {description && (
        <p className={`text-p mt-4 text-body ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
}
