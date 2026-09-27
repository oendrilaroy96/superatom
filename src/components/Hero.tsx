import { lazy, Suspense } from "react";

const HeroScene = lazy(() => import("./HeroScene"));

function StatIcon({ path }: { path: string }) {
  return (
    <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[9px] bg-primary-100 text-primary-500">
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: path }}
      />
    </span>
  );
}

function ScenePlaceholder() {
  return (
    <div className="min-h-[280px] w-full animate-pulse rounded-[18px] bg-primary-100/40 max-lg:hidden lg:h-full lg:min-h-0" />
  );
}

export default function Hero() {
  return (
    <section className="relative flex flex-col overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafd_100%)] lg:h-[calc(100vh-4rem)]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(1100px 620px at 82% 8%, rgba(83,58,253,0.07), transparent 60%), radial-gradient(900px 520px at 18% 92%, rgba(255,118,0,0.06), transparent 55%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(#edf1f7 1px, transparent 1px), linear-gradient(90deg, #edf1f7 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(1200px 700px at 70% 20%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(1200px 700px at 70% 20%, black 0%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-[2] mx-auto flex w-full max-w-[1320px] flex-1 flex-col gap-4 px-6 pt-6 sm:pt-8 lg:min-h-0 lg:gap-6">
        <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
          <p className="mb-3 font-sans text-[11.5px] font-medium uppercase tracking-[0.16em] text-muted">
            Decision intelligence for the supply chain
          </p>
          <h1 className="m-0 mb-3 font-display text-[34px] font-bold leading-[1.08] tracking-[-0.02em] text-heading sm:text-[44px] lg:text-[52px]">
            Decision Intelligence for the{" "}
            <span className="bg-gradient-to-r from-accent-500 to-primary-500 bg-clip-text text-transparent">
              Supply Chain.
            </span>
          </h1>
          <p className="mb-5 max-w-[52ch] text-base leading-[1.55] text-body">
            Make, automate and execute thousands of better decisions across
            the supply chain.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2.5 rounded-[10px] bg-accent-500 px-[22px] py-[13px] text-[14.5px] font-bold text-secondary-800 shadow-[0_10px_30px_-10px_rgba(255,118,0,0.35)] transition-transform hover:-translate-y-px"
          >
            Explore the Platform
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        <div className="w-full lg:min-h-0 lg:flex-1">
          <Suspense fallback={<ScenePlaceholder />}>
            <HeroScene />
          </Suspense>
        </div>
      </div>

      <div className="relative z-[2] mx-auto flex w-full max-w-[1320px] flex-wrap gap-8 border-t border-secondary-100 px-6 pb-5 pt-5">
        <div className="flex min-w-[150px] items-center gap-3">
          <StatIcon path='<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/>' />
          <span className="text-[13.5px] font-semibold leading-tight text-body">
            Faster
            <br />
            decisions
          </span>
        </div>
        <div className="flex min-w-[150px] items-center gap-3">
          <StatIcon path='<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>' />
          <span className="text-[13.5px] font-semibold leading-tight text-body">
            Lower
            <br />
            costs
          </span>
        </div>
        <div className="flex min-w-[150px] items-center gap-3">
          <StatIcon path='<path d="M4 20V10M11 20V4M18 20v-7"/>' />
          <span className="text-[13.5px] font-semibold leading-tight text-body">
            Better
            <br />
            service levels
          </span>
        </div>
        <div className="flex min-w-[150px] items-center gap-3">
          <StatIcon path='<path d="M12 2l8 3.5V11c0 5.2-3.4 9.3-8 11-4.6-1.7-8-5.8-8-11V5.5L12 2Z"/><path d="m9 12 2 2 4-4"/>' />
          <span className="text-[13.5px] font-semibold leading-tight text-body">
            A more resilient
            <br />
            supply chain
          </span>
        </div>
      </div>
    </section>
  );
}
