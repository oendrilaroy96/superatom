import { useEffect, useRef } from "react";

const SOURCES = ["ERP", "WMS", "TMS", "Suppliers", "Demand", "Finance"];
const SCATTERED: [number, number][] = [
  [76, 70],
  [214, 330],
  [64, 250],
  [452, 62],
  [452, 318],
  [168, 128],
];
const CAPTIONS = [
  "Enterprise data sits in separate systems, each telling part of the story.",
  "Superatom AI bonds the sources together, like atoms forming a cluster.",
  "Connected, the data behaves as one unit and turns into actionable decisions.",
];

const CX = 300;
const CY = 190;
const ORBIT_R = 125;
const CORE_R = 58;
const NODE_R = 34;
const EASE = "cubic-bezier(.22,1,.36,1)";

/**
 * Six enterprise data sources scatter, orbit, and bond to a central
 * "Superatom AI" node before flowing out as "Decisions" — ported 1:1 from a
 * standalone prototype (see the paired keyframes/classes in index.css,
 * .satom-diag prefix). The choreography (node positions, bond dasharray
 * reveal, caption rotation) is imperative DOM work, not React state, so it
 * stays close to the original script; only the lookups are scoped to this
 * component's own container instead of `document`, and the mount/unmount
 * is made idempotent for StrictMode's dev double-invoke.
 */
