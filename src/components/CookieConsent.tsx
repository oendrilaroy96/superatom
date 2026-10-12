import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from "./ui/Button";
import IconButton from "./ui/IconButton";
import {
  type CookieConsent as Consent,
  defaultCookieConsent as defaultDraft,
  onOpenCookiePreferences,
  readStoredConsent,
  writeStoredConsent,
} from "../lib/cookieConsent";

const categories: { key: "analytics" | "marketing"; title: string; description: string }[] = [
  {
    key: "analytics",
    title: "Analytics",
    description: "Helps us understand how visitors use the site so we can improve it.",
  },
  {
    key: "marketing",
    title: "Marketing",
    description: "Used to measure how well our campaigns work and tailor what we show you elsewhere.",
  },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="h-5 w-9 rounded-full bg-secondary-200 transition-colors peer-checked:bg-primary-500" />
      <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
    </label>
  );
}

/**
 * Cookie consent banner + preferences modal, mounted once in Layout so it
 * persists across route changes. Shows the banner only until a decision is
 * stored; after that, the footer's "Cookie Preferences" link (via
 * openCookiePreferences) is the only way back into the preferences modal.
 */
export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [draft, setDraft] = useState<Consent>(defaultDraft);

  useEffect(() => {
    const stored = readStoredConsent();
    setConsent(stored);
    setBannerVisible(!stored);
  }, []);

  useEffect(() => {
    return onOpenCookiePreferences(() => {
      setDraft(consent ?? defaultDraft);
      setPrefsOpen(true);
    });
  }, [consent]);

  function applyAndClose(next: Consent) {
    writeStoredConsent(next);
    setConsent(next);
    setBannerVisible(false);
    setPrefsOpen(false);
  }

  function openPreferences() {
    setDraft(consent ?? defaultDraft);
    setPrefsOpen(true);
  }

  return (
    <>
      {bannerVisible && (
        <div className="fixed inset-x-0 bottom-0 z-[900] border-t border-secondary-100 bg-white px-4 py-5 shadow-[0_-10px_30px_-10px_rgba(13,23,56,0.15)] sm:px-10 xl:px-20">
          <div className="mx-auto flex max-w-[1920px] flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-relaxed text-body">
              We use cookies to run this site and, with your permission, to understand how it&rsquo;s used and
              improve it. Accept all, reject anything non-essential, or choose exactly what you&rsquo;re comfortable
              with.
            </p>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openPreferences}
                className="text-sm font-medium text-primary-500 underline underline-offset-2 hover:text-primary-600"
              >
                Preferences
              </button>
              <Button
                variant="secondary"
                onClick={() => applyAndClose({ necessary: true, analytics: false, marketing: false })}
                className="px-5 py-2.5 text-[13px] font-semibold"
              >
                Reject non-essential
              </Button>
              <Button
                variant="primary"
                onClick={() => applyAndClose({ necessary: true, analytics: true, marketing: true })}
                className="px-5 py-2.5 text-[13px] font-semibold"
              >
                Accept all
              </Button>
            </div>
          </div>
        </div>
      )}

      {prefsOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-secondary-900/50 px-4 py-8 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPrefsOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-prefs-title"
            className="relative w-full max-w-lg rounded-2xl border border-secondary-100 bg-white p-6 shadow-2xl shadow-secondary-900/20 sm:p-8"
          >
            <IconButton
              icon={CloseIcon}
              aria-label="Close"
              variant="subtle"
              size="sm"
              onClick={() => setPrefsOpen(false)}
              className="absolute right-4 top-4"
            />

            <h2 id="cookie-prefs-title" className="font-display text-h3 font-semibold text-heading">
              Cookie preferences
            </h2>
            <p className="mt-1.5 text-sm text-body">
              Choose which categories of cookies you&rsquo;re comfortable with. Necessary cookies keep the site
              working and can&rsquo;t be turned off.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start justify-between gap-4 rounded-lg border border-secondary-100 p-4">
                <div>
                  <p className="text-sm font-semibold text-heading">Necessary</p>
                  <p className="mt-1 text-xs leading-relaxed text-caption">
                    Required for core functionality like navigation and security. Always on.
                  </p>
                </div>
                <span className="mt-0.5 shrink-0 rounded-full bg-secondary-100 px-2.5 py-1 text-xs font-medium text-caption">
                  Always on
                </span>
              </div>

              {categories.map(({ key, title, description }) => (
                <div
                  key={key}
                  className="flex items-start justify-between gap-4 rounded-lg border border-secondary-100 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-heading">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-caption">{description}</p>
                  </div>
                  <Toggle
                    checked={draft[key]}
                    onChange={(checked) => setDraft((d) => ({ ...d, [key]: checked }))}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => applyAndClose({ necessary: true, analytics: false, marketing: false })}
                className="text-[13px] font-semibold"
              >
                Reject non-essential
              </Button>
              <Button
                variant="primary"
                onClick={() => applyAndClose(draft)}
                className="text-[13px] font-semibold"
              >
                Save preferences
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
