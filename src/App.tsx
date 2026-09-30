import { ReactLenis } from "lenis/react";
import Header from "./components/Header";
import Hero3 from "./components/Hero3";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import Infrastructure from "./components/Infrastructure";

function App() {
  return (
    <ReactLenis root>
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
          <Hero3 />
          <HowItWorks />
          <Features />
          <Infrastructure />
        </main>
      </div>
    </ReactLenis>
  );
}

export default App;
