import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useLenis } from "lenis/react";
import Header from "./Header";
import CtaSection from "./CtaSection";
import Footer from "./Footer";
import { DarkTransitionContext } from "../context/DarkTransitionContext";

// Scroll position (px from the top of the page) where the background
// switches to dark. Tuned to the homepage's current content height — if the
// content above the CTA section grows or shrinks substantially, this will
// need to be adjusted to match where the dark block actually scrolls in.
const TRANSITION_START_SCROLL = 4700;

/** Shared chrome (header, background decoration, footer) around every routed page. */
export default function Layout() {
  const [isDark, setIsDark] = useState(false);

  // Below the threshold the fill is fully transparent; at the threshold it
  // crossfades to full opacity all at once (like a light switch), rather
  // than wiping into view progressively as you scroll further.
  const updateDarkBlockReveal = () => {
    setIsDark(window.scrollY >= TRANSITION_START_SCROLL);
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
      <DarkTransitionContext.Provider value={isDark}>
        <Header />
        <main className="relative z-10">
          <Outlet />
        </main>
      </DarkTransitionContext.Provider>

      {/* CTA + footer share this single bg-secondary-500 paint rather than
          each painting their own separate instance of the same color — two
          independently painted "identical" flat colors can render a couple
          of RGB units apart at their shared edge, visible as a faint seam.
          CtaSection's own background crossfades to transparent once isDark
          flips true (see updateDarkBlockReveal above), letting this shared
          dark fill show through; footer stays permanently dark. */}
      <div className="bg-secondary-500">
        <DarkTransitionContext.Provider value={isDark}>
          <CtaSection />
        </DarkTransitionContext.Provider>
        <Footer />
      </div>
    </div>
  );
}
