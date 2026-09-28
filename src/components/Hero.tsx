import { lazy, Suspense } from "react";
import type { IconType } from "react-icons";
import { MdArrowForward, MdBolt, MdTrendingDown, MdTrendingUp, MdShield } from "react-icons/md";
import Button from "./ui/Button";

const HeroScene = lazy(() => import("./HeroScene"));

function StatIcon({ Icon }: { Icon: IconType }) {
  return (
    <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-md bg-primary-100 text-primary-500">
      <Icon size={18} />
    </span>
  );
}

function ScenePlaceholder() {
  return (
    <div className="aspect-[16/11.6] max-h-[500px] w-full animate-pulse rounded-[18px] bg-primary-100/40 max-lg:hidden" />
  );
}

export default function Hero() {
  return (
    <section className="relative flex flex-col overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafd_100%)]">
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

      <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pt-10 sm:px-10 sm:pt-14 lg:gap-10 xl:px-20">
        <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
          <p className="text-h5 mb-3 font-sans uppercase tracking-[0.5px] text-muted">
            Decision intelligence for the supply chain
          </p>
          <h1 className="m-0 mb-3 font-display text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-heading sm:text-[32px] sm:leading-[1.3] lg:text-h1">
            Decision Intelligence for the{" "}
            <span className="text-primary-500">Supply Chain.</span>
          </h1>
          <p className="text-p mb-5 max-w-[52ch] text-body">
            Make, automate and execute thousands of better decisions across
            the supply chain.
          </p>
          <Button
            href="#"
            variant="accent"
            iconRight={<MdArrowForward size={18} />}
            className="shadow-[0_10px_30px_-10px_rgba(255,118,0,0.35)] transition-transform hover:-translate-y-px"
          >
            Explore the Platform
          </Button>
        </div>

        <div className="w-full">
          <Suspense fallback={<ScenePlaceholder />}>
            <HeroScene />
          </Suspense>
        </div>
      </div>

      <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-wrap gap-8 border-t border-secondary-100 px-4 pb-11 pt-9 sm:px-10 xl:px-20">
        <div className="flex min-w-[150px] items-center gap-3">
          <StatIcon Icon={MdBolt} />
          <span className="text-[13.5px] font-semibold leading-tight text-body">
            Faster
            <br />
            decisions
          </span>
        </div>
        <div className="flex min-w-[150px] items-center gap-3">
          <StatIcon Icon={MdTrendingDown} />
          <span className="text-[13.5px] font-semibold leading-tight text-body">
            Lower
            <br />
            costs
          </span>
        </div>
        <div className="flex min-w-[150px] items-center gap-3">
          <StatIcon Icon={MdTrendingUp} />
          <span className="text-[13.5px] font-semibold leading-tight text-body">
            Better
            <br />
            service levels
          </span>
        </div>
        <div className="flex min-w-[150px] items-center gap-3">
          <StatIcon Icon={MdShield} />
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
