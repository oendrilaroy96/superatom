import { useEffect, useRef, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const NS = "http://www.w3.org/2000/svg";

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
  parent: SVGElement,
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag) as SVGElementTagNameMap[K];
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  parent.appendChild(e);
  return e;
}
function svgText(
  parent: SVGElement,
  x: number,
  y: number,
  s: string,
  cls?: string,
  anchor?: string,
): SVGTextElement {
  const t = svgEl(
    "text",
    { x, y, class: cls || "", "text-anchor": anchor || "start" },
    parent,
  );
  t.textContent = s;
  return t;
}
/** Icon + label mounted as HTML inside a foreignObject, so the label can wrap naturally. Returns the host div for bounding-box lookups (tooltip positioning). */
function mountCard(
  parent: SVGElement,
  x: number,
  y: number,
  w: number,
  h: number,
  iconPaths: string,
  iconViewBox: string,
  label: string,
  fontSize: number,
  badged: boolean,
): HTMLDivElement {
  const fo = svgEl("foreignObject", { x, y, width: w, height: h }, parent);
  const host = document.createElement("div");
  host.className = "hiw-card-inner";
  const iconSize = badged ? 26 : 22;
  host.innerHTML = `
    <span class="hiw-card-ico${badged ? " hiw-card-ico-badged" : ""}" style="width:${iconSize}px;height:${iconSize}px">
      <svg viewBox="${iconViewBox}" fill="none" stroke="var(--color-primary-500)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconPaths}</svg>
    </span>
    <span class="hiw-card-label" style="font-size:${fontSize}px">${label}</span>
  `;
  fo.appendChild(host);
  return host;
}

const SRC_ICON_VB = "-4 -4 32 32";
const SRC_ICONS: Record<string, string> = {
  erp: `<ellipse cx="12" cy="5.5" rx="7" ry="2.5"/><path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>`,
  iot: `<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>`,
  lake: `<path d="M12 3l9 5-9 5-9-5Z"/><path d="M3 13l9 5 9-5"/>`,
  api: `<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>`,
};
const MOD_ICON_VB = "0 0 24 24";
const MOD_ICONS: Record<string, string> = {
  tribal: `<path d="M4 19V6a2 2 0 0 1 2-2h13v13H6a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h13"/>`,
  opt: `<path d="M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6"/>`,
  genui: `<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z"/>`,
  sem: `<circle cx="12" cy="12" r="2.5"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M6.5 6.5l3.7 3.7M17.5 6.5l-3.7 3.7M6.5 17.5l3.7-3.7M17.5 17.5l-3.7-3.7"/>`,
};

/** Sample questions the scripted sequence types out and answers, one per loop. */
const CHAT_QUESTIONS: string[] = [
  "Why did fulfillment cost spike in Q3?",
  "What is the revenue impact of vendor delay?",
  "Which suppliers are at risk this quarter?",
  "Show me the top 5 delayed shipments",
];

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

type ChatRefs = {
  frame: React.RefObject<HTMLDivElement | null>;
  frameLabel: React.RefObject<HTMLDivElement | null>;
  askText: React.RefObject<HTMLSpanElement | null>;
  video: React.RefObject<HTMLVideoElement | null>;
};

/**
 * Video frame: a placeholder ("[Answer video plays here]") with the current
 * question typed into the pill near the bottom, both driven by the parent's
 * scripted play sequence via refs. No real clip is wired up yet — swap the
 * `<video src>` below for one and the placeholder label disappears
 * automatically once the video can play.
 */