export default function SuperatomDiagram() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ns = "http://www.w3.org/2000/svg";
    const $ = <T extends Element>(id: string) => root.querySelector(`#${id}`) as T;

    const orbit = SOURCES.map((_, i) => {
      const a = ((30 + i * 60) * Math.PI) / 180;
      return [CX + ORBIT_R * Math.cos(a), CY + ORBIT_R * Math.sin(a)] as [number, number];
    });

    const bondsGroup = $<SVGGElement>("bonds");
    const nodesGroup = $<SVGGElement>("nodes");
    const capEl = $<HTMLDivElement>("cap");
    const ringEl = $<SVGCircleElement>("ring");
    const haloEl = $<SVGCircleElement>("halo");
    const coreEl = $<SVGCircleElement>("core");
    const outEl = $<SVGGElement>("out");

    // Idempotent: clears anything a previous invocation (StrictMode's dev
    // double-mount) appended, so this never doubles up the nodes/bonds/caps.
    bondsGroup.innerHTML = "";
    nodesGroup.innerHTML = "";
    capEl.innerHTML = "";

    const bonds = orbit.map((p) => {
      const d = Math.hypot(p[0] - CX, p[1] - CY);
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", String(CX + ((p[0] - CX) * CORE_R) / d));
      line.setAttribute("y1", String(CY + ((p[1] - CY) * CORE_R) / d));
      line.setAttribute("x2", String(CX + ((p[0] - CX) * (d - NODE_R)) / d));
      line.setAttribute("y2", String(CY + ((p[1] - CY) * (d - NODE_R)) / d));
      line.setAttribute("pathLength", "1");
      line.setAttribute("stroke-dasharray", "1");
      line.style.strokeDashoffset = "1";
      bondsGroup.appendChild(line);
      return line;
    });

    const nodes = SOURCES.map((s, i) => {
      const g = document.createElementNS(ns, "g");
      g.setAttribute("class", "node");
      g.style.transitionDelay = `${i * 80}ms`;
      g.innerHTML =
        `<g class="flt" style="animation-delay:${i * -0.5}s"><circle r="${NODE_R}" stroke-width="2"/>` +
        `<text text-anchor="middle" dominant-baseline="central" fill="#061B31" font-size="14" font-weight="500">${s}</text></g>`;
      nodesGroup.appendChild(g);
      return g;
    });

    const spans = CAPTIONS.map((t) => {
      const s = document.createElement("span");
      s.textContent = t;
      capEl.appendChild(s);
      return s;
    });

    function setStage(st: number) {
      const connected = st >= 1;
      const unified = st === 2;
      nodes.forEach((g, i) => {
        const p = connected ? orbit[i] : SCATTERED[i];
        const inner = g.firstChild as SVGGElement;
        const circle = inner.querySelector("circle") as SVGCircleElement;
        g.style.transform = `translate(${p[0]}px,${p[1]}px)`;
        inner.setAttribute("class", connected ? "" : "flt");
        circle.setAttribute("fill", connected ? "#FFFFFF" : "#E5EDF5");
        circle.setAttribute("stroke", connected ? "#C9A8E8" : "#8792A2");
      });
      bonds.forEach((line, i) => {
        line.style.transition = `stroke-dashoffset .7s ${EASE} ${connected ? 500 + i * 90 : 0}ms`;
        line.style.strokeDashoffset = connected ? "0" : "1";
      });
      ringEl.setAttribute("opacity", connected ? ".55" : "0");
      haloEl.setAttribute("opacity", connected ? ".75" : "0");
      haloEl.setAttribute("class", `halo fade${unified ? " br" : ""}`);
      coreEl.setAttribute("opacity", connected ? "1" : ".55");
      outEl.style.transitionDelay = `${unified ? 300 : 0}ms`;
      outEl.setAttribute("opacity", unified ? "1" : "0");
      spans.forEach((s, k) => {
        s.className = k === st ? "on" : "";
      });
    }

    let stage = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    setStage(0);
    const tick = () => {
      timer = setTimeout(
        () => {
          if (cancelled) return;
          stage = (stage + 1) % 3;
          setStage(stage);
          tick();
        },
        stage === 2 ? 4800 : 3200,
      );
    };
    tick();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={rootRef} className="satom-diag">
      <div className="mx-auto flex flex-col gap-3 py-8">
        <svg viewBox="0 0 680 380" role="img" aria-labelledby="satom-diag-t satom-diag-d">
          <title id="satom-diag-t">Superatom AI: from fragmented data to decisions</title>
          <desc id="satom-diag-d">
            Six enterprise data sources move from scattered positions into orbit around Superatom AI,
            bond to it, and flow out as better, faster decisions.
          </desc>
          <defs>
            <marker
              id="satom-diag-arrow"
              viewBox="0 0 10 10"
              refX={8}
              refY={5}
              markerWidth={8}
              markerHeight={8}
              orient="auto-start-reverse"
            >
              <path
                d="M2 1L8 5L2 9"
                fill="none"
                stroke="#EA2261"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
          </defs>
          <circle
            id="ring"
            className="spin fade"
            cx={CX}
            cy={CY}
            r={ORBIT_R}
            fill="none"
            stroke="#533AFD"
            strokeWidth={1.25}
            strokeDasharray="7 7"
            opacity={0}
          />
          <circle id="halo" className="halo fade" cx={CX} cy={CY} r={76} fill="#8E8CC2" opacity={0} />
          <g id="bonds" stroke="#7B6CFF" strokeWidth={2.5} strokeLinecap="round" />
          <circle id="core" className="fade" cx={CX} cy={CY} r={CORE_R} fill="#533AFD" opacity={0.55} />
          <text x={CX} y={CY} textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize={16} fontWeight={600}>
            Superatom AI
          </text>
          <g id="out" className="fade" opacity={0}>
            <line
              className="flow"
              x1={366}
              y1={190}
              x2={494}
              y2={190}
              stroke="#EA2261"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray="0.5 9.5"
              markerEnd="url(#satom-diag-arrow)"
            />
            <rect x={500} y={158} width={148} height={64} rx={12} fill="#FFD7EF" />
            <text x={574} y={180} textAnchor="middle" dominantBaseline="central" fill="#061B31" fontSize={16} fontWeight={600}>
              Decisions
            </text>
            <text x={574} y={202} textAnchor="middle" dominantBaseline="central" fill="#533AFD" fontSize={13.5} fontWeight={500}>
              Better, faster
            </text>
          </g>
          <g id="nodes" />
        </svg>
        <div className="cap" id="cap" aria-live="polite" />
      </div>
    </div>
  );
}
