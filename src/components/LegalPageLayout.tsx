import { useEffect, useRef, useState, type ReactNode } from "react";
import SectionHeading from "./ui/SectionHeading";
import { useDarkTransition } from "../context/DarkTransitionContext";

export type LegalTocItem = { id: string; label: string };

/**
 * Wraps a numbered section of a legal document so it crossfades (+ a small
 * rise) into place the first time it scrolls into view, instead of popping
 * in with the rest of the page. Carries the section's anchor id, so the
 * sidebar/TOC and scrollspy in LegalPageLayout keep targeting it directly.
 */
export function LegalSection({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id={id}
      ref={ref}
      className={`mt-10 scroll-mt-28 transition-all duration-700 ease-out first:mt-0 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      {children}
    </div>
  );
}

type LegalPageLayoutProps = {
  eyebrow: string;
  heading: string;
  lastUpdated?: string;
  intro: ReactNode;
  sections: LegalTocItem[];
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * Shared chrome for long legal documents: a hero (title + intro) followed by
 * a sticky left-hand table of contents next to the numbered sections, with
 * scrollspy highlighting the section currently in view. Reused across
 * Privacy Policy, Terms of Service and any future legal page so they all
 * get the same navigation for free.
 */
export default function LegalPageLayout({
  eyebrow,
  heading,
  lastUpdated,
  intro,
  sections,
  children,
  footer,
}: LegalPageLayoutProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const contentRef = useRef<HTMLDivElement>(null);
  // Crossfades the whole document to dark in sync with the shared scroll
  // threshold used by Header/CtaSection/Footer (see DarkTransitionContext),
  // so a long page like this one hands off smoothly into the dark CTA
  // block at the bottom instead of cutting from light to dark at its edge.
  const isDark = useDarkTransition();

  useEffect(() => {
    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-112px 0px -70% 0px", threshold: 0 },
    );
    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <section
      className={`legal-doc py-[120px] transition-colors duration-700 ease-in-out ${
        isDark ? "legal-doc-dark bg-secondary-500" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            align="left"
            theme={isDark ? "dark" : "light"}
            eyebrow={eyebrow}
            eyebrowColor="primary"
            heading={heading}
            description={lastUpdated ? `Last updated: ${lastUpdated}` : undefined}
          />
          <div className="mt-10">{intro}</div>
        </div>

        <div className="mx-auto mt-14 max-w-6xl lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-16">
          <label className="block lg:hidden">
            <span className="sr-only">Jump to section</span>
            <select
              className={`w-full rounded-md border px-3.5 py-2.5 text-sm transition-colors duration-700 ease-in-out focus:outline-none focus:ring-2 ${
                isDark
                  ? "border-white/20 bg-white/5 text-white focus:border-primary-300 focus:ring-primary-300/30"
                  : "border-secondary-200 bg-white text-heading focus:border-primary-400 focus:ring-primary-500/30"
              }`}
              value={activeId}
              onChange={(e) => {
                document
                  .getElementById(e.target.value)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id} className="text-heading">
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <nav
            aria-label="Table of contents"
            className="sticky top-24 mt-10 hidden max-h-[calc(100vh-7rem)] overflow-y-auto pb-6 lg:mt-0 lg:block"
          >
            <p
              className={`text-xs font-semibold uppercase tracking-[0.5px] transition-colors duration-700 ease-in-out ${
                isDark ? "text-white/50" : "text-caption"
              }`}
            >
              On this page
            </p>
            <ul
              className={`mt-2.5 border-l transition-colors duration-700 ease-in-out ${
                isDark ? "border-white/10" : "border-secondary-100"
              }`}
            >
              {sections.map((s) => {
                const active = s.id === activeId;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`-ml-px block truncate border-l-2 py-1 pl-4 text-[13px] leading-tight transition-colors duration-700 ease-in-out ${
                        active
                          ? isDark
                            ? "border-primary-300 font-medium text-primary-300"
                            : "border-primary-500 font-medium text-primary-500"
                          : isDark
                            ? "border-transparent text-white/60 hover:border-white/20 hover:text-white"
                            : "border-transparent text-body hover:border-secondary-200 hover:text-heading"
                      }`}
                    >
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div ref={contentRef} className="mt-6 min-w-0 lg:mt-0">
            {children}
            {footer}
          </div>
        </div>
      </div>
    </section>
  );
}
