import { useEffect, useRef, useState } from "react";

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

type Screen = { heading: string; question: string; video: string; poster: string };

/** The four demo screens the frame cycles through. Set `video` (and
 * optionally `poster`) once a real clip exists for that screen — until
 * then it shows the placeholder label. */
const SCREENS: Screen[] = [
  { heading: "Natural language chat interface", question: "What is the revenue impact of vendor delay?", video: "", poster: "" },
  { heading: "SuperBI and automated reports", question: "", video: "", poster: "" },
  { heading: "Data app's field data ingestion", question: "", video: "", poster: "" },
  { heading: "Workflows that close the decision loop", question: "", video: "", poster: "" },
];

const SHIMMER_STOPS: [string, string][] = [
  ["0", "#7A73FF"],
  ["0.3", "#00D4FF"],
  ["0.55", "#635BFF"],
  ["0.8", "#A960EE"],
  ["1", "#7A73FF"],
];

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
const toD = (pts: number[][]) =>
  pts.map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" ");

type Box = { l: number; t: number; r: number; b: number; cx: number; cy: number };
type Geo = { src: number[][][]; out: number[][] };
const CANCELLED = Symbol("cancelled");

export default function HowItWorksDiagram() {
  const flowRef = useRef<HTMLElement>(null);
  const wiresRef = useRef<SVGSVGElement>(null);
  const sourceRefs = useRef<(HTMLLIElement | null)[]>([]);
  const coreRef = useRef<HTMLDivElement>(null);
  const moduleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const frameHeadingRef = useRef<HTMLHeadingElement>(null);
  const frameLabelRef = useRef<HTMLDivElement>(null);
  const frameLabelTextRef = useRef<HTMLSpanElement>(null);
  const askRef = useRef<HTMLDivElement>(null);
  const askTextRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const flow = flowRef.current;
    const wires = wiresRef.current;
    const core = coreRef.current;
    const frame = frameRef.current;
    const frameHeading = frameHeadingRef.current;
    const frameLabel = frameLabelRef.current;
    const frameLabelText = frameLabelTextRef.current;
    const ask = askRef.current;
    const askText = askTextRef.current;
    const tip = tipRef.current;
    const sources = sourceRefs.current.filter((el): el is HTMLLIElement => el !== null);
    const modules = moduleRefs.current.filter((el): el is HTMLButtonElement => el !== null);
    const tabs = tabRefs.current.filter((el): el is HTMLButtonElement => el !== null);
    if (!flow || !wires || !core || !frame || !frameHeading || !frameLabel || !frameLabelText || !ask || !askText || !tip)
      return;
    if (sources.length !== SOURCES.length || modules.length !== MODULES.length || tabs.length !== SCREENS.length) return;
    if (!visible) return;

    // Re-bind as non-nullable so nested closures below don't lose the narrowing.
    const flowEl: HTMLElement = flow;
    const wiresEl: SVGSVGElement = wires;
    const coreEl: HTMLDivElement = core;
    const frameEl: HTMLDivElement = frame;
    const frameHeadingEl: HTMLHeadingElement = frameHeading;
    const frameLabelEl: HTMLDivElement = frameLabel;
    const frameLabelTextEl: HTMLSpanElement = frameLabelText;
    const askEl: HTMLDivElement = ask;
    const askTextEl: HTMLSpanElement = askText;
    const tipEl: HTMLDivElement = tip;
    const video = videoRef.current;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1280px)");
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

    // Shimmer gradient: a repeating multi-hue band that keeps sliding along a
    // lit route for as long as it stays active, layered on top of the plain
    // static "wire" rail underneath it.
    const gradient = document.createElementNS(NS, "linearGradient");
    const gradientId = `hiw-shimmer-${Math.random().toString(36).slice(2, 8)}`;
    gradient.setAttribute("id", gradientId);
    gradient.setAttribute("gradientUnits", "userSpaceOnUse");
    gradient.setAttribute("spreadMethod", "repeat");
    gradient.setAttribute("x1", "0");
    gradient.setAttribute("y1", "0");
    gradient.setAttribute("x2", "220");
    gradient.setAttribute("y2", "0");
    SHIMMER_STOPS.forEach(([offset, color]) => {
      const stop = document.createElementNS(NS, "stop");
      stop.setAttribute("offset", offset);
      stop.setAttribute("stop-color", color);
      gradient.appendChild(stop);
    });
    const shimmerMove = document.createElementNS(NS, "animateTransform");
    shimmerMove.setAttribute("attributeName", "gradientTransform");
    shimmerMove.setAttribute("type", "translate");
    shimmerMove.setAttribute("from", "0 0");
    shimmerMove.setAttribute("to", "220 0");
    shimmerMove.setAttribute("dur", "1.6s");
    shimmerMove.setAttribute("repeatCount", "indefinite");
    if (!reduceMotion) gradient.appendChild(shimmerMove);
    defs.appendChild(gradient);
    const gradientUrl = `url(#${gradientId})`;

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

    function setGradientOrientation(horizontal: boolean) {
      gradient.setAttribute("x2", horizontal ? "220" : "0");
      gradient.setAttribute("y2", horizontal ? "0" : "220");
      shimmerMove.setAttribute("to", horizontal ? "220 0" : "0 220");
    }

    const paths: Record<string, SVGPathElement> = {};
    function setPath(key: string, pts: number[][], arrow?: boolean) {
      let p = paths[key];
      if (!p) {
        p = document.createElementNS(NS, "path");
        if (arrow) p.setAttribute("marker-end", markerUrl);
        wiresEl.appendChild(p);
        paths[key] = p;
      }
      p.setAttribute("d", toD(pts));
    }

    const routes: Record<string, SVGGElement> = {};
    function setStreak(key: string, pts: number[][]) {
      let g = routes[key];
      if (!g) {
        g = document.createElementNS(NS, "g");
        g.setAttribute("class", "hiw-route");
        const line = document.createElementNS(NS, "path");
        line.setAttribute("class", "hiw-flowline");
        line.setAttribute("pathLength", "100");
        line.setAttribute("stroke", gradientUrl);
        g.appendChild(line);
        wiresEl.appendChild(g);
        routes[key] = g;
      }
      g.querySelectorAll("path").forEach((p) => p.setAttribute("d", toD(pts)));
    }
    function toggleRoute(key: string, on: boolean) {
      routes[key]?.classList.toggle("hiw-lit", on);
    }
    function togglePath(key: string, on: boolean) {
      paths[key]?.classList.toggle("hiw-lit", on);
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
        setPath("busA", [[busX, S[0].cy], [busX, C.cy]]);
        setPath("busB", [[busX, S[S.length - 1].cy], [busX, C.cy]]);
        setPath("in", [[busX, C.cy], [C.l - 2, C.cy]], true);
        setPath("out", [[C.r, C.cy], [F.l - 2, C.cy]], true);
        g.out = [[C.r, C.cy], [F.l, C.cy]];
        setGradientOrientation(true);
      } else {
        const busY = (S[0].b + C.t) / 2;
        S.forEach((s, i) => {
          setPath(`s${i}`, [[s.cx, s.b], [s.cx, busY]]);
          g.src.push([[s.cx, s.b], [s.cx, busY], [C.cx, busY], [C.cx, C.t]]);
        });
        setPath("busA", [[S[0].cx, busY], [C.cx, busY]]);
        setPath("busB", [[S[S.length - 1].cx, busY], [C.cx, busY]]);
        setPath("in", [[C.cx, busY], [C.cx, C.t - 2]], true);
        setPath("out", [[C.cx, C.b], [C.cx, F.t - 2]], true);
        g.out = [[C.cx, C.b], [C.cx, F.t]];
        setGradientOrientation(false);
      }
      g.src.forEach((pts, i) => setStreak(`r${i}`, pts));
      setStreak("rOut", g.out);
      geo = g;
    }
    const ro = new ResizeObserver(draw);
    ro.observe(flowEl);
    desktop.addEventListener("change", draw);
    if (document.fonts) document.fonts.ready.then(draw);
    draw();

    function light(i: number, on: boolean) {
      sources[i].classList.toggle("hiw-on", on);
      const half = i < sources.length / 2 ? "busA" : "busB";
      [`s${i}`, half, "in"].forEach((k) => togglePath(k, on));
      toggleRoute(`r${i}`, on);
    }

    let current = 0;

    function setScreen(n: number) {
      current = n;
      tabs.forEach((t, i) => {
        t.setAttribute("aria-selected", i === n ? "true" : "false");
        t.tabIndex = i === n ? 0 : -1;
      });
      const sc = SCREENS[n];
      frameHeadingEl.textContent = sc.heading;
      frameLabelTextEl.textContent = sc.video ? "" : `[Answer video for screen ${n + 1}]`;
      askEl.hidden = !sc.question;
      if (video) {
        video.pause();
        video.currentTime = 0;
        if (sc.video) {
          video.src = sc.video;
          video.classList.add("hiw-video-visible");
        } else {
          video.removeAttribute("src");
          video.classList.remove("hiw-video-visible");
        }
      }
    }

    function reset() {
      sources.forEach((s) => s.classList.remove("hiw-on"));
      modules.forEach((m) => m.classList.remove("hiw-on"));
      Object.keys(paths).forEach((k) => togglePath(k, false));
      Object.keys(routes).forEach((k) => toggleRoute(k, false));
      frameLabelEl.classList.remove("hiw-show");
      frameHeadingEl.classList.remove("hiw-show");
      flowEl.classList.remove("hiw-running");
      askTextEl.textContent = "";
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }

    function showStatic() {
      reset();
      askTextEl.textContent = SCREENS[current].question;
      frameHeadingEl.classList.add("hiw-show");
      sources.forEach((_, i) => light(i, true));
      modules.forEach((m) => m.classList.add("hiw-on"));
      togglePath("out", true);
      toggleRoute("rOut", true);
      frameLabelEl.classList.add("hiw-show");
    }

    let runId = 0;
    let running = false;
    function wait(id: number, ms: number): Promise<void> {
      return sleep(ms).then(() => {
        if (disposed || id !== runId) throw CANCELLED;
      });
    }

    async function play(hold: number): Promise<void> {
      const id = ++runId;
      running = true;
      reset();
      try {
        if (reduceMotion) {
          showStatic();
          await wait(id, hold);
          return;
        }
        flowEl.classList.add("hiw-running");
        frameHeadingEl.classList.add("hiw-show");
        await wait(id, 350);

        const q = SCREENS[current].question;
        if (q) {
          for (const ch of q) {
            askTextEl.textContent += ch;
            await wait(id, 32);
          }
          await wait(id, 300);
        }

        if (!geo) return;
        await Promise.all(
          sources.map((_, i) =>
            wait(id, i * 160).then(() => {
              light(i, true);
              return wait(id, 900);
            }),
          ),
        );
        await wait(id, 0);

        for (const m of modules) {
          m.classList.add("hiw-on");
          await wait(id, 420);
        }

        togglePath("out", true);
        toggleRoute("rOut", true);
        await wait(id, 700);
        frameLabelEl.classList.add("hiw-show");
        if (video && SCREENS[current].video) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }

        await wait(id, hold);
      } catch (e) {
        if (e !== CANCELLED) throw e;
      } finally {
        if (id === runId) running = false;
      }
    }

    let auto = true;
    async function loop() {
      while (!disposed && auto) {
        await play(4500);
        if (disposed || !auto) return;
        setScreen((current + 1) % SCREENS.length);
        await sleep(600);
      }
    }

    function choose(n: number) {
      auto = false;
      setScreen(n);
      play(0);
    }

    setScreen(0);
    if (reduceMotion) {
      showStatic();
    } else {
      loop();
    }

    const cleanups: (() => void)[] = [];
    sources.forEach((s, i) => {
      const onEnter = () => {
        if (!running) light(i, true);
      };
      const onLeave = () => {
        if (!running && !reduceMotion) light(i, false);
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
    const onTipEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") hideTip();
    };
    document.addEventListener("keydown", onTipEscape);
    cleanups.push(() => document.removeEventListener("keydown", onTipEscape));

    tabs.forEach((t, i) => {
      const onClick = () => choose(i);
      const onKeydown = (e: KeyboardEvent) => {
        let n: number | null = null;
        if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
        else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") n = 0;
        else if (e.key === "End") n = tabs.length - 1;
        if (n === null) return;
        e.preventDefault();
        tabs[n].focus();
        choose(n);
      };
      t.addEventListener("click", onClick);
      t.addEventListener("keydown", onKeydown);
      cleanups.push(() => {
        t.removeEventListener("click", onClick);
        t.removeEventListener("keydown", onKeydown);
      });
    });

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

      <div className="hiw-frame-col">
        <div ref={frameRef} className="hiw-vframe">
          <h4 ref={frameHeadingRef} className="hiw-frame-heading" />
          <video ref={videoRef} className="hiw-video" muted playsInline />
          <div ref={frameLabelRef} className="hiw-frame-label">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="#fff">
              <path d="M8 5v14l11-7Z" />
            </svg>
            <span ref={frameLabelTextRef} />
          </div>
          <div ref={askRef} className="hiw-ask">
            <span ref={askTextRef} />
            <span className="hiw-caret" aria-hidden="true" />
          </div>
        </div>
        <div className="hiw-screens" role="tablist" aria-label="Example answers">
          {SCREENS.map((_, i) => (
            <button
              key={i}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              className="hiw-screen-btn"
              role="tab"
              aria-selected={i === 0}
              aria-label={`Screen ${i + 1}`}
              tabIndex={i === 0 ? 0 : -1}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div ref={tipRef} id="hiw-tip" className="hiw-tip" role="tooltip" />
    </section>
  );
}
