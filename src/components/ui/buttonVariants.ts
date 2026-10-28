export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accentOutline"
  | "accent"
  | "default"
  | "subtle"
  | "warning"
  | "danger"
  | "discovery";

export type VariantTokens = {
  text: string;
  border: string;
  restBg: string;
  hoverClass: string;
  selectedBg: string;
  ring: string;
  selectedBorder?: string;
};

// Figma: Components / Button. Fill + text pairings are the WCAG
// AA-corrected ones from the design doc's audit (e.g. accent/warning/
// discovery label color moved to text/heading, danger's to text/inverse).
export const buttonVariants: Record<ButtonVariant, VariantTokens> = {
  primary: {
    text: "text-white",
    border: "",
    restBg: "bg-primary-500",
    hoverClass: "hover:bg-primary-600",
    selectedBg: "bg-primary-600",
    ring: "ring-primary-500",
  },
  secondary: {
    text: "text-heading",
    border: "border border-secondary-200",
    restBg: "bg-white",
    hoverClass: "hover:bg-secondary-100/60",
    selectedBg: "bg-secondary-100/60",
    selectedBorder: "border-2",
    ring: "ring-heading",
  },
  // White pill with an accent-colored label, used for the "Book a demo" CTA.
  // Border and text both flip to the secondary (dark navy) color on hover.
  accentOutline: {
    text: "text-accent-500",
    border: "border border-secondary-200",
    restBg: "bg-white",
    hoverClass: "hover:border-secondary-500 hover:text-secondary-500",
    selectedBg: "bg-white",
    ring: "ring-secondary-500",
  },
  accent: {
    text: "text-heading",
    border: "",
    restBg: "bg-accent-500",
    hoverClass: "hover:bg-accent-600",
    selectedBg: "bg-accent-600",
    ring: "ring-heading",
  },
  default: {
    text: "text-heading",
    border: "border border-secondary-100",
    restBg: "bg-page",
    hoverClass: "hover:bg-secondary-100/70",
    selectedBg: "bg-secondary-100/70",
    ring: "ring-heading",
  },
  subtle: {
    text: "text-body",
    border: "",
    restBg: "bg-transparent",
    hoverClass: "hover:bg-secondary-100/50",
    selectedBg: "bg-secondary-100/50",
    ring: "ring-body",
  },
  warning: {
    text: "text-heading",
    border: "",
    restBg: "bg-warning-500",
    hoverClass: "hover:bg-warning-600",
    selectedBg: "bg-warning-600",
    ring: "ring-heading",
  },
  danger: {
    text: "text-white",
    border: "",
    restBg: "bg-error-500",
    hoverClass: "hover:bg-error-600",
    selectedBg: "bg-error-600",
    ring: "ring-white",
  },
  discovery: {
    text: "text-heading",
    border: "",
    restBg: "bg-primary-400",
    hoverClass: "hover:bg-primary-500",
    selectedBg: "bg-primary-500",
    ring: "ring-heading",
  },
};
