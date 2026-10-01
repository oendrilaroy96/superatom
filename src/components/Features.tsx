import { useEffect, useLayoutEffect, useRef, useState } from "react";
import DnsIcon from "@mui/icons-material/Dns";
import ShieldIcon from "@mui/icons-material/Shield";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import HubIcon from "@mui/icons-material/Hub";
import TimelineIcon from "@mui/icons-material/Timeline";
import TuneIcon from "@mui/icons-material/Tune";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { IconComponent } from "../types/icon";
import SectionHeading from "./ui/SectionHeading";

const features: { title: string; desc: string; Icon: IconComponent }[] = [
  {
    title: "On-Premise Deployment",
    desc: "Deploy the platform within existing infrastructure to keep data in-house and retain complete control over access and security.",
    Icon: DnsIcon,
  },
  {
    title: "SOC 2 & ISO Ready",
    desc: "Enterprise-grade security controls with ISO 27001:2022 and SOC 2 Type I compliance, with continuous testing and monitoring.",
    Icon: ShieldIcon,
  },
  {
    title: "Tribal Knowledge",
    desc: "Capture unwritten rules, past lessons and operational realities to deliver answers that reflect how the business truly works.",
    Icon: AutoStoriesIcon,
  },
  {
    title: "Semantic Modeling",
    desc: "Automatically connects and models relationships across multiple enterprise data systems, creating a unified graph of your business.",
    Icon: HubIcon,
  },
  {
    title: "Workflows",
    desc: "Automate repeatable analysis and actions to deliver the right insights to the right people at the right time.",
    Icon: TimelineIcon,
  },
  {
    title: "Optimization Engine",
    desc: "The engine recommends the best course of action for complex business decisions, within real-world constraints.",
    Icon: TuneIcon,
  },
  {
    title: "Generative UI",
    desc: "User interfaces are dynamically generated based on context, significantly reducing cognitive overhead when exploring complex data.",
    Icon: AutoAwesomeIcon,
  },
];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function FeatureItem({ f, inView }: { f: (typeof features)[number]; inView: boolean }) {
  return (
    <div className="flex w-[280px] flex-none flex-col items-start sm:w-[320px]">
      <span className="relative z-[1] mb-6 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-primary-500 shadow-[0_10px_25px_-8px_rgba(0,0,0,0.4)]">
        <f.Icon style={{ fontSize: 24 }} />
      </span>
      <p
        className={`text-h4 font-display font-semibold transition-colors duration-700 ${inView ? "text-white" : "text-heading"}`}
      >
        {f.title}
      </p>
      <p
        className={`mt-1.5 text-xs leading-relaxed transition-colors duration-700 ${inView ? "text-white/65" : "text-caption"}`}
      >
        {f.desc}
      </p>
    </div>
  );
}

/**
 * The section's own background eases from the page's light background to
 * the site's dark navy as it scrolls into view (and back on the way out),
 * so the theme change reads as automatic rather than a hard cut at the
 * section boundary. Below that, the feature row is pinned (position:
 * sticky) while its own tall wrapper scrolls underneath, and translateX
 * tracks that scroll 1:1 so the items travel horizontally along a fixed
 * connecting line as you scroll down — released back into normal
 * document flow once the row has fully passed.
 */
export default function Features() {
  const bgSectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const [inView, setInView] = useState(false);
  const [scrollJack, setScrollJack] = useState(false);
  const [scrollExtra, setScrollExtra] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  useEffect(() => {
    const el = bgSectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "-10% 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll-jack (pin + horizontal translate) only for wider viewports and
  // when the visitor hasn't asked to reduce motion; otherwise the row falls
  // back to a plain horizontally-scrollable strip.
  useEffect(() => {
    const widthMq = window.matchMedia("(min-width: 640px)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setScrollJack(widthMq.matches && !motionMq.matches);
    update();
    widthMq.addEventListener("change", update);
    motionMq.addEventListener("change", update);
    return () => {
      widthMq.removeEventListener("change", update);
      motionMq.removeEventListener("change", update);
    };
  }, []);

  useLayoutEffect(() => {
    if (!scrollJack) {
      setScrollExtra(0);
      return;
    }
    const container = containerRef.current;
    const row = rowRef.current;
    if (!container || !row) return;
    const measure = () => {
      setScrollExtra(Math.max(0, row.scrollWidth - container.clientWidth));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    ro.observe(row);
    measure();
    return () => ro.disconnect();
  }, [scrollJack]);

  useEffect(() => {
    if (!scrollJack || scrollExtra <= 0) {
      setOffsetX(0);
      return;
    }
    const pin = pinRef.current;
    if (!pin) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = pin.getBoundingClientRect();
      const progress = clamp01(-rect.top / scrollExtra);
      setOffsetX(progress * scrollExtra);
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
  }, [scrollJack, scrollExtra]);

  return (
    <section
      ref={bgSectionRef}
      className={`relative py-24 transition-colors duration-700 ease-out sm:py-28 ${
        inView ? "bg-secondary-500" : "bg-page"
      }`}
    >
      <div className="relative z-[2] mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <SectionHeading
          align="center"
          className="max-w-2xl"
          theme={inView ? "dark" : "light"}
          eyebrow="Features"
          eyebrowColor="accent"
          heading="Everything the platform brings together"
          description="From secure, on-premise deployment to the AI modules that turn enterprise data into decisions — all built in."
        />
      </div>

      {scrollJack ? (
        <div
          ref={pinRef}
          className="relative mt-16"
          style={{ height: `calc(100vh + ${scrollExtra}px)` }}
        >
          <div
            ref={containerRef}
            className="sticky top-16 overflow-hidden py-10"
          >
            <div className="relative">
              <div
                className={`pointer-events-none absolute left-0 right-0 top-7 h-px transition-colors duration-700 ${inView ? "bg-white/15" : "bg-secondary-100"}`}
              />
              <div
                ref={rowRef}
                className="flex items-start gap-16 px-4 will-change-transform sm:px-10 xl:px-20"
                style={{ transform: `translateX(-${offsetX}px)` }}
              >
                {features.map((f) => (
                  <FeatureItem key={f.title} f={f} inView={inView} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-16 overflow-x-auto px-4 sm:px-10 xl:px-20">
          <div className="relative flex w-fit items-start gap-16 pb-2">
            <div
              className={`pointer-events-none absolute left-0 right-0 top-7 h-px transition-colors duration-700 ${inView ? "bg-white/15" : "bg-secondary-100"}`}
            />
            {features.map((f) => (
              <FeatureItem key={f.title} f={f} inView={inView} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
