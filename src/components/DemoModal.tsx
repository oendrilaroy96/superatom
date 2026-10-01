import { useEffect, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "./ui/Button";
import IconButton from "./ui/IconButton";

type DemoModalProps = {
  open: boolean;
  onClose: () => void;
};

const inputClasses =
  "w-full rounded-md border border-secondary-200 bg-white px-3.5 py-2.5 text-sm text-heading placeholder:text-caption transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30";

function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-heading">
        {label}
      </span>
      <input className={inputClasses} {...props} />
    </label>
  );
}

export default function DemoModal({ open, onClose }: DemoModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

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
    if (!open) {
      setSubmitted(false);
      setAgreed(false);
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

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
        aria-labelledby="demo-modal-title"
        className="relative w-full max-w-lg rounded-2xl border border-secondary-100 bg-white p-6 shadow-2xl shadow-secondary-900/20 sm:p-8"
      >
        <IconButton
          icon={CloseIcon}
          aria-label="Close"
          variant="subtle"
          size="sm"
          onClick={onClose}
          className="absolute right-4 top-4"
        />

        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary-100 text-primary-500">
              <CheckCircleIcon style={{ fontSize: 30 }} />
            </span>
            <h2 className="font-display text-h3 font-semibold text-heading">
              Thanks — we&apos;ll be in touch
            </h2>
            <p className="mt-2 max-w-xs text-sm text-body">
              A member of our team will reach out shortly to schedule your
              demo.
            </p>
            <Button variant="secondary" className="mt-6" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <h2
              id="demo-modal-title"
              className="font-display text-h3 font-semibold text-heading sm:text-h2"
            >
              Book a demo
            </h2>
            <p className="mt-1.5 text-sm text-body">
              Tell us a bit about your team and we&apos;ll set up time to show
              you Superatom AI.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" name="name" type="text" autoComplete="name" placeholder="Jane Doe" required />
                <Field label="Email" name="email" type="email" autoComplete="email" placeholder="jane@company.com" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Mobile number" name="mobile" type="tel" autoComplete="tel" placeholder="+1 555 000 0000" required />
                <Field label="Company" name="company" type="text" autoComplete="organization" placeholder="Acme Inc." required />
              </div>
              <Field label="Designation" name="designation" type="text" placeholder="VP, Supply Chain" required />

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-heading">
                  Message
                </span>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="What would you like to see in the demo?"
                  className={`${inputClasses} resize-none`}
                />
              </label>

              <label className="flex items-start gap-2.5 text-sm text-body">
                <input
                  type="checkbox"
                  name="agree"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-secondary-300 accent-primary-500"
                />
                <span>
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-500 underline underline-offset-2 hover:text-primary-600"
                  >
                    Terms and Conditions
                  </a>
                  .
                </span>
              </label>

              <Button type="submit" variant="primary" className="w-full justify-center">
                Submit
              </Button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
