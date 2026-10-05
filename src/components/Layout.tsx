import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { useLenis } from "lenis/react";
import Header from "./Header";
import CtaSection from "./CtaSection";
import Footer from "./Footer";

// Matches the page background (#f8fafd) and --color-secondary-500 (#0d1738).
const LIGHT_RGB: [number, number, number] = [248, 250, 253];
const DARK_RGB: [number, number, number] = [13, 23, 56];
// How much scroll distance (px) the light-to-dark fade plays out over, once
// the dark block's top edge reaches the bottom of the viewport.
const TRANSITION_DISTANCE = 400;

/** Shared chrome (header, background decoration, footer) around every routed page. */
export default function Layout() {
  const darkBlockRef = useRef<HTMLDivElement>(null);

  const updateDarkBlockBackground = () => {
    const el = darkBlockRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    const t = Math.min(1, Math.max(0, (window.innerHeight - top) / TRANSITION_DISTANCE));
    const [r, g, b] = LIGHT_RGB.map((c, i) => Math.round(c + (DARK_RGB[i] - c) * t));
    el.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    updateDarkBlockBackground();
    window.addEventListener("resize", updateDarkBlockBackground);
    return () => window.removeEventListener("resize", updateDarkBlockBackground);
  }, []);

  useLenis(() => updateDarkBlockBackground());

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

      {/* CTA + footer share one dark block so the glow fades across both
          instead of being hard-clipped at the CTA section's own edge. Its
          background color is driven by scroll position (see above) so the
          page fades from light to dark as it comes into view. */}
      <div ref={darkBlockRef} className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "radial-gradient(640px 420px at 15% 12%, rgba(83,58,253,0.3), transparent 55%), radial-gradient(640px 480px at 85% 48%, rgba(255,118,0,0.18), transparent 55%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <CtaSection />
          <Footer />
        </div>
      </div>
    </div>
  );
}
