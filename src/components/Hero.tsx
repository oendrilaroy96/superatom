import { useEffect, useRef, type RefObject } from "react";
import { MdArrowForward, MdBolt, MdTrendingDown, MdTrendingUp, MdShield } from "react-icons/md";
import type { IconType } from "react-icons";
import Button from "./ui/Button";

const NS = "http://www.w3.org/2000/svg";

function mk<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
  parent: SVGElement,
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(NS, tag) as SVGElementTagNameMap[K];
  for (const key in attrs) el.setAttribute(key, String(attrs[key]));
  parent.appendChild(el);
  return el;
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const p = (t: number, a: number, b: number) => ease(clamp((t - a) / (b - a)));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

const CENTER = { x: 290, y: 240 };
const SIGNALS = [
  { label: "Stock levels", sx: 140, sy: 95 },
  { label: "Lead times", sx: 205, sy: 150 },
  { label: "Demand shift", sx: 135, sy: 205 },
  { label: "Supplier risk", sx: 200, sy: 275 },
  { label: "Open POs", sx: 140, sy: 340 },
  { label: "Seasonality", sx: 205, sy: 395 },
];
const SOURCES = [
  { label: "ERP", y: 190 },
  { label: "Data System", y: 300 },
];
const OPTIONS = [
  { label: "Shift supplier", score: 71, y: 140, win: false },
  { label: "Reorder now", score: 92, y: 240, win: true },
  { label: "Hold stock", score: 38, y: 340, win: false },
];

const HOLD = 1.5;
const CYCLE = 10.8 + HOLD;
const HOLD_CAPTION = "Signals from across your supply chain";
const CAPTIONS = [
  "Scattered signals connect in the decision intelligence layer",
  "The optimization engine weighs every option",
  "The decision is delivered, and every outcome feeds back",
];

function StatIcon({ Icon }: { Icon: IconType }) {
  return (
    <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-md bg-primary-100 text-primary-500">
      <Icon size={18} />
    </span>
  );
}

