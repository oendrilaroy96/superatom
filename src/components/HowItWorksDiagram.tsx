import { useEffect, useRef, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const NS = "http://www.w3.org/2000/svg";

function Icon({ paths, viewBox, size }: { paths: string; viewBox: string; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  );
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

const SOURCES: [string, string][] = [
  ["erp", "ERPs"],
  ["iot", "IoT"],
  ["lake", "Data Lake"],
  ["api", "APIs"],
];

const MODULES: [string, string, string][] = [
  ["tribal", "Tribal Knowledge", "Captures the experience and judgment calls your best planners already know."],
  ["opt", "Optimization Engine", "Runs analytics and simulation to evaluate every alternative."],
  ["genui", "Generative UI", "Builds the right chart, table or view for each question, on the fly."],
  ["sem", "Semantic Modeling", "Links entities and relationships across your enterprise data."],
];

/** Sample questions the scripted sequence types out and answers, one per loop. */
const CHAT_QUESTIONS: string[] = [
  "Why did fulfillment cost spike in Q3?",
  "What is the revenue impact of vendor delay?",
  "Which suppliers are at risk this quarter?",
  "Show me the top 5 delayed shipments",
];

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

type Box = { l: number; t: number; r: number; b: number; cx: number; cy: number };
type Geo = { src: number[][][]; out: number[][] };

export default function HowItWorksDiagram() {
  const flowRef = useRef<HTMLElement>(null);
  const wiresRef = useRef<SVGSVGElement>(null);
  const sourceRefs = useRef<(HTMLLIElement | null)[]>([]);
  const coreRef = useRef<HTMLDivElement>(null);
  const moduleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const frameLabelRef = useRef<HTMLDivElement>(null);
  const askTextRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const flow = flowRef.current;
    const wires = wiresRef.current;
    const core = coreRef.current;
    const frame = frameRef.current;
    const frameLabel = frameLabelRef.current;
    const askText = askTextRef.current;
    const tip = tipRef.current;
    const sources = sourceRefs.current.filter((el): el is HTMLLIElement => el !== null);
    const modules = moduleRefs.current.filter((el): el is HTMLButtonElement => el !== null);
    if (!flow || !wires || !core || !frame || !frameLabel || !askText || !tip) return;
    if (sources.length !== SOURCES.length || modules.length !== MODULES.length) return;
    if (!visible) return;

    // Re-bind as non-nullable so nested closures below don't lose the narrowing.
    const flowEl: HTMLElement = flow;
    const wiresEl: SVGSVGElement = wires;
    const coreEl: HTMLDivElement = core;
    const frameEl: HTMLDivElement = frame;
    const frameLabelEl: HTMLDivElement = frameLabel;
    const askTextEl: HTMLSpanElement = askText;
    const tipEl: HTMLDivElement = tip;
    const video = videoRef.current;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1180px)");
    let disposed = false;

    function box(el: Element): Box {
      const f = flowEl.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return {
        l: r.left - f.left,
        t: r.top - f.top,
        r: r.right - f.left,
        b: r.bottom - f.top,
        cx: (r.left + r.right) / 2 - f.left,
        cy: (r.top + r.bottom) / 2 - f.top,
      };
    }

    const defs = document.createElementNS(NS, "defs");
    const marker = document.createElementNS(NS, "marker");
    marker.setAttribute("id", `hiw-arrow-${Math.random().toString(36).slice(2, 8)}`);
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerWidth", "5");
    marker.setAttribute("markerHeight", "5");
    marker.setAttribute("refX", "3.2");
    marker.setAttribute("refY", "2");
    marker.setAttribute("overflow", "visible");
    const markerPath = document.createElementNS(NS, "path");
    markerPath.setAttribute("d", "M0 0 L4 2 L0 4 Z");
    markerPath.setAttribute("class", "hiw-arrow");
    marker.appendChild(markerPath);
    defs.appendChild(marker);
    wiresEl.appendChild(defs);
    const markerUrl = `url(#${marker.id})`;

    const paths: Record<string, SVGPathElement> = {};
    function setPath(key: string, pts: number[][], arrow?: boolean) {
      let p = paths[key];
      if (!p) {
        p = document.createElementNS(NS, "path");
        if (arrow) p.setAttribute("marker-end", markerUrl);
        wiresEl.appendChild(p);
        paths[key] = p;
      }
      p.setAttribute("d", pts.map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" "));
    }

    let geo: Geo | null = null;
    function draw() {
      const S = sources.map(box);
      const C = box(coreEl);
      const F = box(frameEl);
      const g: Geo = { src: [], out: [[0, 0], [0, 0]] };
      if (desktop.matches) {
        const busX = (S[0].r + C.l) / 2;
        S.forEach((s, i) => {
          setPath(`s${i}`, [[s.r, s.cy], [busX, s.cy]]);
          g.src.push([[s.r, s.cy], [busX, s.cy], [busX, C.cy], [C.l, C.cy]]);
        });
        setPath("bus", [[busX, S[0].cy], [busX, S[S.length - 1].cy]]);
        setPath("in", [[busX, C.cy], [C.l - 2, C.cy]], true);
        setPath("out", [[C.r, C.cy], [F.l - 2, C.cy]], true);
        g.out = [[C.r, C.cy], [F.l, C.cy]];
      } else {
        const busY = (S[0].b + C.t) / 2;
        S.forEach((s, i) => {
          setPath(`s${i}`, [[s.cx, s.b], [s.cx, busY]]);
          g.src.push([[s.cx, s.b], [s.cx, busY], [C.cx, busY], [C.cx, C.t]]);
        });
        setPath("bus", [[S[0].cx, busY], [S[S.length - 1].cx, busY]]);
        setPath("in", [[C.cx, busY], [C.cx, C.t - 2]], true);
        setPath("out", [[C.cx, C.b], [C.cx, F.t - 2]], true);
        g.out = [[C.cx, C.b], [C.cx, F.t]];
      }
      geo = g;
    }
    const ro = new ResizeObserver(draw);
    ro.observe(flowEl);
    desktop.addEventListener("change", draw);
    if (document.fonts) document.fonts.ready.then(draw);
    draw();

    function pulse(points: number[][], duration: number): Promise<void> {
      const dot = document.createElement("div");
      dot.className = "hiw-pulse";
      flowEl.appendChild(dot);
      const lens = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
      const total = lens.reduce((a, b) => a + b, 0) || 1;
      let acc = 0;
      const frames = points.map((p, i) => {
        if (i > 0) acc += lens[i - 1];
        return { left: `${p[0]}px`, top: `${p[1]}px`, offset: acc / total };
      });
      const anim = dot.animate(frames, { duration, easing: "linear" });
      return anim.finished.then(
        () => dot.remove(),
        () => dot.remove(),
      );
    }

    function light(i: number, on: boolean) {
      sources[i].classList.toggle("hiw-on", on);
      [`s${i}`, "bus", "in"].forEach((k) => paths[k]?.classList.toggle("hiw-lit", on));
    }

    function reset() {
      sources.forEach((s) => s.classList.remove("hiw-on"));
      modules.forEach((m) => m.classList.remove("hiw-on"));
      Object.values(paths).forEach((p) => p.classList.remove("hiw-lit"));
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
      if (disposed || !geo) return;
      const g = geo;

      await Promise.all(
        sources.map((_, i) =>
          sleep(i * 160).then(() => {
            if (disposed) return;
            light(i, true);
            return pulse(g.src[i], 900);
          }),
        ),
      );
      if (disposed) return;

      for (const m of modules) {
        if (disposed) return;
        m.classList.add("hiw-on");
        await sleep(420);
      }
      if (disposed) return;

      paths.out?.classList.add("hiw-lit");
      await pulse(g.out, 450);
      if (disposed) return;
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
      sources.forEach((_, i) => light(i, true));
      modules.forEach((m) => m.classList.add("hiw-on"));
      paths.out?.classList.add("hiw-lit");
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

    const cleanups: (() => void)[] = [];
    sources.forEach((s, i) => {
      const onEnter = () => {
        if (!runningRef.current) light(i, true);
      };
      const onLeave = () => {
        if (!runningRef.current && !reduceMotion) light(i, false);
      };
      s.addEventListener("mouseenter", onEnter);
      s.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        s.removeEventListener("mouseenter", onEnter);
        s.removeEventListener("mouseleave", onLeave);
      });
    });

    function showTip(m: HTMLButtonElement, desc: string) {
      tipEl.innerHTML = "";
      const b = document.createElement("b");
      b.textContent = m.textContent?.trim() ?? "";
      tipEl.appendChild(b);
      tipEl.appendChild(document.createTextNode(desc));
      const r = box(m);
      const w = Math.min(240, flowEl.clientWidth - 32);
      tipEl.style.width = `${w}px`;
      const left = Math.max(16, Math.min(r.cx - w / 2, flowEl.clientWidth - w - 16));
      tipEl.style.left = `${left}px`;
      tipEl.classList.add("hiw-show");
      tipEl.style.top = `${r.t - tipEl.offsetHeight - 10}px`;
    }
    const hideTip = () => tipEl.classList.remove("hiw-show");
    modules.forEach((m, i) => {
      const desc = MODULES[i][2];
      const onEnter = () => showTip(m, desc);
      m.addEventListener("mouseenter", onEnter);
      m.addEventListener("focus", onEnter);
      m.addEventListener("mouseleave", hideTip);
      m.addEventListener("blur", hideTip);
      cleanups.push(() => {
        m.removeEventListener("mouseenter", onEnter);
        m.removeEventListener("focus", onEnter);
        m.removeEventListener("mouseleave", hideTip);
        m.removeEventListener("blur", hideTip);
      });
    });
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") hideTip();
    };
    document.addEventListener("keydown", onKeydown);
    cleanups.push(() => document.removeEventListener("keydown", onKeydown));

    return () => {
      disposed = true;
      ro.disconnect();
      desktop.removeEventListener("change", draw);
      cleanups.forEach((fn) => fn());
      wiresEl.innerHTML = "";
    };
  }, [visible]);

  useEffect(() => {
    const el = flowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={flowRef} className="hiw-flow" aria-label="How Superatom AI works">
      <svg ref={wiresRef} className="hiw-wires" aria-hidden="true" />

      <div>
        <p className="hiw-sources-label">Enterprise Systems</p>
        <ul className="hiw-sources">
          {SOURCES.map(([id, label], i) => (
            <li
              key={id}
              ref={(el) => {
                sourceRefs.current[i] = el;
              }}
              className="hiw-source"
            >
              <Icon paths={SRC_ICONS[id]} viewBox={SRC_ICON_VB} size={28} />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div ref={coreRef} className="hiw-core">
        <h3>Superatom AI</h3>
        <div className="hiw-modules">
          {MODULES.map(([id, label], i) => (
            <button
              key={id}
              ref={(el) => {
                moduleRefs.current[i] = el;
              }}
              type="button"
              className="hiw-module"
              aria-describedby="hiw-tip"
            >
              <Icon paths={MOD_ICONS[id]} viewBox={MOD_ICON_VB} size={22} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div ref={frameRef} className="hiw-vframe">
        <video
          ref={videoRef}
          className="hiw-video"
          muted
          playsInline
          onCanPlay={(e) => {
            e.currentTarget.classList.add("hiw-video-visible");
            frameLabelRef.current?.classList.remove("hiw-show");
          }}
        />
        <div ref={frameLabelRef} className="hiw-frame-label">
          <PlayArrowIcon style={{ fontSize: 20 }} />
          <span>[Answer video plays here]</span>
        </div>
        <div className="hiw-ask">
          <span ref={askTextRef} />
          <span className="hiw-caret" aria-hidden="true" />
        </div>
      </div>

      <div ref={tipRef} id="hiw-tip" className="hiw-tip" role="tooltip" />
    </section>
  );
}
