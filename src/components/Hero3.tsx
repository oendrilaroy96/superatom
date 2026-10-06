import { useEffect, useRef, useState, type CSSProperties } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Button from "./ui/Button";

/** Extra scroll distance (px) beyond one viewport, controlling how far you scroll before the pin releases and the next section scrolls up into view. */
const SCROLL_EXTRA_PX = 959;
/** Scroll distance (px) over which the pinned text fades out. */
const TEXT_FADE_DISTANCE = 260;
/** Once window.scrollY passes this, the video placeholder starts zooming in. */
const ZOOM_START_Y = 115;
/** Scroll distance (px) over which the zoom ramps up to ZOOM_MAX_SCALE. */
const ZOOM_RANGE = 400;
/** Maximum scale the video placeholder zooms in to. */
const ZOOM_MAX_SCALE = 1.35;
/**
 * Gap (px) between this section and the next. The zoomed-in video's painted
 * box is taller than its layout box (CSS transform: scale() doesn't affect
 * layout), so without this gap the next section's top edge scrolls up
 * underneath the still-visible, still-zoomed video. This pushes the next
 * section down by more than that overflow, closing the gap with room to spare.
 */
const SECTION_GAP_PX = 110;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);

function HeroCopy() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
      <p className="mb-3 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-secondary-300">
        Decision intelligence for enterprises
      </p>
      <h1 className="hero2-heading m-0 mb-4 font-display font-semibold leading-[1.08] tracking-[-0.02em] text-heading">
        <span className="block">Decide Fast, Decide Right,</span>
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #533afd 0%, #873eff 33%, #ff7eb0 66%, #ff7600 100%)",
            WebkitBoxDecorationBreak: "clone",
            boxDecorationBreak: "clone",
          }}
        >
          Every time
        </span>
      </h1>
      <p className="mb-6 max-w-3xl text-[18px] leading-[1.55] text-body">
        Superatom AI connects and synchronizes data across enterprise
        system of records (ERP&rsquo;s) and Data systems, to create a
        unified intelligence layer. It delivers actionable insights and
        intelligence, and enables you to execute the decisions through
        workflows.
      </p>
      <Button
        href="#"
        variant="primary"
        iconRight={<ArrowForwardIcon style={{ fontSize: 18 }} />}
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
          <PlayArrowIcon style={{ fontSize: 32 }} className="translate-x-0.5" />
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
 * card scrolls up in front of it (higher z-index) until window.scrollY
 * reaches ~308, at which point the card's own position: sticky offset
 * (top: 176px) catches it and it stays pinned there. Once window.scrollY
 * passes ZOOM_START_Y (115, before the card sticks), the card also starts
 * zooming in, scaling up to ZOOM_MAX_SCALE over the next ZOOM_RANGE px of
 * scroll — this continues seamlessly through the point where it goes
 * sticky, since the zoom is driven by window.scrollY regardless of the
 * card's own position scheme. A scroll listener logs the raw
 * window.scrollY to the console for debugging/tuning reference.
 */
export default function Hero3() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState(1);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const fadeT = clamp01(window.scrollY / TEXT_FADE_DISTANCE);
      setFade(1 - fadeT);

      const zoomT = clamp01((window.scrollY - ZOOM_START_Y) / ZOOM_RANGE);
      setZoomScale(lerp(1, ZOOM_MAX_SCALE, ease(zoomT)));

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
    transform: zoomScale > 1 ? `scale(${zoomScale})` : undefined,
    transformOrigin: "center center",
  };

  return (
    <>
      <section ref={sectionRef} className="relative isolate" style={{ height: `calc(100vh + ${SCROLL_EXTRA_PX}px)` }}>
        <div className="sticky top-16 z-[1] pt-14" style={textStyle}>
          <HeroCopy />
        </div>
        <div className="sticky top-[176px] z-[2] mx-auto mt-16 w-full max-w-[900px] px-4" style={videoStyle}>
          <VideoCard />
        </div>
      </section>
      <div aria-hidden="true" style={{ height: SECTION_GAP_PX }} />
    </>
  );
}