function HeroDiagram({
  headingRef,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const captionRef = useRef<HTMLParagraphElement>(null);
  const pauseBtnRef = useRef<HTMLButtonElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const worldRef = useRef<SVGGElement>(null);
  const flowsRef = useRef<SVGGElement>(null);
  const sourcesRef = useRef<SVGGElement>(null);
  const bondsRef = useRef<SVGGElement>(null);
  const branchesRef = useRef<SVGGElement>(null);
  const atomsRef = useRef<SVGGElement>(null);
  const optionsRef = useRef<SVGGElement>(null);
  const cardRef = useRef<SVGGElement>(null);
  const coreRef = useRef<SVGCircleElement>(null);
  const semLabelRef = useRef<SVGTextElement>(null);
  const optLabelRef = useRef<SVGTextElement>(null);
  const approveBtnRef = useRef<SVGRectElement>(null);
  const approveTxtRef = useRef<SVGTextElement>(null);
  const loopRef = useRef<SVGPathElement>(null);
  const loopRevealRef = useRef<SVGPathElement>(null);
  const particleRef = useRef<SVGCircleElement>(null);
  const newAtomRef = useRef<SVGCircleElement>(null);
  const learnedRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const caption = captionRef.current;
    const pauseBtn = pauseBtnRef.current;
    if (
      !heading ||
      !caption ||
      !worldRef.current ||
      !flowsRef.current ||
      !sourcesRef.current ||
      !bondsRef.current ||
      !branchesRef.current ||
      !atomsRef.current ||
      !optionsRef.current ||
      !cardRef.current ||
      !coreRef.current ||
      !semLabelRef.current ||
      !optLabelRef.current ||
      !approveBtnRef.current ||
      !approveTxtRef.current ||
      !loopRef.current ||
      !loopRevealRef.current ||
      !particleRef.current ||
      !newAtomRef.current ||
      !learnedRef.current
    ) {
      return;
    }

    const atoms = SIGNALS.map((s, i) => {
      const ang = -Math.PI / 2 + (i * Math.PI) / 3;
      const mx = CENTER.x + 62 * Math.cos(ang);
      const my = CENTER.y + 62 * Math.sin(ang);
      const c = mk("circle", { cx: s.sx, cy: s.sy, r: 7, fill: "var(--color-primary-500)", opacity: 0 }, atomsRef.current!);
      const t = mk(
        "text",
        { x: s.sx + 13, y: s.sy + 4, fill: "var(--color-muted)", "font-size": 12, opacity: 0 },
        atomsRef.current!,
      );
      t.textContent = s.label;
      return { ...s, mx, my, ph: i * 1.3, c, t };
    });

    const sources = SOURCES.map((s) => {
      const g = mk("g", { opacity: 0 }, sourcesRef.current!);
      mk(
        "rect",
        { x: 6, y: s.y - 15, width: 100, height: 30, rx: 8, fill: "var(--color-page)", stroke: "var(--color-secondary-100)" },
        g,
      );
      const t = mk(
        "text",
        { x: 56, y: s.y + 4, "text-anchor": "middle", fill: "var(--color-muted)", "font-size": 12, "font-weight": 600 },
        g,
      );
      t.textContent = s.label;
      const f = mk(
        "path",
        {
          d: `M106 ${s.y} C 165 ${s.y}, 170 240, 226 240`,
          fill: "none",
          stroke: "var(--color-primary-200)",
          "stroke-width": 1.5,
          "stroke-dasharray": "3 5",
          opacity: 0,
        },
        flowsRef.current!,
      );
      const len = f.getTotalLength();
      const start = f.getPointAtLength(0);
      const dots = [0, 0.5].map((k) => ({
        k,
        c: mk("circle", { cx: start.x, cy: start.y, r: 3, fill: "var(--color-primary-500)", opacity: 0 }, flowsRef.current!),
      }));
      return { ...s, g, f, len, dots };
    });

    const bonds: SVGLineElement[] = [];
    atoms.forEach((a, i) => {
      const b = atoms[(i + 1) % 6];
      bonds.push(
        mk(
          "line",
          { x1: a.mx, y1: a.my, x2: b.mx, y2: b.my, stroke: "var(--color-primary-500)", "stroke-width": 1.5, pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1, opacity: 0.7 },
          bondsRef.current!,
        ),
      );
      bonds.push(
        mk(
          "line",
          { x1: a.mx, y1: a.my, x2: CENTER.x, y2: CENTER.y, stroke: "var(--color-primary-500)", "stroke-width": 1, pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1, opacity: 0.4 },
          bondsRef.current!,
        ),
      );
    });

    const opts = OPTIONS.map((o) => {
      const b = mk(
        "path",
        { d: `M352 240 C 400 240, 400 ${o.y}, 440 ${o.y}`, fill: "none", stroke: "var(--color-primary-200)", "stroke-width": 1.5, pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1 },
        branchesRef.current!,
      );
      const g = mk("g", { opacity: 0 }, optionsRef.current!);
      const r = mk("rect", { x: 440, y: o.y - 17, width: 180, height: 34, rx: 17, fill: "#ffffff", stroke: "var(--color-primary-200)" }, g);
      const t = mk("text", { x: 458, y: o.y + 5, fill: "var(--color-heading)", "font-size": 13, "font-weight": 500 }, g);
      t.textContent = o.label;
      const n = mk("text", { x: 604, y: o.y + 5, fill: "var(--color-muted)", "font-size": 13, "font-weight": 700, "text-anchor": "end" }, g);
      return { ...o, b, g, r, t, n };
    });

    const L = loopRef.current.getTotalLength();
    const RL = loopRevealRef.current.getTotalLength();

    function render(t: number, staticMode: boolean, rt = t, holding = false) {
      const k = t < 0.4 || holding ? -1 : t < 2.8 ? 0 : t < 5.4 ? 1 : t < 9.9 ? 2 : -1;
      heading!.querySelectorAll("span").forEach((s, i) => s.classList.toggle("on", staticMode || i === k || k > i));
      heading!.classList.toggle("intro", holding || (!staticMode && t < 0.6));
      if (staticMode) {
        caption!.textContent = "";
        caption!.style.opacity = "0";
      } else if (holding) {
        caption!.textContent = HOLD_CAPTION;
        caption!.style.opacity = "1";
      } else {
        caption!.textContent = k >= 0 ? CAPTIONS[k] : "";
        caption!.style.opacity = k >= 0 ? "1" : "0";
      }

      worldRef.current!.setAttribute("opacity", staticMode ? "1" : String(1 - p(t, 9.9, 10.6)));

      sources.forEach((o, i) => {
        o.g.setAttribute("opacity", String(p(t, 0, 0.4)));
        const fl = staticMode ? 1 : p(t, 2.0 + i * 0.1, 2.6 + i * 0.1);
        o.f.setAttribute("opacity", String(fl * 0.9));
        o.dots.forEach((d) => {
          const u = (rt * 0.45 + d.k + i * 0.17) % 1;
          const pt = o.f.getPointAtLength(o.len * u);
          d.c.setAttribute("cx", String(pt.x));
          d.c.setAttribute("cy", String(pt.y));
          d.c.setAttribute("opacity", staticMode ? (d.k ? "0" : "1") : String(fl * Math.sin(Math.PI * u)));
        });
      });

      const conv = p(t, 0.6, 2.0);
      atoms.forEach((a) => {
        const dx = Math.sin(rt * 1.4 + a.ph) * 4 * (1 - conv);
        const dy = Math.cos(rt * 1.1 + a.ph) * 4 * (1 - conv);
        const x = lerp(a.sx, a.mx, conv) + dx;
        const y = lerp(a.sy, a.my, conv) + dy;
        a.c.setAttribute("cx", String(x));
        a.c.setAttribute("cy", String(y));
        a.c.setAttribute("opacity", String(p(t, 0, 0.6)));
        a.t.setAttribute("x", String(x + 13));
        a.t.setAttribute("y", String(y + 4));
        a.t.setAttribute("opacity", String(p(t, 0.1, 0.6) * (1 - p(t, 0.8, 1.4))));
      });
      const bp = p(t, 1.8, 2.8);
      bonds.forEach((b) => b.setAttribute("stroke-dashoffset", String(1 - bp)));
      semLabelRef.current!.setAttribute("opacity", String(p(t, 2.1, 2.6)));

      optLabelRef.current!.setAttribute("opacity", String(p(t, 2.8, 3.3) * (1 - p(t, 5.4, 5.9))));
      const pick = p(t, 4.9, 5.3);
      const clear = p(t, 5.5, 6.0);
      opts.forEach((o, i) => {
        o.b.setAttribute("stroke-dashoffset", String(1 - p(t, 2.8 + i * 0.15, 3.5 + i * 0.15)));
        const shown = p(t, 3.2 + i * 0.15, 3.7 + i * 0.15);
        o.n.textContent = String(Math.round(o.score * p(t, 3.5, 4.8)));
        if (o.win) {
          o.b.setAttribute("stroke", pick > 0 ? "var(--color-accent-500)" : "var(--color-primary-200)");
          o.r.setAttribute("stroke", pick > 0 ? "var(--color-accent-500)" : "var(--color-primary-200)");
          o.n.setAttribute("fill", pick > 0 ? "var(--color-accent-500)" : "var(--color-muted)");
          const g = p(t, 5.7, 6.2);
          o.r.setAttribute("y", String(lerp(o.y - 17, 182, g)));
          o.r.setAttribute("height", String(lerp(34, 118, g)));
          o.r.setAttribute("rx", String(lerp(17, 14, g)));
          o.r.setAttribute("fill", g > 0 ? "url(#cardGrad)" : "#ffffff");
          o.t.setAttribute("opacity", String(1 - g));
          o.n.setAttribute("opacity", String(1 - g));
          o.g.setAttribute("opacity", String(shown));
        } else {
          o.g.setAttribute("opacity", String(shown * (1 - pick * 0.7) * (1 - clear)));
          o.b.setAttribute("opacity", String(1 - clear));
        }
      });

      cardRef.current!.setAttribute("opacity", String(p(t, 6.1, 6.5)));
      const ap = t >= 7.0;
      approveBtnRef.current!.setAttribute("fill", ap ? "url(#winGrad)" : "none");
      approveBtnRef.current!.setAttribute("stroke", ap ? "none" : "var(--color-accent-500)");
      approveTxtRef.current!.setAttribute("fill", ap ? "#ffffff" : "var(--color-accent-500)");
      approveTxtRef.current!.textContent = ap ? "Approved ✓" : "Approve";
      const pulse = t > 6.5 && t < 7.0 ? 1 + Math.sin((t - 6.5) * 20) * 0.03 : 1;
      approveBtnRef.current!.setAttribute("transform", `translate(${530 * (1 - pulse)} ${273 * (1 - pulse)}) scale(${pulse})`);

      const lp = p(t, 7.3, 8.7);
      loopRef.current!.setAttribute("opacity", lp > 0 ? "0.8" : "0");
      loopRevealRef.current!.setAttribute("stroke-dasharray", `${RL * lp} ${RL}`);
      if (lp > 0 && lp < 1 && !staticMode) {
        const pt = loopRef.current!.getPointAtLength(L * lp);
        particleRef.current!.setAttribute("cx", String(pt.x));
        particleRef.current!.setAttribute("cy", String(pt.y));
        particleRef.current!.setAttribute("opacity", "1");
      } else {
        particleRef.current!.setAttribute("opacity", "0");
      }

      const na = p(t, 8.7, 9.5);
      newAtomRef.current!.setAttribute("r", staticMode ? "0" : String(70 + na * 40));
      newAtomRef.current!.setAttribute("opacity", staticMode ? "0" : String(na > 0 && na < 1 ? 1 - na : 0));
      const flash = !staticMode && t > 8.7 && t < 9.4;
      atoms.forEach((a) => a.c.setAttribute("fill", flash ? "var(--color-accent-500)" : "var(--color-primary-500)"));
      coreRef.current!.setAttribute("r", String(14 * p(t, 1.9, 2.4) * (flash ? 1.25 : 1)));
      learnedRef.current!.setAttribute("opacity", String(p(t, 8.8, 9.2)));
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let rafId = 0;
    let paused = reduceMotion;
    const start = performance.now();
    let pauseStarted = paused ? start : 0;
    let pauseOffset = 0;

    function setPauseUI() {
      if (!pauseBtn) return;
      pauseBtn.textContent = paused ? "Play" : "Pause";
      pauseBtn.setAttribute("aria-label", paused ? "Play diagram animation" : "Pause diagram animation");
    }
    setPauseUI();
    function onPauseClick() {
      paused = !paused;
      if (paused) {
        pauseStarted = performance.now();
      } else {
        pauseOffset += performance.now() - pauseStarted;
      }
      setPauseUI();
    }
    pauseBtn?.addEventListener("click", onPauseClick);

    function frame(now: number) {
      if (disposed) return;
      if (paused) {
        render(9.4, true);
      } else {
        const raw = ((now - start - pauseOffset) / 1000) % CYCLE;
        const holding = raw >= 0.6 && raw < 0.6 + HOLD;
        const t = raw < 0.6 ? raw : holding ? 0.6 : raw - HOLD;
        render(t, false, raw, holding);
      }
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      pauseBtn?.removeEventListener("click", onPauseClick);
    };
  }, []);

  return (
    <div className="hero-viz relative">
      <svg
        ref={svgRef}
        viewBox="0 0 640 480"
        role="img"
        aria-label="Supply chain signals connect into a semantic layer, the optimization engine weighs the best option, and the decision is delivered and fed back into future decisions."
        className="w-full"
      >
        <defs>
          <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="coreGrad" cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="var(--color-primary-400)" />
            <stop offset="1" stopColor="var(--color-primary-500)" />
          </radialGradient>
          <linearGradient id="winGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-accent-500)" />
            <stop offset="1" stopColor="var(--color-primary-500)" />
          </linearGradient>
          <linearGradient id="loopGrad" gradientUnits="userSpaceOnUse" x1="530" y1="302" x2="346" y2="278">
            <stop offset="0" stopColor="var(--color-accent-500)" />
            <stop offset="1" stopColor="var(--color-primary-500)" />
          </linearGradient>
          <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="var(--color-accent-100)" />
          </linearGradient>
        </defs>
        <g ref={worldRef} id="world">
          <mask id="loopMask" maskUnits="userSpaceOnUse">
            <path
              ref={loopRevealRef}
              d="M530 302 C 530 400, 380 390, 346 278"
              fill="none"
              stroke="#fff"
              strokeWidth={8}
            />
          </mask>
          <path
            ref={loopRef}
            mask="url(#loopMask)"
            d="M530 302 C 530 400, 380 390, 346 278"
            fill="none"
            stroke="url(#loopGrad)"
            strokeWidth={2}
            strokeDasharray="4 6"
            opacity={0}
          />
          <g ref={flowsRef} />
          <g ref={sourcesRef} />
          <g ref={bondsRef} />
          <g ref={branchesRef} />
          <g ref={atomsRef} />
          <circle ref={coreRef} cx={290} cy={240} r={0} fill="url(#coreGrad)" filter="url(#heroGlow)" />
          <text
            ref={semLabelRef}
            x={290}
            y={158}
            textAnchor="middle"
            fill="var(--color-muted)"
            fontSize={12}
            fontWeight={600}
            letterSpacing={1}
            opacity={0}
          >
            DECISION INTELLIGENCE
          </text>
          <text
            ref={optLabelRef}
            x={530}
            y={100}
            textAnchor="middle"
            fill="var(--color-muted)"
            fontSize={12}
            fontWeight={600}
            letterSpacing={1}
            opacity={0}
          >
            OPTIMIZATION ENGINE
          </text>
          <g ref={optionsRef} />
          <g ref={cardRef} opacity={0}>
            <text x={456} y={205} fill="var(--color-muted)" fontSize={10} fontWeight={600} letterSpacing={1}>
              RECOMMENDED ACTION
            </text>
            <text x={456} y={228} fill="var(--color-heading)" fontSize={16} fontWeight={700}>
              Reorder 2,400 units
            </text>
            <text x={456} y={247} fill="var(--color-muted)" fontSize={12}>
              Supplier B &middot; 3 days faster
            </text>
            <rect ref={approveBtnRef} x={456} y={258} width={148} height={30} rx={8} fill="none" stroke="var(--color-accent-500)" />
            <text ref={approveTxtRef} x={530} y={278} textAnchor="middle" fill="var(--color-accent-500)" fontSize={13} fontWeight={600}>
              Approve
            </text>
          </g>
          <circle ref={particleRef} cx={530} cy={302} r={5} fill="var(--color-accent-500)" filter="url(#heroGlow)" opacity={0} />
          <circle ref={newAtomRef} cx={290} cy={240} r={0} fill="none" stroke="var(--color-accent-500)" strokeWidth={2} />
          <text
            ref={learnedRef}
            x={290}
            y={340}
            textAnchor="middle"
            fill="var(--color-accent-500)"
            fontSize={12}
            fontWeight={600}
            letterSpacing={1}
            opacity={0}
          >
            OUTCOME LEARNED
          </text>
        </g>
      </svg>
      <div className="mt-1 flex items-center justify-center gap-3">
        <p ref={captionRef} className="hero-caption" />
        <button
          ref={pauseBtnRef}
          type="button"
          className="shrink-0 font-display text-[10.5px] uppercase tracking-[0.08em] text-muted underline decoration-dotted underline-offset-2 transition-colors hover:text-primary-500"
        >
          Pause
        </button>
      </div>
    </div>
  );
}

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden">
      <div className="relative z-[2] mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-4 pb-4 pt-10 sm:px-10 sm:pt-14 lg:grid-cols-[1fr_1.15fr] lg:gap-14 xl:px-20">
        <div className="flex flex-col">
          <p className="mb-3 font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-primary-500">
            Decision intelligence for the supply chain
          </p>
          <h1
            ref={headingRef}
            className="hero-heading m-0 mb-4 font-display text-[clamp(32px,4.5vw,56px)] font-bold leading-[1.08] tracking-[-0.02em]"
          >
            <div className="flex flex-wrap gap-x-[0.3em] text-[clamp(28px,2.5vw,36px)]">
              <span>Decide Fast.</span>
              <span>Decide Right.</span>
            </div>
            <span>Every Time.</span>
          </h1>
          <p className="mb-6 max-w-[520px] text-[18px] leading-[1.55] text-body">
            Superatom AI connects and synchronizes data across enterprise
            Systems of Record (ERP&rsquo;s) and Data systems, to create a
            unified intelligence layer. It delivers actionable insights and
            intelligence, and enables you to execute the decisions through
            workflows.
          </p>
          <div>
            <Button
              href="#"
              variant="primary"
              iconRight={<MdArrowForward size={18} />}
              className="shadow-[0_10px_30px_-10px_rgba(83,58,253,0.35)] transition-transform hover:-translate-y-px"
            >
              Explore the Platform
            </Button>
          </div>
        </div>

        <HeroDiagram headingRef={headingRef} />
      </div>

      <div className="relative z-[2] mx-auto mt-auto grid w-full max-w-[1440px] grid-cols-2 gap-x-6 gap-y-6 border-t border-secondary-100 px-4 pb-11 pt-9 sm:grid-cols-4 sm:gap-x-8 sm:px-10 xl:px-20">
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
    </section>
  );
}
