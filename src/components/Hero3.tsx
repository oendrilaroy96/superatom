import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  MdArrowForward,
  MdBolt,
  MdTrendingDown,
  MdTrendingUp,
  MdShield,
  MdPlayArrow,
} from "react-icons/md";
import type { IconType } from "react-icons";
import Button from "./ui/Button";

const FLUID_PAD = "px-[max(16px,5%)]";

/** Extra scroll distance (in viewport heights) that drives the pin-and-zoom, on top of the initial 100vh. */
const SCROLL_VH = 200;
/** Text fades out over the first 26% of scroll progress through the pin. */
const FADE_END = 0.26;
/** The card grows from its initial card size to fill the viewport (edge-to-edge, no radius) by this point. */
const FILL_END = 0.5;
/** After filling the viewport, the card holds at that size until this point... */
const HOLD_END = 0.7;
/** ...then, from HOLD_END to 1, it zooms in further (scales past 100%, cropping inward). */
const ZOOM_SCALE = 1.3;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);

function StatIcon({ Icon }: { Icon: IconType }) {
  return (
    <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-md bg-primary-100 text-primary-500">
      <Icon size={18} />
    </span>
  );
}

function StatsRow() {
  return (
    <div
      className={`relative z-[2] grid w-full grid-cols-2 gap-x-6 gap-y-6 border-t border-secondary-100 ${FLUID_PAD} pb-11 pt-9 sm:grid-cols-4 sm:gap-x-8`}
    >
      <div className="flex items-center gap-3">
        <StatIcon Icon={MdBolt} />
        <span className="text-[13.5px] font-semibold leading-tight text-body">
          Faster decisions
        </span>
      </div>
      <div className="flex items-center gap-3">
        <StatIcon Icon={MdTrendingDown} />
        <span className="text-[13.5px] font-semibold leading-tight text-body">
          Lower costs
        </span>
      </div>
      <div className="flex items-center gap-3">
        <StatIcon Icon={MdTrendingUp} />
        <span className="text-[13.5px] font-semibold leading-tight text-body">
          Better service levels
        </span>
      </div>
      <div className="flex items-center gap-3">
        <StatIcon Icon={MdShield} />
        <span className="text-[13.5px] font-semibold leading-tight text-body">
          A more resilient supply chain
        </span>
      </div>
    </div>
  );
}

function HeroCopy() {
  return (
    <div className="mx-auto flex max-w-[720px] flex-col items-center px-4 text-center">
      <p className="mb-3 font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-primary-500">
        Decision intelligence for enterprises
      </p>
      <h1 className="hero2-heading m-0 mb-4 font-display font-bold leading-[1.08] tracking-[-0.02em] text-heading">
        <span className="block">Better decisions.</span>
        <span className="block whitespace-nowrap bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
          Every day. Every time.
        </span>
      </h1>
      <p className="mb-6 max-w-[560px] text-[18px] leading-[1.55] text-body">
        Turn enterprise data into real-time intelligence and make instant,
        AI-powered decisions. Built for teams that move fast, without
        compromising security, governance or existing integrations.
      </p>
      <Button
        href="#"
        variant="primary"
        iconRight={<MdArrowForward size={18} />}
        className="shadow-[0_10px_30px_-10px_rgba(83,58,253,0.35)] transition-transform hover:-translate-y-px"
      >
        Explore the Platform
      </Button>
    </div>
  );
}

/** The placeholder explanatory-video visual, styled inline so its size/position/radius can be scroll-driven. */
function VideoCard({ style }: { style: CSSProperties }) {
  return (
    <button
      type="button"
      className="absolute overflow-hidden border border-secondary-100 bg-secondary-500 text-left shadow-[0_30px_80px_-30px_rgba(13,23,56,0.45)]"
      style={style}
      aria-label="Play explanatory video: How Superatom AI works"
    >
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
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-primary-500 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] sm:h-20 sm:w-20">
          <MdPlayArrow size={32} className="translate-x-0.5" />
        </span>
      </div>
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

/** Static fallback for mobile/tablet and prefers-reduced-motion: content stacked normally, no scroll pin. */
function StaticHero() {
  return (
    <section className="relative flex flex-col overflow-hidden pt-14">
      <HeroCopy />
      <div className="mx-auto mt-10 w-full max-w-[720px] px-4">
        <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "16/10" }}>
          <VideoCard style={{ inset: 0 }} />
        </div>
      </div>
      <div className="mt-12">
        <StatsRow />
      </div>
    </section>
  );
}

/** Scroll-pinned hero: copy fades out while the video card grows to fill the viewport. */
function ZoomHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [viewport, setViewport] = useState({ w: 1440, h: 900 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp01(-rect.top / total) : 0;
      setProgress(p);
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    const onScrollOrResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  const fadeT = clamp01(progress / FADE_END);
  const textStyle: CSSProperties = {
    opacity: 1 - fadeT,
    transform: `translateY(${lerp(0, -28, fadeT)}px)`,
  };

  // Phase 1 (0 -> FILL_END): card grows from its initial size to fill the viewport.
  const fillT = ease(clamp01(progress / FILL_END));
  // Phase 2 (FILL_END -> HOLD_END): holds at the filled size, no further change.
  // Phase 3 (HOLD_END -> 1): zooms in further via transform scale, cropping inward.
  const zoomT = ease(clamp01((progress - HOLD_END) / (1 - HOLD_END)));
  const scale = lerp(1, ZOOM_SCALE, zoomT);

  const cardW0 = Math.min(1040, viewport.w * 0.86);
  const cardH0 = cardW0 * (10 / 16);
  const left0 = (viewport.w - cardW0) / 2;
  const top0 = viewport.h * 0.64;

  const cardStyle: CSSProperties = {
    left: lerp(left0, 0, fillT),
    top: lerp(top0, 0, fillT),
    width: lerp(cardW0, viewport.w, fillT),
    height: lerp(cardH0, viewport.h, fillT),
    borderRadius: lerp(20, 0, fillT),
    transform: scale > 1 ? `scale(${scale})` : undefined,
    transformOrigin: "center center",
  };

  return (
    <>
      <section ref={sectionRef} className="relative" style={{ height: `calc(100vh + ${SCROLL_VH}vh)` }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className={`relative z-[2] w-full ${FLUID_PAD} pt-[14vh]`} style={textStyle}>
            <HeroCopy />
          </div>
          <VideoCard style={{ position: "absolute", ...cardStyle }} />
        </div>
      </section>
      <StatsRow />
    </>
  );
}

/**
 * Cinematic Hero variant: the copy and explanatory-video placeholder start
 * centered, then as the user scrolls the copy fades while the video card
 * scales up to fill the viewport — a pinned scroll-scrub effect. Falls back
 * to a static stacked layout below the lg breakpoint and for
 * prefers-reduced-motion, since scroll-hijacking effects don't translate
 * well to touch scrolling.
 */
export default function Hero3() {
  const [useZoom, setUseZoom] = useState(false);

  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setUseZoom(mqDesktop.matches && !mqMotion.matches);
    update();
    mqDesktop.addEventListener("change", update);
    mqMotion.addEventListener("change", update);
    return () => {
      mqDesktop.removeEventListener("change", update);
      mqMotion.removeEventListener("change", update);
    };
  }, []);

  return useZoom ? <ZoomHero /> : <StaticHero />;
}
