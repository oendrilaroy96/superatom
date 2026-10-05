import { Outlet } from "react-router-dom";
import Header from "./Header";
import CtaSection from "./CtaSection";
import Footer from "./Footer";

/** Shared chrome (header, background decoration, footer) around every routed page. */
export default function Layout() {
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
          instead of being hard-clipped at the CTA section's own edge. */}
      <div className="relative overflow-hidden bg-secondary-500">
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
