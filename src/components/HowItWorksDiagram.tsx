import { useEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TuneIcon from "@mui/icons-material/Tune";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import HubIcon from "@mui/icons-material/Hub";
import StorageIcon from "@mui/icons-material/Storage";
import SensorsIcon from "@mui/icons-material/Sensors";
import LayersIcon from "@mui/icons-material/Layers";
import ApiIcon from "@mui/icons-material/Api";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import type { IconComponent } from "../types/icon";

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
function mountIcon(
  parent: SVGElement,
  Icon: IconComponent,
  cx: number,
  cy: number,
  size: number,
  color: string,
  roots: Root[],
) {
  const fo = svgEl(
    "foreignObject",
    { x: cx - size / 2, y: cy - size / 2, width: size, height: size },
    parent,
  );
  fo.style.overflow = "visible";
  const host = document.createElement("div");
  host.style.cssText = `width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;color:${color};`;
  fo.appendChild(host);
  const root = createRoot(host);
  root.render(<Icon style={{ fontSize: Math.round(size * 0.72) }} />);
  roots.push(root);
}

/** Sample questions rotated through the pill below the video placeholder. */
const CHAT_QUESTIONS: string[] = [
  "What is the revenue impact of vendor delay?",
  "Which suppliers are at risk this quarter?",
  "Show me the top 5 delayed shipments",
  "Why did fulfillment cost spike in Q3?",
];
const CHAT_SLIDE_MS = 4200;
const CHAT_FADE_MS = 220;

/**
 * Right-hand panel: a video placeholder ("[Answer video plays here]") with a
 * rotating sample question below it. No real clip is wired up yet — swap
 * the `<video src>` below for one and the placeholder label disappears
 * automatically once the video can play.
 */
function ChatPanel() {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setI((v) => (v + 1) % CHAT_QUESTIONS.length);
        setVisible(true);
      }, CHAT_FADE_MS);
    }, CHAT_SLIDE_MS);
    return () => window.clearInterval(id);
  }, []);

  const textStyle = {
    opacity: visible ? 1 : 0,
    transition: `opacity ${CHAT_FADE_MS}ms ease`,
  };

  return (
    <div className="flex w-[460px] flex-none flex-col items-center">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-secondary-500 shadow-[0_20px_50px_-20px_rgba(13,23,56,0.45)]">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-0"
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={(e) => {
            e.currentTarget.classList.remove("opacity-0");
            setVideoReady(true);
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        {!videoReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/70">
            <PlayArrowIcon style={{ fontSize: 26 }} />
            <span className="font-sans text-base">[Answer video plays here]</span>
          </div>
        )}
      </div>
      <div
        className="-mt-5 w-[94%] overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-white px-6 py-4 text-center font-sans text-base text-heading shadow-[0_16px_30px_-14px_rgba(13,23,56,0.25)]"
        style={textStyle}
      >
        {CHAT_QUESTIONS[i]}
      </div>
    </div>
  );
}

const VW = 680;
const VH = 310;

