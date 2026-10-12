export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export const defaultCookieConsent: CookieConsent = { necessary: true, analytics: false, marketing: false };

const STORAGE_KEY = "cookie-consent";
// The one channel the footer's "Cookie Preferences" link uses to reopen the
// preferences modal: it's mounted once in Layout (so the banner survives
// route changes), while the footer link lives in a different component tree
// with no direct line to it, so a plain window event is simpler than
// threading the trigger through props or a context just for this.
const OPEN_EVENT = "open-cookie-preferences";

export function readStoredConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    return { necessary: true, analytics: !!parsed.analytics, marketing: !!parsed.marketing };
  } catch {
    // Storage can throw (private browsing, blocked) — treated the same as
    // "no decision yet" rather than failing the whole page.
    return null;
  }
}

export function writeStoredConsent(consent: CookieConsent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // If storage isn't available the banner just reappears next visit,
    // which is an acceptable fallback rather than something to surface.
  }
}

export function onOpenCookiePreferences(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}

/** Dispatched by the footer's "Cookie Preferences" link to reopen the preferences modal after the initial decision. */
export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}
