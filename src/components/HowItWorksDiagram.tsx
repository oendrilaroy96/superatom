import { useEffect, useId, useRef } from "react";

const NS = "http://www.w3.org/2000/svg";

type Screen = { heading: string; question: string; video: string; poster: string };

/** The four demo screens the frame cycles through. Set `video` (and
 * optionally `poster`) once a real clip exists for that screen — until
 * then it shows the placeholder label. */
const SCREENS: Screen[] = [
  { heading: "Natural language chat interface", question: "What is the Revenue impact of Vendor delay", video: "", poster: "" },
  { heading: "SuperBI and Automated Reports", question: "", video: "", poster: "" },
  { heading: "Data App’s Field data ingestion", question: "", video: "", poster: "" },
  { heading: "Workflows that closes the decision loop", question: "", video: "", poster: "" },
];

const C = { x: 290, y: 240 };
const ORBIT = 70;
const ATOMS = [
  { l: "Tribal Knowledge", sx: 150, sy: 118, ang: -120 },
  { l: "Optimization Engine", sx: 205, sy: 185, ang: -60 },
  { l: "Semantic Modeling", sx: 205, sy: 300, ang: 60 },
  { l: "Generative UI", sx: 150, sy: 362, ang: 120 },
];
const SOURCES = [
  { l: "ERPs", y: 150 },
  { l: "IoT", y: 210 },
  { l: "Data Lake", y: 270 },
  { l: "APIs", y: 330 },
];

const HOLD = 1.5;
const LINK = 3.0;
const ANSWER = 3.8;
const ANSWER_HOLD = 6.2;
const LOOP = 5.6;
const LOOP_END = 7.2;
const END = ANSWER + ANSWER_HOLD;
const SCREEN_LEN = END + 1.1 + HOLD;
const HOLD_CAPTION = "Data from across your enterprise systems";
const CAPTIONS = [
  "Everything connects in Superatom AI",
  "The decision is delivered",
  "Every outcome feeds back into your systems",
];

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const p = (t: number, a: number, b: number) => ease(clamp((t - a) / (b - a)));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

function mk<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
  parent: Element,
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(NS, tag) as SVGElementTagNameMap[K];
  for (const k in attrs) el.setAttribute(k, String(attrs[k]));
  parent.appendChild(el);
  return el;
}

/**
 * Animated "how it works" diagram (Option A): enterprise sources converge
 * into an orbiting cluster of Superatom AI modules around a glowing core,
 * which links to a video frame showing the delivered answer, then loops
 * back to show the outcome feeding into the source systems. Ported 1:1
 * from a standalone interactive prototype — same structure, timings and
 * styling, adapted into this component's lifecycle (refs + a single setup
 * effect) rather than a raw DOM script.
 */
