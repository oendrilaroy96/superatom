import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "./ui/IconButton";

type DemoModalProps = {
  open: boolean;
  onClose: () => void;
};

/** Public Zoho Forms embed link for the "Book a Demo" form. */
const ZOHO_FORM_URL =
  "https://forms.zohopublic.in/prashanthsupe1/form/BookaDemo/formperma/aXhKfIiZxG2qMrdTkpo4rUW6Ze6jgxMdUN-DtrRs4CQ";

export default function DemoModal({ open, onClose }: DemoModalProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setLoaded(false);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-secondary-900/50 px-4 py-8 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Book a demo"
        className="relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-secondary-100 bg-white shadow-2xl shadow-secondary-900/20"
      >
        <IconButton
          icon={CloseIcon}
          aria-label="Close"
          variant="subtle"
          size="sm"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 bg-white/90"
        />

        {!loaded && (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm text-caption"
            aria-live="polite"
          >
            Loading form…
          </div>
        )}

        <iframe
          title="Book a demo"
          aria-label="Book a Demo"
          src={ZOHO_FORM_URL}
          onLoad={() => setLoaded(true)}
          className="block h-[min(760px,calc(100vh-4rem))] w-full border-0"
        />
      </div>
    </div>,
    document.body,
  );
}
