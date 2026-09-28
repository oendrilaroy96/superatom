import { useEffect, useRef, useState } from "react";
import { MdShield, MdLock, MdStorage, MdVpnKey } from "react-icons/md";
import type { IconType } from "react-icons";

const features: { title: string; desc: string; Icon: IconType }[] = [
  {
    title: "Security & Compliance",
    desc: "Enterprise-grade security controls with ISO 27001:2022 and SOC 2 Type I compliance, with continuous testing and monitoring.",
    Icon: MdShield,
  },
  {
    title: "End-to-End Encryption",
    desc: "Protect your data throughout its lifecycle with encryption in transit and at rest.",
    Icon: MdLock,
  },
  {
    title: "Data Privacy & Control",
    desc: "Maintain full control over your data, decisions and outputs with role-based access and governance controls.",
    Icon: MdStorage,
  },
  {
    title: "Enterprise SSO",
    desc: "SAML, OIDC and Active Directory integration for seamless and secure access across your organization.",
    Icon: MdVpnKey,
  },
];

const LAYERS: { name: string; outcome: string; side: "left" | "right" }[] = [
  { name: "Secure", outcome: "People", side: "right" },
  { name: "Governed", outcome: "Data", side: "left" },
  { name: "Scalable", outcome: "Decisions", side: "right" },
  { name: "Reliable", outcome: "A stronger tomorrow", side: "left" },
];

const VB_W = 640;
const VB_H = 400;
const CX = 320;
const BOX_W = 210;
const TOP_DEPTH = 24;
const FRONT_H = 54;
const GAP = 16;
const START_Y = 24;
const DOT_OFFSET = 60;
const LABEL_GAP = 12;
const LABEL_W = 148;

const LAYER_COLORS = [
  { top: "var(--color-accent-400)", left: "var(--color-accent-500)", right: "var(--color-accent-600)", opacity: 0.3 },
  { top: "var(--color-primary-400)", left: "var(--color-primary-500)", right: "var(--color-primary-600)", opacity: 0.26 },
  { top: "var(--color-primary-400)", left: "var(--color-primary-500)", right: "var(--color-primary-600)", opacity: 0.2 },
  { top: "var(--color-primary-400)", left: "var(--color-primary-500)", right: "var(--color-primary-600)", opacity: 0.14 },
];

function layerGeometry(i: number) {
  const topY = START_Y + i * (TOP_DEPTH + FRONT_H + GAP);
  const peak = { x: CX, y: topY };
  const left = { x: CX - BOX_W / 2, y: topY + TOP_DEPTH / 2 };
  const right = { x: CX + BOX_W / 2, y: topY + TOP_DEPTH / 2 };
  const bottom = { x: CX, y: topY + TOP_DEPTH };
  const frontLeftBottom = { x: left.x, y: left.y + FRONT_H };
  const frontRightBottom = { x: right.x, y: right.y + FRONT_H };
  const frontBottom = { x: CX, y: bottom.y + FRONT_H };
  const connectorY = left.y + FRONT_H / 2;
  return { peak, left, right, bottom, frontLeftBottom, frontRightBottom, frontBottom, connectorY };
}

function InfrastructureDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[640px] overflow-hidden rounded-2xl bg-secondary-600 px-4 py-6"
      style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {LAYERS.map((layer, i) => {
          const g = layerGeometry(i);
          const c = LAYER_COLORS[i];
          const topFace = `${g.peak.x} ${g.peak.y} ${g.right.x} ${g.right.y} ${g.bottom.x} ${g.bottom.y} ${g.left.x} ${g.left.y}`;
          const leftFace = `${g.left.x} ${g.left.y} ${g.bottom.x} ${g.bottom.y} ${g.frontBottom.x} ${g.frontBottom.y} ${g.frontLeftBottom.x} ${g.frontLeftBottom.y}`;
          const rightFace = `${g.bottom.x} ${g.bottom.y} ${g.right.x} ${g.right.y} ${g.frontRightBottom.x} ${g.frontRightBottom.y} ${g.frontBottom.x} ${g.frontBottom.y}`;
          return (
            <g
              key={layer.name}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(14px)",
                transformOrigin: `${CX}px ${g.peak.y}px`,
                transition: `opacity 0.55s ease ${0.12 * i}s, transform 0.55s ease ${0.12 * i}s`,
              }}
            >
              <polygon points={leftFace} fill={c.left} fillOpacity={c.opacity} stroke={c.left} strokeOpacity={0.55} strokeWidth={1} />
              <polygon points={rightFace} fill={c.right} fillOpacity={c.opacity} stroke={c.right} strokeOpacity={0.55} strokeWidth={1} />
              <polygon points={topFace} fill={c.top} fillOpacity={c.opacity + 0.08} stroke={c.top} strokeOpacity={0.7} strokeWidth={1} />
            </g>
          );
        })}

        {LAYERS.map((layer, i) => {
          const g = layerGeometry(i);
          const fromX = layer.side === "right" ? g.right.x : g.left.x;
          const toX =
            layer.side === "right" ? g.right.x + DOT_OFFSET : g.left.x - DOT_OFFSET;
          return (
            <g key={`${layer.name}-line`}>
              <line
                x1={fromX}
                y1={g.connectorY}
                x2={toX}
                y2={g.connectorY}
                stroke="var(--color-secondary-300)"
                strokeWidth={1.5}
                pathLength={1}
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: visible ? 0 : 1,
                  transition: `stroke-dashoffset 0.6s ease ${0.12 * i + 0.35}s`,
                }}
              />
              <circle
                cx={toX}
                cy={g.connectorY}
                r={3.5}
                fill="var(--color-primary-300)"
                style={{
                  opacity: visible ? 1 : 0,
                  transition: `opacity 0.4s ease ${0.12 * i + 0.7}s`,
                }}
              />
            </g>
          );
        })}
      </svg>

      {LAYERS.map((layer, i) => {
        const g = layerGeometry(i);
        const isRight = layer.side === "right";
        const dotX = isRight ? g.right.x + DOT_OFFSET : g.left.x - DOT_OFFSET;
        return (
          <div
            key={`${layer.name}-label`}
            className="absolute"
            style={{
              top: `${((g.connectorY - 26) / VB_H) * 100}%`,
              left: isRight
                ? `${((dotX + LABEL_GAP) / VB_W) * 100}%`
                : undefined,
              right: !isRight
                ? `${((VB_W - dotX + LABEL_GAP) / VB_W) * 100}%`
                : undefined,
              width: LABEL_W,
              textAlign: isRight ? "left" : "right",
              opacity: visible ? 1 : 0,
              transform: visible
                ? "translateX(0)"
                : `translateX(${isRight ? 8 : -8}px)`,
              transition: `opacity 0.5s ease ${0.12 * i + 0.75}s, transform 0.5s ease ${0.12 * i + 0.75}s`,
            }}
          >
            <p className="font-display text-[15px] font-bold text-white">
              {layer.name}
            </p>
            <p className="mt-1 text-[11.5px] leading-snug text-secondary-200">
              {layer.outcome}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function Infrastructure() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-10 xl:px-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-h5 font-semibold uppercase tracking-[0.5px] text-primary-500">
              Infrastructure
            </p>
            <h2 className="mt-3 font-display text-[22px] font-bold text-heading sm:text-h2">
              Enterprise-grade infrastructure for{" "}
              <span className="text-primary-500">real-world operations</span>
            </h2>
            <p className="text-p mt-4 max-w-md text-body">
              A secure, governed foundation built for the demands of modern
              enterprise supply chains.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-caption">
              <li>• Superatom AI sits inside your infrastructure</li>
              <li>• ISO 27001 and SOC 2 aligned</li>
              <li>• Enterprise SSO out of the box</li>
            </ul>
          </div>
          <InfrastructureDiagram />
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-secondary-100 p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-100 text-primary-500">
                <f.Icon size={22} />
              </span>
              <p className="text-h4 mt-4 font-display font-semibold text-heading">
                {f.title}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-caption">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