export default function HowItWorksDiagram() {
  const uid = useId().replace(/:/g, "");
  const flowRef = useRef<HTMLElement>(null);
  const vizRef = useRef<SVGSVGElement>(null);
  const worldRef = useRef<SVGGElement>(null);
  const flowsGroupRef = useRef<SVGGElement>(null);
  const sourcesGroupRef = useRef<SVGGElement>(null);
  const bondsGroupRef = useRef<SVGGElement>(null);
  const atomsGroupRef = useRef<SVGGElement>(null);
  const coreRef = useRef<SVGCircleElement>(null);
  const semLabelRef = useRef<SVGTextElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  const outLineRef = useRef<SVGPathElement>(null);
  const outRevealRef = useRef<SVGPathElement>(null);
  const outPortRef = useRef<SVGCircleElement>(null);
  const outDotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const outGradRef = useRef<SVGLinearGradientElement>(null);
  const loopLineRef = useRef<SVGPathElement>(null);
  const loopRevealRef = useRef<SVGPathElement>(null);
  const particleRef = useRef<SVGCircleElement>(null);
  const loopLabelRef = useRef<SVGTextElement>(null);
  const loopGradRef = useRef<SVGLinearGradientElement>(null);

  const frameRef = useRef<HTMLDivElement>(null);
  const frameHeadingRef = useRef<HTMLHeadingElement>(null);
  const frameLabelRef = useRef<HTMLDivElement>(null);
  const frameLabelTextRef = useRef<HTMLSpanElement>(null);
  const askRef = useRef<HTMLDivElement>(null);
  const askTextRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const flowEl = flowRef.current;
    const vizEl = vizRef.current;
    const worldEl = worldRef.current;
    const flowsGroup = flowsGroupRef.current;
    const sourcesGroup = sourcesGroupRef.current;
    const bondsGroup = bondsGroupRef.current;
    const atomsGroup = atomsGroupRef.current;
    const coreEl = coreRef.current;
    const semLabelEl = semLabelRef.current;
    const captionEl = captionRef.current;
    const outLine = outLineRef.current;
    const outReveal = outRevealRef.current;
    const outPort = outPortRef.current;
    const outGrad = outGradRef.current;
    const loopLine = loopLineRef.current;
    const loopReveal = loopRevealRef.current;
    const particle = particleRef.current;
    const loopLabel = loopLabelRef.current;
    const loopGrad = loopGradRef.current;
    const frameEl = frameRef.current;
    const frameHeadingEl = frameHeadingRef.current;
    const frameLabelEl = frameLabelRef.current;
    const frameLabelTextEl = frameLabelTextRef.current;
    const askEl = askRef.current;
    const askTextEl = askTextRef.current;
    const video = videoRef.current;
    const outDots = outDotRefs.current.filter((el): el is SVGCircleElement => el !== null);
    const tabs = tabRefs.current.filter((el): el is HTMLButtonElement => el !== null);

    if (
      !flowEl || !vizEl || !worldEl || !flowsGroup || !sourcesGroup || !bondsGroup || !atomsGroup ||
      !coreEl || !semLabelEl || !captionEl || !outLine || !outReveal || !outPort || !outGrad ||
      !loopLine || !loopReveal || !particle || !loopLabel || !loopGrad ||
      !frameEl || !frameHeadingEl || !frameLabelEl || !frameLabelTextEl || !askEl || !askTextEl
    ) {
      return;
    }
    if (outDots.length !== 2 || tabs.length !== SCREENS.length) return;

    const loopHeadUrl = `url(#${uid}-loopHead)`;

    // ---------- Build the atoms, settling on an orbit around the core like electrons ----------
    const atoms = ATOMS.map((a, i) => {
      const ang = (a.ang * Math.PI) / 180;
      const left = Math.cos(ang) < 0;
      const top = Math.sin(ang) < 0;
      const mx = C.x + ORBIT * Math.cos(ang);
      const my = C.y + ORBIT * Math.sin(ang);
      const c = mk("circle", { r: 7, fill: "#533AFD" }, atomsGroup);
      const t = mk("text", { fill: "#50617A", "font-size": 12 }, atomsGroup);
      t.textContent = a.l;
      const n = mk(
        "text",
        {
          x: mx + (left ? -4 : 4),
          y: top ? my - 14 : my + 22,
          "text-anchor": left ? "end" : "start",
          fill: "#061B31",
          "font-size": 12,
          "font-weight": 500,
          opacity: 0,
        },
        atomsGroup,
      );
      n.textContent = a.l;
      return { ...a, mx, my, ph: i * 1.3, c, t, n };
    });

    // ---------- Enterprise systems, each with a live dotted flow into the core ----------
    const sources = SOURCES.map((o) => {
      const g = mk("g", { opacity: 0 }, sourcesGroup);
      const rect = mk(
        "rect",
        { x: 6, y: o.y - 15, width: 100, height: 30, rx: 8, fill: "#F6F9FC", stroke: "#E5EDF5" },
        g,
      );
      const text = mk(
        "text",
        { x: 56, y: o.y + 4, "text-anchor": "middle", fill: "#50617A", "font-size": 12, "font-weight": 600 },
        g,
      );
      text.textContent = o.l;
      const f = mk(
        "path",
        {
          d: `M106 ${o.y} C 160 ${o.y}, 165 240, 212 240`,
          fill: "none",
          stroke: "#B9B9F9",
          "stroke-width": 1.5,
          "stroke-dasharray": "3 5",
          opacity: 0,
        },
        flowsGroup,
      );
      const len = f.getTotalLength();
      const dots = [0, 0.5].map((k) => ({ k, c: mk("circle", { r: 3, fill: "#533AFD", opacity: 0 }, flowsGroup) }));
      return { ...o, g, rect, f, len, dots };
    });
    const erpRect = sources[0].rect;

    // ---------- Orbit ring, inner ring, spokes to the core, and a circling light ----------
    const bonds: SVGElement[] = [];
    bonds.push(
      mk(
        "circle",
        {
          cx: C.x, cy: C.y, r: ORBIT, fill: "none", stroke: "#533AFD", "stroke-width": 1.5,
          pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1, opacity: 0.55,
          transform: `rotate(-90 ${C.x} ${C.y})`,
        },
        bondsGroup,
      ),
    );
    bonds.push(
      mk(
        "circle",
        {
          cx: C.x, cy: C.y, r: ORBIT - 26, fill: "none", stroke: "#7F7DFC", "stroke-width": 1,
          pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1, opacity: 0.25,
          transform: `rotate(90 ${C.x} ${C.y})`,
        },
        bondsGroup,
      ),
    );
    atoms.forEach((a) => {
      bonds.push(
        mk(
          "line",
          {
            x1: a.mx, y1: a.my, x2: C.x, y2: C.y, stroke: "#533AFD", "stroke-width": 1,
            pathLength: 1, "stroke-dasharray": 1, "stroke-dashoffset": 1, opacity: 0.22,
          },
          bondsGroup,
        ),
      );
    });
    const electron = mk(
      "circle",
      { r: 3, fill: "#7F7DFC", opacity: 0, filter: `url(#${uid}-glow)` },
      bondsGroup,
    );

    // ---------- Line from the core to the video frame, and the feedback loop back ----------
    const desktop = window.matchMedia("(min-width: 1180px)");
    let outLen = 0;
    let loopLen = 0;

    function toPage(x: number, y: number) {
      const pt = vizEl!.createSVGPoint();
      pt.x = x;
      pt.y = y;
      const q = pt.matrixTransform(vizEl!.getScreenCTM()!);
      const f = flowEl!.getBoundingClientRect();
      return { x: q.x - f.left, y: q.y - f.top };
    }

    function drawLink() {
      const f = flowEl!.getBoundingClientRect();
      const r = frameEl!.getBoundingClientRect();
      let a: { x: number; y: number };
      let b: { x: number; y: number };
      if (desktop.matches) {
        a = toPage(368, 240);
        const y = Math.max(r.top - f.top + 28, Math.min(a.y, r.bottom - f.top - 28));
        a = { x: a.x, y };
        b = { x: r.left - f.left, y };
      } else {
        a = toPage(290, 316);
        b = { x: a.x, y: r.top - f.top };
      }
      const d = `M${a.x} ${a.y} L ${b.x} ${b.y}`;
      outGrad!.setAttribute("x1", String(a.x));
      outGrad!.setAttribute("y1", String(a.y));
      outGrad!.setAttribute("x2", String(b.x));
      outGrad!.setAttribute("y2", String(b.y));
      outLine!.setAttribute("d", d);
      outReveal!.setAttribute("d", d);
      outLen = outLine!.getTotalLength();
      outPort!.setAttribute("cx", String(b.x));
      outPort!.setAttribute("cy", String(b.y));

      const F = {
        l: r.left - f.left,
        t: r.top - f.top,
        cx: (r.left + r.right) / 2 - f.left,
        cy: (r.top + r.bottom) / 2 - f.top,
      };
      let s: { x: number; y: number };
      let e: { x: number; y: number };
      let ld: string;
      if (desktop.matches) {
        s = { x: F.l + 40, y: F.t - 2 };
        e = toPage(56, 135 - 3);
        const y0 = Math.min(F.t, e.y) - 30;
        const rad = 14;
        ld = `M${s.x} ${s.y} V ${y0 + rad} Q ${s.x} ${y0} ${s.x - rad} ${y0} H ${e.x + rad} Q ${e.x} ${y0} ${e.x} ${y0 + rad} V ${e.y}`;
        loopLabel!.setAttribute("x", String((s.x + e.x) / 2));
        loopLabel!.setAttribute("y", String(y0 - 10));
        loopLabel!.setAttribute("text-anchor", "middle");
        loopLabel!.style.display = "";
      } else {
        s = { x: F.l - 2, y: F.cy };
        e = toPage(6 - 2, 150);
        const x0 = Math.max(4, Math.min(e.x - 8, F.l - 10));
        const rad = 10;
        ld = `M${s.x} ${s.y} H ${x0 + rad} Q ${x0} ${s.y} ${x0} ${s.y - rad} V ${e.y + rad} Q ${x0} ${e.y} ${x0 + rad} ${e.y} H ${e.x}`;
        loopLabel!.style.display = "none";
      }
      loopLine!.setAttribute("d", ld);
      loopReveal!.setAttribute("d", ld);
      loopGrad!.setAttribute("x1", String(s.x));
      loopGrad!.setAttribute("y1", String(s.y));
      loopGrad!.setAttribute("x2", String(e.x));
      loopGrad!.setAttribute("y2", String(e.y));
      loopLen = loopLine!.getTotalLength();
    }
    const ro = new ResizeObserver(drawLink);
    ro.observe(flowEl);
    desktop.addEventListener("change", drawLink);
    if (document.fonts) document.fonts.ready.then(drawLink);
    drawLink();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function render(t: number, staticMode: boolean, rt = t, holding = false, endless = false) {
      const k = t < 0.4 || holding ? -1 : t < 2.8 ? 0 : t >= LOOP ? 2 : t >= LINK ? 1 : -1;
      if (staticMode) {
        captionEl!.textContent = CAPTIONS[2];
        captionEl!.style.opacity = "1";
      } else if (holding) {
        captionEl!.textContent = HOLD_CAPTION;
        captionEl!.style.opacity = "1";
      } else {
        captionEl!.textContent = k >= 0 ? CAPTIONS[k] : "";
        captionEl!.style.opacity = k >= 0 ? "1" : "0";
      }

      const fade = staticMode || endless ? 0 : p(t, END, END + 0.7);
      worldEl!.setAttribute("opacity", String(1 - fade));

      sources.forEach((o, i) => {
        o.g.setAttribute("opacity", String(p(t, 0, 0.4)));
        const fl = staticMode ? 1 : p(t, 2.0 + i * 0.1, 2.6 + i * 0.1);
        o.f.setAttribute("opacity", String(fl * 0.9));
        o.dots.forEach((d) => {
          const u = (rt * 0.45 + d.k + i * 0.17) % 1;
          const pt = o.f.getPointAtLength(o.len * u);
          d.c.setAttribute("cx", String(pt.x));
          d.c.setAttribute("cy", String(pt.y));
          d.c.setAttribute("opacity", String(staticMode ? (d.k ? 0 : 1) : fl * Math.sin(Math.PI * u)));
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
        a.n.setAttribute("opacity", String(staticMode ? 1 : p(t, 2.1, 2.6)));
      });

      const bp = p(t, 1.8, 2.8);
      bonds.forEach((b) => b.setAttribute("stroke-dashoffset", String(1 - bp)));
      const ea = -Math.PI / 2 + rt * 0.9;
      electron.setAttribute("cx", String(C.x + ORBIT * Math.cos(ea)));
      electron.setAttribute("cy", String(C.y + ORBIT * Math.sin(ea)));
      electron.setAttribute("opacity", String(staticMode ? 0 : p(t, 2.6, 3.0)));
      semLabelEl!.setAttribute("opacity", String(p(t, 2.1, 2.6)));
      coreEl!.setAttribute("r", String(14 * p(t, 1.9, 2.4)));

      const link = staticMode ? 1 : p(t, LINK, ANSWER) * (1 - fade);
      outReveal!.setAttribute("stroke-dasharray", `${outLen * link} ${outLen + 10}`);
      outLine!.style.opacity = String(1 - fade);
      outPort!.setAttribute("opacity", String(link > 0.98 ? 1 - fade : 0));
      outDots.forEach((dot, i) => {
        if (!outLen) return;
        const u = (rt * 0.55 + i * 0.5) % 1;
        const pt = outLine!.getPointAtLength(outLen * u);
        dot.setAttribute("cx", String(pt.x));
        dot.setAttribute("cy", String(pt.y));
        dot.setAttribute(
          "opacity",
          String(staticMode ? (i ? 0 : 1) : link > 0.98 ? Math.sin(Math.PI * u) * (1 - fade) : 0),
        );
      });
      frameLabelEl!.classList.toggle("hiw-show", staticMode || (t >= ANSWER && fade < 0.5));

      const lp = staticMode ? 1 : p(t, LOOP, LOOP_END);
      loopLine!.setAttribute("opacity", String(lp > 0 ? 0.85 * (1 - fade) : 0));
      loopReveal!.setAttribute("stroke-dasharray", `${loopLen * lp} ${loopLen + 10}`);
      if (lp >= 1) loopLine!.setAttribute("marker-end", loopHeadUrl);
      else loopLine!.removeAttribute("marker-end");
      loopLabel!.setAttribute(
        "opacity",
        String((staticMode ? 1 : p(t, LOOP_END - 0.2, LOOP_END + 0.3)) * (1 - fade)),
      );
      if (lp > 0 && lp < 1 && !staticMode && loopLen) {
        const pt = loopLine!.getPointAtLength(loopLen * lp);
        particle!.setAttribute("cx", String(pt.x));
        particle!.setAttribute("cy", String(pt.y));
        particle!.setAttribute("opacity", "1");
      } else {
        particle!.setAttribute("opacity", "0");
      }
      const flash = !staticMode && t > LOOP_END && t < LOOP_END + 0.8;
      erpRect.setAttribute("stroke", flash ? "#FF6118" : "#E5EDF5");
      erpRect.setAttribute("fill", flash ? "#FFF4EE" : "#F6F9FC");
      frameHeadingEl!.classList.toggle("hiw-show", staticMode || fade < 0.5);
      const q = SCREENS[current].question;
      askTextEl!.textContent = staticMode ? q : q.slice(0, Math.round(q.length * clamp((t - 0.2) / 1.4)));
    }

    // ---------- Screens ----------
    let current = 0;
    function setScreen(n: number) {
      current = n;
      tabs.forEach((t, i) => {
        t.setAttribute("aria-selected", i === n ? "true" : "false");
        t.tabIndex = i === n ? 0 : -1;
      });
      const sc = SCREENS[n];
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
      frameLabelTextEl!.textContent = sc.video ? "" : `[Answer video for screen ${n + 1}]`;
      frameHeadingEl!.textContent = sc.heading;
      askEl!.hidden = !sc.question;
    }

    // ---------- Auto-cycling timeline driven by requestAnimationFrame ----------
    let disposed = false;
    let visible = false;
    let auto = true;
    let start = performance.now();
    let videoStarted = false;
    let rafId = 0;

    function restart() {
      start = performance.now();
      videoStarted = false;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }

    function frameTick(now: number) {
      if (disposed) return;
      if (reduceMotion) {
        render(ANSWER + 1, true);
      } else if (visible) {
        let raw = (now - start) / 1000;
        if (auto && raw >= SCREEN_LEN) {
          setScreen((current + 1) % SCREENS.length);
          restart();
          raw = 0;
        }
        const holding = raw >= 0.6 && raw < 0.6 + HOLD;
        let t = raw < 0.6 ? raw : holding ? 0.6 : raw - HOLD;
        if (!auto) t = Math.min(t, END - 0.01);
        render(t, false, raw, holding, !auto);
        if (video && t >= ANSWER && !videoStarted) {
          videoStarted = true;
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      }
      rafId = requestAnimationFrame(frameTick);
    }

    function choose(n: number) {
      auto = false;
      setScreen(n);
      restart();
    }

    const cleanups: (() => void)[] = [];
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

    setScreen(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        const was = visible;
        visible = entry.isIntersecting;
        if (visible && !was && auto) restart();
      },
      { threshold: 0.3 },
    );
    io.observe(flowEl);
    rafId = requestAnimationFrame(frameTick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      desktop.removeEventListener("change", drawLink);
      cleanups.forEach((fn) => fn());
      flowsGroup.replaceChildren();
      sourcesGroup.replaceChildren();
      bondsGroup.replaceChildren();
      atomsGroup.replaceChildren();
    };
  }, [uid]);

  return (
    <section ref={flowRef} className="hiw-flow" aria-label="How Superatom AI works">
      <svg className="hiw-wires" aria-hidden="true">
        <defs>
          <linearGradient ref={outGradRef} id={`${uid}-outGrad`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
            <stop offset="0" stopColor="#B9B9F9" />
            <stop offset="1" stopColor="#FFB894" />
          </linearGradient>
          <marker id={`${uid}-head`} orient="auto" markerWidth="5" markerHeight="5" refX="3.2" refY="2" overflow="visible">
            <path d="M0 0 L4 2 L0 4 Z" style={{ fill: "#FF6118", stroke: "none" }} />
          </marker>
        </defs>
        <defs>
          <mask id={`${uid}-outMask`} maskUnits="userSpaceOnUse" x="-50" y="-50" width="4000" height="4000">
            <path ref={outRevealRef} fill="none" stroke="#fff" strokeWidth="10" />
          </mask>
        </defs>
        <path
          ref={outLineRef}
          className="hiw-out-line"
          stroke={`url(#${uid}-outGrad)`}
          mask={`url(#${uid}-outMask)`}
        />
        <circle ref={(el) => { outDotRefs.current[0] = el; }} r="3" fill="#FF6118" opacity="0" />
        <circle ref={(el) => { outDotRefs.current[1] = el; }} r="3" fill="#FF6118" opacity="0" />
        <circle ref={outPortRef} r="4.5" fill="#FFFFFF" stroke="#FF6118" strokeWidth="1.5" opacity="0" />
        <defs>
          <linearGradient ref={loopGradRef} id={`${uid}-loopGrad`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
            <stop offset="0" stopColor="#FF6118" />
            <stop offset="1" stopColor="#533AFD" />
          </linearGradient>
          <filter id={`${uid}-pglow`} x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker id={`${uid}-loopHead`} orient="auto" markerWidth="5" markerHeight="5" refX="3.2" refY="2" overflow="visible">
            <path d="M0 0 L4 2 L0 4 Z" style={{ fill: "#533AFD", stroke: "none" }} />
          </marker>
          <mask id={`${uid}-loopMask`} maskUnits="userSpaceOnUse" x="-50" y="-50" width="4000" height="4000">
            <path ref={loopRevealRef} fill="none" stroke="#fff" strokeWidth="10" />
          </mask>
        </defs>
        <path
          ref={loopLineRef}
          mask={`url(#${uid}-loopMask)`}
          fill="none"
          stroke={`url(#${uid}-loopGrad)`}
          strokeWidth="1.5"
          strokeDasharray="4 6"
          strokeLinecap="round"
          opacity="0"
        />
        <circle ref={particleRef} r="5" fill="#FF6118" filter={`url(#${uid}-pglow)`} opacity="0" />
        <text
          ref={loopLabelRef}
          fill="#FF6118"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="11"
          fontWeight="600"
          letterSpacing="1"
          opacity="0"
        >
          OUTCOME LEARNED
        </text>
      </svg>

      <div className="hiw-viz">
        <svg
          ref={vizRef}
          viewBox="0 96 456 294"
          role="img"
          aria-label="ERPs, IoT, Data Lake and APIs flow into Superatom AI, where Tribal Knowledge, Optimization Engine, Semantic Modeling and Generative UI connect, and the decision is delivered."
        >
          <defs>
            <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id={`${uid}-coreGrad`} cx="40%" cy="35%" r="70%">
              <stop offset="0" stopColor="#7F7DFC" />
              <stop offset="1" stopColor="#533AFD" />
            </radialGradient>
          </defs>
          <g ref={worldRef}>
            <g ref={flowsGroupRef} />
            <g ref={sourcesGroupRef} />
            <g ref={bondsGroupRef} />
            <g ref={atomsGroupRef} />
            <circle ref={coreRef} cx="290" cy="240" r="0" fill={`url(#${uid}-coreGrad)`} filter={`url(#${uid}-glow)`} />
            <text ref={semLabelRef} x="290" y="130" textAnchor="middle" fill="#50617A" fontSize="12" fontWeight="600" letterSpacing="1" opacity="0">
              SUPERATOM AI
            </text>
          </g>
        </svg>
        <p ref={captionRef} className="hiw-caption" />
      </div>

      <div className="hiw-frame-col">
        <div ref={frameRef} className="hiw-frame">
          <h4 ref={frameHeadingRef} className="hiw-frame-heading" />
          <video ref={videoRef} className="hiw-video" muted playsInline />
          <div ref={frameLabelRef} className="hiw-frame-label">
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ fill: "#FFFFFF" }} aria-hidden="true">
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
    </section>
  );
}
