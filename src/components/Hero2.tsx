import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BoltIcon from "@mui/icons-material/Bolt";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShieldIcon from "@mui/icons-material/Shield";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import type { IconComponent } from "../types/icon";
import Button from "./ui/Button";

/** Horizontal gutter that scales continuously with the viewport instead of stepping at breakpoints or capping at a fixed max-width. */
const FLUID_PAD = "px-[max(16px,5%)]";

function StatIcon({ Icon }: { Icon: IconComponent }) {
  return (
    <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-md bg-primary-100 text-primary-500">
      <Icon style={{ fontSize: 18 }} />
    </span>
  );
}

function StatsRow() {
  return (
    <div
      className={`relative z-[2] mt-auto grid w-full grid-cols-2 gap-x-6 gap-y-6 border-t border-secondary-100 ${FLUID_PAD} pb-11 pt-9 sm:grid-cols-4 sm:gap-x-8`}
    >
      <div className="flex items-center gap-3">
        <StatIcon Icon={BoltIcon} />
        <span className="text-[13.5px] font-semibold leading-tight text-body">
          Faster decisions
        </span>
      </div>
      <div className="flex items-center gap-3">
        <StatIcon Icon={TrendingDownIcon} />
        <span className="text-[13.5px] font-semibold leading-tight text-body">
          Lower costs
        </span>
      </div>
      <div className="flex items-center gap-3">
        <StatIcon Icon={TrendingUpIcon} />
        <span className="text-[13.5px] font-semibold leading-tight text-body">
          Better service levels
        </span>
      </div>
      <div className="flex items-center gap-3">
        <StatIcon Icon={ShieldIcon} />
        <span className="text-[13.5px] font-semibold leading-tight text-body">
          A more resilient supply chain
        </span>
      </div>
    </div>
  );
}

function HeroCopy() {
  return (
    <div className="flex flex-col">
      <p className="mb-3 font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-primary-500">
        Decision intelligence for enterprises
      </p>
      <h1 className="hero2-heading m-0 mb-4 font-display font-bold leading-[1.08] tracking-[-0.02em] text-heading">
        <span className="block">Better decisions.</span>
        <span className="block whitespace-nowrap bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
          Every day. Every time.
        </span>
      </h1>
      <p className="mb-6 max-w-[520px] text-[18px] leading-[1.55] text-body">
        Turn enterprise data into real-time intelligence and make instant,
        AI-powered decisions. Built for teams that move fast, without
        compromising security, governance or existing integrations.
      </p>
      <div>
        <Button
          href="#"
          variant="primary"
          iconRight={<ArrowForwardIcon style={{ fontSize: 18 }} />}
          className="shadow-[0_10px_30px_-10px_rgba(83,58,253,0.35)] transition-transform hover:-translate-y-px"
        >
          Explore the Platform
        </Button>
      </div>
    </div>
  );
}

/** Placeholder explanatory-video panel: thumbnail + play button, ready to wire up to a real source. */
function VideoThumb() {
  return (
    <button
      type="button"
      aria-label="Play explanatory video: How Superatom AI works"
      className="group relative w-full overflow-hidden rounded-2xl border border-secondary-100 bg-secondary-500 text-left shadow-[0_30px_60px_-30px_rgba(13,23,56,0.35)]"
      style={{ aspectRatio: "4/3" }}
    >
      {/* Thumbnail background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(680px 420px at 20% 15%, rgba(83,58,253,0.55), transparent 60%), radial-gradient(560px 420px at 85% 90%, rgba(255,118,0,0.35), transparent 55%), linear-gradient(160deg, #0d1738 0%, #101d45 55%, #0d1738 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-primary-500 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] transition-transform duration-200 group-hover:scale-110 sm:h-20 sm:w-20">
          <PlayArrowIcon style={{ fontSize: 32 }} className="translate-x-0.5" />
        </span>
      </div>

      {/* Caption overlay */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/55 to-transparent px-5 py-4 sm:px-6 sm:py-5">
        <span className="font-display text-[14px] font-semibold text-white sm:text-[15px]">
          See how Superatom AI works
        </span>
        <span className="shrink-0 rounded-md bg-black/35 px-2 py-1 font-display text-[11px] font-semibold tracking-wide text-white">
          2:14
        </span>
      </div>
    </button>
  );
}

/**
 * Alternate Hero with an explanatory-video section, side-by-side with the
 * existing Hero copy and CTA in place of the animated supply-chain diagram.
 * The container is fluid (no fixed max-width) so it scales continuously
 * with the viewport instead of capping out on large screens.
 */
export default function Hero2() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden">
      <div
        className={`relative z-[2] grid w-full grid-cols-1 items-center gap-10 ${FLUID_PAD} pb-4 pt-10 sm:pt-14 lg:grid-cols-[1fr_1.15fr] lg:gap-14`}
      >
        <HeroCopy />
        <VideoThumb />
      </div>
      <StatsRow />
    </section>
  );
}
