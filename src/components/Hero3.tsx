import { useEffect, useRef, useState, type CSSProperties } from "react";
import { MdArrowForward, MdPlayArrow } from "react-icons/md";
import Button from "./ui/Button";

/** Extra scroll distance (px) beyond one viewport. Controls when the pinned video releases and scrolls away (releases at scrollY 680). */
const SCROLL_EXTRA_PX = 439;
/** Scroll distance (px) over which the pinned text fades out. */
const TEXT_FADE_DISTANCE = 260;
/** Once window.scrollY passes this, the video placeholder starts zooming in. */
const ZOOM_START_Y = 115;
/** Scroll distance (px) over which the zoom ramps up to ZOOM_MAX_SCALE. */
const ZOOM_RANGE = 400;
/** Maximum scale the video placeholder zooms in to. */
const ZOOM_MAX_SCALE = 1.35;
/** window.scrollY at which the video holds its max zoom before easing back out. */
const ZOOM_HOLD_END_Y = ZOOM_START_Y + ZOOM_RANGE + 20; // 535
/**
 * window.scrollY at which the video's sticky pin releases (matches
 * SCROLL_EXTRA_PX above). The zoom-out + fade-out below finish exactly here
 * so the card is back at scale 1 and fully transparent by release — its
 * painted box never grows past its layout box, so it can't visually
 * overlap How It Works as that section scrolls up from below.
 */
const RELEASE_Y = 680;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);

function HeroCopy() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
      <p className="mb-3 font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-primary-500">
        Decision intelligence for enterprises
      </p>
      <h1 className="hero2-heading m-0 mb-4 font-display font-bold leading-[1] tracking-[-0.02em] text-heading">
        <span className="block">Better decisions.</span>
        <span className="block whitespace-nowrap bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
          Every day. Every time.
        </span>
      </h1>
      <p className="mb-6 max-w-3xl text-[18px] leading-[1.55] text-body">
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
 * Hero with an explanatory-video section: the copy stays pinned in place
 * (position: sticky) and fades out slowly as you scroll, while the video
 * card scrolls up in front of it (higher z-index) until the card's own
 * position: sticky offset (top: 176px) catches it and it stays pinned
 * there. Once window.scrollY passes ZOOM_START_Y it zooms in to
 * ZOOM_MAX_SCALE, holds, then eases back to scale 1 while fading out as it
 * approaches RELEASE_Y (the sticky release point) — so by the time it
 * unsticks and How It Works scrolls up beneath it, the card is fully
 * transparent and back to its unscaled layout size, avoiding any visible
 * overlap between the two sections. A scroll listener logs the raw
 * window.scrollY to the console for debugging/tuning reference.
 */
export default function Hero3() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState(1);
  const [zoomScale, setZoomScale] = useState(1);
  const [videoFade, setVideoFade] = useState(1);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const fadeT = clamp01(window.scrollY / TEXT_FADE_DISTANCE);
      setFade(1 - fadeT);

      if (window.scrollY <= ZOOM_HOLD_END_Y) {
        const zoomT = clamp01((window.scrollY - ZOOM_START_Y) / ZOOM_RANGE);
        setZoomScale(lerp(1, ZOOM_MAX_SCALE, ease(zoomT)));
        setVideoFade(1);
      } else {
        const outT = clamp01(
          (window.scrollY - ZOOM_HOLD_END_Y) / (RELEASE_Y - ZOOM_HOLD_END_Y),
        );
        setZoomScale(lerp(ZOOM_MAX_SCALE, 1, ease(outT)));
        setVideoFade(1 - outT);
      }

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
  const videoStyle: CSSProperties = {
    transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined,
    transformOrigin: "center center",
    opacity: videoFade,
    pointerEvents: videoFade < 0.05 ? "none" : undefined,
  };

  return (
    <section ref={sectionRef} className="relative isolate" style={{ height: `calc(100vh + ${SCROLL_EXTRA_PX}px)` }}>
      <div className="sticky top-16 z-[1] pt-14" style={textStyle}>
        <HeroCopy />
      </div>
      <div className="sticky top-[176px] z-[2] mx-auto mt-16 w-full max-w-[900px] px-4" style={videoStyle}>
        <VideoCard />
      </div>
    </section>
  );
}
