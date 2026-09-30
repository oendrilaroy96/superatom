import type { ButtonHTMLAttributes } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import type { IconComponent } from "../../types/icon";
import { buttonVariants, type ButtonVariant } from "./buttonVariants";

export type IconButtonSize = "sm" | "md" | "lg";

// Figma: Components / Icon Button — Small 32px/16px icon, Medium 40px/20px
// icon, Large 48px/24px icon, matching the sizes documented on the Icon page.
const sizes: Record<IconButtonSize, { box: string; icon: number }> = {
  sm: { box: "h-8 w-8", icon: 16 },
  md: { box: "h-10 w-10", icon: 20 },
  lg: { box: "h-12 w-12", icon: 24 },
};

type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  icon: IconComponent;
  "aria-label": string;
  variant?: ButtonVariant;
  size?: IconButtonSize;
  selected?: boolean;
  loading?: boolean;
  className?: string;
};

/** Figma: Components / Icon Button. Icon-only actions; `aria-label` is required since there's no visible label. */
export default function IconButton({
  icon: Icon,
  variant = "default",
  size = "md",
  selected = false,
  loading = false,
  className = "",
  disabled,
  ...props
}: IconButtonProps) {
  const v = buttonVariants[variant];
  const s = sizes[size];
  const classes = [
    "inline-flex shrink-0 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-45",
    s.box,
    v.text,
    v.border,
    selected ? v.selectedBg : v.restBg,
    selected ? "" : v.hoverClass,
    selected ? `ring-2 ring-offset-2 ${v.ring} ${v.selectedBorder ?? ""}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      disabled={loading || disabled}
      aria-busy={loading || undefined}
      aria-pressed={selected || undefined}
      {...props}
    >
      {loading ? (
        <RefreshIcon style={{ fontSize: s.icon }} className="animate-spin" aria-hidden="true" />
      ) : (
        <Icon style={{ fontSize: s.icon }} aria-hidden="true" />
      )}
    </button>
  );
}