function ChatPanel({ frame, frameLabel, askText, video }: ChatRefs) {
  return (
    <div className="-mt-6 w-[660px] flex-none">
      <div
        ref={frame}
        className="hiw-frame relative w-full overflow-hidden rounded-[16px] bg-secondary-500 shadow-[0_20px_50px_-20px_rgba(13,23,56,0.45)] transition-shadow duration-300"
        style={{ aspectRatio: "588 / 440" }}
      >
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover opacity-0"
          muted
          playsInline
          onCanPlay={(e) => {
            e.currentTarget.classList.remove("opacity-0");
            frameLabel.current?.classList.remove("hiw-show");
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          ref={frameLabel}
          className="hiw-frame-label absolute inset-0 flex items-center justify-center gap-2 text-white/80"
        >
          <PlayArrowIcon style={{ fontSize: 20 }} />
          <span className="font-sans text-sm font-semibold">[Answer video plays here]</span>
        </div>
        <div className="absolute inset-x-0 bottom-[26px] mx-auto flex w-[92%] items-center justify-center overflow-hidden rounded-[10px] bg-white px-5 py-3.5 font-sans text-base text-heading shadow-[0_16px_30px_-14px_rgba(13,23,56,0.25)]">
          <span ref={askText} className="overflow-hidden text-ellipsis whitespace-nowrap" />
          <span className="hiw-caret" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

const VW = 788;
const VY0 = 244;
const VH = 380;

export default function HowItWorksDiagram() {
  const rootDivRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const frameLabelRef = useRef<HTMLDivElement>(null);
  const askTextRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const rootDiv = rootDivRef.current;
    const svg = svgRef.current;
    const stageEl = stageRef.current;
    const tip = tipRef.current;
    const frame = frameRef.current;
    const frameLabel = frameLabelRef.current;
    const askText = askTextRef.current;
    const video = videoRef.current;
    if (!rootDiv || !svg || !stageEl || !tip || !frame || !frameLabel || !askText) return;
    if (!visible) return;

    // Re-bind as non-nullable so nested closures below don't lose the narrowing.
    const frameEl: HTMLDivElement = frame;
    const frameLabelEl: HTMLDivElement = frameLabel;
    const askTextEl: HTMLSpanElement = askText;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let disposed = false;
    const tipEl: HTMLDivElement = tip;

    const defs = svgEl("defs", {}, svg);
    const marker = svgEl(
      "marker",
      {
        id: `hiw-arrow-${Math.random().toString(36).slice(2, 8)}`,
        viewBox: "0 0 10 10",
        refX: "9",
        refY: "5",
        markerWidth: "7",
        markerHeight: "7",
        orient: "auto-start-reverse",
      },
      defs,
    );
    svgEl("path", { d: "M0,0 L10,5 L0,10 z", class: "hiw-arrow" }, marker);
    const markerUrl = `url(#${marker.id})`;

    const edgeLayer = svgEl("g", {}, svg);
    const nodeLayer = svgEl("g", {}, svg);
    const pulseLayer = svgEl("g", {}, svg);

    svgText(nodeLayer, 64, 278, "Enterprise Systems", "hiw-t-title").style.cssText =
      "font-size:15px;font-weight:700;fill:var(--color-body)";

    const SRC_X = 64;
    const SRC_W = 140;
    const SRC_H = 56;
    const SRC_TOPS = [304, 384, 464, 544];
    const srcY = SRC_TOPS.map((y) => y + SRC_H / 2);
    const sourceDefs: [string, string, string][] = [
      ["erp", "ERPs", "Enterprise resource planning"],
      ["iot", "IoT", "Sensor and device data from the field"],
      ["lake", "Data Lake", "Raw and historical enterprise data"],
      ["api", "APIs", "Direct integrations with your existing tools"],
    ];
    const sourceGs: SVGGElement[] = [];
    const stubLines: SVGPathElement[] = [];
    sourceDefs.forEach(([id, n], i) => {
      const y = SRC_TOPS[i];
      const g = svgEl("g", { class: "hiw-node hiw-src" }, nodeLayer);
      svgEl("rect", { x: SRC_X, y, width: SRC_W, height: SRC_H, rx: 8, class: "hiw-b" }, g);
      mountCard(g, SRC_X, y, SRC_W, SRC_H, SRC_ICONS[id], SRC_ICON_VB, n, 16, true);
      sourceGs.push(g);
      const stub = svgEl(
        "path",
        { d: `M${SRC_X + SRC_W},${srcY[i]} H244`, class: "hiw-edge" },
        edgeLayer,
      );
      stubLines.push(stub);
      g.addEventListener("mouseenter", () => {
        if (!runningRef.current) lightSource(i, true);
      });
      g.addEventListener("mouseleave", () => {
        if (!runningRef.current && !reduceMotion) lightSource(i, false);
      });
    });

    const TRUNK_X = 244;
    const trunkVertical = svgEl(
      "path",
      { d: `M${TRUNK_X},${srcY[0]} V${srcY[3]}`, class: "hiw-edge" },
      edgeLayer,
    );
    const CORE_MID_Y = 444;
    const coreEntry = svgEl(
      "path",
      { d: `M${TRUNK_X},${CORE_MID_Y} H298`, class: "hiw-edge", "marker-end": markerUrl },
      edgeLayer,
    );

    const coreG = svgEl("g", { class: "hiw-core" }, nodeLayer);
    svgEl("rect", { x: 300, y: 288, width: 424, height: 312, rx: 12, class: "hiw-core-frame" }, coreG);
    svgText(coreG, 332, 322, "Superatom AI", "hiw-core-title");

    const modDefs: [string, string, string, number, number][] = [
      ["tribal", "Tribal Knowledge", "Captures the experience and judgment calls your best planners already know.", 332, 364],
      ["opt", "Optimization Engine", "Runs analytics and simulation to evaluate every alternative.", 520, 364],
      ["genui", "Generative UI", "Builds the right chart, table or view for each question, on the fly.", 332, 468],
      ["sem", "Semantic Modeling", "Links entities and relationships across your enterprise data.", 520, 468],
    ];
    const MOD_W = 172;
    const MOD_H = 88;
    const moduleGs: SVGGElement[] = [];
    modDefs.forEach(([id, n, d, x, y]) => {
      const g = svgEl("g", { class: "hiw-node hiw-mod", tabindex: "0", role: "button", "aria-label": n }, nodeLayer);
      svgEl("rect", { x, y, width: MOD_W, height: MOD_H, rx: 8, class: "hiw-b" }, g);
      const host = mountCard(g, x, y, MOD_W, MOD_H, MOD_ICONS[id], MOD_ICON_VB, n, 15, false);
      moduleGs.push(g);
      const show = () => {
        tipEl.innerHTML = "";
        const b = document.createElement("b");
        b.textContent = n;
        tipEl.appendChild(b);
        tipEl.appendChild(document.createTextNode(d));
        tipEl.hidden = false;
        const r = host.getBoundingClientRect();
        const tipH = tipEl.offsetHeight;
        let top = r.top - tipH - 12;
        if (top < 8) top = r.bottom + 12;
        const left = Math.max(8, Math.min(r.left, window.innerWidth - 266));
        tipEl.style.left = `${left}px`;
        tipEl.style.top = `${top}px`;
      };
      const hide = () => {
        tipEl.hidden = true;
      };
      g.addEventListener("mouseenter", show);
      g.addEventListener("focus", show);
      g.addEventListener("mouseleave", hide);
      g.addEventListener("blur", hide);
    });

    const outLine = svgEl(
      "path",
      { d: `M724,${CORE_MID_Y} H786`, class: "hiw-edge hiw-out-e", "marker-end": markerUrl },
      edgeLayer,
    );

    function lightSource(i: number, on: boolean) {
      sourceGs[i].classList.toggle("hiw-on", on);
      stubLines[i].classList.toggle("hiw-lit", on);
      trunkVertical.classList.toggle("hiw-lit", on);
      coreEntry.classList.toggle("hiw-lit", on);
    }

    function pulse(points: number[][], duration: number, color: string): Promise<void> {
      const dot = svgEl("circle", { r: 5, fill: color, class: "hiw-pulse-dot" }, pulseLayer);
      const lens = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
      const total = lens.reduce((a, b) => a + b, 0) || 1;
      let acc = 0;
      const frames = points.map((p, i) => {
        if (i > 0) acc += lens[i - 1];
        return { transform: `translate(${p[0]}px, ${p[1]}px)`, offset: acc / total };
      });
      const anim = dot.animate(frames, { duration, easing: "linear" });
      return anim.finished.then(
        () => dot.remove(),
        () => dot.remove(),
      );
    }

    const srcPath = (i: number) => [
      [SRC_X + SRC_W, srcY[i]],
      [TRUNK_X, srcY[i]],
      [TRUNK_X, CORE_MID_Y],
      [298, CORE_MID_Y],
    ];
    const outPath = [
      [724, CORE_MID_Y],
      [786, CORE_MID_Y],
    ];

    function reset() {
      sourceGs.forEach((g) => g.classList.remove("hiw-on"));
      moduleGs.forEach((g) => g.classList.remove("hiw-on"));
      [...stubLines, trunkVertical, coreEntry, outLine].forEach((l) => l.classList.remove("hiw-lit"));
      coreG.classList.remove("hiw-on");
      frameEl.classList.remove("hiw-on");
      frameLabelEl.classList.remove("hiw-show");
      askTextEl.textContent = "";
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }

    const runningRef = { current: false };
    let qIndex = 0;

    async function typeQuestion(text: string) {
      askTextEl.textContent = "";
      for (const ch of text) {
        if (disposed) return;
        askTextEl.textContent += ch;
        await sleep(32);
      }
    }

    async function playOnce() {
      if (runningRef.current) return;
      runningRef.current = true;
      reset();
      await typeQuestion(CHAT_QUESTIONS[qIndex]);
      if (disposed) return;
      await sleep(300);
      if (disposed) return;

      const pulses = sourceGs.map((_, i) =>
        sleep(i * 160).then(() => {
          if (disposed) return;
          lightSource(i, true);
          return pulse(srcPath(i), 900, "var(--color-primary-500)");
        }),
      );
      await Promise.all(pulses);
      if (disposed) return;
      coreG.classList.add("hiw-on");

      for (const g of moduleGs) {
        if (disposed) return;
        g.classList.add("hiw-on");
        await sleep(420);
      }
      if (disposed) return;

      outLine.classList.add("hiw-lit");
      await pulse(outPath, 450, "var(--color-accent-500)");
      if (disposed) return;
      frameEl.classList.add("hiw-on");
      frameLabelEl.classList.add("hiw-show");
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }

      await sleep(4500);
      runningRef.current = false;
    }

    function showStatic() {
      reset();
      askTextEl.textContent = CHAT_QUESTIONS[0];
      sourceGs.forEach((_, i) => lightSource(i, true));
      moduleGs.forEach((g) => g.classList.add("hiw-on"));
      outLine.classList.add("hiw-lit");
      coreG.classList.add("hiw-on");
      frameEl.classList.add("hiw-on");
      frameLabelEl.classList.add("hiw-show");
    }

    if (reduceMotion) {
      showStatic();
    } else {
      (async () => {
        while (!disposed) {
          await playOnce();
          if (disposed) return;
          qIndex = (qIndex + 1) % CHAT_QUESTIONS.length;
          await sleep(800);
        }
      })();
    }

    return () => {
      disposed = true;
      svg.innerHTML = "";
    };
  }, [visible]);

  useEffect(() => {
    const el = rootDivRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootDivRef} className="hiw-root">
      <div className="hiw-scroll">
        <div className="hiw-flow">
          <div ref={stageRef} className="hiw-stage">
            <svg ref={svgRef} viewBox={`0 ${VY0} ${VW} ${VH}`} role="img" aria-label="Superatom AI architecture" />
          </div>
          <ChatPanel frame={frameRef} frameLabel={frameLabelRef} askText={askTextRef} video={videoRef} />
        </div>
      </div>
      <div ref={tipRef} className="hiw-tip" hidden />
    </div>
  );
}