export default function HowItWorksDiagram() {
  const rootDivRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const rootDiv = rootDivRef.current;
    const svg = svgRef.current;
    const canvas = canvasRef.current;
    const stageEl = stageRef.current;
    const tip = tipRef.current;
    if (!rootDiv || !svg || !canvas || !stageEl || !tip) return;
    if (!visible) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const iconRoots: Root[] = [];
    const timers: number[] = [];
    let rafId = 0;
    let disposed = false;

    const defs = svgEl("defs", {}, svg);
    (
      [
        ["a", "hiw-arrow"],
        ["al", "hiw-arrow-lit"],
        ["ao", "hiw-arrow-out"],
      ] as const
    ).forEach(([id, c]) => {
      const m = svgEl(
        "marker",
        {
          id: `${id}-${Math.random().toString(36).slice(2, 8)}`,
          viewBox: "0 0 10 10",
          refX: "9",
          refY: "5",
          markerWidth: "7",
          markerHeight: "7",
          orient: "auto-start-reverse",
        },
        defs,
      );
      m.dataset.marker = id;
      svgEl("path", { d: "M0,0 L10,5 L0,10 z", class: c }, m);
    });
    const markerUrl = (id: string) => {
      const m = defs.querySelector<SVGMarkerElement>(`[data-marker="${id}"]`);
      return `url(#${m!.id})`;
    };

    type NodeInfo = { name: string; desc: string; g: SVGGElement };
    type Edge = {
      from: string;
      to: string;
      el: SVGPathElement;
      out: boolean;
      both: boolean;
      noMarker: boolean;
      k: number;
      tk: number;
      fixed: boolean;
    };
    const N: Record<string, NodeInfo> = {};
    const E: Edge[] = [];
    const edgeLayer = svgEl("g", {}, svg);
    const nodeLayer = svgEl("g", {}, svg);
    type Mode = "auto" | "paused" | "hover" | "pinned";
    let mode: Mode = "auto";
    let pinned: string | null = null;
    let hoverFrom: Mode | null = null;
    const tipEl: HTMLDivElement = tip;

    function addNode(
      id: string,
      name: string,
      desc: string,
      cls: string,
      build: (g: SVGGElement) => void,
    ) {
      const g = svgEl(
        "g",
        { class: `hiw-node ${cls}`, tabindex: "0", role: "button", "aria-label": name },
        nodeLayer,
      );
      build(g);
      N[id] = { name, desc, g };
      g.addEventListener("click", () => select(id));
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select(id);
        }
      });
      g.addEventListener("mouseenter", () => {
        if (mode === "auto" || mode === "paused" || mode === "hover") {
          timers.forEach((t) => window.clearTimeout(t));
          hoverFrom = hoverFrom || mode;
          mode = "hover";
          const { ids, lit } = neighbours(id);
          paint(ids, lit, new Set([id]));
        }
      });
      g.addEventListener("mousemove", (ev) => {
        tipEl.innerHTML = "";
        const b = document.createElement("b");
        b.textContent = name;
        const span = document.createElement("span");
        span.textContent = desc;
        tipEl.appendChild(b);
        tipEl.appendChild(span);
        tipEl.hidden = false;
        const x = Math.min(ev.clientX + 14, window.innerWidth - 266);
        const y =
          ev.clientY + 16 + tipEl.offsetHeight > window.innerHeight
            ? ev.clientY - tipEl.offsetHeight - 10
            : ev.clientY + 16;
        tipEl.style.left = `${x}px`;
        tipEl.style.top = `${y}px`;
      });
      g.addEventListener("mouseleave", () => {
        tipEl.hidden = true;
        if (mode === "hover") {
          const was = hoverFrom;
          hoverFrom = null;
          if (was === "auto") play();
          else if (was) {
            mode = was;
            showStep(step);
          }
        }
      });
    }
    function edge(
      from: string,
      to: string,
      d: string,
      out?: boolean,
      both?: boolean,
      noMarker?: boolean,
    ): Edge {
      const attrs: Record<string, string | number> = {
        d,
        class: `hiw-edge${out ? " hiw-out-e" : ""}`,
      };
      if (!noMarker) attrs["marker-end"] = out ? markerUrl("ao") : markerUrl("a");
      const p = svgEl("path", attrs, edgeLayer);
      if (both && !noMarker) p.setAttribute("marker-start", markerUrl("a"));
      const e: Edge = {
        from,
        to,
        el: p,
        out: !!out,
        both: !!both,
        noMarker: !!noMarker,
        k: 0.5,
        tk: 0.5,
        fixed: false,
      };
      E.push(e);
      return e;
    }

    svgText(nodeLayer, 20, 24, "Enterprise Systems", "hiw-t-title");
    const SRC_W = 140;
    const SRC_H = 44;
    const SRC_GAP = 16;
    const sources: [string, string, string, IconComponent][] = [
      ["erp", "ERPs", "Enterprise resource planning", StorageIcon],
      ["iot", "IoT", "Sensor and device data from the field", SensorsIcon],
      ["lake", "Data Lake", "Raw and historical enterprise data", LayersIcon],
      ["api", "APIs", "Direct integrations with your existing tools", ApiIcon],
    ];
    sources.forEach(([id, n, d, Icon], i) => {
      const y = 30 + i * (SRC_H + SRC_GAP);
      addNode(id, n, d, "hiw-src", (g) => {
        svgEl("rect", { x: 20, y, width: SRC_W, height: SRC_H, rx: 10, class: "hiw-b" }, g);
        svgEl("rect", { x: 30, y: y + 12, width: 20, height: 20, rx: 5, class: "hiw-ico" }, g);
        mountIcon(g, Icon, 40, y + 22, 16, "var(--color-primary-500)", iconRoots);
        svgText(g, 60, y + 27, n, "hiw-t-title");
      });
      edge(id, "trunk", `M160,${y + SRC_H / 2} H180`, false, false, true);
    });
    const firstSrcCy = 30 + SRC_H / 2;
    const CORE_ENTRY_Y = 185;
    const trunkEdge = edge("trunk", "core", `M180,${firstSrcCy} V${CORE_ENTRY_Y} H228`);
    trunkEdge.fixed = true;

    addNode(
      "team0",
      "MIS Agent",
      "Works with Superatom AI through natural-language conversation.",
      "hiw-team",
      (g) => {
        svgEl("rect", { x: 375, y: 18, width: 130, height: 36, rx: 18, class: "hiw-b" }, g);
        svgText(g, 440, 41, "MIS Agent", "hiw-t-title", "middle").style.fill =
          "var(--color-primary-600)";
      },
    );
    const teamEdge = edge("team0", "core", "M440,56 V88", false, true);
    teamEdge.fixed = true;

    const coreG = svgEl("g", {}, nodeLayer);
    svgEl("rect", { x: 230, y: 90, width: 420, height: 190, rx: 12, class: "hiw-core-frame" }, coreG);
    svgText(coreG, 250, 117, "Superatom AI", "hiw-core-title").style.fontSize = "15px";

    const mods: [string, string, string, IconComponent, number, number][] = [
      ["tribal", "Tribal Knowledge", "Captures the experience and judgment calls your best planners already know.", PsychologyIcon, 250, 140],
      ["opt", "Optimization Engine", "Runs analytics and simulation to evaluate every alternative.", TuneIcon, 446, 140],
      ["genui", "Generative UI", "Builds the right chart, table or view for each question, on the fly.", AutoAwesomeIcon, 250, 206],
      ["sem", "Semantic Modeling", "Links entities and relationships across your enterprise data.", HubIcon, 446, 206],
    ];
    const MOD_W = 184;
    const MOD_H = 54;
    mods.forEach(([id, n, d, Icon, x, y]) => {
      addNode(id, n, d, "hiw-mod", (g) => {
        svgEl("rect", { x, y, width: MOD_W, height: MOD_H, rx: 8, class: "hiw-b" }, g);
        svgEl("rect", { x: x + 8, y: y + 17, width: 20, height: 20, rx: 5, class: "hiw-ico" }, g);
        mountIcon(g, Icon, x + 18, y + 27, 16, "var(--color-primary-500)", iconRoots);
        const t = svgText(g, x + 36, y + 31, n, "hiw-t-small");
        t.style.cssText = "fill:var(--color-heading);font-size:11.5px;font-weight:500";
      });
    });
    const modIds = mods.map((m) => m[0]);

    const srcIds = sources.map((s) => s[0]);
    function neighbours(id: string) {
      const ids = new Set([id]);
      const lit = new Set<Edge>();
      const key = modIds.includes(id) ? "core" : id;
      E.forEach((e) => {
        const hit = [e.from, e.to].includes(id) || [e.from, e.to].includes(key);
        if (hit) {
          lit.add(e);
          ids.add(e.from);
          ids.add(e.to);
        }
      });
      if (key === "core") modIds.forEach((m) => ids.add(m));
      if (srcIds.includes(id) || id === "trunk") {
        lit.add(trunkEdge);
        ids.add("trunk");
      }
      return { ids, lit };
    }
    function setMarkers(e: Edge, on: boolean) {
      if (e.noMarker) return;
      const m = e.out ? markerUrl("ao") : on ? markerUrl("al") : markerUrl("a");
      e.el.setAttribute("marker-end", m);
      if (e.both) e.el.setAttribute("marker-start", m);
    }
    function paint(ids: Set<string>, lit: Set<Edge>, pulse?: Set<string>) {
      svg!.classList.add("hiw-focus");
      Object.entries(N).forEach(([k, n]) => {
        n.g.classList.toggle("hiw-on", ids.has(k));
        n.g.classList.toggle("hiw-pulse", !!pulse && pulse.has(k) && !reduceMotion);
      });
      E.forEach((e) => {
        const on = lit.has(e);
        e.el.classList.toggle("hiw-lit", on);
        setMarkers(e, on);
        e.tk = on ? 1 : e.fixed ? 0.35 : 0.06;
      });
    }

    const stages: { ids: string[]; pulse: string[]; edges: (e: Edge) => boolean }[] = [
      { ids: srcIds, pulse: srcIds, edges: (e) => e.to === "trunk" || (e.from === "trunk" && e.to === "core") },
      { ids: modIds, pulse: modIds, edges: (e) => e.from === "team0" },
    ];
    const STEP_MS = reduceMotion ? 4500 : 3000;
    const HOLD_MS = 2400;
    let step = 0;

    function showStep(i: number) {
      const ids = new Set(["team0"]);
      const lit = new Set<Edge>([teamEdge]);
      for (let s = 0; s <= i; s++) {
        stages[s].ids.forEach((x) => ids.add(x));
        E.filter(stages[s].edges).forEach((e) => lit.add(e));
      }
      paint(ids, lit, new Set(stages[i].pulse));
      E.forEach((e) => {
        if (lit.has(e) && !stages[i].edges(e)) e.tk = 0.45;
      });
    }
    function schedule() {
      timers.forEach((t) => window.clearTimeout(t));
      const t = window.setTimeout(() => {
        if (mode !== "auto") return;
        if (step < stages.length - 1) {
          step++;
          showStep(step);
          schedule();
        } else {
          const t2 = window.setTimeout(() => {
            if (mode !== "auto") return;
            step = 0;
            showStep(0);
            schedule();
          }, HOLD_MS);
          timers.push(t2);
        }
      }, STEP_MS);
      timers.push(t);
    }
    function play(from?: number) {
      pinned = null;
      Object.values(N).forEach((n) => n.g.classList.remove("hiw-active"));
      if (typeof from === "number") step = from;
      mode = "auto";
      showStep(step);
      schedule();
    }
    const PIN_MS = 6000;
    function select(id: string) {
      timers.forEach((t) => window.clearTimeout(t));
      hoverFrom = null;
      Object.values(N).forEach((n) => n.g.classList.remove("hiw-active"));
      if (pinned === id) {
        play();
        return;
      }
      pinned = id;
      mode = "pinned";
      N[id].g.classList.add("hiw-active");
      const { ids, lit } = neighbours(id);
      paint(ids, lit, new Set([id]));
      const t = window.setTimeout(() => {
        if (mode === "pinned") play();
      }, PIN_MS);
      timers.push(t);
    }

    const realEdges = () => E;
    const tracks = realEdges().map((e) => {
      const len = e.el.getTotalLength();
      const pts: number[] = [];
      for (let s = 0; s <= len; s += 3) {
        const p = e.el.getPointAtLength(s);
        pts.push(p.x, p.y);
      }
      return { e, len, pts, n: Math.max(2, Math.round(len / 70)), seed: Math.random() };
    });
    function sample(tr: (typeof tracks)[number], s: number): [number, number] {
      s = Math.max(0, Math.min(tr.len, s));
      const i = Math.min((s / 3) | 0, tr.pts.length / 2 - 2);
      const f = (s - i * 3) / 3;
      return [
        tr.pts[i * 2] + (tr.pts[i * 2 + 2] - tr.pts[i * 2]) * f,
        tr.pts[i * 2 + 1] + (tr.pts[i * 2 + 3] - tr.pts[i * 2 + 1]) * f,
      ];
    }
    let resizeObserver: ResizeObserver | null = null;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: true, alpha: true });
    if (gl && !reduceMotion) {
      const vs = `attribute vec2 p;attribute float sz;attribute vec4 c;uniform float sc;varying vec4 vc;
        void main(){gl_Position=vec4(p.x/${VW}.0*2.0-1.0,1.0-p.y/${VH}.0*2.0,0.0,1.0);gl_PointSize=sz*sc;vc=c;}`;
      const fs = `precision mediump float;varying vec4 vc;
        void main(){float d=length(gl_PointCoord-0.5);float a=smoothstep(0.5,0.0,d);a=a*a*(3.0-2.0*a);gl_FragColor=vec4(vc.rgb,vc.a*a);}`;
      const sh = (t: number, src: string) => {
        const s = gl.createShader(t)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(prog);
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      const ST = 28;
      const aP = gl.getAttribLocation(prog, "p");
      const aS = gl.getAttribLocation(prog, "sz");
      const aC = gl.getAttribLocation(prog, "c");
      const uS = gl.getUniformLocation(prog, "sc");
      gl.enableVertexAttribArray(aP);
      gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, ST, 0);
      gl.enableVertexAttribArray(aS);
      gl.vertexAttribPointer(aS, 1, gl.FLOAT, false, ST, 8);
      gl.enableVertexAttribArray(aC);
      gl.vertexAttribPointer(aC, 4, gl.FLOAT, false, ST, 12);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      const PRIMARY: [number, number, number] = [0.325, 0.227, 0.992];
      const ACCENT: [number, number, number] = [1, 0.463, 0];
      const TRAIL = 9;
      const data = new Float32Array(
        tracks.reduce((a, t) => a + t.n, 0) * (TRAIL + 1) * 7,
      );
      function resize() {
        const r = stageEl!.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas!.width = Math.round(r.width * dpr);
        canvas!.height = Math.round(r.height * dpr);
        gl!.viewport(0, 0, canvas!.width, canvas!.height);
        gl!.uniform1f(uS, canvas!.width / VW);
      }
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(stageEl);
      resize();
      let last = performance.now();
      let clock = 0;
      const frame = (now: number) => {
        if (disposed) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        clock += dt;
        let o = 0;
        for (const tr of tracks) {
          const e = tr.e;
          e.k += (e.tk - e.k) * Math.min(1, dt * 3.2);
          const k = e.k;
          const col = e.out ? ACCENT : PRIMARY;
          const speed = 60 + 90 * k;
          for (let i = 0; i < tr.n; i++) {
            const rev = e.both && i % 2 === 1;
            const s = (clock * speed + (i / tr.n + tr.seed) * tr.len) % tr.len;
            const fade = Math.min(1, s / 16, (tr.len - s) / 16);
            const h = sample(tr, rev ? tr.len - s : s);
            data.set([h[0], h[1], 15 + 10 * k, col[0], col[1], col[2], 0.16 * k * fade], o);
            o += 7;
            for (let j = 0; j < TRAIL; j++) {
              const ss = s - j * 3;
              const q = sample(tr, rev ? tr.len - ss : ss);
              const f = 1 - j / TRAIL;
              data.set(
                [q[0], q[1], (2.6 + 4 * k) * (0.45 + 0.55 * f), col[0], col[1], col[2], (0.2 + 0.8 * k) * f * f * fade * (ss < 0 ? 0 : 1)],
                o,
              );
              o += 7;
            }
          }
        }
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, o), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.POINTS, 0, o / 7);
        rafId = requestAnimationFrame(frame);
      };
      rafId = requestAnimationFrame(frame);
    }

    play(0);

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      timers.forEach((t) => window.clearTimeout(t));
      resizeObserver?.disconnect();
      iconRoots.forEach((r) => r.unmount());
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
      <div className="hiw-card">
        <div className="hiw-scroll">
          <div className="hiw-flow">
            <div ref={stageRef} className="hiw-stage">
              <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`} role="img" aria-label="Superatom AI architecture" />
              <canvas ref={canvasRef} aria-hidden="true" />
            </div>
            <div className="hiw-connector" aria-hidden="true" />
            <ChatPanel />
          </div>
        </div>
      </div>
      <div ref={tipRef} className="hiw-tip" hidden />
    </div>
  );
}
