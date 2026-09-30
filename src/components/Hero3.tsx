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

/** Extra scroll distance (in viewport heights) giving the video room to travel fully off-screen while the text stays pinned. */
const SCROLL_VH = 120;
/** The pinned text fades out gradually across nearly the whole scroll run. */
const FADE_END = 0.9;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

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

/** Placeholder explanatory-video panel: thumbnail + play button, ready to wire up to a real source. */
function VideoCard() {
  return (
    <button
      type="button"
      className="group relative w-full overflow-hidden rounded-2xl border border-secondary-100 bg-secondary-500 text-left shadow-[0_30px_80px_-30px_rgba(13,23,56,0.45)]"
      style={{ aspectRatio: "16/10" }}
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
        <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-primary-500 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] transition-transform duration-200 group-hover:scale-110 sm:h-20 sm:w-20">
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

/**
 * Hero with an explanatory-video section: the video card stays pinned in
 * place (position: sticky) at a constant size, while the copy — plain
 * document-flow content below it, starting right where it looks now —
 * scrolls up behind it, fading out slowly as it goes. A scroll listener
 * logs the raw window.scrollY to the console for debugging/tuning
 * reference.
 */
export default function Hero3() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState(1);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? clamp01(-rect.top / total) : 0;
      setFade(1 - clamp01(progress / FADE_END));
      // eslint-disable-next-line no-console
      console.log("scrollY:", window.scrollY);
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

  const textStyle: CSSProperties = {
    opacity: fade,
    pointerEvents: fade < 0.05 ? "none" : undefined,
  };

  return (
    <>
      <section ref={sectionRef} className="relative" style={{ height: `calc(100vh + ${SCROLL_VH}vh)` }}>
        <div className="relative z-[1] pt-14" style={textStyle}>
          <HeroCopy />
        </div>
        <div className="sticky top-16 z-[2] mx-auto mt-10 w-full max-w-[900px] px-4">
          <VideoCard />
        </div>
      </section>
      <StatsRow />
    </>
  );
}
