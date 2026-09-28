export type ButtonVariant =
  | "primary"
  | "secondary"
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

// Figma: Components / Text Button. Text Button has no fill in any state,
// so it needed its own on-white text colors — see the page's audit note
// for why each of these differs from the filled Button's text color.
export const textButtonColors: Record<
  ButtonVariant,
  { text: string; hoverText: string }
> = {
  primary: { text: "text-primary-500", hoverText: "hover:text-primary-600" },
  secondary: { text: "text-heading", hoverText: "hover:text-secondary-600" },
  accent: { text: "text-accent-700", hoverText: "hover:text-accent-800" },
  default: { text: "text-body", hoverText: "hover:text-heading" },
  subtle: { text: "text-muted", hoverText: "hover:text-body" },
  warning: { text: "text-warning-700", hoverText: "hover:text-warning-800" },
  danger: { text: "text-error-500", hoverText: "hover:text-error-600" },
  discovery: { text: "text-primary-600", hoverText: "hover:text-primary-700" },
};
