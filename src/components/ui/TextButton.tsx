import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { MdRefresh } from "react-icons/md";
import { textButtonColors, type ButtonVariant } from "./buttonVariants";

const base =
  "inline-flex items-center justify-center gap-1.5 font-sans text-base font-medium leading-none transition-colors disabled:pointer-events-none disabled:opacity-45";

type CommonProps = {
  variant?: ButtonVariant;
  loading?: boolean;
  children?: ReactNode;
  className?: string;
};

type TextButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type TextButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type TextButtonProps = TextButtonAsButton | TextButtonAsAnchor;

/**
 * Figma: Components / Text Button. Low-emphasis, no fill or border — uses
 * its own on-white text colors so every style stays legible without a
 * background to lean on.
 */
export default function TextButton({
  variant = "primary",
  loading = false,
  children,
  className = "",
  href,
  ...props
}: TextButtonProps) {
  const c = textButtonColors[variant];
  const classes = [base, c.text, c.hoverText, className].filter(Boolean).join(" ");

  const content = loading ? (
    <MdRefresh size={16} className="animate-spin" aria-hidden="true" />
  ) : (
    children
  );

  if (href) {
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={classes} aria-busy={loading || undefined} {...anchorProps}>
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
      {...buttonProps}
    >
      {content}
    </button>
  );
}
