import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { buttonVariants, type ButtonVariant } from "./buttonVariants";

export type { ButtonVariant };

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-6 py-4 font-sans text-base font-medium leading-none transition-colors disabled:pointer-events-none disabled:opacity-45";

type CommonProps = {
  variant?: ButtonVariant;
  selected?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

/** Figma: Components / Button. */
export default function Button({
  variant = "primary",
  selected = false,
  loading = false,
  iconLeft,
  iconRight,
  children,
  className = "",
  href,
  ...props
}: ButtonProps) {
  const v = buttonVariants[variant];
  const classes = [
    base,
    v.text,
    v.border,
    selected ? v.selectedBg : v.restBg,
    selected ? "" : v.hoverClass,
    selected ? `ring-2 ring-offset-2 ${v.ring} ${v.selectedBorder ?? ""}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = loading ? (
    <RefreshIcon style={{ fontSize: 18 }} className="animate-spin" aria-hidden="true" />
  ) : (
    <>
      {iconLeft}
      {children}
      {iconRight}
    </>
  );

  if (href) {
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        href={href}
        className={classes}
        aria-busy={loading || undefined}
        aria-pressed={selected || undefined}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type="button"
      className={classes}
      disabled={loading || buttonProps.disabled}
      aria-busy={loading || undefined}
      aria-pressed={selected || undefined}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
