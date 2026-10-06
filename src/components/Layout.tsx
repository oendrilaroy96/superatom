import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { useLenis } from "lenis/react";
import Header from "./Header";
import CtaSection from "./CtaSection";
import Footer from "./Footer";

// Scroll position (px from the top of the page) where the light-to-dark
// reveal starts. Tuned to the homepage's current content height — if the
// content above the CTA section grows or shrinks substantially, this will
// need to be adjusted to match where the dark block actually scrolls in.
const TRANSITION_START_SCROLL = 4700;
// How much additional scroll distance (px) the reveal plays out over, once
// TRANSITION_START_SCROLL is reached.
const TRANSITION_DISTANCE = 800;

/** Shared chrome (header, background decoration, footer) around every routed page. */
export default function Layout() {
  const darkFillRef = useRef<HTMLDivElement>(null);

  // The fill keeps its full, un-blended secondary-500 color at all times;
  // scrolling only reveals more of it (a wipe from the top down), so there's
  // never a washed-out in-between tone the way a color cross-fade would give.
  const updateDarkBlockReveal = () => {
    const fill = darkFillRef.current;
    if (!fill) return;
    const t = Math.min(
      1,
      Math.max(0, (window.scrollY - TRANSITION_START_SCROLL) / TRANSITION_DISTANCE)
    );
    fill.style.clipPath = `inset(0 0 ${(1 - t) * 100}% 0)`;
  };

  useEffect(() => {
    updateDarkBlockReveal();
    window.addEventListener("resize", updateDarkBlockReveal);
    return () => window.removeEventListener("resize", updateDarkBlockReveal);
  }, []);

  useLenis(() => updateDarkBlockReveal());

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#f8fafd_0%,#ffffff_45%,#f8fafd_100%)]">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(1200px 900px at 82% 4%, rgba(83,58,253,0.07), transparent 55%), radial-gradient(1000px 800px at 15% 55%, rgba(255,118,0,0.05), transparent 50%), radial-gradient(1100px 800px at 80% 95%, rgba(83,58,253,0.06), transparent 55%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(13,23,56,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(13,23,56,0.018) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "linear-gradient(180deg, transparent 0%, white 4%, white 96%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, white 4%, white 96%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <Header />
      <main className="relative z-10">
        <Outlet />
      </main>

      {/* CTA + footer share one dark block. The solid secondary-500 fill
          (plus its glow) is wiped into view from the top down as the block
          scrolls in (see updateDarkBlockReveal above), instead of fading
          through blended in-between colors. */}
      <div className="relative overflow-hidden">
        <div
          ref={darkFillRef}
          className="absolute inset-0 bg-secondary-500"
          style={{ clipPath: "inset(0 0 100% 0)" }}
        >
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage:
                "radial-gradient(640px 420px at 15% 12%, rgba(83,58,253,0.3), transparent 55%), radial-gradient(640px 480px at 85% 48%, rgba(255,118,0,0.18), transparent 55%)",
            }}
            aria-hidden="true"
          />
        </div>
        <div className="relative z-10">
          <CtaSection />
          <Footer />
        </div>
      </div>
    </div>
  );
}
